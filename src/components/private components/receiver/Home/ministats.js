"use client"
import React from 'react';
import { Warehouse, PackageCheck, Scale, Timer } from 'lucide-react';

export default function Ministats({ homeStats = {}, loading }) {
  const kpis = [
    {
      title: 'Items On Site',
      value: loading ? '—' : (homeStats.items_on_site ?? '—'),
      icon: Warehouse,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20',
    },
    {
      title: 'Dispatched Today',
      value: loading ? '—' : (homeStats.dispatched_today ?? '—'),
      icon: PackageCheck,
      color: 'text-[#08CB00]',
      bg: 'bg-[#08CB00]/10 border-[#08CB00]/20',
    },
    {
      title: 'Capacity Used',
      value: loading ? '—' : (homeStats.capacity_used_pct != null ? `${homeStats.capacity_used_pct}%` : '—'),
      icon: Scale,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10 border-orange-500/20',
    },
    {
      title: 'Avg. Processing',
      value: loading ? '—' : (homeStats.avg_processing_hrs != null ? `${homeStats.avg_processing_hrs}h` : '—'),
      icon: Timer,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((stat, i) => (
        <div key={i} className="border border-white/10 backdrop-blur-md rounded-[24px] p-5 flex flex-col justify-between group hover:border-white/20 transition-all cursor-pointer">
          <div className="mb-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${stat.bg} mb-3`}>
              <stat.icon size={18} className={stat.color} />
            </div>
            <h3 className="text-2xl font-black tracking-tighter text-white">{stat.value}</h3>
            <p className="text-[10px] font-black uppercase text-white/40 tracking-widest mt-1">{stat.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
}