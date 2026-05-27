"use client"
import React, { useState } from 'react';
import { 
  ArrowUpRight, Star, Filter
} from 'lucide-react';

export default function FiltersComp () {
      const [activeTab, setActiveTab] = useState('Recyclers');
    return (
        <> 
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-start w-full mb-8 mt-2">
                <div className="flex items-center bg-[#1A1A1A] border border-white/5 p-1 rounded-full shadow-2xl backdrop-blur-md mt-4 md:mt-0">
                
                {/* Filter Label / Icon Indicator */}
                <div className="flex items-center gap-1.5 pl-4 pr-3 border-r border-white/10">
                    <Filter size={12} className="text-[#08CB00]" />
                    <span className="text-[9px] font-black text-white/40 uppercase tracking-widest mr-1">Filter View</span>
                </div>
                
                {/* Filter Buttons (Pill Style) */}
                <div className="flex items-center gap-1 pl-2 pr-1">
                    {['Recyclers', 'Requests', 'History', 'Profile'].map((tab) => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${
                        activeTab === tab 
                        ? 'bg-[#08CB00] text-black shadow-[0_0_15px_rgba(8,203,0,0.4)]' 
                        : 'text-white/40 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        {tab}
                    </button>
                    ))}
                </div>
                
                </div>
            </div>
        
        </>
    )
}