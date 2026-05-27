"use client"
import React from 'react';
import { 
  ChevronRight, 
  Search, ShieldCheck, 
} from 'lucide-react';

export default function AuditStreamComp() {
    return (
        <>
             <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-[48px] p-8 flex flex-col overflow-hidden shadow-2xl relative group">
                {/* Registry Header */}
                <div className="flex justify-between items-start mb-6 shrink-0">
                   <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[#08CB00]">
                         <ShieldCheck size={16} />
                         <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Fiscal Audit Stream</h3>
                      </div>
                      <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Real-time Settlement Logs</p>
                   </div>
                   <button className="p-2 bg-white/5 rounded-lg hover:bg-white hover:text-black transition-all">
                      <Search size={14} />
                   </button>
                </div>
           
                {/* Audit List */}
                <div className="flex-1 space-y-3 overflow-y-auto scrollbar-thin pr-2">
                   {[
                     { id: 'TX-902', type: 'Payout', amount: '$420', status: 'Verified', time: '12:04' },
                     { id: 'TX-904', type: 'Logistic', amount: '$1,200', status: 'Pending', time: '11:58' },
                     { id: 'TX-911', type: 'Disposal', amount: '$640', status: 'Verified', time: '11:42' },
                     { id: 'TX-920', type: 'Internal', amount: '$3,400', status: 'Flagged', time: '10:15' },
                     { id: 'TX-922', type: 'Freight', amount: '$890', status: 'Verified', time: '09:30' },
                     { id: 'TX-928', type: 'Payout', amount: '$155', status: 'Verified', time: '08:45' },
                   ].map((tx, i) => (
                     <div key={i} className="p-4 bg-black/60 border border-white/5 rounded-3xl flex items-center justify-between group/item hover:border-[#08CB00]/40 transition-all cursor-pointer">
                       <div className="flex items-center gap-4">
                          {/* Status Indicator */}
                          <div className={`w-1.5 h-1.5 rounded-full ${tx.status === 'Verified' ? 'bg-[#08CB00]' : tx.status === 'Flagged' ? 'bg-red-500' : 'bg-white/20'}`}></div>
                          <div>
                             <p className="text-[10px] font-black uppercase italic leading-none group-hover/item:text-white transition-colors">{tx.type} <span className="text-white/20 ml-1">#</span>{tx.id}</p>
                             <p className="text-[8px] font-mono text-white/20 mt-2 uppercase tracking-tighter">{tx.time} • {tx.status}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-sm font-black italic group-hover/item:text-[#08CB00] transition-colors">{tx.amount}</p>
                          <ChevronRight size={12} className="ml-auto mt-1 opacity-0 group-hover/item:opacity-100 transition-all text-white/20" />
                       </div>
                     </div>
                   ))}
                </div>
           
                {/* Ledger Footer */}
                <button className="w-full mt-6 py-3 border border-white/5 bg-white/[0.03] rounded-2xl text-[8px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all">
                   Download Full Audit [.CSV]
                </button>
             </div>
        </>
    );
}