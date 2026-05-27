"use client"
import React, { useState } from 'react';
import { Package, CheckCircle2, Circle, ShieldCheck, ChevronRight, AlertTriangle, Building2 } from 'lucide-react';

export default function InventoryPhase({ job, onConfirm }) {
  const items = job?.items || [
    { id: 1, name: job?.item || 'E-Waste Item', weight: job?.weight || '—', checked: false },
  ];

  const [checklist, setChecklist] = useState(items.map(it => ({ ...it, checked: false })));
  const [notes, setNotes] = useState('');
  const allChecked = checklist.every(i => i.checked);

  const toggle = (id) => setChecklist(prev => prev.map(i => i.id === id ? { ...i, checked: !i.checked } : i));

  return (
    <div className="h-full flex flex-col min-h-0">
      {/* Header */}
      <div className="shrink-0 p-5 bg-[#1A1A1A] border-b border-white/5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center">
          <Package size={18} className="text-orange-400" />
        </div>
        <div>
          <h2 className="text-white font-black tracking-tight">Verify Inventory</h2>
          <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest mt-0.5">
            Confirm every item collected from {job?.customer}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-none p-5 space-y-4 min-h-0">
        {/* Route summary */}
        <div className="flex items-center gap-2 p-3 bg-white/5 border border-white/10 rounded-2xl">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="w-2 h-2 rounded-full bg-[#08CB00] shrink-0" />
            <span className="text-[9px] font-black text-white/60 truncate">{job?.customer || 'Pickup'}</span>
          </div>
          <div className="w-6 border-t border-dashed border-white/20 shrink-0" />
          <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
            <span className="text-[9px] font-black text-white/60 truncate">{job?.hub || 'Hub'}</span>
            <Building2 size={10} className="text-blue-400 shrink-0" />
          </div>
        </div>

        {/* Checklist */}
        <div className="space-y-2">
          <p className="text-[9px] text-white/30 font-black uppercase tracking-widest px-1">Items Collected</p>
          {checklist.map(item => (
            <button
              key={item.id}
              onClick={() => toggle(item.id)}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                item.checked
                  ? 'bg-[#08CB00]/5 border-[#08CB00]/20'
                  : 'bg-white/5 border-white/5 hover:border-white/15'
              }`}
            >
              {item.checked
                ? <CheckCircle2 size={18} className="text-[#08CB00] shrink-0" />
                : <Circle size={18} className="text-white/20 shrink-0" />
              }
              <div className="flex-1 min-w-0 text-left">
                <p className={`text-xs font-black truncate ${item.checked ? 'text-white' : 'text-white/50'}`}>
                  {item.name}
                </p>
                {item.weight && (
                  <p className="text-[8px] text-white/25 font-bold mt-0.5">{item.weight}</p>
                )}
              </div>
              {item.checked && (
                <span className="text-[8px] font-black text-[#08CB00] uppercase tracking-widest shrink-0">Verified</span>
              )}
            </button>
          ))}
        </div>

        {/* Condition notes */}
        <div className="space-y-2">
          <p className="text-[9px] text-white/30 font-black uppercase tracking-widest px-1">Condition Notes (optional)</p>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="e.g. Device has cracked screen, cables missing..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-[10px] text-white placeholder-white/20 focus:outline-none focus:border-white/20 resize-none font-medium"
            rows={3}
          />
        </div>

        {/* Warning if not all checked */}
        {!allChecked && (
          <div className="flex items-start gap-2 p-3 bg-orange-500/5 border border-orange-500/15 rounded-2xl">
            <AlertTriangle size={13} className="text-orange-400 shrink-0 mt-0.5" />
            <p className="text-[9px] text-white/40">Check off every item before proceeding to hub delivery.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="shrink-0 bg-[#1A1A1A] border-t border-white/5 p-5">
        <button
          onClick={() => onConfirm?.({ checklist, notes })}
          disabled={!allChecked}
          className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 ${
            allChecked
              ? 'bg-[#08CB00] text-black shadow-[0_0_20px_rgba(8,203,0,0.4)] hover:bg-[#06a800]'
              : 'bg-white/5 text-white/20 cursor-not-allowed'
          }`}
        >
          <ShieldCheck size={16} />
          {allChecked ? 'Proceed to Hub Handoff' : `Check All Items (${checklist.filter(i => i.checked).length}/${checklist.length})`}
          {allChecked && <ChevronRight size={16} />}
        </button>
      </div>
    </div>
  );
}
