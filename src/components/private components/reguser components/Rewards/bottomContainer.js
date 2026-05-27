"use client"
import { useState, useEffect, useCallback } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, CheckCircle2, Clock, XCircle, ArrowRightLeft, CalendarDays } from 'lucide-react';

const USER_ID = 'd07a118c-ad49-4433-9fdd-e0fcb425c8c0';
const API     = 'http://127.0.0.1:8000';

export default function BottomContainer() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/rewards/wallet/${USER_ID}/transactions-summary`, { credentials: 'include' });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      setData(await res.json());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSummary(); }, [fetchSummary]);

  if (loading) return (
    <section className="bg-white/[0.02] border border-white/5 rounded-[56px] p-10 flex items-center justify-center h-48">
      <RefreshCw size={20} className="animate-spin text-[#08CB00] mr-2" />
      <span className="text-white/30 text-sm">Loading journal…</span>
    </section>
  );

  if (error || !data) return null;

  const {
    total_credits, total_debits, net_balance, total_transactions,
    pending_transactions, cleared_transactions, failed_transactions,
    last_transaction_date,
  } = data;

  const creditPct  = total_credits + total_debits > 0 ? (total_credits / (total_credits + total_debits)) * 100 : 50;
  const lastDate   = last_transaction_date
    ? new Date(last_transaction_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—';

  const STATUS_PILLS = [
    { label: 'Cleared',  value: cleared_transactions, Icon: CheckCircle2, cls: 'bg-[#08CB00]/10 border-[#08CB00]/20 text-[#08CB00]' },
    { label: 'Pending',  value: pending_transactions, Icon: Clock,        cls: 'bg-amber-400/10 border-amber-400/20 text-amber-400' },
    { label: 'Failed',   value: failed_transactions,  Icon: XCircle,      cls: 'bg-red-500/10 border-red-500/20 text-red-400'      },
  ];

  return (
    <section className="bg-white/[0.02] border border-white/5 rounded-[56px] p-10 space-y-10">

      {/* ── HEADER ── */}
      <div className="flex items-end justify-between px-4">
        <div>
          <h3 className="text-3xl font-black uppercase italic tracking-tighter">
            Circular <span className="text-[#08CB00]">Journal</span>
          </h3>
          <p className="text-[10px] text-white/30 font-bold mt-1 uppercase tracking-widest">Transaction Summary</p>
        </div>
        <div className="flex items-center gap-2 text-white/20">
          <CalendarDays size={14} />
          <span className="text-[10px] font-bold">Last activity: {lastDate}</span>
        </div>
      </div>

      {/* ── MAIN ROW ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-4">

        {/* Net Balance hero */}
        <div className="lg:col-span-4 flex flex-col justify-between bg-white/3 border border-white/5 rounded-[40px] p-8 space-y-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Net Balance</p>
            <p className={`text-6xl font-black tracking-tighter leading-none mt-2 ${net_balance >= 0 ? 'text-[#08CB00]' : 'text-red-400'}`}>
              {net_balance >= 0 ? '+' : ''}${Number(net_balance).toFixed(2)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ArrowRightLeft size={14} className="text-white/20" />
            <span className="text-[10px] text-white/30 font-bold">{total_transactions} total transactions</span>
          </div>
        </div>

        {/* Credits vs Debits */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-white/3 border border-white/5 rounded-[40px] p-8 space-y-6">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Credits vs Debits</p>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-[#08CB00]" />
                <span className="text-xs font-black text-white/60 uppercase tracking-wider">Credits</span>
              </div>
              <span className="text-xl font-black text-[#08CB00]">+${Number(total_credits).toFixed(2)}</span>
            </div>
            {/* Stacked bar */}
            <div className="h-3 bg-white/5 rounded-full overflow-hidden flex">
              <div className="h-full bg-[#08CB00] rounded-full transition-all duration-1000" style={{ width: `${creditPct}%` }} />
              <div className="h-full bg-red-400/60 flex-1 transition-all duration-1000" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingDown size={16} className="text-red-400" />
                <span className="text-xs font-black text-white/60 uppercase tracking-wider">Debits</span>
              </div>
              <span className="text-xl font-black text-red-400">-${Number(total_debits).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Status breakdown */}
        <div className="lg:col-span-3 flex flex-col justify-between bg-white/3 border border-white/5 rounded-[40px] p-8 space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">By Status</p>
          <div className="flex flex-col gap-3">
            {STATUS_PILLS.map(({ label, value, Icon, cls }) => (
              <div key={label} className={`flex items-center justify-between px-4 py-3 rounded-2xl border ${cls}`}>
                <div className="flex items-center gap-2">
                  <Icon size={13} strokeWidth={2.5} />
                  <span className="text-[10px] font-black uppercase tracking-wider">{label}</span>
                </div>
                <span className="text-sm font-black">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}