"use client"
import React from 'react';
import { 
  Zap, Download, FileText, ShieldCheck, PieChart, 
  BarChart3, Globe, Activity, LayoutGrid, Info, 
  Settings, ChevronRight, Share2, Calendar, HardDrive, Filter,
  CheckCircle2, Leaf, ArrowUpRight, Plus
} from 'lucide-react';

export default function AuditGeneration() {
    return (
        <>
            <div className="col-span-7 bg-[#1D1D1D] rounded-[48px] p-8 flex flex-col shadow-2xl overflow-hidden relative group">
                {/* Timeline Header */}
                <div className="flex justify-between items-center mb-6 shrink-0 relative z-10">
                    <div className="flex items-center gap-4">
                    <div className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-white">Tue, 21st</div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/20">Audit Generation Timeline</h3>
                    </div>
                    <div className="flex items-center gap-4">
                    <div className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 text-white">
                        <Calendar size={12}/> October 2025
                    </div>
                    <button className="p-3 bg-white/5 rounded-2xl text-white/20 hover:text-white transition-colors">
                        <Filter size={18}/>
                    </button>
                    </div>
                </div>

                {/* Horizontal Scrollable Registry Cards */}
                <div className="flex-1 flex gap-4 overflow-x-auto scrollbar-none pb-2 relative z-10">
                    {[
                    { t: '10:00 am', n: 'Mineral Yield Scan', sub: 'Harare Main Hub', tag: 'Verified' },
                    { t: '11:00 am', n: 'Batch #881 Generation', sub: 'Regional Disclosure', tag: 'Processing' },
                    { t: '01:00 pm', n: 'CO2 Offset Validation', sub: 'System Wide Audit', tag: 'Awaiting' },
                    ].map((audit, i) => (
                    <div key={i} className="flex-shrink-0 w-72 p-6 bg-white/[0.03] border border-white/5 rounded-[32px] flex flex-col justify-between group/item hover:bg-white/[0.06] transition-all cursor-pointer">
                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-4">{audit.t}</p>
                        <div>
                            <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#08CB00]"></div>
                            <h4 className="text-sm font-bold italic text-white">{audit.n}</h4>
                            </div>
                            <p className="text-[10px] font-bold text-white/20 mt-2 ml-4 uppercase tracking-[0.2em]">{audit.sub}</p>
                        </div>
                        <div className="mt-8 flex justify-between items-center">
                            <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-md border ${audit.tag === 'Verified' ? 'border-[#08CB00]/20 text-[#08CB00]' : 'border-white/10 text-white/20'}`}>{audit.tag}</span>
                            <Download size={14} className="text-white/20 group-hover/item:text-white transition-colors" />
                        </div>
                    </div>
                    ))}
                    {/* Rapid Action Toggle */}
                    <button className="flex-shrink-0 w-20 h-full rounded-[32px] bg-[#08CB00] text-black flex items-center justify-center hover:scale-105 transition-transform shadow-xl shadow-[#08CB00]/20">
                    <Plus size={24} strokeWidth={4} />
                    </button>
                </div>
                {/* Reactive Background Ambient */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#08CB00]/5 via-transparent to-transparent pointer-events-none"></div>
            </div>
        </>
    );
}