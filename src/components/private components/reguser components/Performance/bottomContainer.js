"use client"
import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, Leaf, ArrowUpRight, ArrowDownRight, PackageOpen, Truck, CreditCard, AlertTriangle } from 'lucide-react';

const PAYMENT_STYLES = {
    COMPLETED: 'text-[#08CB00] bg-[#08CB00]/10 border-[#08CB00]/20',
    PENDING: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
    PROCESSING: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    FAILED: 'text-red-500 bg-red-500/10 border-red-500/20',
    REFUNDED: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
};

const DELIVERY_STYLES = {
    DELIVERED: 'text-[#08CB00] bg-[#08CB00]/10 border-[#08CB00]/20',
    SHIPPED: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    PENDING: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
    CANCELLED: 'text-red-500 bg-red-500/10 border-red-500/20',
};

const resolveUrl = (url) => url && (url.startsWith('http') ? url : `http://127.0.0.1:8000${url}`);

export default function PerfomanceBottomContainer ({ onSummaryLoaded }) {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch('http://127.0.0.1:8000/marketplace/transactions/history?page_size=20', { credentials: 'include' });
                if (!res.ok) throw new Error(`Failed to load transactions (${res.status})`);
                const data = await res.json();
                setTransactions(data.transactions || []);
                if (onSummaryLoaded && data.summary) {
                    onSummaryLoaded(data.summary);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, []);

    return (
        <>
            <section className="space-y-8 bg-white/[0.02] border border-white/5 rounded-[56px] p-10">
                <h3 className="text-sm font-black uppercase tracking-[0.4em] text-white/30 px-4">Transaction History</h3>

                {loading && (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 size={32} className="animate-spin text-[#08CB00]" />
                    </div>
                )}

                {!loading && error && (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                        <AlertCircle size={32} className="text-red-400" />
                        <p className="text-sm text-red-400 font-bold">{error}</p>
                    </div>
                )}

                {!loading && !error && transactions.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                        <PackageOpen size={32} className="text-white/10" />
                        <p className="text-sm text-white/30 font-bold">No transactions yet</p>
                    </div>
                )}

                {!loading && !error && transactions.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] font-black tracking-widest text-white/20 border-b border-white/5">
                                    <th className="px-6 py-5">Product</th>
                                    <th className="px-6 py-5 text-center"><CreditCard size={10} className="inline mr-1" />Payment</th>
                                    <th className="px-6 py-5 text-center"><Truck size={10} className="inline mr-1" />Delivery</th>
                                    <th className="px-6 py-5 text-right">Sale Price</th>
                                    <th className="px-6 py-5 text-right">Your Payout</th>
                                    <th className="px-6 py-5 text-right"><Leaf size={10} className="inline mr-1" />CO₂</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {transactions.map((txn) => {
                                    const payStyle = PAYMENT_STYLES[txn.payment_status] || PAYMENT_STYLES.PENDING;
                                    const delStyle = DELIVERY_STYLES[txn.delivery_status] || DELIVERY_STYLES.PENDING;
                                    const date = txn.transaction_date ? new Date(txn.transaction_date).toLocaleDateString() : '';

                                    return (
                                        <tr key={txn.transaction_id} className="group hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-6">
                                                <div className="flex items-center gap-3">
                                            
                                                    <div>
                                                        <p className="text-sm font-black uppercase italic tracking-tight leading-none group-hover:text-[#08CB00] transition-colors">
                                                            {txn.listing_title || txn.device_brand_model}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-[10px] text-white/30 font-bold">{date}</span>
                                                            {txn.buyer_username && (
                                                                <span className="text-[10px] text-white/20 font-bold">• Buyer: {txn.buyer_username}</span>
                                                            )}
                                                            {txn.has_dispute && (
                                                                <span className="flex items-center gap-1 text-[9px] font-black text-red-400">
                                                                    <AlertTriangle size={9} /> Dispute
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 text-center">
                                                <span className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-full border ${payStyle}`}>
                                                    {txn.payment_status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-6 text-center">
                                                <span className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-full border ${delStyle}`}>
                                                    {txn.delivery_status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-6 text-right">
                                                <p className="text-lg font-black text-white/60">${txn.final_price.toFixed(2)}</p>
                                                <p className="text-[9px] text-white/20 font-bold">Fee: ${txn.platform_fee.toFixed(2)}</p>
                                            </td>
                                            <td className="px-6 py-6 text-right">
                                                <p className="text-lg font-black text-[#08CB00]">
                                                    +${txn.seller_payout.toFixed(2)}
                                                </p>
                                            </td>
                                            <td className="px-6 py-6 text-right">
                                                {txn.co2_offset_realized > 0 ? (
                                                    <span className="flex items-center justify-end gap-1 text-sm font-black text-emerald-400">
                                                        <Leaf size={12} /> {txn.co2_offset_realized.toFixed(1)}kg
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] text-white/10">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </>
    );
}