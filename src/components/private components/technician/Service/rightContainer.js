"use client"
import React, { useState } from 'react';
import { 
  Wrench, Database, 
  Smartphone, Plus, Cpu, DollarSign, TrendingUp, 
} from 'lucide-react';

export default function RightContainer () {
    return (
        <>
        <div className="lg:col-span-3 flex flex-col gap-8 h-full">
            
            {/* --- SERVICE PORTFOLIO MANAGER (Responsive Grid) --- */}
            <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[48px] p-4 shadow-2xl group relative overflow-hidden">
            <div className="flex justify-between items-center mb-5 relative z-10">
                <div className="space-y-1 ml-5">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#08CB00]">Capability Matrix</h3>
                <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Define Operational Limits</p>
                </div>
                <button className="p-3 bg-[#08CB00] text-black rounded-2xl hover:scale-105 transition-all shadow-lg shadow-[#08CB00]/20 mr-5">
                <Plus size={18} strokeWidth={3} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                {[
                { type: 'Device Repair', active: true, icon: Wrench, cat: ['Phones', 'Laptops'] },
                { type: 'Component Salvage', active: true, icon: Cpu, cat: ['PCs', 'Servers'] },
                { type: 'Data Wiping', active: true, icon: Database, cat: ['Storage Units'] },
                { type: 'AV Diagnostics', active: false, icon: Smartphone, cat: ['Monitors', 'TVs'] }
                ].map((service, i) => (
                <div key={i} className={`p-6 rounded-[32px] border transition-all flex flex-col justify-between h-44 ${service.active ? 'bg-white/5 border-white/10' : 'bg-black/40 border-white/5 opacity-40'}`}>
                    <div className="flex justify-between items-start">
                    <div className={`p-3 rounded-2xl ${service.active ? 'bg-[#08CB00]/10 text-[#08CB00]' : 'bg-white/5 text-white/20'}`}>
                        <service.icon size={20} />
                    </div>
                    <button className={`w-10 h-5 rounded-full relative transition-colors ${service.active ? 'bg-[#08CB00]' : 'bg-white/10'}`}>
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${service.active ? 'right-1' : 'left-1'}`}></div>
                    </button>
                    </div>
                    <div>
                    <h4 className="text-xs font-black italic uppercase text-white/80">{service.type}</h4>
                    <p className="text-[8px] font-black uppercase tracking-widest text-white/20 mt-2">{service.cat.join(' • ')}</p>
                    </div>
                </div>
                ))}
            </div>
            </div>

            {/* --- PRICING & REWARD RULES (Spatial Layering) --- */}
            <div className="bg-[#0A0A0A] border border-white/10 rounded-[48px] p-6 shadow-3xl relative overflow-hidden">
                <div className="flex items-center gap-4 mb-5">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-[#08CB00]">
                    <DollarSign size={24} />
                    </div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em]">Compensation Logic</h3>
                </div>

                <div className="space-y-6 relative z-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase text-white/30 tracking-widest ml-4">Salvage Reward Rate</label>
                        <div className="bg-black/60 border border-white/5 p-6 rounded-[32px] flex items-end gap-2 group hover:border-[#08CB00]/40 transition-all">
                        <input className="bg-transparent text-4xl font-black italic tracking-tighter w-full outline-none text-[#08CB00]" defaultValue="20" />
                        <span className="text-xs font-black text-white/20 pb-2 uppercase italic">pts/kg</span>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase text-white/30 tracking-widest ml-4">Base Repair Fee</label>
                        <div className="bg-black/60 border border-white/5 p-6 rounded-[32px] flex items-end gap-2 group hover:border-[#08CB00]/40 transition-all">
                        <span className="text-2xl font-black text-white/20 pb-1">$</span>
                        <input className="bg-transparent text-4xl font-black italic tracking-tighter w-full outline-none" defaultValue="10" />
                        <span className="text-xs font-black text-white/20 pb-2 uppercase italic">/job</span>
                        </div>
                    </div>
                    </div>

                    <div className="p-6 bg-[#08CB00]/5 border border-[#08CB00]/20 rounded-3xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <TrendingUp size={20} className="text-[#08CB00]" />
                        <div>
                        <p className="text-[10px] font-black uppercase tracking-widest">Platform Commission</p>
                        <p className="text-[8px] font-bold text-white/40 uppercase mt-1">Sovereign Grade Tier: 5% Applied</p>
                        </div>
                    </div>
                    <p className="text-xl font-black italic">-$0.50<span className="text-[8px] ml-1 opacity-20 uppercase">Avg</span></p>
                    </div>
                </div>
                <div className="absolute -right-24 -bottom-24 w-72 h-72 bg-[#08CB00]/5 rounded-full blur-[100px] pointer-events-none"></div>
            </div>
         </div>
        </>
    );
}