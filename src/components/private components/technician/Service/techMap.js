"use client"
import React, { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'react-leaflet-cluster/dist/assets/MarkerCluster.css';
import 'react-leaflet-cluster/dist/assets/MarkerCluster.Default.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const createEwasteMarker = (isSelected = false, sourceType = 'user') => {
  const color = isSelected ? '#08CB00' : sourceType === 'marketplace' ? '#a855f7' : '#3b82f6';
  const emoji = sourceType === 'marketplace' ? '🏷️' : '📦';
  const size = isSelected ? 52 : 40;
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width:${size}px;height:${size}px;border-radius:50%;
        background:rgba(0,0,0,0.88);border:3px solid ${color};
        display:flex;align-items:center;justify-content:center;
        box-shadow:0 4px 16px rgba(0,0,0,0.5),0 0 ${isSelected ? '30px' : '16px'} ${color}60;
        position:relative;cursor:pointer;transition:all 0.3s;
      ">
        <span style="font-size:${isSelected ? 22 : 16}px;">${emoji}</span>
        <div style="
          position:absolute;top:-2px;right:-2px;
          width:12px;height:12px;border-radius:50%;
          background:${color};border:2px solid black;
        "></div>
      </div>`,
    iconSize: [size + 8, size + 8],
    iconAnchor: [(size + 8) / 2, (size + 8) / 2],
  });
};

const createUserIcon = () => L.divIcon({
  className: 'user-location-marker',
  html: `
    <div style="width:56px;height:56px;position:relative;display:flex;align-items:center;justify-content:center;">
      <div style="width:16px;height:16px;border-radius:50%;background:#4285F4;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4);position:relative;z-index:2;">
        <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:6px;height:6px;border-radius:50%;background:white;"></div>
      </div>
      <div style="position:absolute;top:0;left:0;width:56px;height:56px;border-radius:50%;border:2px solid #4285F4;opacity:0.3;animation:ripple 2s infinite;"></div>
    </div>
    <style>@keyframes ripple{0%{transform:scale(0.4);opacity:0.4;}100%{transform:scale(1);opacity:0;}}</style>`,
  iconSize: [56, 56],
  iconAnchor: [28, 28],
});

function MapController({ center, radiusKm, userLocation }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, 14, { animate: true });
  }, [center, map]);
  return null;
}

const CATEGORY_COLOR = {
  phones: '#08CB00', laptops: '#3b82f6', tablets: '#a855f7',
  batteries: '#f59e0b', appliances: '#ef4444', other: '#6b7280',
};

export default function TechMap({ listings = [], selectedItem, onMarkerClick, radiusKm = 5 }) {
  const [userLocation, setUserLocation] = useState(null);
  const defaultCenter = [-17.8252, 31.0335];

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
        () => {},
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 600000 }
      );
    }
  }, []);

  const center = userLocation || defaultCenter;

  const markers = listings.filter(l => l.latitude != null && l.longitude != null);

  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%' }}
      className="z-0"
      zoomControl={false}
    >
      <MapController center={center} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {userLocation && (
        <>
          <Marker position={userLocation} icon={createUserIcon()} interactive={false} />
          <Circle
            center={userLocation}
            radius={radiusKm * 1000}
            pathOptions={{ color: '#08CB00', fillColor: '#08CB00', fillOpacity: 0.04, weight: 1.5, dashArray: '6 4' }}
          />
        </>
      )}

      <MarkerClusterGroup
        chunkedLoading
        maxClusterRadius={50}
        showCoverageOnHover={false}
        spiderfyDistanceMultiplier={2.5}
        zoomToBoundsOnClick={false}
      >
        {markers.map((item) => {
          const isSelected = selectedItem?.listing_id === item.listing_id || selectedItem?.submit_id === item.submit_id;
          return (
            <Marker
              key={item.listing_id || item.submit_id}
              position={[item.latitude, item.longitude]}
              icon={createEwasteMarker(isSelected, item.source_type)}
              eventHandlers={{
                click: () => onMarkerClick && onMarkerClick(item),
                mouseover: (e) => e.target.openPopup(),
                mouseout: (e) => e.target.closePopup(),
              }}
            >
              <Popup className="custom-popup" autoClose closeOnClick autoPan={false}>
                <div className="min-w-[180px] space-y-2">
                  <p className="text-sm font-bold text-black">{item.item_name || item.brand_n_model || '—'}</p>
                  <p className="text-xs text-black/60">{item.category} · {item.estimated_weight}kg · {item.device_state}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-sm font-black text-[#08CB00]">{item.asking_price != null ? `$${item.asking_price}` : '—'}</span>
                    <span className="text-[9px] text-black/40 uppercase tracking-wide">
                      {item.distance != null ? `${item.distance}km away` : item.source_type}
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
