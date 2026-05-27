"use client"
import React, { useState } from 'react';
import { 
  Home, 
  MapPin, 
  Truck, 
  Navigation, 
  Wallet, 
  FileBarChart, 
  Search, 
  Bell, 
  User, 
  Zap,
  Leaf
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const RecyclerHeader = () => {
  const [activeItem, setActiveItem] = useState('Proximity');

  // Initialize the pathname hook
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', icon: Home },
    { name: 'Proximity', icon: MapPin },
    { name: 'DropOffs', icon: Truck },
    { name: 'eTrack', icon: Navigation },
  ];


  return (
    <header className="fixed top-6 left-0 w-full z-[10] flex justify-center px-4">
      {/* WIDTH 1/2: Set to w-full lg:w-1/2 for responsiveness 
         GLASSMORPHISM: backdrop-blur-xl bg-black/40 border-white/10
      */}
      <nav className="w-full lg:w-2/3 bg-black/40 backdrop-blur-sm
       border border-white/10 rounded-[32px] px-6 py-3 flex items-center justify-between shadow-2xl">
        
        {/* LOGO SECTION */}
        <Link href={"/"} className="flex items-center gap-2 group cursor-pointer">
          {/* <div className="w-10 h-10 bg-[#08CB00] rounded-lg flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform">
            <Image src="/img/noBgLogo.png" alt="GreenHoop Logo" width={50} height={50} className="object-cover" />
          </div> */}
          <div className="bg-[#08CB00] p-1.5 rounded-full shadow-[0_0_15px_rgba(8,203,0,0.4)]">
             <Leaf size={20} className="text-black fill-black" />
          </div>
          <span className="hidden md:block text-sm font-black text-white uppercase tracking-tighter">
            green<span className="text-[#08CB00]">hoop</span>
          </span>
        </Link>

        {/* NAVIGATION LINKS */}
        <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                
                // Define the exact URL path for this item
                const href = `/recycler/${item.name}`;
                
                // Check if the current URL matches the item's href
                const isActive = pathname === href;

                return (
                  <Link
                    key={item.name}
                    href={href}
                    className={`relative px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                      isActive ? 'text-[#08CB00]' : 'text-white/40 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon size={14} className={isActive ? 'text-[#08CB00]' : 'text-white/40'} />
                    {item.name}
                    
                    {/* Glowing active dot indicator */}
                    {isActive && (
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#08CB00] rounded-full shadow-[0_0_8px_#08CB00]"></div>
                    )}
                  </Link>
                );
              })}
            </div>

        {/* SLICK ACTIONS: SEARCH & USER */}
        <div className="flex items-center gap-4">
          <button className="p-2 text-white/20 hover:text-[#08CB00] transition-colors">
            <Search size={18} />
          </button>
          
          <div className="h-8 w-[1px] bg-white/10 hidden sm:block"></div>
          
          <div className="flex items-center gap-3">
            {/* Live Status Indicator */}
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[8px] font-black uppercase tracking-tighter text-white/30 leading-none">Status</span>
              <span className="text-[10px] font-bold text-[#08CB00] leading-none flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-[#08CB00] rounded-full animate-pulse"></div> ONLINE
              </span>
            </div>
            
            <Link href="/recycler/profile-settings" className="relative w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#08CB00] hover:bg-[#08CB00] hover:text-black transition-all group">
              <p>TA</p>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[8px] font-black text-white flex items-center justify-center border-2 border-black">
                3
              </div>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default RecyclerHeader;