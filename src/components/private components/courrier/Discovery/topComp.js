"use client"
import React, { useState } from 'react';
import { MapPin, Filter, Zap, CalendarClock, Layers } from 'lucide-react';

const FILTERS = [
  { key: 'All', label: 'All Jobs', icon: Layers },
  { key: 'Urgent', label: 'Urgent', icon: Zap },
  { key: 'Scheduled', label: 'Scheduled', icon: CalendarClock },
];

export default function TopComponent({ activeFilter, onFilterChange }) {
  const [localFilter, setLocalFilter] = useState('All');
  const current = activeFilter ?? localFilter;
  const setFilter = (f) => { setLocalFilter(f); onFilterChange?.(f); };

  return (
    <div className="relative flex flex-col xl:flex-row items-center justify-between w-full mb-6 mt-2 gap-3">

      {/* Left: Zone — desktop only */}
      <div className="hidden xl:flex flex-1 items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-white/5 flex items-center justify-center relative shadow-lg">
          <MapPin size={16} className="text-[#08CB00]" />
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#08CB00] rounded-full border-2 border-[#121212] animate-pulse"></span>
        </div>
        <div>
          <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Operating Zone</p>
          <p className="text-xs font-black text-white uppercase tracking-widest mt-0.5">Harare Central</p>
        </div>
      </div>

      {/* Center: Title */}
      <div className="flex-1 flex flex-col items-center text-center">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tighter">Job <span className="text-[#08CB00]">Discovery</span></h1>
        <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">E-Waste Collection Network</p>
      </div>

      {/* Right: Filters — scrollable on mobile */}
      <div className="flex-1 flex xl:justify-end items-center w-full xl:w-auto">
        <div className="flex items-center bg-[#1A1A1A] border border-white/5 p-1 rounded-full shadow-lg gap-1 overflow-x-auto scrollbar-none w-full xl:w-auto">
          <div className="flex items-center gap-1.5 pl-3 pr-3 border-r border-white/10 shrink-0">
            <Filter size={12} className="text-[#08CB00]" />
            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest hidden sm:block">Filter</span>
          </div>
          <div className="flex items-center gap-1 pl-1">
            {FILTERS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap shrink-0 ${
                  current === key
                    ? key === 'Urgent'
                      ? 'bg-orange-500 text-black shadow-[0_0_15px_rgba(249,115,22,0.4)]'
                      : key === 'Scheduled'
                      ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                      : 'bg-[#08CB00] text-black shadow-[0_0_15px_rgba(8,203,0,0.4)]'
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={10} />{label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}