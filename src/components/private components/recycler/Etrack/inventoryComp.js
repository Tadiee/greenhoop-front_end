"use client"
import React from 'react';
import { CheckCircle2, Circle, Clock, Package, Tag } from 'lucide-react';
import { LIFECYCLE_STATUSES, END_OF_LIFE_OUTCOMES, getStatusIndex, formatDate } from './etrackConstants';

export default function LifecycleTimelineComp({ submission }) {
  const currentIdx = submission ? getStatusIndex(submission.current_status) : -1;

  if (!submission) {
    return (
      <div className="h-full w-full bg-white/[0.02] border border-white/5 rounded-[48px] p-8 flex flex-col items-center justify-center text-center">
        <Package size={32} className="text-white/10 mb-3" />
        <p className="text-xs font-bold text-white/20">Select a submission to view its lifecycle timeline</p>
      </div>
    );
  }

  const outcome = END_OF_LIFE_OUTCOMES.find(o => o.id === submission.end_of_life_outcome);

  return (
    <div className="h-full w-full bg-white/[0.02] border border-white/5 rounded-[48px] p-8 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h3 className="text-xs font-black uppercase tracking-widest text-white/60">Lifecycle Timeline</h3>
          <p className="text-[9px] text-white/30 mt-0.5">{submission.brand_n_model} · #{submission.submit_id}</p>
        </div>
        <Clock size={16} className="text-[#08CB00]" />
      </div>

      {/* Progress bar */}
      <div className="mb-6 shrink-0">
        <div className="flex items-center gap-1">
          {LIFECYCLE_STATUSES.map((s, i) => (
            <div key={s.key} className="flex items-center flex-1">
              <div className={`h-2 w-full rounded-full transition-all ${
                i <= currentIdx ? 'bg-[#08CB00]' : 'bg-white/10'
              }`} />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[8px] text-white/20 uppercase">Accepted</span>
          <span className="text-[8px] text-[#08CB00] uppercase font-bold">
            {LIFECYCLE_STATUSES[currentIdx]?.label || ''}
          </span>
          <span className="text-[8px] text-white/20 uppercase">Completed</span>
        </div>
      </div>

      {/* Timeline steps */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="relative pl-6">
          {/* Vertical line */}
          <div className="absolute left-[9px] top-0 bottom-0 w-[2px] bg-white/5" />

          {LIFECYCLE_STATUSES.map((s, i) => {
            const isDone    = i < currentIdx;
            const isCurrent = i === currentIdx;
            const isFuture  = i > currentIdx;
            const timelineEntry = submission.timeline?.find(t => t.status === s.key);

            return (
              <div key={s.key} className={`relative flex items-start gap-4 pb-6 ${isFuture ? 'opacity-30' : ''}`}>
                {/* Node */}
                <div className={`absolute left-0 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 z-10 -translate-x-[2px] ${
                  isCurrent
                    ? 'border-[#08CB00] bg-[#08CB00]'
                    : isDone
                      ? 'border-[#08CB00]/50 bg-[#08CB00]/20'
                      : 'border-white/10 bg-[#050505]'
                }`}>
                  {isCurrent && <div className="w-2 h-2 rounded-full bg-white" />}
                  {isDone && <CheckCircle2 size={12} className="text-[#08CB00]" />}
                </div>

                {/* Content */}
                <div className="flex-1 bg-black/20 border border-white/5 rounded-2xl p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className={`text-[11px] font-black ${isCurrent ? 'text-[#08CB00]' : 'text-white'}`}>{s.label}</p>
                      <p className="text-[9px] text-white/40">{s.description}</p>
                    </div>
                    {timelineEntry && (
                      <p className="text-[8px] text-white/30 text-right shrink-0">{formatDate(timelineEntry.at)}</p>
                    )}
                  </div>
                  {isCurrent && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#08CB00] animate-pulse" />
                      <span className="text-[9px] text-[#08CB00] font-bold">In Progress</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* End-of-life outcome badge */}
          {outcome && (
            <div className="relative flex items-start gap-4 pb-2">
              <div className="absolute left-0 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 z-10 -translate-x-[2px]"
                style={{ borderColor: outcome.color, backgroundColor: outcome.color + '33' }}>
                <Tag size={10} style={{ color: outcome.color }} />
              </div>
              <div className="flex-1 p-3 rounded-2xl border" style={{ borderColor: outcome.color + '40', backgroundColor: outcome.color + '0D' }}>
                <p className="text-[11px] font-black" style={{ color: outcome.color }}>{outcome.label}</p>
                <p className="text-[9px] text-white/40">{outcome.description}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}