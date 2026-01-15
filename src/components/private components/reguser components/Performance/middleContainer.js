"use client"
import React, { useState } from 'react';
import {Plus} from 'lucide-react';
import NewFlux from "@/components/global components/Flux v2/NewFlux"

export default function PerfomanceMiddleContainer () {
    const [activeTab, setActiveTab] = useState('Active');

    const myProducts = [
    { id: 1, title: "ThinkPad X1 Carbon", category: "Laptops", price: 520, status: "Live", views: 124, health: "89%", co2: 45 },
    { id: 2, title: "iPhone 12 (No Screen)", category: "Smartphones", price: 85, status: "Pending", views: 42, health: "40%", co2: 12 },
    { id: 3, title: "GTX 1660 Super GPU", category: "Components", price: 150, status: "Live", views: 89, health: "95%", co2: 8 }
  ];

    return (
        <>
            {/* --- 02. MY LISTINGS GRID --- */}
            <section className="space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 px-4">
                <div className="space-y-2">
                <h3 className="text-4xl font-black uppercase italic tracking-tighter">My <span className="text-[#08CB00]">Storefront</span></h3>
                <p className="text-white/30 text-[11px] font-bold uppercase tracking-widest">Manage your personal e-waste inventory in Harare</p>
                </div>
                <div className="flex bg-white/5 border border-white/10 p-1.5 rounded-3xl">
                {['Active', 'Sold', 'Drafts'].map(tab => (
                    <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-[#08CB00] text-black shadow-xl' : 'text-white/40 hover:text-white'}`}
                    >
                    {tab}
                    </button>
                ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2  gap-8  ">
                {myProducts.map(product => (
                <NewFlux key={product.id} item={product} />
                ))}
                
                {/* Create New Placeholder */}
                <div className="border-4 border-dashed border-white/5 rounded-[48px] flex flex-col items-center justify-center gap-4 hover:border-[#08CB00]/40 hover:bg-[#08CB00]/5 transition-all cursor-pointer group p-12">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/20 group-hover:text-[#08CB00] transition-colors">
                    <Plus size={32} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 group-hover:text-white transition-colors">Add New Listing</p>
                </div>
            </div>
            </section>
        </>
    )
}