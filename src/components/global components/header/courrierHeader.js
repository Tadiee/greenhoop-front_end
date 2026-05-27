"use client";
import React from 'react';
import {
  LayoutDashboard,
  Bell,
  ChevronDown,
  Home,
  PackageCheck,
  Settings2,
  DollarSign,
  Globe,
  Leaf

} from 'lucide-react';
import { useRole } from '@/app/RoleConext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function CourrierHeader() {
// Initialize the pathname hook
  const pathname = usePathname();

  // Define your navigation items in an array
  const navItems = [
    { name: 'Home', href: '/courrier/Home', icon: Home },
    { name: 'Dashboard', href: '/courrier/Dashboard', icon: LayoutDashboard },
    { name: 'Deliveries', href: '/courrier/Deliveries', icon: PackageCheck },
    { name: 'Vehicle Management', href: '/courrier/VehicleManagement', icon: Settings2 },
    { name: 'Discovery', href: '/courrier/Discovery', icon: Globe },
  ];

    return (
        <header className="flex items-center justify-between p-6 border-b border-gray-100 bg-white relative z-10 rounded-t-[40px] top-0 left-0 right-0 sticky">
            <Link href={"/"}className="flex items-center space-x-4">
                <div className="bg-[#08CB00] rounded-full p-1">
                {/* <img src="/img/NoBgLogo.png" alt="Logo" className="h-10 w-10" /> */}
                <Leaf size={24} className="text-black fill-black" />
                </div>
                <span className="text-2xl font-black tracking-tighter text-black">
                green<span className="text-[#08CB00]">hoop</span>
                </span>
            </Link>
            
            <nav className="flex space-x-1 bg-gray-100 p-1 rounded-full">
                {navItems.map((item) => {
                    // Check if the current URL matches the item's href
                    const isActive = pathname === item.href;
                    
                    // Assign the icon component dynamically
                    const Icon = item.icon;

                    return (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition ${
                        isActive 
                            ? 'bg-black text-white' 
                            : 'text-gray-500 hover:text-black hover:bg-gray-200/50'
                        }`}
                    >
                        <Icon className="h-4 w-4" />
                        <span>{item.name}</span>
                    </Link>
                    );
                })}
                </nav>

            <div className="flex items-center space-x-4">
                <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition relative text-black">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-[#08CB00] rounded-full"></span>
                </button>
                <Link href="/courrier/profile-settings" className="flex items-center space-x-3 bg-black text-white pl-2 pr-4 py-1 rounded-full hover:bg-gray-900 transition-colors">
                <img
                    src="https://i.pravatar.cc/150?img=33"
                    alt="User Profile"
                    className="h-8 w-8 rounded-full border border-[#08CB00]"
                />
                <div className="text-sm">
                    <p className="font-semibold">Alex Ryder</p>
                    <p className="text-gray-400 text-xs">Logistics Manager</p>
                </div>
                <ChevronDown className="h-4 w-4 text-white" />
                </Link>
            </div>
        </header>
    );
}