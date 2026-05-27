"use client"
import React, { useState, useEffect } from 'react';
import { Building2, Plus, Search, Pencil, Trash2, Users, MapPin, Loader2 } from 'lucide-react';
import { STATUS_COLORS } from './dropoffConstants';

export default function DropoffSitesList({ selectedSite, onSelect, onAdd, onEdit, onDelete, onManageReceivers }) {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // Normalize API status to match STATUS_COLORS keys
  const normalizeStatus = (status) => {
    if (!status) return 'Inactive';
    const normalized = status.toLowerCase();
    const map = {
      'active': 'Active',
      'inactive': 'Inactive',
      'maintenance': 'Maintenance',
      'full': 'Full',
    };
    return map[normalized] || 'Inactive';
  };

  useEffect(() => {
    fetch('http://127.0.0.1:8000/recycler/drop-off-points', { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        const apiSites = (data?.drop_off_sites || []).map(s => ({
          ...s,
          id: s.drop_off_id, // Map API field to component expected field
          status: normalizeStatus(s.status),
        }));
        setSites(apiSites);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = sites.filter(s => {
    const matchQ = s.name?.toLowerCase().includes(query.toLowerCase()) ||
                   s.address?.toLowerCase().includes(query.toLowerCase());
    const matchF = filterStatus === 'All' || s.status === filterStatus;
    return matchQ && matchF;
  });

  return (
    <div className="h-full flex flex-col bg-[#0A0A0A] border border-white/5 rounded-[40px] p-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-widest text-[#08CB00]">Drop-Off Sites</h3>
          <p className="text-[8px] text-white/20 mt-0.5">
            {loading ? 'Loading...' : `${sites.filter(s => s.status === 'Active').length} active · ${sites.length} total`}
          </p>
        </div>
        <button
          onClick={onAdd}
          className="p-2 bg-[#08CB00] text-black rounded-xl hover:bg-[#08CB00]/80 transition-all shadow-lg shadow-[#08CB00]/20"
        >
          <Plus size={16} strokeWidth={3} />
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-3 shrink-0">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search sites..."
          className="w-full bg-black/40 border border-white/10 rounded-xl pl-8 pr-3 py-2 text-[11px] text-white placeholder:text-white/20 outline-none focus:border-[#08CB00]/50"
        />
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-1 mb-4 shrink-0 p-1 bg-black/40 rounded-xl">
        {['All', 'Active', 'Maintenance', 'Full', 'Inactive'].map(t => (
          <button
            key={t}
            onClick={() => setFilterStatus(t)}
            className={`flex-1 py-1 rounded-lg text-[8px] font-black uppercase tracking-wider transition-all ${
              filterStatus === t ? 'bg-[#08CB00] text-black' : 'text-white/30 hover:text-white'
            }`}
          >
            {t === 'Maintenance' ? 'Maint.' : t}
          </button>
        ))}
      </div>

      {/* Sites list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin space-y-2">
        {loading && (
          <div className="flex items-center justify-center py-12 gap-2">
            <Loader2 size={16} className="text-[#08CB00] animate-spin" />
            <span className="text-[10px] text-white/30">Loading sites...</span>
          </div>
        )}
        {!loading && filtered.map(site => {
          const sc = STATUS_COLORS[site.status] || STATUS_COLORS.Inactive;
          const loadPct = Math.round((site.current_load_kg / site.capacity_kg) * 100);
          const isSelected = selectedSite?.id === site.id;

          return (
            <div
              key={site.id}
              onClick={() => onSelect(site)}
              className={`group p-4 rounded-2xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-[#08CB00]/10 border-[#08CB00]/40'
                  : 'bg-white/[0.02] border-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Icon + status dot */}
                <div className="relative shrink-0">
                  <div className={`p-2.5 rounded-xl ${sc.bg}`}>
                    <Building2 size={14} className={sc.text} />
                  </div>
                  <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-[#0A0A0A] ${sc.dot}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-[11px] font-black text-white truncate">{site.name}</p>
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md shrink-0 ${sc.bg} ${sc.text}`}>{site.status}</span>
                  </div>
                  <p className="text-[9px] text-white/30 truncate mt-0.5">{site.address}</p>

                  {/* Load bar */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${loadPct >= 90 ? 'bg-red-400' : loadPct >= 70 ? 'bg-yellow-400' : 'bg-[#08CB00]'}`}
                        style={{ width: `${Math.min(loadPct, 100)}%` }}
                      />
                    </div>
                    <span className="text-[8px] text-white/30 shrink-0">{loadPct}%</span>
                  </div>
                </div>
              </div>

              {/* Action row — visible on hover or selection */}
              <div className={`flex items-center justify-end gap-2 mt-3 pt-2 border-t border-white/5 transition-all ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                <button
                  onClick={e => { e.stopPropagation(); onManageReceivers(site); }}
                  className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded-lg text-[8px] text-white/40 hover:text-white hover:bg-white/10 transition-all"
                >
                  <Users size={10} /> Receivers
                </button>
                <button
                  onClick={e => { e.stopPropagation(); onEdit(site); }}
                  className="p-1.5 bg-white/5 rounded-lg text-white/40 hover:text-[#08CB00] hover:bg-[#08CB00]/10 transition-all"
                >
                  <Pencil size={11} />
                </button>
                <button
                  onClick={e => { e.stopPropagation(); onDelete(site.id); }}
                  className="p-1.5 bg-white/5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            </div>
          );
        })}

        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <MapPin size={24} className="text-white/10 mb-2" />
            <p className="text-[10px] text-white/20">{sites.length === 0 ? 'No drop-off sites yet' : 'No sites match your search'}</p>
          </div>
        )}
      </div>
    </div>
  );
}