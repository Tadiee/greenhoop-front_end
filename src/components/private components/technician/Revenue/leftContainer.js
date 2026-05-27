"use client"
import React from 'react';
import { 
  Download, Filter, FileText, TrendingUp, DollarSign, 
  User, ArrowUpRight, Calendar, Search, Bell, PieChart,
  BarChart3, LayoutGrid, ChevronRight, MoreHorizontal
} from 'lucide-react';

export default function LeftContainer() {
    return (
        <>
        <aside className="w-80 bg-[#0A0A0A] border-r border-white/5 flex flex-col p-8 shrink-0 hidden lg:flex rounded-r-[48px] h-[80%]">
            <div className="mb-10 flex items-center gap-3">
            <div className="w-8 h-8 bg-[#08CB00] rounded-lg flex items-center justify-center rotate-3">
                <DollarSign size={18} className="text-black" />
            </div>
            <h2 className="text-xs font-black uppercase tracking-[0.3em]">Revenue <span className="text-white/20">Config</span></h2>
            </div>


            <div className="flex-1 space-y-10">
            {/* Report Preferences */}
            <div className="space-y-6">
                <p className="text-[9px] font-black uppercase text-white/20 tracking-widest">Report Parameters</p>
                
                <div className="space-y-4">
                    <label className="block space-y-2">
                        <span className="text-[10px] font-bold text-white/40 uppercase">Temporal Range</span>
                        <select className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-[10px] font-black uppercase italic outline-none text-[#08CB00]">
                        <option>Fiscal Quarter Q1 2026</option>
                        <option>Last 30 Days</option>
                        <option>Custom Range</option>
                        </select>
                    </label>

                    <label className="block space-y-2">
                        <span className="text-[10px] font-bold text-white/40 uppercase">Sector Filter</span>
                        <div className="grid grid-cols-2 gap-2">
                        {['Mbare', 'CBD', 'Avondale', 'A-01'].map(tag => (
                            <button key={tag} className="py-2 bg-white/5 border border-white/10 rounded-lg text-[8px] font-black uppercase hover:border-[#08CB00] transition-colors">
                                {tag}
                            </button>
                        ))}
                        </div>
                    </label>

                    <div className="space-y-3 pt-4">
                        <span className="text-[10px] font-bold text-white/40 uppercase">Output Data</span>
                        {['Marketplace Sales', 'Salvage Fees', 'Payout Credits', 'Logistics Tax'].map(opt => (
                        <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                            <div className="w-4 h-4 bg-white/5 border border-white/10 rounded flex items-center justify-center group-hover:border-[#08CB00] transition-colors">
                                <div className="w-1.5 h-1.5 bg-[#08CB00] rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                            <span className="text-[9px] font-black uppercase text-white/60 tracking-widest">{opt}</span>
                        </label>
                        ))}
                    </div>
                </div>
            </div>
            </div>

            {/* Download Action */}
            <button className="w-full mt-auto py-5 bg-[#08CB00] text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#08CB00]/10 flex items-center justify-center gap-3 hover:scale-[1.02] transition-all">
            <Download size={14} strokeWidth={3} /> Download Statement [.PDF]
            </button>
        </aside>
        </>
    );
}