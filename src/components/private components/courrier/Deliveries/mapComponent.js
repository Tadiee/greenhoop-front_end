"use client"
import React, { useState } from 'react';
import { Flame, Crosshair, Layers} from 'lucide-react';


export default function DeliveriesMapComp () {
      const [mapMode, setMapMode] = useState('live'); // 'live' or 'heatmap'
    
    return (
        <>
              <div className="relative z-10 w-full min-h-[350px] lg:h-[400px] bg-[#0A0A0A] rounded-[40px] border border-white/5 shadow-2xl mb-8 overflow-hidden flex flex-col">
        {/* Map Background Layer */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>
        
        {/* Map UI Overlays */}
        {mapMode === 'live' ? (
          <div className="absolute inset-0 z-10 pointer-events-none bg-[url('/img/Map.png')] bg-cover bg-center opacity-80 mix-blend-screen">
            <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none">
              {/* Simulated Live Routing Lines */}
              <path d="M 100 300 Q 250 200 400 250 T 700 150" fill="none" stroke="#08CB00" strokeWidth="2" strokeDasharray="6 6" className="opacity-60 animate-[dash_2s_linear_infinite]" />
              <path d="M 600 350 L 700 150 L 900 100" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
              
              {/* Live Nodes */}
              <circle cx="100" cy="300" r="5" fill="#fff" />
              <circle cx="400" cy="250" r="7" fill="#08CB00" className="animate-pulse" />
              <circle cx="700" cy="150" r="7" fill="#08CB00" />
              <circle cx="900" cy="100" r="5" fill="#fff" />
            </svg>
          </div>
        ) : (
          <div className="absolute inset-0 z-10 pointer-events-none bg-[url('/img/Map.png')] bg-cover bg-center opacity-80 mix-blend-screen">
            {/* Simulated Heatmap Blurs */}
            <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-[#08CB00]/30 blur-[70px] rounded-full"></div>
            <div className="absolute top-1/2 left-2/3 w-96 h-96 bg-[#08CB00]/40 blur-[90px] rounded-full"></div>
            <div className="absolute bottom-10 left-10 w-48 h-48 bg-orange-500/20 blur-[60px] rounded-full"></div>
          </div>
        )}

        {/* Floating Map Controls - Refined Glassmorphism */}
        <div className="relative z-20 flex flex-col sm:flex-row justify-between items-start sm:items-end p-6 h-full pointer-events-none gap-4">
          
          {/* Mode Switcher */}
          <div className="bg-black/60 backdrop-blur-xl p-1.5 rounded-2xl border border-white/10 shadow-2xl flex gap-1 pointer-events-auto">
            <button 
              onClick={() => setMapMode('live')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mapMode === 'live' ? 'bg-[#08CB00] text-black' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
            >
              <Crosshair size={14} /> Live Transit
            </button>
            <button 
              onClick={() => setMapMode('heatmap')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mapMode === 'heatmap' ? 'bg-white text-black' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
            >
              <Flame size={14} className={mapMode === 'heatmap' ? 'text-orange-500' : ''} /> 30-Day Heatmap
            </button>
          </div>

          {/* Legend / Insight Box */}
          <div className="bg-black/60 backdrop-blur-xl p-6 rounded-[24px] border border-white/10 shadow-2xl w-full sm:w-64 pointer-events-auto">
            <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#08CB00] mb-4 flex items-center gap-2">
              <Layers size={14} /> View Insights
            </h4>
            {mapMode === 'live' ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center"><span className="text-xs font-bold text-white/80">Active Haulers</span><span className="text-sm font-black text-white">12</span></div>
                <div className="flex justify-between items-center"><span className="text-xs font-bold text-white/80">Idle / Base</span><span className="text-sm font-black text-white/40">4</span></div>
                <div className="w-full bg-white/10 h-1 rounded-full mt-2"><div className="bg-[#08CB00] h-1 rounded-full w-3/4 shadow-[0_0_10px_#08CB00]"></div></div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center"><span className="text-xs font-bold text-white/80">Peak Zone</span><span className="text-[10px] font-black bg-[#08CB00]/20 text-[#08CB00] border border-[#08CB00]/30 px-2 py-1 rounded-md">SECTOR 7</span></div>
                <div className="flex justify-between items-center"><span className="text-xs font-bold text-white/80">Total Drops</span><span className="text-sm font-black text-white">8,492</span></div>
              </div>
            )}
          </div>
        </div>
      </div>

        </>
    )
}