"use client"
import React from 'react';
import {
  SlidersHorizontal, Tag, User, RotateCcw,
  BatteryFull, Scale, Cpu, Cable, Calculator, Zap, Clock, Disc,
  Plug, Wind, Flashlight, Refrigerator, MonitorCog, Gamepad2,
  HardDrive, Keyboard, LampDesk, Laptop, Mic,
  Monitor, CircuitBoard, Mouse, Box, Smartphone, Battery,
  Printer, Radio, Tv, Wifi, Sun, Speaker, RadioTower, WashingMachine,
  UtensilsCrossed
} from 'lucide-react';

const CATEGORIES = [
  { key: 'All',             label: 'All',            icon: SlidersHorizontal },
  { key: 'battery',         label: 'Battery',        icon: BatteryFull },
  { key: 'body-weight-scale',label: 'Scale',         icon: Scale },
  { key: 'cpu-component',   label: 'CPU',            icon: Cpu },
  { key: 'cable',           label: 'Cable',          icon: Cable },
  { key: 'calculator',      label: 'Calculator',     icon: Calculator },
  { key: 'charger',         label: 'Charger',        icon: Zap },
  { key: 'clock',           label: 'Clock',          icon: Clock },
  { key: 'dvd-player',      label: 'DVD Player',     icon: Disc },
  { key: 'electronic-socket',label: 'Socket',        icon: Plug },
  { key: 'fan',             label: 'Fan',            icon: Wind },
  { key: 'flashlight',      label: 'Flashlight',     icon: Flashlight },
  { key: 'fridge',          label: 'Fridge',         icon: Refrigerator },
  { key: 'gpu',             label: 'GPU',            icon: MonitorCog },
  { key: 'game-controller', label: 'Controller',     icon: Gamepad2 },
  { key: 'harddisk',        label: 'Hard Disk',      icon: HardDrive },
  { key: 'iron',            label: 'Iron',           icon: Wind },
  { key: 'keyboard',        label: 'Keyboard',       icon: Keyboard },
  { key: 'lamp',            label: 'Lamp',           icon: LampDesk },
  { key: 'laptop',          label: 'Laptop',         icon: Laptop },
  { key: 'microphone',      label: 'Microphone',     icon: Mic },
  { key: 'microwave',       label: 'Microwave',      icon: Zap },
  { key: 'monitor',         label: 'Monitor',        icon: Monitor },
  { key: 'motherboard',     label: 'Motherboard',    icon: CircuitBoard },
  { key: 'mouse',           label: 'Mouse',          icon: Mouse },
  { key: 'pc-case',         label: 'PC Case',        icon: Box },
  { key: 'phone',           label: 'Phone',          icon: Smartphone },
  { key: 'powerbank',       label: 'Powerbank',      icon: Battery },
  { key: 'printer',         label: 'Printer',        icon: Printer },
  { key: 'radio',           label: 'Radio',          icon: Radio },
  { key: 'remote',          label: 'Remote',         icon: Tv },
  { key: 'rice-cooker',     label: 'Rice Cooker',    icon: UtensilsCrossed },
  { key: 'router',          label: 'Router',         icon: Wifi },
  { key: 'solar-panel',     label: 'Solar Panel',    icon: Sun },
  { key: 'speaker',         label: 'Speaker',        icon: Speaker },
  { key: 'television',      label: 'Television',     icon: Tv },
  { key: 'walkie-talkie',   label: 'Walkie Talkie',  icon: RadioTower },
  { key: 'washing-machine', label: 'Washing Machine',icon: WashingMachine },
];
const SOURCES = [
  { key: 'all',         label: 'All Sources', icon: SlidersHorizontal },
  { key: 'user',        label: 'Direct User',  icon: User },
  { key: 'marketplace', label: 'Marketplace',  icon: Tag },
];

