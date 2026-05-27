"use client"
import React, { useState } from 'react';
import { 
  Building2,
  Truck,
  X,
  MapPin,
  Star,
  Package,
  Clock,
  CheckCircle2,
  ChevronRight,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import DropOffSitesModal from './DropOffSitesModal';
import CourierSelectionModal from './CourierSelectionModal';

const AcceptWorkflow = ({ submission, onClose, onComplete }) => {
  const [step, setStep] = useState('CHOICE'); // CHOICE, ACCEPTING, DROPOFF, COURIER, CONFIRMATION
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);
  const [selectedCourier, setSelectedCourier] = useState(null);
  const [acceptError, setAcceptError] = useState(null);

  const handleOptionSelect = async (option) => {
    setSelectedOption(option);
    setAcceptError(null);
    setStep('ACCEPTING');

    try {
      const res = await fetch(`http://127.0.0.1:8000/dispatch/offers/${submission.submit_id}/accept`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setAcceptError(data.message || 'Failed to accept offer.');
        setStep('CHOICE');
        return;
      }

      if (option === 'DROPOFF') {
        setStep('DROPOFF');
      } else {
        setStep('COURIER');
      }
    } catch {
      setAcceptError('Network error. Please try again.');
      setStep('CHOICE');
    }
  };

  const handleSiteSelect = (site) => {
    setSelectedSite(site);
    setStep('CONFIRMATION');
  };

  const handleCourierSelect = (courier) => {
    setSelectedCourier(courier);
    setStep('CONFIRMATION');
  };

  const handleConfirm = () => {
    // Close modal immediately after confirmation - receipt/assessment happens in custodyComp
    onComplete({
      submission,
      deliveryMethod: selectedOption,
      site: selectedSite,
      courier: selectedCourier,
      status: 'ACCEPTED'
    });
    onClose();
  };

  const ChoiceStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-xl font-black text-white mb-2">Choose Delivery Method</h3>
        <p className="text-sm text-white/40">How would you like to receive this submission?</p>
      </div>

      {acceptError && (
        <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
          <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
          <p className="text-xs font-bold text-red-400">{acceptError}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {/* Drop-off Option */}
        <button
          onClick={() => handleOptionSelect('DROPOFF')}
          className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:border-[#08CB00]/50 hover:bg-[#08CB00]/5 transition-all group text-left"
        >
          <div className="w-14 h-14 bg-[#08CB00]/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-[#08CB00]/20 transition-colors">
            <Building2 size={28} className="text-[#08CB00]" />
          </div>
          <h4 className="text-lg font-black text-white mb-2">Drop-off Site</h4>
          <p className="text-xs text-white/40 mb-3">User delivers to a nearby GreenHoop collection point</p>
          <div className="flex items-center gap-2 text-[#08CB00] text-xs font-bold">
            <span>View Sites</span>
            <ChevronRight size={14} />
          </div>
        </button>

        {/* Courier Option */}
        <button
          onClick={() => handleOptionSelect('COURIER')}
          className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group text-left"
        >
          <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
            <Truck size={28} className="text-blue-500" />
          </div>
          <h4 className="text-lg font-black text-white mb-2">Courier Pickup</h4>
          <p className="text-xs text-white/40 mb-3">Arrange a certified courier to collect from the user</p>
          <div className="flex items-center gap-2 text-blue-500 text-xs font-bold">
            <span>View Couriers</span>
            <ChevronRight size={14} />
          </div>
        </button>
      </div>

      {/* Cost Comparison */}
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 mt-6">
        <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-3">Cost Comparison</p>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-white/60">Drop-off (User pays)</span>
            <span className="text-[#08CB00] font-bold">$0.00</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/60">Courier (You pay)</span>
            <span className="text-blue-400 font-bold">~$5-15</span>
          </div>
          <div className="border-t border-white/10 pt-2 mt-2 flex justify-between items-center">
            <span className="text-white font-bold">Your Potential Profit</span>
            <span className="text-[#08CB00] font-black">${submission.estimated_cost}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const ConfirmationStep = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-[#08CB00]/10 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle2 size={40} className="text-[#08CB00]" />
      </div>
      
      <div>
        <h3 className="text-2xl font-black text-white mb-2">Submission Accepted!</h3>
        <p className="text-sm text-white/40">#{submission.submit_id} is now yours</p>
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-left space-y-3">
        <div className="flex justify-between text-xs">
          <span className="text-white/40">Delivery Method</span>
          <span className="text-white font-bold">{selectedOption === 'DROPOFF' ? 'Drop-off Site' : 'Courier Pickup'}</span>
        </div>
        {selectedSite && (
          <div className="flex justify-between text-xs">
            <span className="text-white/40">Drop-off Location</span>
            <span className="text-white font-bold text-right">{selectedSite.name}</span>
          </div>
        )}
        {selectedCourier && (
          <div className="flex justify-between text-xs">
            <span className="text-white/40">Courier</span>
            <span className="text-white font-bold">{selectedCourier.courier_name}</span>
          </div>
        )}
        <div className="flex justify-between text-xs">
          <span className="text-white/40">{selectedOption === 'DROPOFF' ? 'User Pays' : 'You Will Pay'}</span>
          <span className="text-[#08CB00] font-bold">${submission.estimated_cost}</span>
        </div>
      </div>

      <div className="bg-[#08CB00]/10 border border-[#08CB00]/20 rounded-xl p-4">
        <p className="text-xs text-[#08CB00] font-bold mb-1">Next Steps</p>
        <p className="text-[10px] text-white/60">
          {selectedOption === 'DROPOFF' 
            ? `The user has been notified to deliver to ${selectedSite?.name}. You'll be notified when they arrive.`
            : `${selectedCourier?.courier_name} will contact the user to arrange pickup. You'll be updated on the progress.`
          }
        </p>
      </div>

      <button
        onClick={handleConfirm}
        className="w-full py-4 bg-[#08CB00] text-black rounded-xl text-sm font-black uppercase tracking-wider hover:bg-[#08CB00]/80 transition-colors"
      >
        Confirm & Close
      </button>
    </div>
  );


  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative bg-[#0a0a0a] border border-white/10 rounded-[40px] p-8 max-w-4xl w-full shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-thin">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/40 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        {/* Progress Indicator - Simple 3-step flow */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {['CHOICE', selectedOption === 'COURIER' ? 'COURIER' : 'DROPOFF', 'CONFIRMATION'].map((s, i) => {
            const steps = ['CHOICE', selectedOption === 'COURIER' ? 'COURIER' : 'DROPOFF', 'CONFIRMATION'];
            const isActive = s === step;
            const currentIndex = steps.indexOf(step);
            const stepIndex = i;
            const isPast = currentIndex > stepIndex;
            return (
              <React.Fragment key={s}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isActive ? 'bg-[#08CB00] text-black' : 
                  isPast ? 'bg-[#08CB00]/30 text-[#08CB00]' : 'bg-white/10 text-white/40'
                }`}>
                  {isPast ? <CheckCircle2 size={16} /> : i + 1}
                </div>
                {i < 2 && (
                  <div className={`w-8 h-0.5 transition-all ${isPast ? 'bg-[#08CB00]' : 'bg-white/10'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Submission Summary Header */}
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-4">
            <Package size={20} className="text-[#08CB00]" />
            <div className="flex-1">
              <p className="text-sm font-black text-white">{submission.brand_n_model}</p>
              <p className="text-xs text-white/40">{submission.category} · {submission.estimated_weight}kg · ${submission.estimated_cost}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/30">Submit ID</p>
              <p className="text-sm font-mono text-white/60">#{submission.submit_id}</p>
            </div>
          </div>
        </div>

        {/* Step Content */}
        {step === 'CHOICE' && <ChoiceStep />}
        {step === 'DROPOFF' && (
          <DropOffSitesModal
            sites={[]} // Will be imported from constants
            submission={submission}
            onSelect={handleSiteSelect}
            onBack={() => setStep('CHOICE')}
          />
        )}
        {step === 'COURIER' && (
          <CourierSelectionModal
            submission={submission}
            onSelect={handleCourierSelect}
            onBack={() => setStep('CHOICE')}
          />
        )}
        {step === 'PAYMENT' && (
          <PaymentModal
            submission={submission}
            deliveryMethod={selectedOption}
            site={selectedSite}
            courier={selectedCourier}
            onComplete={handlePaymentComplete}
            onBack={() => setStep('AWAITING_RECEIPT')}
          />
        )}
        {step === 'ACCEPTING' && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <Loader2 size={32} className="text-[#08CB00] animate-spin" />
            <p className="text-sm font-black text-white uppercase tracking-widest">Claiming Offer...</p>
            <p className="text-xs text-white/30">Securing #{submission.submit_id} for you</p>
          </div>
        )}
        {step === 'CONFIRMATION' && <ConfirmationStep />}
      </div>
    </div>
  );
};

export default AcceptWorkflow;
