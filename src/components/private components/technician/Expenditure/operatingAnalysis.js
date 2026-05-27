"use client"
import React from 'react';
import { 
  Download, Filter, 
  ChevronRight, 
  PieChart, Info, Search, Building2, ShieldCheck, Package, TrendingUp, CreditCard, 
} from 'lucide-react';

export default function OperatingAnalysisComp() {
    return (
        <>
            <div className="h-2/3 bg-[#0A0A0A] border border-white/5 rounded-[56px] p-10 flex flex-col relative overflow-hidden group shadow-2xl">
            
                {/* 01. HEADER: LIQUIDITY & CONTROLS */}
                <div className="flex justify-between items-start mb-10 relative z-10 shrink-0">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#08CB00]">Fiscal Operating Analysis</h3>
                            <div className="group/tip relative cursor-help">
                            <Info size={12} className="text-white/20" />
                            <div className="absolute left-0 top-6 w-48 p-3 bg-black border border-white/10 rounded-xl text-[8px] font-bold text-white/60 leading-tight opacity-0 group-hover/tip:opacity-100 z-50 pointer-events-none transition-opacity">
                                Consolidated view of operational outflow, logistics payouts, and facility maintenance.
                            </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex flex-col">
                            <p className="text-6xl font-black italic tracking-tighter leading-none">$18,920</p>
                            <p className="text-[9px] font-black uppercase text-white/20 mt-2 tracking-widest">— Monthly Operative Total</p>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-black text-[#08CB00] bg-[#08CB00]/10 px-2 py-1 rounded-md border border-[#08CB00]/20">
                            <TrendingUp size={12} /> +12.8%
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex p-1 bg-black border border-white/10 rounded-xl">
                            {['Day', 'Month', 'Year'].map((t, i) => (
                            <button key={t} className={`px-5 py-2 text-[9px] font-black uppercase rounded-lg transition-all ${i === 1 ? 'bg-white/10 text-white' : 'text-white/20 hover:text-white'}`}>
                                {t}
                            </button>
                            ))}
                        </div>
                        <button className="p-4 bg-[#08CB00] text-black rounded-2xl shadow-xl shadow-[#08CB00]/20 hover:bg-white transition-all">
                            <Download size={20} strokeWidth={3} />
                        </button>
                    </div>
                </div>

                {/* 02. CORE ANALYSIS GRID */}
                <div className="flex-1 flex gap-12 relative z-10">
                    
                    {/* COLUMN A: HARDENED VOLUMETRIC TRENDS */}
                    <div className="flex-[2] relative flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-[9px] font-black uppercase tracking-widest text-white/20">Expenditure Pulse (12-Month Cycle)</p>
                            <div className="flex gap-2">
                            <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-[#08CB00] rounded-full"></div><span className="text-[7px] font-black uppercase text-white/40">Verified</span></div>
                            <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-white/10 rounded-full"></div><span className="text-[7px] font-black uppercase text-white/40">Projected</span></div>
                            </div>
                        </div>
                        
                        <div className="flex-1 relative flex items-center gap-3 pb-6 h-[80%]">
                            {/* Technical Ruler Grid */}
                            <div className="absolute inset-0 flex flex-col justify-between py-2 opacity-[0.03] pointer-events-none">
                            {[...Array(6)].map((_, i) => <div key={i} className="w-full h-[1px] bg-white"></div>)}
                            </div>

                            {[40, 70, 45, 90, 65, 80, 55, 100, 85, 40, 75, 95].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center justify-end gap-3 relative group/bar h-full">
                                <div 
                                    style={{ height: `${h}%` }} 
                                    className={`w-full rounded-t-sm transition-all duration-500 ${i === 7 ? 'bg-accent-green' : 'bg-white/5 group-hover/bar:bg-white/10'}`}
                                ></div>
                                <span className="text-[8px] font-black text-white/20 uppercase tracking-tighter">{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</span>
                            </div>
                            ))}
                        </div>
                    </div>

                    {/* COLUMN B: CATEGORICAL BURN-RATE */}
                    <div className="flex-1 flex flex-col justify-between pl-12 border-l border-white/5">
                        <div className="space-y-8">
                            <div className="flex items-center gap-6">
                            {/* Radial Efficiency */}
                            <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                                <svg viewBox="0 0 36 36" className="w-full h-full rotate-[-90deg]">
                                    <circle cx="18" cy="18" r="16" fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="4" />
                                    <circle cx="18" cy="18" r="16" fill="none" stroke="#08CB00" strokeWidth="4" strokeDasharray="65, 100" />
                                </svg>
                                <span className="absolute text-[10px] font-black italic">65%</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase text-[#08CB00]">Dominant Stream</p>
                                <p className="text-xl font-black italic leading-tight uppercase">Logistics <br/> Payouts</p>
                            </div>
                            </div>

                            <div className="space-y-5">
                            {[{ l: 'Personnel', v: '20%', c: 'white' }, { l: 'Facility', v: '15%', c: 'rgba(255,255,255,0.2)' }].map(cat => (
                                <div key={cat.l} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[8px] font-black uppercase tracking-widest text-white/30">{cat.l}</span>
                                        <span className="text-[10px] font-black italic">{cat.v}</span>
                                    </div>
                                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div style={{ width: cat.v, backgroundColor: cat.c }} className="h-full"></div>
                                    </div>
                                </div>
                            ))}
                            </div>
                        </div>

                        {/* STATISTIC INFERENCE CARD */}
                        <div className="p-5 bg-white/[0.03] border border-white/5 rounded-[32px] flex items-center gap-4 group/card hover:border-[#08CB00]/30 transition-all">
                            <div className="p-2.5 bg-black rounded-xl text-white/20 group-hover/card:text-[#08CB00] transition-colors">
                            <PieChart size={18} />
                            </div>
                            <div>
                            <p className="text-[8px] font-black uppercase text-white/20 tracking-widest">Budget Utilization</p>
                            <p className="text-sm font-black italic">Optimal Operating Range</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RADIANT AMBIENCE */}
                <div className="absolute -right-48 -bottom-48 w-[600px] h-[600px] bg-[#08CB00]/5 rounded-full blur-[120px] pointer-events-none"></div>
            </div>
           
        </>
    );
}