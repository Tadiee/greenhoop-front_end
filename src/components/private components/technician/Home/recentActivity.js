"use client"
import React from 'react';
import { History, Tag, User, Truck, ArrowUpRight, Loader2, CheckCircle2 } from 'lucide-react';

const SOURCE_CFG = {
  user:        { icon: User,        cls: 'bg-blue-500/10 border-blue-500/20 text-blue-400',    label: 'User'        },
  marketplace: { icon: Tag,         cls: 'bg-[#08CB00]/10 border-[#08CB00]/20 text-[#08CB00]', label: 'Market'      },
  dispatch:    { icon: Truck,       cls: 'bg-purple-500/10 border-purple-500/20 text-purple-400', label: 'Dispatch' },
};

export default function RecentActivity({ recentPurchases = [], loading }) {
  return (
    <div className="flex-1 bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-[48px] p-6 md:p-8 flex flex-col shadow-2xl overflow-hidden">

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xs font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
          <History size={14} className="text-[#08CB00]" /> Recent Purchases
        </h3>
        <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">
          {recentPurchases.length} total
        </span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-none space-y-3 pr-1">
        {loading ? (
          <div className="flex items-center justify-center py-10 gap-2">
            <Loader2 size={14} className="text-[#08CB00] animate-spin" />
            <span className="text-[10px] text-white/30">Loading purchases...</span>
          </div>
        ) : recentPurchases.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <CheckCircle2 size={28} className="text-[#08CB00]/20" />
            <p className="text-[9px] font-black uppercase tracking-widest text-white/20">No purchases yet</p>
          </div>
        ) : recentPurchases.map((p, i) => {
          const cfg = SOURCE_CFG[p.source_type] || SOURCE_CFG.marketplace;
          const Icon = cfg.icon;
          return (
            <div key={p.id || p.listing_id || i}
              className="bg-black/30 border border-white/5 p-4 rounded-[20px] hover:bg-white/5 hover:border-white/10 transition-all cursor-pointer group flex items-center gap-3"
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${cfg.cls}`}>
                <Icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-white italic truncate">
                  {p.item_name || p.brand_n_model || '—'}
                </p>
                <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-0.5">
                  {p.category || '—'} &middot; {cfg.label}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-sm font-black text-[#08CB00]">
                  {p.price != null ? `$${p.price}` : '—'}
                </span>
                <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">
                  {p.time_ago || p.purchased_at || '—'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
