"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { Truck, Users, Link2, LayoutDashboard, RefreshCw } from 'lucide-react';
import FleetOverview from '@/components/private components/courrier/VehicleManagement/fleetOverview';
import DriversPanel from '@/components/private components/courrier/VehicleManagement/driversPanel';
import VehiclesPanel from '@/components/private components/courrier/VehicleManagement/vehiclesPanel';
import AssignmentsPanel from '@/components/private components/courrier/VehicleManagement/assignmentsPanel';

const TABS = [
  { key: 'fleet',       label: 'Fleet',       icon: LayoutDashboard },
  { key: 'vehicles',    label: 'Vehicles',     icon: Truck },
  { key: 'drivers',     label: 'Drivers',      icon: Users },
  { key: 'assignments', label: 'Assignments',  icon: Link2 },
];

const API = 'http://127.0.0.1:8000';

function VehicleManagementPage() {
  const [tab, setTab] = useState('fleet');
  const [stats, setStats] = useState({});
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const uid = typeof window !== 'undefined' ? localStorage.getItem('user_id') : null;
      const q = uid ? `courier_user_id=${uid}` : '';
      const [sRes, vRes, dRes, aRes] = await Promise.all([
        fetch(`${API}/courier/fleet/stats`, { credentials: 'include' }),
        fetch(`${API}/courier/vehicles`, { credentials: 'include' }),
        fetch(`${API}/courier/drivers`, { credentials: 'include' }),
        fetch(`${API}/courier/vehicles/assignments`, { credentials: 'include' }),
      ]);
      const [s, v, d, a] = await Promise.all([
        sRes.ok ? sRes.json() : {},
        vRes.ok ? vRes.json() : {},
        dRes.ok ? dRes.json() : {},
        aRes.ok ? aRes.json() : {},
      ]);
      setStats(s.stats || s || {});
      setVehicles(v.vehicles || []);
      setDrivers(d.drivers || []);
      setAssignments(a.assignments || []);
    } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return (
    <div className="h-[90%] w-full flex flex-col overflow-hidden bg-[#121212] font-sans relative">
      <div className="fixed inset-0 z-0 bg-[radial-gradient(#08CB00_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.04] pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full p-4 md:p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 shrink-0">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tighter">Fleet <span className="text-[#08CB00]">Command</span></h1>
            <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.2em] mt-1">Vehicle & Driver Management</p>
          </div>
          <button
            onClick={fetchAll}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[11px] font-black text-white/50 hover:bg-white/10 hover:text-white transition-all"
          >
            <RefreshCw size={13} /> Refresh
          </button>
        </div>

        {/* Fleet Overview KPI Strip */}
        <div className="shrink-0">
          <FleetOverview stats={stats} />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 shrink-0 p-1 bg-black/40 border border-white/5 rounded-2xl mb-4 w-fit">
          {TABS.map(t => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${
                  active ? 'bg-[#08CB00] text-black' : 'text-white/30 hover:text-white'
                }`}
              >
                <Icon size={13} /> {t.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin bg-white/[0.015] border border-white/5 rounded-[32px] p-6">
          {tab === 'fleet' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick stats panels */}
                <div className="bg-black/30 border border-white/5 rounded-[24px] p-5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-4">Vehicle Breakdown</p>
                  <div className="space-y-3">
                    {[
                      { label: 'Active', count: stats.active ?? 0, color: 'bg-[#08CB00]' },
                      { label: 'Inactive', count: stats.inactive ?? 0, color: 'bg-white/20' },
                      { label: 'Maintenance', count: stats.maintenance ?? 0, color: 'bg-yellow-500' },
                    ].map(item => {
                      const total = stats.total_vehicles || 1;
                      const pct = Math.round((item.count / total) * 100);
                      return (
                        <div key={item.label}>
                          <div className="flex justify-between text-[10px] text-white/40 mb-1">
                            <span className="font-bold">{item.label}</span>
                            <span className="font-mono">{item.count} <span className="text-white/20">({pct}%)</span></span>
                          </div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${item.color}`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="bg-black/30 border border-white/5 rounded-[24px] p-5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-4">Driver Status</p>
                  <div className="space-y-3">
                    {[
                      { label: 'Assigned', count: assignments.length, color: 'bg-blue-500' },
                      { label: 'Unassigned', count: Math.max(0, (stats.total_drivers ?? drivers.length) - assignments.length), color: 'bg-white/20' },
                    ].map(item => {
                      const total = stats.total_drivers || drivers.length || 1;
                      const pct = Math.round((item.count / total) * 100);
                      return (
                        <div key={item.label}>
                          <div className="flex justify-between text-[10px] text-white/40 mb-1">
                            <span className="font-bold">{item.label}</span>
                            <span className="font-mono">{item.count} <span className="text-white/20">({pct}%)</span></span>
                          </div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${item.color}`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setTab('vehicles')} className="flex-1 py-4 bg-[#08CB00]/10 border border-[#08CB00]/20 rounded-2xl text-[11px] font-black text-[#08CB00] uppercase tracking-wider hover:bg-[#08CB00]/20 transition-all flex items-center justify-center gap-2">
                  <Truck size={14} /> Manage Vehicles
                </button>
                <button onClick={() => setTab('drivers')} className="flex-1 py-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-[11px] font-black text-blue-400 uppercase tracking-wider hover:bg-blue-500/20 transition-all flex items-center justify-center gap-2">
                  <Users size={14} /> Manage Drivers
                </button>
                <button onClick={() => setTab('assignments')} className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-black text-white/50 uppercase tracking-wider hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                  <Link2 size={14} /> View Assignments
                </button>
              </div>
            </div>
          )}
          {tab === 'vehicles' && (
            <VehiclesPanel vehicles={vehicles} loading={loading} onRefresh={fetchAll} />
          )}
          {tab === 'drivers' && (
            <DriversPanel drivers={drivers} loading={loading} onRefresh={fetchAll} />
          )}
          {tab === 'assignments' && (
            <AssignmentsPanel
              drivers={drivers}
              vehicles={vehicles}
              assignments={assignments}
              loading={loading}
              onRefresh={fetchAll}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default VehicleManagementPage;