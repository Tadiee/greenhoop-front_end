"use client"
import React, { useState } from 'react';
import { 
  Radio, Smartphone
} from 'lucide-react';

export default function Radar () {
      const [isScanning, setIsScanning] = useState(true);
    return (
        <>
            <div className="h-[100%] bg-[#0A0A0A] border border-white/5 rounded-[56px] p-8 flex flex-col relative overflow-hidden shadow-2xl group">
               <div className="flex justify-between items-center mb-6 relative z-10">
                  <div className="flex items-center gap-3">
                     <Radio size={15} className={`transition-colors ${isScanning ? 'text-[#08CB00] animate-pulse' : 'text-white/20'}`} />
                     <h3 className="text-xs font-black uppercase tracking-widest text-white/40">Vicinity Waste Radar</h3>
                  </div>
                  <button className="text-[10px] font-black uppercase text-[#08CB00] tracking-widest hover:underline" onClick={() => setIsScanning(!isScanning)}>
                     {isScanning ? 'Stop Pulse' : 'Start Pulse'}
                  </button>
               </div>

               {/* Radar Visualizer */}
               <div className="flex-1 relative flex items-center justify-center">
                  <div className={`absolute w-64 h-64 border border-[#08CB00]/20 rounded-full transition-all duration-[2000ms] ${isScanning ? 'scale-150 opacity-5 animate-pulse' : 'scale-100 opacity-20'}`}></div>
                  <div className="absolute w-48 h-48 border border-[#08CB00]/10 rounded-full"></div>
                  <div className="z-10 bg-black p-4 rounded-3xl border border-white/10 flex items-center gap-4 animate-bounce">
                     <Smartphone size={20} className="text-[#08CB00]" />
                     <div>
                        <p className="text-[10px] font-black italic">iPhone 12 - Broken Glass</p>
                        <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest">0.8km Away • Mbare Central</p>
                     </div>
                  </div>
               </div>
               <div className="absolute inset-0 bg-gradient-to-tr from-[#08CB00]/5 via-transparent to-transparent pointer-events-none"></div>
            </div>
        </>
    );
}