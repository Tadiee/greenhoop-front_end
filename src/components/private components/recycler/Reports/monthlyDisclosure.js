"use client"
import React from 'react';
import { 
  Zap, Download, FileText, ShieldCheck, PieChart, 
  BarChart3, Globe, Activity, LayoutGrid, Info, 
  Settings, ChevronRight, Share2, Calendar, HardDrive, Filter,
  CheckCircle2, Leaf, ArrowUpRight, Plus
} from 'lucide-react';

export default function MonthlyDisclosure() {
    return (
        <>
            <div className="w-1/6 flex flex-col gap-6">
                <div className="h-1/2 bg-accent-green rounded-[32px] p-6 flex flex-col justify-between text-black">
                    <div className="flex gap-1">
                        {/* Placeholder Icons for Logo Stacking */}
                        {[1,2,3,4].map(i => <div key={i} className="w-6 h-6 rounded-full bg-black/20 border border-black/10"></div>)}
                    </div>
                    <h4 className="text-lg font-bold leading-tight uppercase">Strategic <br/> Disclosure</h4>
                </div>
                <div className="h-1/2 bg-[#1D1D1D] rounded-[32px] p-6 flex flex-col justify-between relative overflow-hidden">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">Offset</h4>
                    <div className="flex items-end justify-between">
                        <span className="text-2xl font-bold italic">8.2t</span>
                        <div className="p-2 bg-accent-green/20 text-accent-green rounded-xl"><Leaf size={16}/></div>
                    </div>
                    {/* Wave Effect */}
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-accent-green/10 flex">
                        <div className="w-full h-full bg-gradient-to-t from-accent-green/20 to-transparent"></div>
                    </div>
                </div>
            </div>

            {/* CARD 4: COMPLIANCE CHECKLIST (Vertical Column) */}
            <div className="flex-1 bg-[#1D1D1D] rounded-[40px] p-8 flex flex-col group">
                <div className="flex justify-between items-center mb-2 shrink-0">
                    <h3 className="text-lg font-bold">Monthly Disclosure</h3>
                    <button className="text-white/20 hover:text-white"><Settings size={18}/></button>
                </div>
                <div className="flex-1 space-y-4 scrollbar-thin overflow-y-auto pr-2 scrollbar-none">
                    {[
                    { l: 'EPA Disclosure Report', s: true },
                    { l: 'Mineral Yield Proof', s: true },
                    { l: 'Logistics Payout Audit', s: false },
                    { l: 'Carbon Credit Ledger', s: false },
                    { l: 'Harare Facility Log', s: false }
                    ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-3xl group/item hover:bg-white/10 transition-all">
                        <div className="flex items-center gap-4">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${item.s ? 'bg-accent-green border-accent-green text-black' : 'border-white/10'}`}>
                                {item.s && <CheckCircle2 size={12} strokeWidth={4}/>}
                            </div>
                            <span className={`text-[11px] font-bold ${item.s ? 'text-white' : 'text-white/20'}`}>{item.l}</span>
                        </div>
                    </div>
                    ))}
                </div>
                {/* Progress Bar */}
                <div className="mt-3 pt-4 border-t border-white/5">
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-accent-green w-[40%]"></div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Completed</span>
                        <span className="text-xl font-bold tracking-tighter">40%</span>
                    </div>
                </div>
            </div>

        </>
    );
}