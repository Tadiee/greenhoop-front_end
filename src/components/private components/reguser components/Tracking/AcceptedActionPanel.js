"use client"
import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  MapPin, Truck, AlertTriangle, CheckCircle2, X,
  QrCode, ChevronRight, ArrowLeft, Loader2, ShieldAlert,
  Maximize2, Download
} from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000';

// Fallback if backend doesn't return a token
function fallbackQRPayload(submitId) {
  return `GH-DROPOFF-${submitId}`;
}

function QRDisplay({ value, imageUrl, size = 180, submitId }) {
  // Resolve relative media URLs to absolute
  const resolvedImageUrl = imageUrl
    ? (imageUrl.startsWith('http') ? imageUrl : `${API_BASE}${imageUrl}`)
    : null;
  const [fullscreen, setFullscreen] = useState(false);

  const handleDownload = () => {
    if (resolvedImageUrl) {
      const a = document.createElement('a');
      a.href = resolvedImageUrl;
      a.download = `GreenHoop-QR-${submitId || value}.png`;
      a.target = '_blank';
      a.click();
      return;
    }
    const svg = document.querySelector('#gh-qr-svg');
    if (!svg) return;
    const serialised = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([serialised], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GreenHoop-QR-${submitId || value}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Fullscreen overlay */}
      {fullscreen && (
        <div
          className="fixed inset-0 z-[300] bg-black/95 flex flex-col items-center justify-center gap-6"
          onClick={() => setFullscreen(false)}
        >
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Tap anywhere to close</p>
          <div className="bg-white p-6 rounded-3xl">
            {resolvedImageUrl
              ? <img src={resolvedImageUrl} alt="Handover QR" width={280} height={280} className="block" />
              : <QRCodeSVG id="gh-qr-svg-full" value={value} size={280} level="H" includeMargin={false} />
            }
          </div>
          <p className="text-[10px] font-mono text-white/20 tracking-widest">{value}</p>
        </div>
      )}

      <div className="flex flex-col items-center gap-3">
        <div className="bg-white p-4 rounded-2xl">
          {resolvedImageUrl
            ? <img id="gh-qr-svg" src={resolvedImageUrl} alt="Handover QR" width={size} height={size} className="block" />
            : <QRCodeSVG id="gh-qr-svg" value={value} size={size} level="H" includeMargin={false} />
          }
        </div>
        <p className="text-[9px] font-mono text-white/30 tracking-widest">{value}</p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFullscreen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-white/50 hover:bg-white/10 transition-all"
          >
            <Maximize2 size={12} /> Fullscreen
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-white/50 hover:bg-white/10 transition-all"
          >
            <Download size={12} /> Save QR
          </button>
        </div>
      </div>
    </>
  );
}

// Maps to API action values exactly
const DECLINE_REASONS = [
  {
    key: 'cant_drop_off',
    label: 'I cannot reach the drop-off site',
    sub: 'The recycler will be notified and may arrange a courier for you. Your deal stays active.',
    isDangerous: false,
  },
  {
    key: 'cancel_deal',
    label: 'I want to cancel the deal entirely',
    sub: 'This will permanently release your claim. The submission returns to the dispatch pool for other recyclers.',
    isDangerous: true,
  },
];

