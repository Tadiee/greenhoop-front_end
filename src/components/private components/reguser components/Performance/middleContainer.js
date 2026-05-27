"use client"
import React, { useState, useEffect } from 'react';
import { Plus, Loader2, PackageOpen } from 'lucide-react';
import NewFlux from "@/components/global components/Flux v2/NewFlux"

const TAB_STATUS_MAP = {
    'Active': 'ACTIVE',
    'Sold': 'SOLD',
    'Pending': 'PENDING',
};

export default function PerfomanceMiddleContainer ({ onOpenModal }) {
    const [activeTab, setActiveTab] = useState('Active');
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchListings = async () => {
            setLoading(true);
            setError(null);
            try {
                const status = TAB_STATUS_MAP[activeTab];
                const url = `http://127.0.0.1:8000/marketplace/users/me/listings?status=${status}&page_size=20`;
                const res = await fetch(url, { credentials: 'include' });
                if (!res.ok) throw new Error(`Failed to load listings (${res.status})`);
                const data = await res.json();
                setListings(data.listings || []);
            } catch (err) {
                console.error('Error fetching listings:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchListings();
    }, [activeTab]);

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
                {Object.keys(TAB_STATUS_MAP).map(tab => (
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

            {/* Loading state */}
            {loading && (
                <div className="flex items-center justify-center py-20">
                    <Loader2 size={32} className="animate-spin text-[#08CB00]" />
                </div>
            )}

            {/* Error state */}
            {!loading && error && (
                <div className="text-center py-16 px-4">
                    <p className="text-red-400 text-sm font-bold">{error}</p>
                </div>
            )}

            {/* Listings grid */}
            {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {listings.map(listing => (
                <NewFlux key={listing.listing_id} item={listing} />
                ))}

                {listings.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-16 gap-4">
                        <PackageOpen size={48} className="text-white/10" />
                        <p className="text-white/30 text-xs font-bold uppercase tracking-widest">No {activeTab.toLowerCase()} listings yet</p>
                    </div>
                )}
                
                {/* Create New Placeholder */}
                <div onClick={onOpenModal} className="border-4 border-dashed border-white/5 rounded-[48px] flex flex-col items-center justify-center gap-4 hover:border-[#08CB00]/40 hover:bg-[#08CB00]/5 transition-all cursor-pointer group p-12">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/20 group-hover:text-[#08CB00] transition-colors">
                    <Plus size={32} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 group-hover:text-white transition-colors">Add New Listing</p>
                </div>
            </div>
            )}
            </section>
        </>
    )
}