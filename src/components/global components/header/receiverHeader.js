"use client"
import { 
  AlertTriangle, Truck, PackageCheck, Scale, History,
  ChevronDown, MoreHorizontal, CheckCircle2, Clock,
  Building, User, Bell, FormInput, ArrowRightLeft, Leaf
} from 'lucide-react';
import {Home, MessageSquare, ClipboardList } from 'lucide-react';
import { useRole } from '@/app/RoleConext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ReceiverHeader ({subHeader}) {
    // Initialize the pathname hook
    const pathname = usePathname();

    // Define your navigation items in an array
    const navItems = [
      { name: 'Home', href: '/receiver/Home', icon: Home },
      { name: 'Material List', href: '/receiver/MaterialList', icon: ClipboardList },
      { name: 'Input / Output', href: '/receiver/InputOutput', icon: ArrowRightLeft },
    ];

    return (
        <header className="relative z-50 flex flex-col lg:flex-row items-center justify-between w-full mb-8 sticky top-0 backdrop-blur-xs bg-transparent gap-4">
        
        {/* Left: GreenHoop Branding & Hub Title */}
        <div className="flex items-center gap-3 w-full lg:w-1/3 ">
          <Link href={"/"} className="bg-[#08CB00] rounded-full p-1 shadow-[0_0_15px_rgba(8,203,0,0.3)]">
            {/* <img src="/img/NoBgLogo.png" alt="GreenHoop Logo" className="h-8 w-8 brightness-0 " /> */}
            <Leaf size={24} className="text-black fill-black" />
          </Link>
          <div className="flex flex-col justify-center">
             <span className="text-2xl font-black tracking-tighter text-white leading-none">
               green<span className="text-[#08CB00]">hoop</span>
             </span>
             <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1">{subHeader} Hub</p>
          </div>
        </div>

        {/* Center: Main Navigation Pill */}
        <nav className="flex-1 flex justify-center w-full lg:w-auto z-10">
              <div className="flex items-center bg-white/5 border border-white/10 p-1.5 rounded-full shadow-lg backdrop-blur-md">
                
                {navItems.map((item) => {
                  // Check if the current URL matches the item's href
                  const isActive = pathname === item.href;
                  
                  // Assign the icon component dynamically
                  const Icon = item.icon;

                  return (
                    <Link 
                      key={item.name} 
                      href={item.href} 
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                        isActive 
                          ? 'bg-[#08CB00] text-black shadow-[0_0_15px_rgba(8,203,0,0.3)]' 
                          : 'text-white/40 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon size={14} /> {item.name}
                    </Link>
                  );
                })}
                
              </div>
            </nav>

        {/* Right: User Profile & Alerts */}
        <div className="flex items-center justify-end gap-4 w-full lg:w-1/3">
           <button className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all relative">
             <Bell size={18} />
             <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-[#0A0A0A] animate-pulse"></span>
           </button>
           
           <Link href="/receiver/profile-settings" className="flex items-center gap-3 pl-4 border-l border-white/10 group">
              <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center group-hover:border-[#08CB00]/40 transition-colors">
                 <User size={18} className="text-white/50 group-hover:text-[#08CB00] transition-colors" />
              </div>
              <div className="hidden sm:block text-right">
                 <p className="text-sm font-black text-white group-hover:text-[#08CB00] transition-colors">John D.</p>
                 <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Site Manager</p>
              </div>
              <ChevronDown size={14} className="text-white/30 group-hover:text-white transition-colors" />
           </Link>
        </div>
      </header>
        
    );
}