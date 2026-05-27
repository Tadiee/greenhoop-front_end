import { Coins, BarChart2, Headphones, Mail, Phone, Info } from "lucide-react";

const features = [
  { label: 'Rewards',  Icon: Coins,       href: '/reguser/Incentives' },
  { label: 'Insights', Icon: BarChart2,   href: '/reguser/contributions' },
  { label: 'Support',  Icon: Headphones,  href: '/reguser/Home' },
];

export default function Footer() {
  return (
    <footer className="w-full h-full border-t border-gray-200 bg-gray-50 px-6 py-3">
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-6">

        {/* COPYRIGHT */}
        <p className="text-[10px] text-gray-400 font-medium shrink-0">
          &copy; 2025 GreenHoop. All rights reserved.
        </p>

        <div className="h-5 w-px bg-gray-200 shrink-0" />

        {/* FEATURE PILLS */}
        <div className="flex items-center gap-2">
          {features.map(({ label, Icon }) => (
            <span key={label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-bold">
              <Icon size={11} strokeWidth={2.5} />
              {label}
            </span>
          ))}
        </div>

        <div className="h-5 w-px bg-gray-200 shrink-0" />

        {/* CONTACT */}
        <div className="flex items-center gap-5 shrink-0">
          <a href="mailto:support@greenhoop.io"
            className="flex items-center gap-1.5 text-[10px] text-gray-400 hover:text-[#08CB00] transition-colors font-medium">
            <Mail size={11} strokeWidth={2} />
            support@greenhoop.io
          </a>
          <a href="tel:+27111234567"
            className="flex items-center gap-1.5 text-[10px] text-gray-400 hover:text-[#08CB00] transition-colors font-medium">
            <Phone size={11} strokeWidth={2} />
            +27 11 123 4567
          </a>
        </div>

        <div className="h-5 w-px bg-gray-200 shrink-0" />

        {/* MISSION TAG */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#08CB00]/10 border border-[#08CB00]/20 shrink-0">
          <Info size={10} className="text-[#08CB00]" strokeWidth={2.5} />
          <span className="text-[9px] font-black text-[#08CB00] uppercase tracking-wide">Closing the Loop</span>
        </div>

      </div>
    </footer>
  );
}