"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
    ArrowLeft, Heart, Truck, MapPin, Recycle, Loader2, 
    ChevronLeft, ChevronRight, Image as ImageIcon, X,
    ShoppingBag, Gavel, Clock, Shield, AlertCircle, CheckCircle,
    Eye, Gauge, Leaf, Wrench, AlertTriangle, Star,
    TrendingUp, ShieldCheck, Timer, Cpu, Activity
} from 'lucide-react';
import { poppins } from '@/fonts/fonts';

const CONDITION_LABELS = {
    NEW: 'New', LIKE_NEW: 'Like New', EXCELLENT: 'Excellent',
    VERY_GOOD: 'Very Good', GOOD: 'Good', ACCEPTABLE: 'Acceptable',
    POOR: 'Poor', FOR_PARTS: 'For Parts', SCRAP: 'Scrap',
};

const TYPE_CONFIG = {
    SALE: { label: 'Buy Now', icon: ShoppingBag, color: 'text-[#08CB00]' },
    AUCTION: { label: 'Auction', icon: Gavel, color: 'text-amber-400' },
    TRADE: { label: 'Trade', icon: Heart, color: 'text-blue-400' },
};

const resolveUrl = (url) => url && (url.startsWith('http') ? url : `http://127.0.0.1:8000${url}`);

const conditionScoreColor = (score) => {
    if (score >= 8) return 'text-[#08CB00] bg-[#08CB00]';
    if (score >= 5) return 'text-amber-400 bg-amber-400';
    return 'text-red-400 bg-red-400';
};

const InfoCard = ({ icon: Icon, label, value, color = 'text-white/50', iconColor }) => (
    <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 space-y-2">
        <div className="flex items-center gap-2">
            <Icon size={12} className={iconColor || color} />
            <span className="text-[9px] font-black uppercase tracking-widest text-white/30">{label}</span>
        </div>
        <p className={`text-lg font-black ${color}`}>{value}</p>
    </div>
);

const SectionHeader = ({ icon: Icon, title, iconColor = 'text-white/30' }) => (
    <div className="flex items-center gap-2 mb-4">
        <Icon size={14} className={iconColor} />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">{title}</p>
    </div>
);

