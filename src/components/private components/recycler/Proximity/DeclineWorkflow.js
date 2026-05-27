"use client"
import React, { useState } from 'react';
import {
  X,
  XCircle,
  AlertTriangle,
  ChevronLeft,
  Loader2,
  CheckCircle2,
  Package,
  BellOff,
  MessageSquare,
  Trash2
} from 'lucide-react';

const DECLINE_REASONS = [
  { id: 'price', label: 'Price too low', description: 'The estimated value does not meet my minimum' },
  { id: 'category', label: 'Outside my specialty', description: 'I don\'t process this type of e-waste' },
  { id: 'weight', label: 'Weight/Volume issue', description: 'Too heavy, light, or inconvenient quantity' },
  { id: 'location', label: 'Too far away', description: 'Pickup or drop-off location is not feasible' },
  { id: 'capacity', label: 'At capacity', description: 'My facility is currently at full capacity' },
  { id: 'condition', label: 'Device condition', description: 'Device condition is worse than described' },
  { id: 'other', label: 'Other reason', description: 'Something else is preventing me from accepting' },
];

const DeclineWorkflow = ({ submission, onClose, onDeclineComplete }) => {
  const [step, setStep] = useState('WARNING');   // WARNING, REASON, CONFIRM, PROCESSING, DONE
  const [selectedReason, setSelectedReason] = useState(null);
  const [customNote, setCustomNote] = useState('');

  const handleConfirmDecline = () => {
    setStep('PROCESSING');
    // Simulate API call to rescind offer & notify user
    setTimeout(() => {
      setStep('DONE');
      setTimeout(() => {
        onDeclineComplete(submission.submit_id);
        onClose();
      }, 1800);
    }, 1800);
  };

  const WarningStep = () => (
    <div className="space-y-6">
      <div className="flex flex-col items-center text-center gap-4 py-4">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center">
          <AlertTriangle size={40} className="text-red-400" />
        </div>
        <div>
          <h3 className="text-xl font-black text-white mb-2">Before You Decline</h3>
          <p className="text-sm text-white/50 max-w-xs mx-auto">
            This offer will be <span className="text-red-400 font-bold">permanently removed</span> from your available offers. You won't be able to accept it in the future.
          </p>
        </div>
      </div>

      {/* What happens list */}
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-3">
        <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider">What will happen</p>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-red-500/20 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
              <BellOff size={14} className="text-red-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Offer removed from your list</p>
              <p className="text-[10px] text-white/40">#{submission.submit_id} will no longer appear in your Proximity feed</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-yellow-500/20 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
              <MessageSquare size={14} className="text-yellow-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">User will be notified</p>
              <p className="text-[10px] text-white/40">The submitter will know their offer was not accepted by you</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-white/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
              <Trash2 size={14} className="text-white/40" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Offer is rescinded</p>
              <p className="text-[10px] text-white/40">The submission returns to the pool for other recyclers to view</p>
            </div>
          </div>
        </div>
      </div>

      {/* Submission summary */}
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex items-center gap-4">
        <Package size={20} className="text-white/40 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white truncate">{submission.brand_n_model}</p>
          <p className="text-[10px] text-white/40">{submission.category} · {submission.estimated_weight}kg · ${submission.estimated_cost}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[10px] text-white/30">Submit ID</p>
          <p className="text-xs font-mono text-white/50">#{submission.submit_id}</p>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={onClose}
          className="flex-1 py-4 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white/60 hover:bg-white/10 transition-colors"
        >
          Keep Offer
        </button>
        <button
          onClick={() => setStep('REASON')}
          className="flex-1 py-4 bg-red-500/10 border border-red-500/30 rounded-xl text-sm font-black text-red-400 hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
        >
          <XCircle size={18} /> Continue to Decline
        </button>
      </div>
    </div>
  );

  const ReasonStep = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => setStep('WARNING')} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
          <ChevronLeft size={24} className="text-white/60" />
        </button>
        <div>
          <h3 className="text-xl font-black text-white">Reason for Declining</h3>
          <p className="text-xs text-white/40">Help us improve your offer matching</p>
        </div>
      </div>

      <div className="space-y-2 max-h-[360px] overflow-y-auto scrollbar-thin">
        {DECLINE_REASONS.map((reason) => {
          const isSelected = selectedReason?.id === reason.id;
          return (
            <div
              key={reason.id}
              onClick={() => setSelectedReason(reason)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-red-500/10 border-red-500 ring-1 ring-red-500'
                  : 'bg-white/[0.02] border-white/10 hover:border-white/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                  isSelected ? 'border-red-500 bg-red-500' : 'border-white/20'
                }`}>
                  {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{reason.label}</p>
                  <p className="text-[10px] text-white/40">{reason.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Optional note */}
      <div>
        <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-2">Additional Notes (optional)</p>
        <textarea
          value={customNote}
          onChange={(e) => setCustomNote(e.target.value)}
          placeholder="Provide any additional context..."
          rows={3}
          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-red-500/50 resize-none"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={() => setStep('WARNING')}
          className="flex-1 py-4 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white/60 hover:bg-white/10 transition-colors"
        >
          Back
        </button>
        <button
          onClick={() => selectedReason && setStep('CONFIRM')}
          disabled={!selectedReason}
          className={`flex-1 py-4 rounded-xl text-sm font-black transition-colors flex items-center justify-center gap-2 ${
            selectedReason
              ? 'bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30'
              : 'bg-white/5 text-white/20 cursor-not-allowed'
          }`}
        >
          <XCircle size={18} /> Review & Confirm
        </button>
      </div>
    </div>
  );

  const ConfirmStep = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => setStep('REASON')} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
          <ChevronLeft size={24} className="text-white/60" />
        </button>
        <div>
          <h3 className="text-xl font-black text-white">Confirm Decline</h3>
          <p className="text-xs text-white/40">This action cannot be undone</p>
        </div>
      </div>

      <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5 space-y-4">
        <p className="text-[10px] font-bold text-red-400/60 uppercase tracking-wider">Decline Summary</p>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-white/40">Submission</span>
            <span className="text-white font-bold">{submission.brand_n_model}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/40">Submit ID</span>
            <span className="font-mono text-white/60">#{submission.submit_id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/40">Estimated Value</span>
            <span className="text-white font-bold">${submission.estimated_cost}</span>
          </div>
          <div className="flex justify-between items-start gap-4">
            <span className="text-white/40 shrink-0">Reason</span>
            <span className="text-red-400 font-bold text-right">{selectedReason?.label}</span>
          </div>
          {customNote && (
            <div className="flex justify-between items-start gap-4 pt-1 border-t border-white/10">
              <span className="text-white/40 shrink-0">Note</span>
              <span className="text-white/60 text-right italic">"{customNote}"</span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle size={18} className="text-yellow-500 shrink-0 mt-0.5" />
          <p className="text-xs text-yellow-400/80">
            The user will receive a notification that you have declined their offer. The submission will be returned to the pool for other recyclers.
          </p>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={() => setStep('REASON')}
          className="flex-1 py-4 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white/60 hover:bg-white/10 transition-colors"
        >
          Go Back
        </button>
        <button
          onClick={handleConfirmDecline}
          className="flex-1 py-4 bg-red-500 rounded-xl text-sm font-black text-white hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
        >
          <XCircle size={18} /> Decline Offer
        </button>
      </div>
    </div>
  );

  const ProcessingStep = () => (
    <div className="text-center py-16 space-y-4">
      <div className="w-16 h-16 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin mx-auto" />
      <h3 className="text-xl font-black text-white">Processing Decline...</h3>
      <p className="text-sm text-white/40">Rescinding offer and notifying user</p>
    </div>
  );

  const DoneStep = () => (
    <div className="text-center py-16 space-y-4">
      <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle2 size={40} className="text-red-400" />
      </div>
      <h3 className="text-xl font-black text-white">Offer Declined</h3>
      <p className="text-sm text-white/40">
        #{submission.submit_id} has been removed from your offers. The user has been notified.
      </p>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={step !== 'PROCESSING' && step !== 'DONE' ? onClose : undefined} />
      <div className="relative bg-[#0a0a0a] border border-white/10 rounded-[40px] p-8 max-w-lg w-full shadow-2xl">
        {step !== 'PROCESSING' && step !== 'DONE' && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/40 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        )}

        {step === 'WARNING'    && <WarningStep />}
        {step === 'REASON'     && <ReasonStep />}
        {step === 'CONFIRM'    && <ConfirmStep />}
        {step === 'PROCESSING' && <ProcessingStep />}
        {step === 'DONE'       && <DoneStep />}
      </div>
    </div>
  );
};

export default DeclineWorkflow;
