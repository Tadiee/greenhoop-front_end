"use client"
import React from 'react';
import { CheckCircle2, Truck, AlertTriangle, Package, Clock } from 'lucide-react';

const ACTIVITY_ICON = {
  completed:  { icon: CheckCircle2, color: 'text-[#08CB00]', bg: 'bg-[#08CB00]/10 border-[#08CB00]/20' },
  in_transit: { icon: Truck,        color: 'text-blue-400',   bg: 'bg-blue-500/10 border-blue-500/20' },
  alert:      { icon: AlertTriangle,color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
  pickup:     { icon: Package,      color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
};

export default function BottomContainer({ activity }) {
  const items = activity || [];

  return (
    <div className="mt-6 grid grid-cols-12 gap-4">
      {/* Recent Activity Feed */}
      <div className="col-span-12 lg:col-span-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-black text-white">Recent Activity</h2>
            <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mt-0.5">Live delivery events</p>
          </div>
          <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-[#08CB00]">
            <span className="w-1.5 h-1.5 bg-[#08CB00] rounded-full animate-pulse" /> Live
          </span>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 bg-white/[0.02] border border-white/5 rounded-[28px] gap-2">
            <Clock size={24} className="text-white/10" />
            <p className="text-[10px] text-white/20">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.slice(0, 6).map((item, i) => {
              const kind = ACTIVITY_ICON[item.type] || ACTIVITY_ICON.pickup;
              const Icon = kind.icon;
              return (
                <div key={i} className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-white/15 transition-all">
                  <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${kind.bg}`}>
                    <Icon size={14} className={kind.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-black text-white truncate">{item.title || item.description}</p>
                    <p className="text-[9px] text-white/30">{item.subtitle || item.location}</p>
                  </div>
                  <span className="text-[9px] text-white/20 shrink-0">{item.time_ago || item.time}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Online Status Card */}
      <div className="col-span-12 lg:col-span-4">
        <div className="bg-white/[0.02] border border-white/5 rounded-[28px] p-5 h-full flex flex-col justify-between">
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-4">Courier Status</p>
            <div className="flex items-center gap-3 p-3 bg-[#08CB00]/5 border border-[#08CB00]/20 rounded-2xl mb-3">
              <span className="w-2.5 h-2.5 bg-[#08CB00] rounded-full animate-pulse shrink-0" />
              <div>
                <p className="text-[11px] font-black text-[#08CB00]">Online & Available</p>
                <p className="text-[9px] text-white/30">Accepting new jobs</p>
              </div>
            </div>
            <div className="space-y-2 text-[10px]">
              {[
                { label: 'Jobs Accepted Today', value: activity?.filter(a => a.type === 'pickup').length ?? '—' },
                { label: 'Avg Rating',           value: '4.9 ★' },
                { label: 'On-time Rate',          value: '96%' },
              ].map(r => (
                <div key={r.label} className="flex justify-between text-white/40">
                  <span>{r.label}</span>
                  <span className="font-black text-white/70">{r.value}</span>
                </div>
              ))}
            </div>
          </div>
          <button className="mt-4 w-full py-3 bg-white/5 border border-white/10 text-white/40 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-white/10 hover:text-white transition-all">
            Go Offline
          </button>
        </div>
      </div>
    </div>
  );
}