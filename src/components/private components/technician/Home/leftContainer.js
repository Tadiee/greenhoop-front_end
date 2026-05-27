"use client"
import React, { useState } from 'react';
import { ShoppingCart, CheckCircle2, Clock, Loader2, RefreshCw, ArrowUpRight, Search, Filter, Tag, Truck, User } from 'lucide-react';

const QUEUE_STATUS = {
  available:   { label: 'Available',   cls: 'bg-[#08CB00]/10 text-[#08CB00] border-[#08CB00]/20' },
  dispatching: { label: 'Dispatching', cls: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  reserved:    { label: 'Reserved',    cls: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  purchased:   { label: 'Purchased',   cls: 'bg-white/5 text-white/30 border-white/10' },
};

const SOURCE_ICON = { user: User, marketplace: Tag, dispatch: Truck };

export default function LeftContainer({ purchaseQueue = [], recentPurchases = [], dashStats = {}, loading, onRefresh }) {
  const [query, setQuery] = useState('');

  const filtered = purchaseQueue.filter(item =>
    !query || [item.item_name, item.category, item.source_type, item.listing_id]
      .join(' ').toLowerCase().includes(query.toLowerCase())
  );

  const topItem = filtered[0] || null;

  return (
    <div className="h-full flex flex-col gap-2 group">

      {/* TOP: Featured item hero */}
      <div className="relative h-1/2 transform-gpu transition-all duration-700 group-hover:rotate-y-[-1deg] group-hover:translate-z-12">
        <div className="absolute inset-10 bg-black/60 blur-[60px] rounded-[64px] translate-y-12 opacity-50" />
        <div className="h-full bg-gradient-to-br from-white/[0.08] to-transparent backdrop-blur-3xl border border-white/20 rounded-t-[56px] p-8 md:p-12 flex flex-col justify-between relative overflow-hidden shadow-3xl">

          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3 bg-[#08CB00]/10 w-fit px-4 py-1.5 rounded-full border border-[#08CB00]/20">
              <ShoppingCart size={14} className="text-[#08CB00]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#08CB00]">
                {loading ? 'Loading…' : `${purchaseQueue.length} Items Available`}
              </span>
            </div>
            <button onClick={onRefresh} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all">
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center flex-1 gap-2">
              <Loader2 size={18} className="text-[#08CB00] animate-spin" />
              <span className="text-[10px] text-white/30">Loading queue...</span>
            </div>
          ) : topItem ? (
            <div className="flex flex-col lg:flex-row items-center flex-1 gap-6 mt-4">
              <div className="flex-1 space-y-4 relative z-10">
                <div>
                  <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-none">
                    {topItem.item_name || topItem.brand_n_model || 'E-Waste Item'}
                  </h2>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mt-2">
                    {topItem.category} &middot; {topItem.source_type === 'user' ? 'Direct from User' : 'Marketplace Listing'}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  {topItem.asking_price != null && (
                    <span className="text-2xl font-black text-[#08CB00]">${topItem.asking_price}</span>
                  )}
                  {topItem.estimated_weight && (
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                      {topItem.estimated_weight} kg
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 pt-2">
                  <div className="flex flex-col">
                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Today Spent</p>
                    <p className="text-sm font-black text-white">{dashStats.spent_today != null ? `$${dashStats.spent_today}` : '—'}</p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Purchased</p>
                    <p className="text-sm font-black text-white">{dashStats.purchased_today ?? '—'}</p>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 w-32 h-32 relative">
                <div className="absolute inset-0 bg-[#08CB00]/10 blur-3xl rounded-full" />
                <div className="relative z-10 w-full h-full rounded-[32px] bg-white/5 border border-white/10 flex items-center justify-center">
                  <ShoppingCart size={40} className="text-white/10" />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 gap-3">
              <CheckCircle2 size={32} className="text-[#08CB00]/30" />
              <p className="text-[10px] font-black uppercase tracking-widest text-white/20">No items in queue right now</p>
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM: Purchase queue table */}
      <div className="h-1/2 bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-b-[54px] p-6 md:p-8 flex flex-col shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-white/40">Purchase Queue</h3>
          <div className="flex gap-2 items-center">
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
              <Search size={11} className="text-white/30" />
              <input
                value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search items..."
                className="bg-transparent text-[10px] font-bold text-white placeholder-white/20 focus:outline-none w-28"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-[8px] font-black uppercase text-white/20 tracking-[0.2em]">
                <th className="pb-2 pl-4">Item</th>
                <th className="pb-2">Source</th>
                <th className="pb-2">Price</th>
                <th className="pb-2">Status</th>
                <th className="pb-2 text-right pr-4">Action</th>
              </tr>
            </thead>
            <tbody className="text-[10px] font-bold">
              {loading ? (
                <tr><td colSpan={5} className="py-6 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 size={12} className="text-[#08CB00] animate-spin" />
                    <span className="text-white/20">Loading...</span>
                  </div>
                </td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="py-6 text-center text-[9px] text-white/20 uppercase tracking-widest">
                  {query ? 'No matching items' : 'Queue is empty'}
                </td></tr>
              ) : filtered.map((item, i) => {
                const statusCfg = QUEUE_STATUS[item.status] || QUEUE_STATUS.available;
                const SrcIcon = SOURCE_ICON[item.source_type] || Tag;
                return (
                  <tr key={item.listing_id || item.submit_id || i} className="bg-white/[0.02] hover:bg-white/5 transition-all">
                    <td className="py-3 pl-4 rounded-l-2xl border-y border-l border-white/5">
                      <p className="text-white font-black italic truncate max-w-[160px]">{item.item_name || item.brand_n_model || '—'}</p>
                      <p className="text-[8px] text-white/30 uppercase tracking-widest">{item.category || '—'}</p>
                    </td>
                    <td className="py-3 border-y border-white/5">
                      <div className="flex items-center gap-1.5">
                        <SrcIcon size={11} className="text-white/30" />
                        <span className="text-white/40 capitalize">{item.source_type || '—'}</span>
                      </div>
                    </td>
                    <td className="py-3 border-y border-white/5">
                      <span className="text-[#08CB00] font-black">
                        {item.asking_price != null ? `$${item.asking_price}` : '—'}
                      </span>
                    </td>
                    <td className="py-3 border-y border-white/5">
                      <span className={`px-2 py-0.5 rounded-md text-[8px] uppercase font-black border ${statusCfg.cls}`}>
                        {statusCfg.label}
                      </span>
                    </td>
                    <td className="py-3 pr-4 rounded-r-2xl border-y border-r border-white/5 text-right">
                      <button className="p-1.5 hover:text-[#08CB00] text-white/20 transition-colors">
                        <ArrowUpRight size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}