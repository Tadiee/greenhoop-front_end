"use client"
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, MapPin, Settings2, CheckCircle2, Plus, Crosshair, Loader2, AlertTriangle } from 'lucide-react';
import { SITE_STATUSES, ACCEPTED_CATEGORIES } from './dropoffConstants';

const EMPTY_FORM = {
  name: '',
  address: '',
  latitude: '',
  longitude: '',
  status: 'Active',
  capacity_kg: '',
  operating_hours: '',
  geofence_radius: '',
  accepted_categories: [],
  notes: '',
};

const inputCls = "w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2.5 text-[11px] text-white placeholder:text-white/20 outline-none focus:border-[#08CB00]/60 transition-all";

const Field = ({ label, children }) => (
  <div className="space-y-1.5">
    <label className="text-[8px] font-black uppercase text-white/40 tracking-widest">{label}</label>
    {children}
  </div>
);

export default function SiteFormModal({ site, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const isEdit = !!site;

  useEffect(() => {
    if (site) {
      setForm({
        name: site.name || '',
        address: site.address || '',
        latitude: site.latitude?.toString() || '',
        longitude: site.longitude?.toString() || '',
        status: site.status || 'Active',
        capacity_kg: site.capacity_kg?.toString() || '',
        operating_hours: site.operating_hours || '',
        geofence_radius: site.geofence_radius?.toString() || '',
        accepted_categories: site.accepted_categories || [],
        notes: site.notes || '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [site]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const toggleCategory = (cat) => {
    setForm(f => ({
      ...f,
      accepted_categories: f.accepted_categories.includes(cat)
        ? f.accepted_categories.filter(c => c !== cat)
        : [...f.accepted_categories, cat],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    const payload = {
      name: form.name,
      address: form.address,
      latitude: parseFloat(form.latitude) || null,
      longitude: parseFloat(form.longitude) || null,
      status: form.status, // API will lowercase this
      capacity_kg: parseInt(form.capacity_kg) || 0,
      current_load_kg: 0,
      operating_hours: form.operating_hours,
      geofence_radius: parseInt(form.geofence_radius) || 500,
      accepted_categories: form.accepted_categories,
      notes: form.notes,
    };

    try {
      const url = isEdit
        ? `http://127.0.0.1:8000/recycler/drop-off-points/${site.id}/update`
        : 'http://127.0.0.1:8000/recycler/drop-off-points/create';

      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || `Failed to ${isEdit ? 'update' : 'create'} drop-off site`);
      }

      setSaved(true);
      setTimeout(() => {
        onSave({ ...payload, id: data.drop_off_id || site?.id, drop_off_id: data.drop_off_id || site?.drop_off_id });
        setSaved(false);
        onClose();
      }, 600);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-[#0a0a0a] border border-white/10 rounded-[40px] p-8 max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#08CB00]/10 rounded-2xl">
              <Settings2 size={18} className="text-[#08CB00]" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">{isEdit ? 'Edit Drop-Off Site' : 'Register New Site'}</h3>
              <p className="text-[9px] text-white/30">{isEdit ? `Editing: ${site.name}` : 'Add a new drop-off point to your network'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-white/40 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto scrollbar-thin space-y-5 pr-1">
          {/* Section 1: Identity */}
          <div>
            <p className="text-[8px] font-black uppercase tracking-widest text-white/20 mb-3">01 · Site Identity</p>
            <div className="space-y-3">
              <Field label="Site Name">
                <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Mbare Central Hub" className={inputCls} />
              </Field>
              <Field label="Physical Address">
                <div className="relative">
                  <input value={form.address} onChange={e => set('address', e.target.value)} placeholder="e.g. 14 Remembrance Drive, Mbare, Harare" className={`${inputCls} pr-9`} />
                  <MapPin size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20" />
                </div>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Latitude">
                  <input value={form.latitude} onChange={e => set('latitude', e.target.value)} placeholder="-17.8252" className={`${inputCls} font-mono`} />
                </Field>
                <Field label="Longitude">
                  <input value={form.longitude} onChange={e => set('longitude', e.target.value)} placeholder="31.0335" className={`${inputCls} font-mono`} />
                </Field>
              </div>
            </div>
          </div>

          {/* Section 2: Operations */}
          <div>
            <p className="text-[8px] font-black uppercase tracking-widest text-white/20 mb-3">02 · Operations</p>
            <div className="space-y-3">
              <Field label="Status">
                <div className="flex gap-2 flex-wrap">
                  {SITE_STATUSES.map(s => (
                    <button
                      key={s}
                      onClick={() => set('status', s)}
                      className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase border transition-all ${
                        form.status === s
                          ? 'bg-[#08CB00] border-[#08CB00] text-black'
                          : 'bg-white/5 border-white/10 text-white/40 hover:border-white/30'
                      }`}
                    >{s}</button>
                  ))}
                </div>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Capacity (kg)">
                  <input type="number" value={form.capacity_kg} onChange={e => set('capacity_kg', e.target.value)} placeholder="2500" className={inputCls} />
                </Field>
                <Field label="Geofence Radius (m)">
                  <input type="number" value={form.geofence_radius} onChange={e => set('geofence_radius', e.target.value)} placeholder="500" className={inputCls} />
                </Field>
              </div>
              <Field label="Operating Hours">
                <input value={form.operating_hours} onChange={e => set('operating_hours', e.target.value)} placeholder="08:00 - 18:00" className={inputCls} />
              </Field>
            </div>
          </div>

          {/* Section 3: Accepted Categories */}
          <div>
            <p className="text-[8px] font-black uppercase tracking-widest text-white/20 mb-3">03 · Accepted E-Waste Categories</p>
            <div className="flex flex-wrap gap-2">
              {ACCEPTED_CATEGORIES.map(cat => {
                const sel = form.accepted_categories.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-[9px] font-bold border transition-all ${
                      sel
                        ? 'bg-[#08CB00]/10 border-[#08CB00]/40 text-[#08CB00]'
                        : 'bg-white/5 border-white/10 text-white/40 hover:border-white/30'
                    }`}
                  >
                    {sel && <span className="mr-1">✓</span>}{cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Notes */}
          <div>
            <p className="text-[8px] font-black uppercase tracking-widest text-white/20 mb-3">04 · Notes</p>
            <textarea
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              rows={3}
              placeholder="Any additional notes about this site..."
              className={`${inputCls} resize-none`}
            />
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2">
            <AlertTriangle size={14} className="text-red-400" />
            <p className="text-[10px] font-bold text-red-400">{error}</p>
          </div>
        )}

        {/* Footer */}
        <div className="flex gap-3 mt-6 shrink-0">
          <button onClick={onClose} disabled={saving} className="flex-1 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-black text-white/60 hover:bg-white/10 transition-all disabled:opacity-50">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex-1 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${
              saved ? 'bg-[#08CB00]/20 text-[#08CB00] border border-[#08CB00]/30' : 'bg-[#08CB00] text-black hover:bg-[#08CB00]/80'
            }`}
          >
            {saving ? (
              <><Loader2 size={14} className="animate-spin" /> {isEdit ? 'Saving...' : 'Creating...'}</>
            ) : saved ? (
              <><CheckCircle2 size={14} /> Saved!</>
            ) : (
              <><Plus size={14} /> {isEdit ? 'Save Changes' : 'Register Site'}</>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}