"use client"
import React, { useState, useEffect } from 'react';
import { ScanLine, ListOrdered, Maximize, Minimize, Loader2, User, Clock } from 'lucide-react';

const API = 'http://127.0.0.1:8000';

export default function OperationalLedger({ refreshTrigger }) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLedger = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API}/receiver/ledger`, { credentials: 'include' });
        if (res.ok) { const d = await res.json(); setTransactions(d.ledger || d.transactions || []); }
      } catch {}
      finally { setLoading(false); }
    };
    fetchLedger();
  }, [refreshTrigger]);

  const bgClass = isFullScreen ? 'bg-[#121212]' : 'bg-[#1A1A1A]';

  const tableContent = (
    <table className="w-full text-left border-collapse min-w-[600px]">
      <thead>
        <tr className={`border-b border-white/5 sticky top-0 z-10 ${bgClass}`}>
          <th className="pb-4 pl-4 text-[9px] font-black uppercase text-white/30 tracking-widest">#</th>
          <th className="pb-4 text-[9px] font-black uppercase text-white/30 tracking-widest">Handed Over By</th>
          <th className="pb-4 text-[9px] font-black uppercase text-white/30 tracking-widest">Time</th>
          <th className="pb-4 text-[9px] font-black uppercase text-white/30 tracking-widest">Handover Token</th>
          <th className="pb-4 text-[9px] font-black uppercase text-white/30 tracking-widest">Weight</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/5">
        {loading ? (
          <tr><td colSpan={5} className="py-10 text-center">
            <div className="flex items-center justify-center gap-2">
              <Loader2 size={14} className="text-[#08CB00] animate-spin" />
              <span className="text-[10px] text-white/30">Loading activity...</span>
            </div>
          </td></tr>
        ) : transactions.length === 0 ? (
          <tr><td colSpan={5} className="py-10 text-center text-[10px] text-white/20 uppercase tracking-widest">No handovers confirmed this shift</td></tr>
        ) : transactions.map((txn, i) => (
          <tr key={txn.submit_id || i} className="hover:bg-white/5 transition-colors">
            <td className="py-4 pl-4">
              <span className="text-[10px] font-black text-white/30 bg-white/5 border border-white/10 px-2 py-1 rounded-md">
                {transactions.length - i}
              </span>
            </td>
            <td className="py-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <User size={12} className="text-white/40" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{txn.user_name || '—'}</p>
                  <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">#{txn.submit_id}</p>
                </div>
              </div>
            </td>
            <td className="py-4">
              <div className="flex items-center gap-1.5">
                <Clock size={10} className="text-white/30" />
                <span className="text-[10px] font-bold text-white/50">{txn.time_ago || '—'}</span>
              </div>
            </td>
            <td className="py-4">
              {txn.handover_token ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border bg-[#08CB00]/10 border-[#08CB00]/20 text-[#08CB00]">
                  <ScanLine size={9} /> {txn.handover_token.slice(0, 14)}{txn.handover_token.length > 14 ? '…' : ''}
                </span>
              ) : (
                <span className="text-[9px] text-white/20 uppercase tracking-widest">Manual</span>
              )}
            </td>
            <td className="py-4">
              <span className="text-xs font-black text-white/70">
                {txn.estimated_weight ? `${txn.estimated_weight} kg` : '—'}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="relative z-10 mt-6 bg-[#1A1A1A] border border-white/5 rounded-[32px] p-6 md:p-8 shadow-2xl flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-3">
          <ListOrdered size={18} className="text-[#08CB00]" /> Handover Ledger
        </h3>
        <button onClick={() => setIsFullScreen(v => !v)}
          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-colors ${
            isFullScreen ? 'bg-[#08CB00] text-black hover:bg-[#07b300]' : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/5'}`}>
          {isFullScreen ? <><Minimize size={14} /> Exit Full Screen</> : <><Maximize size={14} /> Expand View</>}
        </button>
      </div>

      {isFullScreen ? (
        <div className="fixed inset-0 z-[100] bg-[#121212] p-6 md:p-10 flex flex-col overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-3">
              <ListOrdered size={18} className="text-[#08CB00]" /> Handover Ledger
            </h3>
            <button onClick={() => setIsFullScreen(false)}
              className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 bg-[#08CB00] text-black hover:bg-[#07b300]">
              <Minimize size={14} /> Exit Full Screen
            </button>
          </div>
          <div className="flex-1 overflow-x-auto">{tableContent}</div>
        </div>
      ) : (
        <div className="overflow-x-auto">{tableContent}</div>
      )}
    </div>
  );
}