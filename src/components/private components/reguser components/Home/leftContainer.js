"use client";
import { useState, useEffect, useCallback } from "react";
import { Bell, CheckCircle2, AlertCircle, Info, AlertTriangle, RefreshCw, Loader2, ArrowRight, Recycle, Leaf, DollarSign, Package } from 'lucide-react';
import Link from 'next/link';

const API     = 'http://127.0.0.1:8000';
const USER_ID = 'd07a118c-ad49-4433-9fdd-e0fcb425c8c0';

const TYPE_CFG = {
  success:  { Icon: CheckCircle2,  pill: 'bg-[#08CB00]/10 text-[#08CB00]',  label: 'Success' },
  error:    { Icon: AlertCircle,   pill: 'bg-red-50 text-red-500',          label: 'Alert' },
  warning:  { Icon: AlertTriangle, pill: 'bg-amber-50 text-amber-500',      label: 'Warning' },
  info:     { Icon: Info,          pill: 'bg-blue-50 text-blue-500',        label: 'Info' },
};

const STAT_CONFIG = [
  { label: 'Submissions', Icon: Package,    color: 'text-[#08CB00]',    bg: 'bg-[#08CB00]/10' },
  { label: 'Rewards',     Icon: DollarSign, color: 'text-blue-500',    bg: 'bg-blue-50'      },
  { label: 'CO₂ Saved',  Icon: Leaf,       color: 'text-emerald-500', bg: 'bg-emerald-50'   },
];

