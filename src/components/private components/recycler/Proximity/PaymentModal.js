"use client"
import React, { useState } from 'react';
import { 
  ChevronLeft,
  Wallet,
  CreditCard,
  Building2,
  Truck,
  CheckCircle2,
  Loader2,
  Shield,
  Lock,
  AlertTriangle,
  Plus,
  ArrowRight
} from 'lucide-react';
import { calculateCourierCost } from './constants';

// Dummy wallet data
const WALLET_DATA = {
  balance: 156.75,
  currency: 'USD',
  transactions: []
};

const PaymentModal = ({ submission, deliveryMethod, site, courier, onComplete, onBack }) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('SELECTING'); // SELECTING, PROCESSING, SUCCESS
  const [addFundsAmount, setAddFundsAmount] = useState('');
  const [showAddFunds, setShowAddFunds] = useState(false);

  // Calculate costs
  const submissionCost = submission.estimated_cost || 0;
  const courierCost = courier ? calculateCourierCost(courier, submission.estimated_weight) : 0;
  const totalCost = deliveryMethod === 'COURIER' ? submissionCost + courierCost : submissionCost;

  const handlePayment = async (method) => {
    setSelectedMethod(method);
    setPaymentStatus('PROCESSING');

    // Simulate payment processing
    setTimeout(() => {
      setPaymentStatus('SUCCESS');
      setTimeout(() => {
        onComplete(method, 'SUCCESS');
      }, 1500);
    }, 2000);
  };

  const handleAddFunds = () => {
    setShowAddFunds(true);
  };

  const confirmAddFunds = () => {
    // Simulate adding funds
    setShowAddFunds(false);
    setAddFundsAmount('');
  };

  const hasEnoughWalletBalance = WALLET_DATA.balance >= totalCost;

  if (paymentStatus === 'PROCESSING') {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 border-4 border-[#08CB00]/20 border-t-[#08CB00] rounded-full animate-spin mx-auto mb-6"></div>
        <h3 className="text-xl font-black text-white mb-2">Processing Payment...</h3>
        <p className="text-sm text-white/40">
          {selectedMethod === 'WALLET' ? 'Deducting from GreenHoop Wallet' : 'Connecting to Payment Gateway'}
        </p>
      </div>
    );
  }

  if (paymentStatus === 'SUCCESS') {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-[#08CB00]/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={32} className="text-[#08CB00]" />
        </div>
        <h3 className="text-xl font-black text-white mb-2">Payment Successful!</h3>
        <p className="text-sm text-white/40">${totalCost.toFixed(2)} has been processed</p>
      </div>
    );
  }

  // Add Funds Modal
  if (showAddFunds) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowAddFunds(false)}
            className="p-2 hover:bg-white/5 rounded-xl transition-colors"
          >
            <ChevronLeft size={24} className="text-white/60" />
          </button>
          <div>
            <h3 className="text-xl font-black text-white">Add Funds to Wallet</h3>
            <p className="text-xs text-white/40">Current balance: ${WALLET_DATA.balance.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-3">Amount to Add</p>
          <div className="relative mb-6">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-xl">$</span>
            <input
              type="number"
              value={addFundsAmount}
              onChange={(e) => setAddFundsAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-10 py-4 text-2xl font-black text-white outline-none focus:border-[#08CB00]"
            />
          </div>

          <div className="grid grid-cols-4 gap-2 mb-6">
            {[10, 25, 50, 100].map((amount) => (
              <button
                key={amount}
                onClick={() => setAddFundsAmount(amount.toString())}
                className="py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-bold text-white/60 hover:bg-white/10 transition-colors"
              >
                ${amount}
              </button>
            ))}
          </div>

          <button
            onClick={confirmAddFunds}
            disabled={!addFundsAmount || Number(addFundsAmount) <= 0}
            className="w-full py-4 bg-[#08CB00] text-black rounded-xl text-sm font-black uppercase tracking-wider hover:bg-[#08CB00]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add ${addFundsAmount || '0.00'} to Wallet
          </button>
        </div>

        <div className="flex items-start gap-2 text-[10px] text-white/30">
          <Shield size={14} className="shrink-0" />
          <p>Funds will be available instantly. You can use them for any future submissions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-white/5 rounded-xl transition-colors"
        >
          <ChevronLeft size={24} className="text-white/60" />
        </button>
        <div>
          <h3 className="text-xl font-black text-white">Complete Payment</h3>
          <p className="text-xs text-white/40">Choose your payment method</p>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
        <div className="flex items-center gap-3 mb-4">
          {deliveryMethod === 'DROPOFF' ? (
            <Building2 size={20} className="text-[#08CB00]" />
          ) : (
            <Truck size={20} className="text-blue-400" />
          )}
          <div className="flex-1">
            <p className="text-sm font-bold text-white">
              {deliveryMethod === 'DROPOFF' ? 'Drop-off Site' : 'Courier Pickup'}
            </p>
            <p className="text-[10px] text-white/40">
              {site?.name || courier?.company_name}
            </p>
          </div>
        </div>

        <div className="space-y-2 text-xs border-t border-white/10 pt-3">
          <div className="flex justify-between">
            <span className="text-white/40">Submission Cost</span>
            <span className="text-white font-bold">${submissionCost.toFixed(2)}</span>
          </div>
          {deliveryMethod === 'COURIER' && courier && (
            <div className="flex justify-between">
              <span className="text-white/40">Courier Fee</span>
              <span className="text-white font-bold">${courierCost.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between pt-2 border-t border-white/10">
            <span className="text-white font-bold">Total Amount</span>
            <span className="text-xl font-black text-[#08CB00]">${totalCost.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="space-y-3">
        <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider">Payment Methods</p>

        {/* Wallet Option */}
        <div
          onClick={() => hasEnoughWalletBalance && setSelectedMethod('WALLET')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedMethod === 'WALLET'
              ? 'bg-[#08CB00]/10 border-[#08CB00] ring-1 ring-[#08CB00]'
              : hasEnoughWalletBalance
                ? 'bg-white/[0.02] border-white/10 hover:border-white/30'
                : 'bg-white/[0.02] border-white/5 opacity-50 cursor-not-allowed'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              selectedMethod === 'WALLET' ? 'bg-[#08CB00] text-black' : 'bg-white/5 text-white/40'
            }`}>
              <Wallet size={24} />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-black text-white">GreenHoop Wallet</h4>
              <p className="text-[10px] text-white/40">
                Balance: ${WALLET_DATA.balance.toFixed(2)}
                {!hasEnoughWalletBalance && (
                  <span className="text-red-400 ml-1">(Insufficient)</span>
                )}
              </p>
            </div>
            {!hasEnoughWalletBalance ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddFunds();
                }}
                className="px-3 py-1.5 bg-[#08CB00]/20 text-[#08CB00] rounded-lg text-[10px] font-bold flex items-center gap-1"
              >
                <Plus size={12} />
                Add Funds
              </button>
            ) : selectedMethod === 'WALLET' ? (
              <CheckCircle2 size={24} className="text-[#08CB00]" />
            ) : null}
          </div>
        </div>

        {/* Credit Card Option */}
        <div
          onClick={() => setSelectedMethod('CARD')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedMethod === 'CARD'
              ? 'bg-blue-500/10 border-blue-500 ring-1 ring-blue-500'
              : 'bg-white/[0.02] border-white/10 hover:border-white/30'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              selectedMethod === 'CARD' ? 'bg-blue-500 text-white' : 'bg-white/5 text-white/40'
            }`}>
              <CreditCard size={24} />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-black text-white">Credit/Debit Card</h4>
              <p className="text-[10px] text-white/40">Visa, Mastercard, American Express</p>
            </div>
            {selectedMethod === 'CARD' && (
              <CheckCircle2 size={24} className="text-blue-500" />
            )}
          </div>
        </div>

        {/* Bank Transfer Option */}
        <div
          onClick={() => setSelectedMethod('BANK')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedMethod === 'BANK'
              ? 'bg-purple-500/10 border-purple-500 ring-1 ring-purple-500'
              : 'bg-white/[0.02] border-white/10 hover:border-white/30'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              selectedMethod === 'BANK' ? 'bg-purple-500 text-white' : 'bg-white/5 text-white/40'
            }`}>
              <Building2 size={24} />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-black text-white">Bank Transfer</h4>
              <p className="text-[10px] text-white/40">ECOCASH, OneMoney, Bank Transfer</p>
            </div>
            {selectedMethod === 'BANK' && (
              <CheckCircle2 size={24} className="text-purple-500" />
            )}
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="flex items-center gap-3 bg-white/[0.02] rounded-xl p-3">
        <div className="w-10 h-10 bg-[#08CB00]/10 rounded-lg flex items-center justify-center shrink-0">
          <Lock size={18} className="text-[#08CB00]" />
        </div>
        <div>
          <p className="text-xs font-bold text-white">Secure Payment</p>
          <p className="text-[10px] text-white/40">256-bit encryption. Your payment information is secure.</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={onBack}
          className="flex-1 py-4 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white/60 hover:bg-white/10 transition-colors"
        >
          Back
        </button>
        <button
          onClick={() => selectedMethod && handlePayment(selectedMethod)}
          disabled={!selectedMethod}
          className={`flex-1 py-4 rounded-xl text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${
            selectedMethod 
              ? 'bg-[#08CB00] text-black hover:bg-[#08CB00]/80' 
              : 'bg-white/10 text-white/40 cursor-not-allowed'
          }`}
        >
          {selectedMethod ? (
            <>
              Pay ${totalCost.toFixed(2)}
              <ArrowRight size={18} />
            </>
          ) : (
            'Select Payment'
          )}
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;
