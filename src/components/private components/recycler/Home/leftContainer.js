"use client"
import React, { useEffect, useRef } from 'react';
import { Warehouse, Radio, MapPin, ShieldCheck } from 'lucide-react';
import { poppins } from '@/fonts/fonts';
import 'leaflet/dist/leaflet.css';

const MARKER_COLOR = { active: '#08CB00', maintenance: '#EAB308', full: '#EF4444', inactive: '#555' };
const STATUS_LABEL  = { active: 'Active', maintenance: 'Maintenance', full: 'Full', inactive: 'Inactive' };

function siteColor(status) {
  return MARKER_COLOR[(status || '').toLowerCase()] || '#555';
}

function HomeMap({ sites }) {
  const mapRef = useRef(null);
  const instanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (typeof window === 'undefined' || instanceRef.current) return;
    const L = require('leaflet');

    const map = L.map(mapRef.current, {
      center: [-17.8050, 31.0450],
      zoom: 12,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    instanceRef.current = map;
  }, []);

  useEffect(() => {
    if (!instanceRef.current || typeof window === 'undefined') return;
    const L = require('leaflet');

    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    sites.forEach(site => {
      if (!site.latitude || !site.longitude) return;
      const color = siteColor(site.status);
      const icon = L.divIcon({
        className: '',
        html: `<div style="width:14px;height:14px;background:${color};border-radius:50%;border:2px solid rgba(0,0,0,0.5);box-shadow:0 0 10px ${color}80"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });
      const marker = L.marker([site.latitude, site.longitude], { icon })
        .addTo(instanceRef.current)
        .bindPopup(`<b style="font-size:11px">${site.name}</b><br><span style="font-size:9px;color:${color}">${STATUS_LABEL[site.status] || site.status}</span>`);
      markersRef.current.push(marker);
    });
  }, [sites]);

  return <div ref={mapRef} className="w-full h-full" />;
}

export default function RecyclerHomeLeftContainer({ profile, dropOffSites = [] }) {
  const activeCount = dropOffSites.filter(s => (s.status || '').toLowerCase() === 'active').length;

  return (
    <div className="col-span-1 lg:col-span-7 flex flex-col gap-4 lg:h-full">

      {/* MAP — takes up most of the height */}
      <div className="h-[55vw] min-h-[300px] lg:min-h-0 lg:flex-[3] bg-[#0a0a0a] border border-white/5 rounded-[32px] lg:rounded-[48px] relative overflow-hidden shadow-2xl">
        <HomeMap sites={dropOffSites} />

        {/* Top-left HUD */}
        <div className="absolute top-6 left-7 z-[400] pointer-events-none">
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#08CB00]">Live Network Radar</p>
          <h2 className="text-2xl lg:text-4xl font-black italic tracking-tighter uppercase leading-none text-white mt-1">
            Harare <span className="text-white/20">Grid</span>
          </h2>
          <div className="flex items-center gap-3 mt-3">
            <div className="px-2.5 py-1 bg-black/80 backdrop-blur-md border border-white/10 rounded-lg font-mono text-[9px] text-white/70">
              17.8252° S
            </div>
            <div className="px-2.5 py-1 bg-black/80 backdrop-blur-md border border-white/10 rounded-lg font-mono text-[9px] text-white/70">
              31.0335° E
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-5 left-6 z-[400] hidden sm:flex items-center gap-3 pointer-events-none">
          {Object.entries(MARKER_COLOR).map(([status, color]) => (
            <div key={status} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-black/70 backdrop-blur-sm rounded-xl border border-white/10">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-[8px] font-black uppercase text-white/50">{status}</span>
            </div>
          ))}
        </div>

        {/* FAB */}
        <button className="absolute bottom-5 right-6 z-[400] w-12 h-12 rounded-full bg-[#08CB00] flex items-center justify-center text-black hover:bg-white transition-all shadow-[0_0_30px_rgba(8,203,0,0.4)]">
          <Radio size={18} />
        </button>
      </div>

      {/* BOTTOM ROW — Identity + Drop-off count */}
      <div className="grid grid-cols-2 gap-4 lg:flex-1 min-h-0">

        {/* RECYCLER IDENTITY */}
        <div className="bg-white/[0.03] border border-white/5 rounded-[40px] p-6 flex flex-col gap-3 relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[8px] font-black uppercase tracking-widest text-white/30">Recycler Identity</p>
              <h3 className={`${poppins.className} text-2xl font-black text-white italic tracking-tighter uppercase leading-tight mt-1`}>
                {profile?.facility_name || 'GreenHoop'}
              </h3>
            </div>
            <div className="p-2.5 bg-[#08CB00]/10 rounded-2xl">
              <Warehouse size={20} className="text-[#08CB00]" />
            </div>
          </div>
          <div className="mt-auto">
            <p className="text-[8px] text-white/20 uppercase tracking-widest">Address</p>
            <p className="text-[10px] font-bold text-white/60 mt-0.5 leading-snug">{profile?.address || '—'}</p>
            <div className="mt-3 flex items-center gap-2 px-3 py-1.5 bg-[#08CB00]/10 border border-[#08CB00]/20 rounded-xl w-fit">
              <div className="w-1.5 h-1.5 bg-[#08CB00] rounded-full animate-pulse" />
              <span className="text-[9px] font-black text-[#08CB00] uppercase tracking-wider">
                {profile?.is_certified ? 'Certified' : 'Uncertified'} · {profile?.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
          <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-[#08CB00]/5 rounded-full blur-2xl group-hover:bg-[#08CB00]/10 transition-all" />
        </div>

        {/* NETWORK SUMMARY */}
        <div className="bg-white/[0.03] border border-white/5 rounded-[40px] p-6 flex flex-col overflow-hidden">
          <div>
            <p className="text-[8px] font-black uppercase tracking-widest text-white/30 mb-4">Network Summary</p>
            <div className="space-y-3 overflow-y-auto max-h-[120px] lg:max-h-[140px] scrollbar-thin pr-1">
              {dropOffSites.length === 0 && (
                <p className="text-[9px] text-white/20">No drop-off sites registered</p>
              )}
              {dropOffSites.map((site, i) => {
                const color = siteColor(site.status);
                return (
                  <div key={site.drop_off_id || i} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    <p className="text-[10px] font-bold text-white/60 flex-1 truncate">{site.name}</p>
                    <span className="text-[8px] font-black uppercase" style={{ color }}>{STATUS_LABEL[site.status] || site.status}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-2 pt-3 border-t border-white/5 mt-auto shrink-0">
            <MapPin size={11} className="text-[#08CB00]" />
            <span className="text-[9px] font-black text-white/30 uppercase tracking-wider">{activeCount} Active · {dropOffSites.length} Total Sites</span>
          </div>
        </div>

      </div>
    </div>
  );
}