"use client"
import React, { useState, useEffect } from 'react';
import { Package, Search, CheckCircle2, Clock, Truck, Building2, AlertTriangle, Loader2 } from 'lucide-react';
import { LIFECYCLE_STATUSES, CATEGORY_ICONS } from './etrackConstants';

const FLAG_SUPPRESSED = new Set(['in_transit', 'completed', 'pending_pickup']);

const STATUS_COLOR = {
  ACCEPTED:          'text-white/40',
  in_transit:        'text-[#08CB00]',
  PENDING_PICKUP:   'text-yellow-400',
  OFFERED:           'text-red-400',
  AWAITING_DELIVERY: 'text-yellow-400',
  RECEIVED:          'text-blue-400',
  reviewed:          'text-blue-400',
  ASSESSMENT:        'text-purple-400',
  PROCESSING:        'text-orange-400',
  EXTRACTION:        'text-[#08CB00]',
  completed:         'text-[#08CB00]',
  COMPLETED:         'text-[#08CB00]',
  cancelled:         'text-red-400',
};

const STATUS_LABEL = {
  ACCEPTED:          'Accepted',
  in_transit:        'In Transit',
  PENDING_PICKUP:   'Needs Courier',
  reviewed:          'Reviewed',
  submitted:         'Submitted',
  pickup_scheduled:  'Pickup Scheduled',
  completed:         'Completed',
  cancelled:         'Cancelled',
  OFFERED:           'Returned to Pool',
  PENDING_RECIEVER:  'Pending Receiver',
};

export default function AcceptedListComp({ selectedId, onSelect }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/recycler/active-jobs', { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        // API already provides current_status (recycler_side_status || status)
        setSubmissions(data?.active_jobs || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = submissions.filter(s => {
    const matchQ = (s.brand_n_model || '').toLowerCase().includes(query.toLowerCase()) ||
                   String(s.submit_id).includes(query);
    const statusToCheck = (s.status || s.current_status || '').toLowerCase();
    const hasActiveAlert = !!s.user_flag && !FLAG_SUPPRESSED.has(statusToCheck);
    const matchF = filter === 'ALL' ||
                   (filter === 'ACTIVE' && !['COMPLETED', 'completed', 'cancelled'].includes(s.current_status)) ||
                   (filter === 'NEEDS_ACTION' && hasActiveAlert) ||
                   (filter === 'DONE'   && ['COMPLETED', 'completed', 'cancelled'].includes(s.current_status));
    return matchQ && matchF;
  });

  const needsActionCount = submissions.filter(s => !!s.user_flag && !FLAG_SUPPRESSED.has((s.status || s.current_status || '').toLowerCase())).length;

  return (
    <div className="h-full flex flex-col bg-white/[0.02] border border-white/5 rounded-[40px] p-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div>
          <h3 className="text-xs font-black uppercase tracking-widest text-white/60">Accepted Submissions</h3>
          <p className="text-[9px] text-[#08CB00] mt-0.5">{submissions.length} total · {submissions.filter(s=>s.current_status!=='COMPLETED').length} active</p>
        </div>
        <Package size={16} className="text-[#08CB00]" />
      </div>

      {/* Search */}
      <div className="relative mb-3 shrink-0">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by model or ID..."
          className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-[11px] text-white placeholder:text-white/20 outline-none focus:border-[#08CB00]/50"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 shrink-0 p-1 bg-black/40 rounded-xl">
        {[
          { key: 'ALL', label: 'All' },
          { key: 'NEEDS_ACTION', label: needsActionCount > 0 ? `⚠ ${needsActionCount}` : 'Alerts' },
          { key: 'ACTIVE', label: 'Active' },
          { key: 'DONE', label: 'Done' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${
              filter === t.key
                ? t.key === 'NEEDS_ACTION' && needsActionCount > 0
                  ? 'bg-yellow-500 text-black'
                  : 'bg-[#08CB00] text-black'
                : t.key === 'NEEDS_ACTION' && needsActionCount > 0
                  ? 'text-yellow-400'
                  : 'text-white/30 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin space-y-2">
        {loading && (
          <div className="flex items-center justify-center py-12 gap-2">
            <Loader2 size={16} className="text-[#08CB00] animate-spin" />
            <span className="text-[10px] text-white/30">Loading...</span>
          </div>
        )}
        {!loading && filtered.map(sub => {
          const Icon = CATEGORY_ICONS[sub.category] || Package;
          const isSelected = selectedId === sub.submit_id;
          const statusLabel = STATUS_LABEL[sub.current_status] || LIFECYCLE_STATUSES.find(s => s.key === sub.current_status)?.label || sub.current_status;
          const statusColor = STATUS_COLOR[sub.current_status] || 'text-white/40';
          const hasAlert = !!sub.user_flag && !FLAG_SUPPRESSED.has((sub.status || sub.current_status || '').toLowerCase());

          return (
            <div
              key={sub.submit_id}
              onClick={() => onSelect(sub)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all group ${
                isSelected
                  ? 'bg-[#08CB00]/10 border-[#08CB00]/40'
                  : hasAlert
                    ? 'bg-yellow-500/5 border-yellow-500/30 hover:border-yellow-500/50'
                    : 'bg-black/20 border-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 relative ${
                  isSelected ? 'bg-[#08CB00]/20' : hasAlert ? 'bg-yellow-500/10' : 'bg-white/5'
                }`}>
                  <Icon size={16} className={isSelected ? 'text-[#08CB00]' : hasAlert ? 'text-yellow-400' : 'text-white/30'} />
                  {hasAlert && (
                    <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-yellow-500 rounded-full flex items-center justify-center">
                      <AlertTriangle size={8} className="text-black" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-black text-white truncate">{sub.brand_n_model}</p>
                  {hasAlert
                    ? <p className="text-[9px] text-yellow-400 font-bold truncate">{sub.user_flag}</p>
                    : <p className="text-[9px] text-white/30">#{sub.submit_id} · {sub.estimated_weight}kg</p>
                  }
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-[9px] font-bold ${statusColor}`}>{statusLabel}</p>
                  <div className="flex items-center justify-end gap-1 mt-0.5">
                    {sub.delivery_method === 'COURIER'
                      ? <Truck size={10} className="text-blue-400" />
                      : sub.delivery_method === 'DROPOFF'
                        ? <Building2 size={10} className="text-white/30" />
                        : sub.delivery_method === 'RECYCLER_PICKUP' || sub.delivery_method === 'TECHNICIAN_PICKUP'
                          ? <Truck size={10} className="text-purple-400" />
                          : null
                    }
                    {sub.estimated_weight && (
                      <span className="text-[8px] text-white/20">{sub.estimated_weight}kg</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Package size={24} className="text-white/10 mb-2" />
            <p className="text-[10px] text-white/20">No submissions found</p>
          </div>
        )}
      </div>
    </div>
  );
}