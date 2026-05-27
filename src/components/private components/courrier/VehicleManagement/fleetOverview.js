"use client"
import React from 'react';
import { Truck, Users, Wrench, XCircle, TrendingUp, Package } from 'lucide-react';

export default function FleetOverview({ stats }) {
  const cards = [
    { label: 'Total Vehicles', value: stats.total_vehicles ?? '—', icon: Truck, color: 'text-white', bg: 'bg-white/5', border: 'border-white/10' },
    { label: 'Active Now', value: stats.active ?? '—', icon: TrendingUp, color: 'text-[#08CB00]', bg: 'bg-[#08CB00]/10', border: 'border-[#08CB00]/20' },
    { label: 'Registered Drivers', value: stats.total_drivers ?? '—', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { label: 'In Maintenance', value: stats.maintenance ?? '—', icon: Wrench, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
    { label: 'Inactive', value: stats.inactive ?? '—', icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
    { label: 'Deliveries Today', value: stats.deliveries_today ?? '—', icon: Package, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div key={c.label} className={`${c.bg} border ${c.border} rounded-[24px] p-4 flex flex-col gap-3`}>
            <div className={`w-8 h-8 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center`}>
              <Icon size={15} className={c.color} />
            </div>
            <div>
              <p className={`text-2xl font-black ${c.color}`}>{c.value}</p>
              <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mt-0.5">{c.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
