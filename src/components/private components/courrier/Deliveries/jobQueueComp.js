"use client"
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Zap, CalendarClock, ShieldCheck, Navigation2, Package, Building2, Clock, RefreshCw, ChevronRight, ChevronDown, MapPin } from 'lucide-react';

const HistoryMiniMap = dynamic(() => import('./historyMiniMap'), { ssr: false });

const API_BASE = 'http://127.0.0.1:8000';
const TABS = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'active',   label: 'Active'   },
  { key: 'history',  label: 'History'  },
];

function TypeBadge({ type }) {
  return (
    <span className={`flex items-center gap-1 text-[8px] font-black uppercase px-1.5 py-0.5 rounded border ${
      type === 'urgent' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
    }`}>
      {type === 'urgent' ? <Zap size={8} /> : <CalendarClock size={8} />}
      {type === 'urgent' ? 'Urgent' : 'Scheduled'}
    </span>
  );
}

function JobRow({ job, tab, onStart }) {
  const isActive = tab === 'active';
  const isDone = tab === 'history';
  const [expanded, setExpanded] = useState(false);

  const hasMap = isDone && job.lat != null && job.lng != null;

  return (
    <div className={`rounded-[20px] border transition-all ${
      isActive ? 'bg-[#08CB00]/5 border-[#08CB00]/15' : 'bg-white/5 border-transparent hover:border-white/10'
    }`}>
      {/* Main row */}
      <div
        className="flex items-start gap-3 p-4 cursor-pointer"
        onClick={() => isDone && setExpanded(v => !v)}
      >
        <div className="relative shrink-0">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isDone ? 'bg-black border border-white/10'
            : isActive ? 'bg-[#08CB00]/10 border border-[#08CB00]/30'
            : job.type === 'urgent' ? 'bg-orange-500/10 border border-orange-500/30'
            : 'bg-blue-500/10 border border-blue-500/30'
          }`}>
            {isDone ? <ShieldCheck size={16} className="text-white/20" />
             : isActive ? <Navigation2 size={16} className="text-[#08CB00]" />
             : job.type === 'urgent' ? <Zap size={16} className="text-orange-400" />
             : <CalendarClock size={16} className="text-blue-400" />}
          </div>
          {isActive && <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#08CB00] rounded-full border-2 border-[#1A1A1A]" />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            {!isDone && <TypeBadge type={job.type} />}
            {job.scheduled_date && <span className="text-[8px] text-white/30 font-bold">{job.scheduled_date}</span>}
            {job.time && <span className="text-[8px] text-white/25 font-bold flex items-center gap-0.5"><Clock size={8} />{job.time}</span>}
          </div>
          <h4 className={`text-xs font-black uppercase tracking-widest ${isDone ? 'text-white/40' : 'text-white'}`}>{job.customer}</h4>
          <div className="flex items-center gap-1.5 mt-1">
            <Package size={9} className="text-white/20" />
            <span className="text-[9px] text-white/30">{job.item} · {job.weight}</span>
          </div>
          {job.hub && (
            <div className="flex items-center gap-1 mt-0.5">
              <Building2 size={9} className="text-white/20" />
              <span className="text-[9px] text-white/25 truncate">→ {job.hub}</span>
            </div>
          )}
        </div>

        <div className="shrink-0 flex flex-col items-end gap-1">
          <span className="text-[10px] font-black text-[#08CB00]">{job.pay}</span>
          {tab === 'upcoming' && (
            <button onClick={e => { e.stopPropagation(); onStart?.(job); }} className="flex items-center gap-1 mt-1 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-blue-500/20 transition-all">
              Start <ChevronRight size={9} />
            </button>
          )}
          {isActive && (
            <div className="w-8 h-8 rounded-full bg-[#08CB00] text-black flex items-center justify-center shadow-[0_0_10px_rgba(8,203,0,0.3)] mt-1">
              <Navigation2 size={14} />
            </div>
          )}
          {isDone && (
            <div className="flex items-center gap-1 mt-1">
              {hasMap && (
                <span className="flex items-center gap-0.5 text-[8px] text-white/30 font-bold">
                  <MapPin size={8} />
                  {expanded ? 'Hide' : 'Route'}
                </span>
              )}
              {hasMap
                ? <ChevronDown size={12} className={`text-white/20 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                : <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Done</span>
              }
            </div>
          )}
        </div>
      </div>

      {/* Expandable mini-map for history */}
      {isDone && expanded && hasMap && (
        <div className="px-4 pb-4">
          <HistoryMiniMap
            pickupLat={job.lat}
            pickupLng={job.lng}
            jobId={job.id}
            customer={job.customer}
            hub={job.hub}
          />
        </div>
      )}
    </div>
  );
}

export default function JobQueueComp({ onStartJob }) {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQueue = () => {
    setLoading(true);
    setError(null);
    fetch(`${API_BASE}/courier/active-queue`, { credentials: 'include' })
      .then(res => { if (!res.ok) throw new Error(`Server error: ${res.status}`); return res.json(); })
      .then(data => setJobs(data.queue || []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchQueue(); }, []);

  const upcoming = jobs.filter(j => j.status !== 'In Progress' && j.status !== 'Completed');
  const active   = jobs.filter(j => j.status === 'In Progress');
  const history  = jobs.filter(j => j.status === 'Completed');
  const counts   = { upcoming: upcoming.length, active: active.length, history: history.length };
  const list     = { upcoming, active, history }[activeTab];

  return (
    <div className="bg-[#1A1A1A] border border-white/5 rounded-[40px] p-6 shadow-2xl flex flex-col overflow-hidden h-full min-h-[400px]">
      <div className="flex justify-between items-center mb-5 px-1">
        <div>
          <h3 className="text-white font-black tracking-tight">Job Queue</h3>
          <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest mt-0.5">
            {counts.active > 0 ? `${counts.active} Active · ` : ''}{counts.upcoming} Upcoming
          </p>
        </div>
        <button onClick={fetchQueue} className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white/30 hover:text-white transition-all">
          <RefreshCw size={13} />
        </button>
      </div>

      <div className="flex items-center gap-1 bg-black/30 p-1 rounded-2xl mb-4">
        {TABS.map(({ key, label }) => (
          <button key={key} onClick={() => setActiveTab(key)} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
            activeTab === key
              ? key === 'active' ? 'bg-[#08CB00] text-black shadow-[0_0_10px_rgba(8,203,0,0.3)]'
              : key === 'upcoming' ? 'bg-blue-500 text-white'
              : 'bg-white/10 text-white'
              : 'text-white/30 hover:text-white/60'
          }`}>
            {label}
            {counts[key] > 0 && (
              <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full ${activeTab === key ? 'bg-black/20' : 'bg-white/10'}`}>
                {counts[key]}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-none space-y-2 pr-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-32 gap-2">
            <div className="w-7 h-7 rounded-full border-2 border-[#08CB00] border-t-transparent animate-spin" />
            <p className="text-[9px] text-white/30 font-black uppercase tracking-widest">Loading...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-32 gap-1 text-center px-4">
            <p className="text-red-400 text-[10px] font-black uppercase">Failed to load</p>
            <p className="text-white/25 text-[9px]">{error}</p>
          </div>
        ) : list.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 gap-1">
            <p className="text-white/20 text-[10px] font-black uppercase tracking-widest">No {activeTab} jobs</p>
          </div>
        ) : (
          list.map(job => <JobRow key={job.id} job={job} tab={activeTab} onStart={onStartJob} />)
        )}
      </div>
    </div>
  );
}
