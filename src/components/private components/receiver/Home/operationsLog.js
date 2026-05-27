"use client"
import React from 'react';
import { Truck, PackageCheck, History, CheckCircle2, Clock, Loader2, ShieldCheck } from 'lucide-react';
import Ministats from './ministats';

const EVENT_CONFIG = {
  received:  { icon: Truck,         cls: 'bg-blue-500/10 border-blue-500/20 text-blue-400' },
  dispatched:{ icon: PackageCheck,  cls: 'bg-[#08CB00]/10 border-[#08CB00]/20 text-[#08CB00]' },
  completed: { icon: CheckCircle2,  cls: 'bg-[#08CB00]/10 border-[#08CB00]/20 text-[#08CB00]' },
  audit:     { icon: ShieldCheck,   cls: 'bg-white/5 border-white/10 text-white/40' },
};

export default function OperationsLog({ homeStats = {}, activityLog = [], loading }) {
  return (
    <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">

      <Ministats homeStats={homeStats} loading={loading} />

      <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-[40px] p-6 sm:p-8 shadow-2xl flex-1 flex flex-col relative overflow-hidden">

        <div className="flex justify-between items-center mb-6 relative z-10">
          <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-3">
            <div className="bg-white/5 p-2 rounded-xl border border-white/10">
              <History size={18} className="text-[#08CB00]" />
            </div>
            Site Activity Log
          </h2>
          <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">
            {activityLog.length} events
          </span>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-none space-y-3 relative z-10 pr-2">
          {loading ? (
            <div className="flex items-center justify-center py-10 gap-2">
              <Loader2 size={14} className="text-[#08CB00] animate-spin" />
              <span className="text-[10px] text-white/30">Loading activity...</span>
            </div>
          ) : activityLog.length === 0 ? (
            <div className="flex items-center justify-center py-10">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/20">No activity recorded yet</p>
            </div>
          ) : activityLog.map((log, i) => {
            const cfg = EVENT_CONFIG[log.event_type] || EVENT_CONFIG.audit;
            const Icon = cfg.icon;
            return (
              <div key={log.id || i}
                className="bg-black/40 border border-white/5 p-4 sm:p-5 rounded-[24px] hover:bg-white/5 hover:border-white/10 transition-all duration-300 cursor-pointer group flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-300 ${cfg.cls}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-black text-white truncate">{log.description || log.action}</h4>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-0.5 truncate">
                      {log.detail || log.item}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-center shrink-0 text-right ml-4">
                  <div className="flex items-center gap-1.5 text-white/30 group-hover:text-white/60 transition-colors">
                    <Clock size={10} />
                    <p className="text-[9px] font-bold uppercase tracking-widest">{log.time_ago || log.time}</p>
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#08CB00] opacity-0 group-hover:opacity-100 transition-all duration-300">
                    View &rarr;
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black/20 to-transparent pointer-events-none z-20" />
      </div>
    </div>
  );
}