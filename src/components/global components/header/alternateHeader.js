"use client"
import React, { useState, useEffect } from 'react';
import { Settings, User, Leaf, Menu, X } from 'lucide-react';
import Image from 'next/image';
import "@/app/globals.css"

export default function AlternateHeader() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        'Home', 'Submit', 'Proximity', 'Incentives', 'Marketplace', 'Contributions'
    ];
    return(
            <header className={`fixed top-0 w-full z-50 h-[7%] transition-all duration-500 px-6 md:px-12 py-4 bg-transparent bg-black/10 backdrop-blur-xs border-b border-white/10 py-3`}
            >
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-2 group cursor-pointer">
                        <div className="w-10 h-10 bg-[#08CB00] rounded-xl flex items-center justify-center rotate-3 group-hover:rotate-12 transition-transform">
                        {/* <Leaf className="text-black" size={24} fill="currentColor" /> */}
                            <img src="/img/noBgLogo.png" alt="Logo" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-white">
                        green<span className="text-[#08CB00]">hoop</span>
                        </span>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => (
                        <a 
                            key={link} 
                            href={`#${link.toLowerCase()}`}
                            className={`text-sm font-semibold text-white/70 hover:text-[#08CB00] transition-colors ${link === 'Contributions'? "bg-white/10 text-black p-1 rounded-lg": ""}`}
                        >
                            {link}
                        </a>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-white/50 hover:text-[#08CB00] transition-colors hidden md:block">
                        <Settings size={20} />
                        </button>
                        <div className="w-10 h-10 rounded-full border-2 border-[#08CB00] flex items-center justify-center text-white font-bold cursor-pointer hover:bg-[#08CB00] hover:text-black transition-all">
                        T
                        </div>
                        {/* Mobile Toggle */}
                        <button className="lg:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </header>
        
    )
}