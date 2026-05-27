"use client"
import React from 'react';
import { 
    ArrowUpRight
} from 'lucide-react';

export default function Insights() {
    return (
        <>
            <div className="w-1/4 bg-[#1D1D1D] rounded-[40px] p-8 flex flex-col justify-between group">
               <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold">Narrative Insights</h3>
                  <button className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center group-hover:bg-accent-green transition-colors shadow-xl">
                     <ArrowUpRight size={18} />
                  </button>
               </div>
               {/* Vertical Bar Chart */}
               <div className="flex-1 flex items-end gap-2.5 mt-8 px-2 h-[90%]">
                  {[20, 35, 25, 60, 45, 30, 40].map((h, i) => (
                     <div key={i} className="flex-1 flex flex-col items-center gap-3 h-full justify-end">
                        <div style={{ height: `${h}%` }} className={`w-full rounded-full transition-all duration-700 ${i === 3 ? 'bg-accent-green' : 'bg-white/10'}`}></div>
                        <span className="text-[9px] font-bold text-white/20 uppercase tracking-tighter">{['Mo','Tu','We','Th','Fr','Sa','Su'][i]}</span>
                     </div>
                  ))}
               </div>
               <div className="mt-8 flex justify-between items-end">
                  <span className="text-xs font-bold text-white/20 uppercase">Total</span>
                  <span className="text-3xl font-bold tracking-tighter">42.8t</span>
               </div>
            </div>
         
        </>
    );
}