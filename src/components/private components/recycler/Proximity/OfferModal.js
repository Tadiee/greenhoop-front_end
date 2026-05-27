"use client"
import React, { useState } from 'react';
import { 
  CheckCircle2,
  XCircle,
  Package
} from 'lucide-react';
import { CATEGORY_ICONS, getTimeRemaining } from './constants';
import AcceptWorkflow from './AcceptWorkflow';
import DeclineWorkflow from './DeclineWorkflow';

const OfferModal = ({ offer, onClose, onDeclineComplete }) => {
  const [showWorkflow, setShowWorkflow] = useState(false);
  const [showDeclineWorkflow, setShowDeclineWorkflow] = useState(false);
  
  if (!offer) return null;

  const SelectedIcon = CATEGORY_ICONS[offer.category] || Package;

  const handleAcceptClick = () => {
    setShowWorkflow(true);
  };

  const handleWorkflowComplete = (data) => {
    console.log('Accept workflow completed:', data);
    // Here you would typically:
    // 1. Update the submission status in your backend
    // 2. Remove it from available offers
    // 3. Add it to the recycler's accepted submissions
    // 4. Send notifications to relevant parties
    setShowWorkflow(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-[#0a0a0a] border border-white/10 rounded-[40px] p-8 max-w-3xl w-full shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-thin">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/40 hover:text-white transition-colors z-10"
        >
          <XCircle size={20} />
        </button>
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-[#08CB00]/10 rounded-2xl text-[#08CB00]">
            <SelectedIcon size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-lg font-black uppercase italic text-white truncate">{offer.brand_n_model}</p>
            <p className="text-xs text-white/40 font-medium">{offer.category} · {offer.device_state}</p>
          </div>
          {offer.isNew && (
            <span className="text-[10px] font-black bg-[#08CB00] text-black px-2 py-1 rounded-full">NEW</span>
          )}
        </div>
        
        {/* Score & Cost */}
        <div className="space-y-3 mb-8">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-[#08CB00]/10 border border-[#08CB00]/20 rounded-2xl p-4">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1">Match Score</p>
              <p className="text-2xl font-black text-[#08CB00]">{offer.your_score}%</p>
            </div>
            {offer.estimated_cost && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1">Est. Cost</p>
                <p className="text-2xl font-black text-white">${offer.estimated_cost}</p>
              </div>
            )}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
            <div className="py-2 border-b border-white/5">
              <span className="text-white/30 block text-[10px] uppercase">Submission Type</span>
              <span className="font-bold text-white/80">{offer.submission_type}</span>
            </div>
            <div className="py-2 border-b border-white/5">
              <span className="text-white/30 block text-[10px] uppercase">Submission ID</span>
              <span className="font-mono text-white/60">#{offer.submit_id}</span>
            </div>
            <div className="py-2 border-b border-white/5">
              <span className="text-white/30 block text-[10px] uppercase">Weight</span>
              <span className="font-bold text-white/80">{offer.estimated_weight}kg</span>
            </div>
            <div className="py-2 border-b border-white/5">
              <span className="text-white/30 block text-[10px] uppercase">Device State</span>
              <span className="font-bold text-white/80">{offer.device_state}</span>
            </div>
            <div className="py-2 border-b border-white/5">
              <span className="text-white/30 block text-[10px] uppercase">Pickup Date</span>
              <span className="font-bold text-white/80">{offer.preferred_date}</span>
            </div>
            {offer.preferred_time && (
              <div className="py-2 border-b border-white/5">
                <span className="text-white/30 block text-[10px] uppercase">Pickup Time</span>
                <span className="font-bold text-white/80">{offer.preferred_time}</span>
              </div>
            )}
            <div className="py-2 border-b border-white/5">
              <span className="text-white/30 block text-[10px] uppercase">Distance</span>
              <span className="font-bold text-[#08CB00]">{offer.distance}km away</span>
            </div>
            <div className="py-2 border-b border-white/5">
              <span className="text-white/30 block text-[10px] uppercase">Expires</span>
              <span className="font-bold text-white/80">{getTimeRemaining(offer.expires_at)}</span>
            </div>
            {(offer.latitude && offer.longitude) && (
              <div className="py-2 border-b border-white/5">
                <span className="text-white/30 block text-[10px] uppercase">Location</span>
                <span className="font-mono text-[10px] text-white/60">{offer.latitude.toFixed(4)}, {offer.longitude.toFixed(4)}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Mineral Composition */}
        {offer.mineral_composition && (
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 mt-4">
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-3">Mineral Composition Breakdown</p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {offer.mineral_composition.gold_usd > 0 && (
                <div className="py-1.5 px-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <span className="text-[9px] text-white/40 uppercase block">Gold</span>
                  <span className="font-bold text-yellow-400">${offer.mineral_composition.gold_usd}</span>
                </div>
              )}
              {offer.mineral_composition.silver_usd > 0 && (
                <div className="py-1.5 px-2 bg-gray-400/10 border border-gray-400/20 rounded-lg">
                  <span className="text-[9px] text-white/40 uppercase block">Silver</span>
                  <span className="font-bold text-gray-300">${offer.mineral_composition.silver_usd}</span>
                </div>
              )}
              {offer.mineral_composition.lithium_usd > 0 && (
                <div className="py-1.5 px-2 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <span className="text-[9px] text-white/40 uppercase block">Lithium</span>
                  <span className="font-bold text-purple-400">${offer.mineral_composition.lithium_usd}</span>
                </div>
              )}
              {offer.mineral_composition.aluminum_usd > 0 && (
                <div className="py-1.5 px-2 bg-slate-400/10 border border-slate-400/20 rounded-lg">
                  <span className="text-[9px] text-white/40 uppercase block">Aluminum</span>
                  <span className="font-bold text-slate-300">${offer.mineral_composition.aluminum_usd}</span>
                </div>
              )}
              {offer.mineral_composition.platinum_usd > 0 && (
                <div className="py-1.5 px-2 bg-indigo-400/10 border border-indigo-400/20 rounded-lg">
                  <span className="text-[9px] text-white/40 uppercase block">Platinum</span>
                  <span className="font-bold text-indigo-300">${offer.mineral_composition.platinum_usd}</span>
                </div>
              )}
              {offer.mineral_composition.rhodium_usd > 0 && (
                <div className="py-1.5 px-2 bg-pink-400/10 border border-pink-400/20 rounded-lg">
                  <span className="text-[9px] text-white/40 uppercase block">Rhodium</span>
                  <span className="font-bold text-pink-300">${offer.mineral_composition.rhodium_usd}</span>
                </div>
              )}
              {offer.mineral_composition.nickel_usd > 0 && (
                <div className="py-1.5 px-2 bg-emerald-400/10 border border-emerald-400/20 rounded-lg">
                  <span className="text-[9px] text-white/40 uppercase block">Nickel</span>
                  <span className="font-bold text-emerald-300">${offer.mineral_composition.nickel_usd}</span>
                </div>
              )}
              {offer.mineral_composition.tin_usd > 0 && (
                <div className="py-1.5 px-2 bg-cyan-400/10 border border-cyan-400/20 rounded-lg">
                  <span className="text-[9px] text-white/40 uppercase block">Tin</span>
                  <span className="font-bold text-cyan-300">${offer.mineral_composition.tin_usd}</span>
                </div>
              )}
              {offer.mineral_composition.carbon_usd > 0 && (
                <div className="py-1.5 px-2 bg-stone-400/10 border border-stone-400/20 rounded-lg">
                  <span className="text-[9px] text-white/40 uppercase block">Carbon</span>
                  <span className="font-bold text-stone-300">${offer.mineral_composition.carbon_usd}</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Actions */}
        <div className="space-y-3 mt-6">
          <button 
            onClick={handleAcceptClick}
            className="w-full py-4 bg-[#08CB00] text-black rounded-xl text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#08CB00]/80 transition-colors"
          >
            <CheckCircle2 size={18} /> Accept Offer
          </button>
          <button 
            onClick={() => setShowDeclineWorkflow(true)}
            className="w-full py-4 bg-white/5 border border-white/10 text-white/60 rounded-xl text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 hover:border-red-500/30 hover:text-red-400 transition-colors"
          >
            <XCircle size={18} /> Decline
          </button>
        </div>
      </div>

      {/* Accept Workflow */}
      {showWorkflow && (
        <AcceptWorkflow
          submission={offer}
          onClose={() => setShowWorkflow(false)}
          onComplete={handleWorkflowComplete}
        />
      )}

      {/* Decline Workflow */}
      {showDeclineWorkflow && (
        <DeclineWorkflow
          submission={offer}
          onClose={() => setShowDeclineWorkflow(false)}
          onDeclineComplete={(submitId) => {
            setShowDeclineWorkflow(false);
            onClose();
            if (onDeclineComplete) onDeclineComplete(submitId);
          }}
        />
      )}
    </div>
  );
};

export default OfferModal;
