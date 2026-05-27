"use client"
import { Database, CheckCircle2, Clock, Scale } from 'lucide-react';

const BAR_COLORS = ['bg-[#08CB00]', 'bg-blue-400', 'bg-yellow-400', 'bg-purple-400', 'bg-white/30']

export default function SidebarStats({ submissions = [], stats = {}, loading }) {
  const totalWeight = submissions.reduce((acc, s) => acc + (parseFloat(s.estimated_weight) || 0), 0);
  const completedWeight = submissions
    .filter(s => s.status === 'completed')
    .reduce((acc, s) => acc + (parseFloat(s.estimated_weight) || 0), 0);

  const weightPct = totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0;
  const circumference = 2 * Math.PI * 40;
  const dashOffset = circumference - (weightPct / 100) * circumference;

  const categoryMap = {};
  submissions.forEach(s => {
    const cat = s.category || 'Other';
    categoryMap[cat] = (categoryMap[cat] || 0) + 1;
  });
  const total = submissions.length || 1;
  const breakdown = Object.entries(categoryMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([label, count], i) => ({
      label,
      percentage: Math.round((count / total) * 100),
      color: BAR_COLORS[i] || BAR_COLORS[4],
    }));

  return (
    <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">

      {/* Weight ring */}
      <div className="bg-[#1A1A1A] border border-white/5 rounded-[40px] p-8 shadow-2xl flex flex-col items-center relative overflow-hidden">
        <div className="w-full flex justify-between items-center mb-6">
          <h3 className="text-white font-black text-sm tracking-widest uppercase flex items-center gap-2">
            <Database size={16} className="text-[#08CB00]" /> Weight Summary
          </h3>
        </div>

        <div className="relative w-44 h-44 flex items-center justify-center mb-4">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
            <circle cx="50" cy="50" r="40" fill="none"
              stroke={weightPct > 90 ? '#ef4444' : '#08CB00'} strokeWidth="8"
              strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={dashOffset}
              className="transition-all duration-1000 drop-shadow-[0_0_8px_rgba(8,203,0,0.5)]" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-black text-white tracking-tighter">
              {loading ? '—' : weightPct}<span className="text-lg text-white/40">%</span>
            </span>
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40 mt-1">Processed</span>
          </div>
        </div>

        <div className="w-full bg-black/40 rounded-2xl p-4 flex justify-between items-center border border-white/5">
          <div>
            <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Completed</p>
            <p className="text-lg font-black text-white">{loading ? '—' : completedWeight.toFixed(1)} <span className="text-xs text-white/40">kg</span></p>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Total</p>
            <p className="text-lg font-black text-white">{loading ? '—' : totalWeight.toFixed(1)} <span className="text-xs text-white/40">kg</span></p>
          </div>
        </div>
      </div>

      {/* KPI chips */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Completed Today', value: stats.completed_today ?? '—', color: 'text-[#08CB00]',  icon: <CheckCircle2 size={14} className="text-[#08CB00]" /> },
          { label: 'Pending',         value: stats.pending_count  ?? '—',  color: 'text-yellow-400', icon: <Clock size={14} className="text-yellow-400" /> },
          { label: 'Weight Today',    value: stats.weight_processed_kg ? `${stats.weight_processed_kg} kg` : '—', color: 'text-blue-400', icon: <Scale size={14} className="text-blue-400" /> },
          { label: 'Total Items',     value: loading ? '—' : submissions.length, color: 'text-white', icon: <Database size={14} className="text-white/40" /> },
        ].map(k => (
          <div key={k.label} className="bg-[#1A1A1A] border border-white/5 rounded-[20px] p-4 shadow-xl">
            <div className="flex items-center gap-2 mb-1">{k.icon}<p className="text-[8px] font-black uppercase tracking-widest text-white/30">{k.label}</p></div>
            <p className={`text-2xl font-black ${k.color}`}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Category breakdown */}
      {breakdown.length > 0 && (
        <div className="bg-[#1A1A1A] border border-white/5 rounded-[32px] p-6 shadow-2xl">
          <h3 className="text-white font-black text-xs tracking-widest uppercase mb-5">Category Breakdown</h3>
          <div className="space-y-4">
            {breakdown.map((item, i) => (
              <div key={i} className="group">
                <div className="flex justify-between items-end mb-1.5">
                  <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest truncate max-w-[70%] group-hover:text-white transition-colors">{item.label}</span>
                  <span className="text-xs font-black text-white">{item.percentage}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full transition-all duration-1000`} style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}