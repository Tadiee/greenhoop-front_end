"use client"
import React from 'react';
import { DollarSign, TrendingUp, Package, CheckCircle2, Compass, Truck } from 'lucide-react';
import Link from 'next/link';

export default function MiddleContainer({ stats }) {
  const earned = stats?.earnings_today ?? 0;
  const target = stats?.earnings_target ?? 500;
  const pct = Math.min(100, Math.round((earned / (target || 1)) * 100));
  const circumference = 2 * Math.PI * 54;
  const dashOffset = circumference - (pct / 100) * circumference;

  const quickActions = [
    { label: 'Find Jobs', icon: Compass, href: '/courrier/Discovery', color: 'bg-[#08CB00] text-black' },
    { label: 'Deliveries', icon: Package, href: '/courrier/Deliveries', color: 'bg-white/5 border border-white/10 text-white/70' },
    { label: 'Fleet', icon: Truck, href: '/courrier/VehicleManagement', color: 'bg-white/5 border border-white/10 text-white/70' },
  ];

  return (
    <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
      {/* Earnings Ring Card */}
      <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-6 flex flex-col items-center gap-4">
        <div className="flex items-center justify-between w-full">
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Today's Earnings</p>
            <p className="text-2xl font-black text-white mt-0.5">${earned.toFixed(2)}</p>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 bg-[#08CB00]/10 border border-[#08CB00]/20 rounded-full">
            <TrendingUp size={10} className="text-[#08CB00]" />
            <span className="text-[9px] font-black text-[#08CB00]">{pct}% of target</span>
          </div>
        </div>

        {/* SVG Ring */}
        <div className="relative w-36 h-36">
          <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
            <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
            <circle
              cx="60" cy="60" r="54"
              fill="none"
              stroke="#08CB00"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <DollarSign size={18} className="text-[#08CB00] mb-1" />
            <p className="text-xl font-black text-white">{pct}%</p>
            <p className="text-[8px] text-white/30 font-black uppercase">of ${target}</p>
          </div>
        </div>

        <div className="w-full grid grid-cols-2 gap-2">
          <div className="bg-black/30 rounded-2xl p-3 text-center">
            <p className="text-base font-black text-white">{stats?.completed_today ?? 0}</p>
            <p className="text-[8px] font-black uppercase tracking-widest text-white/30 mt-0.5">Completed</p>
          </div>
          <div className="bg-black/30 rounded-2xl p-3 text-center">
            <p className="text-base font-black text-white">{stats?.active_jobs ?? 0}</p>
            <p className="text-[8px] font-black uppercase tracking-widest text-white/30 mt-0.5">In Progress</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-2">
        {quickActions.map(a => {
          const Icon = a.icon;
          return (
            <Link key={a.label} href={a.href} className={`flex flex-col items-center justify-center gap-2 py-4 rounded-[20px] text-[9px] font-black uppercase tracking-wider hover:opacity-80 transition-all ${a.color}`}>
              <Icon size={18} />
              {a.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}