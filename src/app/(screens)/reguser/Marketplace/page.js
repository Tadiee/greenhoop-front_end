"use client"
import React, { useState } from 'react';
import Link from 'next/link'
import { Search, Filter, Leaf, ShieldCheck, Zap, MoreVertical, Heart, ShoppingBag, MapPin } from 'lucide-react';
import { poppins } from '@/fonts/fonts';

const GreenHoopMarketplace = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const listings = [
    {
      id: 1,
      title: "MacBook Pro M1 (2020)",
      price: 650,
      condition: "Excellent",
      health: "92%",
      impact: "120kg CO2 saved",
      seller: "Tadice",
      location: "Avondale, Harare",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: 2,
      title: "iPhone 13 Pro - 256GB",
      price: 480,
      condition: "Good",
      health: "88%",
      impact: "45kg CO2 saved",
      seller: "EcoTech_ZW",
      location: "Mt Pleasant, Harare",
      image: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: 3,
      title: "Dell XPS 13 (Parts Only)",
      price: 120,
      condition: "Scrap/Parts",
      health: "N/A",
      impact: "12kg CO2 saved",
      seller: "Harare_Recycle",
      location: "CBD, Harare",
      image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=600"
    }
  ];

  return (
    <div className="h-screen bg-[#050505] text-white font-sans selection:bg-[#08CB00] overflow-y-auto scrollbar-thin">
      
      {/* --- HERO & SEARCH SECTION --- */}
      <section className="pt-32 pb-16 px-6 max-w-7xl mx-auto space-y-12">
        <div className="space-y-4">
          <p className="text-[11px] font-black uppercase tracking-[0.5em] text-[#08CB00]">GreenHoop P2P Exchange</p>
          <h1 className={`text-7xl font-black tracking-tighter leading-none italic uppercase ${poppins.className}`}>
            Rethink <span className="text-white/20">Ownership.</span>
          </h1>
          <p className="text-white/40 max-w-xl text-sm font-medium">
            Browse verified e-waste and refurbished components from the GreenHoop community in Harare.
          </p>
        </div>

        {/* Professional Search Bar */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#08CB00] transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search by device, model, or component..." 
              className="w-full bg-white/5 border border-white/10 rounded-3xl py-6 pl-16 pr-6 outline-none focus:border-[#08CB00]/50 transition-all text-sm font-bold"
            />
          </div>
          <button className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition-all flex items-center gap-3">
            <Filter size={20} />
            <span className="text-xs font-black uppercase tracking-widest">Filters</span>
          </button>
        </div>
      </section>

      {/* --- CATEGORY SELECTOR --- */}
      <section className="px-6 max-w-7xl mx-auto mb-12">
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {['All', 'Laptops', 'Smartphones', 'Components', 'Displays', 'Peripherals'].map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                activeCategory === cat ? 'bg-[#08CB00] text-black border-[#08CB00]' : 'bg-transparent border-white/10 text-white/40 hover:border-white/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* --- PRODUCT GRID --- */}
      <main className="px-6 max-w-7xl mx-auto pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map((item) => (
            <div key={item.id} className="bg-white/[0.02] border border-white/5 rounded-[48px] overflow-hidden group hover:border-[#08CB00]/30 transition-all duration-500">
              
              {/* Product Image Area */}
              <div className="relative h-72 overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
                   <div className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                     <div className="w-1.5 h-1.5 bg-[#08CB00] rounded-full animate-pulse"></div>
                     {item.condition}
                   </div>
                </div>
                <button className="absolute top-6 right-6 p-3 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 text-white/40 hover:text-red-500 transition-colors">
                  <Heart size={18} />
                </button>
              </div>

              {/* Content Area */}
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-black uppercase italic tracking-tighter">{item.title}</h3>
                    <div className="flex items-center gap-2 text-white/40 mt-1">
                      <MapPin size={12} />
                      <span className="text-[10px] font-bold">{item.location}</span>
                    </div>
                  </div>
                  <p className="text-3xl font-black text-[#08CB00] tracking-tighter">${item.price}</p>
                </div>

                {/* Flux-style Data Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5 space-y-1">
                    <div className="flex items-center gap-2 text-[#08CB00]">
                      <Zap size={12} />
                      <span className="text-[9px] font-black uppercase">Health</span>
                    </div>
                    <p className="text-lg font-black">{item.health}</p>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5 space-y-1">
                    <div className="flex items-center gap-2 text-blue-400">
                      <Leaf size={12} />
                      <span className="text-[9px] font-black uppercase">Impact</span>
                    </div>
                    <p className="text-lg font-black">{item.impact.split(' ')[0]}<span className="text-[8px] opacity-40 ml-1">CO2</span></p>
                  </div>
                </div>

                {/* Seller & Action */}
                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center font-black text-[#08CB00] border border-[#08CB00]/20 text-xs">
                      {item.seller[0]}
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-tighter">{item.seller}</p>
                      <div className="flex items-center gap-1 text-[9px] text-white/20">
                        <ShieldCheck size={10} className="text-[#08CB00]" />
                        <span>Verified Seller</span>
                      </div>
                    </div>
                  </div>
                  <button className="bg-[#08CB00] text-black p-4 rounded-2xl font-black hover:bg-white transition-all">
                    <ShoppingBag size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* --- ADD LISTING FAB --- */}
      <button className="fixed bottom-10 right-10 bg-[#08CB00] text-black px-8 py-4 rounded-[32px] font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-[#08CB00]/40 flex items-center gap-4 hover:scale-105 transition-all group z-50">
        <Link href='/reguser/Marketplace/Perfomance'>Sell E-Waste</Link>
        <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center text-[#08CB00] group-hover:rotate-90 transition-transform">
          <Zap size={16} fill="currentColor" />
        </div>
      </button>

    </div>
  );
};

export default GreenHoopMarketplace;