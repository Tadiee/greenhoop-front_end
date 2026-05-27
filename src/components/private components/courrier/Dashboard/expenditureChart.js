import { Wallet, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const FALLBACK = [
  { name: 'Mon', value: 0 }, { name: 'Tue', value: 0 }, { name: 'Wed', value: 0 },
  { name: 'Thu', value: 0 }, { name: 'Fri', value: 0 }, { name: 'Sat', value: 0 },
  { name: 'Sun', value: 0 },
];

export default function ExpenditureChart({ stats = {}, loading }) {
  const chartData = stats.earnings_series || FALLBACK;
  const earned = stats.earnings_today ?? 0;
  const target = stats.earnings_target ?? 0;
  const pct = target > 0 ? Math.round((earned / target) * 100) : 0;

  return (
    <div className="flex-1 bg-[#121212] border border-white/5 rounded-[40px] p-6 flex flex-col shadow-2xl relative group min-h-0">
      <div className="flex justify-between items-center mb-5 shrink-0">
        <div>
          <h3 className="text-[9px] font-black uppercase tracking-widest text-white/30">Earnings Overview</h3>
          <p className="text-2xl font-black mt-0.5">
            ${loading ? '—' : earned.toFixed(2)}
            {!loading && target > 0 && (
              <span className="text-[11px] text-[#08CB00] ml-2 font-bold">{pct}% of ${target} target</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!loading && pct > 0 && (
            <div className="flex items-center gap-1 px-2.5 py-1 bg-[#08CB00]/10 border border-[#08CB00]/20 rounded-full">
              <TrendingUp size={10} className="text-[#08CB00]" />
              <span className="text-[9px] font-black text-[#08CB00]">{pct}%</span>
            </div>
          )}
          <Wallet size={18} className="text-white/20" />
        </div>
      </div>
      <div className="flex-1 relative z-0 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#08CB00" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#08CB00" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 9, fontWeight: 'bold' }} />
            <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 9, fontWeight: 'bold' }} />
            <Tooltip contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }} />
            <Area type="monotone" dataKey="value" stroke="#08CB00" strokeWidth={2.5} fill="url(#earningsGrad)" dot={{ r: 3, fill: '#08CB00', strokeWidth: 2, stroke: '#0A0A0A' }} activeDot={{ r: 5 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#08CB00]/5 via-transparent to-transparent pointer-events-none rounded-[40px]" />
    </div>
  );
}