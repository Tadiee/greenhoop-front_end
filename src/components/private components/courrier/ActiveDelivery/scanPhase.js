"use client"
import React, { useEffect, useRef, useState } from 'react';
import { QrCode, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';

export default function ScanPhase({ job, onScanSuccess }) {
  const scannerRef = useRef(null);
  const scannerInstance = useRef(null);
  const [status, setStatus] = useState('idle'); // idle | scanning | success | error
  const [scannedData, setScannedData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let mounted = true;

    const startScanner = async () => {
      try {
        const { Html5Qrcode } = await import('html5-qrcode');
        const scanner = new Html5Qrcode('qr-reader');
        scannerInstance.current = scanner;

        setStatus('scanning');

        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 240, height: 240 } },
          (decodedText) => {
            if (!mounted) return;
            setScannedData(decodedText);
            setStatus('success');
            scanner.stop().catch(() => {});
            onScanSuccess?.(decodedText);
          },
          () => {}
        );
      } catch (err) {
        if (mounted) {
          setStatus('error');
          setErrorMsg(err?.message || 'Camera access denied or unavailable');
        }
      }
    };

    startScanner();

    return () => {
      mounted = false;
      scannerInstance.current?.stop().catch(() => {});
    };
  }, []);

  return (
    <div className="h-full flex flex-col min-h-0 bg-[#0A0A0A]">
      {/* Header */}
      <div className="shrink-0 p-5 bg-[#1A1A1A] border-b border-white/5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-[#08CB00]/10 flex items-center justify-center">
          <QrCode size={18} className="text-[#08CB00]" />
        </div>
        <div>
          <h2 className="text-white font-black tracking-tight">Scan Customer QR Code</h2>
          <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest mt-0.5">
            Point camera at the customer's app QR code
          </p>
        </div>
      </div>

      {/* Scanner area */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 p-6 min-h-0">
        {status === 'success' ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-20 h-20 rounded-full bg-[#08CB00]/10 border border-[#08CB00]/30 flex items-center justify-center">
              <CheckCircle2 size={40} className="text-[#08CB00]" />
            </div>
            <div>
              <p className="text-white font-black text-lg">Scan Confirmed</p>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">Pickup verified for {job?.customer}</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-[9px] font-mono text-white/40 break-all max-w-xs">
              {scannedData}
            </div>
          </div>
        ) : status === 'error' ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <XCircle size={40} className="text-red-400" />
            </div>
            <p className="text-red-400 font-black">Camera Unavailable</p>
            <p className="text-white/30 text-[10px] max-w-xs">{errorMsg}</p>
            <button
              onClick={() => onScanSuccess?.('MANUAL_OVERRIDE')}
              className="flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 text-white/60 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              <ShieldCheck size={14} /> Continue Without Scan
            </button>
          </div>
        ) : (
          <>
            {/* Viewfinder frame */}
            <div className="relative">
              <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-[#08CB00] rounded-tl-lg z-10" />
              <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-[#08CB00] rounded-tr-lg z-10" />
              <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-[#08CB00] rounded-bl-lg z-10" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-[#08CB00] rounded-br-lg z-10" />
              <div id="qr-reader" ref={scannerRef} style={{ width: 280, height: 280, borderRadius: 12, overflow: 'hidden' }} />
            </div>
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest animate-pulse">
              Scanning...
            </p>
          </>
        )}
      </div>

      {/* Bottom context */}
      <div className="shrink-0 bg-[#1A1A1A] border-t border-white/5 p-5">
        <div className="flex items-center gap-3 p-3 bg-[#08CB00]/5 border border-[#08CB00]/15 rounded-2xl">
          <ShieldCheck size={14} className="text-[#08CB00] shrink-0" />
          <p className="text-[9px] text-white/50">
            Scanning the QR code confirms you physically received the e-waste from <span className="text-white font-black">{job?.customer}</span> and updates the submission status to <span className="text-[#08CB00] font-black">In Transit</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
