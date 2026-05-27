"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Leaf, ChevronDown } from "lucide-react"

const navLinks = [
  { name: 'Home',        href: '/reguser/Home' },
  { name: 'Submit',      href: '/reguser/Submit' },
  { name: 'Tracking',    href: '/reguser/Tracking' },
  { name: 'Incentives',  href: '/reguser/Incentives' },
  { name: 'Marketplace', href: '/reguser/Marketplace' },
];

export default function ReguserHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="flex items-center justify-between px-6 py-3 max-w-screen-2xl mx-auto">

        {/* ── LOGO ── */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-9 h-9 bg-[#08CB00] rounded-xl flex items-center justify-center rotate-3 group-hover:rotate-12 transition-transform shadow-sm shadow-[#08CB00]/20">
            <Leaf size={18} className="text-black" fill="currentColor" />
          </div>
          <span className="text-xl font-black tracking-tighter text-black leading-none">
            green<span className="text-[#08CB00]">hoop</span>
          </span>
        </Link>

        {/* ── NAV PILL ── */}
        <nav className="flex items-center bg-gray-100 p-1 rounded-full gap-0.5">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-black shadow-sm'
                    : 'text-gray-500 hover:text-black hover:bg-white/60'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* ── RIGHT ACTIONS ── */}
        <div className="flex items-center gap-3 shrink-0">

          {/* Contributions pill */}
          <Link
            href="/reguser/contributions"
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
              pathname === '/reguser/contributions'
                ? 'bg-[#08CB00] text-black shadow-sm shadow-[#08CB00]/30'
                : 'bg-[#08CB00]/10 text-[#08CB00] hover:bg-[#08CB00] hover:text-black'
            }`}
          >
            Contributions
          </Link>

          {/* Divider */}
          <div className="h-6 w-px bg-gray-200" />

          {/* Profile */}
          <Link
            href="/reguser/profile-settings"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-200 ${
              pathname === '/reguser/profile-settings'
                ? 'border-[#08CB00]/40 bg-[#08CB00]/5'
                : 'border-gray-200 hover:border-[#08CB00]/30 hover:bg-gray-50'
            }`}
          >
            <img
              src="/img/headIcon.png"
              alt="User Profile"
              className="w-7 h-7 rounded-full border-2 border-[#08CB00] object-cover shrink-0"
            />
            <span className="text-xs font-semibold text-gray-800 hidden sm:block">Tadiee</span>
            <ChevronDown size={12} className="text-gray-400 hidden sm:block" />
          </Link>

        </div>
      </div>
    </header>
  );
}