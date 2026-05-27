"use client"
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { IoLocationOutline, IoStar } from 'react-icons/io5';
import { MdRecycling } from 'react-icons/md';
import { HiOutlineTruck } from 'react-icons/hi2';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const TYPE_CONFIG = {
    recycler: { label: 'Recycler', icon: MdRecycling, bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
    technician: { label: 'Technician', icon: HiOutlineTruck, bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
    'drop-off': { label: 'Drop-off Point', icon: IoLocationOutline, bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
    receiver: { label: 'Receiver', icon: MdRecycling, bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
    courier: { label: 'Courier', icon: HiOutlineTruck, bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
};

const AVAILABILITY_CONFIG = {
    available: { label: 'Available', bg: 'bg-[#08CB00]/10', text: 'text-[#08CB00]', dot: 'bg-[#08CB00]', color: '#08CB00' },
    busy: { label: 'Busy', bg: 'bg-yellow-500/10', text: 'text-yellow-400', dot: 'bg-yellow-400', color: '#fbbf24' },
    unavailable: { label: 'Unavailable', bg: 'bg-red-500/10', text: 'text-red-400', dot: 'bg-red-400', color: '#ef4444' },
    offline: { label: 'Offline', bg: 'bg-red-500/10', text: 'text-red-400', dot: 'bg-red-400', color: '#ef4444' },
};

// Create custom marker icons
const createMarkerIcon = (type, availability) => {
    const color = (type === 'recycler' || type === 'receiver') ? '#10b981' : (type === 'technician' || type === 'courier') ? '#a855f7' : '#3b82f6';
    const availConfig = AVAILABILITY_CONFIG[availability] || AVAILABILITY_CONFIG.available;
    
    // Use emojis for recycler and technician, SVG for drop-off
    let iconContent;
    if (type === 'recycler' || type === 'receiver') {
        iconContent = '<span style="font-size: 18px;">♻️</span>';
    } else if (type === 'technician' || type === 'courier') {
        iconContent = '<span style="font-size: 18px;">🚛</span>';
    } else {
        // SVG for drop-off
        iconContent = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
        </svg>`;
    }
    
    return L.divIcon({
        className: 'custom-marker',
        html: `
            <div style="
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: rgba(0,0,0,0.8);
                border: 3px solid ${color};
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 12px rgba(0,0,0,0.4);
                position: relative;
            ">
                ${iconContent}
                <div style="
                    position: absolute;
                    top: -2px;
                    right: -2px;
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: ${availConfig.color};
                    border: 2px solid black;
                "></div>
            </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
    });
};

// Fit bounds to markers
function MapBounds({ collectors }) {
    const map = useMap();
    
    React.useEffect(() => {
        const validCollectors = collectors.filter(c => c.lat !== null && c.lng !== null);
        if (validCollectors.length > 0) {
            const bounds = L.latLngBounds(validCollectors.map(c => [c.lat, c.lng]));
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
        }
    }, [map, collectors]);
    
    return null;
}

export default function CollectorMap({ collectors, onPinClick }) {
    return (
        <MapContainer
            center={[-17.825, 31.05]}
            zoom={13}
            style={{ height: '100%', width: '100%', background: '#0a0a0a' }}
            zoomControl={false}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapBounds collectors={collectors} />
            
            {collectors.map((collector) => {
                const typeConfig = TYPE_CONFIG[collector.type] || TYPE_CONFIG.recycler;
                const TypeIcon = typeConfig.icon;
                const availConfig = AVAILABILITY_CONFIG[collector.availability] || AVAILABILITY_CONFIG.available;
                if (collector.lat === null || collector.lng === null) return null;
                
                return (
                    <Marker
                        key={collector.id}
                        position={[collector.lat, collector.lng]}
                        icon={createMarkerIcon(collector.type, collector.availability)}
                        eventHandlers={{
                            click: () => onPinClick(collector.id),
                            mouseover: (e) => {
                                e.target.openPopup();
                            },
                            mouseout: (e) => {
                                e.target.closePopup();
                            },
                        }}
                    >
                        <Popup className="custom-popup">
                            <div className="space-y-2 min-w-[200px]">
                                {/* Header */}
                                <div className="flex items-start gap-2">
                                    <div className={`w-8 h-8 rounded-lg ${typeConfig.bg} flex items-center justify-center flex-shrink-0`}>
                                        <TypeIcon className={typeConfig.text} size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-black">{collector.name}</p>
                                        <div className="flex items-center gap-1 text-xs text-black/50">
                                            <span className={typeConfig.text}>{typeConfig.label}</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-0.5">
                                                <IoStar className="text-yellow-400" size={10} />
                                                {collector.rating || 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="space-y-1 pt-2 border-t border-black/10">
                                    <p className="text-xs text-black/60 truncate">{collector.address}</p>
                                    <p className="text-xs text-black/40">{collector.distance ? `${collector.distance} km away` : 'Distance unknown'}</p>
                                    <div className="flex items-center justify-between pt-1">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${availConfig.bg} ${availConfig.text}`}>
                                            {availConfig.label}
                                        </span>
                                        {collector.payoutMultiplier > 1 && (
                                            <span className="text-[10px] text-[#08CB00] font-bold">
                                                +{((collector.payoutMultiplier - 1) * 100).toFixed(0)}% payout
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Action */}
                                <button 
                                    onClick={() => onPinClick(collector.id)}
                                    className="w-full py-2 bg-[#08CB00] rounded-lg text-xs font-bold text-black hover:bg-[#08CB00]/90 transition-all"
                                >
                                    View Details
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
}
