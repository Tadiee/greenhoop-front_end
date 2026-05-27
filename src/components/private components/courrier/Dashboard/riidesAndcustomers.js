import { TrendingUp, Package } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const FALLBACK_CHART = [
  { name: 'Mon', value: 0 }, { name: 'Tue', value: 0 }, { name: 'Wed', value: 0 },
  { name: 'Thu', value: 0 }, { name: 'Fri', value: 0 }, { name: 'Sat', value: 0 },
  { name: 'Sun', value: 0 },
];

const STATUS_COLOR = {
  in_transit: 'text-[#08CB00]',
  completed:  'text-white/30',
  pending:    'text-white/50',
  accepted:   'text-blue-400',
};

export default function RiidesAndCustomers({ jobs = [], stats = {}, loading }) {
    const totalRidesData = stats.rides_series || FALLBACK_CHART;
    const totalRides = stats.completed_today ?? 0;

  return (
    <>
      {/* Deliveries chart */}
      <div className="bg-[#121212] border border-white/5 rounded-[40px] p-6 flex flex-col shadow-2xl relative group min-h-0">
        <div className="flex justify-between items-center mb-4 shrink-0">
          <div>
            <h3 className="text-[9px] font-black uppercase tracking-widest text-white/30">Completed Today</h3>
            <p className="text-2xl font-black italic mt-0.5">{loading ? '—' : totalRides} <span className="text-[11px] text-[#08CB00]">deliveries</span></p>
          </div>
          <TrendingUp size={18} className="text-white/20" />
        </div>
        <div className="flex-1 relative z-10 min-h-[120px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={totalRidesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 9, fontWeight: 'bold' }} />
              <YAxis hide />
              <Tooltip contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }} />
              <Line type="monotone" dataKey="value" stroke="#08CB00" strokeWidth={2.5} dot={{ r: 3, fill: '#08CB00', strokeWidth: 2, stroke: '#0A0A0A' }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Active Jobs list */}
      <div className="bg-[#121212] border border-white/10 rounded-[40px] p-6 flex flex-col shadow-xl h-full relative overflow-hidden group min-h-0">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#08CB00]/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="flex justify-between items-center mb-4 shrink-0 relative z-10">
          <div>
            <h3 className="text-[9px] font-black uppercase tracking-widest text-[#08CB00] mb-0.5">Live Queue</h3>
            <h2 className="text-lg font-black text-white tracking-tighter">Active <span className="text-white/30">Jobs</span></h2>
          </div>
          <span className="text-[9px] font-black px-2.5 py-1 bg-[#08CB00]/10 border border-[#08CB00]/20 text-[#08CB00] rounded-full">{jobs.length} jobs</span>
        </div>
        <div className="flex-1 space-y-2 overflow-y-auto scrollbar-none relative z-10">
          {loading ? (
            <p className="text-center text-[10px] text-white/20 py-6">Loading...</p>
          ) : jobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <Package size={24} className="text-white/10" />
              <p className="text-[10px] text-white/20">No active jobs</p>
            </div>
          ) : jobs.map((j, i) => (
            <div key={j.submit_id || i} className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-white/15 transition-all">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <Package size={12} className="text-white/30" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-white truncate">{j.brand_n_model || `Job #${j.submit_id}`}</p>
                  <p className="text-[8px] text-white/30">{j.pay || ''}</p>
                </div>
              </div>
              <span className={`text-[8px] font-black uppercase shrink-0 ml-2 ${STATUS_COLOR[j.status] || 'text-white/40'}`}>
                {j.status?.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}