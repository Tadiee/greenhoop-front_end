"use client"
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'react-leaflet-cluster/dist/assets/MarkerCluster.css';
import 'react-leaflet-cluster/dist/assets/MarkerCluster.Default.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Create custom marker icon for recycler points with new indicator
const createMarkerIcon = (color = '#08CB00', isSelected = false, isNew = false) => {
    return L.divIcon({
        className: 'custom-marker',
        html: `
            <div style="
                width: ${isSelected ? '48px' : '40px'};
                height: ${isSelected ? '48px' : '40px'};
                border-radius: 50%;
                background: rgba(0,0,0,0.85);
                border: 3px solid ${color};
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 16px rgba(0,0,0,0.5), 0 0 25px ${color}60${isSelected ? ', 0 0 40px ' + color : ''};
                position: relative;
                transition: all 0.3s ease;
                cursor: pointer;
            ">
                <span style="font-size: ${isSelected ? '22px' : '18px'};">♻️</span>
                <div style="
                    position: absolute;
                    top: -2px;
                    right: -2px;
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    background: ${color};
                    border: 2px solid black;
                "></div>
                ${isNew ? `
                <div style="
                    position: absolute;
                    top: -6px;
                    left: -6px;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #08CB00;
                    border: 2px solid white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 8px;
                    font-weight: 900;
                    color: black;
                    animation: pulse 2s infinite;
                ">N</div>
                ` : ''}
            </div>
            <style>
                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.8; }
                }
            </style>
        `,
        iconSize: [isSelected ? 56 : 48, isSelected ? 56 : 48],
        iconAnchor: [isSelected ? 28 : 24, isSelected ? 28 : 24],
    });
};

// User location marker icon - centered properly
const createUserLocationIcon = () => {
    return L.divIcon({
        className: 'user-location-marker',
        html: `
            <div style="
                width: 60px;
                height: 60px;
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
            ">
                <!-- Center dot -->
                <div style="
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #4285F4;
                    border: 3px solid white;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.4);
                    position: relative;
                    z-index: 2;
                ">
                    <div style="
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        width: 6px;
                        height: 6px;
                        border-radius: 50%;
                        background: white;
                    "></div>
                </div>
                <!-- Ripple ring -->
                <div style="
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    border: 2px solid #4285F4;
                    opacity: 0.3;
                    animation: ripple 2s infinite;
                "></div>
            </div>
            <style>
                @keyframes ripple {
                    0% { transform: scale(0.4); opacity: 0.4; }
                    100% { transform: scale(1); opacity: 0; }
                }
            </style>
        `,
        iconSize: [60, 60],
        iconAnchor: [30, 30],
    });
};

// Map controller to handle center changes and locate user
const MapController = ({ center, onLocationFound }) => {
    const map = useMap();
    
    useEffect(() => {
        if (center) {
            map.setView(center, 14, { animate: true });
        }
    }, [center, map]);
    
    // Get user location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    if (onLocationFound) {
                        onLocationFound([latitude, longitude]);
                    }
                },
                (error) => {
                    console.log('Geolocation error:', error);
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 600000 }
            );
        }
    }, [onLocationFound]);
    
    return null;
};

// Default hub points (fallback)
const DEFAULT_HUB_POINTS = [
    { id: 1, name: 'Sector Alpha Hub', lat: -17.82, lng: 31.03, address: '123 Main St, Harare', status: 'Active Receiving' },
    { id: 2, name: 'Central Yard', lat: -17.83, lng: 31.05, address: '45 Industrial Rd, Harare', status: 'Open' },
    { id: 3, name: 'East Drop Point', lat: -17.81, lng: 31.06, address: '78 East Ave, Harare', status: 'Active' },
];

export default function RecyclerMap({ 
    submissions = [], 
    center = [-17.8252, 31.0335],
    onMarkerClick,
    selectedSubmission,
    showHubs = false,
    onLocationFound,
    showUserLocation = true,
    grayscale = false
}) {
    const [userLocation, setUserLocation] = useState(null);
    
    // Use submissions if provided, otherwise fall back to hub points
    const markers = submissions.length > 0 
        ? submissions
            .filter(s => s.latitude != null && s.longitude != null)
            .map(s => ({
            id: s.submit_id,
            lat: s.latitude,
            lng: s.longitude,
            name: s.brand_n_model,
            address: `${s.category} · ${s.device_state} · ${s.estimated_weight}kg`,
            status: s.distance ? `${s.distance}km away` : 'Available',
            isNew: s.isNew || false,
            data: s
        }))
        : showHubs ? DEFAULT_HUB_POINTS.map(h => ({
            id: h.id,
            lat: h.lat,
            lng: h.lng,
            name: h.name,
            address: h.address,
            status: h.status,
            isNew: false,
            data: h
        })) : [];

    const handleLocationFound = (location) => {
        setUserLocation(location);
        if (onLocationFound) {
            onLocationFound(location);
        }
    };

    return (
        <MapContainer
            center={center}
            zoom={13}
            scrollWheelZoom={true}
            style={{ 
                height: '100%', 
                width: '100%',
                filter: grayscale ? 'grayscale(100%) brightness(50%) contrast(125%)' : 'none'
            }}
            className="z-0"
            zoomControl={false}
        >
            <MapController center={center} onLocationFound={handleLocationFound} />
            {/* Tile layer - OSM for fast loading, CARTO for color */}
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* User location marker */}
            {userLocation && showUserLocation && (
                <>
                    <Marker
                        position={userLocation}
                        icon={createUserLocationIcon()}
                        interactive={false}
                    />
                    <Circle 
                        center={userLocation}
                        radius={500}
                        pathOptions={{ 
                            color: '#4285F4', 
                            fillColor: '#4285F4', 
                            fillOpacity: 0.1,
                            weight: 1
                        }}
                    />
                </>
            )}
            
            <MarkerClusterGroup
                chunkedLoading
                maxClusterRadius={40}
                showCoverageOnHover={false}
                spiderfyDistanceMultiplier={2.5}
                spiderfyOnEveryZoom={true}
                zoomToBoundsOnClick={false}
                removeOutsideVisibleBounds={false}
            >
                {markers.map((marker) => {
                    const isSelected = selectedSubmission?.submit_id === marker.id;
                    return (
                        <Marker
                            key={marker.id}
                            position={[marker.lat, marker.lng]}
                            icon={createMarkerIcon(isSelected ? '#08CB00' : '#666', isSelected, marker.isNew)}
                            eventHandlers={{
                                click: () => {
                                    if (onMarkerClick && marker.data) {
                                        onMarkerClick(marker.data);
                                    }
                                },
                                mouseover: (e) => {
                                    e.target.openPopup();
                                },
                                mouseout: (e) => {
                                    e.target.closePopup();
                                },
                            }}
                        >
                            <Popup 
                                className="custom-popup" 
                                autoClose={true} 
                                closeOnClick={true}
                                autoPan={false}
                            >
                                <div className="space-y-2 min-w-[180px]">
                                    <p className="text-sm font-bold text-black">{marker.name}</p>
                                    <p className="text-xs text-black/60">{marker.address}</p>
                                    <div className="flex items-center gap-2 pt-1">
                                        <span className="w-2 h-2 rounded-full bg-[#08CB00]"></span>
                                        <span className="text-[10px] text-black/70">{marker.status}</span>
                                        {marker.isNew && (
                                            <span className="text-[9px] font-bold text-[#08CB00] bg-[#08CB00]/10 px-1.5 py-0.5 rounded-full">N</span>
                                        )}
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
