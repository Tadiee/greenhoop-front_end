"use client"
import React, { useState, useEffect } from 'react';
import { ToggleRight, ToggleLeft, ShieldCheck, CheckCircle2, Clock, Scale } from 'lucide-react';

const API = 'http://127.0.0.1:8000';

export default function TopStatusBarComp({ refreshTrigger }) {
  const [isOnline, setIsOnline]   = useState(true);
  const [stats, setStats]         = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API}/receiver/stats`, { credentials: 'include' });
        if (res.ok) { const d = await res.json(); setStats(d.stats || d); }
      } catch {}
    };
    fetchStats();
  }, [refreshTrigger]);

  const kpis = [
    { label: 'Completed Today', value: stats.completed_today ?? '—', icon: <CheckCircle2 size={16} className="text-[#08CB00]" />, color: 'text-[#08CB00]' },
    { label: 'Pending Arrivals', value: stats.pending_count ?? '—',   icon: <Clock size={16} className="text-yellow-400" />,        color: 'text-yellow-400' },
    { label: 'Weight Processed', value: stats.weight_processed_kg ? `${stats.weight_processed_kg} kg` : '—', icon: <Scale size={16} className="text-blue-400" />, color: 'text-blue-400' },
  ];

  return (
    <div className="relative z-10 flex flex-col md:flex-row gap-4 mb-6">
      {/* Duty status toggle */}
      <div
        className="bg-[#1A1A1A] border border-white/5 rounded-[24px] p-5 shadow-2xl flex items-center justify-between flex-1 hover:border-white/10 transition-all cursor-pointer"
        onClick={() => setIsOnline(v => !v)}
      >
        <div className="flex items-center gap-4">
          <div className={`w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all ${isOnline ? 'bg-[#08CB00]/10 border-[#08CB00] text-[#08CB00] shadow-[0_0_15px_rgba(8,203,0,0.3)]' : 'bg-black border-white/10 text-white/30'}`}>
            <ShieldCheck size={18} />
          </div>
          <div>
            <h3 className="text-white font-black text-base tracking-tight">Receiver Duty Status</h3>
            <p className={`text-[9px] font-black uppercase tracking-widest mt-0.5 transition-colors ${isOnline ? 'text-[#08CB00]' : 'text-white/40'}`}>
              {isOnline ? 'Online · Actively Processing' : 'Currently Offline'}
            </p>
          </div>
        </div>
        {isOnline
          ? <ToggleRight size={36} strokeWidth={1.5} className="text-[#08CB00] drop-shadow-[0_0_10px_rgba(8,203,0,0.5)]" />
          : <ToggleLeft  size={36} strokeWidth={1.5} className="text-white/20" />}
      </div>

      {/* KPI chips */}
      {kpis.map(k => (
        <div key={k.label} className="bg-[#1A1A1A] border border-white/5 rounded-[24px] p-5 shadow-2xl flex items-center gap-4 md:w-52">
          <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center shrink-0">{k.icon}</div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-0.5">{k.label}</p>
            <p className={`text-2xl font-black ${k.color}`}>{k.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}