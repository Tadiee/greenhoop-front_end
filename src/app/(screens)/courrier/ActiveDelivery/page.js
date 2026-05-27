"use client"
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { ArrowLeft, Navigation2, QrCode, Package, Building2 } from 'lucide-react';

const NavPhase       = dynamic(() => import("@/components/private components/courrier/ActiveDelivery/navPhase"),       { ssr: false });
const ScanPhase      = dynamic(() => import("@/components/private components/courrier/ActiveDelivery/scanPhase"),      { ssr: false });
const InventoryPhase = dynamic(() => import("@/components/private components/courrier/ActiveDelivery/inventoryPhase"), { ssr: false });
const HandoffPhase   = dynamic(() => import("@/components/private components/courrier/ActiveDelivery/handoffPhase"),   { ssr: false });

const API_BASE = 'http://127.0.0.1:8000';

const PHASES = [
  { key: 'nav',       label: 'Navigate',  icon: Navigation2 },
  { key: 'scan',      label: 'Scan',      icon: QrCode      },
  { key: 'inventory', label: 'Inventory', icon: Package     },
  { key: 'handoff',   label: 'Handoff',   icon: Building2   },
];

function ActiveDeliveryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get('jobId');

  const [phase, setPhase] = useState('nav');
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!jobId) { setLoading(false); return; }
    fetch(`${API_BASE}/courier/active-queue`, { credentials: 'include' })
      .then(r => r.ok ? r.json() : { queue: [] })
      .then(data => {
        const found = (data.queue || []).find(
          j => String(j.submit_id) === String(jobId) || j.id === `JOB-${jobId}`
        );
        setJob(found || null);
      })
      .catch(() => setJob(null))
      .finally(() => setLoading(false));
  }, [jobId]);

  const currentPhaseIdx = PHASES.findIndex(p => p.key === phase);

  const handleComplete = ({ done } = {}) => {
    if (done) router.push('/courrier/Deliveries');
  };

  if (loading) {
    return (
      <div className="h-[90%] w-full flex items-center justify-center bg-[#121212]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-[#08CB00] border-t-transparent animate-spin" />
          <p className="text-[#08CB00] text-[10px] font-black uppercase tracking-widest">Loading job...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="h-[90%] w-full flex flex-col items-center justify-center gap-4 bg-[#121212] p-8 text-center">
        <p className="text-white font-black text-lg">Job not found</p>
        <p className="text-white/30 text-[10px]">Job ID: {jobId || 'none'}</p>
        <button
          onClick={() => router.push('/courrier/Deliveries')}
          className="flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 text-white/60 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
        >
          <ArrowLeft size={14} /> Back to Deliveries
        </button>
      </div>
    );
  }

  return (
    <div className="h-[90%] w-full flex flex-col bg-[#121212] font-sans relative min-h-0">

      {/* Top bar: back + stepper */}
      <div className="shrink-0 flex items-center gap-3 px-4 pt-4 pb-3 bg-[#1A1A1A] border-b border-white/5 z-10">
        <button
          onClick={() => router.push('/courrier/Deliveries')}
          className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all shrink-0"
        >
          <ArrowLeft size={15} />
        </button>

        {/* Phase stepper */}
        <div className="flex-1 flex items-center gap-1 overflow-x-auto scrollbar-none">
          {PHASES.map((p, i) => {
            const Icon = p.icon;
            const done = i < currentPhaseIdx;
            const active = i === currentPhaseIdx;
            return (
              <React.Fragment key={p.key}>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all shrink-0 ${
                  active ? 'bg-[#08CB00] text-black' : done ? 'bg-white/10 text-white/60' : 'text-white/20'
                }`}>
                  <Icon size={11} />
                  <span className="text-[9px] font-black uppercase tracking-widest hidden sm:block">{p.label}</span>
                </div>
                {i < PHASES.length - 1 && (
                  <div className={`flex-1 h-px min-w-[8px] transition-all ${done ? 'bg-white/30' : 'bg-white/10'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Job ID badge */}
        <span className="shrink-0 text-[9px] font-black text-white/20 uppercase tracking-widest hidden sm:block">
          {job.id}
        </span>
      </div>

      {/* Phase content */}
      <div className="flex-1 min-h-0">
        <Suspense fallback={<div className="h-full flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-[#08CB00] border-t-transparent animate-spin" /></div>}>
          {phase === 'nav' && (
            <NavPhase job={job} onArrived={() => setPhase('scan')} />
          )}
          {phase === 'scan' && (
            <ScanPhase job={job} onScanSuccess={() => setPhase('inventory')} />
          )}
          {phase === 'inventory' && (
            <InventoryPhase job={job} onConfirm={() => setPhase('handoff')} />
          )}
          {phase === 'handoff' && (
            <HandoffPhase job={job} onComplete={handleComplete} />
          )}
        </Suspense>
      </div>
    </div>
  );
}

export default function ActiveDeliveryPage() {
  return (
    <Suspense fallback={
      <div className="h-[90%] w-full flex items-center justify-center bg-[#121212]">
        <div className="w-10 h-10 rounded-full border-2 border-[#08CB00] border-t-transparent animate-spin" />
      </div>
    }>
      <ActiveDeliveryContent />
    </Suspense>
  );
}
