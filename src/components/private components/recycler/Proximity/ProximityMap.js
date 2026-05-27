"use client"
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Navigation, Eye, EyeOff } from 'lucide-react';

// Dynamic import of RecyclerMap to avoid SSR issues
const RecyclerMap = dynamic(() => import('@/components/private components/recycler/Home/RecyclerMap'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-black/40 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-[#08CB00]/20 border-t-[#08CB00] rounded-full animate-spin"></div>
        <span className="text-[10px] font-bold text-white/30 uppercase tracking-wider">Loading Map...</span>
      </div>
    </div>
  ),
});

const ProximityMap = ({
  submissions,
  center,
  onMarkerClick,
  selectedSubmission,
  onLocationFound
}) => {
  const [userLocation, setUserLocation] = useState(null);
  const [showUserLocation, setShowUserLocation] = useState(true);

  const handleLocationFound = (location) => {
    setUserLocation(location);
    if (onLocationFound) {
      onLocationFound(location);
    }
  };

  return (
    <div className="flex-1 bg-white/[0.02] border border-white/10 rounded-[32px] overflow-hidden relative">
      <RecyclerMap 
        submissions={submissions}
        center={center}
        onMarkerClick={onMarkerClick}
        selectedSubmission={selectedSubmission}
        onLocationFound={handleLocationFound}
        showUserLocation={showUserLocation}
        grayscale={false}
      />
      
      {/* Map Overlay - Location Info */}
      <div className="absolute top-4 left-4 z-[10] flex flex-col gap-2">
        <div className="bg-black/80 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3">
          <div className="flex items-center gap-2">
            <Navigation size={14} className="text-[#08CB00]" />
            <span className="text-[10px] font-bold text-white/60">Harare, Zimbabwe</span>
          </div>
        </div>
        {userLocation && (
          <button
            onClick={() => setShowUserLocation(v => !v)}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl backdrop-blur-sm border transition-all ${
              showUserLocation
                ? 'bg-blue-500/20 border-blue-500/30 text-blue-400'
                : 'bg-black/60 border-white/10 text-white/30'
            }`}
          >
            {showUserLocation ? <Eye size={12} /> : <EyeOff size={12} />}
            <span className="text-[10px] font-bold">
              {showUserLocation ? 'Your Location' : 'Location Hidden'}
            </span>
          </button>
        )}
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[10] bg-black/80 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#08CB00] border border-white/20"></div>
            <span className="text-[9px] font-bold text-white/60">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#666] border border-white/20"></div>
            <span className="text-[9px] font-bold text-white/60">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#08CB00] border border-white flex items-center justify-center">
              <span className="text-[6px] font-black text-black">N</span>
            </div>
            <span className="text-[9px] font-bold text-white/60">New Submission</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white"></div>
            <span className="text-[9px] font-bold text-white/60">Your Location</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProximityMap;
