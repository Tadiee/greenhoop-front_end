"use client"
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const pickupIcon = L.divIcon({
  className: '',
  html: `<div style="width:14px;height:14px;border-radius:50%;background:#08CB00;border:2px solid #fff;box-shadow:0 0 8px rgba(8,203,0,0.6)"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const hubIcon = L.divIcon({
  className: '',
  html: `<div style="width:14px;height:14px;border-radius:3px;background:#3B82F6;border:2px solid #fff;box-shadow:0 0 8px rgba(59,130,246,0.6)"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

function FitBounds({ positions }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length >= 2) {
      map.fitBounds(positions, { padding: [24, 24], animate: false });
    }
  }, [map, positions]);
  return null;
}

export default function HistoryMiniMap({ pickupLat, pickupLng, customer, hub }) {
  const pickup = [pickupLat, pickupLng];
  const hasHub = false;
  const positions = [pickup];

  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 relative" style={{ height: 180 }}>
      <MapContainer
        center={pickup}
        zoom={13}
        zoomControl={false}
        attributionControl={false}
        scrollWheelZoom={false}
        dragging={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FitBounds positions={positions} />
        <Marker position={pickup} icon={pickupIcon} />
      </MapContainer>

      {/* Labels overlay */}
      <div className="absolute bottom-0 left-0 right-0 z-[500] flex justify-between items-end p-2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#08CB00] shrink-0" />
          <span className="text-[9px] text-white font-black truncate max-w-[100px]">{customer || 'Pickup'}</span>
        </div>
        {hub && (
          <div className="flex items-center gap-1">
            <span className="text-[9px] text-white font-black truncate max-w-[100px]">{hub}</span>
            <span className="w-2.5 h-2.5 rounded-[3px] bg-blue-400 shrink-0" />
          </div>
        )}
      </div>
    </div>
  );
}
