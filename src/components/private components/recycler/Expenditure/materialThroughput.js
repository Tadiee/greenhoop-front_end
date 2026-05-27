"use client"
import React from 'react';
import { 
  Package, 
} from 'lucide-react';

export default function MaterialThroughputComp() {
    return (
        <>
              <div className="h-1/3 bg-[#0A0A0A] border border-white/5 rounded-[48px] p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl group">
                <div className="flex justify-between items-start relative z-10">
                    <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Material Throughput</p>
                    <h4 className="text-5xl font-black italic tracking-tighter leading-none mt-1">
                        11.<span className="text-white/10">8</span>
                    </h4>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-[9px] font-black text-[#08CB00] uppercase tracking-widest">Tons Received</span>
                        <div className="px-1.5 py-0.5 bg-[#08CB00]/10 text-[8px] font-bold text-[#08CB00] rounded">+4.2%</div>
                    </div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-2xl text-white/20 group-hover:text-[#08CB00] transition-colors">
                    <Package size={20} />
                    </div>
                </div>

                {/* Processing Load Gauge */}
                <div className="pt-8 border-t border-white/5 relative z-10">
                    <div className="flex justify-between items-end mb-3">
                    <div>
                        <span className="text-[9px] font-black uppercase text-white/30 tracking-widest block">Processing Load</span>
                        <span className="text-[8px] font-bold text-white/10 uppercase">Harare Sector Peak</span>
                    </div>
                    <span className="text-xl font-black italic text-[#08CB00]">84%</span>
                    </div>
                    {/* Segmented Gauge style */}
                    <div className="flex gap-1">
                    {Array.from({ length: 15 }).map((_, i) => (
                        <div 
                            key={i} 
                            className={`h-1.5 flex-1 rounded-sm ${i < 12 ? 'bg-[#08CB00]' : 'bg-white/5'}`}
                        ></div>
                    ))}
                    </div>
                </div>

                {/* Ambient Background Glow */}
                <div className="absolute -right-12 -top-12 w-48 h-48 bg-[#08CB00]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#08CB00]/10 transition-all"></div>
            </div>
        </>
    );
}