"use client"
import React, { useState } from 'react';
import { Link2, Loader2, User, Truck, Check, AlertCircle, RefreshCw } from 'lucide-react';

export default function AssignmentsPanel({ drivers, vehicles, assignments, loading, onRefresh }) {
  const [driverId, setDriverId] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveDone, setSaveDone] = useState(false);

  const unassignedVehicles = (vehicles || []).filter(v => !v.assigned_driver);
  const unassignedDrivers = (drivers || []).filter(d =>
    !(assignments || []).some(a => a.driver_id === d.id)
  );

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!driverId || !vehicleId) return;
    setSaving(true);
    setSaveError(null);
    setSaveDone(false);
    try {
      const res = await fetch('http://127.0.0.1:8000/courier/vehicles/assign-driver', {
        method: 'POST',
        credentials: 'include',
        // headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driver_id: parseInt(driverId), vehicle_id: parseInt(vehicleId) }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Assignment failed.');
      setSaveDone(true);
      setDriverId('');
      setVehicleId('');
      onRefresh();
      setTimeout(() => setSaveDone(false), 3000);
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUnassign = async (assignmentId) => {
    try {
      await fetch(`http://127.0.0.1:8000/courier/vehicles/unassign/${assignmentId}`, {
        method: 'DELETE',
        credentials: 'include',
      }).then(r => r.json());
      onRefresh();
    } catch {}
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Assign Form */}
      <div className="bg-white/[0.02] border border-white/10 rounded-[28px] p-5">
        <div className="flex items-center gap-2 mb-4">
          <Link2 size={14} className="text-[#08CB00]" />
          <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Assign Driver to Vehicle</p>
        </div>
        <form onSubmit={handleAssign} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1 block">Driver</label>
            <select
              value={driverId}
              onChange={e => setDriverId(e.target.value)}
              required
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-[11px] text-white outline-none focus:border-[#08CB00]/50"
            >
              <option value="">Select driver...</option>
              {unassignedDrivers.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1 block">Vehicle</label>
            <select
              value={vehicleId}
              onChange={e => setVehicleId(e.target.value)}
              required
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-[11px] text-white outline-none focus:border-[#08CB00]/50"
            >
              <option value="">Select vehicle...</option>
              {unassignedVehicles.map(v => (
                <option key={v.id} value={v.id}>{v.vehicle_id_tag} — {v.make_model}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={saving || !driverId || !vehicleId}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#08CB00] text-black rounded-xl text-[11px] font-black uppercase tracking-wider hover:bg-[#08CB00]/80 transition-colors disabled:opacity-40 whitespace-nowrap"
            >
              {saving ? <Loader2 size={12} className="animate-spin" /> : <Link2 size={12} />}
              {saving ? 'Assigning...' : 'Assign'}
            </button>
          </div>
        </form>

        {saveError && (
          <div className="flex items-center gap-2 mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
            <AlertCircle size={12} className="text-red-400 shrink-0" />
            <p className="text-[10px] text-red-400 font-bold">{saveError}</p>
          </div>
        )}
        {saveDone && (
          <div className="flex items-center gap-2 mt-3 p-3 bg-[#08CB00]/10 border border-[#08CB00]/20 rounded-xl">
            <Check size={12} className="text-[#08CB00] shrink-0" />
            <p className="text-[10px] text-[#08CB00] font-bold">Driver assigned successfully!</p>
          </div>
        )}
      </div>

      {/* Active Assignments */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Active Assignments</p>
          <button onClick={onRefresh} className="flex items-center gap-1 text-[9px] text-white/30 hover:text-white transition-colors">
            <RefreshCw size={10} /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10 gap-2">
            <Loader2 size={16} className="text-[#08CB00] animate-spin" />
            <span className="text-[10px] text-white/30">Loading...</span>
          </div>
        ) : !assignments || assignments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <Link2 size={24} className="text-white/10" />
            <p className="text-[10px] text-white/20">No assignments yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {assignments.map((a, i) => (
              <div key={a.assignment_id || i} className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-white/15 transition-all group">
                {/* Driver */}
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                    <User size={14} className="text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-black text-white truncate">{a.driver_name}</p>
                    <p className="text-[9px] text-white/30">Driver</p>
                  </div>
                </div>

                {/* Link icon */}
                <div className="w-6 h-6 rounded-full bg-[#08CB00]/10 border border-[#08CB00]/20 flex items-center justify-center shrink-0">
                  <Link2 size={10} className="text-[#08CB00]" />
                </div>

                {/* Vehicle */}
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <Truck size={14} className="text-white/50" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-black text-white truncate">{a.vehicle_id_tag} {a.plate_number && `· ${a.plate_number}`}</p>
                    <p className="text-[9px] text-white/30">{a.vehicle_make} · {a.vehicle_model}</p>
                  </div>
                </div>

                {/* Unassign */}
                <button
                  onClick={() => handleUnassign(a.vehicle_id)}
                  className="opacity-0 group-hover:opacity-100 text-[9px] font-black uppercase text-red-400 hover:text-red-300 transition-all px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg shrink-0"
                >
                  Unassign
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
