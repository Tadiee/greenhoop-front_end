"use client"
import React, { useState, useEffect, useCallback } from 'react';
import CourrierHeader from '@/components/global components/header/courrierHeader';
import LeftContainer from '@/components/private components/courrier/Home/leftConatier';
import RightContainer from '@/components/private components/courrier/Home/rightContainer';
import BottomContainer from '@/components/private components/courrier/Home/bottomContainer';
import MiddleContainer from '@/components/private components/courrier/Home/middleContainer';

const API = 'http://127.0.0.1:8000';

function CourierHome() {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({});
  const [fleetStats, setFleetStats] = useState({});
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [jRes, sRes, fRes, aRes] = await Promise.all([
        fetch(`${API}/courier/active-jobs`, { credentials: 'include' }),
        fetch(`${API}/courier/home/stats`, { credentials: 'include' }),
        fetch(`${API}/courier/fleet/stats`, { credentials: 'include' }),
        fetch(`${API}/courier/home/activity`, { credentials: 'include' }),
      ]);
      const [j, s, f, a] = await Promise.all([
        jRes.ok ? jRes.json() : {},
        sRes.ok ? sRes.json() : {},
        fRes.ok ? fRes.json() : {},
        aRes.ok ? aRes.json() : {},
      ]);
      setJobs(j.active_jobs || j.jobs || []);
      setStats(s.stats || s || {});
      setFleetStats(f.stats || f || {});
      setActivity(a.activity || a.events || []);
      setName(s.courier_name || s.name || '');
    } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-[#121212] font-sans relative">
      <div className="fixed inset-0 z-0 bg-[radial-gradient(#08CB00_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.04] pointer-events-none" />

      <CourrierHeader />

      <div className="relative z-10 flex flex-col flex-1 p-4 md:p-6 overflow-y-auto scrollbar-thin min-h-0">
        {/* Greeting Header */}
        <div className="flex items-start justify-between mb-6 shrink-0">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">{greeting}</p>
            <h1 className="text-3xl font-black text-white tracking-tighter mt-1">
              {name ? `Hey, ${name}!` : 'Welcome Back'} <span className="text-[#08CB00]">Ready to roll?</span>
            </h1>
            <p className="text-[10px] text-white/30 mt-1">
              {loading ? 'Loading your dashboard...' : `${jobs.length} active job${jobs.length !== 1 ? 's' : ''} · Fleet ${fleetStats?.active ?? 0} vehicles online`}
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-[#08CB00]/10 border border-[#08CB00]/20 rounded-xl shrink-0">
            <span className="w-2 h-2 bg-[#08CB00] rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-[#08CB00] uppercase tracking-wider">Online</span>
          </div>
        </div>

        {/* Main 3-column grid */}
        <div className="grid grid-cols-12 gap-4 mb-4">
          <LeftContainer jobs={jobs} loading={loading} />
          <MiddleContainer stats={stats} />
          <RightContainer stats={stats} fleetStats={fleetStats} />
        </div>

        {/* Bottom activity + status */}
        <BottomContainer activity={activity} />
      </div>
    </div>
  );
}

export default CourierHome;