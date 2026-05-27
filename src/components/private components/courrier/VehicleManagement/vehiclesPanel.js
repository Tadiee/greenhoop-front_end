"use client"
import React, { useState } from 'react';
import { Truck, Plus, Loader2, Search, Weight, Fuel } from 'lucide-react';

const EMPTY_FORM = { vehicle_id_tag: '', make_model: '', registration_plate: '', vehicle_type: 'city_sprinter', max_weight_capacity_kg: '', battery_pct: 100 };
const VEHICLE_TYPES = ['heavy_hauler', 'city_sprinter', 'cargo_van', 'motorcycle', 'bicycle'];
const TYPE_LABELS = { heavy_hauler: 'Heavy Hauler', city_sprinter: 'City Sprinter', cargo_van: 'Cargo Van', motorcycle: 'Motorcycle', bicycle: 'Bicycle' };

const TYPE_COLOR = {
  heavy_hauler: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  city_sprinter: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  cargo_van: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  motorcycle: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  bicycle: 'text-white/60 bg-white/5 border-white/10',
};

export default function VehiclesPanel({ vehicles, loading, onRefresh }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [query, setQuery] = useState('');

  const filtered = (vehicles || []).filter(v =>
    (v.vehicle_id_tag || '').toLowerCase().includes(query.toLowerCase()) ||
    (v.make_model || '').toLowerCase().includes(query.toLowerCase()) ||
    (v.registration_plate || '').toLowerCase().includes(query.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    try {
      const uid = localStorage.getItem('user_id');
      const res = await fetch('http://127.0.0.1:8000/courier/vehicles/register', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, max_weight_capacity_kg: parseFloat(form.max_weight_capacity_kg) || 50, battery_pct: parseInt(form.battery_pct) || 100 }),
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
            placeholder="Search vehicles..."
            className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-[11px] text-white placeholder:text-white/20 outline-none focus:border-[#08CB00]/50"
          />
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#08CB00] text-black rounded-xl text-[11px] font-black uppercase tracking-wider hover:bg-[#08CB00]/80 transition-colors shrink-0"
        >
          <Plus size={13} /> Add Vehicle
        </button>
      </div>

      {/* Registration Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white/[0.02] border border-white/10 rounded-[24px] p-5 space-y-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">Register New Vehicle</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'vehicle_id_tag', label: 'Vehicle ID Tag', type: 'text' },
              { key: 'make_model', label: 'Make & Model', type: 'text' },
              { key: 'registration_plate', label: 'Registration Plate', type: 'text' },
              { key: 'max_weight_capacity_kg', label: 'Max Load (kg)', type: 'number' },
              { key: 'battery_pct', label: 'Battery %', type: 'number' },
            ].map(f => (
              <div key={f.key}>
                <label className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1 block">{f.label}</label>
                <input
                  type={f.type}
                  required={f.key !== 'registration_plate'}
                  value={form[f.key]}
                  onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-[11px] text-white outline-none focus:border-[#08CB00]/50"
                />
              </div>
            ))}
            <div>
              <label className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1 block">Vehicle Type</label>
              <select
                value={form.vehicle_type}
                onChange={e => setForm(v => ({ ...v, vehicle_type: e.target.value }))}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-[11px] text-white outline-none focus:border-[#08CB00]/50"
              >
                {VEHICLE_TYPES.map(t => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
              </select>
            </div>
          </div>
          {saveError && <p className="text-[10px] text-red-400 font-bold">{saveError}</p>}
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

      {/* Vehicle List */}
      {loading ? (
        <div className="flex items-center justify-center py-12 gap-2">
          <Loader2 size={16} className="text-[#08CB00] animate-spin" />
          <span className="text-[10px] text-white/30">Loading vehicles...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-2">
          <Truck size={28} className="text-white/10" />
          <p className="text-[10px] text-white/20">No vehicles registered yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((v, i) => {
            const typeClass = TYPE_COLOR[v.vehicle_type] || TYPE_COLOR.city_sprinter;
            return (
              <div key={v.id || i} className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-white/15 transition-all">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${typeClass}`}>
                  <Truck size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-black text-white">{v.vehicle_id_tag}</p>
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${typeClass}`}>{v.vehicle_type_display || TYPE_LABELS[v.vehicle_type] || v.vehicle_type}</span>
                  </div>
                  <p className="text-[9px] text-white/30 mt-0.5">{v.make_model} {v.registration_plate && `· ${v.registration_plate}`}</p>
                </div>
                <div className="text-right shrink-0 space-y-1">
                  <div className="flex items-center gap-1 justify-end text-[9px] text-white/30">
                    <Weight size={9} /> {v.max_weight_capacity_kg ?? '—'}kg
                  </div>
                  <div className="flex items-center gap-1 justify-end text-[9px] text-white/30">
                    <Fuel size={9} /> {v.battery_pct ?? '—'}%
                  </div>
                  <span className={`inline-block text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                    v.status === 'active' ? 'bg-[#08CB00]/10 text-[#08CB00]' : v.status === 'maintenance' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-white/5 text-white/30'
                  }`}>
                    {v.status_display || v.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
