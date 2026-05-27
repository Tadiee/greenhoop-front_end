"use client"
import React from 'react';
import { Wallet, QrCode, ClipboardList, History, ShoppingBag, TrendingDown, TrendingUp, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function UtilityButtons({ dashStats = {}, loading }) {
  const balance     = dashStats.wallet_balance;
  const spentToday  = dashStats.spent_today;
  const pendingPay  = dashStats.pending_payment;

  const quickActions = [
    { icon: QrCode,       label: 'Scan',        href: '/technician/Service' },
    { icon: ClipboardList,label: 'Queue',       href: '/technician/Service' },
    { icon: ShoppingBag,  label: 'Market',      href: '/technician/Marketplace' },
    { icon: History,      label: 'Purchases',   href: '/technician/Expenditure' },
  ];

  return (
    <>
      <div className="grid grid-cols-2 gap-6">

        {/* WALLET SNAPSHOT */}
        <div className="bg-white/[0.03] border border-white/5 rounded-[40px] p-8 flex flex-col justify-between group hover:border-[#08CB00]/30 transition-all shadow-xl">
          <Wallet size={20} className="text-[#08CB00] opacity-40 group-hover:opacity-100 transition-opacity" />
          <div className="mt-4">
            <p className="text-[8px] font-black uppercase text-white/20 tracking-widest">Wallet Balance</p>
            {loading ? (
              <Loader2 size={16} className="text-[#08CB00] animate-spin mt-2" />
            ) : (
              <>
                <h3 className="text-3xl font-black italic tracking-tighter mt-1">
                  {balance != null ? `$${balance}` : '—'}
                </h3>
                <div className="flex flex-col gap-0.5 mt-2">
                  {spentToday != null && (
                    <p className="text-[7px] font-bold text-red-400 uppercase tracking-widest flex items-center gap-1">
                      <TrendingDown size={9} /> Spent today: ${spentToday}
                    </p>
                  )}
                  {pendingPay != null && (
                    <p className="text-[7px] font-bold text-yellow-400 uppercase tracking-widest flex items-center gap-1">
                      <TrendingUp size={9} /> Pending: ${pendingPay}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* QUICK ACTIONS GRID */}
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((act, i) => (
            <Link key={i} href={act.href}
              className="bg-white/5 border border-white/10 rounded-3xl flex flex-col items-center justify-center gap-2 py-4 hover:bg-[#08CB00] hover:border-[#08CB00] transition-all group/btn"
            >
              <act.icon size={18} className="text-white/20 group-hover/btn:text-black transition-colors" />
              <span className="text-[8px] font-black uppercase tracking-widest text-white/30 group-hover/btn:text-black transition-colors">{act.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* PRIMARY CTA */}
      <Link href="/technician/Service"
        className="h-20 bg-white rounded-[40px] flex items-center justify-center text-black font-black uppercase tracking-[0.3em] shadow-sm hover:scale-[1.02] active:scale-95 transition-all text-xs"
      >
        Browse Purchase Queue
      </Link>
    </>
  );
}