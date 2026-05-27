"use client"
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ClipboardList, Bell, Leaf, DollarSign,
  X, Loader2, CheckCircle2, AlertCircle, Info, ShoppingCart
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const API = 'http://127.0.0.1:8000';

const TYPE_CFG = {
  purchase: { cls: 'bg-[#08CB00]/10 border-[#08CB00]/20', dot: 'bg-[#08CB00]',  label: 'Purchase',  Icon: ShoppingCart },
  success:  { cls: 'bg-[#08CB00]/10 border-[#08CB00]/20', dot: 'bg-[#08CB00]',  label: 'Completed', Icon: CheckCircle2 },
  warning:  { cls: 'bg-red-500/10 border-red-500/20',     dot: 'bg-red-500',    label: 'Alert',     Icon: AlertCircle },
  info:     { cls: 'bg-blue-500/10 border-blue-500/20',   dot: 'bg-blue-400',   label: 'Update',    Icon: Info },
};


export default function TechnicianHeader () {
      const [isOnline, setIsOnline] = useState(true);
      const pathname = usePathname();

      const [showNotifs, setShowNotifs]     = useState(false);
      const [notifications, setNotifications] = useState([]);
      const [notifLoading, setNotifLoading] = useState(false);
      const dropdownRef = useRef(null);

      const fetchNotifications = useCallback(async () => {
        setNotifLoading(true);
        try {
          const res = await fetch(`${API}/technician/notifications/recent-activity?limit=15`, { credentials: 'include' });
          if (res.ok) {
            const data = await res.json();
            setNotifications(data.activities || []);
          }
        } catch { /* silent */ } finally { setNotifLoading(false); }
      }, []);

      useEffect(() => {
        fetchNotifications();
        const id = setInterval(fetchNotifications, 15000);
        return () => clearInterval(id);
      }, [fetchNotifications]);

      // Close dropdown on outside click
      useEffect(() => {
        const handler = (e) => {
          if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setShowNotifs(false);
          }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
      }, []);

      const unread = notifications.filter(n => !n.read).length;

    return (
        <>
        <header className="fixed left-0 right-0 h-16 top-5 z-50 flex bg-white/[0.03] border border-white/10 flex-col lg:flex-row items-center justify-between backdrop-blur-3xl p-2 md:p-3 px-6 md:px-10 rounded-full lg:rounded-[40px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] gap-4 transition-all duration-500">
        
            {/* --- SECTION 1: IDENTITY & STATUS --- */}
            <div className="flex items-center gap-6 shrink-0">
                <div className="flex items-center gap-3 group cursor-pointer">
                <Link href="/" className="w-10 h-10 bg-gradient-to-br from-[#08CB00] to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-[#08CB00]/20 group-hover:rotate-12 transition-transform">
                   {/* <img src={"/img/NoBgLogo.png"} alt='logo' className='w-ful h-full' /> */}
                   <Leaf size={24} className="text-black fill-black" />
                </Link>
                <div className="hidden sm:block">
                    <h1 className="text-xs font-black text-white/40 uppercase tracking-[0.3em] italic leading-none">green<span className="text-[#08CB00]">hoop</span></h1>
                    <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-1">Tech: T. Adebayo</p>
                </div>
                </div>

                <div className="h-6 w-[1px] bg-white/10 hidden md:block"></div>

                {/* PRO STATUS TOGGLE */}
                <button 
                onClick={() => setIsOnline(!isOnline)}
                className="flex items-center gap-3 bg-black/40 border border-white/5 px-4 py-2 rounded-full hover:bg-white/5 transition-all group"
                >
                <div className="relative">
                    <div className={`w-2 h-2 rounded-full transition-all duration-500 ${isOnline ? 'bg-[#08CB00] shadow-[0_0_10px_#08CB00]' : 'bg-red-500 shadow-[0_0_10px_red]'}`}></div>
                    {isOnline && <div className="absolute inset-0 bg-[#08CB00] rounded-full animate-ping opacity-20"></div>}
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-white">
                    {isOnline ? 'System Online' : 'Offline'}
                </span>
                </button>
            </div>

            {/* --- SECTION 2: CORE NAVIGATION --- */}
            <nav className="hidden xl:flex items-center bg-black/20 rounded-full p-1 border border-white/5">
                {['Home', 'Service', 'Marketplace'].map((link, i) => {
                    const href = `/technician/${link}`; 
        
                    // Check if the current URL matches this link's href
                    const isActive = pathname === href;
                return (
                    <Link
                        key={link} 
                        href={href}
                        className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                        isActive 
                            ? 'bg-[#08CB00] text-black shadow-[0_0_15px_rgba(8,203,0,0.4)]' 
                            : 'text-white/40 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        {link}
                    </Link>
        )})}
            </nav>

            {/* --- SECTION 3: PERFORMANCE TELEMETRY --- */}
            <div className="flex items-center gap-6 md:gap-10 ml-auto md:ml-0">
                <div className="flex gap-8 md:gap-10">
                <div className="flex flex-col items-end">
                    <p className="text-[8px] font-black uppercase text-white/20 tracking-widest mb-1">Queue</p>
                    <div className="flex items-center gap-2">
                    <ClipboardList size={12} className="text-white/40" />
                    <p className="text-sm text-white/50 italic">03</p>
                    </div>
                </div>
                </div>

                <div className="h-6 w-[1px] bg-white/10"></div>

                {/* ACTIONS: NOTIFICATIONS & PROFILE */}
                <div className="flex items-center gap-4">

                {/* Bell + Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setShowNotifs(v => !v)}
                      className="relative p-2 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all group"
                    >
                      <Bell size={18} className="text-white/40 group-hover:text-white transition-colors" />
                      {unread > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#08CB00] border-2 border-[#050505] text-[7px] font-black text-black flex items-center justify-center">
                          {unread > 9 ? '9+' : unread}
                        </span>
                      )}
                      {unread === 0 && <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#08CB00] rounded-full border-2 border-[#050505]" />}
                    </button>

                    {showNotifs && (
                      <div className="absolute right-0 top-12 w-80 bg-[#0e0e0e] border border-white/10 rounded-[24px] shadow-2xl shadow-black/60 overflow-hidden z-[200]">
                        {/* Dropdown header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                          <div className="flex items-center gap-2">
                            <Bell size={13} className="text-white/30" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Notifications</span>
                            {unread > 0 && (
                              <span className="px-1.5 py-0.5 rounded-full bg-[#08CB00] text-[7px] font-black text-black">{unread}</span>
                            )}
                          </div>
                          <button onClick={() => setShowNotifs(false)} className="text-white/20 hover:text-white transition-colors">
                            <X size={14} />
                          </button>
                        </div>

                        {/* Notification list */}
                        <div className="flex flex-col gap-2 p-3 max-h-80 overflow-y-auto scrollbar-thin">
                          {notifLoading && (
                            <div className="flex items-center justify-center py-6 gap-2">
                              <Loader2 size={14} className="animate-spin text-white/20" />
                              <span className="text-[9px] text-white/20">Loading…</span>
                            </div>
                          )}
                          {!notifLoading && notifications.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-8 gap-2">
                              <Bell size={22} className="text-white/10" />
                              <p className="text-[9px] text-white/20 uppercase tracking-widest">No new activity</p>
                            </div>
                          )}
                          {!notifLoading && notifications.map((n, i) => {
                            const cfg = TYPE_CFG[n.type] || TYPE_CFG.info;
                            return (
                              <div key={n.id ?? i} className={`flex items-start gap-3 p-3 rounded-2xl border ${cfg.cls} ${!n.read ? 'opacity-100' : 'opacity-50'}`}>
                                <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${cfg.dot}`} />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-2 mb-0.5">
                                    <span className="text-[8px] font-black uppercase tracking-widest text-white/40">{cfg.label}</span>
                                    {n.time_ago && <span className="text-[8px] text-white/20 shrink-0">{n.time_ago}</span>}
                                  </div>
                                  <p className="text-[10px] text-white/60 leading-snug">{n.message}</p>
                                  {n.device && <p className="text-[9px] font-bold text-white/25 mt-0.5 truncate">{n.device}</p>}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-3 border-t border-white/5">
                          <Link href="/technician/Service" onClick={() => setShowNotifs(false)}
                            className="text-[9px] font-black uppercase tracking-widest text-white/20 hover:text-[#08CB00] transition-colors">
                            View all in Service →
                          </Link>
                        </div>
                      </div>
                    )}
                </div>

                <Link href="/technician/profile-settings" className="w-10 h-10 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/20 flex items-center justify-center text-[#08CB00] font-black text-xs shadow-inner hover:border-[#08CB00]/50 transition-all">
                    TA
                </Link>
                </div>
            </div>
        </header>

        </>
    )
}