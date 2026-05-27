"use client"
import { useState, useEffect, useCallback } from 'react';
import AlternateHeader from "@/components/global components/header/alternateHeader";
import {
  Leaf, Package, DollarSign, Wind, Recycle, Award, Lock,
  TrendingUp, CheckCircle2, Clock, Truck,
  TreePine, Zap, Droplets, ChevronRight, Star, Shield, Target, RefreshCw, AlertCircle
} from 'lucide-react';

// ─── CONFIG ───────────────────────────────────────────────────────────────────

const USER_ID = 'd07a118c-ad49-4433-9fdd-e0fcb425c8c0';
const API     = 'http://127.0.0.1:8000';

const STAT_CFG = [
  { label: 'Devices Recycled',    Icon: Package,    color: 'text-[#08CB00]',    bg: 'bg-[#08CB00]/10',   border: 'border-[#08CB00]/20'  },
  { label: 'CO₂ Prevented',       Icon: Wind,       color: 'text-emerald-400',  bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
  { label: 'Total Earnings',      Icon: DollarSign, color: 'text-blue-400',     bg: 'bg-blue-400/10',    border: 'border-blue-400/20'   },
  { label: 'Materials Recovered', Icon: Recycle,    color: 'text-purple-400',   bg: 'bg-purple-400/10',  border: 'border-purple-400/20' },
];

const ACHIEVEMENT_ICONS = { 1: Leaf, 2: Shield, 3: Star, 4: Wind, 5: Award, 6: Target };

const EQUIV_CFG = {
  'Trees Equivalent':  { Icon: TreePine, color: 'text-[#08CB00]',   bg: 'bg-[#08CB00]/10'  },
  'Energy Saved':      { Icon: Zap,      color: 'text-yellow-400',  bg: 'bg-yellow-400/10' },
  'Water Saved':       { Icon: Droplets, color: 'text-blue-400',    bg: 'bg-blue-400/10'   },
  'Landfill Diverted': { Icon: Leaf,     color: 'text-emerald-400', bg: 'bg-emerald-400/10'},
};

const GOAL_COLORS = ['#08CB00', '#60a5fa', '#a78bfa'];

const STATUS_CFG = {
  completed:  { label: 'Completed',  Icon: CheckCircle2, cls: 'bg-[#08CB00]/10 text-[#08CB00]'  },
  in_transit: { label: 'In Transit', Icon: Truck,        cls: 'bg-blue-400/10 text-blue-400'    },
  processing: { label: 'Processing', Icon: Clock,        cls: 'bg-amber-400/10 text-amber-400'  },
};

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <div className="relative w-full h-screen bg-black flex flex-col items-center justify-center gap-4">
      <AlternateHeader />
      <RefreshCw size={28} className="text-[#08CB00] animate-spin" />
      <p className="text-white/40 text-sm font-semibold">Loading your contributions…</p>
    </div>
  );
}

