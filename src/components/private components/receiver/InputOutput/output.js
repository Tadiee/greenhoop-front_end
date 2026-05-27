"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { Truck, RefreshCw, Loader2, Clock, Package } from 'lucide-react';

const API = 'http://127.0.0.1:8000';

const STATUS_STYLE = {
  pending_pickup: { label: 'Pending Pickup', cls: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  accepted:       { label: 'Accepted',       cls: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  in_transit:     { label: 'In Transit',     cls: 'bg-[#08CB00]/10 text-[#08CB00] border-[#08CB00]/20' },
};

export default function PendingArrivalsComp({ refreshTrigger }) {
  const [arrivals, setArrivals] = useState([]);
  const [loading, setLoading]   = useState(true);

  const fetchArrivals = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/receiver/pending-arrivals`, { credentials: 'include' });
      if (!res.ok) return;
      const data = await res.json();
      setArrivals(data.arrivals || data.submissions || []);
    } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchArrivals(); }, [fetchArrivals, refreshTrigger]);

  return (
    <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-[#1A1A1A] border border-white/5 rounded-[32px] p-6 shadow-2xl flex flex-col hover:border-white/10 transition-all">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
            <Truck size={18} className="text-yellow-400" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">Pending Arrivals</h2>
            <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-0.5">En route to this site</p>
          </div>
        </div>
        <button onClick={fetchArrivals} className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
          <RefreshCw size={13} className={`text-white/40 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-2 overflow-y-auto scrollbar-none">
        {loading ? (
          <div className="flex-1 flex items-center justify-center gap-2">
            <Loader2 size={16} className="text-[#08CB00] animate-spin" />
            <span className="text-[10px] text-white/30">Loading...</span>
          </div>
        ) : arrivals.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-2">
            <Clock size={32} className="text-white/10" />
            <p className="text-[10px] text-white/20 uppercase tracking-widest text-center">No pending arrivals<br/>at this site</p>
          </div>
        ) : arrivals.map((a, i) => {
          const style = STATUS_STYLE[a.status] || { label: a.status, cls: 'bg-white/5 text-white/40 border-white/10' };
          return (
            <div key={a.submit_id || i} className="flex items-center justify-between p-3 bg-black/30 border border-white/5 rounded-2xl hover:border-white/10 transition-all">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <Package size={13} className="text-white/30" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-black text-white truncate">{a.brand_n_model || `#${a.submit_id}`}</p>
                  <p className="text-[9px] text-white/30">{a.user_name || a.user_id || '—'}</p>
                </div>
              </div>
              <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-md border shrink-0 ml-2 ${style.cls}`}>
                {style.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
        <p className="text-[9px] text-white/20 uppercase tracking-widest">{loading ? '—' : arrivals.length} pending</p>
        <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
      </div>
    </div>
  );
}