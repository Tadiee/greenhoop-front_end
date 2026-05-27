"use client"
import React, { useState, useEffect } from 'react';
import { Zap, CalendarClock, MapPin, ChevronRight, RefreshCw } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000';

export default function NearbyJobsComp({ onSelectJob }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = () => {
    setLoading(true);
    fetch(`${API_BASE}/courier/discovery`, { credentials: 'include' })
      .then(r => r.ok ? r.json() : { jobs: [] })
      .then(data => setJobs((data.jobs || []).filter(j => j.lat != null)))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchJobs(); }, []);

  return (
    <div className="bg-[#1A1A1A] border border-white/5 rounded-[32px] p-5 shadow-2xl flex flex-col gap-3 flex-1 min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-black text-sm tracking-tight">Nearby Jobs</h3>
          <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest mt-0.5">Available in your zone</p>
        </div>
        <button onClick={fetchJobs} className="w-7 h-7 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white/30 hover:text-white transition-all">
          <RefreshCw size={11} />
        </button>
      </div>

      {/* Job list */}
      <div className="flex-1 overflow-y-auto scrollbar-none space-y-1.5 min-h-0">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 bg-white/5 rounded-2xl animate-pulse" />
          ))
        ) : jobs.length === 0 ? (
          <div className="flex items-center justify-center h-16">
            <p className="text-[9px] text-white/20 font-black uppercase tracking-widest">No jobs nearby</p>
          </div>
        ) : (
          jobs.map(job => (
            <button
              key={job.id}
              onClick={() => onSelectJob?.(job)}
              className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/8 border border-transparent hover:border-white/10 rounded-2xl transition-all group"
            >
              {/* Type dot */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                job.type === 'urgent' ? 'bg-orange-500/10' : 'bg-blue-500/10'
              }`}>
                {job.type === 'urgent'
                  ? <Zap size={13} className="text-orange-400" />
                  : <CalendarClock size={13} className="text-blue-400" />}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 text-left">
                <p className="text-[10px] font-black text-white truncate">{job.customer}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin size={8} className="text-white/20 shrink-0" />
                  <span className="text-[8px] text-white/30 truncate">{job.pickup || job.id}</span>
                </div>
              </div>

              {/* Pay + distance */}
              <div className="shrink-0 text-right">
                <p className="text-[10px] font-black text-[#08CB00]">{job.pay}</p>
                {job.distance && (
                  <p className="text-[8px] text-white/25 font-bold">{job.distance}</p>
                )}
              </div>

              <ChevronRight size={12} className="text-white/20 group-hover:text-white/40 transition-colors shrink-0" />
            </button>
          ))
        )}
      </div>

      {/* Footer */}
      {jobs.length > 0 && (
        <div className="pt-1 border-t border-white/5 flex items-center justify-between">
          <span className="text-[8px] text-white/20 font-bold uppercase tracking-widest">{jobs.length} jobs shown</span>
          <span className="text-[8px] text-[#08CB00] font-black uppercase tracking-widest animate-pulse">● Live</span>
        </div>
      )}
    </div>
  );
}