export default function FilterPanel({ filters, onChange, resultCount }) {
  const set = (key, val) => onChange({ ...filters, [key]: val });

  const reset = () => onChange({
    category: 'All', source: 'all',
    maxPrice: '', radiusKm: 10, minWeight: '', maxWeight: '',
  });

  return (
    <div className="bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-[32px] p-5 flex flex-col gap-5 shadow-2xl">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
          <SlidersHorizontal size={13} className="text-[#08CB00]" /> Filters
        </h3>
        <button onClick={reset} className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-white/20 hover:text-white/60 transition-colors">
          <RotateCcw size={10} /> Reset
        </button>
      </div>

      {/* Result count */}
      <div className="bg-[#08CB00]/10 border border-[#08CB00]/20 rounded-2xl px-4 py-2.5 flex items-center justify-between">
        <span className="text-[9px] font-black uppercase tracking-widest text-[#08CB00]">Results</span>
        <span className="text-lg font-black text-[#08CB00]">{resultCount}</span>
      </div>

      {/* Category */}
      <div className="flex flex-col gap-2">
        <p className="text-[8px] font-black uppercase tracking-widest text-white/20">Category</p>
        <div className="grid grid-cols-3 gap-1.5 max-h-[260px] overflow-y-auto scrollbar-none pr-0.5">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const active = filters.category === cat.key;
            return (
              <button key={cat.key} onClick={() => set('category', cat.key)}
                className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl border transition-all ${
                  active
                    ? 'bg-[#08CB00] border-[#08CB00] text-black'
                    : 'bg-white/5 border-white/10 text-white/40 hover:border-white/30 hover:text-white'
                }`}>
                <Icon size={14} />
                <span className="text-[7px] font-black uppercase tracking-wide leading-tight text-center">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Source */}
      <div className="flex flex-col gap-2">
        <p className="text-[8px] font-black uppercase tracking-widest text-white/20">Source</p>
        <div className="grid grid-cols-2 gap-2">
          {SOURCES.map(src => {
            const Icon = src.icon;
            const active = filters.source === src.key;
            return (
              <button key={src.key} onClick={() => set('source', src.key)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                  active
                    ? 'bg-[#08CB00] border-[#08CB00] text-black'
                    : 'bg-white/5 border-white/10 text-white/40 hover:border-white/30 hover:text-white'
                }`}>
                <Icon size={11} /> {src.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Max Price */}
      <div className="flex flex-col gap-2">
        <p className="text-[8px] font-black uppercase tracking-widest text-white/20">Max Price ($)</p>
        <input
          type="number" min="0" placeholder="Any"
          value={filters.maxPrice}
          onChange={e => set('maxPrice', e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-black text-white placeholder-white/20 focus:outline-none focus:border-[#08CB00]/50 transition-colors w-full"
        />
      </div>

      {/* Radius */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-[8px] font-black uppercase tracking-widest text-white/20">Radius</p>
          <span className="text-[9px] font-black text-[#08CB00]">{filters.radiusKm} km</span>
        </div>
        <input
          type="range" min="1" max="50" step="1"
          value={filters.radiusKm}
          onChange={e => set('radiusKm', Number(e.target.value))}
          className="w-full accent-[#08CB00]"
        />
        <div className="flex justify-between text-[8px] text-white/20 font-black">
          <span>1 km</span><span>50 km</span>
        </div>
      </div>

      {/* Weight range */}
      <div className="flex flex-col gap-2">
        <p className="text-[8px] font-black uppercase tracking-widest text-white/20">Weight (kg)</p>
        <div className="flex gap-2">
          <input type="number" min="0" placeholder="Min"
            value={filters.minWeight}
            onChange={e => set('minWeight', e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm font-black text-white placeholder-white/20 focus:outline-none focus:border-[#08CB00]/50 w-1/2"
          />
          <input type="number" min="0" placeholder="Max"
            value={filters.maxWeight}
            onChange={e => set('maxWeight', e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm font-black text-white placeholder-white/20 focus:outline-none focus:border-[#08CB00]/50 w-1/2"
          />
        </div>
      </div>
    </div>
  );
}
