"use client"
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import FilterPanel from '@/components/private components/technician/Service/filterPanel';
import RecommendedBuys from '@/components/private components/technician/Service/recommendedBuys';
import ItemDetailCard, { TechNotificationPanel, TechActiveQueue } from '@/components/private components/technician/Service/itemDetailCard';
import { Search, RefreshCw, Loader2 } from 'lucide-react';

const TechMap = dynamic(
  () => import('@/components/private components/technician/Service/techMap'),
  { ssr: false, loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-black/40 rounded-[32px]">
      <Loader2 size={24} className="text-[#08CB00] animate-spin" />
    </div>
  )}
);

const API = 'http://127.0.0.1:8000';
const NOTIF_POLL_MS = 15000;

const DUMMY_LISTINGS = [
  { listing_id: 'L001', item_name: 'iPhone 13 Pro',    category: 'Phones',     source_type: 'user',        asking_price: 45,  estimated_weight: 0.2, device_state: 'good', distance: 1.2, latitude: -17.820, longitude: 31.030, salvage_value: 80,  market_value: 120 },
  { listing_id: 'L002', item_name: 'Dell XPS 15',      category: 'Laptops',    source_type: 'marketplace', asking_price: 120, estimated_weight: 1.8, device_state: 'fair', distance: 2.8, latitude: -17.828, longitude: 31.038, salvage_value: 200, market_value: 350 },
  { listing_id: 'L003', item_name: 'MacBook Battery',  category: 'Batteries',  source_type: 'dispatch',    asking_price: 20,  estimated_weight: 0.5, device_state: 'poor', distance: 0.9, latitude: -17.823, longitude: 31.025, salvage_value: 35,  market_value: 60  },
  { listing_id: 'L004', item_name: 'Samsung Tab S7',   category: 'Tablets',    source_type: 'user',        asking_price: 55,  estimated_weight: 0.4, device_state: 'good', distance: 3.5, latitude: -17.832, longitude: 31.044, salvage_value: 95,  market_value: 180 },
  { listing_id: 'L005', item_name: 'Lenovo ThinkPad',  category: 'Laptops',    source_type: 'marketplace', asking_price: 95,  estimated_weight: 2.1, device_state: 'fair', distance: 4.1, latitude: -17.815, longitude: 31.050, salvage_value: 160, market_value: 280 },
  { listing_id: 'L006', item_name: 'Huawei P30 Lite',  category: 'Phones',     source_type: 'user',        asking_price: 30,  estimated_weight: 0.2, device_state: 'fair', distance: 1.7, latitude: -17.836, longitude: 31.022, salvage_value: 55,  market_value: 90  },
  { listing_id: 'L007', item_name: 'LG Washing Machine',category: 'Appliances', source_type: 'dispatch',    asking_price: 40,  estimated_weight: 8.5, device_state: 'poor', distance: 5.0, latitude: -17.810, longitude: 31.035, salvage_value: 70,  market_value: 100 },
  { listing_id: 'L008', item_name: 'iPad Mini 5',      category: 'Tablets',    source_type: 'user',        asking_price: 60,  estimated_weight: 0.3, device_state: 'good', distance: 2.2, latitude: -17.826, longitude: 31.055, salvage_value: 110, market_value: 200 },
];

const DEFAULT_FILTERS = {
  category: 'All', source: 'all',
  maxPrice: '', radiusKm: 10, minWeight: '', maxWeight: '',
};

