"use client"
import { Filter, Search, Zap } from 'lucide-react';

export default function GlobalFilters () {
    return (
        <>
                <div className="col-span-12 lg:col-span-3 space-y-6">
          <div className="bg-black rounded-[40px] border border-white/10 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white/40 uppercase text-[10px] font-black tracking-widest">Global Filters</h3>
              <Filter size={16} className="text-[#08CB00]" />
            </div>
            
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
              <input 
                type="text" 
                placeholder="Search ID..." 
                className="w-full bg-white/5 border border-white/10 text-white rounded-2xl py-3 pl-12 text-xs font-bold focus:ring-1 focus:ring-[#08CB00] focus:border-[#08CB00] focus:outline-none transition-all placeholder:text-white/20"
              />
            </div>

            <div className="space-y-2 mb-8">
              <button className="w-full flex items-center justify-between p-3.5 bg-white/10 text-white rounded-2xl text-[11px] font-black uppercase tracking-wider">
                <span>All Operations</span>
                <span className="bg-[#08CB00] text-black px-2 py-0.5 rounded-md">128</span>
              </button>
              <button className="w-full flex items-center justify-between p-3.5 hover:bg-white/5 rounded-2xl text-[11px] font-black text-white/60 hover:text-white uppercase tracking-wider transition-all group">
                <span>Completed</span>
                <div className="h-2 w-2 rounded-full bg-[#08CB00]/40 group-hover:bg-[#08CB00] transition-colors"></div>
              </button>
              <button className="w-full flex items-center justify-between p-3.5 hover:bg-white/5 rounded-2xl text-[11px] font-black text-white/60 hover:text-white uppercase tracking-wider transition-all group">
                <span>Pending</span>
                <div className="h-2 w-2 rounded-full bg-orange-500/40 group-hover:bg-orange-500 transition-colors"></div>
              </button>
            </div>

            <h3 className="text-white/40 uppercase text-[10px] font-black tracking-widest mb-4">Hot Markets</h3>
            <div className="space-y-3">
              {['Sector 7', 'Downtown', 'Industrial Park'].map((zone, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-white/10 transition-colors cursor-pointer">
                  <span className="text-[10px] text-white/80 font-bold uppercase tracking-wider">{zone}</span>
                  <Zap size={14} className={i === 0 ? 'text-[#08CB00]' : 'text-white/20'} />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        </>
    )
}