"use client"
import React from 'react';
import { 
    ArrowUpRight
} from 'lucide-react';

export default function Revenue() {
    return (
        <>
            <div className="w-1/4 bg-[#1D1D1D] rounded-[40px] p-8 flex flex-col justify-between group">
               <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold">Revenue by stream</h3>
                  <button className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center group-hover:bg-accent-green transition-colors">
                     <ArrowUpRight size={18} />
                  </button>
               </div>
               <div className="flex-1 flex flex-col items-center justify-center py-4">
                  {/* Doughnut Chart */}
                  <div className="relative w-32 h-32 flex items-center justify-center">
                     <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                        <circle cx="18" cy="18" r="16" fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="3" strokeDasharray="100, 100" />
                        <circle cx="18" cy="18" r="16" fill="none" stroke="#08CB00" strokeWidth="3" strokeDasharray="74, 100" strokeLinecap="round" />
                     </svg>
                     <div className="absolute text-center">
                        <p className="text-xl font-bold italic">74%</p>
                        <p className="text-[8px] font-bold text-white/20 uppercase">Auth.</p>
                     </div>
                  </div>
                  <div className="mt-4 flex gap-6 text-[10px] font-bold uppercase tracking-widest text-white/20">
                     <span>Goal</span>
                     <span className="text-white">100%</span>
                  </div>
               </div>
            </div>
            
        </>
    )
}