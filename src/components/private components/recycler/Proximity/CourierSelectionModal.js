"use client"
import React, { useState, useEffect } from 'react';
import {
  Truck,
  Phone,
  Check,
  ChevronLeft,
  Clock,
  Info,
  AlertCircle,
  Package,
  MapPin,
  Loader2,
  RefreshCw,
} from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000';

const CourierSelectionModal = ({ submission, onSelect, onBack, mode = 'assign' }) => {
  const [selectedCourier, setSelectedCourier] = useState(null);
  const [couriers, setCouriers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState(null);

  const fetchCouriers = () => {
    setLoading(true);
    setFetchError(null);
    fetch(`${API_BASE}/courier/nearby-couriers/${submission.submit_id}`, { credentials: 'include' })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(data => {
        if (!data.success) throw new Error(data.error || 'Failed to load couriers');
        const mapped = (data.couriers || []).map(c => ({
          courier_id: c.courier_id,
          courier_name: c.company_name || c.username,
          phone: c.phone_number,
          address: c.address,
          service_area: c.service_area,
          is_online: c.is_online,
          max_capacity: c.max_weight_capacity_kg,
          current_load: c.current_load_kg,
          available_capacity: c.available_capacity_kg,
          distance_km: c.distance_km,
          eta_min: c.eta_min,
          lat: c.latitude,
          lng: c.longitude,
          available: c.is_online,
        }));
        setCouriers(mapped);
      })
      .catch(() => setFetchError('Could not load nearby couriers.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCouriers(); }, []);

  const handleConfirmSelection = async () => {
    if (!selectedCourier || assigning) return;
    setAssigning(true);
    setAssignError(null);
    try {
      const res = await fetch(`${API_BASE}/courier/assign-courier`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submit_id: submission.submit_id,
          courier_user_id: selectedCourier.courier_id,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.success) {
        onSelect({ ...selectedCourier, assignmentResult: data });
      } else {
        setAssignError(data.error || 'Assignment failed. Please try again.');
      }
    } catch {
      setAssignError('Network error. Please try again.');
    } finally {
      setAssigning(false);
    }
  };

  const availableCouriers = couriers.filter(c => c.available);

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
          <h3 className="text-xl font-black text-white">Select Courier</h3>
          <p className="text-xs text-white/40">Choose a courier to collect from the user and deliver to your hub</p>
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-4">
        <div className="flex items-start gap-3">
          <AlertCircle size={20} className="text-blue-400 shrink-0" />
          <div>
            <p className="text-sm font-bold text-blue-400 mb-1">Important Notice</p>
            <p className="text-xs text-white/60">
              Couriers deliver directly to your recycling hub, not to drop-off sites. 
              You'll be notified when the courier collects the item from the user.
            </p>
          </div>
        </div>
      </div>

      {/* Couriers List */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-thin">
        {loading && (
          <div className="flex items-center justify-center py-12 gap-3">
            <Loader2 size={20} className="text-[#08CB00] animate-spin" />
            <span className="text-xs text-white/30">Scanning for available couriers...</span>
          </div>
        )}
        {!loading && fetchError && (
          <div className="flex flex-col items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
            <p className="text-xs font-bold text-red-400">{fetchError}</p>
            <button onClick={fetchCouriers} className="flex items-center gap-1.5 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] text-white/50 hover:bg-white/10 transition-all">
              <RefreshCw size={12} /> Retry
            </button>
          </div>
        )}
        {!loading && !fetchError && availableCouriers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Truck size={28} className="text-white/10" />
            <p className="text-xs text-white/30">No couriers available in your zone right now</p>
            <button onClick={fetchCouriers} className="flex items-center gap-1.5 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] text-white/50 hover:bg-white/10 transition-all">
              <RefreshCw size={12} /> Refresh
            </button>
          </div>
        )}
        {!loading && availableCouriers.map((courier) => {
          const isSelected = selectedCourier?.courier_id === courier.courier_id;
          const capacityPct = courier.max_capacity > 0
            ? Math.round((courier.current_load / courier.max_capacity) * 100)
            : 0;
          return (
            <div
              key={courier.courier_id}
              onClick={() => setSelectedCourier(courier)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-blue-500/10 border-blue-500 ring-1 ring-blue-500'
                  : 'bg-white/[0.02] border-white/10 hover:border-white/30'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-blue-500 text-white' : 'bg-white/5 text-white/40'
                }`}>
                  {isSelected ? <Check size={24} /> : <Truck size={24} />}
                </div>
                <div className="flex-1 min-w-0">
                  {/* Name + online badge */}
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="min-w-0">
                      <h4 className="text-sm font-black text-white truncate">{courier.courier_name}</h4>
                      {courier.service_area && (
                        <p className="text-[9px] text-white/30 truncate">{courier.service_area}</p>
                      )}
                    </div>
                    <span className={`shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black ${
                      courier.is_online ? 'bg-[#08CB00]/10 text-[#08CB00]' : 'bg-white/5 text-white/30'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${courier.is_online ? 'bg-[#08CB00]' : 'bg-white/20'}`} />
                      {courier.is_online ? 'Online' : 'Offline'}
                    </span>
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <span className="flex items-center gap-1 text-[9px] text-white/40">
                      <Clock size={9} className="text-[#08CB00]" /> ~{courier.eta_min}min ETA
                    </span>
                    <span className="flex items-center gap-1 text-[9px] text-white/40">
                      <MapPin size={9} /> {courier.distance_km}km away
                    </span>
                    {courier.phone && (
                      <span className="flex items-center gap-1 text-[9px] text-white/40">
                        <Phone size={9} /> {courier.phone}
                      </span>
                    )}
                  </div>

                  {/* Capacity bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] text-white/25 font-bold uppercase tracking-wider">Capacity</span>
                      <span className="text-[8px] text-white/40 font-mono">{courier.available_capacity}kg free of {courier.max_capacity}kg</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${capacityPct < 60 ? 'bg-[#08CB00]' : capacityPct < 85 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${capacityPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Courier Summary */}
      {selectedCourier && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 mt-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <Package size={20} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{submission.brand_n_model}</p>
              <p className="text-[10px] text-white/60">
                {selectedCourier.courier_name} · ~{selectedCourier.eta_min}min · {selectedCourier.distance_km}km away
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs font-bold text-blue-400">Capacity free</p>
              <p className="text-lg font-black text-white">{selectedCourier.available_capacity}kg</p>
            </div>
          </div>
        </div>
      )}

      {assignError && (
        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
          <AlertCircle size={13} className="text-red-400 shrink-0" />
          <p className="text-[10px] font-bold text-red-400">{assignError}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={onBack}
          className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white/60 hover:bg-white/10 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleConfirmSelection}
          disabled={!selectedCourier || assigning}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black uppercase tracking-wider transition-colors ${
            selectedCourier && !assigning
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-white/10 text-white/40 cursor-not-allowed'
          }`}
        >
          {assigning ? <><Loader2 size={14} className="animate-spin" /> Assigning...</> : selectedCourier ? 'Confirm Courier' : 'Select a Courier'}
        </button>
      </div>

      {/* Info Footer */}
      <div className="flex items-start gap-2 text-[10px] text-white/30 mt-4">
        <Info size={14} className="shrink-0 mt-0.5" />
        <p>
          Courier collects from the user within the stated ETA. You'll receive real-time tracking updates. 
          Payment is processed once the courier confirms pickup.
        </p>
      </div>
    </div>
  );
};

export default CourierSelectionModal;
