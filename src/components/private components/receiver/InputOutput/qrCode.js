"use client"
import React, { useState, useEffect, useRef } from 'react';
import { QrCode, ScanLine, CheckCircle2, XCircle, Loader2, Package, User, Weight } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

const API = 'http://127.0.0.1:8000';
const SCANNER_ID = 'qr-reader-receiver';

export default function QrCodeComp({ onConfirmed }) {
  const [scannerActive, setScannerActive] = useState(false);
  const [submission, setSubmission]       = useState(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [error, setError]                 = useState('');
  const [success, setSuccess]             = useState(false);
  const scannerRef = useRef(null);

  const stopScanner = async () => {
    if (scannerRef.current) {
      try { await scannerRef.current.stop(); } catch {}
      scannerRef.current = null;
    }
    setScannerActive(false);
  };

  const startScanner = async () => {
    setError(''); setSubmission(null); setSuccess(false);
    setScannerActive(true);
    await new Promise(r => setTimeout(r, 100));
    const scanner = new Html5Qrcode(SCANNER_ID);
    scannerRef.current = scanner;
    try {
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        async (decodedText) => {
          await stopScanner();
          await lookupSubmission(decodedText.trim());
        },
        () => {}
      );
    } catch {
      setError('Camera access denied or unavailable.');
      setScannerActive(false);
    }
  };

  const lookupSubmission = async (submitId) => {
    setLookupLoading(true); setError('');
    try {
      const res = await fetch(`${API}/receiver/submission/${submitId}`, { credentials: 'include' });
      if (!res.ok) { setError(`Submission "${submitId}" not found.`); return; }
      const data = await res.json();
      setSubmission(data.submission || data);
    } catch {
      setError('Network error. Please try again.');
    } finally { setLookupLoading(false); }
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
      if (!res.ok) { setError('Failed to confirm receipt. Try again.'); return; }
      setSuccess(true);
      onConfirmed && onConfirmed(submission);
      setTimeout(() => { setSubmission(null); setSuccess(false); }, 3000);
    } catch {
      setError('Network error. Please try again.');
    } finally { setConfirmLoading(false); }
  };

  useEffect(() => () => { stopScanner(); }, []);

  return (
    <div className="col-span-12 lg:col-span-4 bg-[#1A1A1A] border border-white/5 rounded-[32px] p-6 shadow-2xl flex flex-col relative overflow-hidden group hover:border-[#08CB00]/30 transition-all">
      <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#08CB00]/5 rounded-full blur-[60px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-5 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-[#08CB00]/10 flex items-center justify-center">
          <QrCode size={18} className="text-[#08CB00]" />
        </div>
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">QR Drop-off Scan</h2>
          <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-0.5">Scan user's handover code</p>
        </div>
      </div>

      {/* Success state */}
      {success ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-[#08CB00]/5 border border-[#08CB00]/20 rounded-[24px] p-8">
          <CheckCircle2 size={48} className="text-[#08CB00]" />
          <p className="text-base font-black text-[#08CB00] uppercase tracking-wider text-center">Receipt Confirmed!</p>
          <p className="text-[10px] text-white/40 text-center">Status set to COMPLETED</p>
        </div>
      ) : submission ? (
        /* Submission details + confirm */
        <div className="flex-1 flex flex-col gap-4 relative z-10">
          <div className="bg-black/40 border border-[#08CB00]/20 rounded-[20px] p-4 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 size={14} className="text-[#08CB00]" />
              <span className="text-[9px] font-black text-[#08CB00] uppercase tracking-widest">Submission Found</span>
            </div>
            <div className="flex items-center gap-3">
              <Package size={14} className="text-white/30 shrink-0" />
              <div>
                <p className="text-[9px] text-white/30 uppercase tracking-widest">Item</p>
                <p className="text-sm font-black text-white">{submission.brand_n_model || '—'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <User size={14} className="text-white/30 shrink-0" />
              <div>
                <p className="text-[9px] text-white/30 uppercase tracking-widest">User</p>
                <p className="text-sm font-black text-white">{submission.user_name || submission.user_id || '—'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Weight size={14} className="text-white/30 shrink-0" />
              <div>
                <p className="text-[9px] text-white/30 uppercase tracking-widest">Est. Weight</p>
                <p className="text-sm font-black text-white">{submission.estimated_weight ? `${submission.estimated_weight} kg` : '—'}</p>
              </div>
            </div>
            <div className="pt-1 border-t border-white/5">
              <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
                {submission.status?.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          {error && <p className="text-[10px] text-red-400 font-bold text-center">{error}</p>}

          <div className="mt-auto flex gap-2">
            <button onClick={() => { setSubmission(null); setError(''); }}
              className="flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 transition-all">
              Cancel
            </button>
            <button onClick={confirmReceipt} disabled={confirmLoading}
              className="flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider bg-[#08CB00] text-black hover:bg-[#07b300] transition-all flex items-center justify-center gap-2 disabled:opacity-60">
              {confirmLoading ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
              Confirm Receipt
            </button>
          </div>
        </div>
      ) : (
        /* Scanner / idle state */
        <div className="flex-1 flex flex-col gap-4 relative z-10">
          <div id={SCANNER_ID} className={`rounded-[20px] overflow-hidden bg-black border-2 transition-colors ${scannerActive ? 'border-[#08CB00]/50' : 'border-dashed border-white/10'}`} style={{ minHeight: '220px' }}>
            {!scannerActive && (
              <div className="flex flex-col items-center justify-center h-[220px] gap-3">
                <QrCode size={40} className="text-white/20" />
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Scanner Offline</p>
              </div>
            )}
          </div>

          {lookupLoading && (
            <div className="flex items-center justify-center gap-2 py-2">
              <Loader2 size={14} className="text-[#08CB00] animate-spin" />
              <span className="text-[10px] text-white/40">Looking up submission...</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
              <XCircle size={14} className="text-red-400 shrink-0" />
              <p className="text-[10px] text-red-400 font-bold">{error}</p>
            </div>
          )}

          <button onClick={scannerActive ? stopScanner : startScanner}
            className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
              scannerActive ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
                           : 'bg-[#08CB00] text-black hover:bg-[#07b300] shadow-[0_0_15px_rgba(8,203,0,0.2)]'}`}>
            {scannerActive ? <><XCircle size={14} /> Stop Scanner</> : <><ScanLine size={14} /> Activate Scanner</>}
          </button>
        </div>
      )}
    </div>
  );
}