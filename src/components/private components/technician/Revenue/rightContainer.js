"use client"
import React from 'react';
import { 
  Download, Filter, FileText, TrendingUp, DollarSign, 
  User, ArrowUpRight, Calendar, Search, Bell, PieChart,
  BarChart3, LayoutGrid, ChevronRight, MoreHorizontal
} from 'lucide-react';

export default function RightContainer() {
    return (
        <>
              <aside className="w-96 bg-[#0A0A0A] border-l border-white/5 p-8 flex flex-col gap-10 shrink-0 hidden xl:flex rounded-l-[48px] h-[80%]">
         
         {/* TOP PERFORMING NODES */}
         <section className="space-y-6">
            <div className="flex justify-between items-center">
               <h3 className="text-[10px] font-black uppercase text-[#08CB00] tracking-widest">Top Hub Actors</h3>
               <button className="text-[8px] font-black uppercase text-white/20 hover:text-white">View All</button>
            </div>
            
            <div className="space-y-4">
               {[
                  { name: 'K. Moyo', role: 'Lead Technician', rev: '$4,280', pts: 1240 },
                  { name: 'M. Sibanda', role: 'Salvage Master', rev: '$3,920', pts: 980 },
                  { name: 'A-01 Logistics', role: 'Distribution Hub', rev: '$2,850', pts: 440 }
               ].map((actor, i) => (
                  <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-3xl flex items-center justify-between group hover:border-[#08CB00]/30 transition-all cursor-pointer">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-black border border-white/10 flex items-center justify-center text-[10px] font-black text-white/20 group-hover:text-[#08CB00]">
                           {actor.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                           <p className="text-[10px] font-black italic">{actor.name}</p>
                           <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest">{actor.role}</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-xs font-black italic">{actor.rev}</p>
                        <p className="text-[7px] font-bold text-[#08CB00] uppercase italic">{actor.pts} pts</p>
                     </div>
                  </div>
               ))}
            </div>
         </section>

         {/* HIGH-VALUE ACQUISITION */}
         <section className="bg-[#08CB00] rounded-[48px] p-8 text-black flex flex-col justify-between relative overflow-hidden group shadow-2xl mt-auto h-[350px]">
            <div className="relative z-10">
               <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60">High-Value Acquisition</p>
               <h4 className="text-4xl font-black italic tracking-tighter leading-none mt-4">Legacy <br/> Logic Grid</h4>
               <p className="text-[10px] font-black uppercase tracking-widest mt-6 bg-black/10 w-fit px-3 py-1 rounded-full italic">Batch #881-A Verified</p>
            </div>
            
            <div className="relative z-10 space-y-4">
               <div className="flex justify-between items-end border-b border-black/10 pb-4">
                  <div className="space-y-1">
                     <p className="text-[8px] font-black uppercase opacity-60">Settlement Amount</p>
                     <p className="text-4xl font-black italic tracking-tighter">$4,280.00</p>
                  </div>
                  <div className="p-3 bg-black rounded-2xl text-[#08CB00] shadow-xl"><ArrowUpRight size={20} strokeWidth={3}/></div>
               </div>
               <div className="flex justify-between text-[9px] font-black uppercase italic tracking-widest opacity-60">
                  <span>Source: Harare North</span>
                  <span>12.4kg Cu/Au</span>
               </div>
            </div>
            {/* Ambient Background Glow */}
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-black/5 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-1000"></div>
         </section>

      </aside>
        </>
    );
}