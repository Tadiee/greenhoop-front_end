"use client"
import React from 'react';
import { 
  Leaf, TrendingUp, Zap, Package, Tag, Globe, Sparkles,   
} from 'lucide-react';
import { END_OF_LIFE_OUTCOMES, ACCEPTED_SUBMISSIONS } from './etrackConstants';

const MINERAL_COLORS = {
  gold_usd:     { label: 'Gold',     color: '#F59E0B' },
  silver_usd:   { label: 'Silver',   color: '#CBD5E1' },
  aluminum_usd: { label: 'Aluminum', color: '#94A3B8' },
  lithium_usd:  { label: 'Lithium',  color: '#A855F7' },
  copper_usd:   { label: 'Copper',   color: '#F97316' },
  nickel_usd:   { label: 'Nickel',   color: '#10B981' },
  cobalt_usd:   { label: 'Cobalt',   color: '#3B82F6' },
  platinum_usd: { label: 'Platinum', color: '#6366F1' },
  tin_usd:      { label: 'Tin',      color: '#06B6D4' },
};

export default function EndOfLifeComp({ submission }) {
  if (!submission) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10">
        <Package size={32} className="text-white/10 mb-3" />
        <p className="text-xs font-bold text-white/20">Select a submission to view its impact</p>
      </div>
    );
  }

  const minerals = submission.mineral_composition || {};
  const mineralEntries = Object.entries(minerals).filter(([, v]) => v > 0);
  const totalMineralValue = mineralEntries.reduce((sum, [, v]) => sum + v, 0);

  // Estimated CO2 offset: ~2.5kg CO2 per kg of e-waste properly recycled
  const co2Offset = (submission.estimated_weight * 2.5).toFixed(1);
  // Landfill diverted
  const landfillDiverted = submission.estimated_weight;

  const outcome = END_OF_LIFE_OUTCOMES.find(o => o.id === submission.end_of_life_outcome);
  const isRecycled = submission.end_of_life_outcome === 'RECYCLED' || submission.end_of_life_outcome === 'REFURBISHED' || submission.end_of_life_outcome === 'PARTS';

  return (
    <div className="flex-1 flex gap-6 relative z-10">

      {/* LEFT: Mineral Breakdown */}
      <div className="w-[35%] flex flex-col gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-[#08CB00] rounded-full animate-pulse" />
            <p className="text-[9px] font-black uppercase tracking-widest text-[#08CB00]">Mineral Composition</p>
          </div>
          <p className="text-4xl font-black tracking-tighter">${totalMineralValue.toFixed(0)}<span className="text-base text-white/20 ml-1">USD</span></p>
          <p className="text-[9px] text-white/30 mt-1">{submission.brand_n_model}</p>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto scrollbar-thin">
          {mineralEntries.length > 0 ? mineralEntries.map(([key, val]) => {
            const meta = MINERAL_COLORS[key];
            if (!meta) return null;
            const pct = Math.round((val / totalMineralValue) * 100);
            return (
              <div key={key} className="space-y-1">
                <div className="flex justify-between text-[9px]">
                  <span className="font-bold" style={{ color: meta.color }}>{meta.label}</span>
                  <span className="text-white/40">${val} · {pct}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: meta.color }} />
                </div>
              </div>
            );
          }) : (
            <p className="text-[10px] text-white/20">No mineral data available</p>
          )}
        </div>
      </div>

      {/* CENTER: Environmental Impact */}
      <div className="flex-1 flex flex-col bg-black/20 border border-white/5 rounded-[32px] p-6 gap-4">
        <div>
          <h3 className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-1">Environmental Impact</h3>
          <p className="text-[8px] text-white/20">{submission.device_state} · {submission.estimated_weight}kg</p>
        </div>

        <div className="grid grid-cols-2 gap-3 flex-1">
          <div className="bg-[#08CB00]/5 border border-[#08CB00]/20 rounded-2xl p-4 flex flex-col justify-between">
            <Leaf size={18} className="text-[#08CB00]" />
            <div>
              <p className="text-2xl font-black tracking-tighter text-[#08CB00]">{co2Offset}<span className="text-xs ml-1 text-white/20">kg</span></p>
              <p className="text-[8px] font-black uppercase text-[#08CB00]/60 tracking-wider">CO₂ Offset</p>
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
            <TrendingUp size={18} className="text-white/30" />
            <div>
              <p className="text-2xl font-black tracking-tighter">{landfillDiverted}<span className="text-xs ml-1 text-white/20">kg</span></p>
              <p className="text-[8px] font-black uppercase text-white/30 tracking-wider">Landfill Diverted</p>
            </div>
          </div>

          <div className="col-span-2 bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex items-center gap-4">
            <Zap size={18} className="text-yellow-500 shrink-0" />
            <div>
              <p className="text-[11px] font-black text-white">Energy Recovery</p>
              <p className="text-[9px] text-white/40">~{(submission.estimated_weight * 17.5).toFixed(0)} kWh equivalent energy value from recovered materials</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Outcome & Eco Score */}
      <div className="w-[22%] flex flex-col gap-4">
        {/* Outcome badge */}
        <div className="bg-white/[0.02] border border-white/5 rounded-[28px] p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Tag size={14} className="text-white/30" />
            <p className="text-[9px] font-black uppercase tracking-wider text-white/30">End-of-Life</p>
          </div>
          {outcome ? (
            <div className="p-3 rounded-xl border" style={{ borderColor: outcome.color + '40', backgroundColor: outcome.color + '0D' }}>
              <div className="w-3 h-3 rounded-full mb-2" style={{ backgroundColor: outcome.color }} />
              <p className="text-xs font-black" style={{ color: outcome.color }}>{outcome.label}</p>
              <p className="text-[9px] text-white/40 mt-1">{outcome.description}</p>
            </div>
          ) : (
            <p className="text-[10px] text-white/20 italic">Not yet determined</p>
          )}
        </div>

        {/* Eco score */}
        <div className="flex-1 bg-[#08CB00]/5 border border-[#08CB00]/20 rounded-[28px] p-5 flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <Globe size={14} className="text-[#08CB00]" />
            <p className="text-[9px] font-black uppercase tracking-wider text-[#08CB00]">Eco Score</p>
          </div>
          <div>
            <p className="text-5xl font-black tracking-tighter text-[#08CB00]">
              {isRecycled ? 'A+' : outcome ? 'C' : '—'}
            </p>
            <p className="text-[9px] text-white/40 mt-1">
              {isRecycled
                ? 'Excellent — e-waste reduced'
                : outcome
                  ? 'Suboptimal outcome recorded'
                  : 'Pending end-of-life outcome'
              }
            </p>
          </div>
          <div className="flex items-center gap-2 text-[9px] text-[#08CB00]/60">
            <Sparkles size={12} />
            <span>Contributes to GreenHoop impact index</span>
          </div>
        </div>
      </div>
    </div>
  );
}