"use client"
import React, { useState, useEffect } from 'react';
import {
  MapPin, Building2, Clock, Users, Pencil, Trash2,
  AlertTriangle, CheckCircle2, Package, ChevronRight, Activity, Layers,
  Loader2
} from 'lucide-react';
import { STATUS_COLORS } from './dropoffConstants';

export default function SiteDetailPanel({ site, onEdit, onDelete, onManageReceivers }) {
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [receivers, setReceivers] = useState([]);
  const [loadingReceivers, setLoadingReceivers] = useState(false);

  // Fetch receivers from API when site changes
  useEffect(() => {
    if (!site?.id) {
      setReceivers([]);
      return;
    }
    setLoadingReceivers(true);
    fetch(`http://127.0.0.1:8000/recycler/drop-off-points/${site.id}/receivers`, { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(data => setReceivers(data?.receivers || []))
      .catch(() => setReceivers([]))
      .finally(() => setLoadingReceivers(false));
  }, [site?.id]);

  const handleDelete = async () => {
    if (!site?.id) return;
    setDeleting(true);
    setDeleteError(null);

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/recycler/drop-off-points/${site.id}/delete`,
        { method: 'DELETE', credentials: 'include' }
      );
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete site');
      }

      onDelete(site.id);
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  if (!site) {
    return (
      <div className="h-full bg-white/[0.02] border border-white/5 rounded-[40px] p-6 flex flex-col items-center justify-center text-center">
        <MapPin size={32} className="text-white/10 mb-3" />
        <p className="text-xs font-bold text-white/20">Select a drop-off site to view details</p>
      </div>
    );
  }

  const sc = STATUS_COLORS[site.status] || STATUS_COLORS.Inactive;
  const loadPct = Math.round((site.current_load_kg / site.capacity_kg) * 100);
  const circumference = 2 * Math.PI * 38;
  const dashOffset = circumference - (loadPct / 100) * circumference;
  const loadColor = loadPct >= 90 ? '#EF4444' : loadPct >= 70 ? '#EAB308' : '#08CB00';

  return (
    <div className="h-full flex flex-col gap-4">
      {/* TOP: Site identity + donut load */}
      <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-6 flex flex-col gap-4 shrink-0">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-black text-white">{site.name}</h3>
            <p className="text-[9px] text-white/30 mt-1 flex items-center gap-1">
              <MapPin size={10} /> {site.address}
            </p>
          </div>
          <span className={`text-[9px] font-black px-2 py-1 rounded-xl ${sc.bg} ${sc.text} border ${sc.border}`}>
            {site.status}
          </span>
        </div>

        {/* Load donut + stats */}
        <div className="flex items-center gap-5">
          <div className="relative w-24 h-24 shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="38" fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="10" />
              <circle
                cx="50" cy="50" r="38" fill="none"
                stroke={loadColor} strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-xl font-black" style={{ color: loadColor }}>{loadPct}%</p>
              <p className="text-[7px] text-white/30 uppercase">Load</p>
            </div>
          </div>

          <div className="flex-1 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-white/30">Current</span>
              <span className="font-black text-white">{site.current_load_kg.toLocaleString()} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/30">Capacity</span>
              <span className="font-black text-white">{site.capacity_kg.toLocaleString()} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/30">Hours</span>
              <span className="font-black text-white flex items-center gap-1"><Clock size={10} />{site.operating_hours}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/30">Geofence</span>
              <span className="font-black text-white">{site.geofence_radius}m radius</span>
            </div>
          </div>
        </div>

        {/* Delete error */}
        {deleteError && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2">
            <AlertTriangle size={14} className="text-red-400 shrink-0 mt-0.5" />
            <p className="text-[10px] text-red-400">{deleteError}</p>
          </div>
        )}

        {/* Accepted categories */}
        <div>
          <p className="text-[8px] font-bold text-white/30 uppercase tracking-wider mb-2">Accepted Categories</p>
          <div className="flex flex-wrap gap-1.5">
            {site.accepted_categories?.map(cat => (
              <span key={cat} className="text-[8px] font-bold px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-white/50">{cat}</span>
            ))}
          </div>
        </div>

        {/* Coords */}
        <div className="flex items-center gap-2 text-[9px] font-mono text-white/30">
          <MapPin size={10} className="text-[#08CB00]" />
          {site.latitude.toFixed(4)}, {site.longitude.toFixed(4)}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => onManageReceivers(site)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-white/60 hover:bg-white/10 hover:text-white transition-all"
          >
            <Users size={13} /> Receivers ({receivers.length})
          </button>
          <button
            onClick={() => onEdit(site)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#08CB00]/10 border border-[#08CB00]/30 rounded-xl text-[10px] font-black text-[#08CB00] hover:bg-[#08CB00]/20 transition-all"
          >
            <Pencil size={13} /> Edit Site
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="py-2.5 px-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 hover:bg-red-500/20 transition-all disabled:opacity-50"
            title={deleteError || 'Delete site'}
          >
            {deleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
          </button>
        </div>
      </div>

      {/* BOTTOM: Receivers list */}
      <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-[40px] p-6 flex flex-col overflow-hidden min-h-0">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <div className="flex items-center gap-2">
            <Users size={14} className="text-[#08CB00]" />
            <h3 className="text-[10px] font-black uppercase tracking-widest text-white/60">Receivers</h3>
          </div>
          <button
            onClick={() => onManageReceivers(site)}
            className="text-[8px] font-black text-white/30 hover:text-white flex items-center gap-1 transition-all"
          >
            Manage <ChevronRight size={10} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin space-y-2">
          {loadingReceivers ? (
            <div className="flex items-center justify-center py-6 gap-2">
              <Loader2 size={14} className="text-[#08CB00] animate-spin" />
              <span className="text-[10px] text-white/30">Loading receivers...</span>
            </div>
          ) : receivers.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-[10px] text-white/20">No receivers assigned</p>
            </div>
          ) : receivers.map(rx => (
            <div key={rx.id} className="flex items-center gap-3 p-3 bg-black/20 border border-white/5 rounded-2xl">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${rx.active ? 'bg-[#08CB00]/10 text-[#08CB00]' : 'bg-white/5 text-white/20'}`}>
                {rx.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-black text-white truncate">{rx.name}</p>
                <p className="text-[8px] text-white/30">{rx.role} · {rx.phone}</p>
              </div>
              <div className={`w-2 h-2 rounded-full shrink-0 ${rx.active ? 'bg-[#08CB00]' : 'bg-white/20'}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}