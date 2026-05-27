"use client"
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation2, MapPin, Package, Clock, ChevronRight, Building2 } from 'lucide-react';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl: markerIcon2x, iconUrl: markerIcon, shadowUrl: markerShadow });

const destIcon = L.divIcon({
  className: '',
  html: `<div style="width:20px;height:20px;border-radius:50%;background:#08CB00;border:3px solid #fff;box-shadow:0 0 16px rgba(8,203,0,0.7)"></div>`,
  iconSize: [20, 20], iconAnchor: [10, 10],
});

const courierIcon = L.divIcon({
  className: '',
  html: `<div style="width:16px;height:16px;border-radius:50%;background:#3B82F6;border:3px solid #fff;box-shadow:0 0 12px rgba(59,130,246,0.7)"></div>`,
  iconSize: [16, 16], iconAnchor: [8, 8],
});

function FlyTo({ center }) {
  const map = useMap();
  useEffect(() => { if (center) map.setView(center, 14, { animate: true }); }, [center, map]);
  return null;
}

export default function NavPhase({ job, onArrived }) {
  const dest = job?.lat && job?.lng ? [job.lat, job.lng] : [-17.8252, 31.0335];
  const center = dest;

  return (
    <div className="h-full flex flex-col min-h-0">
      {/* Full-screen map */}
      <div className="flex-1 relative min-h-0">
        <MapContainer center={center} zoom={14} zoomControl={false} className="w-full h-full" style={{ height: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <FlyTo center={dest} />
          <Marker position={dest} icon={destIcon} />
        </MapContainer>

        {/* Top HUD */}
        <div className="absolute top-4 left-4 right-4 z-[600] flex gap-3">
          <div className="flex-1 bg-black/85 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#08CB00]/10 flex items-center justify-center shrink-0">
              <Navigation2 size={16} className="text-[#08CB00]" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] text-white/40 font-black uppercase tracking-widest">Navigating to pickup</p>
              <p className="text-sm font-black text-white truncate">{job?.customer || '—'}</p>
            </div>
          </div>
          <div className="bg-black/85 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 flex flex-col items-center justify-center shrink-0">
            <p className="text-[8px] text-white/40 font-black uppercase tracking-widest">ETA</p>
            <p className="text-lg font-black text-[#08CB00]">~12m</p>
          </div>
        </div>

        {/* Destination pin label */}
        <div className="absolute bottom-36 left-1/2 -translate-x-1/2 z-[600]">
          <div className="bg-[#08CB00] text-black text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 whitespace-nowrap">
            <MapPin size={10} /> Pickup Point
          </div>
        </div>
      </div>

      {/* Bottom info card */}
      <div className="shrink-0 bg-[#1A1A1A] border-t border-white/5 p-5 flex flex-col gap-4">
        {/* Job summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/5 rounded-2xl p-3 flex flex-col gap-1">
            <Package size={12} className="text-white/30" />
            <p className="text-[8px] text-white/30 font-black uppercase tracking-widest">Item</p>
            <p className="text-[10px] font-black text-white truncate">{job?.item || '—'}</p>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 flex flex-col gap-1">
            <Clock size={12} className="text-white/30" />
            <p className="text-[8px] text-white/30 font-black uppercase tracking-widest">Weight</p>
            <p className="text-[10px] font-black text-white">{job?.weight || '—'}</p>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 flex flex-col gap-1">
            <Building2 size={12} className="text-white/30" />
            <p className="text-[8px] text-white/30 font-black uppercase tracking-widest">Hub</p>
            <p className="text-[10px] font-black text-white truncate">{job?.hub || '—'}</p>
          </div>
        </div>

        {/* Arrived button */}
        <button
          onClick={onArrived}
          className="w-full flex items-center justify-center gap-2 py-4 bg-[#08CB00] text-black rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_0_20px_rgba(8,203,0,0.4)] hover:bg-[#06a800] transition-all active:scale-95"
        >
          <MapPin size={16} /> I've Arrived — Scan QR Code <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
