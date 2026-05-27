import { Truck } from 'lucide-react';

export default function FleetCount({ fleetStats = {}, loading }) {
  const total = fleetStats.total_vehicles || 0;
  const bars = [
    { l: 'Active',      v: fleetStats.active      ?? 0, c: 'bg-[#08CB00]' },
    { l: 'Inactive',    v: fleetStats.inactive     ?? 0, c: 'bg-white/20' },
    { l: 'Maintenance', v: fleetStats.maintenance  ?? 0, c: 'bg-yellow-500' },
  ];

  return (
    <div className="bg-[#121212] border border-white/5 rounded-[40px] p-6 shadow-xl shrink-0">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h3 className="text-[9px] font-black uppercase tracking-widest text-white/30">Fleet Sentinel</h3>
          <p className="text-xl font-black text-white mt-0.5">{loading ? '—' : total} <span className="text-[10px] text-white/20 font-bold">Vehicles</span></p>
        </div>
        <div className="w-9 h-9 rounded-xl bg-[#08CB00]/10 border border-[#08CB00]/20 flex items-center justify-center">
          <Truck size={16} className="text-[#08CB00]" />
        </div>
      </div>
      <div className="space-y-4">
        {bars.map(b => {
          const pct = total > 0 ? Math.round((b.v / total) * 100) : 0;
          return (
            <div key={b.l} className="space-y-1.5">
              <div className="flex justify-between text-[9px] font-black uppercase text-white/40">
                <span>{b.l}</span>
                <span className="font-mono">{loading ? '—' : `${b.v}/${total}`}</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div style={{ width: loading ? '0%' : `${pct}%` }} className={`h-full rounded-full transition-all duration-700 ${b.c}`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}