function ErrorScreen({ error, onRetry }) {
  return (
    <div className="relative w-full h-screen bg-black flex flex-col items-center justify-center gap-4">
      <AlternateHeader />
      <AlertCircle size={28} className="text-red-400" />
      <p className="text-white/60 text-sm font-semibold">Failed to load: {error}</p>
      <button onClick={onRetry}
        className="px-5 py-2 bg-[#08CB00] text-black text-xs font-black rounded-full hover:bg-[#06b300] transition-colors">
        Retry
      </button>
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function ContributionsPage() {
  const [data, setData]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [historyTab, setHistoryTab] = useState('all');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${API}/rewards/contributions/${USER_ID}`,
        { credentials: 'include' }
      );
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return <LoadingScreen />;
  if (error)   return <ErrorScreen error={error} onRetry={fetchData} />;

  const { impact_stats, submissions, submission_count, achievements, equivalencies, goals, xp } = data;

  const filtered = historyTab === 'all'
    ? submissions
    : submissions.filter(s => s.status === historyTab);

  return (
    <div className="relative w-full h-screen bg-black overflow-x-hidden overflow-y-auto scrollbar-thin">
      <AlternateHeader />

      <main className="pt-28 pb-20 px-6 max-w-7xl mx-auto space-y-8">

        {/* ── PAGE TITLE ── */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#08CB00] font-black">Your Impact</p>
            <h1 className="text-3xl font-black text-white tracking-tight leading-tight mt-1">Contributions</h1>
            <p className="text-sm text-white/40 mt-1">Everything you've done to close the loop on e-waste.</p>
          </div>
          {/* XP Badge */}
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#08CB00]/10 border border-[#08CB00]/25 rounded-xl">
              <Star size={14} className="text-[#08CB00]" fill="currentColor" />
              <span className="text-sm font-black text-white">{xp.total} XP</span>
              <span className="text-[9px] text-white/30 font-semibold">{xp.unlocked_count}/{xp.total_count} badges</span>
            </div>
            <div className="flex items-center gap-2 w-52">
              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#08CB00] rounded-full transition-all"
                  style={{ width: `${Math.min((xp.total / xp.to_next) * 100, 100)}%` }}
                />
              </div>
              <span className="text-[9px] text-white/30 font-bold shrink-0">{xp.to_next} XP next</span>
            </div>
          </div>
        </div>

        {/* ── IMPACT STATS ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {impact_stats.map((stat, i) => {
            const cfg = STAT_CFG[i] ?? STAT_CFG[0];
            return (
              <div key={stat.label} className={`flex flex-col gap-4 p-5 rounded-2xl bg-white/5 border ${cfg.border} hover:bg-white/8 transition-all`}>
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-xl ${cfg.bg}`}>
                    <cfg.Icon size={16} className={cfg.color} strokeWidth={2} />
                  </div>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#08CB00]/10 text-[#08CB00]">
                    <TrendingUp size={9} />
                    {stat.change}
                  </div>
                </div>
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-black text-white leading-none">{stat.value}</span>
                    <span className={`text-xs font-bold ${cfg.color}`}>{stat.unit}</span>
                  </div>
                  <p className="text-[10px] text-white/40 font-semibold mt-1 uppercase tracking-wider">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── MAIN GRID: HISTORY + ACHIEVEMENTS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* SUBMISSION HISTORY */}
          <div className="lg:col-span-8 flex flex-col bg-white/5 border border-white/10 rounded-2xl p-5 h-[420px] overflow-hidden">
            <div className="flex items-center justify-between mb-4 shrink-0">
              <div>
                <h2 className="text-sm font-black text-white">Submission History</h2>
                <p className="text-[10px] text-white/30 mt-0.5">{submission_count} total devices submitted</p>
              </div>
              <div className="flex items-center bg-white/5 rounded-xl p-1 gap-1">
                {['all', 'completed', 'in_transit', 'processing'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setHistoryTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${
                      historyTab === tab ? 'bg-[#08CB00] text-black' : 'text-white/40 hover:text-white'
                    }`}
                  >
                    {tab === 'in_transit' ? 'Transit' : tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 flex-1 min-h-0 overflow-y-auto pr-1">
              {filtered.length === 0 && (
                <p className="text-center text-white/20 text-xs py-8">No submissions in this category.</p>
              )}
              {filtered.map((sub) => {
                const cfg = STATUS_CFG[sub.status] ?? STATUS_CFG.processing;
                return (
                  <div key={sub.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/3 hover:bg-white/8 border border-white/5 hover:border-white/10 transition-all group cursor-pointer">
                    <div className="p-2 bg-white/5 rounded-lg shrink-0">
                      <Package size={14} className="text-white/40" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate">{sub.device}</p>
                      <p className="text-[9px] text-white/30 mt-0.5">{sub.id} · {sub.date} · {sub.weight}</p>
                    </div>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black shrink-0 ${cfg.cls}`}>
                      <cfg.Icon size={10} strokeWidth={2.5} />
                      {cfg.label}
                    </div>
                    <div className="text-right shrink-0 min-w-[60px]">
                      <p className={`text-xs font-black ${sub.payout === 'Pending' ? 'text-white/30' : 'text-[#08CB00]'}`}>{sub.payout}</p>
                    </div>
                    <ChevronRight size={14} className="text-white/20 group-hover:text-white/50 transition-colors shrink-0" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* ACHIEVEMENTS */}
          <div className="lg:col-span-4 flex flex-col bg-white/5 border border-white/10 rounded-2xl p-5 h-[420px] overflow-hidden">
            <div>
              <h2 className="text-sm font-black text-white">Achievements</h2>
              <p className="text-[10px] text-white/30 mt-0.5">
                {xp.unlocked_count} of {xp.total_count} unlocked
              </p>
            </div>
            <div className="flex flex-col gap-2 flex-1 min-h-0 overflow-y-auto pr-1 mt-4">
              {achievements.map(({ id, title, desc, unlocked, xp: ach_xp }) => {
                const AIcon = ACHIEVEMENT_ICONS[id] ?? Award;
                return (
                  <div key={id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    unlocked ? 'bg-[#08CB00]/8 border-[#08CB00]/20' : 'bg-white/3 border-white/5 opacity-50'
                  }`}>
                    <div className={`p-2 rounded-lg shrink-0 ${unlocked ? 'bg-[#08CB00]/20' : 'bg-white/5'}`}>
                      {unlocked
                        ? <AIcon size={14} className="text-[#08CB00]" strokeWidth={2} />
                        : <Lock size={14} className="text-white/30" strokeWidth={2} />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[11px] font-black truncate ${unlocked ? 'text-white' : 'text-white/40'}`}>{title}</p>
                      <p className="text-[9px] text-white/25 leading-tight mt-0.5">{desc}</p>
                    </div>
                    <span className={`text-[9px] font-black shrink-0 ${unlocked ? 'text-[#08CB00]' : 'text-white/20'}`}>+{ach_xp} XP</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── ENVIRONMENTAL EQUIVALENCIES ── */}
        <div className="flex flex-col gap-4 bg-white/5 border border-white/10 rounded-2xl p-5">
          <div>
            <h2 className="text-sm font-black text-white">Environmental Equivalencies</h2>
            <p className="text-[10px] text-white/30 mt-0.5">What your contributions actually mean in real-world terms.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {equivalencies.map(({ label, value, desc }) => {
              const cfg = EQUIV_CFG[label] ?? { Icon: Leaf, color: 'text-[#08CB00]', bg: 'bg-[#08CB00]/10' };
              return (
                <div key={label} className="flex flex-col items-start gap-3 p-4 rounded-xl bg-white/3 border border-white/5">
                  <div className={`p-2.5 rounded-xl ${cfg.bg}`}>
                    <cfg.Icon size={18} className={cfg.color} strokeWidth={2} />
                  </div>
                  <div>
                    <p className={`text-2xl font-black ${cfg.color} leading-none`}>{value}</p>
                    <p className="text-[10px] text-white/50 leading-snug mt-1">{desc}</p>
                  </div>
                  <p className={`text-[9px] font-black uppercase tracking-wider ${cfg.color} opacity-70`}>{label}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── GOALS ── */}
        <div className="flex flex-col gap-4 bg-white/5 border border-white/10 rounded-2xl p-5">
          <div>
            <h2 className="text-sm font-black text-white">Your Goals</h2>
            <p className="text-[10px] text-white/30 mt-0.5">Progress toward your annual targets.</p>
          </div>
          <div className="flex flex-col gap-5">
            {goals.map(({ label, current, target }, i) => {
              const pct = Math.min((current / target) * 100, 100);
              const color = GOAL_COLORS[i] ?? '#08CB00';
              return (
                <div key={label}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white/60">{label}</span>
                    <span className="text-xs font-black text-white">{current} <span className="text-white/30 font-semibold">/ {target}</span></span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
                  </div>
                  <p className="text-[9px] text-white/25 mt-1 text-right">{pct.toFixed(0)}% of goal</p>
                </div>
              );
            })}
          </div>
        </div>

      </main>
    </div>
  );
}
