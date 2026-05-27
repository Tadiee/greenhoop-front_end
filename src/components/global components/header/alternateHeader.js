"use client"
import React, { useState, useEffect } from 'react';
import { Settings, User, Leaf, Menu, X } from 'lucide-react';
import Image from 'next/image';
import "@/app/globals.css"
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AlternateHeader() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    // Initialize the pathname hook
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        'Home', 'Submit', 'Tracking', 'Incentives', 'Marketplace', 'Contributions'
    ];


    return(
            <header className={`fixed top-0 w-full z-50 h-[7%] transition-all duration-500 px-6 md:px-12 py-4 bg-transparent bg-black/10 backdrop-blur-xs border-b border-white/10 py-3`}
            >
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group cursor-pointer">
                        <div className="w-10 h-10 bg-[#08CB00] rounded-xl flex items-center justify-center rotate-3 group-hover:rotate-12 transition-transform">
                        <Leaf className="text-black" size={24} fill="currentColor" />
                            {/* <img src="/img/noBgLogo.png" alt="Logo" /> */}
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-white">
                        green<span className="text-[#08CB00]">hoop</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-8">
                            {navLinks.map((link) => {
                                const href = `/reguser/${link === 'Contributions' ? 'contributions' : link}`;
                                const isActive = pathname === href;

                                return (
                                    <Link
                                        key={link} 
                                        href={href}
                                        className={`text-sm font-semibold transition-all duration-300 ${
                                            // Special styling for the "Contributions" button
                                            link === 'Contributions'
                                                ? isActive 
                                                    ? "bg-[#08CB00] text-black px-3 py-1.5 rounded-lg shadow-[0_0_10px_rgba(8,203,0,0.3)]" // Active State
                                                    : "bg-white/10 text-white px-3 py-1.5 rounded-lg hover:bg-white/20 hover:text-[#08CB00]" // Inactive State
                                            
                                            // Styling for standard text links
                                                : isActive
                                                    ? "text-[#08CB00]" // Active State
                                                    : "text-white/70 hover:text-[#08CB00]" // Inactive State
                                        }`}
                                    >
                                        {link}
                                    </Link>
                                );
                            })}
                        </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-white/50 hover:text-[#08CB00] transition-colors hidden md:block">
                        <Settings size={20} />
                        </button>
                        <Link href="/reguser/profile-settings" className="w-10 h-10 rounded-full border-2 border-[#08CB00] flex items-center justify-center text-white font-bold cursor-pointer hover:bg-[#08CB00] hover:text-black transition-all">
                        T
                        </Link>
                        {/* Mobile Toggle */}
                        <button className="lg:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </header>
        
    )
}