export default function LeftConatiner() {
  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [markingRead, setMarkingRead] = useState(false);
  const [statValues, setStatValues]     = useState(['—', '—', '—']);

  const fetchContributions = useCallback(async () => {
    try {
      const res = await fetch(`${API}/rewards/contributions/${USER_ID}`, { credentials: 'include' });
      if (res.ok) {
        const d = await res.json();
        const { submission_count, impact_stats } = d;
        const earnings = impact_stats?.[2];
        const co2      = impact_stats?.[1];
        setStatValues([
          submission_count != null ? String(submission_count) : '—',
          earnings ? `${earnings.value}` : '—',
          co2      ? `${co2.value}${co2.unit}` : '—',
        ]);
      }
    } catch { /* silent */ }
  }, []);

  const fetchNotifications = useCallback(async () => {
    setNotifLoading(true);
    try {
      const res = await fetch(`${API}/e-waste-submission/submissions/notifications?page=1&page_size=20`, {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch { /* silent */ } finally { setNotifLoading(false); }
  }, []);

  const markAllRead = useCallback(async () => {
    setMarkingRead(true);
    try {
      await fetch(`${API}/e-waste-submission/submissions/notifications/mark-read`, {
        method: 'POST',
        credentials: 'include',
        body: new FormData(),
      });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch { /* silent */ } finally { setMarkingRead(false); }
  }, []);

  useEffect(() => {
    fetchContributions();
    fetchNotifications();
    const id = setInterval(fetchNotifications, 30000);
    return () => clearInterval(id);
  }, [fetchContributions, fetchNotifications]);

  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="flex flex-col h-full w-[20%] gap-3 p-1 font-sans">

      {/* GREETING CARD */}
      <div className="shrink-0 flex items-center gap-3 p-4 bg-gray-900 rounded-2xl">
        <img
          src="/img/headIcon.png"
          alt="User"
          className="w-10 h-10 rounded-xl border-2 border-[#08CB00] object-cover shrink-0"
        />
        <div className="min-w-0">
          <p className="text-[9px] text-white/40 font-semibold uppercase tracking-widest leading-none">Welcome back</p>
          <p className="text-sm font-black text-white leading-tight truncate">Tadiee</p>
          <span className="inline-block mt-1 px-2 py-0.5 bg-[#08CB00]/20 rounded-full text-[8px] font-black text-[#08CB00] uppercase tracking-wider">Active Member</span>
        </div>
        <Link href="/reguser/profile-settings" className="ml-auto shrink-0 p-1.5 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
          <ArrowRight size={12} className="text-white/30" />
        </Link>
      </div>

      {/* MY ACTIVITY STATS */}
      <div className="shrink-0 grid grid-cols-3 gap-2">
        {STAT_CONFIG.map(({ label, Icon, color, bg }, i) => (
          <div key={label} className="flex flex-col items-center gap-1.5 p-3 bg-white border border-gray-100 rounded-xl">
            <div className={`p-1.5 rounded-lg ${bg}`}>
              <Icon size={12} className={color} strokeWidth={2.5} />
            </div>
            <span className="text-sm font-black text-gray-900 leading-none">{statValues[i]}</span>
            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wide text-center leading-tight">{label}</span>
          </div>
        ))}
      </div>

      {/* NOTIFICATIONS HUB */}
      <div className="flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm flex-1 min-h-0">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#08CB00] rounded-lg">
              <Bell size={12} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xs font-black text-gray-900 tracking-tight">Notifications</span>
            {unread > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-[#08CB00] text-[8px] font-black text-white">{unread}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchNotifications}
              disabled={notifLoading}
              className="p-1 text-gray-300 hover:text-[#08CB00] transition-colors"
            >
              <RefreshCw size={11} className={notifLoading ? 'animate-spin' : ''} />
            </button>
            {unread > 0 && (
              <button
                onClick={markAllRead}
                disabled={markingRead}
                className="text-[9px] font-bold text-gray-400 hover:text-[#08CB00] transition-colors uppercase tracking-wider"
              >
                {markingRead ? 'Marking…' : 'Mark all read'}
              </button>
            )}
          </div>
        </div>

        {/* List */}
        <div className="flex flex-col overflow-y-auto scrollbar-hidden flex-1 p-2 gap-1">
          {notifLoading && notifications.length === 0 && (
            <div className="flex items-center justify-center py-8 gap-2">
              <Loader2 size={16} className="animate-spin text-gray-300" />
              <span className="text-[10px] text-gray-300">Loading…</span>
            </div>
          )}

          {!notifLoading && notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <Bell size={24} className="text-gray-200" />
              <p className="text-[10px] text-gray-300 font-semibold">No notifications yet</p>
            </div>
          )}

          {notifications.map((notif, index) => {
            const cfg = TYPE_CFG[notif.type] || TYPE_CFG.info;
            const { Icon } = cfg;
            return (
              <div
                key={notif.id ?? index}
                className={`group flex items-start gap-3 p-3 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  !notif.read
                    ? 'bg-[#08CB00]/3 border-[#08CB00]/10 hover:bg-[#08CB00]/8'
                    : 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-100'
                }`}
              >
                {/* Icon */}
                <div className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${cfg.pill}`}>
                  <Icon size={12} strokeWidth={2.5} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className={`text-[8px] font-black uppercase tracking-widest ${cfg.pill.split(' ')[1]}`}>{cfg.label}</span>
                    {notif.time_ago && (
                      <span className="text-[8px] text-gray-300 ml-auto shrink-0">{notif.time_ago}</span>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-600 leading-snug group-hover:text-gray-800 transition-colors">
                    {notif.message}
                  </p>
                </div>

                {/* Unread dot */}
                {!notif.read && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#08CB00] mt-1.5 shrink-0 shadow-[0_0_6px_rgba(8,203,0,0.5)]" />
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="shrink-0 px-4 py-3 border-t border-gray-50 flex items-center justify-between">
          <span className="text-[9px] text-gray-300 font-semibold uppercase tracking-widest">
            {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
          </span>
          <Link href="/reguser/Tracking" className="flex items-center gap-1 text-[9px] font-black text-[#08CB00] hover:underline uppercase tracking-wider">
            View Tracking <ArrowRight size={10} />
          </Link>
        </div>
      </div>
      
     
    </div>
  );
}
