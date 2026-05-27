"use client"
import React from 'react';

export default function MarketplaceMiddleContainer({ activeCategory, onCategoryChange }) {
    return (
        <section className="px-6 max-w-7xl mx-auto mb-12">
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {['All', 'Laptops', 'Smartphones', 'Components', 'Displays', 'Peripherals'].map(cat => (
                    <button 
                        key={cat}
                        onClick={() => onCategoryChange(cat)}
                        className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                            activeCategory === cat ? 'bg-[#08CB00] text-black border-[#08CB00]' : 'bg-transparent border-white/10 text-white/40 hover:border-white/30'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </section>
    )
}
