"use client"
import React from 'react';
import { Truck, MapPin, Clock, Activity, Zap } from 'lucide-react';

export default function RightContainer({ stats, fleetStats }) {
  const total = fleetStats?.total_vehicles || 1;
  const fleetBars = [
    { label: 'Active',      count: fleetStats?.active ?? 0,      color: 'bg-[#08CB00]' },
    { label: 'Inactive',    count: fleetStats?.inactive ?? 0,    color: 'bg-white/20' },
    { label: 'Maintenance', count: fleetStats?.maintenance ?? 0, color: 'bg-yellow-500' },
  ];

  const kpis = [
    { label: 'Avg. Delivery Time', value: stats?.avg_delivery_min ? `${stats.avg_delivery_min}m` : '—', icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { label: 'Distance Today',     value: stats?.distance_km ? `${stats.distance_km}km` : '—',         icon: MapPin, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    { label: 'Efficiency',         value: stats?.efficiency_pct ? `${stats.efficiency_pct}%` : '—',    icon: Activity, color: 'text-[#08CB00]', bg: 'bg-[#08CB00]/10 border-[#08CB00]/20' },
    { label: 'Battery Avg',        value: fleetStats?.avg_battery ? `${fleetStats.avg_battery}%` : '—', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
  ];

  return (
    <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
      {/* KPI Grid */}
      <div className="grid grid-cols-2 gap-3">
        {kpis.map(k => {
          const Icon = k.icon;
          return (
            <div key={k.label} className={`bg-white/[0.02] border rounded-[24px] p-4 ${k.bg}`}>
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center mb-3 ${k.bg}`}>
                <Icon size={14} className={k.color} />
              </div>
              <p className={`text-xl font-black ${k.color}`}>{k.value}</p>
              <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mt-0.5">{k.label}</p>
            </div>
          );
        })}
      </div>

      {/* Fleet Status */}
      <div className="bg-white/[0.02] border border-white/5 rounded-[28px] p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-black text-white">Fleet Status</p>
            <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mt-0.5">{total} Total Vehicles</p>
          </div>
          <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Truck size={14} className="text-[#08CB00]" />
          </div>
        </div>

        <div className="space-y-3">
          {fleetBars.map(bar => {
            const pct = Math.round((bar.count / total) * 100);
            return (
              <div key={bar.label}>
                <div className="flex justify-between text-[10px] text-white/40 mb-1.5">
                  <span className="font-bold">{bar.label}</span>
                  <span className="font-mono">{bar.count} <span className="text-white/20">({pct}%)</span></span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${bar.color}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}