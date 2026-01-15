import { MoreVertical, Leaf, Globe, Zap, TrendingUp, ArrowUpRight, Download, ShieldCheck, Clock } from 'lucide-react';

export default function  FluxStyleMetricCard ({ title, icon: Icon, mainStat, subStat, trend, categories }) {
  return (
  <div className="bg-white/[0.03] border border-white/10 rounded-[40px] p-8 text-white flex flex-col h-full hover:border-[#08CB00]/30 transition-all duration-500 group">
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-[#08CB00]/10 rounded-2xl border border-[#08CB00]/20">
          <Icon size={20} className="text-[#08CB00]" />
        </div>
        <span className="font-bold text-xs uppercase tracking-widest text-white/60">{title}</span>
      </div>
      <button className="text-white/20 hover:text-[#08CB00] transition-colors"><MoreVertical size={20} /></button>
    </div>
    <div className="mb-10">
      <div className="flex items-baseline gap-3">
        <h2 className="text-5xl font-black tracking-tighter leading-none">{mainStat}</h2>
        <div className="flex items-center gap-1 bg-[#08CB00]/20 text-[#08CB00] px-3 py-1 rounded-full text-[10px] font-black">
          <TrendingUp size={12} /> {trend}
        </div>
      </div>
      <p className="text-xs font-medium text-white/40 mt-3">{subStat}</p>
    </div>
    <div className="relative h-40 mb-10 flex items-center justify-center isolate">
      <div className="absolute left-1/4 w-28 h-28 rounded-full flex flex-col items-center justify-center opacity-80 backdrop-blur-sm border border-white/5 shadow-2xl transition-transform group-hover:scale-110 duration-700" style={{ backgroundColor: categories[0].color + '44' }}>
         <span className="text-xs font-black">{categories[0].value}</span>
      </div>
      <div className="absolute right-1/4 w-24 h-24 rounded-full flex flex-col items-center justify-center opacity-90 border border-white/10 shadow-2xl transition-transform group-hover:-translate-y-2 duration-700" style={{ backgroundColor: categories[1].color }}>
         <span className="text-xs font-black text-black">{categories[1].value}</span>
      </div>
      <div className="absolute bottom-2 w-16 h-16 rounded-full flex flex-col items-center justify-center border border-white/20 shadow-xl transition-transform group-hover:translate-x-2 duration-700" style={{ backgroundColor: categories[2].color }}>
         <span className="text-[10px] font-black text-black">{categories[2].value}</span>
      </div>
    </div>
    <div className="space-y-4 mt-auto">
      {categories.map((cat, idx) => (
        <div key={idx} className="space-y-2">
          <div className="flex justify-between items-end text-[9px] font-black uppercase tracking-widest text-white/50">
            <span>{cat.label}</span>
            <span className="text-white">{cat.percentage}%</span>
          </div>
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}></div>
          </div>
        </div>
      ))}
    </div>
  </div>
   )}   ;