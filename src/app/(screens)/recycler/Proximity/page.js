"use client"
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import FilterPanel from '@/components/private components/recycler/Proximity/FilterPanel';
import ProximityMap from '@/components/private components/recycler/Proximity/ProximityMap';
import OfferModal from '@/components/private components/recycler/Proximity/OfferModal';

const DEFAULT_CENTER = [-17.8252, 31.0335];

function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) ** 2 + Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * Math.sin(dLng/2) ** 2;
  return parseFloat((R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))).toFixed(2));
}

const ProximityPage = () => {
  const searchParams = useSearchParams();
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const submitId = searchParams.get('submitId');

  const [submissions, setSubmissions] = useState([]);
  const [loadingOffers, setLoadingOffers] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [modalOffer, setModalOffer] = useState(null);
  const [filterRadius, setFilterRadius] = useState(25);
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterDeviceState, setFilterDeviceState] = useState('All');
  const [filterMinWeight, setFilterMinWeight] = useState(0);
  const [filterMaxWeight, setFilterMaxWeight] = useState(50);
  const [filterNewOnly, setFilterNewOnly] = useState(false);
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [declinedIds, setDeclinedIds] = useState([]);

  // Fetch live offers on mount
  useEffect(() => {
    const center = lat && lng ? [parseFloat(lat), parseFloat(lng)] : DEFAULT_CENTER;
    fetch('http://127.0.0.1:8000/dispatch/offers/available', { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.available_offers?.length) {
          const enriched = data.available_offers.map(o => ({
            ...o,
            distance: (o.latitude && o.longitude)
              ? haversineKm(center[0], center[1], o.latitude, o.longitude)
              : null,
            isNew: o.isNew ?? false,
          }));
          setSubmissions(enriched);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingOffers(false));
  }, []);
  
  useEffect(() => {
    if (!submitId) return;
    if (lat && lng) setMapCenter([parseFloat(lat), parseFloat(lng)]);

    const targetId = parseInt(submitId);

    const openOffer = (offer) => {
      setSelectedSubmission(offer);
      setModalOffer(offer);
      setShowOfferModal(true);
    };

    fetch('http://127.0.0.1:8000/recycler/home', { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        const live = data?.incoming_offers?.find(o => o.submit_id === targetId);
        if (live) openOffer(live);
      })
      .catch(() => {});
  }, [lat, lng, submitId]);

  const handleMarkerClick = (submission) => {
    setSelectedSubmission(submission);
    setModalOffer(submission);
    setShowOfferModal(true);
  };

  const handleListClick = (submission) => {
    setSelectedSubmission(submission);
    setModalOffer(submission);
    setShowOfferModal(true);
    setMapCenter([submission.latitude, submission.longitude]);
  };

  const handleResetFilters = () => {
    setFilterRadius(25);
    setFilterCategory('All');
    setFilterDeviceState('All');
    setFilterMinWeight(0);
    setFilterMaxWeight(50);
    setFilterNewOnly(false);
  };

  const filteredSubmissions = submissions.filter(s => {
    if (declinedIds.includes(s.submit_id)) return false;
    const matchesRadius = s.distance == null || s.distance <= filterRadius;
    const matchesCategory = filterCategory === 'All' || s.category === filterCategory;
    const matchesDeviceState = filterDeviceState === 'All' || s.device_state === filterDeviceState;
    const matchesWeight = s.estimated_weight >= filterMinWeight && s.estimated_weight <= filterMaxWeight;
    const matchesNew = !filterNewOnly || s.isNew;
    return matchesRadius && matchesCategory && matchesDeviceState && matchesWeight && matchesNew;
  });

  return (
    <div className="h-screen w-full bg-[#050505] text-white font-sans selection:bg-[#08CB00] overflow-hidden flex flex-col">
      {/* Header Spacer */}
      <div className="h-20 shrink-0"></div>
      
      {/* Offer Modal */}
      {showOfferModal && modalOffer && (
        <OfferModal
          offer={modalOffer}
          onClose={() => setShowOfferModal(false)}
          onDeclineComplete={(submitId) => {
            setDeclinedIds(prev => [...prev, submitId]);
            setShowOfferModal(false);
            setSelectedSubmission(null);
          }}
        />
      )}
      
      {/* Main Content */}
      <div className="flex-1 flex gap-4 p-4 min-h-0">
        {/* Filter Panel / Sidebar */}
        <FilterPanel
          filteredSubmissions={filteredSubmissions}
          selectedSubmission={selectedSubmission}
          filterRadius={filterRadius}
          setFilterRadius={setFilterRadius}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          filterDeviceState={filterDeviceState}
          setFilterDeviceState={setFilterDeviceState}
          filterMinWeight={filterMinWeight}
          setFilterMinWeight={setFilterMinWeight}
          filterMaxWeight={filterMaxWeight}
          setFilterMaxWeight={setFilterMaxWeight}
          filterNewOnly={filterNewOnly}
          setFilterNewOnly={setFilterNewOnly}
          onListClick={handleListClick}
          onResetFilters={handleResetFilters}
        />
        
        {/* Map Area */}
        <ProximityMap
          submissions={filteredSubmissions}
          center={mapCenter}
          onMarkerClick={handleMarkerClick}
          selectedSubmission={selectedSubmission}
        />
      </div>
    </div>
  );
};

export default ProximityPage;
