"use client"
import React, { useState, useEffect, useCallback } from 'react';
import ReceiverHeader from '@/components/global components/header/receiverHeader';
import ActionCenter from '@/components/private components/receiver/Home/actionCenter';
import OperationsLog from '@/components/private components/receiver/Home/operationsLog';

const API = 'http://127.0.0.1:8000';

function ReceiverHomePage() {
  const [homeStats, setHomeStats]       = useState({});
  const [notifications, setNotifications] = useState([]);
  const [activityLog, setActivityLog]   = useState([]);
  const [loading, setLoading]           = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [sRes, nRes, aRes] = await Promise.all([
        fetch(`${API}/receiver/home-stats`,    { credentials: 'include' }),
        fetch(`${API}/receiver/notifications`, { credentials: 'include' }),
        fetch(`${API}/receiver/activity-log`,  { credentials: 'include' }),
      ]);
      const [s, n, a] = await Promise.all([
        sRes.ok ? sRes.json() : {},
        nRes.ok ? nRes.json() : {},
        aRes.ok ? aRes.json() : {},
      ]);
      setHomeStats(s.stats || s || {});
      setNotifications(n.notifications || []);
      setActivityLog(a.activity || a.log || []);
    } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-[#0A0A0A] p-4 md:p-6 font-sans relative text-white">
      
      {/* Background Image & Gradient Overlay (Like image_11.png) */}
      <div className="absolute inset-0 z-0">
        <img src="/img/ReceiverBG.png" alt="Warehouse" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent"></div>
      </div>

      {/* Header (Following image_8.png structure) */}
      <ReceiverHeader subHeader="Home" />

      {/* Main Content Grid */}
      <div className="relative z-10 grid grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* Left Column: Critical Notifications (Like the glassmorphic card in image_11.png) */}
        <ActionCenter notifications={notifications} loading={loading} onRefresh={fetchAll} />
 
        {/* Right Column: Stats & Recent Activity */}
        <OperationsLog homeStats={homeStats} activityLog={activityLog} loading={loading} />


      </div>
    </div>
  );
}

export default ReceiverHomePage;