"use client"
import React from 'react';
import { 
  Info, CreditCard, 
} from 'lucide-react';

export default function OutflowComp() {
    return (
        <>
            <div className="w-1/3 bg-[#08CB00] rounded-[48px] p-8 text-black flex flex-col justify-between relative overflow-hidden group shadow-2xl">
                {/* Main Figure */}
                <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2 opacity-60">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">Total Outflow</p>
                    <div className="group/tip relative cursor-help">
                        <Info size={12} className="text-black" />
                    </div>
                </div>
                <h2 className="text-7xl font-black italic tracking-tighter leading-none">$24,280<span className="text-xl opacity-40 ml-1">.00</span></h2>
                <div className="mt-6 flex items-center gap-3">
                    <div className="p-2 bg-black text-[#08CB00] rounded-xl"><CreditCard size={18} strokeWidth={3} /></div>
                    <p className="text-[10px] font-black uppercase tracking-widest leading-tight">Standard Settlement <br/> Cycle: Jan 2026</p>
                </div>
                </div>
                <div className="relative z-10 border-t border-black/10 pt-6">
                <div className="flex justify-between items-center"><span className="text-[9px] font-black uppercase opacity-60 tracking-widest">Budget Variance</span><span className="text-[11px] font-black italic">-4.2%</span></div>
                <div className="h-1.5 w-full bg-black/10 rounded-full overflow-hidden mt-3"><div className="h-full bg-black/30 w-[65%]"></div></div>
                </div>
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-black/5 rounded-full blur-2xl"></div>
            </div>
        </>
    );
}