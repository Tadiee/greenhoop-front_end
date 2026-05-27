"use client"
import React, { useState } from 'react';
import { Filter, Box, Search, Loader2 } from 'lucide-react';

const STATUS_STYLE = {
  completed:       { label: 'Completed',  cls: 'bg-[#08CB00]/10 border-[#08CB00]/20 text-[#08CB00]' },
  in_transit:      { label: 'In Transit', cls: 'bg-blue-500/10 border-blue-500/20 text-blue-400' },
  accepted:        { label: 'Accepted',   cls: 'bg-purple-500/10 border-purple-500/20 text-purple-400' },
  pending_pickup:  { label: 'Pending',    cls: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' },
};

export default function MaterialRoster({ submissions = [], loading }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = submissions.filter(s => {
    const matchQ = !query || [s.submit_id, s.brand_n_model, s.category, s.user_name]
      .join(' ').toLowerCase().includes(query.toLowerCase());
    const matchF = filter === 'all' || s.status === filter;
    return matchQ && matchF;
  });

  return (
    <div className="bg-[#1A1A1A] border border-white/5 rounded-[40px] shadow-2xl flex flex-col overflow-hidden">
      <div className="p-6 md:p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h3 className="text-xl font-black text-white tracking-tight">Active Roster</h3>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="bg-black/50 border border-white/10 flex items-center gap-2 px-4 py-2 rounded-xl flex-1 md:w-64">
            <Search size={14} className="text-white/40 shrink-0" />
            <input
              type="text" value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search ID, item, user..."
              className="bg-transparent border-none text-[11px] font-bold text-white placeholder-white/30 focus:outline-none w-full"
            />
          </div>
          <select
            value={filter} onChange={e => setFilter(e.target.value)}
            className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/60 focus:outline-none hover:bg-white/10 transition-all cursor-pointer appearance-none"
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="in_transit">In Transit</option>
            <option value="pending_pickup">Pending</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-black/20">
              <th className="p-5 pl-8 text-[9px] font-black uppercase text-white/30 tracking-widest">Submission / Item</th>
              <th className="p-5 text-[9px] font-black uppercase text-white/30 tracking-widest">User</th>
              <th className="p-5 text-[9px] font-black uppercase text-white/30 tracking-widest">Weight</th>
              <th className="p-5 text-[9px] font-black uppercase text-white/30 tracking-widest">Courier</th>
              <th className="p-5 text-[9px] font-black uppercase text-white/30 tracking-widest">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan={5} className="py-12 text-center">
                <div className="flex items-center justify-center gap-2">
                  <Loader2 size={14} className="text-[#08CB00] animate-spin" />
                  <span className="text-[10px] text-white/30">Loading submissions...</span>
                </div>
              </td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="py-12 text-center text-[10px] text-white/20 uppercase tracking-widest">
                No submissions found
              </td></tr>
            ) : filtered.map((s, i) => {
              const style = STATUS_STYLE[s.status] || { label: s.status, cls: 'bg-white/5 border-white/10 text-white/40' };
              return (
                <tr key={s.submit_id || i} className="hover:bg-white/5 transition-colors group cursor-pointer">
                  <td className="p-5 pl-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#08CB00] group-hover:bg-[#08CB00]/10 transition-colors shrink-0">
                        <Box size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-white tracking-tight">#{s.submit_id}</p>
                        <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest mt-0.5">{s.brand_n_model || s.category || '—'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <p className="text-xs font-bold text-white/80">{s.user_name || '—'}</p>
                  </td>
                  <td className="p-5">
                    <span className="bg-white/5 px-2 py-1 rounded-md text-[10px] font-black text-white tracking-widest border border-white/10">
                      {s.estimated_weight ? `${s.estimated_weight} kg` : '—'}
                    </span>
                  </td>
                  <td className="p-5">
                    <p className="text-xs font-bold text-white/50">{s.courier || '—'}</p>
                  </td>
                  <td className="p-5">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${style.cls}`}>
                      {style.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}