export default function AcceptedActionPanel({ submission, onStatusChange }) {
  const [view, setView] = useState('CHOICE'); // CHOICE | CONFIRM_DROPOFF | QR | DECLINE_REASON | WITHDRAW_WARN | DONE_DECLINE
  const [selectedReason, setSelectedReason] = useState(null);
  const [cantDropOffReason, setCantDropOffReason] = useState('');
  const [withdrawConfirmed, setWithdrawConfirmed] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [qrPayload, setQrPayload] = useState(() => fallbackQRPayload(submission.submit_id));
  const [apiMessage, setApiMessage] = useState(null);
  const [actionError, setActionError] = useState(null);

  const assignedSite = submission.drop_off_site || submission.assigned_drop_off_site || null;

  const callRespondAPI = async (action, reason) => {
    const res = await fetch(
      `http://127.0.0.1:8000/recycler/drop-off-points/${submission.submit_id}/respond`,
      {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, reason: reason || undefined }),
      }
    );
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Request failed');
    return data;
  };

  const handleConfirmDropOff = async () => {
    setProcessing(true);
    setActionError(null);
    try {
      const data = await callRespondAPI('accept');
      // Use the real handover token from backend if provided
      if (data.handover_token) setQrPayload(data.handover_token);
      if (data.message) setApiMessage(data.message);
      setView('QR');
      if (onStatusChange) onStatusChange(submission.submit_id, 'in_transit');
    } catch (e) {
      setActionError(e.message || 'Could not confirm. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDecline = async () => {
    if (!selectedReason) return;
    const reason = DECLINE_REASONS.find(r => r.key === selectedReason);

    if (reason?.isDangerous && !withdrawConfirmed) {
      setView('WITHDRAW_WARN');
      return;
    }

    setProcessing(true);
    setActionError(null);
    try {
      const reasonText = reason?.isDangerous
        ? 'User cancelled the deal'
        : cantDropOffReason || 'User cannot reach the drop-off site';

      const data = await callRespondAPI(selectedReason, reasonText);
      if (data.message) setApiMessage(data.message);
      setView('DONE_DECLINE');
      if (onStatusChange) {
        onStatusChange(submission.submit_id, data.status || (reason?.isDangerous ? 'cancelled' : 'pending_courier'));
      }
    } catch (e) {
      setActionError(e.message || 'Could not process. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // ── CHOICE ──────────────────────────────────────────────────────────────────
  if (view === 'CHOICE') {
    return (
      <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <p className="text-xs font-black text-emerald-400 uppercase tracking-widest">Offer Accepted — Action Required</p>
        </div>
        <p className="text-[11px] text-white/50 leading-relaxed">
          The recycler has assigned a drop-off site for your device. Confirm you can deliver, or let them know if there's an issue.
        </p>

        {assignedSite && (
          <div className="flex items-start gap-3 p-3 bg-black/40 rounded-xl border border-white/5">
            <MapPin size={14} className="text-[#08CB00] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-white">{assignedSite.name}</p>
              <p className="text-[10px] text-white/40">{assignedSite.address}</p>
              {assignedSite.operating_hours && (
                <p className="text-[9px] text-white/25 mt-0.5">{assignedSite.operating_hours}</p>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2 pt-1">
          <button
            onClick={() => setView('CONFIRM_DROPOFF')}
            className="w-full flex items-center justify-between px-5 py-3.5 bg-[#08CB00] text-black rounded-xl text-[11px] font-black uppercase tracking-wider hover:bg-[#08CB00]/80 transition-all"
          >
            <span className="flex items-center gap-2"><Truck size={14} /> I can deliver to this site</span>
            <ChevronRight size={14} />
          </button>
          <button
            onClick={() => setView('DECLINE_REASON')}
            className="w-full flex items-center justify-between px-5 py-3.5 bg-white/5 border border-white/10 text-white/60 rounded-xl text-[11px] font-black uppercase tracking-wider hover:bg-white/10 transition-all"
          >
            <span className="flex items-center gap-2"><X size={14} /> I have an issue</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  // ── CONFIRM DROP-OFF ─────────────────────────────────────────────────────────
  if (view === 'CONFIRM_DROPOFF') {
    return (
      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-4">
        <button onClick={() => setView('CHOICE')} className="flex items-center gap-1 text-[10px] text-white/30 hover:text-white/60 transition-colors">
          <ArrowLeft size={12} /> Back
        </button>
        <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
          <AlertTriangle size={16} className="text-yellow-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-black text-yellow-400 mb-1">This action cannot be undone</p>
            <p className="text-[10px] text-white/50 leading-relaxed">
              Confirming will move this submission to <strong className="text-white">In Transit</strong> and generate a QR code. You must deliver the device within <strong className="text-white">48 hours</strong>. The recycler will be notified.
            </p>
          </div>
        </div>

        {assignedSite && (
          <div className="flex items-start gap-3 p-3 bg-black/40 rounded-xl border border-white/5">
            <MapPin size={14} className="text-[#08CB00] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-white">{assignedSite.name}</p>
              <p className="text-[10px] text-white/40">{assignedSite.address}</p>
            </div>
          </div>
        )}

        {actionError && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
            <AlertTriangle size={14} className="text-red-400" />
            <p className="text-[10px] font-bold text-red-400">{actionError}</p>
          </div>
        )}

        <button
          onClick={handleConfirmDropOff}
          disabled={processing}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#08CB00] text-black rounded-xl text-[11px] font-black uppercase tracking-wider hover:bg-[#08CB00]/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
          {processing ? 'Processing...' : 'Yes, I Confirm — Generate QR'}
        </button>
      </div>
    );
  }

  // ── QR CODE ──────────────────────────────────────────────────────────────────
  if (view === 'QR') {
    return (
      <div className="mt-4 rounded-2xl border border-[#08CB00]/20 bg-[#08CB00]/5 p-5 space-y-4">
        <div className="flex items-center gap-2">
          <QrCode size={16} className="text-[#08CB00]" />
          <p className="text-xs font-black text-[#08CB00] uppercase tracking-widest">Drop-off QR Code</p>
        </div>
        {apiMessage
          ? <p className="text-[11px] text-white/60 leading-relaxed">{apiMessage}</p>
          : <p className="text-[11px] text-white/50 leading-relaxed">Show this QR code to the receiver at the drop-off site. They will scan it to confirm receipt of your device.</p>
        }
        <div className="flex justify-center py-2">
          <QRDisplay
            value={qrPayload}
            imageUrl={submission.handover_qr_url}
            submitId={submission.submit_id}
          />
        </div>
        <div className="flex items-start gap-3 p-3 bg-black/40 rounded-xl border border-white/5">
          <CheckCircle2 size={14} className="text-[#08CB00] shrink-0 mt-0.5" />
          <p className="text-[10px] text-white/50 leading-relaxed">
            Status updated to <strong className="text-white">In Transit</strong>. Once the site receiver scans your QR, you'll get a confirmation notification.
          </p>
        </div>
      </div>
    );
  }

  // ── DECLINE REASON ───────────────────────────────────────────────────────────
  if (view === 'DECLINE_REASON') {
    return (
      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-4">
        <button onClick={() => setView('CHOICE')} className="flex items-center gap-1 text-[10px] text-white/30 hover:text-white/60 transition-colors">
          <ArrowLeft size={12} /> Back
        </button>
        <p className="text-xs font-black text-white">What is the issue?</p>
        <p className="text-[10px] text-white/40">Select a reason. The recycler will be notified unless you are fully withdrawing.</p>

        <div className="space-y-2">
          {DECLINE_REASONS.map(reason => (
            <button
              key={reason.key}
              onClick={() => setSelectedReason(reason.key)}
              className={`w-full flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
                selectedReason === reason.key
                  ? reason.isDangerous
                    ? 'bg-red-500/10 border-red-500/40'
                    : 'bg-white/10 border-white/30'
                  : 'bg-white/[0.02] border-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex-1">
                <p className={`text-xs font-bold ${reason.isDangerous ? 'text-red-400' : 'text-white/70'}`}>
                  {reason.label}
                </p>
                <p className="text-[9px] text-white/30 mt-0.5 leading-relaxed">{reason.sub}</p>
              </div>
              {reason.isDangerous
                ? <ShieldAlert size={14} className="text-red-400 shrink-0 mt-0.5" />
                : selectedReason === reason.key
                  ? <CheckCircle2 size={14} className="text-[#08CB00] shrink-0 mt-0.5" />
                  : null
              }
            </button>
          ))}
        </div>

        {selectedReason === 'cant_drop_off' && (
          <div className="space-y-1.5">
            <p className="text-[9px] font-black text-white/30 uppercase tracking-wider">Describe the issue (optional)</p>
            <textarea
              value={cantDropOffReason}
              onChange={e => setCantDropOffReason(e.target.value)}
              rows={2}
              placeholder="e.g. The site is too far from my location..."
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-[11px] text-white placeholder:text-white/20 outline-none focus:border-white/30 resize-none"
            />
          </div>
        )}

        {actionError && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
            <AlertTriangle size={14} className="text-red-400" />
            <p className="text-[10px] font-bold text-red-400">{actionError}</p>
          </div>
        )}

        <button
          onClick={handleDecline}
          disabled={!selectedReason || processing}
          className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
            selectedReason && DECLINE_REASONS.find(r => r.key === selectedReason)?.isDangerous
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-white/10 text-white hover:bg-white/15 border border-white/10'
          }`}
        >
          {processing ? <Loader2 size={14} className="animate-spin" /> : null}
          {processing ? 'Processing...' : selectedReason && DECLINE_REASONS.find(r => r.key === selectedReason)?.isDangerous ? 'Withdraw Submission' : 'Notify Recycler'}
        </button>
      </div>
    );
  }

  // ── WITHDRAW WARNING ─────────────────────────────────────────────────────────
  if (view === 'WITHDRAW_WARN') {
    return (
      <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/5 p-5 space-y-4">
        <button onClick={() => setView('DECLINE_REASON')} className="flex items-center gap-1 text-[10px] text-white/30 hover:text-white/60 transition-colors">
          <ArrowLeft size={12} /> Back
        </button>
        <div className="flex items-start gap-3">
          <ShieldAlert size={24} className="text-red-400 shrink-0" />
          <div>
            <p className="text-sm font-black text-red-400 mb-1">This cannot be reversed</p>
            <p className="text-[11px] text-white/50 leading-relaxed">
              Withdrawing will permanently cancel your claim on this submission. It will return to the dispatch pool for other recyclers. <strong className="text-white">You will not be able to reclaim it.</strong>
            </p>
          </div>
        </div>

        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={withdrawConfirmed}
            onChange={e => setWithdrawConfirmed(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-red-500 cursor-pointer"
          />
          <span className="text-[11px] text-white/50 group-hover:text-white/70 transition-colors leading-relaxed">
            I understand this is irreversible and want to withdraw my claim.
          </span>
        </label>

        {actionError && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
            <AlertTriangle size={14} className="text-red-400" />
            <p className="text-[10px] font-bold text-red-400">{actionError}</p>
          </div>
        )}

        <button
          onClick={handleDecline}
          disabled={!withdrawConfirmed || processing}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-red-500 text-white rounded-xl text-[11px] font-black uppercase tracking-wider hover:bg-red-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {processing ? <Loader2 size={14} className="animate-spin" /> : <ShieldAlert size={14} />}
          {processing ? 'Withdrawing...' : 'Confirm Withdrawal'}
        </button>
      </div>
    );
  }

  // ── DONE DECLINE ─────────────────────────────────────────────────────────────
  if (view === 'DONE_DECLINE') {
    const reason = DECLINE_REASONS.find(r => r.key === selectedReason);
    const isCancelled = reason?.isDangerous;
    const defaultMsg = isCancelled
      ? 'Your claim has been released. The submission has returned to the dispatch pool for other recyclers.'
      : 'The recycler has been notified. They will arrange a courier pickup for you — your deal is still active. Check back for updates.';
    return (
      <div className={`mt-4 rounded-2xl border p-5 space-y-3 ${isCancelled ? 'border-red-500/20 bg-red-500/5' : 'border-blue-500/20 bg-blue-500/5'}`}>
        <div className="flex items-center gap-2">
          {isCancelled
            ? <ShieldAlert size={16} className="text-red-400" />
            : <Truck size={16} className="text-blue-400" />}
          <p className={`text-xs font-black uppercase tracking-widest ${isCancelled ? 'text-red-400' : 'text-blue-400'}`}>
            {isCancelled ? 'Deal Cancelled' : 'Courier Pickup Requested'}
          </p>
        </div>
        <p className="text-[11px] text-white/50 leading-relaxed">
          {apiMessage || defaultMsg}
        </p>
      </div>
    );
  }

  return null;
}
