"use client"
import React from 'react';
import { 
  Download, Filter, FileText, TrendingUp, DollarSign, 
  User, ArrowUpRight, Calendar, Search, Bell, PieChart,
  BarChart3, LayoutGrid, ChevronRight, MoreHorizontal
} from 'lucide-react';

export default function MiddleContainer() {
    return (
        <>
                     
         {/* HEADER: SEARCH & ACCOUNT */}
         <header className="flex justify-between items-center shrink-0">
            <div className="relative w-1/3">
               <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
               <input 
                  className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-4 text-[10px] font-bold uppercase tracking-widest outline-none focus:border-[#08CB00] transition-all"
                  placeholder="Audit Batch ID, Transaction, Actor..."
               />
            </div>
         </header>

         {/* REVENUE VELOCITY CHART (Quick Access Area) */}
         <section className="bg-white/[0.02] border border-white/5 rounded-[48px] p-8 flex flex-col gap-6 shadow-2xl relative overflow-hidden group h-[40%]">
            <div className="flex justify-between items-end relative z-10">
               <div className="space-y-1">
                  <h3 className="text-xs font-black uppercase tracking-widest text-white/40">Revenue Velocity</h3>
                  <div className="flex items-baseline gap-4">
                     <p className="text-4xl font-black italic tracking-tighter">$18,920.<span className="text-white/20">45</span></p>
                     <span className="text-[10px] font-bold text-[#08CB00]">+12.4% vs Prev Month</span>
                  </div>
               </div>
               <div className="flex gap-2">
                  <button className="px-3 py-1 bg-[#08CB00]/10 text-[#08CB00] rounded-lg text-[8px] font-black uppercase">Line Graph</button>
                  <button className="px-3 py-1 bg-white/5 text-white/20 rounded-lg text-[8px] font-black uppercase hover:text-white transition-all">Bar Chart</button>
               </div>
            </div>
            
            {/* Chart Area */}
            <div className="h-58 w-full flex items-end gap-1.5 relative z-10 pt-4">
               {[40, 60, 45, 90, 70, 85, 100, 60, 45, 90, 70, 85].map((h, i) => (
                  <div key={i} className="w-full h-full items-center justify-end flex flex-col items-center gap-3 group/bar">
                     <div style={{ height: `${h}%` }} className={`h-[${h}%] w-full rounded-t-lg transition-all duration-700 ${i === 6 ? 'bg-[#08CB00]' : 'bg-white/10 group-hover/bar:bg-white/10'}`}></div>
                     <span className="text-[7px] font-black text-white/10 uppercase tracking-tighter">{['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i]}</span>
                  </div>
               ))}
            </div>
            <div className="absolute -right-24 -bottom-24 w-72 h-72 bg-[#08CB00]/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-[#08CB00]/10 transition-all duration-1000"></div>
         </section>

         {/* SETTLEMENT REGISTRY TABLE */}
         <section className="flex bg-[#0A0A0A] border border-white/5 rounded-[48px] p-10 flex flex-col overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center mb-8 shrink-0">
               <h3 className="text-xs font-black uppercase tracking-widest text-white/40">Settlement Registry</h3>
               <div className="flex gap-3">
                  <button className="p-2 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-white transition-all"><Filter size={16}/></button>
                  <button className="p-2 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-white transition-all"><MoreHorizontal size={16}/></button>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin pr-4">
               <table className="w-full text-left border-separate border-spacing-y-4">
                  <thead className="text-[8px] font-black uppercase text-white/20 border-b border-white/5 sticky top-0 bg-[#0A0A0A] z-10">
                     <tr>
                        <th className="pb-4 pl-4">Audit ID</th>
                        <th className="pb-4">Category</th>
                        <th className="pb-4">Node Actor</th>
                        <th className="pb-4">Througput</th>
                        <th className="pb-4">Amount</th>
                        <th className="pb-4 text-right pr-4">Status</th>
                     </tr>
                  </thead>
                  <tbody className="text-[10px] font-bold">
                     {[
                        { id: '#881-A', cat: 'Salvage Fee', actor: 'Tech: M. Sibanda', weight: '450kg', amt: '+$420.00', status: 'Settled' },
                        { id: '#902-B', cat: 'Sale Intercept', actor: 'User_X (Mbare)', weight: '120kg', amt: '+$1,120.00', status: 'Pending' },
                        { id: '#922-C', cat: 'Disposal Tax', actor: 'City Council', weight: '1.2t', amt: '-$210.00', status: 'Settled' },
                        { id: '#944-D', cat: 'Marketplace', actor: 'Tech: K. Moyo', weight: '15kg', amt: '+$85.00', status: 'Settled' },
                        { id: '#950-E', cat: 'Audit Credit', actor: 'City Council', weight: 'N/A', amt: '+$3,400.00', status: 'Flagged' },
                        { id: '#955-F', cat: 'Salvage Fee', actor: 'Tech: M. Sibanda', weight: '450kg', amt: '+$420.00', status: 'Settled' }
                     ].map((row, i) => (
                        <tr key={i} className="group hover:bg-white/[0.02] transition-all cursor-pointer">
                           <td className="py-5 pl-4 font-mono text-[#08CB00] border-y border-l border-white/5 rounded-l-2xl">{row.id}</td>
                           <td className="py-5 border-y border-white/5 uppercase italic">{row.cat}</td>
                           <td className="py-5 border-y border-white/5 text-white/40">{row.actor}</td>
                           <td className="py-5 border-y border-white/5 italic">{row.weight}</td>
                           <td className={`py-5 border-y border-white/5 text-xs font-black italic ${row.amt.includes('+') ? 'text-white' : 'text-red-500'}`}>{row.amt}</td>
                           <td className="py-5 text-right pr-4 border-y border-r border-white/5 rounded-r-2xl">
                              <span className={`px-2 py-1 rounded-md text-[8px] uppercase font-black ${
                                 row.status === 'Settled' ? 'bg-[#08CB00]/10 text-[#08CB00]' : row.status === 'Flagged' ? 'bg-red-500/10 text-red-500' : 'bg-white/10 text-white/40'
                              }`}>{row.status}</span>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </section>

        </>
    );
}