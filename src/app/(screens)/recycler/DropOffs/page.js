"use client"
import React, { useState } from 'react';
import dynamic from 'next/dynamic';

import DropoffSitesList  from "@/components/private components/recycler/Dropoffs/receiverGovComponent";
import SiteFormModal     from "@/components/private components/recycler/Dropoffs/siteReg";
import SiteDetailPanel   from "@/components/private components/recycler/Dropoffs/siteTelemetry";
import ReceiverModal     from "@/components/private components/recycler/Dropoffs/ReceiverModal";
import { DUMMY_SITES, DUMMY_RECEIVERS } from "@/components/private components/recycler/Dropoffs/dropoffConstants";

const DropoffMapComponent = dynamic(
  () => import('@/components/private components/recycler/Dropoffs/liveMap'),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-[#0A0A0A] border border-white/5 rounded-[48px] flex items-center justify-center">
        <p className="text-[10px] text-white/20 uppercase tracking-widest">Loading map...</p>
      </div>
    ),
  }
);

const DropsOffsPage = () => {
  const [sites, setSites]               = useState(DUMMY_SITES);
  const [selectedSite, setSelectedSite] = useState(null);

  // Modal state
  const [siteModal, setSiteModal]           = useState(null); // null | { mode: 'add' } | { mode: 'edit', site }
  const [receiverModal, setReceiverModal]   = useState(null); // null | { site }

  // ── CRUD handlers ──
  const handleSaveSite = (payload) => {
    setSites(prev => {
      const exists = prev.find(s => s.id === payload.id);
      return exists
        ? prev.map(s => s.id === payload.id ? payload : s)
        : [...prev, payload];
    });
    setSelectedSite(payload);
  };

  const handleDeleteSite = (id) => {
    setSites(prev => prev.filter(s => s.id !== id));
    if (selectedSite?.id === id) setSelectedSite(null);
  };

  // Receivers live in DUMMY_RECEIVERS in this demo — in production, this would be persisted
  const getSiteReceivers = (site) => DUMMY_RECEIVERS.filter(r => r.site_id === site?.id);

  return (
    <div className="h-screen w-full bg-[#050505] text-white font-sans selection:bg-[#08CB00] overflow-hidden flex flex-col">
      {/* Header spacer */}
      <div className="h-20 shrink-0" />

      {/* ── MAIN LAYOUT ── */}
      <div className="flex-1 flex gap-4 p-4 min-h-0 overflow-hidden">

        {/* LEFT: Sites list */}
        <div className="w-72 shrink-0 h-full">
          <DropoffSitesList
            sites={sites}
            selectedSite={selectedSite}
            onSelect={setSelectedSite}
            onAdd={() => setSiteModal({ mode: 'add' })}
            onEdit={(site) => setSiteModal({ mode: 'edit', site })}
            onDelete={handleDeleteSite}
            onManageReceivers={(site) => setReceiverModal({ site })}
          />
        </div>

        {/* CENTRE: Map */}
        <div className="flex-1 relative h-full min-w-0">
          <DropoffMapComponent
            sites={sites}
            selectedSite={selectedSite}
            onMarkerClick={setSelectedSite}
          />
        </div>

        {/* RIGHT: Site detail panel */}
        <div className="w-80 shrink-0 h-full overflow-y-auto scrollbar-thin">
          <SiteDetailPanel
            site={selectedSite}
            onEdit={(site) => setSiteModal({ mode: 'edit', site })}
            onDelete={handleDeleteSite}
            onManageReceivers={(site) => setReceiverModal({ site })}
          />
        </div>
      </div>

      {/* ── MODALS ── */}
      {siteModal && (
        <SiteFormModal
          site={siteModal.mode === 'edit' ? siteModal.site : null}
          onClose={() => setSiteModal(null)}
          onSave={handleSaveSite}
        />
      )}

      {receiverModal && (
        <ReceiverModal
          site={receiverModal.site}
          receivers={getSiteReceivers(receiverModal.site)}
          onClose={() => setReceiverModal(null)}
          onSave={() => {}}
        />
      )}
    </div>
  );
};

export default DropsOffsPage;