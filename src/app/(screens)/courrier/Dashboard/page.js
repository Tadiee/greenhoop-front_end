"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import CourrierHeader from '@/components/global components/header/courrierHeader';
import ExpenditureChart from '@/components/private components/courrier/Dashboard/expenditureChart';
import RiidesAndCustomers from '@/components/private components/courrier/Dashboard/riidesAndcustomers';
import FleetCount from '@/components/private components/courrier/Dashboard/fleetCount';
import DriversCount from '@/components/private components/courrier/Dashboard/driversCount';

const API = 'http://127.0.0.1:8000';

const CourierDashboard = () => {
  const [fleetStats, setFleetStats]   = useState({});
  const [drivers, setDrivers]         = useState([]);
  const [jobs, setJobs]               = useState([]);
  const [homeStats, setHomeStats]     = useState({});
  const [loading, setLoading]         = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [fRes, dRes, jRes, sRes] = await Promise.all([
        fetch(`${API}/courier/fleet/stats`,  { credentials: 'include' }),
        fetch(`${API}/courier/drivers`,      { credentials: 'include' }),
        fetch(`${API}/courier/active-jobs`,  { credentials: 'include' }),
        fetch(`${API}/courier/home/stats`,   { credentials: 'include' }),
      ]);
      const [f, d, j, s] = await Promise.all([
        fRes.ok ? fRes.json() : {},
        dRes.ok ? dRes.json() : {},
        jRes.ok ? jRes.json() : {},
        sRes.ok ? sRes.json() : {},
      ]);
      setFleetStats(f.stats || f || {});
      setDrivers(d.drivers || []);
      setJobs(j.active_jobs || j.jobs || []);
      setHomeStats(s.stats || s || {});
    } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return (
    <div className="w-full bg-[#121212] font-sans relative min-h-screen">
      <div className="fixed inset-0 z-0 bg-[radial-gradient(#08CB00_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.04] pointer-events-none" />

      <CourrierHeader />

      <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pb-12 overflow-y-auto">
        {/* Header row */}
        <div className="flex items-center justify-between py-6">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tighter">Courier <span className="text-[#08CB00]">Dashboard</span></h1>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mt-1">Operations overview · Live data</p>
          </div>
          <button
            onClick={fetchAll}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[11px] font-black text-white/50 hover:bg-white/10 hover:text-white transition-all"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Active Jobs',      value: loading ? '—' : jobs.length,                          color: 'text-[#08CB00]',  bg: 'bg-[#08CB00]/10 border-[#08CB00]/20' },
            { label: 'Completed Today',  value: loading ? '—' : (homeStats.completed_today ?? 0),     color: 'text-blue-400',   bg: 'bg-blue-500/10 border-blue-500/20' },
            { label: 'Fleet Online',     value: loading ? '—' : (fleetStats.active ?? 0),             color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
            { label: "Today's Earnings", value: loading ? '—' : `$${(homeStats.earnings_today ?? 0).toFixed(2)}`, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
          ].map(k => (
            <div key={k.label} className={`border rounded-[24px] p-5 ${k.bg}`}>
              <p className={`text-2xl font-black ${k.color}`}>{k.value}</p>
              <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mt-1">{k.label}</p>
            </div>
          ))}
        </div>

        {/* Main 8/4 grid */}
        <div className="grid grid-cols-12 gap-6 mb-6">
          <div className="col-span-8 flex flex-col gap-6">
            <ExpenditureChart stats={homeStats} loading={loading} />
            <div className="grid grid-cols-2 gap-6">
              <RiidesAndCustomers jobs={jobs} stats={homeStats} loading={loading} />
            </div>
          </div>
          <div className="col-span-4 flex flex-col gap-6">
            <FleetCount fleetStats={fleetStats} loading={loading} />
            <DriversCount drivers={drivers} loading={loading} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourierDashboard;