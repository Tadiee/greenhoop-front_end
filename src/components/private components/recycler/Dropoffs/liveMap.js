"use client"
import React, { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import { STATUS_COLORS } from './dropoffConstants';

const STATUS_HEX = {
  Active:      '#08CB00',
  Inactive:    '#555555',
  Maintenance: '#EAB308',
  Full:        '#EF4444',
};

function createSiteIcon(status, isSelected) {
  if (typeof window === 'undefined') return null;
  const L = require('leaflet');
  const color = STATUS_HEX[status] || '#555';
  const size = isSelected ? 18 : 14;
  const ring = isSelected ? `box-shadow:0 0 0 3px ${color}40;` : '';
  return L.divIcon({
    className: '',
    html: `<div style="width:${size}px;height:${size}px;background:${color};border-radius:50%;border:2px solid rgba(0,0,0,0.6);${ring}"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export default function DropoffMapComponent({ sites = [], selectedSite, onMarkerClick }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});

  useEffect(() => {
    if (typeof window === 'undefined' || mapInstanceRef.current) return;
    const L = require('leaflet');

    const map = L.map(mapRef.current, {
      center: [-17.8252, 31.0335],
      zoom: 12,
      zoomControl: false,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: ' OpenStreetMap contributors',
    }).addTo(map);
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    mapInstanceRef.current = map;
  }, []);

  // Sync markers whenever sites or selection changes
  useEffect(() => {
    if (!mapInstanceRef.current || typeof window === 'undefined') return;
    const L = require('leaflet');
    const map = mapInstanceRef.current;

    Object.values(markersRef.current).forEach(m => map.removeLayer(m));
    markersRef.current = {};

    sites.forEach(site => {
      const isSelected = selectedSite?.id === site.id;
      const icon = createSiteIcon(site.status, isSelected);
      const loadPct = Math.round((site.current_load_kg / site.capacity_kg) * 100);
      const marker = L.marker([site.latitude, site.longitude], { icon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family:sans-serif;min-width:160px">
            <p style="font-weight:900;font-size:12px;margin:0 0 4px">${site.name}</p>
            <p style="font-size:10px;color:#666;margin:0 0 6px">${site.address}</p>
            <div style="display:flex;align-items:center;gap:6px">
              <div style="height:4px;flex:1;background:#222;border-radius:4px;overflow:hidden">
                <div style="width:${loadPct}%;height:100%;background:${STATUS_HEX[site.status]}"></div>
              </div>
              <span style="font-size:10px;font-weight:700">${loadPct}%</span>
            </div>
            <p style="font-size:9px;color:${STATUS_HEX[site.status]};font-weight:700;margin:4px 0 0;text-transform:uppercase">${site.status}</p>
          </div>
        `, { autoPan: false })
        .on('click', () => { if (onMarkerClick) onMarkerClick(site); });
      markersRef.current[site.id] = marker;
    });
  }, [sites, selectedSite]);

  // Pan to selected site
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedSite) return;
    mapInstanceRef.current.flyTo([selectedSite.latitude, selectedSite.longitude], 14, { duration: 1 });
    const marker = markersRef.current[selectedSite.id];
    if (marker) marker.openPopup();
  }, [selectedSite]);

  return (
    <div className="absolute inset-0 bg-[#0A0A0A] border border-white/5 rounded-[48px] overflow-hidden">
      <div ref={mapRef} className="w-full h-full" />

      {/* Legend overlay */}
      <div className="absolute bottom-5 left-5 z-[400] flex flex-col gap-1.5 bg-black/70 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/10">
        <p className="text-[8px] font-black uppercase tracking-widest text-white/30 mb-1">Legend</p>
        {Object.entries(STATUS_HEX).map(([status, color]) => (
          <div key={status} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-[9px] font-bold text-white/50">{status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}