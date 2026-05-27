"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { Zap } from 'lucide-react';
import MarketplaceTopContainer from './topContainer';
import MarketplaceMiddleContainer from './middleContainer';
import MarketplaceBottomContainer from './bottomContainer';

const DEFAULT_FILTERS = {
    min_price: '', max_price: '',
    condition: '', listing_type: '',
    shipping_available: false, local_pickup: false,
    is_ewaste: false, sort_by: '-created_at',
};

export default function MarketplaceBundle({ readOnly = false }) {
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState(DEFAULT_FILTERS);

    return (
        <>
            <MarketplaceTopContainer searchQuery={searchQuery} onSearchChange={setSearchQuery} filters={filters} onFiltersChange={setFilters} />
            <MarketplaceMiddleContainer activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
            <MarketplaceBottomContainer filters={filters} searchQuery={searchQuery} activeCategory={activeCategory} />

            {/* --- ADD LISTING FAB — hidden for read-only roles (e.g. technician) --- */}
            {!readOnly && (
                <Link href='/reguser/Marketplace/Perfomance' className="fixed bottom-10 right-10 bg-[#08CB00] text-black px-8 py-4 rounded-[32px] font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-[#08CB00]/40 flex items-center gap-4 hover:scale-105 transition-all group z-50">
                    <p>Sell E-Waste</p>
                    <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center text-[#08CB00] group-hover:rotate-90 transition-transform">
                        <Zap size={16} fill="currentColor" />
                    </div>
                </Link>
            )}
        </>
    )
}