const TechnicianService = () => {
  const [listings, setListings]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [selectedItem, setSelectedItem]     = useState(null);
  const [notifications, setNotifications]   = useState([]);
  const [notifLoading, setNotifLoading]     = useState(false);
  const [queue, setQueue]                   = useState([]);
  const [queueLoading, setQueueLoading]     = useState(false);
  const [filters, setFilters]         = useState(DEFAULT_FILTERS);
  const [search, setSearch]           = useState('');

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/technician/nearby-listings`, { credentials: 'include' });
      if (res.ok) {
        const d = await res.json();
        setListings(d.listings || d.items || DUMMY_LISTINGS);
      } else {
        setListings(DUMMY_LISTINGS);
      }
    } catch {
      setListings(DUMMY_LISTINGS);
    }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchListings(); }, [fetchListings]);

  const filtered = useMemo(() => {
    return listings.filter(item => {
      if (filters.category !== 'All' && item.category?.toLowerCase() !== filters.category.toLowerCase()) return false;
      if (filters.source !== 'all' && item.source_type !== filters.source) return false;
      if (filters.maxPrice && item.asking_price > Number(filters.maxPrice)) return false;
      if (filters.minWeight && item.estimated_weight < Number(filters.minWeight)) return false;
      if (filters.maxWeight && item.estimated_weight > Number(filters.maxWeight)) return false;
      if (filters.radiusKm && item.distance != null && item.distance > filters.radiusKm) return false;
      if (search) {
        const q = search.toLowerCase();
        if (![item.item_name, item.brand_n_model, item.category].join(' ').toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [listings, filters, search]);

  const fetchQueue = useCallback(async () => {
    try {
      const res = await fetch(`${API}/technician/in-transit`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setQueue(data.submissions || []);
      }
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    setQueueLoading(true);
    fetchQueue().finally(() => setQueueLoading(false));
    const id = setInterval(fetchQueue, NOTIF_POLL_MS);
    return () => clearInterval(id);
  }, [fetchQueue]);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch(`${API}/technician/notifications/recent-activity?limit=10`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.activities || []);
      }
    } catch { /* silent — panel shows empty state */ }
  }, []);

  useEffect(() => {
    setNotifLoading(true);
    fetchNotifications().finally(() => setNotifLoading(false));
    const id = setInterval(fetchNotifications, NOTIF_POLL_MS);
    return () => clearInterval(id);
  }, [fetchNotifications]);

  const handleBuy = useCallback(async (item) => {
    await fetch(`${API}/technician/purchase`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listing_id: item.listing_id, submit_id: item.submit_id }),
    });
  }, []);

  return (
    <div className="min-h-screen lg:h-screen w-full bg-[#080A08] text-white font-sans selection:bg-[#08CB00] overflow-y-auto lg:overflow-hidden p-2 md:p-4 flex flex-col relative scrollbar-thin">

      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#08CB00]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="h-20 shrink-0" />

      {/* Search bar + refresh */}
      <div className="flex items-center gap-3 mb-4 shrink-0 relative z-10">
        <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
          <Search size={14} className="text-white/30 shrink-0" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search items, categories..."
            className="bg-transparent text-sm font-bold text-white placeholder-white/20 focus:outline-none w-full"
          />
        </div>
        <button onClick={fetchListings}
          className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all shrink-0">
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Main 3-column grid */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4 relative z-10 pb-6 lg:pb-0">

        {/* LEFT: Filters + Recommended */}
        <div className="col-span-1 lg:col-span-3 flex flex-col gap-4 min-h-0 overflow-y-auto scrollbar-none">
          <FilterPanel filters={filters} onChange={setFilters} resultCount={filtered.length} />
          <RecommendedBuys listings={filtered} loading={loading} onSelect={setSelectedItem} />
        </div>

        {/* CENTER: Map */}
        <div className="col-span-1 lg:col-span-6 relative rounded-[32px] overflow-hidden border border-white/5 shadow-2xl h-[60vw] min-h-[340px] lg:h-auto lg:min-h-0">
          <TechMap
            listings={filtered}
            selectedItem={selectedItem}
            onMarkerClick={setSelectedItem}
            radiusKm={filters.radiusKm}
          />

          {/* Map overlay: item count badge */}
          <div className="absolute top-4 left-4 z-[500] bg-black/70 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-2 flex items-center gap-2">
            {loading
              ? <Loader2 size={12} className="text-[#08CB00] animate-spin" />
              : <span className="w-2 h-2 rounded-full bg-[#08CB00] shadow-[0_0_8px_#08CB00]" />
            }
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
              {loading ? 'Loading...' : `${filtered.length} items nearby`}
            </span>
          </div>

          {/* Radius badge */}
          <div className="absolute top-4 right-4 z-[500] bg-black/70 backdrop-blur-md border border-white/10 rounded-2xl px-3 py-2">
            <span className="text-[10px] font-black text-[#08CB00] uppercase tracking-widest">{filters.radiusKm}km radius</span>
          </div>
        </div>

        {/* RIGHT: Item detail + notifications + queue */}
        <div className="col-span-1 lg:col-span-3 flex flex-col gap-4 min-h-0 overflow-y-auto scrollbar-thin pb-4">
          <ItemDetailCard
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            onBuy={handleBuy}
          />
          <TechActiveQueue
            submissions={queue}
            loading={queueLoading}
            onRefresh={fetchQueue}
          />
          <TechNotificationPanel
            notifications={notifications}
            loading={notifLoading}
          />
        </div>

      </div>
    </div>
  );
};

export default TechnicianService;