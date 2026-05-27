"use client"
import React, { useState, useMemo, useEffect } from 'react';
import { MapPin, Search, Navigation2, Clock, Plus, X, Zap, CalendarClock } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icons
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom marker icons: urgent=orange, scheduled=blue, selected=bright
const createCustomIcon = (isSelected, type) => {
  const colors = {
    urgent:    { fill: isSelected ? '#F97316' : '#000', border: '#F97316', glow: 'rgba(249,115,22,0.5)', stroke: isSelected ? '#000' : '#F97316' },
    scheduled: { fill: isSelected ? '#3B82F6' : '#000', border: '#3B82F6', glow: 'rgba(59,130,246,0.5)',  stroke: isSelected ? '#fff' : '#3B82F6' },
  };
  const c = colors[type] || colors.urgent;
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: ${isSelected ? 36 : 30}px;
      height: ${isSelected ? 36 : 30}px;
      border-radius: 50%;
      background: ${c.fill};
      border: 2px solid ${c.border};
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 14px ${c.glow};
      transition: all 0.2s;
    ">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="${c.stroke}" stroke="${c.stroke}" stroke-width="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    </div>`,
    iconSize: [isSelected ? 36 : 30, isSelected ? 36 : 30],
    iconAnchor: [isSelected ? 18 : 15, isSelected ? 36 : 30],
    popupAnchor: [0, -32],
  });
};

// Center map on selected trip
function MapController({ selectedTrip }) {
  const map = useMap();
  React.useEffect(() => {
    if (selectedTrip?.lat && selectedTrip?.lng) {
      map.setView([selectedTrip.lat, selectedTrip.lng], 14, { animate: true, duration: 0.5 });
    }
  }, [selectedTrip, map]);
  return null;
}

const API_BASE = 'http://127.0.0.1:8000';

export default function DiscoveryMapComp({ filter = 'All', selectedJobId = null }) {
  const CENTER = [-17.8252, 31.0335];

  const [availableJobs, setAvailableJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showCard, setShowCard] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [acceptError, setAcceptError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${API_BASE}/courier/discovery`, { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
      })
      .then(data => {
        const mapped = (data.jobs || [])
          .filter(j => j.lat != null && j.lng != null)
          .map(j => ({
            ...j,
            scheduledDate: j.scheduled_date ?? null,
          }));
        setAvailableJobs(mapped);
        if (mapped.length > 0) {
          setSelectedTrip(mapped[0]);
          setShowCard(true);
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedJobId || availableJobs.length === 0) return;
    const match = availableJobs.find(j => j.id === selectedJobId);
    if (match) { setSelectedTrip(match); setShowCard(true); }
  }, [selectedJobId, availableJobs]);

  const visibleJobs = useMemo(() =>
    filter === 'All' ? availableJobs : availableJobs.filter(j => j.type === filter.toLowerCase()),
  [availableJobs, filter]);

  const handleAcceptJob = async () => {
    if (!selectedTrip || isAccepting) return;
    
    // Support either submit_id field or id formatted like 'JOB-123'
    const submitId = selectedTrip.submit_id || String(selectedTrip.id).replace('JOB-', '');
    
    setIsAccepting(true);
    setAcceptError(null);
    try {
      const res = await fetch(`${API_BASE}/courier/jobs/${submitId}/accept`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      
      if (res.ok && data.success !== false) {
        // Remove from list
        setAvailableJobs(prev => prev.filter(j => j.id !== selectedTrip.id));
        setShowCard(false);
        setSelectedTrip(null);
        alert(data.message || 'Job accepted successfully!');
      } else {
        setAcceptError(data.error || 'Failed to accept job.');
      }
    } catch (err) {
      setAcceptError('Network error: ' + err.message);
    } finally {
      setIsAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="col-span-12 lg:col-span-8 bg-[#1A1A1A] border border-white/5 rounded-[40px] shadow-2xl overflow-hidden relative flex flex-col h-full min-h-[400px]">
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-[#08CB00] border-t-transparent animate-spin" />
          <p className="text-[#08CB00] text-[10px] font-black uppercase tracking-widest animate-pulse">Loading jobs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="col-span-12 lg:col-span-8 bg-[#1A1A1A] border border-white/5 rounded-[40px] shadow-2xl overflow-hidden relative flex flex-col h-full min-h-[400px]">
        <div className="flex-1 flex flex-col items-center justify-center gap-2 px-8 text-center">
          <p className="text-red-400 text-xs font-black uppercase tracking-widest">Failed to load jobs</p>
          <p className="text-white/30 text-[10px]">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="col-span-12 lg:col-span-8 bg-[#1A1A1A] border border-white/5 rounded-[40px] shadow-2xl overflow-hidden relative flex flex-col h-full min-h-[500px]">
        {/* Map Header */}
        <div className="absolute top-4 sm:top-6 left-4 sm:left-8 right-4 sm:right-8 z-[1000] flex justify-between items-center pointer-events-none gap-2">
          <div className="bg-black/80 backdrop-blur-xl border border-white/10 px-3 sm:px-5 py-2 sm:py-3 rounded-2xl pointer-events-auto">
            <h3 className="text-white font-black text-xs sm:text-sm tracking-widest uppercase">Live Sector Map</h3>
            <p className="text-[#08CB00] text-[10px] font-black tracking-[0.2em] uppercase mt-0.5 animate-pulse hidden sm:block">Scanning for requests...</p>
          </div>
          <div className="hidden sm:flex bg-black/80 backdrop-blur-xl border border-white/10 items-center gap-3 px-4 py-3 rounded-2xl w-56 lg:w-64 pointer-events-auto shadow-xl">
            <Search size={16} className="text-white/40" />
            <input type="text" placeholder="Search zone..." className="bg-transparent border-none text-xs text-white placeholder-white/30 focus:outline-none w-full font-bold" />
          </div>
        </div>

        {/* Leaflet Map */}
        <div className="flex-1 relative min-h-0">
          <MapContainer
            center={CENTER}
            zoom={13}
            className="w-full h-full"
            style={{ height: '100%', width: '100%', background: '#0A0A0A' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapController selectedTrip={selectedTrip} />

            {visibleJobs.map((job) => (
              <Marker
                key={job.id}
                position={[job.lat, job.lng]}
                icon={createCustomIcon(selectedTrip?.id === job.id, job.type)}
                eventHandlers={{
                  click: () => { setSelectedTrip(job); setShowCard(true); },
                }}
              >
                <Popup>
                  <div className="text-black">
                    <p className="font-bold text-sm">{job.customer}</p>
                    <p className="text-xs text-gray-600">{job.item} · {job.weight} · {job.pay}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Gradient overlay at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent pointer-events-none z-[500]"></div>
        </div>

        {/* Floating Info Card */}
        {showCard && selectedTrip && (
          <div className="absolute bottom-20 left-3 right-3 sm:left-8 sm:right-auto sm:bottom-24 z-[600] bg-black/90 backdrop-blur-3xl border border-white/10 rounded-3xl p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] sm:w-72">
            <button onClick={() => setShowCard(false)} className="absolute top-3 right-3 p-1 rounded-lg hover:bg-white/10 transition-colors">
              <X size={14} className="text-white/40" />
            </button>

            {/* Type badge + distance */}
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${
                selectedTrip.type === 'urgent'
                  ? 'bg-orange-500/10 border-orange-500/20 text-orange-400'
                  : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
              }`}>
                <span className="flex items-center gap-1">
                  {selectedTrip.type === 'urgent' ? <Zap size={9} /> : <CalendarClock size={9} />}
                  {selectedTrip.type === 'urgent' ? 'Urgent Pickup' : 'Scheduled'}
                </span>
              </span>
              <span className="text-white/30 text-[9px] font-bold">{selectedTrip.distance} away</span>
            </div>

            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-black text-base truncate">{selectedTrip.customer}</h4>
                <p className="text-white/40 text-[10px] font-bold mt-0.5">{selectedTrip.item} · {selectedTrip.weight}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xl font-black text-[#08CB00]">{selectedTrip.pay}</span>
              </div>
            </div>

            {/* Pickup → Hub route */}
            <div className="flex items-center gap-2 mb-3 p-2.5 bg-white/5 rounded-xl">
              <div className="flex-1 text-center">
                <p className="text-[8px] text-white/30 uppercase font-bold">Pickup</p>
                <p className="text-[10px] text-white font-black">{selectedTrip.pickup}</p>
              </div>
              <Navigation2 size={12} className="text-white/20 shrink-0" />
              <div className="flex-1 text-center">
                <p className="text-[8px] text-white/30 uppercase font-bold">Deliver to</p>
                <p className="text-[10px] text-white font-black truncate">{selectedTrip.hub}</p>
              </div>
            </div>

            <div className="flex items-center gap-1 mb-4">
              <Clock size={10} className="text-white/30" />
              <span className="text-[9px] text-white/40 font-bold">
                {selectedTrip.type === 'urgent' ? `ETA: ${selectedTrip.eta}` : `Scheduled: ${selectedTrip.scheduledDate}`}
              </span>
            </div>

            <button 
              onClick={handleAcceptJob}
              disabled={isAccepting}
              className={`w-full text-[10px] font-black uppercase tracking-widest py-3 rounded-xl transition-colors ${
              selectedTrip.type === 'urgent'
                ? 'bg-orange-500 text-black hover:bg-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.3)]'
                : 'bg-blue-500 text-white hover:bg-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
            } ${isAccepting ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {isAccepting ? 'Accepting...' : 'Accept Job'}
            </button>
          </div>
        )}

      </div>

      {/* Error Modal */}
      {acceptError && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#1A1A1A] border border-red-500/20 rounded-3xl p-6 shadow-2xl max-w-sm w-full relative">
            <button 
              onClick={() => setAcceptError(null)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X size={16} className="text-white/40" />
            </button>
            <div className="flex flex-col items-center text-center mt-2">
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
                <span className="text-red-500 font-black text-xl">!</span>
              </div>
              <h3 className="text-white font-black text-lg mb-2">Failed to Accept Job</h3>
              <p className="text-white/60 text-sm mb-6">{acceptError}</p>
              <button 
                onClick={() => setAcceptError(null)}
                className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-black uppercase tracking-widest transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
