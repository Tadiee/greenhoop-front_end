"use client"
import React, { useState } from 'react';
import {
  Package, User, Phone, Truck, Building2, CheckCircle2,
  ChevronDown, Save, AlertTriangle, FileText, Tag, Loader2,
  MapPin, MessageSquare, XCircle, RefreshCw, QrCode, ShieldAlert, X,
  PackageCheck, CreditCard, ClipboardCheck
} from 'lucide-react';
import {
  LIFECYCLE_STATUSES, END_OF_LIFE_OUTCOMES, CATEGORY_ICONS,
  getStatusIndex, formatDate
} from './etrackConstants';
import CourierSelectionModal from '../Proximity/CourierSelectionModal';
import DropOffSitesModal from '../Proximity/DropOffSitesModal';

// Shows the user's response to an ACCEPTED offer — confirm, declined (too far / inaccessible), or withdrew
function UserResponsePanel({ submission, onReassign }) {
  const flag = submission.user_flag;
  const status = submission.status || submission.current_status;

  // User confirmed → in transit
  if (status === 'in_transit') {
    return (
      <div className="flex items-start gap-3 p-4 bg-[#08CB00]/10 border border-[#08CB00]/20 rounded-2xl">
        <QrCode size={16} className="text-[#08CB00] shrink-0 mt-0.5" />
        <div>
          <p className="text-[10px] font-black text-[#08CB00] uppercase tracking-wider mb-1">User Confirmed — In Transit</p>
          <p className="text-[10px] text-white/50">The user accepted and holds a QR code. Await their arrival at the site.</p>
        </div>
      </div>
    );
  }

  // User reported cant_drop_off → recycler should assign courier
  if (status === 'PENDING_PICKUP') {
    return (
      <div className="space-y-3">
        <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl">
          <AlertTriangle size={16} className="text-yellow-400 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black text-yellow-400 uppercase tracking-wider mb-1">User Cannot Reach Drop-off Site</p>
            <p className="text-[10px] text-white/50">{flag || 'User still wants the deal but cannot deliver to the assigned site.'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onReassign && onReassign(submission, 'courier')}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#08CB00]/10 border border-[#08CB00]/20 text-[#08CB00] rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-[#08CB00]/20 transition-all"
          >
            <Truck size={12} /> Assign Courier Instead
          </button>
          <button
            onClick={() => onReassign && onReassign(submission, 'reassign_site')}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white/5 border border-white/10 text-white/50 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-white/10 transition-all"
          >
            <RefreshCw size={12} /> Reassign Site
          </button>
        </div>
      </div>
    );
  }

  // User cancelled the deal entirely
  if (status === 'cancelled' || status === 'OFFERED') {
    return (
      <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
        <ShieldAlert size={16} className="text-red-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-[10px] font-black text-red-400 uppercase tracking-wider mb-1">User Cancelled the Deal</p>
          <p className="text-[10px] text-white/50">{flag || 'The submission has been returned to the broadcast pool.'}</p>
        </div>
      </div>
    );
  }

  // ACCEPTED — waiting for user to respond
  if (status === 'ACCEPTED') {
    return (
      <div className="flex items-start gap-3 p-4 bg-white/[0.03] border border-white/5 rounded-2xl">
        <MessageSquare size={15} className="text-white/20 shrink-0 mt-0.5" />
        <div>
          <p className="text-[10px] font-black text-white/30 uppercase tracking-wider mb-1">Awaiting User Response</p>
          <p className="text-[10px] text-white/25">The user has been notified and must confirm they can deliver to the assigned drop-off site.</p>
        </div>
      </div>
    );
  }

  return null;
}

