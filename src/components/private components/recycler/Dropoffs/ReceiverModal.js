"use client"
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Users, Plus, Pencil, Trash2, CheckCircle2, Phone, Shield, Loader2, AlertTriangle } from 'lucide-react';

const ROLES = ['Site Manager', 'Collector', 'Supervisor', 'Security'];

const EMPTY_FORM = { name: '', phone: '', role: 'Collector', active: true };

export default function ReceiverModal({ site, receivers: initialReceivers, onClose, onSave }) {
  const [mode, setMode] = useState('list'); // 'list' | 'add' | 'edit'
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [localReceivers, setLocalReceivers] = useState(initialReceivers || []);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch receivers from API on mount
  useEffect(() => {
    if (!site?.id) {
      setLoading(false);
      return;
    }
    fetch(`http://127.0.0.1:8000/recycler/drop-off-points/${site.id}/receivers`, { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.receivers) setLocalReceivers(data.receivers);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [site?.id]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const startAdd = () => { setForm(EMPTY_FORM); setEditTarget(null); setMode('add'); };
  const startEdit = (rx) => { setForm({ name: rx.name, phone: rx.phone, role: rx.role, active: rx.active }); setEditTarget(rx); setMode('edit'); };

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const handleFormSave = async () => {
    setSaving(true);
    setSaveError(null);

    try {
      let updated;

      if (mode === 'edit' && editTarget) {
        // Edit mode: call PUT API
        const res = await fetch(
          `http://127.0.0.1:8000/recycler/drop-off-points/receivers/${editTarget.id}/update`,
          {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: form.name,
              phone: form.phone,
              role: form.role,
              active: form.active,
            }),
          }
        );
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Failed to update receiver');
        }
        updated = localReceivers.map(r =>
          r.id === editTarget.id ? { ...r, ...form } : r
        );
      } else {
        // Add mode: call POST API
        const res = await fetch(
          `http://127.0.0.1:8000/recycler/drop-off-points/${site.id}/receivers/add`,
          {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: form.name,
              phone: form.phone,
              // role: form.role,
              active: form.active,
            }),
          }
        );
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Failed to add receiver');
        }
        const newReceiver = { ...form, id: data.id, site_id: site.id };
        updated = [...localReceivers, newReceiver];
      }

      setLocalReceivers(updated);
      if (onSave) onSave(updated);
      setSaved(true);
      setTimeout(() => { setSaved(false); setMode('list'); }, 600);
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/recycler/drop-off-points/receivers/${id}/delete`,
        { method: 'DELETE', credentials: 'include' }
      );
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete receiver');
      }
      const updated = localReceivers.filter(rx => rx.id !== id);
      setLocalReceivers(updated);
      if (onSave) onSave(updated);
    } catch (err) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleClose = () => {
    if (onSave) onSave(localReceivers);
    onClose();
  };

  const inputCls = "w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2.5 text-[11px] text-white placeholder:text-white/20 outline-none focus:border-[#08CB00]/60 transition-all";

  return (
    createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={handleClose} />
      <div className="relative bg-[#0a0a0a] border border-white/10 rounded-[40px] p-8 max-w-md w-full max-h-[85vh] flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#08CB00]/10 rounded-2xl">
              <Users size={18} className="text-[#08CB00]" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Manage Receivers</h3>
              <p className="text-[9px] text-white/30">{site?.name}</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 text-white/40 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* ── LIST VIEW ── */}
        {mode === 'list' && (
          <>
            <div className="flex-1 overflow-y-auto scrollbar-thin space-y-2 min-h-0">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Loader2 size={28} className="text-[#08CB00] animate-spin mb-3" />
                  <p className="text-xs text-white/30">Loading receivers...</p>
                </div>
              ) : localReceivers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Users size={32} className="text-white/10 mb-3" />
                  <p className="text-xs text-white/20">No receivers assigned to this site</p>
                </div>
              ) : localReceivers.map(rx => (
                <div key={rx.id} className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-2xl group">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black shrink-0 ${rx.active ? 'bg-[#08CB00]/10 text-[#08CB00]' : 'bg-white/5 text-white/20'}`}>
                    {rx.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-black text-white truncate">{rx.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[8px] text-white/30 flex items-center gap-1"><Shield size={9} />{rx.role}</span>
                      <span className="text-white/10">·</span>
                      <span className="text-[8px] text-white/30 flex items-center gap-1"><Phone size={9} />{rx.phone}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <div className={`w-2 h-2 rounded-full ${rx.active ? 'bg-[#08CB00]' : 'bg-white/20'}`} />
                    <button onClick={() => startEdit(rx)} className="p-1.5 rounded-lg bg-white/5 text-white/30 hover:text-[#08CB00] hover:bg-[#08CB00]/10 transition-all">
                      <Pencil size={12} />
                    </button>
                    <button
                      onClick={() => handleDelete(rx.id)}
                      disabled={deletingId === rx.id}
                      className="p-1.5 rounded-lg bg-white/5 text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
                    >
                      {deletingId === rx.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6 shrink-0">
              <button onClick={handleClose} className="flex-1 py-3 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-black text-white/50 hover:bg-white/10 transition-all">
                Done
              </button>
              <button onClick={startAdd} className="flex-1 py-3 bg-[#08CB00] text-black rounded-2xl text-[11px] font-black uppercase tracking-wider hover:bg-[#08CB00]/80 transition-all flex items-center justify-center gap-2">
                <Plus size={14} strokeWidth={3} /> Add Receiver
              </button>
            </div>
          </>
        )}

        {/* ── ADD / EDIT FORM ── */}
        {(mode === 'add' || mode === 'edit') && (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto scrollbar-thin min-h-0">
              <p className="text-[8px] font-black uppercase tracking-widest text-white/20">
                {mode === 'edit' ? 'Edit Receiver' : 'New Receiver'}
              </p>

              <div className="space-y-1.5">
                <label className="text-[8px] font-black uppercase text-white/40 tracking-widest">Full Name</label>
                <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Tendai Moyo" className={inputCls} />
              </div>

              <div className="space-y-1.5">
                <label className="text-[8px] font-black uppercase text-white/40 tracking-widest">Phone Number</label>
                <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+263 77 123 4567" className={inputCls} />
              </div>

              <div className="space-y-1.5">
                <label className="text-[8px] font-black uppercase text-white/40 tracking-widest">Role</label>
                <div className="flex flex-wrap gap-2">
                  {ROLES.map(r => (
                    <button
                      key={r}
                      onClick={() => set('role', r)}
                      className={`px-3 py-1.5 rounded-xl text-[9px] font-bold border transition-all ${
                        form.role === r
                          ? 'bg-[#08CB00] border-[#08CB00] text-black'
                          : 'bg-white/5 border-white/10 text-white/40 hover:border-white/30'
                      }`}
                    >{r}</button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                <div>
                  <p className="text-[11px] font-black text-white">Active Status</p>
                  <p className="text-[9px] text-white/30">Receiver can accept drop-offs</p>
                </div>
                <button
                  onClick={() => set('active', !form.active)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${form.active ? 'bg-[#08CB00]' : 'bg-white/10'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${form.active ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              {/* Default password notice for new receivers */}
              {mode === 'add' && (
                <div className="p-3 bg-[#08CB00]/5 border border-[#08CB00]/20 rounded-xl flex items-start gap-2">
                  <Shield size={14} className="text-[#08CB00] shrink-0 mt-0.5" />
                  <p className="text-[10px] text-white/50">
                    New receivers are created with the default password{' '}
                    <span className="font-black text-[#08CB00]">GreenHoop2025!</span>
                    {' '}— remind them to change it after first login.
                  </p>
                </div>
              )}

              {/* Save error */}
              {saveError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2">
                  <AlertTriangle size={14} className="text-red-400 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-red-400">{saveError}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6 shrink-0">
              <button onClick={() => setMode('list')} disabled={saving} className="flex-1 py-3 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-black text-white/50 hover:bg-white/10 transition-all disabled:opacity-50">
                Back
              </button>
              <button
                onClick={handleFormSave}
                disabled={saving}
                className={`flex-1 py-3 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${
                  saved ? 'bg-[#08CB00]/20 text-[#08CB00] border border-[#08CB00]/30' : 'bg-[#08CB00] text-black hover:bg-[#08CB00]/80'
                }`}
              >
                {saving ? (
                  <><Loader2 size={14} className="animate-spin" /> {mode === 'edit' ? 'Saving...' : 'Adding...'}</>
                ) : saved ? (
                  <><CheckCircle2 size={14} /> Saved!</>
                ) : (
                  mode === 'edit' ? 'Save Changes' : 'Add Receiver'
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  )
  );
}
