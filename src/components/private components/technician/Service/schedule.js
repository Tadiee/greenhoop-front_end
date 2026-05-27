"use client"
import React, { useState } from 'react';
import { 
  MapPin,  Calendar, 
} from 'lucide-react';

export default function Scheduler () {
    return (
        <>
                    <div className="bg-white/[0.02] border border-white/5 rounded-[48px] p-5 flex flex-col justify-between group shadow-2xl relative overflow-hidden">
                <div className="flex justify-between items-start mb-10">
                    <div className="space-y-1 ml-5">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Temporal Bounds</h3>
                    <p className="text-[8px] font-bold text-[#08CB00] uppercase tracking-widest">99.8% Uptime Score</p>
                    </div>
                    <Calendar size={20} className="text-white/20 mr-5" />
                </div>

                <div className="space-y-10 relative z-10">
                    {/* Day Selector */}
                    <div className="flex justify-between">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                        <div key={i} className="flex flex-col items-center gap-3">
                        <span className="text-[8px] font-black text-white/20">{day}</span>
                        <button className={`w-10 h-10 rounded-2xl flex items-center justify-center text-[10px] font-black transition-all ${i < 1 ? 'bg-[#08CB00] text-black shadow-lg shadow-[#08CB00]/20' : 'bg-white/5 text-white/20 border border-white/5'}`}>
                            {i + 1}
                        </button>
                        </div>
                    ))}
                    </div>

                    {/* Radius Slider Concept */}
                    <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <p className="text-[9px] font-black uppercase text-white/30 tracking-widest flex items-center gap-2"><MapPin size={12}/> Service Radius</p>
                        <p className="text-xl font-black italic tracking-tighter text-[#08CB00]">5.0<span className="text-[10px] ml-1 opacity-40 uppercase font-black">km</span></p>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-[#08CB00] w-[50%]"></div>
                    </div>
                    </div>

                    {/* Daily Capacity */}
                    <div className="flex justify-between items-center pt-8 border-t border-white/10 mx-5">
                    <div>
                        <p className="text-[10px] font-black uppercase text-white/40 tracking-widest">Capacity Limit</p>
                        <p className="text-xs font-black text-white/20 uppercase mt-1">Max dispatches per cycle</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all">-</button>
                        <span className="text-3xl font-black italic">08</span>
                        <button className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#08CB00] hover:text-black transition-all">+</button>
                    </div>
                    </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-tr from-[#08CB00]/5 via-transparent to-transparent pointer-events-none"></div>
            </div>
        </>
    );
}