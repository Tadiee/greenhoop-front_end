"use client"
import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Maximize2, Download, MapPin, Clock } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000';

export default function InTransitQRSection({ submission }) {
  const [fullscreen, setFullscreen] = useState(false);
  // Prefer real backend token; fall back to stable ID-based value
  const qrValue = submission.handover_token || `GH-DROPOFF-${submission.submit_id}`;
  // API returns drop_off_site (not assigned_drop_off_site)
  const site = submission.drop_off_site || submission.assigned_drop_off_site || null;
  // Resolve relative media URLs to absolute
  const qrImageUrl = submission.handover_qr_url
    ? (submission.handover_qr_url.startsWith('http') ? submission.handover_qr_url : `${API_BASE}${submission.handover_qr_url}`)
    : null;

  const handleDownload = () => {
    if (qrImageUrl) {
      const a = document.createElement('a');
      a.href = qrImageUrl;
      a.download = `GreenHoop-DropOff-QR-${submission.submit_id}.png`;
      a.target = '_blank';
      a.click();
      return;
    }
    const svg = document.querySelector(`#gh-intransit-qr-${submission.submit_id}`);
    if (!svg) return;
    const serialised = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([serialised], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GreenHoop-DropOff-QR-${submission.submit_id}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Fullscreen overlay */}
      {fullscreen && (
        <div
          className="fixed inset-0 z-[300] bg-black/95 flex flex-col items-center justify-center gap-6 p-6"
          onClick={() => setFullscreen(false)}
        >
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Tap anywhere to close</p>
          <div className="bg-white p-8 rounded-3xl shadow-2xl">
            {qrImageUrl
              ? <img src={qrImageUrl} alt="Handover QR" width={300} height={300} className="block" />
              : <QRCodeSVG value={qrValue} size={300} level="H" includeMargin={false} />
            }
          </div>
          <div className="text-center space-y-1">
            <p className="text-xs font-bold text-white">{submission.brand_n_model}</p>
            <p className="text-[9px] font-mono text-white/30 tracking-widest">{qrValue}</p>
          </div>
        </div>
      )}

      <div className="mt-2 rounded-2xl border border-orange-500/20 bg-orange-500/5 p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode size={16} className="text-orange-400" />
            <p className="text-xs font-black text-orange-400 uppercase tracking-widest">Drop-off QR Code</p>
          </div>
          <span className="text-[8px] px-2 py-1 bg-orange-500/20 text-orange-400 rounded-full font-bold uppercase tracking-wider">In Transit</span>
        </div>

        <p className="text-[11px] text-white/50 leading-relaxed">
          Present this QR code to the receiver at the drop-off site. They will scan it to confirm receipt of your device and complete the handover.
        </p>

        {/* Site info if available */}
        {site && (
          <div className="flex items-start gap-3 p-3 bg-black/40 rounded-xl border border-white/5">
            <MapPin size={13} className="text-orange-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-white">{site.name}</p>
              <p className="text-[10px] text-white/40">{site.address}</p>
              {site.operating_hours && (
                <div className="flex items-center gap-1 mt-1">
                  <Clock size={10} className="text-white/25" />
                  <span className="text-[9px] text-white/25">{site.operating_hours}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* QR Code */}
        <div className="flex flex-col items-center gap-3 py-2">
          <div className="bg-white p-4 rounded-2xl shadow-lg">
            {qrImageUrl
              ? <img
                  id={`gh-intransit-qr-${submission.submit_id}`}
                  src={qrImageUrl}
                  alt="Handover QR"
                  width={160} height={160}
                  className="block"
                />
              : <QRCodeSVG
                  id={`gh-intransit-qr-${submission.submit_id}`}
                  value={qrValue}
                  size={160}
                  level="H"
                  includeMargin={false}
                />
            }
          </div>
          <p className="text-[9px] font-mono text-white/25 tracking-widest">{qrValue}</p>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFullscreen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-white/50 hover:bg-white/10 hover:text-white/70 transition-all"
            >
              <Maximize2 size={12} /> Fullscreen
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-white/50 hover:bg-white/10 hover:text-white/70 transition-all"
            >
              <Download size={12} /> Save QR
            </button>
          </div>
        </div>

        <p className="text-[9px] text-white/20 text-center leading-relaxed">
          Keep this code handy. You'll need to show it when you arrive at the drop-off site.
        </p>
      </div>
    </>
  );
}
