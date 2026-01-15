"use client"
import React, { useState } from 'react';
import { 
  Leaf, 
  Eye, 
  Edit3, 
  Trash2, 

} from 'lucide-react';
import { poppins } from '@/fonts/fonts';

import {ShieldCheck, Activity, Flame } from 'lucide-react';


const NewFlux = ({ item }) => {
  // Determine status color
  const statusColor = item.status === 'Live' ? 'text-[#08CB00] bg-[#08CB00]/10 border-[#08CB00]/20' : 
                      item.status === 'Pending' ? 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20' : 
                      'text-red-500 bg-red-500/10 border-red-500/20';

  return (
    <div className="group relative w-full">
      {/* Card Container with subtle glow */}
      <div className="relative overflow-hidden rounded-[32px] bg-zinc-900/70 backdrop-blur-xl border border-white/10 p-6 transition-all duration-500 hover:border-[#08CB00]/50 hover:shadow-[0_0_30px_-10px_rgba(8,203,0,0.3)]">
        
        {/* Background accent gradient */}
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-[#08CB00]/5 blur-3xl transition-all duration-700 group-hover:bg-[#08CB00]/20"></div>

        {/* --- Header --- */}
        <div className="relative z-10 flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusColor}`}>
                {item.status}
              </span>
              {item.isHighDemand && (
                <div className="flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-500/20 text-orange-500 bg-orange-500/10">
                  <Flame size={10} fill="currentColor" /> High Demand
                </div>
              )}
            </div>
            <h3 className={`text-2xl font-black uppercase italic tracking-tight ${poppins.className} text-white leading-none mb-1 group-hover:text-[#08CB00] transition-colors`}>
              {item.title}
            </h3>
            <p className={`text-xs font-bold text-white/50 uppercase tracking-wider`}>{item.category}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black tracking-tighter text-[#08CB00]">${item.price}</div>
            <div className="flex items-center justify-end gap-1.5 text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">
              <Eye size={12} /> {item.views} Views
            </div>
          </div>
        </div>

        {/* --- Integrated Data Strip --- */}
        <div className="relative z-10 mb-6  p-4 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
          
          {/* Health Score (Prominent) */}
          <div className="flex items-center gap-3 pr-6 border-r border-white/10 ">
            <div className="relative flex flex-col items-center justify-center h-20 w-20 rounded-full bg-[#08CB00]/10 border border-[#08CB00]/30">
              <Activity size={13} className="text-[#08CB00] opacity-50" />
              <span className="text-lg font-black text-white relative z-10">{item.health}</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-white/50 uppercase tracking-wider">System</p>
              <p className="text-xs font-black text-white uppercase tracking-wider">Health</p>
            </div>
          </div>

          {/* Secondary Stats */}
          <div className="flex flex-col gap-3 pl-6">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                <Leaf size={14} />
              </div>
              <div>
                <span className="block text-sm font-black text-white leading-none">{item.co2}kg</span>
                <span className="text-[9px] font-bold text-white/50 uppercase">Offset</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
                <ShieldCheck size={14} />
              </div>
              <div>
                <span className="block text-sm font-black text-white leading-none">Verified</span>
                <span className="text-[9px] font-bold text-white/50 uppercase">Trust</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- Actions --- */}
        <div className="relative z-10 flex gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-accent-green py-3.5 text-xs font-black uppercase tracking-widest text-black transition-all hover:bg-[#08CB00]/90 hover:scale-[1.02] active:scale-95">
            <Edit3 size={16} /> Edit Details
          </button>
          <button className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/40 transition-all hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-500">
            <Trash2 size={18} />
          </button>
        </div>

      </div>
    </div>
  );
};
export default NewFlux;