"use client"
import React, { useState, useEffect } from 'react';
import { 
  MapPin,
  Clock,
  Check,
  ChevronLeft,
  Building2,
  AlertTriangle,
  Package,
  Navigation,
  Info,
  Loader2
} from 'lucide-react';

const DropOffSitesModal = ({ submission, onSelect, onBack }) => {
  const [selectedSite, setSelectedSite] = useState(null);
  const [hoveredSite, setHoveredSite] = useState(null);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/recycler/drop-off-points', { credentials: 'include' })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(data => {
        const normalised = (data.drop_off_sites || []).map(s => ({
          site_id: s.drop_off_id,
          name: s.name,
          address: s.address,
          latitude: s.latitude,
          longitude: s.longitude,
          status: (s.status || '').toUpperCase(),
          capacity: {
            current: s.current_load_kg ?? 0,
            max: s.capacity_kg ?? 100,
            unit: 'kg',
          },
          operating_hours: s.operating_hours,
          accepted_categories: s.accepted_categories || [],
          geofence_radius: s.geofence_radius,
          notes: s.notes,
        }));
        setSites(normalised);
      })
      .catch(() => setFetchError('Could not load drop-off sites.'))
      .finally(() => setLoading(false));
  }, []);

  const getCapacityPercentage = (current, max) => {
    return (current / max) * 100;
  };

  const getCapacityColor = (percentage) => {
    if (percentage < 60) return 'bg-[#08CB00]';
    if (percentage < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusBadge = (status) => {
    const configs = {
      'ACTIVE': { bg: 'bg-[#08CB00]/20', text: 'text-[#08CB00]', label: 'Active' },
      'NEAR_CAPACITY': { bg: 'bg-yellow-500/20', text: 'text-yellow-500', label: 'Near Capacity' },
      'MAINTENANCE': { bg: 'bg-red-500/20', text: 'text-red-500', label: 'Maintenance' },
      'CLOSED': { bg: 'bg-white/10', text: 'text-white/40', label: 'Closed' }
    };
    const config = configs[status] || configs['CLOSED'];
    return (
      <span className={`px-2 py-1 rounded-lg text-[9px] font-bold ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const handleConfirmSelection = async () => {
    if (!selectedSite || assigning) return;
    setAssigning(true);
    setAssignError(null);
    try {
      const res = await fetch('http://127.0.0.1:8000/recycler/drop-off-points/assign', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submit_id: submission.submit_id,
          drop_off_point_id: selectedSite.site_id,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Assignment failed');
      }
      onSelect({ ...selectedSite, assignmentResult: data });
    } catch (e) {
      setAssignError(e.message || 'Could not assign site. Please try again.');
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-white/5 rounded-xl transition-colors"
        >
          <ChevronLeft size={24} className="text-white/60" />
        </button>
        <div>
          <h3 className="text-xl font-black text-white">Select Drop-off Site</h3>
          <p className="text-xs text-white/40">Choose where the user should deliver this submission</p>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <Navigation size={18} className="text-[#08CB00]" />
          <span className="text-sm font-bold text-white">Your Sites ({sites.length})</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[10px] text-white/40">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#08CB00]"></div>
            <span>Active & Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <span>Near Capacity</span>
          </div>
        </div>
      </div>

      {/* Sites List */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-thin">
        {loading && (
          <div className="flex items-center justify-center py-12 gap-3">
            <Loader2 size={20} className="text-[#08CB00] animate-spin" />
            <span className="text-xs text-white/30">Loading sites...</span>
          </div>
        )}
        {!loading && fetchError && (
          <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
            <AlertTriangle size={16} className="text-red-400" />
            <p className="text-xs font-bold text-red-400">{fetchError}</p>
          </div>
        )}
        {!loading && !fetchError && sites.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Building2 size={28} className="text-white/10" />
            <p className="text-xs text-white/30">No drop-off sites found</p>
          </div>
        )}
        {!loading && sites.map((site) => {
          const isSelected = selectedSite?.site_id === site.site_id;
          const isUnavailable = site.status === 'MAINTENANCE' || site.status === 'CLOSED';
          const capacityPct = getCapacityPercentage(site.capacity.current, site.capacity.max);

          return (
            <div
              key={site.site_id}
              onClick={() => !isUnavailable && setSelectedSite(site)}
              onMouseEnter={() => setHoveredSite(site)}
              onMouseLeave={() => setHoveredSite(null)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                isSelected 
                  ? 'bg-[#08CB00]/10 border-[#08CB00] ring-1 ring-[#08CB00]' 
                  : isUnavailable
                    ? 'bg-white/[0.02] border-white/5 opacity-50 cursor-not-allowed'
                    : 'bg-white/[0.02] border-white/10 hover:border-white/30'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-[#08CB00] text-black' : 'bg-white/5 text-white/40'
                }`}>
                  {isSelected ? <Check size={24} /> : <Building2 size={24} />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="text-sm font-black text-white truncate">{site.name}</h4>
                      <p className="text-[10px] text-white/40 truncate">{site.address}</p>
                    </div>
                    {getStatusBadge(site.status)}
                  </div>

                  {/* Hours & Location */}
                  <div className="flex items-center gap-4 mb-3">
                    {site.operating_hours && (
                      <div className="flex items-center gap-1">
                        <Clock size={12} className="text-white/40" />
                        <span className="text-[10px] text-white/40">{site.operating_hours}</span>
                      </div>
                    )}
                    {site.latitude && site.longitude && (
                      <div className="flex items-center gap-1">
                        <MapPin size={12} className="text-[#08CB00]" />
                        <span className="text-xs font-bold text-white/60">{site.latitude.toFixed(4)}, {site.longitude.toFixed(4)}</span>
                      </div>
                    )}
                  </div>

                  {/* Capacity Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-white/40">Capacity</span>
                      <span className="text-white/60">
                        {site.capacity.current}/{site.capacity.max} {site.capacity.unit}
                      </span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${getCapacityColor(capacityPct)}`}
                        style={{ width: `${capacityPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Accepted Categories */}
                  {site.accepted_categories?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {site.accepted_categories.map((cat, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-white/5 rounded-lg text-[9px] text-white/50 capitalize"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Notes - show on hover/select */}
                  {(hoveredSite?.site_id === site.site_id || isSelected) && site.notes && (
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <div className="flex items-center gap-2 text-[10px] text-white/60">
                        <Info size={12} />
                        <span>{site.notes}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Unavailable Warning */}
              {isUnavailable && (
                <div className="mt-3 flex items-center gap-2 text-[10px] text-red-400 bg-red-500/10 p-2 rounded-lg">
                  <AlertTriangle size={14} />
                  <span>This site is currently unavailable for new deliveries</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Site Summary */}
      {selectedSite && (
        <div className="bg-[#08CB00]/10 border border-[#08CB00]/20 rounded-2xl p-4 mt-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#08CB00] rounded-xl flex items-center justify-center">
              <Package size={20} className="text-black" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-white">{submission.brand_n_model}</p>
              <p className="text-[10px] text-white/60">Will be delivered to {selectedSite.name}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-[#08CB00]">User pays</p>
              <p className="text-lg font-black text-white">$0.00</p>
            </div>
          </div>
        </div>
      )}

      {/* Assignment Error */}
      {assignError && (
        <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
          <AlertTriangle size={14} className="text-red-400 shrink-0 mt-0.5" />
          <p className="text-[10px] text-red-400">{assignError}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={onBack}
          disabled={assigning}
          className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white/60 hover:bg-white/10 transition-colors disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={handleConfirmSelection}
          disabled={!selectedSite || assigning}
          className={`flex-1 py-3 rounded-xl text-sm font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-2 ${
            selectedSite && !assigning
              ? 'bg-[#08CB00] text-black hover:bg-[#08CB00]/80'
              : 'bg-white/10 text-white/40 cursor-not-allowed'
          }`}
        >
          {assigning
            ? <><Loader2 size={14} className="animate-spin" /> Assigning...</>
            : selectedSite ? 'Confirm Site' : 'Select a Site'
          }
        </button>
      </div>

      {/* Info Footer */}
      <div className="flex items-start gap-2 text-[10px] text-white/30 mt-4">
        <Info size={14} className="shrink-0 mt-0.5" />
        <p>The user will be notified of your chosen drop-off location and must deliver within 48 hours. You'll receive confirmation when the item is dropped off.</p>
      </div>
    </div>
  );
};

export default DropOffSitesModal;
