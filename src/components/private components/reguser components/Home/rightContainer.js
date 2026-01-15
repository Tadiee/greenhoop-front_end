'use client'

/**
 * Help Center Sidebar Component
 * Features a modern glassmorphism design with a smooth CSS Grid-based accordion.
 */

import React, { useState } from 'react';
import { MdSend, MdOutlineMap, MdKeyboardArrowDown } from "react-icons/md";
import { LuHandCoins } from "react-icons/lu";
import { FiShoppingBag } from "react-icons/fi";
import { GrInfo } from "react-icons/gr";

export default function RightContainer() {
  // State to manage the currently expanded accordion item
  const [activeSection, setActiveSection] = useState(null);

  // Configuration for help sections - Centralized for easy updates
  const sections = [
    { id: 'submit', title: 'Submit', icon: <MdSend />, desc: 'Facilitates the logging and disposal of electronic waste.', accent: '#08CB00' },
    { id: 'proximity', title: 'Proximity', icon: <MdOutlineMap />, desc: 'A location-based feature to find physical drop-off points.', accent: '#08CB00' },
    { id: 'incentives', title: 'Incentives', icon: <LuHandCoins />, desc: 'The financial/gamification hub for managing earnings.', accent: '#08CB00' },
    { id: 'marketplace', title: 'Marketplace', icon: <FiShoppingBag />, desc: 'P2P platform for refurbished electronics.', accent: '#08CB00' },
    { id: 'contributions', title: 'Contributions', icon: <GrInfo />, desc: 'Your personal "Impact Dashboard" for environmental value.', accent: '#08CB00' },
  ];

  return (
    /* Main Sidebar: Uses backdrop-blur for glassmorphism and border-l for separation */
    <div className="flex flex-col h-full w-full max-w-[280px] bg-white/40 backdrop-blur-sm p-4 gap-4 font-sans border-l border-gray-100/50">
      
      {/* Header: Uses high-tracking uppercase labels for a premium SaaS aesthetic */}
      <div className="mb-2 px-1">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#08CB00] font-black opacity-80">
          Resources
        </span>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
          Help Center
        </h2>
        <p className="text-[10px] text-gray-400 mt-1 leading-tight">
          Quick guide to your dashboard navigation and features.
        </p>
      </div>

      {/* Accordion List Container */}
      <div className="flex flex-col gap-3">
        {sections.map((section) => {
          const isActive = activeSection === section.id;
          
          return (
            /* Individual Card: Animates border, scale, and shadow on active state */
            <div
              key={section.id}
              onClick={() => setActiveSection(isActive ? null : section.id)}
              className={`group relative overflow-hidden transition-all duration-500 rounded-2xl border ${
                isActive 
                ? 'bg-white border-[#08CB00]/30 shadow-[0_10px_30px_-10px_rgba(8,203,0,0.2)] scale-[1.02]' 
                : 'bg-white/50 border-gray-100 hover:border-gray-200 hover:bg-white'
              }`}
            >
              {/* Active Indicator: A vertical line that slides in from the top using translate-y */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 bg-[#08CB00] transition-transform duration-500 ${isActive ? 'translate-y-0' : '-translate-y-full'}`} />

              <div className="p-4">
                {/* Accordion Header: Handles the icon, title, and rotation of the arrow */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Icon Wrapper: Switches to brand-green background with shadow when active */}
                    <div className={`p-2 rounded-xl transition-all duration-300 ${
                      isActive ? 'bg-[#08CB00] text-white shadow-lg shadow-[#08CB00]/30' : 'bg-gray-50 text-gray-400 group-hover:text-[#08CB00]'
                    }`}>
                      {React.cloneElement(section.icon, { size: 18 })}
                    </div>
                    <span className={`text-sm font-bold tracking-tight transition-colors ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                      {section.title}
                    </span>
                  </div>
                  {/* Arrow Icon: Rotates 180 degrees based on isActive state */}
                  <MdKeyboardArrowDown className={`text-gray-300 transition-transform duration-500 ${isActive ? 'rotate-180 text-[#08CB00]' : ''}`} />
                </div>

                {/* Collapsible Content: Employs the CSS Grid height transition trick for smooth expansion */}
                <div className={`grid transition-all duration-500 ease-in-out ${isActive ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0'}`}>
                  <div className="overflow-hidden">
                    <p className="text-[11px] text-gray-500 leading-relaxed border-t border-gray-50 pt-3">
                      {section.desc}
                    </p>
                    <button className="mt-3 text-[10px] font-bold text-[#08CB00] uppercase tracking-wider hover:underline">
                      Learn More →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Persistent Footer: Uses a light tint of the brand color (opacity 5%) for a soft call-to-action */}
      <div className="mt-auto p-4 bg-[#08CB00]/5 rounded-2xl border border-[#08CB00]/10 text-center">
        <p className="text-[10px] text-gray-500 font-medium">Need more help?</p>
        <button className="text-[11px] font-bold text-[#08CB00] hover:underline">Contact Support</button>
      </div>
    </div>
  );
}