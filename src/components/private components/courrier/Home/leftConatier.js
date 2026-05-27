"use client"
import React from 'react';
import { Package, MapPin, Clock, ArrowRight, Loader2 } from 'lucide-react';

const STATUS_STYLE = {
  in_transit:  { label: 'In Transit',  cls: 'bg-[#08CB00]/10 text-[#08CB00] border-[#08CB00]/20' },
  pending:     { label: 'Pending',     cls: 'bg-white/5 text-white/40 border-white/10' },
  completed:   { label: 'Completed',   cls: 'bg-white/5 text-white/20 border-white/5' },
  accepted:    { label: 'Accepted',    cls: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
};

export default function LeftContainer({ jobs, loading }) {
  return (
    <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-white tracking-tight">Active Jobs</h2>
          <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mt-0.5">Today's Queue</p>
        </div>
        <span className="text-[9px] font-black uppercase px-2.5 py-1 bg-[#08CB00]/10 border border-[#08CB00]/20 text-[#08CB00] rounded-full">
          {loading ? '…' : jobs.length} Active
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 gap-2">
          <Loader2 size={16} className="text-[#08CB00] animate-spin" />
          <span className="text-[10px] text-white/30">Loading jobs...</span>
        </div>
      ) : jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-2 bg-white/[0.02] border border-white/5 rounded-[28px]">
          <Package size={28} className="text-white/10" />
          <p className="text-[10px] text-white/20">No active jobs right now</p>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job, i) => {
            const st = STATUS_STYLE[job.status?.toLowerCase()] || STATUS_STYLE.pending;
            const isActive = job.status?.toLowerCase() === 'in_transit';
            return (
              <div key={job.submit_id || i} className={`p-4 rounded-[24px] border transition-all ${isActive ? 'bg-[#08CB00]/5 border-[#08CB00]/20' : 'bg-white/[0.02] border-white/5 hover:border-white/15'}`}>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${isActive ? 'bg-[#08CB00]/20' : 'bg-white/5'}`}>
                      <Package size={12} className={isActive ? 'text-[#08CB00]' : 'text-white/30'} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-black text-white truncate">{job.brand_n_model || `Job #${job.submit_id}`}</p>
                      <p className="text-[9px] text-white/30">#{job.submit_id}</p>
                    </div>
                  </div>
                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border shrink-0 ${st.cls}`}>{st.label}</span>
                </div>
                <div className="flex items-center gap-3 text-[9px] text-white/30">
                  {job.pickup_location && (
                    <span className="flex items-center gap-1"><MapPin size={8} />{job.pickup_location}</span>
                  )}
                  {job.eta && (
                    <span className="flex items-center gap-1"><Clock size={8} />ETA {job.eta}</span>
                  )}
                </div>
                {isActive && (
                  <button className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 bg-[#08CB00]/10 border border-[#08CB00]/20 text-[#08CB00] rounded-xl text-[9px] font-black uppercase tracking-wider hover:bg-[#08CB00]/20 transition-all">
                    View Delivery <ArrowRight size={10} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}