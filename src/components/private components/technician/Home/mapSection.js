"use client"
import React, { useState } from 'react';
import { 
  Zap, Wrench, Navigation, Smartphone, CheckCircle2, 
  XCircle, Map as MapIcon, Wallet, History, QrCode, 
  ClipboardList, Bell, Power, ArrowUpRight, Leaf, DollarSign, Layers, Search, Filter, 
} from 'lucide-react';

export default function MapSection() {
    return (
        <>
            <div className="flex bg-[#0A0A0A] border border-white/5 rounded-[48px] overflow-hidden relative shadow-2xl group min-h-[350px] lg:h-[60%]">
               <div className="absolute inset-0 grayscale brightness-50 contrast-125 opacity-40 group-hover:opacity-60 transition-opacity">
                  <img src="/img/Map.png" alt="Mini Map" className="w-full h-full object-cover" />
               </div>
               <div className="absolute top-6 left-6 z-10 bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#08CB00] flex items-center gap-2">
                     <MapIcon size={14}/> Sector A-01
                  </p>
               </div>
               {/* Current Hub Pin */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#08CB00] rounded-full shadow-[0_0_20px_#08CB00] animate-pulse"></div>
            </div>
        </>
    );
}