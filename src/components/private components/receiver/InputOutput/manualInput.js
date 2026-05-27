"use client"
import React, { useState } from 'react';
import { Hash, Search, CheckCircle2, XCircle, Loader2, Package, User, Weight } from 'lucide-react';

const API = 'http://127.0.0.1:8000';

export default function ManualInputComp({ onConfirmed }) {
  const [submitId, setSubmitId]         = useState('');
  const [submission, setSubmission]     = useState(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [error, setError]               = useState('');
  const [success, setSuccess]           = useState(false);

  const lookup = async (e) => {
    e.preventDefault();
    if (!submitId.trim()) return;
    setLookupLoading(true); setError(''); setSubmission(null);
    try {
      const res = await fetch(`${API}/receiver/submission/${submitId.trim()}`, { credentials: 'include' });
      if (!res.ok) { setError(`No submission found for ID "${submitId}".`); return; }
      const data = await res.json();
      setSubmission(data.submission || data);
    } catch { setError('Network error. Please try again.'); }
    finally { setLookupLoading(false); }
  };

  const confirmReceipt = async () => {
    if (!submission) return;
    setConfirmLoading(true); setError('');
    try {
      const res = await fetch(`${API}/receiver/submission/${submission.submit_id}/complete`, {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submit_id: submission.submit_id }),
      });
      if (!res.ok) { setError('Failed to confirm receipt.'); return; }
      setSuccess(true);
      onConfirmed && onConfirmed(submission);
      setTimeout(() => { setSubmission(null); setSubmitId(''); setSuccess(false); }, 3000);
    } catch { setError('Network error. Please try again.'); }
    finally { setConfirmLoading(false); }
  };

  return (
    <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-[#1A1A1A] border border-white/5 rounded-[32px] p-6 shadow-2xl flex flex-col hover:border-white/10 transition-all">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
          <Hash size={18} className="text-white/60" />
        </div>
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">Manual Lookup</h2>
          <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-0.5">QR not working? Enter ID</p>
        </div>
      </div>

      {success ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-[#08CB00]/5 border border-[#08CB00]/20 rounded-[24px] p-8">
          <CheckCircle2 size={44} className="text-[#08CB00]" />
          <p className="text-sm font-black text-[#08CB00] uppercase tracking-wider text-center">Receipt Confirmed!</p>
          <p className="text-[10px] text-white/40 text-center">Status set to COMPLETED</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-4">
          {/* Search form */}
          <form onSubmit={lookup} className="flex gap-2">
            <input
              type="text" value={submitId} onChange={e => setSubmitId(e.target.value)}
              placeholder="Enter Submission ID..."
              className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white placeholder-white/20 focus:outline-none focus:border-[#08CB00] transition-colors"
            />
            <button type="submit" disabled={lookupLoading || !submitId.trim()}
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/50 hover:bg-white/10 hover:text-white transition-all disabled:opacity-40">
              {lookupLoading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            </button>
          </form>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
              <XCircle size={13} className="text-red-400 shrink-0" />
              <p className="text-[10px] text-red-400 font-bold">{error}</p>
            </div>
          )}

          {submission && (
            <div className="flex-1 flex flex-col gap-3">
              <div className="bg-black/40 border border-[#08CB00]/20 rounded-[20px] p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-[#08CB00]" />
                  <span className="text-[9px] font-black text-[#08CB00] uppercase tracking-widest">Submission Found</span>
                </div>
                <div className="flex items-center gap-3">
                  <Package size={13} className="text-white/30 shrink-0" />
                  <div>
                    <p className="text-[9px] text-white/30 uppercase tracking-widest">Item</p>
                    <p className="text-sm font-black text-white">{submission.brand_n_model || '—'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User size={13} className="text-white/30 shrink-0" />
                  <div>
                    <p className="text-[9px] text-white/30 uppercase tracking-widest">User</p>
                    <p className="text-sm font-black text-white">{submission.user_name || submission.user_id || '—'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Weight size={13} className="text-white/30 shrink-0" />
                  <div>
                    <p className="text-[9px] text-white/30 uppercase tracking-widest">Est. Weight</p>
                    <p className="text-sm font-black text-white">{submission.estimated_weight ? `${submission.estimated_weight} kg` : '—'}</p>
                  </div>
                </div>
                <div className="pt-1 border-t border-white/5">
                  <span className="text-[9px] font-black uppercase px-2 py-1 rounded-md bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
                    {submission.status?.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mt-auto">
                <button onClick={() => { setSubmission(null); setSubmitId(''); setError(''); }}
                  className="flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 transition-all">
                  Clear
                </button>
                <button onClick={confirmReceipt} disabled={confirmLoading}
                  className="flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider bg-[#08CB00] text-black hover:bg-[#07b300] transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                  {confirmLoading ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
                  Confirm
                </button>
              </div>
            </div>
          )}

          {!submission && !error && (
            <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center">
              <Hash size={32} className="text-white/10" />
              <p className="text-[10px] text-white/20 uppercase tracking-widest">Enter a submission ID<br/>to look up the handover</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}