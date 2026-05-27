"use client"
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ShieldCheck, MapPin } from 'lucide-react';

const PLACEHOLDER = [
  { first_name: 'No', last_name: 'Drivers', status: 'N/A', total_rides: 0, efficiency_pct: 0, sector: '—' },
];

export default function DriversCount({ drivers: driversProp = [], loading }) {
  const drivers = driversProp.length > 0 ? driversProp : PLACEHOLDER;

      
        const [index, setIndex] = useState(0);

        const next = () => setIndex((prev) => (prev + 1) % drivers.length);
        const prev = () => setIndex((prev) => (prev - 1 + drivers.length) % drivers.length);
    return (
        <>
                <div className="relative h-72 w-full group">
                    {/* --- BACKGROUND DECK (Visual Depth) --- */}
                    <div className="absolute top-2 left-4 right-4 h-full bg-white/[0.02] border border-white/5 rounded-[40px] transform scale-[0.98] -translate-y-4"></div>
                    <div className="absolute top-2 left-8 right-8 h-full bg-white/[0.01] border border-white/5 rounded-[40px] transform scale-[0.95] -translate-y-8"></div>

                    {/* --- ACTIVE CARD --- */}
                    <div className="relative bg-[#121212] border border-white/10 rounded-[40px] p-8 h-full shadow-3xl overflow-hidden flex flex-col justify-between z-10">
                        
                        {/* Header: Global Stats Anchor */}
                        <div className="flex justify-between items-start relative z-20">
                        <div className="space-y-1">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#08CB00]">Active Drivers</h3>
                            <div className="flex gap-2">
                            <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">{driversProp.length} Total</span>
                            <span className="text-[8px] font-black text-[#08CB00] uppercase tracking-widest">{drivers[index].efficiency_pct != null ? `${drivers[index].efficiency_pct}% Efficiency` : ''}</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={prev} className="p-2 bg-white/5 rounded-full hover:bg-[#08CB00] hover:text-black transition-all text-white/20">
                            <ChevronLeft size={14} strokeWidth={3} />
                            </button>
                            <button onClick={next} className="p-2 bg-white/5 rounded-full hover:bg-[#08CB00] hover:text-black transition-all text-white/20">
                            <ChevronRight size={14} strokeWidth={3} />
                            </button>
                        </div>
                        </div>

                        {/* Profile Content */}
                        <div className="flex-1 flex items-center gap-6 relative z-20 pt-4">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-3xl bg-black border border-white/10 flex items-center justify-center overflow-hidden">
                                <div className="text-2xl font-black italic text-[#08CB00]">{(drivers[index].first_name || drivers[index].name || '?')[0]}</div>
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-[#08CB00] text-black p-1.5 rounded-xl shadow-lg">
                                <ShieldCheck size={12} strokeWidth={3} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-3xl font-black italic tracking-tighter leading-none">{drivers[index].first_name ? `${drivers[index].first_name} ${drivers[index].last_name || ''}`.trim() : (drivers[index].name || '—')}</h4>
                            <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                                <MapPin size={10} className="text-[#08CB00]" />
                                <span className="text-[8px] font-black uppercase tracking-widest">{drivers[index].sector}</span>
                            </div>
                            <span className="text-[8px] font-black text-[#08CB00] uppercase italic underline underline-offset-4 tracking-widest">
                                {drivers[index].status}
                            </span>
                            </div>
                        </div>
                        </div>

                        {/* Footer Metrics */}
                        <div className="flex justify-between items-end relative z-20 border-t border-white/5 pt-4">
                        <div>
                            <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Unit Performance</p>
                            <p className="text-xl font-black italic text-white/90">{drivers[index].efficiency_pct != null ? `${drivers[index].efficiency_pct}%` : (drivers[index].efficiency || '—')}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Total Trips</p>
                            <p className="text-xl font-black italic text-white/90">{drivers[index].total_rides ?? drivers[index].rides ?? 0}</p>
                        </div>
                        </div>

                        {/* Ambient Spatial Glow */}
                        <div className="absolute -right-24 -bottom-24 w-72 h-72 bg-[#08CB00]/5 rounded-full blur-[100px] pointer-events-none transition-all duration-1000"></div>
                    </div>
                </div>
        </>
    );
}