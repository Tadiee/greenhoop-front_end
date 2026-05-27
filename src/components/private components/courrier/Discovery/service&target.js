"use client"
import React, { useState, useEffect } from 'react';
import { ToggleRight, ToggleLeft, Zap, CalendarClock } from 'lucide-react';

export default function ServicenTargetComp() {
  const [isOnline, setIsOnline] = useState(true);
  const [metrics, setMetrics] = useState({
    urgentCount: 0,
    scheduledCount: 0,
    earnings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/courier/stats', { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        let queue = [];
        if (data?.queue) {
          queue = data.queue;
        } else if (Array.isArray(data)) {
          queue = data;
        } else if (data) {
          queue = data.queue || [];
        }

        let urgent = 0;
        let scheduled = 0;
        let totalEarnings = 0;

        queue.forEach(job => {
          if (job.type === 'urgent') urgent++;
          if (job.type === 'scheduled') scheduled++;
          
          if (job.status === 'Completed' && job.pay_amount) {
            totalEarnings += Number(job.pay_amount);
          }
        });

        setMetrics({
          urgentCount: urgent,
          scheduledCount: scheduled,
          earnings: totalEarnings,
        });
      })
      .catch(err => console.error("Failed to load metrics from queue", err))
      .finally(() => setLoading(false));
  }, []);

  const targetAmount = 200; // Fixed daily target for the gauge
  const earnings = metrics.earnings;
  const percent = Math.min(Math.round((earnings / targetAmount) * 100), 100);
  
  // Circumference of the gauge is 125.6
  const dashoffset = 125.6 - (125.6 * percent) / 100;

  // Formatting dollars and cents
  const [dollars, cents] = earnings.toFixed(2).split('.');

  return (
    <div className="bg-[#1A1A1A] border border-white/5 rounded-[32px] shadow-2xl overflow-hidden">

      {/* Top: Service Status toggle */}
      <div
        className="p-5 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-all border-b border-white/5"
        onClick={() => setIsOnline(!isOnline)}
      >
        <div>
          <h3 className="text-white font-black text-sm tracking-tight">Service Status</h3>
          <p className={`text-[9px] font-black uppercase tracking-widest mt-0.5 transition-colors ${
            isOnline ? 'text-[#08CB00]' : 'text-white/30'
          }`}>
            {isOnline ? '● Online — accepting jobs' : '○ Offline'}
          </p>
        </div>
        {isOnline
          ? <ToggleRight size={40} strokeWidth={1.5} className="text-[#08CB00] drop-shadow-[0_0_12px_rgba(8,203,0,0.4)]" />
          : <ToggleLeft size={40} strokeWidth={1.5} className="text-white/20" />
        }
      </div>

      {/* Middle: Job counts — urgent + scheduled */}
      <div className="grid grid-cols-2 divide-x divide-white/5 border-b border-white/5" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 p-4">
          <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
            <Zap size={14} className="text-orange-400" />
          </div>
          <div>
            <p className="text-xl font-black text-orange-400 leading-none">{loading ? '—' : metrics.urgentCount}</p>
            <p className="text-[8px] font-black text-white/25 uppercase tracking-widest mt-0.5">Urgent</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
            <CalendarClock size={14} className="text-blue-400" />
          </div>
          <div>
            <p className="text-xl font-black text-blue-400 leading-none">{loading ? '—' : metrics.scheduledCount}</p>
            <p className="text-[8px] font-black text-white/25 uppercase tracking-widest mt-0.5">Scheduled</p>
          </div>
        </div>
      </div>

      {/* Bottom: Earnings gauge */}
      <div className="p-5 flex flex-col items-center">
        <p className="text-[9px] text-white/30 font-black uppercase tracking-widest mb-4">Daily Target</p>
        {/* Half-donut */}
        <div className="relative w-48 h-24 mb-8">
          <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
            <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" strokeLinecap="round" />
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none" stroke="#08CB00" strokeWidth="12" strokeLinecap="round"
              strokeDasharray="125.6" strokeDashoffset={dashoffset}
              className="drop-shadow-[0_0_15px_rgba(8,203,0,0.6)] transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute -bottom-5 left-0 right-0 flex flex-col items-center">
            <span className="text-4xl font-black text-white tracking-tighter">
              ${loading ? '--' : dollars}
              {!loading && <span className="text-xl text-white/30">.{cents}</span>}
            </span>
            <span className="text-[#08CB00] text-[9px] font-black uppercase tracking-widest bg-[#08CB00]/10 border border-[#08CB00]/20 px-2 py-0.5 rounded mt-1">
              {loading ? '...' : `${percent}% of $${targetAmount}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}