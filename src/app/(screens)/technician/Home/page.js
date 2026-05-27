"use client"
import React, { useState, useEffect, useCallback } from 'react';
import LeftContainer from '@/components/private components/technician/Home/leftContainer';
import RecentActivity from '@/components/private components/technician/Home/recentActivity';
import UtilityButtons from '@/components/private components/technician/Home/utilityButtons';

const API = 'http://127.0.0.1:8000';

const DUMMY_STATS = { wallet_balance: 240, spent_today: 60, pending_payment: 30, purchased_today: 3 };

const DUMMY_QUEUE = [
  { listing_id: 'L001', item_name: 'iPhone 13 Pro', category: 'Phones',    source_type: 'user',        asking_price: 45,  estimated_weight: 0.2, status: 'available' },
  { listing_id: 'L002', item_name: 'Dell XPS 15',   category: 'Laptops',   source_type: 'marketplace', asking_price: 120, estimated_weight: 1.8, status: 'available' },
  { listing_id: 'L003', item_name: 'MacBook Battery',category: 'Batteries', source_type: 'dispatch',    asking_price: 20,  estimated_weight: 0.5, status: 'reserved'  },
  { listing_id: 'L004', item_name: 'Samsung Tab S7', category: 'Tablets',   source_type: 'user',        asking_price: 55,  estimated_weight: 0.4, status: 'available' },
];

const DUMMY_PURCHASES = [
  { id: 'P001', item_name: 'Huawei P30',      category: 'Phones',   source_type: 'user',        price: 35,  time_ago: '2h ago'   },
  { id: 'P002', item_name: 'Lenovo ThinkPad', category: 'Laptops',  source_type: 'marketplace', price: 95,  time_ago: '5h ago'   },
  { id: 'P003', item_name: 'iPad Mini 5',     category: 'Tablets',  source_type: 'dispatch',    price: 40,  time_ago: 'Yesterday'},
];

const TechnicianHome = () => {
  const [dashStats, setDashStats]       = useState({});
  const [purchaseQueue, setPurchaseQueue] = useState([]);
  const [recentPurchases, setRecentPurchases] = useState([]);
  const [loading, setLoading]           = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [sRes, qRes, rRes] = await Promise.all([
        fetch(`${API}/technician/dashboard-stats`,   { credentials: 'include' }),
        fetch(`${API}/technician/purchase-queue`,    { credentials: 'include' }),
        fetch(`${API}/technician/recent-purchases`,  { credentials: 'include' }),
      ]);
      const [s, q, r] = await Promise.all([
        sRes.ok ? sRes.json() : {},
        qRes.ok ? qRes.json() : {},
        rRes.ok ? rRes.json() : {},
      ]);
      setDashStats(s.stats || s?.wallet_balance != null ? s : DUMMY_STATS);
      setPurchaseQueue(q.queue || q.items || DUMMY_QUEUE);
      setRecentPurchases(r.purchases || r.items || DUMMY_PURCHASES);
    } catch {
      setDashStats(DUMMY_STATS);
      setPurchaseQueue(DUMMY_QUEUE);
      setRecentPurchases(DUMMY_PURCHASES);
    }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return (
    <div className="min-h-screen lg:h-screen w-full bg-[#080A08] text-white font-sans selection:bg-[#08CB00] overflow-y-auto lg:overflow-hidden p-2 md:p-5 flex flex-col relative scrollbar-thin">
      <div className="h-24 shrink-0" />
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-5 relative z-10 pb-6 lg:pb-0">
        <div className="col-span-1 lg:col-span-7 min-h-0 flex flex-col min-h-[600px] lg:min-h-0">
          <LeftContainer
            purchaseQueue={purchaseQueue}
            recentPurchases={recentPurchases}
            dashStats={dashStats}
            loading={loading}
            onRefresh={fetchAll}
          />
        </div>
        <div className="col-span-1 lg:col-span-5 flex flex-col gap-5 min-h-0">
          <RecentActivity recentPurchases={recentPurchases} loading={loading} />
          <UtilityButtons dashStats={dashStats} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default TechnicianHome;