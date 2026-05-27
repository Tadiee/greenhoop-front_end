"use client"
import React, { useState } from 'react';
import {
  CheckCircle2, X, Wrench, Mail, Phone,
  AlertTriangle, Loader2, ShieldAlert, ArrowLeft, User
} from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000';

export default function TechnicianAcceptedPanel({ submission, onStatusChange }) {
  const [view, setView]           = useState('CHOICE'); // CHOICE | CONFIRM | CANCEL_WARN | DONE
  const [processing, setProcessing] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [cancelConfirmed, setCancelConfirmed] = useState(false);

  const tech = submission.technician || submission.accepted_by || null;

  const callAPI = async (action) => {
    const res = await fetch(
      `${API_BASE}/technician/purchase/${submission.submit_id}/respond`,
      {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, reason: action === 'cancel_deal' ? 'Seller declined the technician purchase' : undefined }),
      }
    );
    const data = await res.json().catch(() => ({}));
    if (!data.success) throw new Error(data.message || 'Request failed');
    return data;
  };

  const handleConfirm = async () => {
    setProcessing(true);
    setActionError(null);
    try {
      const data = await callAPI('accept');
      if (onStatusChange) onStatusChange(submission.submit_id, data.status || 'USER_CONFIRMED');
      setView('DONE');
    } catch (e) {
      setActionError(e.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (!cancelConfirmed) return;
    setProcessing(true);
    setActionError(null);
    try {
      const data = await callAPI('cancel_deal');
      if (onStatusChange) onStatusChange(submission.submit_id, data.status || 'cancelled');
      setView('DONE');
    } catch (e) {
      setActionError(e.message);
    } finally {
      setProcessing(false);
    }
  };

  // ── CHOICE ───────────────────────────────────────────────────────────────────
  if (view === 'CHOICE') {
    return (
      <div className="mt-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Wrench size={15} className="text-blue-400" />
          <p className="text-xs font-black text-blue-400 uppercase tracking-widest">Technician Pickup — Your Approval Needed</p>
        </div>
        <p className="text-[11px] text-white/50 leading-relaxed">
          A technician has accepted your submission for pickup. Review their details below and confirm if you are happy to proceed, or cancel the deal.
        </p>

        {/* Technician details card */}
        <div className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
              <User size={18} className="text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-white truncate">
                {tech?.username || 'Technician'}
              </p>
              {tech?.expertise && (
                <p className="text-[9px] text-white/30 truncate">{tech.expertise}</p>
              )}
            </div>
            {tech?.rating != null && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20">
                <span className="text-[9px] font-black text-yellow-400">★ {Number(tech.rating).toFixed(1)}</span>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            {tech?.phone && (
              <div className="flex items-center gap-2 text-[10px] text-white/40">
                <Phone size={11} className="text-white/20 shrink-0" />
                <span>{tech.phone}</span>
              </div>
            )}
            {tech?.email && (
              <div className="flex items-center gap-2 text-[10px] text-white/40">
                <Mail size={11} className="text-white/20 shrink-0" />
                <span className="truncate">{tech.email}</span>
              </div>
            )}
          </div>
        </div>

        {actionError && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
            <AlertTriangle size={13} className="text-red-400 shrink-0" />
            <p className="text-[10px] font-bold text-red-400">{actionError}</p>
          </div>
        )}

        <div className="flex flex-col gap-2 pt-1">
          <button onClick={() => setView('CONFIRM')}
            className="w-full flex items-center justify-between px-5 py-3.5 bg-[#08CB00] text-black rounded-xl text-[11px] font-black uppercase tracking-wider hover:bg-[#08CB00]/80 transition-all">
            <span className="flex items-center gap-2"><CheckCircle2 size={14} /> Yes, I'm happy — Proceed</span>
          </button>
          <button onClick={() => setView('CANCEL_WARN')}
            className="w-full flex items-center justify-between px-5 py-3.5 bg-white/5 border border-white/10 text-white/60 rounded-xl text-[11px] font-black uppercase tracking-wider hover:bg-white/10 transition-all">
            <span className="flex items-center gap-2"><X size={14} /> No, cancel the deal</span>
          </button>
        </div>
      </div>
    );
  }

  // ── CONFIRM ──────────────────────────────────────────────────────────────────
  if (view === 'CONFIRM') {
    return (
      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-4">
        <button onClick={() => setView('CHOICE')} className="flex items-center gap-1 text-[10px] text-white/30 hover:text-white/60 transition-colors">
          <ArrowLeft size={12} /> Back
        </button>
        <div className="flex items-start gap-3 p-4 bg-[#08CB00]/10 border border-[#08CB00]/20 rounded-xl">
          <CheckCircle2 size={16} className="text-[#08CB00] shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-black text-[#08CB00] mb-1">Confirm Technician Pickup</p>
            <p className="text-[10px] text-white/50 leading-relaxed">
              The technician will be notified that you have approved the pickup. They will then proceed to finalize the purchase and arrange collection.
            </p>
          </div>
        </div>
        {actionError && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
            <AlertTriangle size={13} className="text-red-400 shrink-0" />
            <p className="text-[10px] font-bold text-red-400">{actionError}</p>
          </div>
        )}
        <button onClick={handleConfirm} disabled={processing}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#08CB00] text-black rounded-xl text-[11px] font-black uppercase tracking-wider hover:bg-[#08CB00]/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
          {processing ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
          {processing ? 'Confirming...' : 'Confirm — Notify Technician'}
        </button>
      </div>
    );
  }

  // ── CANCEL WARNING ────────────────────────────────────────────────────────────
  if (view === 'CANCEL_WARN') {
    return (
      <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/5 p-5 space-y-4">
        <button onClick={() => setView('CHOICE')} className="flex items-center gap-1 text-[10px] text-white/30 hover:text-white/60 transition-colors">
          <ArrowLeft size={12} /> Back
        </button>
        <div className="flex items-start gap-3">
          <ShieldAlert size={22} className="text-red-400 shrink-0" />
          <div>
            <p className="text-sm font-black text-red-400 mb-1">Cancel this deal?</p>
            <p className="text-[11px] text-white/50 leading-relaxed">
              Cancelling will release the technician's claim. Your submission will return to the pool for other technicians. <strong className="text-white">This cannot be undone.</strong>
            </p>
          </div>
        </div>
        <label className="flex items-start gap-3 cursor-pointer group">
          <input type="checkbox" checked={cancelConfirmed} onChange={e => setCancelConfirmed(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-red-500 cursor-pointer" />
          <span className="text-[11px] text-white/50 group-hover:text-white/70 transition-colors leading-relaxed">
            I understand this is irreversible and want to cancel the deal.
          </span>
        </label>
        {actionError && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
            <AlertTriangle size={13} className="text-red-400 shrink-0" />
            <p className="text-[10px] font-bold text-red-400">{actionError}</p>
          </div>
        )}
        <button onClick={handleCancel} disabled={!cancelConfirmed || processing}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-red-500 text-white rounded-xl text-[11px] font-black uppercase tracking-wider hover:bg-red-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
          {processing ? <Loader2 size={14} className="animate-spin" /> : <ShieldAlert size={14} />}
          {processing ? 'Cancelling...' : 'Confirm Cancellation'}
        </button>
      </div>
    );
  }

  // ── DONE ─────────────────────────────────────────────────────────────────────
  if (view === 'DONE') {
    const confirmed = cancelConfirmed === false;
    return (
      <div className={`mt-4 rounded-2xl border p-5 space-y-3 ${confirmed ? 'border-[#08CB00]/20 bg-[#08CB00]/5' : 'border-red-500/20 bg-red-500/5'}`}>
        <div className="flex items-center gap-2">
          {confirmed
            ? <CheckCircle2 size={16} className="text-[#08CB00]" />
            : <ShieldAlert size={16} className="text-red-400" />}
          <p className={`text-xs font-black uppercase tracking-widest ${confirmed ? 'text-[#08CB00]' : 'text-red-400'}`}>
            {confirmed ? 'Technician Notified' : 'Deal Cancelled'}
          </p>
        </div>
        <p className="text-[11px] text-white/50 leading-relaxed">
          {confirmed
            ? 'The technician has been notified of your approval and will proceed with the purchase and collection.'
            : 'Your submission has been returned to the dispatch pool for other technicians.'}
        </p>
      </div>
    );
  }

  return null;
}
