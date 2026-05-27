"use client"
import React, { useState } from 'react';
import { User, Phone, Plus, CheckCircle2, XCircle, Loader2, Search, UserCheck } from 'lucide-react';

const EMPTY_FORM = { first_name: '', last_name: '', phone_number: '', sector: '' };

export default function DriversPanel({ drivers, loading, onRefresh }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [query, setQuery] = useState('');

  const filtered = (drivers || []).filter(d =>
    (d.name || '').toLowerCase().includes(query.toLowerCase()) ||
    (d.phone_number || '').includes(query)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    try {
      const uid = localStorage.getItem('user_id');
      const res = await fetch(`http://127.0.0.1:8000/courier/drivers/register`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Registration failed.');
      setForm(EMPTY_FORM);
      setShowForm(false);
      onRefresh();
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search drivers..."
            className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-[11px] text-white placeholder:text-white/20 outline-none focus:border-[#08CB00]/50"
          />
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#08CB00] text-black rounded-xl text-[11px] font-black uppercase tracking-wider hover:bg-[#08CB00]/80 transition-colors shrink-0"
        >
          <Plus size={13} /> Register Driver
        </button>
      </div>

      {/* Registration Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white/[0.02] border border-white/10 rounded-[24px] p-5 space-y-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">New Driver Registration</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'first_name', label: 'First Name', type: 'text', required: true },
              { key: 'last_name', label: 'Last Name', type: 'text', required: true },
              { key: 'phone_number', label: 'Phone', type: 'tel', required: false },
              { key: 'sector', label: 'Sector', type: 'text', required: false },
            ].map(f => (
              <div key={f.key}>
                <label className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1 block">{f.label}</label>
                <input
                  type={f.type}
                  required={f.required}
                  value={form[f.key]}
                  onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-[11px] text-white outline-none focus:border-[#08CB00]/50"
                />
              </div>
            ))}
          </div>
          {saveError && (
            <p className="text-[10px] text-red-400 font-bold">{saveError}</p>
          )}
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[11px] font-black text-white/50 hover:bg-white/10 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#08CB00] text-black rounded-xl text-[11px] font-black uppercase tracking-wider hover:bg-[#08CB00]/80 transition-colors disabled:opacity-50">
              {saving ? <><Loader2 size={12} className="animate-spin" /> Saving...</> : 'Register'}
            </button>
          </div>
        </form>
      )}

      {/* Driver List */}
      {loading ? (
        <div className="flex items-center justify-center py-12 gap-2">
          <Loader2 size={16} className="text-[#08CB00] animate-spin" />
          <span className="text-[10px] text-white/30">Loading drivers...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-2">
          <UserCheck size={28} className="text-white/10" />
          <p className="text-[10px] text-white/20">No drivers registered yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((d, i) => (
            <div key={d.id || i} className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-white/15 transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                <User size={16} className="text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-white truncate">{d.name}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  {d.phone_number && <span className="flex items-center gap-1 text-[9px] text-white/30"><Phone size={9} />{d.phone_number}</span>}
                  {d.sector && <span className="text-[9px] text-white/20">{d.sector}</span>}
                </div>
              </div>
              <div className="text-right shrink-0 space-y-1">
                <span className={`inline-flex items-center gap-1 text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                  d.status === 'active' ? 'bg-[#08CB00]/10 text-[#08CB00]' : d.status === 'in_transit' ? 'bg-blue-500/10 text-blue-400' : 'bg-white/5 text-white/30'
                }`}>
                  {d.status === 'active' ? <CheckCircle2 size={8} /> : <XCircle size={8} />}
                  {d.status_display || d.status}
                </span>
                <p className="text-[9px] text-white/20">{d.total_rides} rides · {d.efficiency_pct}%</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
