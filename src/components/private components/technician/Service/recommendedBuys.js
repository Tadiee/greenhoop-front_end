"use client"
import React from 'react';
import { Sparkles, Tag, User, Truck, ArrowRight, Loader2 } from 'lucide-react';

const SOURCE_ICON = { user: User, marketplace: Tag, dispatch: Truck };
const SOURCE_COLOR = { user: 'text-blue-400', marketplace: 'text-purple-400', dispatch: 'text-[#08CB00]' };

export default function RecommendedBuys({ listings = [], loading, onSelect }) {
  const recommended = listings
    .filter(l => l.asking_price != null)
    .sort((a, b) => {
      const scoreA = (a.salvage_value || 0) - (a.asking_price || 0);
      const scoreB = (b.salvage_value || 0) - (b.asking_price || 0);
      return scoreB - scoreA;
    })
    .slice(0, 5);

  return (
    <div className="bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-[32px] p-5 flex flex-col gap-4 shadow-2xl">

      <div className="flex items-center gap-2">
        <Sparkles size={13} className="text-[#08CB00]" />
        <h3 className="text-xs font-black uppercase tracking-widest text-white/40">Recommended</h3>
      </div>

      <div className="flex flex-col gap-2">
        {loading ? (
          <div className="flex items-center justify-center py-6 gap-2">
            <Loader2 size={14} className="text-[#08CB00] animate-spin" />
            <span className="text-[10px] text-white/30">Finding best buys...</span>
          </div>
        ) : recommended.length === 0 ? (
          <p className="text-[9px] font-black uppercase tracking-widest text-white/20 text-center py-4">
            No recommendations yet
          </p>
        ) : recommended.map((item, i) => {
          const SrcIcon = SOURCE_ICON[item.source_type] || Tag;
          const srcColor = SOURCE_COLOR[item.source_type] || 'text-white/30';
          const margin = item.salvage_value != null && item.asking_price != null
            ? (item.salvage_value - item.asking_price).toFixed(0)
            : null;
          return (
            <button key={item.listing_id || item.submit_id || i}
              onClick={() => onSelect(item)}
              className="bg-black/30 border border-white/5 p-3.5 rounded-[18px] hover:bg-white/5 hover:border-white/10 transition-all group flex items-center gap-3 text-left"
            >
              {/* Rank badge */}
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-[9px] font-black shrink-0 border ${
                i === 0 ? 'bg-[#08CB00]/20 border-[#08CB00]/30 text-[#08CB00]'
                : 'bg-white/5 border-white/10 text-white/20'
              }`}>
                #{i + 1}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-black text-white italic truncate">
                  {item.item_name || item.brand_n_model || '—'}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <SrcIcon size={9} className={srcColor} />
                  <span className="text-[8px] text-white/30 uppercase tracking-widest">{item.category}</span>
                  {item.distance != null && (
                    <span className="text-[8px] text-white/20">{item.distance}km</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0">
                <span className="text-sm font-black text-[#08CB00]">
                  {item.asking_price != null ? `$${item.asking_price}` : '—'}
                </span>
                {margin != null && Number(margin) > 0 && (
                  <span className="text-[8px] font-black text-white/30">
                    +${margin} margin
                  </span>
                )}
              </div>

              <ArrowRight size={12} className="text-white/10 group-hover:text-white/50 transition-colors shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
