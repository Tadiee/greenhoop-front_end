"use client"
import { RefreshCw, CheckCircle2, Clock, Layers } from 'lucide-react';

export default function HeroCardComp({ totalBatches, completedCount, pendingCount, loading, onRefresh }) {
  return (
    <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-white/5 rounded-[40px] p-8 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#08CB00]/10 rounded-full blur-[80px] pointer-events-none transition-all duration-700 group-hover:scale-110" />

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <span className="text-[#08CB00] text-[9px] font-black uppercase tracking-widest bg-[#08CB00]/10 border border-[#08CB00]/20 px-3 py-1.5 rounded-lg mb-4 inline-block">
            Stewardship Overview
          </span>
          <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tighter leading-tight max-w-md">
            Material Inventory<br />& Tracking
          </h2>
        </div>

        <div className="flex gap-3 z-0 flex-wrap">
          <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4 min-w-[110px]">
            <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1 flex items-center gap-1"><Layers size={10} /> Total</p>
            <p className="text-3xl font-black text-white">{loading ? '—' : totalBatches}</p>
          </div>
          <div className="bg-[#08CB00]/5 border border-[#08CB00]/20 backdrop-blur-md rounded-2xl p-4 min-w-[110px]">
            <p className="text-[9px] font-black text-[#08CB00]/60 uppercase tracking-widest mb-1 flex items-center gap-1"><CheckCircle2 size={10} /> Completed</p>
            <p className="text-3xl font-black text-[#08CB00]">{loading ? '—' : completedCount}</p>
          </div>
          <div className="bg-yellow-500/5 border border-yellow-500/20 backdrop-blur-md rounded-2xl p-4 min-w-[110px]">
            <p className="text-[9px] font-black text-yellow-400/60 uppercase tracking-widest mb-1 flex items-center gap-1"><Clock size={10} /> Pending</p>
            <p className="text-3xl font-black text-yellow-400">{loading ? '—' : pendingCount}</p>
          </div>
          <button onClick={onRefresh} className="bg-[#08CB00] text-black rounded-2xl p-4 flex items-center justify-center hover:bg-[#07b300] transition-colors shadow-[0_0_15px_rgba(8,203,0,0.3)]">
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>
    </div>
  );
}