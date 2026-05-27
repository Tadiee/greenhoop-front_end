"use client"
import React from 'react';
import { AlertTriangle, Truck, PackageCheck, Bell, RefreshCw, Loader2, ArrowRight } from 'lucide-react';

const TYPE_CONFIG = {
  overdue:   { icon: AlertTriangle, cls: 'bg-red-500/10 border-red-500/20 text-red-400',     label: 'Overdue' },
  incoming:  { icon: Truck,         cls: 'bg-blue-500/10 border-blue-500/20 text-blue-400',   label: 'Incoming' },
  dispatch:  { icon: PackageCheck,  cls: 'bg-[#08CB00]/10 border-[#08CB00]/20 text-[#08CB00]', label: 'Dispatch' },
  alert:     { icon: Bell,          cls: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400', label: 'Alert' },
};

export default function ActionCenter({ notifications = [], loading, onRefresh }) {
  const urgentCount = notifications.filter(n => n.type === 'overdue' || n.type === 'alert').length;

  return (
    <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
      <div className="bg-transparent backdrop-blur-lg border border-white/5 rounded-[40px] p-6 sm:p-8 shadow-2xl flex flex-col h-full relative overflow-hidden group">

        <div className="absolute top-0 right-0 w-64 h-64 bg-[#08CB00]/5 rounded-full blur-3xl pointer-events-none transition-all duration-700 group-hover:scale-110 group-hover:bg-[#08CB00]/10" />

        <div className="flex justify-between items-center mb-6 relative z-10">
          <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-3">
            <div className="bg-[#08CB00]/10 p-2 rounded-xl border border-[#08CB00]/20">
              <Bell size={18} className="text-[#08CB00]" />
            </div>
            Action Center
          </h2>
          <div className="flex items-center gap-2">
            {urgentCount > 0 && (
              <span className="bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest">
                {urgentCount} Urgent
              </span>
            )}
            <button onClick={onRefresh} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all">
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-none space-y-3 relative z-10 pr-1">
          {loading ? (
            <div className="flex items-center justify-center py-10 gap-2">
              <Loader2 size={14} className="text-[#08CB00] animate-spin" />
              <span className="text-[10px] text-white/30">Loading notifications...</span>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <div className="w-12 h-12 rounded-full bg-[#08CB00]/10 border border-[#08CB00]/20 flex items-center justify-center">
                <PackageCheck size={20} className="text-[#08CB00]" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30">All clear — no pending actions</p>
            </div>
          ) : notifications.map((note) => {
            const cfg = TYPE_CONFIG[note.type] || TYPE_CONFIG.alert;
            const Icon = cfg.icon;
            return (
              <div key={note.id}
                className="bg-black/40 border border-white/5 p-4 rounded-[20px] hover:bg-white/5 hover:border-white/10 transition-all duration-300 cursor-pointer group/item flex items-center gap-4"
              >
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-300 ${cfg.cls}`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-black text-white truncate">{note.title}</h3>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-0.5 truncate">{note.description || note.status}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <p className="text-[9px] font-bold text-white/25 uppercase tracking-widest">{note.time_ago || note.time}</p>
                  <ArrowRight size={12} className="text-white/20 group-hover/item:text-white/60 transition-colors" />
                </div>
              </div>
            );
          })}
        </div>

        <button className="relative z-10 w-full mt-4 bg-transparent border border-white/10 text-white/50 hover:text-white hover:border-white/30 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300">
          View All Notifications
        </button>
      </div>
    </div>
  );
}