export default function SubmissionDetailComp({ submission, onStatusUpdate }) {
  const [trackedId, setTrackedId] = useState(submission?.submit_id);
  // Use recycler_side_status for lifecycle phases, fallback to current_status
  const initialStatus = submission?.recycler_side_status || submission?.current_status || '';
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);
  const [selectedOutcome, setSelectedOutcome] = useState(submission?.end_of_life_outcome || '');
  const [notes, setNotes] = useState(submission?.notes || '');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [reassignModal, setReassignModal] = useState(null); // null | 'courier' | 'site'
  const [reassignDone, setReassignDone] = useState(null); // null | { type, result }
  const [receiving, setReceiving] = useState(false);
  const [receiveError, setReceiveError] = useState(null);
  const [amountPaid, setAmountPaid] = useState(null);
  const [courierFee, setCourierFee] = useState(null);
  const [availableBalance, setAvailableBalance] = useState(null);
  const [hasBegunAssessment, setHasBegunAssessment] = useState(false);
  const [isReceived, setIsReceived] = useState(false);

  if (!submission) {
    return (
      <div className="h-full w-full bg-white/[0.02] border border-white/5 rounded-[48px] p-8 flex flex-col items-center justify-center text-center">
        <Package size={32} className="text-white/10 mb-3" />
        <p className="text-xs font-bold text-white/20">Select a submission to view details</p>
      </div>
    );
  }

  // Only reset state when switching to a different submission (by ID)
  const effectiveStatus = submission?.recycler_side_status || submission?.current_status || '';
  if (submission.submit_id !== trackedId) {
    setTrackedId(submission.submit_id);
    setSelectedStatus(effectiveStatus);
    setSelectedOutcome(submission.end_of_life_outcome || '');
    setNotes(submission.notes || '');
    setHasBegunAssessment(false);
    setIsReceived(false);
    setAmountPaid(null);
    setCourierFee(null);
    setAvailableBalance(null);
  }

  const Icon = CATEGORY_ICONS[submission.category] || Package;
  // Calculate index in the sliced lifecycle statuses (ASSESSMENT onwards)
  const lifecycleStatuses = LIFECYCLE_STATUSES.slice(3); // [ASSESSMENT, PROCESSING, EXTRACTION, COMPLETED]
  const currentIdx = lifecycleStatuses.findIndex(s => s.key === effectiveStatus);
  const isCompleted = selectedStatus === 'COMPLETED';

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      // Use the recycler lifecycle update API for ASSESSMENT+ statuses
      const isLifecycleStatus = ['ASSESSMENT', 'PROCESSING', 'EXTRACTION', 'COMPLETED'].includes(selectedStatus);
      
      if (isLifecycleStatus && submission.status === 'completed') {
        // Use the new recycler lifecycle API
        const payload = {
          new_status: selectedStatus,
          end_of_life_outcome: selectedOutcome || null,
          notes: notes || null
        };
        const res = await fetch(
          `http://127.0.0.1:8000/recycler/update-lifecycle/${submission.submit_id}`,
          { 
            method: 'POST', 
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          }
        );
        const data = await res.json().catch(() => ({}));
        if (!data.success) throw new Error(data.error || 'Failed');
        
        // Status stays 'completed', only recycler_side_status changes
        submission.recycler_side_status = selectedStatus;
        submission.current_status = selectedStatus;
        if (selectedOutcome) submission.end_of_life_outcome = selectedOutcome;
        if (notes) submission.notes = notes;
      } else {
        // Fallback to legacy endpoint
        const body = new FormData();
        body.append('new_status', selectedStatus);
        const res = await fetch(
          `http://127.0.0.1:8000/e-waste-submission/submissions/${submission.submit_id}/update-status`,
          { method: 'POST', credentials: 'include', body }
        );
        if (!res.ok) throw new Error('Failed');
      }
      
      setSaved(true);
      if (onStatusUpdate) onStatusUpdate(submission.submit_id, selectedStatus, selectedOutcome, notes);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setSaveError(err.message || 'Could not update status. Try again.');
    } finally {
      setSaving(false);
    }
  };

  // Handle receive confirmation for courier deliveries - payment happens automatically via backend
  const handleReceiveConfirm = async () => {
    setReceiving(true);
    setReceiveError(null);
    try {
      const res = await fetch(`http://127.0.0.1:8000/recycler/received/${submission.submit_id}`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json().catch(() => ({}));
      if (!data.success) {
        setReceiveError(data.error || 'Could not confirm receipt. Please try again.');
      } else {
        setAmountPaid(data.amount_paid ?? null);
        setCourierFee(data.courier_fee ?? null);
        setAvailableBalance(data.available_balance ?? null);
        setIsReceived(true);
        // Update local status to trigger UI change
        submission.recycler_side_status = 'RECEIVED';
        submission.status = 'completed';
        submission.current_status = 'RECEIVED';
        if (onStatusUpdate) onStatusUpdate(submission.submit_id, 'RECEIVED');
      }
    } catch {
      setReceiveError('Network error. Please try again.');
    } finally {
      setReceiving(false);
    }
  };

  const handleBeginAssessment = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/recycler/begin-assessment/${submission.submit_id}`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json().catch(() => ({}));
      if (data.success) {
        setHasBegunAssessment(true);
        // Status stays 'completed', only recycler_side_status changes
        submission.recycler_side_status = 'ASSESSMENT';
        submission.current_status = 'ASSESSMENT';
        if (onStatusUpdate) onStatusUpdate(submission.submit_id, 'ASSESSMENT');
      } else {
        setSaveError(data.error || 'Could not begin assessment.');
      }
    } catch {
      setSaveError('Network error. Could not begin assessment.');
    }
  };

  if (reassignModal) {
    return (
      <div className="h-full w-full bg-white/[0.02] border border-white/5 rounded-[48px] p-6 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">
            {reassignModal === 'courier' ? 'Assign Courier' : 'Reassign Drop-off Site'}
          </p>
          <button onClick={() => setReassignModal(null)} className="p-1.5 rounded-xl hover:bg-white/10 text-white/30 hover:text-white transition-all">
            <X size={14} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {reassignModal === 'courier' ? (
            <CourierSelectionModal
              submission={submission}
              mode="reassign"
              onSelect={(courier) => {
                setReassignDone({ type: 'courier', result: courier });
                setReassignModal(null);
                if (onStatusUpdate) onStatusUpdate(submission.submit_id, 'COURIER_ASSIGNED');
              }}
              onBack={() => setReassignModal(null)}
            />
          ) : (
            <DropOffSitesModal
              submission={submission}
              onSelect={(site) => {
                setReassignDone({ type: 'site', result: site });
                setReassignModal(null);
                if (onStatusUpdate) onStatusUpdate(submission.submit_id, 'ACCEPTED');
              }}
              onBack={() => setReassignModal(null)}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-white/[0.02] border border-white/5 rounded-[48px] p-8 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 shrink-0">
        <div className="p-3 bg-[#08CB00]/10 rounded-2xl">
          <Icon size={22} className="text-[#08CB00]" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-black text-white truncate">{submission.brand_n_model}</h3>
          <p className="text-[10px] text-white/40">#{submission.submit_id} · {submission.category} · {submission.estimated_weight}kg</p>
        </div>
        {submission.estimated_cost != null && (
          <span className="text-lg font-black text-[#08CB00]">${submission.estimated_cost}</span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin space-y-5">
        {/* User response panel — shown for all actionable statuses */}
        {(['ACCEPTED', 'in_transit', 'PENDING_PICKUP', 'cancelled', 'OFFERED'].includes(
            submission.status || submission.current_status
          )) && (
          <UserResponsePanel
            submission={submission}
            onReassign={(sub, type) => {
              setReassignDone(null);
              setReassignModal(type === 'reassign_site' ? 'site' : 'courier');
            }}
          />
        )}

        {/* Reassign done banner */}
        {reassignDone && (
          <div className={`flex items-start gap-3 p-3 rounded-2xl border ${
            reassignDone.type === 'courier'
              ? 'bg-blue-500/10 border-blue-500/20'
              : 'bg-[#08CB00]/10 border-[#08CB00]/20'
          }`}>
            <CheckCircle2 size={14} className={reassignDone.type === 'courier' ? 'text-blue-400 shrink-0 mt-0.5' : 'text-[#08CB00] shrink-0 mt-0.5'} />
            <p className="text-[10px] text-white/60">
              {reassignDone.type === 'courier'
                ? `Courier assigned — user will be notified for pickup.`
                : `New drop-off site assigned — user has been notified.`
              }
            </p>
          </div>
        )}

        {/* Submitter info */}
        <div className="bg-black/30 border border-white/5 rounded-2xl p-4 space-y-2">
          <p className="text-[9px] font-bold text-white/30 uppercase tracking-wider">Submission Info</p>
          {submission.submitted_by?.name && (
            <div className="flex items-center gap-3">
              <User size={14} className="text-white/40" />
              <span className="text-xs font-bold text-white">{submission.submitted_by.name}</span>
            </div>
          )}
          {submission.submitted_by?.phone && (
            <div className="flex items-center gap-3">
              <Phone size={14} className="text-white/40" />
              <span className="text-xs text-white/60">{submission.submitted_by.phone}</span>
            </div>
          )}
          {submission.delivery_method && (
            <div className="flex items-center gap-3">
              {submission.delivery_method === 'COURIER'
                ? <><Truck size={14} className="text-blue-400" /><span className="text-xs text-blue-400">{submission.courier || 'Courier'}</span></>
                : submission.delivery_method === 'RECYCLER_PICKUP'
                  ? <><Truck size={14} className="text-purple-400" /><span className="text-xs text-purple-400">Recycler Pickup</span></>
                  : submission.delivery_method === 'TECHNICIAN_PICKUP'
                    ? <><Truck size={14} className="text-orange-400" /><span className="text-xs text-orange-400">Technician Pickup</span></>
                    : <><Building2 size={14} className="text-white/40" /><span className="text-xs text-white/60">{submission.drop_off_site?.name || 'Drop-off'}</span></>
              }
            </div>
          )}
          <div className="flex items-center gap-3">
            <Package size={14} className="text-white/40" />
            <span className="text-xs text-white/60">#{submission.submit_id} · {submission.category} · {submission.estimated_weight ?? '—'}kg</span>
          </div>
        </div>

        {/* Receive / Begin Assessment Action Buttons */}
        {(submission.status === 'in_transit' || submission.current_status === 'in_transit') && submission.delivery_method === 'COURIER' && (
          <div className="space-y-3">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <Truck size={18} className="text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-wider mb-1">Courier In Transit</p>
                  <p className="text-[10px] text-white/50">
                    {submission.courier || 'Courier'} is collecting the item from the user.
                    Click "Receive" once the item arrives at your hub to complete payment.
                  </p>
                </div>
              </div>
            </div>
            
            {receiveError && (
              <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-2xl">
                <AlertTriangle size={14} className="text-red-400 shrink-0 mt-0.5" />
                <p className="text-[10px] font-bold text-red-400">{receiveError}</p>
              </div>
            )}

            <button
              onClick={handleReceiveConfirm}
              disabled={receiving}
              className="w-full py-3.5 bg-blue-500 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {receiving ? <><Loader2 size={14} className="animate-spin" /> Processing...</> : <><PackageCheck size={16} /> Receive Item</>}
            </button>
          </div>
        )}

        {(isReceived || submission.status === 'RECEIVED' || submission.current_status === 'RECEIVED' || submission.recycler_side_status === 'RECEIVED') && !hasBegunAssessment && (
          <div className="space-y-3">
            <div className="bg-[#08CB00]/10 border border-[#08CB00]/20 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <PackageCheck size={18} className="text-[#08CB00] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-black text-[#08CB00] uppercase tracking-wider mb-1">Item Received</p>
                  <p className="text-[10px] text-white/50">
                    {submission.delivery_method === 'COURIER' 
                      ? 'Payment completed. The item is now in your custody.'
                      : 'The user has delivered the item to the drop-off site. The receiver has confirmed receipt.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment breakdown for courier */}
            {submission.delivery_method === 'COURIER' && (amountPaid != null || courierFee != null) && (
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-2">
                {amountPaid != null && (
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40 uppercase tracking-widest font-bold">Paid to Seller</span>
                    <span className="text-sm font-black text-[#08CB00]">${Number(amountPaid).toFixed(2)}</span>
                  </div>
                )}
                {courierFee != null && (
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40 uppercase tracking-widest font-bold">Courier Fee</span>
                    <span className="text-sm font-black text-white">${Number(courierFee).toFixed(2)}</span>
                  </div>
                )}
                <div className="h-px bg-white/10 my-1" />
                <div className="flex justify-between text-xs">
                  <span className="text-white/60 font-black uppercase tracking-widest">Total Paid</span>
                  <span className="text-lg font-black text-[#08CB00]">
                    ${(Number(amountPaid ?? 0) + Number(courierFee ?? 0)).toFixed(2)}
                  </span>
                </div>
                {availableBalance != null && (
                  <div className="flex justify-between text-xs pt-1 border-t border-white/5 mt-1">
                    <span className="text-white/25 uppercase tracking-widest font-bold">Wallet Balance</span>
                    <span className="text-sm font-black text-white/60">${Number(availableBalance).toFixed(2)}</span>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={handleBeginAssessment}
              className="w-full py-3.5 bg-[#08CB00] text-black rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-[#08CB00]/80 transition-colors flex items-center justify-center gap-2"
            >
              <ClipboardCheck size={16} /> Begin Assessment
            </button>
          </div>
        )}

        {/* Status Update — show when recycler has begun assessment (recycler_side_status tracks lifecycle) */}
        {(hasBegunAssessment ||
          submission.recycler_side_status === 'RECEIVED' ||
          submission.recycler_side_status === 'ASSESSMENT' ||
          submission.recycler_side_status === 'PROCESSING' ||
          submission.recycler_side_status === 'EXTRACTION' ||
          submission.recycler_side_status === 'COMPLETED') && (
          <div className="space-y-2">
            <p className="text-[9px] font-bold text-white/30 uppercase tracking-wider">Update Lifecycle Status</p>
            <div className="grid grid-cols-1 gap-2">
              {lifecycleStatuses.map((s, i) => {
                const isPast = i < currentIdx;
                const isCurrent = s.key === effectiveStatus; // Actual current status from submission
                const isSelected = s.key === selectedStatus; // User's selection (may differ from current)
                const isClickable = i >= currentIdx; // Can click current or future statuses
                return (
                  <button
                    key={s.key}
                    onClick={() => isClickable && setSelectedStatus(s.key)}
                    disabled={!isClickable}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                      isCurrent
                        ? 'bg-[#08CB00]/20 border-[#08CB00] text-[#08CB00]' // Current status - solid green
                        : isSelected && !isCurrent
                          ? 'bg-[#08CB00]/15 border-[#08CB00]/70 text-white cursor-pointer' // Selected but not saved - more visible
                          : isPast
                            ? 'bg-white/[0.02] border-white/5 text-white/30'
                            : 'bg-black/20 border-white/5 hover:border-[#08CB00]/60 hover:bg-white/5 text-white/50 cursor-pointer' // Future - clickable
                    } ${!isClickable ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      isCurrent ? 'border-[#08CB00] bg-[#08CB00]' : isSelected && !isCurrent ? 'border-[#08CB00]/60 bg-[#08CB00]/20' : isPast ? 'border-white/20 bg-white/10' : 'border-white/10'
                    }`}>
                      {(isCurrent || isPast || isSelected) && <div className="w-2 h-2 rounded-full bg-white/80" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-[11px] font-black">{s.label}</p>
                      <p className="text-[9px] opacity-60">{s.description}</p>
                    </div>
                    {isCurrent && <CheckCircle2 size={14} className="text-[#08CB00]" />}
                    {isSelected && !isCurrent && <div className="w-2 h-2 rounded-full bg-[#08CB00]/60" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* End-of-Life Outcome (only when marking COMPLETED) */}
        {isCompleted && (
          <div className="space-y-2">
            <p className="text-[9px] font-bold text-white/30 uppercase tracking-wider flex items-center gap-2">
              <Tag size={11} /> End-of-Life Outcome
            </p>
            <div className="grid grid-cols-1 gap-2">
              {END_OF_LIFE_OUTCOMES.map(o => (
                <button
                  key={o.id}
                  onClick={() => setSelectedOutcome(o.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                    selectedOutcome === o.id
                      ? 'border-opacity-60 bg-white/5'
                      : 'border-white/5 bg-black/20 hover:border-white/20'
                  }`}
                  style={{ borderColor: selectedOutcome === o.id ? o.color : undefined }}
                >
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: o.color }} />
                  <div className="flex-1">
                    <p className="text-[11px] font-black text-white">{o.label}</p>
                    <p className="text-[9px] text-white/40">{o.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {isCompleted && (<div className="space-y-2">
          <p className="text-[9px] font-bold text-white/30 uppercase tracking-wider flex items-center gap-2">
            <FileText size={11} /> Processing Notes
          </p>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
            placeholder="Add notes about this submission..."
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-[11px] text-white placeholder:text-white/20 outline-none focus:border-[#08CB00]/50 resize-none"
          />
        </div>)}

        {/* User flag alert */}
        {submission.user_flag && (
          <div className="flex items-start gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl">
            <AlertTriangle size={14} className="text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-[9px] font-black text-yellow-400 uppercase tracking-wider mb-0.5">User Flagged an Issue</p>
              <p className="text-[10px] text-white/60">{submission.user_flag}</p>
            </div>
          </div>
        )}

        {saveError && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
            <AlertTriangle size={13} className="text-red-400" />
            <p className="text-[10px] font-bold text-red-400">{saveError}</p>
          </div>
        )}

        {/* Save — available for any lifecycle status update */}
        {(hasBegunAssessment ||
          submission.recycler_side_status === 'RECEIVED' ||
          submission.recycler_side_status === 'ASSESSMENT' ||
          submission.recycler_side_status === 'PROCESSING' ||
          submission.recycler_side_status === 'EXTRACTION' ||
          submission.recycler_side_status === 'COMPLETED') && (
          <button
            onClick={handleSave}
            disabled={saving}
            className={`w-full py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${
              saved
                ? 'bg-[#08CB00]/20 text-[#08CB00] border border-[#08CB00]/30'
                : 'bg-[#08CB00] text-black hover:bg-[#08CB00]/80'
            }`}
          >
            {saving
              ? <><Loader2 size={14} className="animate-spin" /> Saving...</>
              : saved
                ? <><CheckCircle2 size={14} /> Saved!</>
                : <><Save size={14} /> Save Changes</>
            }
          </button>
        )}
      </div>
    </div>
  );
}