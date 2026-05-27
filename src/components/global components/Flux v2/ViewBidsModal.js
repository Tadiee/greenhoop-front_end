"use client"
import React, { useState, useEffect } from 'react';
import { 
    X, Gavel, Loader2, CheckCircle, AlertCircle, 
    Trophy, Clock, DollarSign, TrendingUp, Shield
} from 'lucide-react';
import { poppins } from '@/fonts/fonts';

const BID_STATUS_STYLES = {
    WINNING: 'text-[#08CB00] bg-[#08CB00]/10 border-[#08CB00]/20',
    WON: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    OUTBID: 'text-white/40 bg-white/5 border-white/10',
    ACTIVE: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    CANCELLED: 'text-red-400 bg-red-400/10 border-red-400/20',
};

export default function ViewBidsModal({ isOpen, onClose, listingId, listingTitle, listingType, onBidAccepted }) {
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [acceptingBidId, setAcceptingBidId] = useState(null);
    const [confirmBidId, setConfirmBidId] = useState(null);
    const [snackbar, setSnackbar] = useState(null);

    const showSnackbar = (type, message) => {
        setSnackbar({ type, message });
        setTimeout(() => setSnackbar(null), 5000);
    };

    useEffect(() => {
        if (!isOpen || !listingId) return;
        fetchBids();
    }, [isOpen, listingId]);

    const fetchBids = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`http://127.0.0.1:8000/marketplace/listings/${listingId}/bids`, { credentials: 'include' });
            if (!res.ok) throw new Error(`Failed to load bids (${res.status})`);
            setBids(await res.json());
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptBid = async (bidId) => {
        setAcceptingBidId(bidId);
        setConfirmBidId(null);
        try {
            const res = await fetch(`http://127.0.0.1:8000/marketplace/bids/${bidId}/accept`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            if (!res.ok) {
                const errData = await res.json().catch(() => null);
                throw new Error(errData?.detail || `Accept failed (${res.status})`);
            }
            const data = await res.json();
            showSnackbar('success', `Bid accepted! Final price: $${data.final_price} — Payout: $${data.seller_payout}`);
            await fetchBids();
            if (onBidAccepted) onBidAccepted(data);
        } catch (err) {
            showSnackbar('error', err.message);
        } finally {
            setAcceptingBidId(null);
        }
    };

    if (!isOpen) return null;

    const hasSold = bids.some(b => b.status === 'WON');

    return (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center" onClick={onClose}>
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

            {snackbar && (
                <div className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 px-5 py-4 rounded-2xl border shadow-2xl backdrop-blur-md ${
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

            <div 
                className="relative z-10 w-full max-w-lg max-h-[85vh] flex flex-col rounded-[32px] bg-zinc-900/95 border border-white/10 shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="shrink-0 p-6 pb-4 border-b border-white/5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                                <Gavel size={18} className="text-amber-400" />
                            </div>
                            <div>
                                <h2 className={`text-lg font-black uppercase italic tracking-tight ${poppins.className}`}>Bids</h2>
                                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest truncate max-w-[240px]">{listingTitle}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-colors">
                            <X size={18} />
                        </button>
                    </div>

                    {!loading && bids.length > 0 && (
                        <div className="flex items-center gap-4 mt-4">
                            <div className="flex items-center gap-2 bg-white/5 border border-white/5 rounded-xl px-3 py-2">
                                <DollarSign size={12} className="text-[#08CB00]" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Highest</span>
                                <span className="text-sm font-black text-[#08CB00]">${bids[0].bid_amount}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/5 border border-white/5 rounded-xl px-3 py-2">
                                <Gavel size={12} className="text-white/30" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Total</span>
                                <span className="text-sm font-black text-white/60">{bids.length}</span>
                            </div>
                            {hasSold && (
                                <div className="flex items-center gap-2 bg-emerald-400/5 border border-emerald-400/10 rounded-xl px-3 py-2">
                                    <CheckCircle size={12} className="text-emerald-400" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Sold</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-3 scrollbar-thin">
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 size={32} className="animate-spin text-[#08CB00]" />
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-3">
                            <AlertCircle size={32} className="text-red-400" />
                            <p className="text-sm text-red-400 font-bold">{error}</p>
                            <button onClick={fetchBids} className="text-[10px] font-black uppercase tracking-widest text-[#08CB00] hover:underline">
                                Retry
                            </button>
                        </div>
                    ) : bids.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-3">
                            <Gavel size={32} className="text-white/10" />
                            <p className="text-sm text-white/30 font-bold">No bids yet</p>
                        </div>
                    ) : (
                        bids.map((bid, index) => {
                            const statusStyle = BID_STATUS_STYLES[bid.status] || BID_STATUS_STYLES.ACTIVE;
                            const isHighest = index === 0;
                            const canAccept = !hasSold && (bid.status === 'WINNING' || bid.status === 'ACTIVE');
                            const isAccepting = acceptingBidId === bid.bid_id;
                            const isConfirming = confirmBidId === bid.bid_id;

                            return (
                                <div 
                                    key={bid.bid_id}
                                    className={`relative rounded-2xl border p-4 transition-all ${
                                        bid.status === 'WON' 
                                            ? 'bg-emerald-400/5 border-emerald-400/20' 
                                            : isHighest 
                                                ? 'bg-[#08CB00]/5 border-[#08CB00]/10' 
                                                : 'bg-white/[0.02] border-white/5'
                                    }`}
                                >
                                    {isHighest && bid.status !== 'WON' && (
                                        <div className="absolute -top-2 left-4 px-2 py-0.5 bg-[#08CB00] rounded-md">
                                            <span className="text-[8px] font-black uppercase tracking-widest text-black">Highest Bid</span>
                                        </div>
                                    )}
                                    {bid.status === 'WON' && (
                                        <div className="absolute -top-2 left-4 px-2 py-0.5 bg-emerald-400 rounded-md">
                                            <span className="text-[8px] font-black uppercase tracking-widest text-black flex items-center gap-1">
                                                <Trophy size={8} /> Winner
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="text-2xl font-black tracking-tighter text-white">${bid.bid_amount}</p>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${statusStyle}`}>
                                                    {bid.status}
                                                </span>
                                                <span className="flex items-center gap-1 text-[10px] text-white/20">
                                                    <Clock size={10} />
                                                    {new Date(bid.bid_timestamp).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>

                                        {canAccept && (
                                            <div className="shrink-0 ml-4">
                                                {isConfirming ? (
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleAcceptBid(bid.bid_id)}
                                                            disabled={isAccepting}
                                                            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#08CB00] text-black text-[10px] font-black uppercase tracking-widest hover:bg-[#08CB00]/90 transition-all disabled:opacity-50"
                                                        >
                                                            {isAccepting ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}
                                                            {isAccepting ? 'Processing...' : 'Confirm'}
                                                        </button>
                                                        <button
                                                            onClick={() => setConfirmBidId(null)}
                                                            className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setConfirmBidId(bid.bid_id)}
                                                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 text-[10px] font-black uppercase tracking-widest hover:border-[#08CB00]/30 hover:text-[#08CB00] transition-all"
                                                    >
                                                        <Shield size={12} />
                                                        Accept
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
