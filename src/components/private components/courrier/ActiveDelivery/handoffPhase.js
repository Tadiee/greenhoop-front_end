"use client"
import React, { useEffect, useRef, useState } from 'react';
import { Building2, QrCode, CheckCircle2, XCircle, ShieldCheck, PartyPopper, ChevronRight, DollarSign } from 'lucide-react';

export default function HandoffPhase({ job, onComplete }) {
  const scannerInstance = useRef(null);
  const [status, setStatus] = useState('idle'); // idle | scanning | success | error | done
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const startScan = async () => {
    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      const scanner = new Html5Qrcode('qr-hub-reader');
      scannerInstance.current = scanner;
      setStatus('scanning');
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        async (decodedText) => {
          await scanner.stop().catch(() => {});
          setStatus('success');
          await completeHandoff(decodedText);
        },
        () => {}
      );
    } catch (err) {
      setStatus('error');
      setErrorMsg(err?.message || 'Camera access denied');
    }
  };

  const completeHandoff = async (qrData) => {
    setSubmitting(true);
    try {
      const submitId = job?.submit_id || String(job?.id || '').replace('JOB-', '');
      const res = await fetch(`http://127.0.0.1:8000/courier/jobs/${submitId}/handoff`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hub_qr: qrData }),
      });
      const data = await res.json().catch(() => ({}));
      setStatus('done');
      onComplete?.({ success: res.ok, data });
    } catch {
      setStatus('done');
      onComplete?.({ success: false });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    return () => { scannerInstance.current?.stop().catch(() => {}); };
  }, []);

  return (
    <div className="h-full flex flex-col min-h-0">
      {/* Header */}
      <div className="shrink-0 p-5 bg-[#1A1A1A] border-b border-white/5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center">
          <Building2 size={18} className="text-blue-400" />
        </div>
        <div>
          <h2 className="text-white font-black tracking-tight">Hub Handoff</h2>
          <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest mt-0.5">
            Scan hub QR code to confirm delivery
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-6 p-6 min-h-0">

        {status === 'done' ? (
          /* Completion screen */
          <div className="flex flex-col items-center gap-5 text-center w-full max-w-sm">
            <div className="w-24 h-24 rounded-full bg-[#08CB00]/10 border-2 border-[#08CB00]/30 flex items-center justify-center">
              <PartyPopper size={44} className="text-[#08CB00]" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white tracking-tight">Delivery Complete!</h3>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">
                E-waste handed off to {job?.hub || 'Hub'}
              </p>
            </div>
            {job?.pay && (
              <div className="flex items-center gap-2 px-5 py-3 bg-[#08CB00]/10 border border-[#08CB00]/20 rounded-2xl">
                <DollarSign size={16} className="text-[#08CB00]" />
                <span className="text-[#08CB00] font-black text-lg">{job.pay}</span>
                <span className="text-white/40 text-[10px] font-bold">earned this delivery</span>
              </div>
            )}
            <button
              onClick={() => onComplete?.({ success: true, done: true })}
              className="w-full flex items-center justify-center gap-2 py-4 bg-[#08CB00] text-black rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_0_20px_rgba(8,203,0,0.4)] hover:bg-[#06a800] transition-all"
            >
              Back to Deliveries <ChevronRight size={16} />
            </button>
          </div>

        ) : status === 'error' ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <XCircle size={40} className="text-red-400" />
            </div>
            <p className="text-red-400 font-black">Camera Unavailable</p>
            <p className="text-white/30 text-[10px] max-w-xs">{errorMsg}</p>
            <button
              onClick={() => completeHandoff('MANUAL_OVERRIDE')}
              className="flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 text-white/60 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              <ShieldCheck size={14} /> Confirm Without Scan
            </button>
          </div>

        ) : status === 'scanning' ? (
          <>
            <div className="relative">
              <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-blue-400 rounded-tl-lg z-10" />
              <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-blue-400 rounded-tr-lg z-10" />
              <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-blue-400 rounded-bl-lg z-10" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-blue-400 rounded-br-lg z-10" />
              <div id="qr-hub-reader" style={{ width: 260, height: 260, borderRadius: 12, overflow: 'hidden' }} />
            </div>
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest animate-pulse">Scanning hub QR...</p>
          </>

        ) : (
          /* Idle — prompt to scan */
          <div className="flex flex-col items-center gap-5 text-center max-w-sm w-full">
            <div className="w-24 h-24 rounded-full bg-blue-500/10 border-2 border-blue-500/20 flex items-center justify-center">
              <QrCode size={44} className="text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Ready to Hand Off</h3>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">
                Ask the hub receiver to show their QR code
              </p>
            </div>
            <div className="w-full p-4 bg-blue-500/5 border border-blue-500/15 rounded-2xl text-left space-y-2">
              <p className="text-[9px] text-white/40 font-black uppercase tracking-widest">Delivering to</p>
              <div className="flex items-center gap-2">
                <Building2 size={14} className="text-blue-400 shrink-0" />
                <span className="text-sm font-black text-white">{job?.hub || 'Hub'}</span>
              </div>
            </div>
            <button
              onClick={startScan}
              className="w-full flex items-center justify-center gap-2 py-4 bg-blue-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95"
            >
              <QrCode size={16} /> Scan Hub QR Code
            </button>
            <button
              onClick={() => completeHandoff('MANUAL_OVERRIDE')}
              className="text-[9px] text-white/30 font-black uppercase tracking-widest hover:text-white/50 transition-colors"
            >
              Confirm manually without scan
            </button>
          </div>
        )}
      </div>

      {!['done', 'error', 'scanning'].includes(status) && (
        <div className="shrink-0 bg-[#1A1A1A] border-t border-white/5 p-4">
          <div className="flex items-center gap-2 p-3 bg-blue-500/5 border border-blue-500/15 rounded-2xl">
            <ShieldCheck size={12} className="text-blue-400 shrink-0" />
            <p className="text-[9px] text-white/40">
              Scanning the hub QR notifies the recycler that waste has been received and marks the job <span className="text-[#08CB00] font-black">Completed</span>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
