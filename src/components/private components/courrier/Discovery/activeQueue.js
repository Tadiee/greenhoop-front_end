import React, { useState, useEffect } from 'react';
import { Navigation2, ShieldCheck, Zap, CalendarClock, Package, Building2 } from 'lucide-react';

export default function ActiveQueue() {
  const [jobQueue, setJobQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/courier/active-queue', { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.queue) {
            setJobQueue(data.queue);
        } else if (Array.isArray(data)) {
            setJobQueue(data);
        } else if (data) {
            setJobQueue(data.queue || []);
        }
      })
      .catch(err => console.error("Failed to load active queue", err))
      .finally(() => setLoading(false));
  }, []);

  const inProgress = jobQueue.filter(j => j.status === 'In Progress').length;

  return (
    <div className="bg-[#1A1A1A] border border-white/5 rounded-[40px] p-6 shadow-2xl flex-1 flex flex-col overflow-hidden min-h-[250px]">
      <div className="flex justify-between items-center mb-5 px-2">
        <div>
          <h3 className="text-white font-black tracking-tight">Job Queue</h3>
          <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest mt-0.5">Today's Collections</p>
        </div>
        <div className="flex items-center gap-2">
          {inProgress > 0 && (
            <span className="flex items-center gap-1 text-[9px] font-black text-[#08CB00] bg-[#08CB00]/10 border border-[#08CB00]/20 px-2 py-1 rounded-full">
              <Zap size={9} />{inProgress} Active
            </span>
          )}
          <span className="text-[10px] font-black text-white/30 tracking-widest uppercase">{jobQueue.length} Jobs</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-none space-y-2 pr-1">
        {loading ? (
            <div className="text-white/50 text-xs text-center py-4">Loading queue...</div>
        ) : jobQueue.length === 0 ? (
            <div className="text-white/50 text-xs text-center py-4">No active jobs found.</div>
        ) : (
          jobQueue.map((job) => (
            <div key={job.id} className="flex items-start gap-3 p-4 bg-white/5 border border-transparent hover:border-white/10 rounded-[20px] group transition-all cursor-pointer">
  
              {/* Icon */}
              <div className="relative shrink-0">
                {job.status === 'In Progress' ? (
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    job.type === 'urgent'
                      ? 'bg-orange-500/10 border border-orange-500/30'
                      : 'bg-blue-500/10 border border-blue-500/30'
                  }`}>
                    {job.type === 'urgent'
                      ? <Zap size={16} className="text-orange-400" />
                      : <CalendarClock size={16} className="text-blue-400" />}
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-black border border-white/10 flex items-center justify-center">
                    <ShieldCheck size={16} className="text-white/20" />
                  </div>
                )}
                {job.status === 'In Progress' && (
                  <span className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-[#1A1A1A] ${
                    job.type === 'urgent' ? 'bg-orange-500' : 'bg-blue-500'
                  }`}></span>
                )}
              </div>
  
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded border ${
                    job.type === 'urgent'
                      ? 'bg-orange-500/10 border-orange-500/20 text-orange-400'
                      : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                  }`}>
                    <span className="flex items-center gap-1">
                      {job.type === 'urgent'
                        ? <Zap size={8} />
                        : <CalendarClock size={8} />}
                      {job.type === 'urgent' ? 'Urgent' : 'Scheduled'}
                    </span>
                  </span>
                  {job.scheduled_date && (
                    <span className="text-[8px] text-white/30 font-bold">{job.scheduled_date}</span>
                  )}
                  {job.time && (
                    <span className="text-[8px] text-white/30 font-bold">• {job.time}</span>
                  )}
                </div>
                <h4 className={`text-xs font-black uppercase tracking-widest ${
                  job.status === 'In Progress' ? 'text-white' : 'text-white/40'
                }`}>{job.customer}</h4>
                <div className="flex items-center gap-1.5 mt-1">
                  <Package size={9} className="text-white/20" />
                  <span className="text-[9px] text-white/30">{job.item} · {job.weight}</span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <Building2 size={9} className="text-white/20" />
                  <span className="text-[9px] text-white/25">→ {job.hub || 'Pending'}</span>
                </div>
              </div>
  
              {/* Action */}
              <div className="shrink-0 flex flex-col items-end gap-1.5">
                {job.pay && (
                  <span className="text-[10px] font-black text-[#08CB00]">{job.pay}</span>
                )}
                {job.status === 'In Progress' ? (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform ${
                    job.type === 'urgent' ? 'bg-orange-500 text-black' : 'bg-blue-500 text-white'
                  }`}>
                    <Navigation2 size={14} />
                  </div>
                ) : (
                  <span className="text-[9px] font-black text-white/20 uppercase tracking-widest group-hover:text-white/40 transition-colors">Done</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}