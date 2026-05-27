"use client"
import React, { useState, useEffect, useCallback } from 'react';
import HeroCardComp from '@/components/private components/receiver/MaterialList/heroCardComp';
import SidebarStats from '@/components/private components/receiver/MaterialList/sidebarStats';
import MaterialRoster from '@/components/private components/receiver/MaterialList/materialRoster';
import ReceiverHeader from '@/components/global components/header/receiverHeader';

const API = 'http://127.0.0.1:8000';

function MaterialListPage() {
  const [completed, setCompleted]   = useState([]);
  const [pending, setPending]       = useState([]);
  const [stats, setStats]           = useState({});
  const [loading, setLoading]       = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [lRes, pRes, sRes] = await Promise.all([
        fetch(`${API}/receiver/ledger`,           { credentials: 'include' }),
        fetch(`${API}/receiver/pending-arrivals`, { credentials: 'include' }),
        fetch(`${API}/receiver/stats`,            { credentials: 'include' }),
      ]);
      const [l, p, s] = await Promise.all([
        lRes.ok ? lRes.json() : {},
        pRes.ok ? pRes.json() : {},
        sRes.ok ? sRes.json() : {},
      ]);
      setCompleted(l.ledger || []);
      setPending(p.arrivals || []);
      setStats(s.stats || s || {});
    } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const allSubmissions = [...pending, ...completed];

  return (
    <div className="w-full h-screen flex flex-col bg-[#121212] font-sans p-4 md:p-8 relative overflow-y-auto scrollbar-thin">
      <div className="fixed inset-0 z-0 bg-[radial-gradient(#08CB00_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.06] pointer-events-none" />

      <ReceiverHeader subHeader="Material List" />

      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 md:px-8 pb-12">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
            <HeroCardComp
              totalBatches={allSubmissions.length}
              completedCount={completed.length}
              pendingCount={pending.length}
              loading={loading}
              onRefresh={fetchAll}
            />
            <MaterialRoster submissions={allSubmissions} loading={loading} />
          </div>
          <SidebarStats submissions={allSubmissions} stats={stats} loading={loading} />
        </div>
      </div>
    </div>
  );
}

export default MaterialListPage;