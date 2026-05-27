"use client"
import React, { useState } from 'react';
import { Search, Filter, ChevronDown, X, DollarSign, Package, Truck, Recycle, ArrowUpDown } from 'lucide-react';
import { poppins } from '@/fonts/fonts';

const CONDITIONS = [
    { value: 'NEW', label: 'New' },
    { value: 'LIKE_NEW', label: 'Like New' },
    { value: 'EXCELLENT', label: 'Excellent' },
    { value: 'VERY_GOOD', label: 'Very Good' },
    { value: 'GOOD', label: 'Good' },
    { value: 'ACCEPTABLE', label: 'Acceptable' },
    { value: 'POOR', label: 'Poor' },
    { value: 'FOR_PARTS', label: 'For Parts' },
    { value: 'SCRAP', label: 'Scrap' },
];

const LISTING_TYPES = [
    { value: 'SALE', label: 'Buy Now' },
    { value: 'AUCTION', label: 'Auction' },
    { value: 'TRADE', label: 'Trade' },
];

const SORT_OPTIONS = [
    { value: '-created_at', label: 'Newest First' },
    { value: 'created_at', label: 'Oldest First' },
    { value: 'listing_price', label: 'Price: Low → High' },
    { value: '-listing_price', label: 'Price: High → Low' },
    { value: '-view_count', label: 'Most Viewed' },
    { value: '-listing_score', label: 'Best Score' },
];

export default function MarketplaceTopContainer({ searchQuery, onSearchChange, filters, onFiltersChange }) {
    const [showFilters, setShowFilters] = useState(false);

    const activeFilterCount = [
        filters.min_price, filters.max_price,
        filters.condition, filters.listing_type,
        filters.shipping_available, filters.local_pickup,
        filters.is_ewaste,
        filters.sort_by !== '-created_at' ? filters.sort_by : null,
    ].filter(Boolean).length;

    const updateFilter = (key, value) => {
        onFiltersChange({ ...filters, [key]: value });
    };

    const clearFilters = () => {
        onFiltersChange({
            min_price: '', max_price: '',
            condition: '', listing_type: '',
            shipping_available: false, local_pickup: false,
            is_ewaste: false, sort_by: '-created_at',
        });
    };

    return (
        <section className="pt-32 pb-16 px-6 max-w-7xl mx-auto space-y-8">
            <div className="space-y-4">
                <p className="text-[11px] font-black uppercase tracking-[0.5em] text-[#08CB00]">GreenHoop P2P Exchange</p>
                <h1 className={`text-7xl font-black tracking-tighter leading-none italic uppercase ${poppins.className}`}>
                    Rethink <span className="text-white/20">Ownership.</span>
                </h1>
                <p className="text-white/40 max-w-xl text-sm font-medium">
                    Browse verified e-waste and refurbished components from the GreenHoop community in Harare.
                </p>
            </div>

            {/* Search Bar + Filter Toggle */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#08CB00] transition-colors" size={20} />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search by device, model, or component..." 
                        className="w-full bg-white/5 border border-white/10 rounded-3xl py-6 pl-16 pr-6 outline-none focus:border-[#08CB00]/50 transition-all text-sm font-bold"
                    />
                </div>
                <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className={`relative bg-white/5 border p-6 rounded-3xl hover:bg-white/10 transition-all flex items-center gap-3 ${showFilters ? 'border-[#08CB00]/50 bg-[#08CB00]/5' : 'border-white/10'}`}
                >
                    <Filter size={20} className={showFilters ? 'text-[#08CB00]' : ''} />
                    <span className="text-xs font-black uppercase tracking-widest">Filters</span>
                    {activeFilterCount > 0 && (
                        <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#08CB00] text-black text-[10px] font-black flex items-center justify-center">
                            {activeFilterCount}
                        </span>
                    )}
                    <ChevronDown size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
                <div className="bg-white/[0.02] border border-white/10 rounded-[32px] p-8 space-y-8 animate-in slide-in-from-top-2">
                    
                    {/* Top row: Clear button */}
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Refine Results</p>
                        {activeFilterCount > 0 && (
                            <button onClick={clearFilters} className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors">
                                <X size={12} /> Clear All
                            </button>
                        )}
                    </div>

                    {/* Price Range */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-white/50">
                            <DollarSign size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Price Range</span>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1 relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 text-sm font-bold">$</span>
                                <input 
                                    type="number" 
                                    value={filters.min_price} 
                                    onChange={(e) => updateFilter('min_price', e.target.value)}
                                    placeholder="Min" 
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-8 pr-4 outline-none focus:border-[#08CB00]/50 transition-all text-sm font-bold placeholder:text-white/20"
                                />
                            </div>
                            <span className="self-center text-white/20 font-bold">—</span>
                            <div className="flex-1 relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 text-sm font-bold">$</span>
                                <input 
                                    type="number" 
                                    value={filters.max_price} 
                                    onChange={(e) => updateFilter('max_price', e.target.value)}
                                    placeholder="Max" 
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-8 pr-4 outline-none focus:border-[#08CB00]/50 transition-all text-sm font-bold placeholder:text-white/20"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Condition */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-white/50">
                            <Package size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Condition</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {CONDITIONS.map(c => (
                                <button 
                                    key={c.value}
                                    onClick={() => updateFilter('condition', filters.condition === c.value ? '' : c.value)}
                                    className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                                        filters.condition === c.value 
                                            ? 'bg-[#08CB00] text-black border-[#08CB00]' 
                                            : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white/60'
                                    }`}
                                >
                                    {c.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Listing Type */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-white/50">
                            <Package size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Listing Type</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {LISTING_TYPES.map(t => (
                                <button 
                                    key={t.value}
                                    onClick={() => updateFilter('listing_type', filters.listing_type === t.value ? '' : t.value)}
                                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                                        filters.listing_type === t.value 
                                            ? 'bg-[#08CB00] text-black border-[#08CB00]' 
                                            : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white/60'
                                    }`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sort By */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-white/50">
                            <ArrowUpDown size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Sort By</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {SORT_OPTIONS.map(s => (
                                <button 
                                    key={s.value}
                                    onClick={() => updateFilter('sort_by', s.value)}
                                    className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                                        filters.sort_by === s.value 
                                            ? 'bg-white text-black border-white' 
                                            : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white/60'
                                    }`}
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Toggles Row */}
                    <div className="flex flex-wrap gap-4">
                        <button 
                            onClick={() => updateFilter('shipping_available', !filters.shipping_available)}
                            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                                filters.shipping_available 
                                    ? 'bg-[#08CB00]/10 text-[#08CB00] border-[#08CB00]/30' 
                                    : 'border-white/10 text-white/30 hover:border-white/20'
                            }`}
                        >
                            <Truck size={14} /> Shipping Available
                        </button>
                        <button 
                            onClick={() => updateFilter('local_pickup', !filters.local_pickup)}
                            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                                filters.local_pickup 
                                    ? 'bg-[#08CB00]/10 text-[#08CB00] border-[#08CB00]/30' 
                                    : 'border-white/10 text-white/30 hover:border-white/20'
                            }`}
                        >
                            <Package size={14} /> Local Pickup
                        </button>
                        <button 
                            onClick={() => updateFilter('is_ewaste', !filters.is_ewaste)}
                            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                                filters.is_ewaste 
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                                    : 'border-white/10 text-white/30 hover:border-white/20'
                            }`}
                        >
                            <Recycle size={14} /> E-Waste Only
                        </button>
                    </div>
                </div>
            )}
        </section>
    )
}
