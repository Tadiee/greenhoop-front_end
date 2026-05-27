"use client"
import React, { useState, useEffect } from 'react';
import { BarChart3, Leaf, DollarSign, Package, CheckCircle2, Clock, Loader2 } from 'lucide-react';

export default function ImpactSummaryComp() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/recycler/etrack/stats', { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(data => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <div className="h-1/2 bg-[#0A0A0A] border border-white/5 rounded-[48px] p-6 flex flex-col items-center justify-center shadow-2xl">
        <Loader2 size={24} className="text-[#08CB00] animate-spin mb-3" />
        <p className="text-[10px] text-white/30">Loading impact summary...</p>
      </div>
    );
  }

  const statItems = [
    { label: 'Total Submissions', value: stats.total_submissions,         unit: '',    color: 'text-white',       icon: Package },
    { label: 'Completed',         value: stats.completed,                   unit: '',    color: 'text-[#08CB00]',   icon: CheckCircle2 },
    { label: 'In Progress',       value: stats.in_progress,                 unit: '',    color: 'text-yellow-400',  icon: Clock },
    { label: 'Total Weight',      value: stats.total_weight_kg?.toFixed(1), unit: 'kg',  color: 'text-white',       icon: BarChart3 },
    { label: 'CO₂ Offset',        value: stats.co2_offset_kg?.toFixed(1),   unit: 'kg',  color: 'text-[#08CB00]',   icon: Leaf },
    { label: 'Mineral Value',     value: `$${stats.mineral_value_usd?.toFixed(2)}`,  unit: '', color: 'text-yellow-400', icon: DollarSign },
    { label: 'Total Payout',      value: `$${stats.total_payout_usd?.toFixed(2)}`,   unit: '', color: 'text-blue-400',   icon: DollarSign },
  ];

  return (
    <div className="h-1/2 bg-[#0A0A0A] border border-white/5 rounded-[48px] p-6 flex flex-col shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between mb-5 shrink-0">
        <div>
          <h3 className="text-[9px] font-black uppercase tracking-widest text-[#08CB00]">Impact Summary</h3>
          <p className="text-[8px] text-white/20 mt-0.5">Across all accepted submissions</p>
        </div>
        <BarChart3 size={16} className="text-[#08CB00]" />
      </div>

      <div className="flex-1 grid grid-cols-2 gap-2 overflow-hidden">
        {statItems.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-black/40 border border-white/5 rounded-2xl p-3 flex flex-col justify-between">
              <Icon size={14} className={s.color} />
              <div>
                <p className={`text-xl font-black tracking-tighter ${s.color}`}>
                  {s.value}<span className="text-xs text-white/20 ml-0.5">{s.unit}</span>
                </p>
                <p className="text-[8px] font-bold text-white/30 uppercase tracking-wider">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion bar */}
      <div className="mt-4 shrink-0">
        <div className="flex justify-between text-[8px] text-white/30 mb-1">
          <span>Completion Rate</span>
          <span className="text-[#08CB00] font-bold">{stats.completion_rate_pct}%</span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#08CB00] rounded-full transition-all"
            style={{ width: `${stats.completion_rate_pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}