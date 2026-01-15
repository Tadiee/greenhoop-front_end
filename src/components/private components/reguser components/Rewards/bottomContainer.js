"use client"
import React, { useState } from 'react';

export default function BottomContainer () {
     const [activeTab, setActiveTab] = useState('Overview');

    return (
        <>
        {/* --- SECTION 3: TRANSACTION JOURNAL --- */}
        <section className="space-y-8 bg-white/[0.02] border border-white/5 rounded-[56px] p-10">
          <div className="flex justify-between items-end px-4">
            <h3 className="text-3xl font-black uppercase italic tracking-tighter">Circular <span className="text-[#08CB00]">Journal</span></h3>
            <div className="flex bg-white/5 p-1 rounded-2xl">
              {['Overview', 'Redeems'].map(t => <button key={t} onClick={() => setActiveTab(t)} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === t ? 'bg-[#08CB00] text-black shadow-lg' : 'text-white/40'}`}>{t}</button>)}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="text-[10px] font-black tracking-widest text-white/20 border-b border-white/5"><th className="px-10 py-6">Reference</th><th className="px-10 py-6">Description</th><th className="px-10 py-6 text-center">Status</th><th className="px-10 py-6 text-right">Value</th></tr></thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { id: 'TX-9021', type: 'Deposit', item: 'High-End Laptop', status: 'Cleared', val: '+ $55.00' },
                  { id: 'TX-8944', type: 'Redeem', item: 'Amazon Voucher', status: 'Pending', val: '- $20.00' }
                ].map((row, i) => (
                  <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-10 py-8 text-xs font-mono text-white/30 group-hover:text-[#08CB00]">{row.id}</td>
                    <td className="px-10 py-8"><p className="text-sm font-black uppercase italic tracking-tight">{row.type}</p><p className="text-[10px] text-white/40 font-bold">{row.item}</p></td>
                    <td className="px-10 py-8 text-center"><span className={`text-[9px] font-black uppercase px-4 py-1.5 rounded-full border ${row.status === 'Cleared' ? 'border-[#08CB00]/40 text-[#08CB00]' : 'border-white/10 text-white/30'}`}>{row.status}</span></td>
                    <td className={`px-10 py-8 text-right text-2xl font-black ${row.val.startsWith('+') ? 'text-[#08CB00]' : 'text-white'}`}>{row.val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
            
        </>
    )
}