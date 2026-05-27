"use client"
import { useState, useEffect, useCallback } from 'react';
import {
  ArrowUpRight, Download, ShieldCheck, Clock, X, RefreshCw,
  CreditCard, Smartphone, Wallet, MoreHorizontal, CheckCircle2, ChevronRight, ArrowLeft
} from 'lucide-react';

const USER_ID = 'd07a118c-ad49-4433-9fdd-e0fcb425c8c0';
const API     = 'http://127.0.0.1:8000';

// ─── WITHDRAWAL METHODS ────────────────────────────────────────────────────────
const METHODS = [
  { id: 'credit_card',     label: 'Credit Card',     Icon: CreditCard,    desc: 'Visa / Mastercard',        needsPhone: false },
  { id: 'airtime',         label: 'Airtime Voucher', Icon: Smartphone,    desc: 'Mobile airtime top-up',    needsPhone: true  },
  { id: 'ecocash',         label: 'EcoCash',         Icon: Wallet,        desc: 'EcoCash mobile wallet',    needsPhone: true  },
  { id: 'other',           label: 'Other',           Icon: MoreHorizontal,desc: 'Bank transfer & more',     needsPhone: false },
];

// ─── MODAL ────────────────────────────────────────────────────────────────────
function WithdrawModal({ available, onClose, onSuccess }) {
  const [step, setStep]           = useState('select'); // select | confirm | success
  const [method, setMethod]       = useState(null);
  const [amount, setAmount]       = useState('');
  const [phone, setPhone]         = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]         = useState(null);
  const [txnRef, setTxnRef]       = useState(null);

  const selectedMethod = METHODS.find(m => m.id === method);

  const canProceed = method && parseFloat(amount) > 0 &&
    (!selectedMethod?.needsPhone || phone.trim().length >= 9);

  const handleConfirm = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${API}/rewards/wallet/${USER_ID}/withdraw`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(amount) }),
      });
      const json = await res.json();
      if (json.success) {
        setTxnRef(json.txn_reference);
        onSuccess(json.available_balance);
        setStep('success');
      } else {
        setError(json.error);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-[40px] p-8 shadow-2xl">

        {/* Close */}
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-white/20 hover:text-white transition-colors rounded-full hover:bg-white/5">
          <X size={18} />
        </button>

        {/* ── STEP: SELECT ── */}
        {step === 'select' && (
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#08CB00]">Withdraw Funds</p>
              <h2 className="text-2xl font-black text-white mt-1">How would you like to receive?</h2>
              <p className="text-xs text-white/30 mt-1">Available: <span className="text-white font-bold">${Number(available).toFixed(2)}</span></p>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Amount (USD)</label>
              <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus-within:border-[#08CB00]/50 transition-colors">
                <span className="text-white/30 font-black text-lg mr-2">$</span>
                <input
                  type="number" min="0" step="0.01" max={available}
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="flex-1 bg-transparent text-white text-xl font-black focus:outline-none placeholder:text-white/20"
                />
              </div>
            </div>

            {/* Method Grid */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Select Method</label>
              <div className="grid grid-cols-2 gap-3">
                {METHODS.map(({ id, label, Icon, desc }) => (
                  <button
                    key={id}
                    onClick={() => { setMethod(id); setPhone(''); }}
                    className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${
                      method === id
                        ? 'bg-[#08CB00]/10 border-[#08CB00]/40'
                        : 'bg-white/3 border-white/8 hover:border-white/20'
                    }`}
                  >
                    <div className={`p-2 rounded-xl shrink-0 ${method === id ? 'bg-[#08CB00]/20' : 'bg-white/5'}`}>
                      <Icon size={16} className={method === id ? 'text-[#08CB00]' : 'text-white/40'} />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs font-black leading-none ${method === id ? 'text-white' : 'text-white/60'}`}>{label}</p>
                      <p className="text-[9px] text-white/25 mt-0.5 truncate">{desc}</p>
                    </div>
                    {method === id && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-[#08CB00] shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Phone input — only for Airtime / EcoCash */}
            {selectedMethod?.needsPhone && (
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
                  {method === 'airtime' ? 'Phone Number' : 'EcoCash Number'}
                </label>
                <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus-within:border-[#08CB00]/50 transition-colors">
                  <span className="text-white/30 font-black text-sm mr-2">+263</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="7X XXX XXXX"
                    className="flex-1 bg-transparent text-white font-bold focus:outline-none placeholder:text-white/20 text-sm"
                  />
                </div>
              </div>
            )}

            {error && <p className="text-red-400 text-xs font-bold">{error}</p>}

            <button
              disabled={!canProceed}
              onClick={() => { setError(null); setStep('confirm'); }}
              className="w-full py-4 rounded-2xl bg-[#08CB00] text-black font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-white transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-[#08CB00]/20"
            >
              Continue <ChevronRight size={14} />
            </button>
          </div>
        )}

        {/* ── STEP: CONFIRM ── */}
        {step === 'confirm' && (
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#08CB00]">Confirm Withdrawal</p>
              <h2 className="text-2xl font-black text-white mt-1">Review your request</h2>
            </div>

            <div className="space-y-3 bg-white/3 border border-white/8 rounded-3xl p-6">
              {[
                { label: 'Amount',  value: `$${parseFloat(amount).toFixed(2)}` },
                { label: 'Method',  value: selectedMethod?.label },
                ...(selectedMethod?.needsPhone ? [{ label: 'Number', value: `+263 ${phone}` }] : []),
                { label: 'Remaining after', value: `$${(Number(available) - parseFloat(amount)).toFixed(2)}` },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{label}</span>
                  <span className="text-sm font-black text-white">{value}</span>
                </div>
              ))}
            </div>

            {error && <p className="text-red-400 text-xs font-bold">{error}</p>}

            <div className="flex gap-3">
              <button
                onClick={() => setStep('select')}
                className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                <ArrowLeft size={13} /> Back
              </button>
              <button
                disabled={submitting}
                onClick={handleConfirm}
                className="flex-1 py-4 rounded-2xl bg-[#08CB00] text-black font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-white transition-all disabled:opacity-50 shadow-lg shadow-[#08CB00]/20"
              >
                {submitting ? <RefreshCw size={14} className="animate-spin" /> : <><CheckCircle2 size={14} /> Confirm Withdrawal</>}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP: SUCCESS ── */}
        {step === 'success' && (
          <div className="flex flex-col items-center text-center gap-6 py-4">
            <div className="w-20 h-20 rounded-full bg-[#08CB00]/15 border border-[#08CB00]/30 flex items-center justify-center">
              <CheckCircle2 size={40} className="text-[#08CB00]" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">Withdrawal Initiated</h2>
              <p className="text-sm text-white/40 mt-2">
                <span className="text-[#08CB00] font-black">${parseFloat(amount).toFixed(2)}</span> is on its way via {selectedMethod?.label}.
              </p>
              {txnRef && <p className="text-[9px] text-white/20 font-mono mt-3">Ref: {txnRef}</p>}
            </div>
            <button
              onClick={onClose}
              className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function TopContainer() {
  const [walletData, setWalletData] = useState(null);
  const [tierData, setTierData]     = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [showModal, setShowModal]   = useState(false);

  const fetchWallet = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [walletRes, tierRes] = await Promise.all([
        fetch(`${API}/rewards/wallet/${USER_ID}/activity-chart?months=12`, { credentials: 'include' }),
        fetch(`${API}/rewards/stats/${USER_ID}/tier-progress`,            { credentials: 'include' }),
      ]);
      if (!walletRes.ok) throw new Error(`Wallet error ${walletRes.status}`);
      setWalletData(await walletRes.json());
      if (tierRes.ok) setTierData(await tierRes.json());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchWallet(); }, [fetchWallet]);

  if (loading) return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8 bg-white/5 border border-white/5 rounded-[56px] p-12 flex items-center justify-center h-64">
        <RefreshCw size={20} className="animate-spin text-[#08CB00] mr-2" />
        <span className="text-white/30 text-sm">Loading wallet…</span>
      </div>
      <div className="lg:col-span-4 bg-[#08CB00]/10 border border-[#08CB00]/10 rounded-[56px] h-64" />
    </section>
  );

  if (error) return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8 bg-white/5 border border-white/5 rounded-[56px] p-12 flex items-center justify-center h-64 text-red-400 text-sm gap-2">
        {error} <button onClick={fetchWallet} className="underline text-white/40 text-xs">Retry</button>
      </div>
      <div className="lg:col-span-4 bg-[#08CB00]/10 border border-[#08CB00]/10 rounded-[56px] h-64" />
    </section>
  );

  const { chart, available_balance, held_balance } = walletData;
  const maxCredit = Math.max(...chart.map(d => d.credits), 1);
  const barHeights = chart.map(d => Math.max(Math.round((d.credits / maxCredit) * 140), 4));

  return (
    <>
      {showModal && (
        <WithdrawModal
          available={available_balance}
          onClose={() => setShowModal(false)}
          onSuccess={(newBalance) => {
            setWalletData(prev => ({ ...prev, available_balance: newBalance }));
          }}
        />
      )}

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* ── WALLET CARD ── */}
        <div className="lg:col-span-8 bg-gradient-to-br from-[#08CB00]/10 to-transparent border border-white/5 rounded-[56px] p-12 space-y-10 relative overflow-hidden">
          <div className="flex justify-between items-start relative z-10">
            <div className="space-y-2">
              <p className="text-[11px] font-black uppercase tracking-[0.5em] text-[#08CB00]">Available Earnings</p>
              <h1 className="text-9xl font-black tracking-tighter leading-none">${Number(available_balance).toFixed(2)}</h1>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-3xl flex items-center gap-4">
              <div className="p-3 bg-white/7 rounded-2xl">
                <Clock size={20} className="text-[#08CB00]" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Verification Queue</p>
                <p className="text-xl font-black text-white">${Number(held_balance).toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* ── BAR CHART ── */}
          <div className="h-40 flex flex-col justify-between gap-2 px-2 relative z-10">
            <p className="text-[11px] font-black uppercase tracking-[0.5em] text-white/30">Activity Chart</p>
            <div className="flex items-end gap-2 h-[90%] w-full">
              {chart.map((d, i) => (
                <div key={i} className="group relative flex-1">
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black px-2 py-1 rounded text-[8px] font-black opacity-0 group-hover:opacity-100 transition-all shadow-xl whitespace-nowrap z-10">
                    {d.month}: +${d.credits.toFixed(0)}
                  </div>
                  <div
                    style={{ height: `${barHeights[i]}px` }}
                    className={`w-full rounded-t-xl transition-all duration-700 ${i === chart.length - 1 ? 'bg-[#08CB00]' : 'bg-white/10 group-hover:bg-[#08CB00]/40'}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ── ACTIONS ── */}
          <div className="flex gap-4 relative z-10 flex-wrap">
            <button
              onClick={() => setShowModal(true)}
              className="bg-[#08CB00] text-black px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-white transition-all shadow-xl shadow-[#08CB00]/20"
            >
              Withdraw <ArrowUpRight size={14} />
            </button>
            <button className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
              <Download size={14} /> Statement
            </button>
          </div>
        </div>

        {/* ── CITIZEN TIER CARD ── */}
        <div className="lg:col-span-4 bg-[#08CB00] rounded-[56px] p-10 text-black flex flex-col justify-between group">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Citizen Status</p>
            <h3 className="text-3xl font-black italic tracking-tighter leading-tight">
              {tierData?.current_tier?.name?.toUpperCase() ?? '—'}
            </h3>
            <p className="text-xs font-bold bg-black/5 inline-block px-4 py-1.5 rounded-full mt-2 uppercase tracking-tighter">
              {tierData ? `Level ${tierData.current_tier?.level ?? '—'}` : 'Loading…'}
            </p>
          </div>
          <div className="bg-black/5 rounded-3xl p-6 space-y-4 border border-black/5">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Next Tier</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-[#08CB00] shadow-lg">
                <ShieldCheck size={24} />
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-tight">
                  {tierData?.next_tier?.name ?? 'Max Tier Reached'}
                </p>
                <p className="text-[10px] font-bold opacity-60">
                  {tierData?.points_to_next_tier > 0
                    ? `${tierData.points_to_next_tier} pts to unlock`
                    : 'You\'re at the top!'}
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between text-[10px] font-black">
              <span>TIER PROGRESS</span>
              <span>{tierData ? `${Number(tierData.tier_progress_percentage).toFixed(1)}%` : '—'}</span>
            </div>
            <div className="w-full h-5 bg-black/10 rounded-2xl overflow-hidden p-1">
              <div
                className="h-full bg-black rounded-xl transition-all duration-1000"
                style={{ width: `${tierData ? Math.min(tierData.tier_progress_percentage, 100) : 0}%` }}
              />
            </div>
            <p className="text-[9px] opacity-50 font-bold">
              {tierData ? `${tierData.points_earned} pts earned` : ''}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}