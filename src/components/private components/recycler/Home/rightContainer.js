"use client"
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  CheckCircle2, XCircle, Bell, Inbox, Truck, Package,
  Timer, Smartphone, Laptop, Monitor, Battery,
  Cpu, Weight, TrendingUp, Activity, AlertTriangle
} from 'lucide-react';

const CATEGORY_ICONS = {
  "Mobile Phone": Smartphone,
  "Laptop": Laptop,
  "Desktop PC": Monitor,
  "Television": Monitor,
  "Battery": Battery,
  "Small Electronics": Cpu,
  "Other": Package,
};

const STATUS_LABELS = {
  "OFFERED":          { label: "Awaiting Response",  color: "text-amber-400",   bg: "bg-amber-500/10",   border: "border-amber-500/20"   },
  "ACCEPTED":         { label: "Accepted",            color: "text-[#08CB00]",   bg: "bg-[#08CB00]/10",   border: "border-[#08CB00]/20"   },
  "pickup_scheduled": { label: "Pickup Scheduled",    color: "text-blue-400",    bg: "bg-blue-500/10",    border: "border-blue-500/20"    },
  "in_transit":       { label: "In Transit",          color: "text-purple-400",  bg: "bg-purple-500/10",  border: "border-purple-500/20"  },
  "completed":        { label: "Processed",           color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
};

const MINERALS = [
  { key: 'gold_usd',     label: 'Gold',     cls: 'text-yellow-400  bg-yellow-500/10  border-yellow-500/20'  },
  { key: 'silver_usd',   label: 'Silver',   cls: 'text-gray-300    bg-gray-400/10    border-gray-400/20'    },
  { key: 'lithium_usd',  label: 'Lithium',  cls: 'text-purple-400  bg-purple-500/10  border-purple-500/20'  },
  { key: 'aluminum_usd', label: 'Aluminum', cls: 'text-slate-300   bg-slate-400/10   border-slate-400/20'   },
  { key: 'platinum_usd', label: 'Platinum', cls: 'text-indigo-300  bg-indigo-400/10  border-indigo-400/20'  },
  { key: 'rhodium_usd',  label: 'Rhodium',  cls: 'text-pink-300    bg-pink-400/10    border-pink-400/20'    },
  { key: 'nickel_usd',   label: 'Nickel',   cls: 'text-emerald-300 bg-emerald-400/10 border-emerald-400/20' },
  { key: 'tin_usd',      label: 'Tin',      cls: 'text-cyan-300    bg-cyan-400/10    border-cyan-400/20'    },
  { key: 'carbon_usd',   label: 'Carbon',   cls: 'text-stone-300   bg-stone-400/10   border-stone-400/20'   },
];


function timeRemaining(expiresAt) {
  const diff = new Date(expiresAt) - new Date();
  if (diff <= 0) return 'Expired';
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return mins + 'm';
  return Math.floor(mins / 60) + 'h ' + (mins % 60) + 'm';
}

export default function RecyclerHomeRightContainer({ incomingOffers = [], activeJobs = [], stats = {} }) {
  const [selectedOffer, setSelectedOffer] = useState(null);

  const capacityPct = stats.facility_load_pct ?? 0;
  const capBarCls   = capacityPct > 90 ? 'bg-red-500' : capacityPct > 70 ? 'bg-amber-400' : 'bg-[#08CB00]';
  const capTextCls  = capacityPct > 90 ? 'text-red-400' : capacityPct > 70 ? 'text-amber-400' : 'text-[#08CB00]';

  return (
    <div className="col-span-1 lg:col-span-5 flex flex-col gap-4 lg:overflow-hidden lg:h-full">

      {/* KPI CARDS */}
      <div className="grid grid-cols-3 gap-3 shrink-0">
        {[
          { label: 'Facility Load', value: capacityPct + '%',        sub: 'of max capacity',  Icon: Weight,     accent: capTextCls },
          { label: 'Active Jobs',   value: activeJobs.length,          sub: 'In pipeline',      Icon: Activity,   accent: 'text-[#08CB00]' },
          { label: 'Open Offers',   value: incomingOffers.length,      sub: 'Pending review',   Icon: TrendingUp, accent: 'text-amber-400' },
        ].map(function(item) {
          return (
            <div key={item.label} className="bg-white/[0.03] border border-white/5 rounded-[28px] p-4 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <p className="text-[7px] font-black uppercase tracking-widest text-white/30">{item.label}</p>
                <item.Icon size={13} className={item.accent} />
              </div>
              <p className={"text-xl font-black " + item.accent}>{item.value}</p>
              <p className="text-[8px] text-white/20">{item.sub}</p>
            </div>
          );
        })}
      </div>

      {/* INCOMING OFFERS */}
      <div className="min-h-[320px] lg:flex-1 bg-white/[0.02] border border-white/5 rounded-[40px] p-6 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <div className="flex items-center gap-2">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-[#08CB00]">Incoming Offers</h3>
            {incomingOffers.length > 0 && (
              <span className="text-[8px] bg-[#08CB00] text-black px-2 py-0.5 rounded-full font-black">{incomingOffers.length}</span>
            )}
          </div>
          <Bell size={14} className="text-[#08CB00] animate-pulse" />
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin space-y-2 pr-1 min-h-0">
          {incomingOffers.map(function(offer) {
            const Icon   = CATEGORY_ICONS[offer.category] || Package;
            const tLeft  = timeRemaining(offer.expires_at);
            const isHot  = offer.your_score >= 80;
            return (
              <div
                key={offer.submit_id}
                onClick={function() { setSelectedOffer(offer); }}
                className={"p-4 rounded-2xl border cursor-pointer transition-all " + (isHot ? 'bg-[#08CB00]/5 border-[#08CB00]/20 hover:border-[#08CB00]/50' : 'bg-white/[0.02] border-white/5 hover:border-white/20')}
              >
                <div className="flex items-center gap-3">
                  <div className={"p-2 rounded-xl shrink-0 " + (isHot ? 'bg-[#08CB00]/10 text-[#08CB00]' : 'bg-white/5 text-white/40')}>
                    <Icon size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-black uppercase italic text-white truncate">{offer.brand_n_model}</p>
                    <p className="text-[8px] text-white/30 mt-0.5">#{offer.submit_id} · {offer.category} · {offer.estimated_weight}kg</p>
                  </div>
                  <div className="text-right shrink-0 space-y-1">
                    <div className="flex items-center gap-1 justify-end">
                      <div className="w-10 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-[#08CB00] rounded-full" style={{ width: offer.your_score + '%' }} />
                      </div>
                      <span className="text-[9px] font-black text-[#08CB00]">{offer.your_score}%</span>
                    </div>
                    <div className="flex items-center gap-1 text-[8px] text-white/30 justify-end">
                      <Timer size={9} />
                      <span className={tLeft === 'Expired' ? 'text-red-400' : ''}>{tLeft}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {incomingOffers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10">
              <Inbox size={24} className="text-white/10 mb-2" />
              <p className="text-[10px] text-white/20">No incoming offers</p>
            </div>
          )}
        </div>
      </div>

      {/* ACTIVE PIPELINE */}
      <div className="min-h-[300px] lg:flex-[1.4] bg-white/[0.02] border border-white/5 rounded-[40px] p-6 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-3 shrink-0">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#08CB00]">Active Pipeline</p>
          <div className="flex items-center gap-3">
            <span className="text-[9px] text-white/30">{activeJobs.length} jobs</span>
            <button
              onClick={() => window.location.href = '/recycler/eTrack'}
              className="text-[9px] font-black text-[#08CB00]/60 hover:text-[#08CB00] uppercase tracking-widest transition-colors"
            >
              View All →
            </button>
          </div>
        </div>
        <div className="mb-4 shrink-0">
          <div className="flex justify-between mb-1.5">
            <span className="text-[8px] font-black uppercase text-white/30 tracking-widest">Facility Load</span>
            <span className="text-[9px] font-mono text-white/40">{capacityPct}% capacity</span>
          </div>
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className={"h-full rounded-full transition-all " + capBarCls} style={{ width: capacityPct + '%' }} />
          </div>
          {capacityPct > 90 && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <AlertTriangle size={10} className="text-red-400" />
              <p className="text-[9px] text-red-400">Nearing capacity</p>
            </div>
          )}
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin space-y-2 pr-1 min-h-0">
          {activeJobs.map(function(job) {
            const si   = STATUS_LABELS[job.status] || STATUS_LABELS['ACCEPTED'];
            const Icon = CATEGORY_ICONS[job.category] || Package;
            return (
              <div key={job.submit_id} className="flex items-center gap-3 p-3 bg-black/30 border border-white/5 rounded-2xl hover:border-white/10 transition-all">
                <div className="p-2 bg-white/5 rounded-xl text-white/40 shrink-0"><Icon size={14} /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-black text-white truncate">{job.brand_n_model}</p>
                  <p className="text-[8px] text-white/20">#{job.submit_id} · {job.estimated_weight}kg</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[9px] text-white/40 mb-0.5">{job.preferred_date}</p>
                  <span className={"text-[8px] font-black px-2 py-0.5 rounded-full border " + si.bg + " " + si.color + " " + si.border}>{si.label}</span>
                </div>
              </div>
            );
          })}
          {activeJobs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8">
              <Truck size={20} className="text-white/10 mb-2" />
              <p className="text-[9px] text-white/20">No active jobs</p>
            </div>
          )}
        </div>
      </div>

      {/* OFFER DETAIL MODAL */}
      {selectedOffer && typeof window !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={function() { setSelectedOffer(null); }} />
          <div className="relative bg-[#0a0a0a] border border-white/10 rounded-[40px] p-8 max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl overflow-y-auto scrollbar-thin">
            <button onClick={function() { setSelectedOffer(null); }} className="absolute top-5 right-5 p-2 text-white/30 hover:text-white transition-colors">
              <XCircle size={20} />
            </button>
            {(function() {
              const Icon = CATEGORY_ICONS[selectedOffer.category] || Package;
              return (
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-[#08CB00]/10 rounded-2xl text-[#08CB00]"><Icon size={22} /></div>
                  <div>
                    <p className="text-base font-black uppercase italic text-white">{selectedOffer.brand_n_model}</p>
                    <p className="text-[10px] text-white/40">{selectedOffer.category} · {selectedOffer.device_state}</p>
                  </div>
                </div>
              );
            })()}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-[#08CB00]/10 border border-[#08CB00]/20 rounded-2xl p-4">
                <p className="text-[9px] text-white/40 uppercase mb-1">Match Score</p>
                <p className="text-2xl font-black text-[#08CB00]">{selectedOffer.your_score}%</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-[9px] text-white/40 uppercase mb-1">Est. Cost</p>
                <p className="text-2xl font-black text-white">${selectedOffer.estimated_cost}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-0 mb-5">
              {[
                ['Submission ID', '#' + selectedOffer.submit_id],
                ['Weight',        selectedOffer.estimated_weight + 'kg'],
                ['Pickup Date',   selectedOffer.preferred_date],
                ['Pickup Time',   selectedOffer.preferred_time || '--'],
                ['Expires',       timeRemaining(selectedOffer.expires_at)],
                ['Type',          selectedOffer.submission_type],
              ].map(function(row) {
                return (
                  <div key={row[0]} className="py-2 border-b border-white/5">
                    <span className="text-[8px] text-white/30 uppercase block">{row[0]}</span>
                    <span className="text-[11px] font-bold text-white/80">{row[1]}</span>
                  </div>
                );
              })}
              {selectedOffer.latitude && (
                <div className="col-span-2 py-2 border-b border-white/5 cursor-pointer group" onClick={function() { setSelectedOffer(null); window.location.href = '/recycler/Proximity?lat=' + selectedOffer.latitude + '&lng=' + selectedOffer.longitude + '&submitId=' + selectedOffer.submit_id; }}>
                  <span className="text-[8px] text-white/30 uppercase block">Location</span>
                  <span className="text-[10px] font-mono text-[#08CB00] group-hover:underline">{selectedOffer.latitude.toFixed(4)}, {selectedOffer.longitude.toFixed(4)}</span>
                  <span className="text-[9px] text-white/30 block">Click to view on map</span>
                </div>
              )}
            </div>
            {selectedOffer.mineral_composition && (
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 mb-5">
                <p className="text-[9px] font-black uppercase text-white/20 tracking-widest mb-3">Mineral Breakdown</p>
                <div className="grid grid-cols-3 gap-2">
                  {MINERALS.filter(function(m) { return selectedOffer.mineral_composition[m.key] > 0; }).map(function(m) {
                    return (
                      <div key={m.key} className={"px-2 py-1.5 rounded-xl border " + m.cls}>
                        <span className="text-[8px] text-white/30 block uppercase">{m.label}</span>
                        <span className="text-[11px] font-black">${selectedOffer.mineral_composition[m.key]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={function() {
                  const params = new URLSearchParams({ submitId: selectedOffer.submit_id });
                  if (selectedOffer.latitude)  params.set('lat', selectedOffer.latitude);
                  if (selectedOffer.longitude) params.set('lng', selectedOffer.longitude);
                  window.location.href = '/recycler/Proximity?' + params.toString();
                }}
                className="flex-1 py-3.5 bg-[#08CB00] text-black rounded-2xl text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#08CB00]/80 transition-all"
              >
                <CheckCircle2 size={16} /> Review Offer
              </button>
              <button
                onClick={function() { setSelectedOffer(null); }}
                className="py-3.5 px-5 bg-white/5 border border-white/10 text-white/40 rounded-2xl text-[11px] font-black uppercase tracking-wider flex items-center justify-center hover:border-white/20 hover:text-white/60 transition-all"
              >
                <XCircle size={16} />
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}