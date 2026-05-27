"use client"
import React from 'react';
import { 
    Filter
} from 'lucide-react';

export default function AuditLedger() {
    return (
        <>
            <div className="col-span-5 bg-[#0A0A0A] border border-white/5 rounded-[40px] p-8 flex flex-col overflow-hidden shadow-2xl">
                <div className="flex justify-between items-center mb-6 shrink-0">
                    <h3 className="text-xs font-black uppercase tracking-widest text-white/40">Audit Ledger</h3>
                    <button className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-white/20 hover:text-white transition-all">
                    <Filter size={14}/>
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto scrollbar-thin pr-2">
                    <table className="w-full text-left border-separate border-spacing-y-2">
                    <thead className="text-[8px] font-black uppercase text-white/20 border-b border-white/5 sticky top-0 bg-[#0A0A0A] z-10">
                        <tr>
                            <th className="pb-3 pl-4">Batch ID</th>
                            <th className="pb-3">Material</th>
                            <th className="pb-3">Weight</th>
                            <th className="pb-3 text-right pr-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-[10px] font-bold">
                        {['#881-A', '#902-B', '#922-C'].map(id => (
                            <tr key={id} className="group hover:bg-white/[0.02] transition-all cursor-pointer">
                                <td className="py-4 pl-4 font-mono text-[#08CB00] border-y border-l border-white/5 rounded-l-2xl">{id}</td>
                                <td className="py-4 border-y border-white/5 uppercase text-white/60">Logic Boards</td>
                                <td className="py-4 border-y border-white/5 italic text-white/80">450kg</td>
                                <td className="py-4 text-right pr-4 border-y border-r border-white/5 rounded-r-2xl">
                                <span className="px-2 py-1 bg-[#08CB00]/10 text-[#08CB00] rounded-md text-[8px] uppercase font-black">Verified</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}