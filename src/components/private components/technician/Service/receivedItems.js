"use client"
import React, { useState } from 'react';
import { 
    Filter, Box, 
} from 'lucide-react';

export default function ReceivedItems () {
    return (
        <>
            <div className="flex-1 bg-[#1d1d1d] border border-white/5 rounded-[56px] p-10 flex flex-col shadow-2xl overflow-x-hidden  scrollbar-thin ">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xs font-black uppercase tracking-widest text-white/40">Operation Vault: Received Items</h3>
                  <Filter size={16} className="text-white/20" />
               </div>
               <div className="flex-1 overflow-y-auto scrollbar-thin pr-4 space-y-4">
                  {[
                    { id: '#RCV-402', item: 'Gaming Console', from: 'User_X', status: 'Pending Review' },
                    { id: '#RCV-418', item: 'Broken Tablet', from: 'User_Y', status: 'In Analysis' },
                    { id: '#RCV-422', item: 'Smart Watch', from: 'User_Z', status: 'Awaiting Parts' }
                  ].map((p, i) => (
                    <div key={i} className="p-5 bg-white/5 border border-white/5 rounded-[32px] flex items-center justify-between group hover:border-[#08CB00]/30 transition-all cursor-pointer">
                       <div className="flex items-center gap-5">
                          <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white/20 group-hover:text-[#08CB00] transition-colors"><Box size={20}/></div>
                          <div>
                             <p className="text-sm font-black italic uppercase">{p.item}</p>
                             <p className="text-[9px] font-bold text-white/20 mt-1 uppercase tracking-widest">{p.id} • {p.from}</p>
                          </div>
                       </div>
                       <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full border border-white/10 group-hover:border-[#08CB00]/20 group-hover:text-[#08CB00] transition-all">
                          {p.status}
                       </span>
                    </div>
                  ))}
               </div>
            </div>
        </>
    );
}