export default function ListingDetail({ listingId }) {
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Image gallery
    const [activeImage, setActiveImage] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    // Bid form (for auctions)
    const [bidAmount, setBidAmount] = useState('');
    const [bidSubmitting, setBidSubmitting] = useState(false);

    // Snackbar notification
    const [snackbar, setSnackbar] = useState(null);

    const showSnackbar = (type, message) => {
        setSnackbar({ type, message });
        setTimeout(() => setSnackbar(null), 4000);
    };

    useEffect(() => {
        if (!listingId) return;
        const fetchListing = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`http://127.0.0.1:8000/marketplace/listings/${listingId}/detail`, { credentials: 'include' });
                if (!res.ok) throw new Error(`Failed to load listing (${res.status})`);
                const data = await res.json();
                setListing(data);
            } catch (err) {
                console.error('Error fetching listing:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchListing();
    }, [listingId]);

    const allImages = listing?.images?.length > 0 ? listing.images : [];

    const handleBid = async () => {
        if (!bidAmount || isNaN(bidAmount)) return;
        setBidSubmitting(true);
        try {
            const res = await fetch(`http://127.0.0.1:8000/marketplace/listings/${listingId}/bid`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ bid_amount: parseFloat(bidAmount) }),
            });
            if (!res.ok) {
                const errData = await res.json().catch(() => null);
                throw new Error(errData?.detail || errData?.error || `Bid failed (${res.status})`);
            }
            setBidAmount('');
            const updated = await fetch(`http://127.0.0.1:8000/marketplace/listings/${listingId}/detail`, { credentials: 'include' });
            if (updated.ok) setListing(await updated.json());
            showSnackbar('success', 'Bid placed successfully!');
        } catch (err) {
            console.error('Bid error:', err);
            showSnackbar('error', err.message);
        } finally {
            setBidSubmitting(false);
        }
    };

    // --- LOADING ---
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 size={40} className="animate-spin text-[#08CB00]" />
            </div>
        );
    }

    // --- ERROR ---
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-6">
                <AlertCircle size={48} className="text-red-400" />
                <p className="text-red-400 text-sm font-bold">{error}</p>
                <Link href="/reguser/Marketplace" className="text-[#08CB00] text-xs font-black uppercase tracking-widest hover:underline">
                    ← Back to Marketplace
                </Link>
            </div>
        );
    }

    if (!listing) return null;

    const typeConfig = TYPE_CONFIG[listing.listing_type] || TYPE_CONFIG.SALE;
    const TypeIcon = typeConfig.icon;
    const deviceLabel = listing.device
        ? (typeof listing.device === 'string' ? listing.device : `${listing.device.brand || ''} ${listing.device.model_name || ''}`.trim())
        : '';
    const scoreColors = listing.condition_score != null ? conditionScoreColor(listing.condition_score) : null;
    const specs = listing.specifications && typeof listing.specifications === 'object' ? Object.entries(listing.specifications) : [];
    const funcStatus = listing.functional_status && typeof listing.functional_status === 'object' ? Object.entries(listing.functional_status) : [];
    const daysLeft = listing.expires_at ? Math.max(0, Math.ceil((new Date(listing.expires_at) - new Date()) / (1000 * 60 * 60 * 24))) : null;

    return (
        <>
            {/* Snackbar */}
            {snackbar && (
                <div className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 px-5 py-4 rounded-2xl border shadow-2xl backdrop-blur-md animate-[slideIn_0.3s_ease-out] ${
                    snackbar.type === 'success'
                        ? 'bg-[#08CB00]/10 border-[#08CB00]/20 text-[#08CB00]'
                        : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}>
                    {snackbar.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    <span className="text-sm font-bold">{snackbar.message}</span>
                    <button onClick={() => setSnackbar(null)} className="ml-2 p-1 rounded-full hover:bg-white/10 transition-colors">
                        <X size={14} />
                    </button>
                </div>
            )}

            {/* Lightbox */}
            {lightboxOpen && allImages.length > 0 && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md" onClick={() => setLightboxOpen(false)}>
                    <button onClick={() => setLightboxOpen(false)} className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
                        <X size={24} />
                    </button>
                    {allImages.length > 1 && (
                        <>
                            <button onClick={(e) => { e.stopPropagation(); setActiveImage((prev) => (prev - 1 + allImages.length) % allImages.length); }}
                                className="absolute left-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
                                <ChevronLeft size={28} />
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); setActiveImage((prev) => (prev + 1) % allImages.length); }}
                                className="absolute right-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
                                <ChevronRight size={28} />
                            </button>
                        </>
                    )}
                    <div className="max-w-[90vw] max-h-[85vh] flex flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
                        <img src={resolveUrl(allImages[activeImage])} alt={listing.title} className="max-h-[80vh] max-w-full object-contain rounded-2xl" />
                        {allImages.length > 1 && (
                            <p className="text-white/50 text-xs font-bold uppercase tracking-widest">{activeImage + 1} / {allImages.length}</p>
                        )}
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-6 pt-28 pb-24 space-y-12">
                {/* Back */}
                <Link href="/reguser/Marketplace" className="inline-flex items-center gap-2 text-white/40 hover:text-[#08CB00] transition-colors text-xs font-black uppercase tracking-widest">
                    <ArrowLeft size={16} /> Back to Marketplace
                </Link>

                {/* =================== TOP SECTION: Images + Details + Action =================== */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* --- LEFT: Images --- */}
                    <div className="lg:col-span-7 space-y-4">
                        <div 
                            className="relative rounded-[40px] overflow-hidden bg-black/40 border border-white/5 cursor-pointer h-[500px]"
                            onClick={() => { if (allImages.length > 0) setLightboxOpen(true); }}
                        >
                            {allImages.length > 0 ? (
                                <img src={resolveUrl(allImages[activeImage])} alt={listing.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <ImageIcon size={64} className="text-white/10" />
                                </div>
                            )}

                            {/* Badges */}
                            <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                                <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
                                    <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-[#08CB00] rounded-full animate-pulse"></div>
                                        {CONDITION_LABELS[listing.condition] || listing.condition}
                                    </span>
                                </div>
                                <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
                                    <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${typeConfig.color}`}>
                                        <TypeIcon size={12} /> {typeConfig.label}
                                    </span>
                                </div>
                                {listing.condition_score != null && (
                                    <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${scoreColors.split(' ')[0]}`}>
                                            Score: {listing.condition_score}/10
                                        </span>
                                    </div>
                                )}
                            </div>

                            {listing.is_ewaste && (
                                <div className="absolute bottom-6 left-6 flex items-center gap-1.5 bg-emerald-500/20 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-500/30">
                                    <Recycle size={12} className="text-emerald-400" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">E-Waste</span>
                                </div>
                            )}

                            {daysLeft != null && (
                                <div className="absolute bottom-6 right-6 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                                    <Timer size={12} className={daysLeft <= 3 ? 'text-red-400' : 'text-white/40'} />
                                    <span className={`text-[9px] font-black uppercase tracking-widest ${daysLeft <= 3 ? 'text-red-400' : 'text-white/40'}`}>
                                        {daysLeft === 0 ? 'Expires today' : `${daysLeft}d left`}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {allImages.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                {allImages.map((img, i) => (
                                    <button 
                                        key={i} 
                                        onClick={() => setActiveImage(i)}
                                        className={`shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                                            activeImage === i ? 'border-[#08CB00] ring-2 ring-[#08CB00]/30' : 'border-white/10 hover:border-white/30'
                                        }`}
                                    >
                                        <img src={resolveUrl(img)} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* --- Condition & Physical State (under image) --- */}
                        <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-8">
                            <SectionHeader icon={Gauge} title="Condition & Physical State" iconColor="text-[#08CB00]/50" />
                            
                            {listing.condition_score != null && (
                                <div className="mb-6 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Condition Score</span>
                                        <span className={`text-lg font-black ${scoreColors.split(' ')[0]}`}>{listing.condition_score}/10</span>
                                    </div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full transition-all ${scoreColors.split(' ')[1]}`}
                                            style={{ width: `${(listing.condition_score / 10) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4">
                                {listing.condition_notes && (
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">Condition Notes</p>
                                        <p className="text-sm text-white/50 leading-relaxed">{listing.condition_notes}</p>
                                    </div>
                                )}
                                {listing.missing_parts && (
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1 flex items-center gap-1.5">
                                            <AlertTriangle size={10} className="text-amber-400/50" /> Missing Parts
                                        </p>
                                        <p className="text-sm text-amber-400/60 leading-relaxed">{listing.missing_parts}</p>
                                    </div>
                                )}
                                {listing.physical_damage && (
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1 flex items-center gap-1.5">
                                            <AlertTriangle size={10} className="text-red-400/50" /> Physical Damage
                                        </p>
                                        <p className="text-sm text-red-400/60 leading-relaxed">{listing.physical_damage}</p>
                                    </div>
                                )}
                                {!listing.condition_notes && !listing.missing_parts && !listing.physical_damage && listing.condition_score == null && (
                                    <p className="text-xs text-white/20 italic">No additional condition details provided.</p>
                                )}
                            </div>
                        </div>

                        {/* --- Specifications (under condition) --- */}
                        <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-8">
                            <SectionHeader icon={Cpu} title="Specifications" iconColor="text-blue-400/50" />
                            {specs.length > 0 ? (
                                <div className="space-y-3">
                                    {specs.map(([key, val]) => (
                                        <div key={key} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{key.replace(/_/g, ' ')}</span>
                                            <span className="text-sm font-bold text-white/60">{String(val)}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-white/20 italic">No specifications listed.</p>
                            )}
                        </div>

                        {/* --- Functional Status --- */}
                        {funcStatus.length > 0 && (
                            <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-8">
                                <SectionHeader icon={Activity} title="Functional Status" iconColor="text-purple-400/50" />
                                <div className="space-y-3">
                                    {funcStatus.map(([key, val]) => (
                                        <div key={key} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{key.replace(/_/g, ' ')}</span>
                                            <span className={`text-sm font-bold ${
                                                val === 'working' || val === 'functional' || val === 'yes' ? 'text-[#08CB00]/70' :
                                                val === 'not working' || val === 'broken' || val === 'no' ? 'text-red-400/70' :
                                                'text-white/60'
                                            }`}>{String(val)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* --- Sustainability Impact --- */}
                        <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-8">
                            <SectionHeader icon={Leaf} title="Sustainability Impact" iconColor="text-emerald-400/50" />
                            <div className="grid grid-cols-2 gap-4">
                                {listing.estimated_recyclable_value != null && (
                                    <InfoCard icon={Recycle} label="Recyclable Value" value={`$${listing.estimated_recyclable_value}`} color="text-emerald-400" iconColor="text-emerald-400/50" />
                                )}
                                {listing.estimated_co2_offset != null && (
                                    <InfoCard icon={Leaf} label="CO₂ Offset" value={`${listing.estimated_co2_offset} kg`} color="text-emerald-400" iconColor="text-emerald-400/50" />
                                )}
                                {listing.estimated_recyclable_value == null && listing.estimated_co2_offset == null && (
                                    <p className="col-span-2 text-xs text-white/20 italic">No sustainability data available.</p>
                                )}
                            </div>
                        </div>

                        {/* --- Listing Intelligence --- */}
                        {(listing.listing_score != null || listing.demand_probability != null) && (
                            <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-8">
                                <SectionHeader icon={TrendingUp} title="Listing Intelligence" iconColor="text-[#08CB00]/50" />
                                <div className="grid grid-cols-2 gap-4">
                                    {listing.listing_score != null && (
                                        <InfoCard icon={TrendingUp} label="Listing Score" value={listing.listing_score} color="text-[#08CB00]" iconColor="text-[#08CB00]/50" />
                                    )}
                                    {listing.demand_probability != null && (
                                        <InfoCard icon={Activity} label="Demand" value={`${Math.round(listing.demand_probability * 100)}%`} color="text-blue-400" iconColor="text-blue-400/50" />
                                    )}
                                    {listing.fraud_risk_score != null && (
                                        <InfoCard 
                                            icon={ShieldCheck} label="Trust Score" 
                                            value={listing.fraud_risk_score < 0.3 ? 'High' : listing.fraud_risk_score < 0.6 ? 'Medium' : 'Low'} 
                                            color={listing.fraud_risk_score < 0.3 ? 'text-[#08CB00]' : listing.fraud_risk_score < 0.6 ? 'text-amber-400' : 'text-red-400'}
                                            iconColor={listing.fraud_risk_score < 0.3 ? 'text-[#08CB00]/50' : listing.fraud_risk_score < 0.6 ? 'text-amber-400/50' : 'text-red-400/50'}
                                        />
                                    )}
                                    {listing.price_recommendation != null && (
                                        <InfoCard icon={Wrench} label="Fair Price" value={`$${listing.price_recommendation}`} color="text-white/60" iconColor="text-white/30" />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* --- RIGHT: Details + Actions (sticky) --- */}
                    <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28 lg:self-start">
                        {/* Title & Price */}
                        <div className="space-y-3">
                            <h1 className={`text-4xl font-black tracking-tighter uppercase italic leading-tight ${poppins.className}`}>
                                {listing.title}
                            </h1>
                            {deviceLabel && <p className="text-sm font-bold text-white/30">{deviceLabel}</p>}
                            <p className="text-5xl font-black text-[#08CB00] tracking-tighter">
                                ${listing.listing_price}
                            </p>
                            {listing.price_recommendation != null && listing.listing_type === 'SALE' && (
                                <p className="text-[10px] font-bold text-white/20">
                                    Recommended price: <span className="text-white/40">${listing.price_recommendation}</span>
                                </p>
                            )}
                        </div>

                        {/* Quick stats strip */}
                        <div className="flex gap-3 flex-wrap">
                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-white/30 bg-white/5 px-3 py-2 rounded-xl border border-white/5">
                                <Eye size={12} /> {listing.view_count} views
                            </span>
                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-white/30 bg-white/5 px-3 py-2 rounded-xl border border-white/5">
                                <Heart size={12} /> {listing.like_count} likes
                            </span>
                            {listing.bid_count > 0 && (
                                <span className="flex items-center gap-1.5 text-[10px] font-bold text-amber-400/60 bg-amber-400/5 px-3 py-2 rounded-xl border border-amber-400/10">
                                    <Gavel size={12} /> {listing.bid_count} bids
                                </span>
                            )}
                            {listing.seller_rating_at_listing != null && (
                                <span className="flex items-center gap-1.5 text-[10px] font-bold text-yellow-400/60 bg-yellow-400/5 px-3 py-2 rounded-xl border border-yellow-400/10">
                                    <Star size={12} /> Seller {listing.seller_rating_at_listing}★
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        {listing.description && (
                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Description</p>
                                <p className="text-sm text-white/50 leading-relaxed">{listing.description}</p>
                            </div>
                        )}

                        {/* Info Tags */}
                        <div className="flex flex-wrap gap-3">
                            {listing.shipping_available && (
                                <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 bg-white/5 px-4 py-2.5 rounded-2xl border border-white/10">
                                    <Truck size={14} /> Shipping Available
                                </span>
                            )}
                            {listing.local_pickup_available && (
                                <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 bg-white/5 px-4 py-2.5 rounded-2xl border border-white/10">
                                    <MapPin size={14} /> Local Pickup
                                </span>
                            )}
                            {listing.created_at && (
                                <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20 bg-white/5 px-4 py-2.5 rounded-2xl border border-white/5">
                                    <Clock size={14} /> Listed {new Date(listing.created_at).toLocaleDateString()}
                                </span>
                            )}
                        </div>

                        {/* --- ACTION SECTION --- */}
                        <div className="bg-white/[0.03] border border-white/10 rounded-[32px] p-8 space-y-6">

                            {/* BUY NOW */}
                            {listing.listing_type === 'SALE' && (
                                <>
                                    <div className="flex items-center gap-3">
                                        <Shield size={16} className="text-[#08CB00]" />
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40">GreenHoop Protected Purchase</p>
                                    </div>
                                    {listing.fraud_risk_score != null && listing.fraud_risk_score < 0.3 && (
                                        <div className="flex items-center gap-2 bg-[#08CB00]/5 border border-[#08CB00]/10 rounded-xl px-4 py-2">
                                            <ShieldCheck size={14} className="text-[#08CB00]" />
                                            <span className="text-[10px] font-bold text-[#08CB00]/70">Low fraud risk — Verified listing</span>
                                        </div>
                                    )}
                                    <button className="w-full bg-[#08CB00] text-black py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-white transition-all flex items-center justify-center gap-3">
                                        <ShoppingBag size={20} />
                                        Buy Now — ${listing.listing_price}
                                    </button>
                                </>
                            )}

                            {/* AUCTION */}
                            {listing.listing_type === 'AUCTION' && (
                                <>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                                                {listing.current_bid ? 'Current Bid' : 'Starting Price'}
                                            </p>
                                            <p className="text-2xl font-black text-amber-400">
                                                ${listing.current_bid || listing.starting_price || listing.listing_price}
                                            </p>
                                        </div>
                                        {listing.starting_price && listing.current_bid && (
                                            <div className="flex items-center justify-between">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Starting Price</p>
                                                <p className="text-sm font-bold text-white/30">${listing.starting_price}</p>
                                            </div>
                                        )}
                                        <div className="flex items-center justify-between">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Total Bids</p>
                                            <p className="text-sm font-bold text-white/40">{listing.bid_count}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Place Your Bid</p>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 text-sm font-bold">$</span>
                                            <input 
                                                type="number"
                                                value={bidAmount}
                                                onChange={(e) => setBidAmount(e.target.value)}
                                                placeholder={`Min $${(listing.current_bid || listing.starting_price || listing.listing_price) + 1}`}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-8 pr-4 outline-none focus:border-amber-400/50 transition-all text-sm font-bold placeholder:text-white/20"
                                            />
                                        </div>
                                        <button 
                                            onClick={handleBid}
                                            disabled={bidSubmitting || !bidAmount}
                                            className="w-full bg-amber-400 text-black py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-white transition-all flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            {bidSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Gavel size={20} />}
                                            {bidSubmitting ? 'Placing Bid...' : 'Place Bid'}
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* TRADE */}
                            {listing.listing_type === 'TRADE' && (
                                <>
                                    <div className="flex items-center gap-3">
                                        <Heart size={16} className="text-blue-400" />
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Seller is open to trades</p>
                                    </div>
                                    <button className="w-full bg-blue-500 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-blue-400 transition-all flex items-center justify-center gap-3">
                                        <Heart size={20} />
                                        Propose a Trade
                                    </button>
                                </>
                            )}

                            {/* Wishlist */}
                            <button className="w-full bg-white/5 border border-white/10 text-white/40 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:border-red-500/30 hover:text-red-400 transition-all flex items-center justify-center gap-2">
                                <Heart size={16} />
                                Save to Wishlist
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
