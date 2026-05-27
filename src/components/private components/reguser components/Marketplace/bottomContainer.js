"use client"
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Heart, Truck, MapPin, Recycle, Loader2, PackageOpen, ChevronLeft, ChevronRight, Image as ImageIcon, Tag } from 'lucide-react';

const CONDITION_LABELS = {
    NEW: 'New', LIKE_NEW: 'Like New', EXCELLENT: 'Excellent',
    VERY_GOOD: 'Very Good', GOOD: 'Good', ACCEPTABLE: 'Acceptable',
    POOR: 'Poor', FOR_PARTS: 'For Parts', SCRAP: 'Scrap',
};

const TYPE_LABELS = {
    SALE: 'Buy Now', AUCTION: 'Auction', TRADE: 'Trade',
};

const resolveUrl = (url) => url && (url.startsWith('http') ? url : `http://127.0.0.1:8000${url}`);

export default function MarketplaceBottomContainer({ filters, searchQuery, activeCategory }) {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const debounceRef = useRef(null);

    useEffect(() => {
        setPage(1);
    }, [filters, searchQuery, activeCategory]);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            fetchListings();
        }, 300);

        return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }, [filters, searchQuery, activeCategory, page]);

    const fetchListings = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            params.append('page', String(page));
            params.append('page_size', '20');
            if (searchQuery?.trim()) params.append('search', searchQuery.trim());
            if (filters.condition) params.append('condition', filters.condition);
            if (filters.listing_type) params.append('listing_type', filters.listing_type);
            if (filters.min_price) params.append('min_price', filters.min_price);
            if (filters.max_price) params.append('max_price', filters.max_price);
            if (filters.shipping_available) params.append('shipping_available', 'true');
            if (filters.local_pickup) params.append('local_pickup', 'true');
            if (filters.is_ewaste) params.append('is_ewaste', 'true');
            if (filters.sort_by) params.append('sort_by', filters.sort_by);

            const res = await fetch(`http://127.0.0.1:8000/marketplace/listings/display?${params.toString()}`, { credentials: 'include' });
            if (!res.ok) throw new Error(`Failed to load listings (${res.status})`);
            const data = await res.json();
            setListings(data.listings || []);
            setTotalPages(data.total_pages || 1);
            setTotalCount(data.total_count || 0);
        } catch (err) {
            console.error('Error fetching listings:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="px-6 max-w-7xl mx-auto pb-24 space-y-8">
            {/* Result count */}
            {!loading && !error && (
                <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
                        {totalCount} {totalCount === 1 ? 'listing' : 'listings'} found
                    </p>
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="flex items-center justify-center py-24">
                    <Loader2 size={32} className="animate-spin text-[#08CB00]" />
                </div>
            )}

            {/* Error */}
            {!loading && error && (
                <div className="text-center py-20">
                    <p className="text-red-400 text-sm font-bold">{error}</p>
                </div>
            )}

            {/* Empty */}
            {!loading && !error && listings.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <PackageOpen size={56} className="text-white/10" />
                    <p className="text-white/30 text-xs font-bold uppercase tracking-widest">No listings match your filters</p>
                </div>
            )}

            {/* Listing Grid */}
            {!loading && !error && listings.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {listings.map((item) => (
                        <div key={item.listing_id} className="bg-white/[0.02] border border-white/5 rounded-[48px] overflow-hidden group hover:border-[#08CB00]/30 transition-all duration-500">
                            
                            {/* Image */}
                            <div className="relative h-72 overflow-hidden bg-black/30">
                                {item.thumbnail ? (
                                    <img src={resolveUrl(item.thumbnail)} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <ImageIcon size={48} className="text-white/10" />
                                    </div>
                                )}
                                <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                                    <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
                                        <div className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-[#08CB00] rounded-full animate-pulse"></div>
                                            {CONDITION_LABELS[item.condition] || item.condition}
                                        </div>
                                    </div>
                                    {item.listing_type && (
                                        <div className="bg-black/60 backdrop-blur-md px-3 py-2 rounded-2xl border border-white/10">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-[#08CB00]">
                                                {TYPE_LABELS[item.listing_type] || item.listing_type}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <button className="absolute top-6 right-6 p-3 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 text-white/40 hover:text-red-500 transition-colors">
                                    <Heart size={18} />
                                </button>
                                {item.is_ewaste && (
                                    <div className="absolute bottom-4 left-6 flex items-center gap-1.5 bg-emerald-500/20 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-500/30">
                                        <Recycle size={12} className="text-emerald-400" />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">E-Waste</span>
                                    </div>
                                )}
                                {item.images && item.images.length > 1 && (
                                    <div className="absolute bottom-4 right-6 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/10">
                                        <ImageIcon size={10} className="text-white/50" />
                                        <span className="text-[10px] font-bold text-white/50">{item.images.length}</span>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-8 space-y-5">
                                <div className="flex justify-between items-start gap-3">
                                    <div className="min-w-0">
                                        <h3 className="text-xl font-black uppercase italic tracking-tighter truncate">{item.title}</h3>
                                        <p className="text-[10px] font-bold text-white/30 mt-0.5 truncate">{item.device_brand_model}</p>
                                    </div>
                                    <p className="text-3xl font-black text-[#08CB00] tracking-tighter shrink-0">${item.listing_price}</p>
                                </div>

                                {item.description && (
                                    <p className="text-xs text-white/30 font-medium line-clamp-2 leading-relaxed">{item.description}</p>
                                )}

                                {/* Footer tags */}
                                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        {item.shipping_available && (
                                            <span className="flex items-center gap-1 text-[9px] font-bold text-white/30 bg-white/5 px-2.5 py-1 rounded-lg">
                                                <Truck size={10} /> Ships
                                            </span>
                                        )}
                                        {item.local_pickup_available && (
                                            <span className="flex items-center gap-1 text-[9px] font-bold text-white/30 bg-white/5 px-2.5 py-1 rounded-lg">
                                                <MapPin size={10} /> Pickup
                                            </span>
                                        )}
                                        <span className="text-[9px] font-bold text-white/20">
                                            {item.created_at ? new Date(item.created_at).toLocaleDateString() : ''}
                                        </span>
                                    </div>
                                    <Link href={`/reguser/Marketplace/listing/${item.listing_id}`} className="bg-[#08CB00] text-black px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-white transition-all flex items-center gap-2">
                                        <Tag size={14} />
                                        View Listing
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {!loading && !error && totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 pt-8">
                    <button 
                        onClick={() => setPage(p => Math.max(1, p - 1))} 
                        disabled={page <= 1}
                        className="p-3 rounded-2xl border border-white/10 bg-white/5 text-white/40 hover:text-white hover:border-white/30 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                        Page {page} of {totalPages}
                    </span>
                    <button 
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                        disabled={page >= totalPages}
                        className="p-3 rounded-2xl border border-white/10 bg-white/5 text-white/40 hover:text-white hover:border-white/30 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
        </main>
    )
}
