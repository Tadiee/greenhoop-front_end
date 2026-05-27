'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Send, MapPin, Coins, ShoppingBag, BarChart2, ChevronDown, HelpCircle, MessageCircle, Zap, Eye, Leaf } from 'lucide-react';

const ECO_TIPS = [
  { stat: '100×', label: 'more gold in a tonne of smartphones than gold ore.', tag: 'Urban Mining' },
  { stat: '20%',  label: 'of global e-waste is formally recycled — help change that.', tag: 'Global Impact' },
  { stat: '95%',  label: 'of energy saved by recycling aluminium vs. mining new.', tag: 'Energy Saving' },
  { stat: '80%',  label: 'of a computer is recyclable. Every part counts.', tag: 'Sustainability' },
];

const sections = [
  { id: 'submit',        title: 'Submit',        Icon: Send,       href: '/reguser/Submit',        desc: 'Log and dispose of your electronic waste quickly and securely.' },
  { id: 'tracking',     title: 'Tracking',      Icon: BarChart2,  href: '/reguser/Tracking',      desc: 'Follow your submission in real time from pickup to recycling.' },
  { id: 'incentives',   title: 'Incentives',    Icon: Coins,      href: '/reguser/Incentives',    desc: 'Earn rewards and cash payouts for every device you recycle.' },
  { id: 'marketplace',  title: 'Marketplace',   Icon: ShoppingBag,href: '/reguser/Marketplace',   desc: 'Buy and sell refurbished electronics in a trusted community.' },
  { id: 'contributions',title: 'Contributions', Icon: BarChart2,  href: '/reguser/contributions', desc: 'Your personal impact dashboard — CO₂ saved, devices recycled.' },
];

function EcoTipCard() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % ECO_TIPS.length), 8000);
    return () => clearInterval(id);
  }, []);
  const tip = ECO_TIPS[idx];
  return (
    <div className="flex flex-col gap-2 p-3 rounded-xl bg-gray-900 border border-gray-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Leaf size={11} className="text-[#08CB00]" strokeWidth={2.5} />
          <span className="text-[8px] font-black uppercase tracking-widest text-[#08CB00]">Eco Fact</span>
        </div>
        <span className="text-[8px] text-gray-600 font-bold uppercase tracking-wider">{tip.tag}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-black text-white leading-none">{tip.stat}</span>
      </div>
      <p className="text-[10px] text-gray-400 leading-snug">{tip.label}</p>
      <div className="flex gap-1 mt-1">
        {ECO_TIPS.map((_, i) => (
          <div key={i} className={`h-0.5 rounded-full flex-1 transition-all duration-300 ${i === idx ? 'bg-[#08CB00]' : 'bg-gray-700'}`} />
        ))}
      </div>
    </div>
  );
}

export default function RightContainer() {
  const [activeSection, setActiveSection] = useState(null);

  return (
    <div className="flex flex-col h-full w-full max-w-[280px] bg-white border-l border-gray-100 p-4 gap-3 font-sans overflow-y-auto scrollbar-hidden">

      {/* Header — mirrors reguserHeader branding */}
      <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
        <div className="p-2 bg-[#08CB00] rounded-xl shadow-sm">
          <HelpCircle size={14} className="text-white" strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-[0.25em] text-[#08CB00] font-black leading-none">Resources</p>
          <h2 className="text-sm font-black text-gray-900 tracking-tight">Help Center</h2>
        </div>
      </div>

      {/* Accordion */}
      <div className="flex flex-col gap-2">
        {sections.map((section) => {
          const isActive = activeSection === section.id;
          const { Icon } = section;
          return (
            <div
              key={section.id}
              className={`group relative overflow-hidden rounded-xl border transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'bg-[#08CB00]/5 border-[#08CB00]/25 shadow-sm'
                  : 'bg-white border-gray-100 hover:border-[#08CB00]/20 hover:bg-gray-50'
              }`}
              onClick={() => setActiveSection(isActive ? null : section.id)}
            >
              {/* Left accent bar */}
              <div className={`absolute left-0 top-0 bottom-0 w-0.5 bg-[#08CB00] transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`} />

              <div className="pl-3 pr-3 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg transition-all duration-300 ${
                      isActive ? 'bg-[#08CB00] text-white' : 'bg-gray-100 text-gray-400 group-hover:text-[#08CB00] group-hover:bg-[#08CB00]/10'
                    }`}>
                      <Icon size={13} strokeWidth={2.5} />
                    </div>
                    <span className={`text-xs font-bold tracking-tight transition-colors ${
                      isActive ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-800'
                    }`}>
                      {section.title}
                    </span>
                  </div>
                  <ChevronDown size={13} className={`text-gray-300 transition-transform duration-300 ${isActive ? 'rotate-180 text-[#08CB00]' : ''}`} />
                </div>

                <div className={`grid transition-all duration-300 ease-in-out ${isActive ? 'grid-rows-[1fr] opacity-100 mt-2.5' : 'grid-rows-[0fr] opacity-0'}`}>
                  <div className="overflow-hidden">
                    <p className="text-[10px] text-gray-500 leading-relaxed border-t border-gray-100 pt-2.5">
                      {section.desc}
                    </p>
                    <Link
                      href={section.href}
                      className="inline-block mt-2 text-[10px] font-bold text-[#08CB00] hover:underline uppercase tracking-wider"
                      onClick={e => e.stopPropagation()}
                    >
                      Go to {section.title} →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col gap-2">
        <p className="text-[9px] uppercase tracking-[0.25em] text-gray-400 font-black px-1">Quick Actions</p>
        <Link href="/reguser/Submit"
          className="flex items-center gap-3 p-3 rounded-xl bg-[#08CB00] hover:bg-[#06b300] transition-colors group">
          <div className="p-1.5 bg-white/20 rounded-lg">
            <Send size={12} className="text-white" strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black text-white leading-tight">Submit E-Waste</p>
            <p className="text-[9px] text-white/70 leading-none mt-0.5">Log a new device for recycling</p>
          </div>
          <Zap size={12} className="text-white/50 ml-auto shrink-0" />
        </Link>
        <Link href="/reguser/Tracking"
          className="flex items-center gap-3 p-3 rounded-xl bg-gray-900 hover:bg-black transition-colors group">
          <div className="p-1.5 bg-white/10 rounded-lg">
            <Eye size={12} className="text-white" strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black text-white leading-tight">Track Submission</p>
            <p className="text-[9px] text-white/40 leading-none mt-0.5">View your live pickup status</p>
          </div>
          <BarChart2 size={12} className="text-white/30 ml-auto shrink-0" />
        </Link>
      </div>

      {/* Eco Tip */}
      <EcoTipCard />

      {/* Footer CTA */}
      <div className="flex items-center gap-3 p-3 bg-[#08CB00]/5 rounded-xl border border-[#08CB00]/15">
        <div className="p-2 bg-[#08CB00] rounded-lg shrink-0">
          <MessageCircle size={13} className="text-white" strokeWidth={2.5} />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-bold text-gray-700 leading-tight">Need more help?</p>
          <button className="text-[10px] text-[#08CB00] font-black hover:underline">Contact Support →</button>
        </div>
      </div>
    </div>
  );
}