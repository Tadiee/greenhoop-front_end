"use client"
import React, { useState } from 'react';
import { 
  ArrowUpRight, Star
} from 'lucide-react';

export default function RatingComp () {
    // Mock Data
    const pendingRequests = [
      { id: 'REQ-092', item: 'E-Waste Pickup (Mixed)', amount: '500kg', status: 'Action Required' },
      { id: 'REQ-093', item: 'Lithium Batteries', amount: '120kg', status: 'Awaiting Confirmation' },
    ];
    
    return (
        <> 
            <div className="col-span-12 md:col-span-4 lg:col-span-3 bg-[#08CB00] rounded-[40px] p-8 shadow-[0_15px_40px_rgba(8,203,0,0.2)] flex flex-col justify-between relative overflow-hidden hover:-translate-y-1 transition-transform duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-black/5 rounded-full blur-2xl"></div>
                
                <div>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-black/60 block mb-2">[ Pending Requests ]</span>
                    <div className="flex items-start gap-2">
                    <h3 className="text-7xl font-black text-black tracking-tighter leading-none">{pendingRequests.length}</h3>
                    <Star size={24} className="text-black fill-black/20 mt-2" />
                    </div>
                </div>

                <div className="mt-8 bg-black/10 p-4 rounded-[20px]">
                    <p className="text-[11px] font-black text-black uppercase tracking-widest leading-snug">
                    Urgent material checks required by recycler.
                    </p>
                    <button className="mt-4 w-10 h-10 bg-black text-[#08CB00] rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                    <ArrowUpRight size={18} />
                    </button>
                </div>
            </div>
        
        </>
    )
}