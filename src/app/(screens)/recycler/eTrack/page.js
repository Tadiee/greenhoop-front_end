"use client"
import React, { useState } from 'react';
import EndOfLifeComp    from '@/components/private components/recycler/Etrack/environmentComp';
import SubmissionDetailComp from '@/components/private components/recycler/Etrack/custodyComp';
import LifecycleTimelineComp from '@/components/private components/recycler/Etrack/inventoryComp';
import ImpactSummaryComp from '@/components/private components/recycler/Etrack/telemetrComp';
import AcceptedListComp  from '@/components/private components/recycler/Etrack/intakeComp';

const EtrackPage = () => {
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const handleStatusUpdate = (submitId, status, outcome, notes) => {
    // In production: call API to persist. For now, mutate the dummy data in memory.
    console.log('Status update:', submitId, status, outcome, notes);
  };

  return (
    <div className="h-screen w-full bg-[#050505] text-white font-sans selection:bg-[#08CB00] overflow-hidden flex flex-col">
      {/* Header spacer */}
      <div className="h-20 shrink-0" />

      <div className="flex-1 grid grid-cols-12 gap-4 p-4 min-h-0">

        {/* ── LEFT SIDEBAR: Accepted Submissions List ── */}
        <div className="col-span-3 h-full min-h-0">
          <AcceptedListComp
            selectedId={selectedSubmission?.submit_id}
            onSelect={setSelectedSubmission}
          />
        </div>

        {/* ── CENTRE COLUMN: Timeline + Detail ── */}
        <div className="col-span-6 flex flex-col gap-4 min-h-0 overflow-hidden">

          {/* TOP HALF: End-of-Life & Environmental Impact */}
          <div className="h-1/2 bg-white/[0.02] border border-white/5 rounded-[48px] p-8 flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px]" />
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#08CB00]/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="shrink-0 mb-4">
              <p className="text-[9px] font-black uppercase tracking-widest text-white/30">E-Waste End-of-Life Impact</p>
            </div>
            <EndOfLifeComp submission={selectedSubmission} />
          </div>

          {/* BOTTOM HALF: Lifecycle Timeline */}
          <div className="flex-1 min-h-0">
            <LifecycleTimelineComp submission={selectedSubmission} />
          </div>
        </div>

        {/* ── RIGHT COLUMN: Detail / Status Update + Impact Summary ── */}
        <div className="col-span-3 flex flex-col gap-4 h-full min-h-0 overflow-hidden">

          {/* TOP: Impact Summary (aggregate) */}
          <ImpactSummaryComp />

          {/* BOTTOM: Submission Detail + Status Update */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <SubmissionDetailComp
              submission={selectedSubmission}
              onStatusUpdate={handleStatusUpdate}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default EtrackPage;