"use client"
import React, { useState, useEffect } from 'react';
import { X, Tag, User, Scale, MapPin, CheckCircle2, ShoppingCart, Loader2, Star, Info, Wrench, RefreshCw, ArrowUpRight, Plus, Trash2, Truck, Car, ChevronLeft, Clock, Phone, AlertCircle, Package, PackageCheck, Bell, QrCode, Hash, CreditCard } from 'lucide-react';
import Link from 'next/link';

const SOURCE_CFG = {
  user:        { label: 'Direct Submission', icon: User, cls: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  marketplace: { label: 'Marketplace',        icon: Tag,  cls: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
};

const STATE_CFG = {
  good:    { label: 'Good',    cls: 'bg-[#08CB00]/10 border-[#08CB00]/20 text-[#08CB00]' },
  fair:    { label: 'Fair',    cls: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' },
  poor:    { label: 'Poor',    cls: 'bg-red-500/10 border-red-500/20 text-red-400' },
  unknown: { label: 'Unknown', cls: 'bg-white/5 border-white/10 text-white/30' },
};

/* ── Modal backdrop wrapper ── */
function Modal({ onClose, children }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
      <div className="relative z-10 w-full max-w-lg" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

const API_BASE = 'http://127.0.0.1:8000';

/* ── Purchase Intent Modal (user / direct submission) — 3-step flow ── */
function PurchaseIntentModal({ item, onClose, onConfirm }) {
  // step: 'intent' | 'delivery' | 'courier'
  const [step, setStep]             = useState('intent');
  const [intent, setIntent]         = useState(null);
  const [parts, setParts]           = useState(['']);
  const [delivery, setDelivery]     = useState(null); // 'courier' | 'self'
  const [couriers, setCouriers]     = useState([]);
  const [couriersLoading, setCouriersLoading] = useState(false);
  const [couriersError, setCouriersError]     = useState(null);
  const [selectedCourier, setSelectedCourier] = useState(null);
  const [submitting, setSubmitting]     = useState(false);
  const [submitError, setSubmitError]   = useState(null);
  const [done, setDone]                 = useState(false);
  const [awaitingPayment, setAwaitingPayment] = useState(false);
  const [courierFee, setCourierFee]     = useState(null);
  const [receiving, setReceiving]       = useState(false);
  const [receiveError, setReceiveError] = useState(null);
  const [received, setReceived]           = useState(false);
  const [amountPaid, setAmountPaid]       = useState(null);
  const [receivedCourierFee, setReceivedCourierFee] = useState(null);
  const [availableBalance, setAvailableBalance]     = useState(null);

  const addPart    = () => setParts(p => [...p, '']);
  const removePart = i  => setParts(p => p.filter((_, idx) => idx !== i));
  const setPart    = (i, val) => setParts(p => p.map((v, idx) => idx === i ? val : v));
  const validParts = parts.filter(p => p.trim().length > 0);
  const intentOk   = intent === 'second-life' || (intent === 'parts' && validParts.length > 0);

  const fetchCouriers = () => {
    setCouriersLoading(true);
    setCouriersError(null);
    fetch(`${API_BASE}/courier/nearby-couriers/${item.submit_id}`, { credentials: 'include' })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        const mapped = (data.couriers || []).map(c => ({
          courier_id:         c.courier_id,
          courier_name:       c.company_name || c.username,
          phone:              c.phone_number,
          service_area:       c.service_area,
          is_online:          c.is_online,
          max_capacity:       c.max_weight_capacity_kg,
          current_load:       c.current_load_kg,
          available_capacity: c.available_capacity_kg,
          distance_km:        c.distance_km,
          eta_min:            c.eta_min,
        }));
        setCouriers(mapped.filter(c => c.is_online));
      })
      .catch(() => setCouriersError('Could not load nearby couriers.'))
      .finally(() => setCouriersLoading(false));
  };

  const goToDelivery = () => {
    if (!intentOk) return;
    setStep('delivery');
  };

  const selectDelivery = (method) => {
    setDelivery(method);
    if (method === 'courier') {
      setStep('courier');
      fetchCouriers();
    }
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      // Step 1: save purchase intent — no courier_id here anymore
      const intentRes = await fetch(`${API_BASE}/technician/purchase-intent`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submit_id: Number(item.submit_id),
          intent:    intent,
          parts:     intent === 'parts' ? validParts : [],
          delivery:  delivery,
        }),
      });
      const intentData = await intentRes.json().catch(() => ({}));
      if (!intentRes.ok || !intentData.success) {
        setSubmitError(intentData.error || intentData.detail || 'Could not save purchase intent. Please try again.');
        setSubmitting(false);
        return;
      }

      if (delivery === 'courier') {
        // Step 2a: assign courier
        const res = await fetch(`${API_BASE}/courier/assign-courier`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            submit_id:       item.submit_id,
            courier_user_id: selectedCourier.courier_id,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!data.success) {
          setSubmitError(data.error || 'Could not assign courier. Please try again.');
          setSubmitting(false);
          return;
        }
        // Parse courier fee from data.submission.pay (e.g. "$12.50")
        const rawPay = data.submission?.pay;
        setCourierFee(rawPay != null ? parseFloat(String(rawPay).replace(/[^0-9.]/g, '')) : null);
        setAwaitingPayment(true);
      } else {
        // Self-collect: confirm pickup directly
        const res = await fetch(`${API_BASE}/technician/confirm/${item.submit_id}`, {
          method: 'POST',
          credentials: 'include',
        });
        const data = await res.json().catch(() => ({}));
        if (!data.success) {
          setSubmitError(data.error || 'Could not confirm pickup. Please try again.');
          setSubmitting(false);
          return;
        }
        await onConfirm({ item, intent, parts: intent === 'parts' ? validParts : [], delivery, courier_id: null });
        setDone(true);
      }
    } catch {
      setSubmitError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaymentAcknowledge = async () => {
    // No API call here — payment is collected on Received. Just move to done state.
    await onConfirm({ item, intent, parts: intent === 'parts' ? validParts : [], delivery, courier_id: selectedCourier?.courier_id });
    setAwaitingPayment(false);
    setDone(true);
  };

  const handleReceived = async () => {
    setReceiving(true);
    setReceiveError(null);
    try {
      const res = await fetch(`${API_BASE}/technician/received/${item.submit_id}`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json().catch(() => ({}));
      if (!data.success) {
        setReceiveError(data.error || 'Could not confirm receipt. Please try again.');
      } else {
        setAmountPaid(data.amount_paid ?? null);
        setReceivedCourierFee(data.courier_fee ?? null);
        setAvailableBalance(data.available_balance ?? null);
        setReceived(true);
      }
    } catch {
      setReceiveError('Network error. Please try again.');
    } finally {
      setReceiving(false);
    }
  };

  const STEPS = { intent: 1, delivery: 2, courier: 3 };
  const stepNum = STEPS[step] || 1;

  return (
    <Modal onClose={onClose}>
      <div className="bg-[#0e0e0e] border border-white/10 rounded-[32px] p-6 flex flex-col gap-5 shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-none">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {step !== 'intent' && (
                <button onClick={() => setStep(step === 'courier' ? 'delivery' : 'intent')}
                  className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all">
                  <ChevronLeft size={12} />
                </button>
              )}
              <p className="text-[9px] font-black uppercase tracking-widest text-blue-400">Direct Submission Purchase</p>
            </div>
            <h2 className="text-xl font-black italic tracking-tighter text-white">
              {item.item_name || item.brand_n_model || 'E-Waste Item'}
            </h2>
            <p className="text-[9px] text-white/30 uppercase tracking-widest mt-0.5">{item.category}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/30 hover:text-white transition-all shrink-0">
            <X size={13} />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2">
          {[1,2,3].map(n => (
            <div key={n} className={`h-1 flex-1 rounded-full transition-all ${
              n <= stepNum ? 'bg-[#08CB00]' : 'bg-white/10'
            }`} />
          ))}
        </div>

        {/* Price */}
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl px-4 py-3 flex items-center justify-between">
          <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Purchase Price</span>
          <span className="text-2xl font-black text-[#08CB00]">{item.asking_price != null ? `$${item.asking_price}` : '—'}</span>
        </div>

        {received ? (
          /* ── Fully received ── */
          <div className="flex flex-col gap-3 py-2">
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-full bg-[#08CB00]/10 border border-[#08CB00]/30 flex items-center justify-center">
                <PackageCheck size={28} className="text-[#08CB00]" />
              </div>
              <p className="text-sm font-black text-white">Item Received!</p>
              <p className="text-[9px] text-white/30 uppercase tracking-widest text-center">
                Receipt confirmed for {item.item_name || item.brand_n_model}.<br />Status → DIAGNOSIS.
              </p>
            </div>

            {/* Payment breakdown */}
            <div className="flex flex-col gap-2 bg-white/[0.03] border border-white/5 rounded-2xl px-4 py-3">
              {amountPaid != null && (
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-white/40 uppercase tracking-widest font-bold">Paid to Seller</span>
                  <span className="text-sm font-black text-[#08CB00]">${Number(amountPaid).toFixed(2)}</span>
                </div>
              )}
              {receivedCourierFee != null && (
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-white/40 uppercase tracking-widest font-bold">Courier Fee</span>
                  <span className="text-sm font-black text-white">${Number(receivedCourierFee).toFixed(2)}</span>
                </div>
              )}
              {(amountPaid != null || receivedCourierFee != null) && (
                <>
                  <div className="h-px bg-white/10 my-1" />
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/60">Total Paid</span>
                    <span className="text-lg font-black text-[#08CB00]">
                      ${(Number(amountPaid ?? 0) + Number(receivedCourierFee ?? 0)).toFixed(2)}
                    </span>
                  </div>
                </>
              )}
              {availableBalance != null && (
                <div className="flex items-center justify-between pt-1 border-t border-white/5 mt-1">
                  <span className="text-[9px] text-white/25 uppercase tracking-widest font-bold">Wallet Balance</span>
                  <span className="text-sm font-black text-white/60">${Number(availableBalance).toFixed(2)}</span>
                </div>
              )}
            </div>

            <button onClick={onClose} className="w-full px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors">
              Close
            </button>
          </div>

        ) : awaitingPayment ? (
          /* ── Payment summary (courier path) — no API, payment on Received ── */
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col items-center gap-2 py-2">
              <div className="w-14 h-14 rounded-full bg-[#08CB00]/10 border border-[#08CB00]/30 flex items-center justify-center">
                <CreditCard size={26} className="text-[#08CB00]" />
              </div>
              <p className="text-sm font-black text-white">Payment Summary</p>
              <p className="text-[9px] text-white/30 uppercase tracking-widest text-center">
                Courier <span className="text-white/60">{selectedCourier?.courier_name}</span> assigned.<br />
                Payment is collected when you receive the item.
              </p>
            </div>

            {/* Cost breakdown */}
            <div className="flex flex-col gap-2 bg-white/[0.03] border border-white/5 rounded-2xl px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-white/40 uppercase tracking-widest font-bold">Item Cost</span>
                <span className="text-sm font-black text-white">
                  {item.asking_price != null ? `$${Number(item.asking_price).toFixed(2)}` : '—'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-white/40 uppercase tracking-widest font-bold">Courier Fee</span>
                <span className="text-sm font-black text-white">
                  {courierFee != null ? `$${Number(courierFee).toFixed(2)}` : <span className="text-white/20">TBD</span>}
                </span>
              </div>
              <div className="h-px bg-white/10 my-1" />
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-widest text-white/60">Total Due on Receipt</span>
                <span className="text-xl font-black text-[#08CB00]">
                  {item.asking_price != null
                    ? `$${(Number(item.asking_price) + Number(courierFee ?? 0)).toFixed(2)}`
                    : '—'}
                </span>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl px-4 py-3 flex items-start gap-3">
              <Truck size={14} className="text-blue-400 shrink-0 mt-0.5" />
              <p className="text-[10px] text-white/50 leading-snug">
                The courier will collect from the seller. You will pay the total above when you press <strong className="text-white/70">Received</strong>.
              </p>
            </div>

            <button onClick={handlePaymentAcknowledge}
              className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 bg-[#08CB00] text-black hover:bg-[#06b800] shadow-[0_0_20px_rgba(8,203,0,0.3)] transition-all active:scale-95">
              <CheckCircle2 size={16} /> Understood, Proceed
            </button>
          </div>

        ) : done ? (
          /* ── Confirmed — awaiting receipt ── */
          <div className="flex flex-col items-center gap-4 py-4">
            <CheckCircle2 size={36} className="text-[#08CB00]" />
            <p className="text-sm font-black text-white">Purchase Submitted!</p>
            <p className="text-[9px] text-white/30 uppercase tracking-widest text-center">
              {delivery === 'courier'
                ? `Courier ${selectedCourier?.courier_name} has been assigned for collection.`
                : 'You are collecting the item yourself.'}
            </p>
            {intent === 'parts' && (
              <p className="text-[9px] text-white/20 text-center">
                You'll be notified about the {validParts.length} part(s) not needed.
              </p>
            )}
            <div className="w-full border-t border-white/5 pt-4 flex flex-col gap-3">
              <p className="text-[9px] text-white/30 uppercase tracking-widest text-center">Once you have the item in hand</p>
              {receiveError && (
                <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
                  <AlertCircle size={12} className="text-red-400 shrink-0 mt-0.5" />
                  <p className="text-[9px] font-bold text-red-400 leading-snug">{receiveError}</p>
                </div>
              )}
              <button onClick={handleReceived} disabled={receiving}
                className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 bg-[#08CB00] text-black hover:bg-[#06b800] shadow-[0_0_20px_rgba(8,203,0,0.3)] transition-all active:scale-95">
                {receiving
                  ? <><Loader2 size={16} className="animate-spin" /> Confirming…</>
                  : <><PackageCheck size={16} /> Received</>
                }
              </button>
            </div>
          </div>

        ) : step === 'intent' ? (
          /* ── Step 1: Intent ── */
          <>
            <div className="flex flex-col gap-2">
              <p className="text-[9px] font-black uppercase tracking-widest text-white/40">Buying this device for…</p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setIntent('parts')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                    intent === 'parts'
                      ? 'bg-[#08CB00]/10 border-[#08CB00]/40 text-[#08CB00]'
                      : 'bg-white/5 border-white/10 text-white/40 hover:border-white/30'
                  }`}>
                  <Wrench size={20} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Parts</span>
                  <span className="text-[8px] text-center leading-snug opacity-60">I need specific components from this device</span>
                </button>
                <button onClick={() => setIntent('second-life')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                    intent === 'second-life'
                      ? 'bg-[#08CB00]/10 border-[#08CB00]/40 text-[#08CB00]'
                      : 'bg-white/5 border-white/10 text-white/40 hover:border-white/30'
                  }`}>
                  <RefreshCw size={20} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Second Life</span>
                  <span className="text-[8px] text-center leading-snug opacity-60">Refurbishing the whole device for resale</span>
                </button>
              </div>
            </div>

            {intent === 'parts' && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/40">Parts you need</p>
                  <button onClick={addPart} className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-[#08CB00] hover:text-[#06b800] transition-colors">
                    <Plus size={10} /> Add Part
                  </button>
                </div>
                <div className="flex flex-col gap-2 max-h-36 overflow-y-auto scrollbar-none">
                  {parts.map((part, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        value={part}
                        onChange={e => setPart(i, e.target.value)}
                        placeholder="e.g. Battery, Screen, Motherboard…"
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm font-bold text-white placeholder-white/20 focus:outline-none focus:border-[#08CB00]/50 transition-colors"
                      />
                      {parts.length > 1 && (
                        <button onClick={() => removePart(i)} className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-all shrink-0">
                          <Trash2 size={11} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-[8px] text-white/20 leading-snug">
                  You'll receive follow-up messages about remaining parts to ensure full e-waste accountability.
                </p>
              </div>
            )}

            <button onClick={goToDelivery} disabled={!intentOk}
              className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 ${
                intentOk
                  ? 'bg-[#08CB00] text-black hover:bg-[#06b800] shadow-[0_0_20px_rgba(8,203,0,0.3)]'
                  : 'bg-white/5 border border-white/10 text-white/20 cursor-not-allowed'
              }`}>
              Next: Choose Collection Method
            </button>
          </>

        ) : step === 'delivery' ? (
          /* ── Step 2: Delivery method ── */
          <>
            <div className="flex flex-col gap-2">
              <p className="text-[9px] font-black uppercase tracking-widest text-white/40">How will you collect this item?</p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => selectDelivery('courier')}
                  className={`flex flex-col items-center gap-2 p-5 rounded-2xl border transition-all ${
                    delivery === 'courier'
                      ? 'bg-blue-500/10 border-blue-500/40 text-blue-300'
                      : 'bg-white/5 border-white/10 text-white/40 hover:border-white/30'
                  }`}>
                  <Truck size={24} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Courier</span>
                  <span className="text-[8px] text-center leading-snug opacity-60">Assign a courier to collect and deliver to you</span>
                </button>
                <button onClick={() => selectDelivery('self')}
                  className={`flex flex-col items-center gap-2 p-5 rounded-2xl border transition-all ${
                    delivery === 'self'
                      ? 'bg-[#08CB00]/10 border-[#08CB00]/40 text-[#08CB00]'
                      : 'bg-white/5 border-white/10 text-white/40 hover:border-white/30'
                  }`}>
                  <Car size={24} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Self-Collect</span>
                  <span className="text-[8px] text-center leading-snug opacity-60">I'll go pick it up myself</span>
                </button>
              </div>
            </div>

            {delivery === 'self' && (
              <>
                <div className="bg-[#08CB00]/10 border border-[#08CB00]/20 rounded-2xl px-4 py-3 flex items-start gap-3">
                  <Info size={14} className="text-[#08CB00] shrink-0 mt-0.5" />
                  <p className="text-[10px] text-white/50 leading-snug">
                    The seller will be notified that you plan to collect in person. Coordinate pickup directly through the app.
                  </p>
                </div>
                {submitError && (
                  <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
                    <AlertCircle size={12} className="text-red-400 shrink-0 mt-0.5" />
                    <p className="text-[9px] font-bold text-red-400 leading-snug">{submitError}</p>
                  </div>
                )}
                <button onClick={handleConfirm} disabled={submitting}
                  className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 bg-[#08CB00] text-black hover:bg-[#06b800] shadow-[0_0_20px_rgba(8,203,0,0.3)] transition-all active:scale-95">
                  {submitting
                    ? <><Loader2 size={16} className="animate-spin" /> Processing…</>
                    : <><ShoppingCart size={16} /> Confirm</>
                  }
                </button>
              </>
            )}
          </>

        ) : (
          /* ── Step 3: Courier selection ── */
          <>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3 flex items-start gap-3">
              <AlertCircle size={14} className="text-blue-400 shrink-0 mt-0.5" />
              <p className="text-[10px] text-white/50 leading-snug">
                The courier will collect from the seller and deliver to your workshop. You'll be notified on pickup.
              </p>
            </div>

            <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto scrollbar-none">
              {couriersLoading && (
                <div className="flex items-center justify-center py-10 gap-3">
                  <Loader2 size={18} className="text-[#08CB00] animate-spin" />
                  <span className="text-[10px] text-white/30">Scanning for nearby couriers…</span>
                </div>
              )}
              {!couriersLoading && couriersError && (
                <div className="flex flex-col items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                  <p className="text-[10px] font-bold text-red-400">{couriersError}</p>
                  <button onClick={fetchCouriers} className="flex items-center gap-1.5 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] text-white/50 hover:bg-white/10 transition-all">
                    <RefreshCw size={11} /> Retry
                  </button>
                </div>
              )}
              {!couriersLoading && !couriersError && couriers.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <Truck size={24} className="text-white/10" />
                  <p className="text-[10px] text-white/30">No couriers available in your zone right now</p>
                  <button onClick={fetchCouriers} className="flex items-center gap-1.5 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] text-white/50 hover:bg-white/10 transition-all">
                    <RefreshCw size={11} /> Refresh
                  </button>
                </div>
              )}
              {!couriersLoading && couriers.map(courier => {
                const isSelected = selectedCourier?.courier_id === courier.courier_id;
                const capacityPct = courier.max_capacity > 0
                  ? Math.round((courier.current_load / courier.max_capacity) * 100) : 0;
                return (
                  <div key={courier.courier_id} onClick={() => setSelectedCourier(courier)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-500/10 border-blue-500 ring-1 ring-blue-500'
                        : 'bg-white/[0.02] border-white/10 hover:border-white/30'
                    }`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-blue-500 text-white' : 'bg-white/5 text-white/40'
                      }`}>
                        {isSelected ? <CheckCircle2 size={18} /> : <Truck size={18} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="min-w-0">
                            <h4 className="text-sm font-black text-white truncate">{courier.courier_name}</h4>
                            {courier.service_area && <p className="text-[9px] text-white/30 truncate">{courier.service_area}</p>}
                          </div>
                          <span className="shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black bg-[#08CB00]/10 text-[#08CB00]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#08CB00]" /> Online
                          </span>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap mb-2">
                          <span className="flex items-center gap-1 text-[9px] text-white/40">
                            <Clock size={9} className="text-[#08CB00]" /> ~{courier.eta_min}min ETA
                          </span>
                          <span className="flex items-center gap-1 text-[9px] text-white/40">
                            <MapPin size={9} /> {courier.distance_km}km away
                          </span>
                          {courier.phone && (
                            <span className="flex items-center gap-1 text-[9px] text-white/40">
                              <Phone size={9} /> {courier.phone}
                            </span>
                          )}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[8px] text-white/25 font-bold uppercase tracking-wider">Capacity</span>
                            <span className="text-[8px] text-white/40 font-mono">{courier.available_capacity}kg free of {courier.max_capacity}kg</span>
                          </div>
                          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${
                              capacityPct < 60 ? 'bg-[#08CB00]' : capacityPct < 85 ? 'bg-yellow-500' : 'bg-red-500'
                            }`} style={{ width: `${capacityPct}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedCourier && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl px-4 py-3 flex items-center gap-3">
                <Package size={16} className="text-blue-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{selectedCourier.courier_name}</p>
                  <p className="text-[9px] text-white/40">~{selectedCourier.eta_min}min · {selectedCourier.distance_km}km away</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[8px] text-blue-400 font-black uppercase tracking-widest">Free</p>
                  <p className="text-base font-black text-white">{selectedCourier.available_capacity}kg</p>
                </div>
              </div>
            )}

            {submitError && (
              <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
                <AlertCircle size={12} className="text-red-400 shrink-0 mt-0.5" />
                <p className="text-[9px] font-bold text-red-400 leading-snug">{submitError}</p>
              </div>
            )}
            <button onClick={handleConfirm} disabled={!selectedCourier || submitting}
              className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 ${
                selectedCourier && !submitting
                  ? 'bg-[#08CB00] text-black hover:bg-[#06b800] shadow-[0_0_20px_rgba(8,203,0,0.3)]'
                  : 'bg-white/5 border border-white/10 text-white/20 cursor-not-allowed'
              }`}>
              {submitting
                ? <><Loader2 size={16} className="animate-spin" /> Processing…</>
                : selectedCourier ? <><ShoppingCart size={16} /> Confirm</> : 'Select a Courier'
              }
            </button>
          </>
        )}
      </div>
    </Modal>
  );
}

/* ── Marketplace Preview Modal ── */
function MarketplacePreviewModal({ item, onClose }) {
  const state = STATE_CFG[item.device_state?.toLowerCase()] || STATE_CFG.unknown;

  return (
    <Modal onClose={onClose}>
      <div className="bg-[#0e0e0e] border border-white/10 rounded-[32px] p-6 flex flex-col gap-5 shadow-2xl">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-purple-400">Marketplace Listing</p>
            <h2 className="text-xl font-black italic tracking-tighter text-white mt-1">
              {item.item_name || item.brand_n_model || 'E-Waste Item'}
            </h2>
            <p className="text-[9px] text-white/30 uppercase tracking-widest mt-0.5">{item.category}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/30 hover:text-white transition-all shrink-0">
            <X size={13} />
          </button>
        </div>

        {/* Price row */}
        <div className="flex items-end gap-3">
          <span className="text-4xl font-black text-[#08CB00] tracking-tighter">
            {item.asking_price != null ? `$${item.asking_price}` : '—'}
          </span>
          {item.market_value && (
            <span className="text-[10px] font-bold text-white/20 line-through mb-1">${item.market_value}</span>
          )}
          {item.is_bidding && (
            <span className="mb-1 px-2.5 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-[9px] font-black uppercase tracking-widest text-yellow-400">
              Bidding
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Scale,  label: 'Weight',    val: item.estimated_weight ? `${item.estimated_weight} kg` : '—' },
            { icon: Info,   label: 'Condition',  val: <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border ${state.cls}`}>{state.label}</span> },
            { icon: MapPin, label: 'Distance',   val: item.distance != null ? `${item.distance} km` : '—' },
            { icon: Star,   label: 'Salvage Est.',val: item.salvage_value != null ? `$${item.salvage_value}` : '—', green: true },
          ].map(({ icon: Icon, label, val, green }) => (
            <div key={label} className="bg-white/5 border border-white/5 rounded-2xl p-3 flex flex-col gap-1">
              <Icon size={11} className="text-white/30" />
              <p className="text-[8px] text-white/30 font-black uppercase tracking-widest">{label}</p>
              {typeof val === 'string'
                ? <p className={`text-sm font-black ${green ? 'text-[#08CB00]' : 'text-white'}`}>{val}</p>
                : val}
            </div>
          ))}
        </div>

        {/* Description */}
        {item.description && (
          <p className="text-[10px] text-white/30 leading-relaxed bg-white/[0.02] border border-white/5 rounded-2xl p-3">
            {item.description}
          </p>
        )}

        {/* Note */}
        <p className="text-[9px] text-white/20 leading-snug text-center">
          {item.is_bidding
            ? 'This listing requires bidding. Head to the Marketplace to place your bid.'
            : 'To complete your purchase, proceed to the Marketplace page.'}
        </p>

        {/* CTA */}
        <Link href="/technician/Marketplace"
          className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 bg-[#08CB00] text-black hover:bg-[#06b800] shadow-[0_0_20px_rgba(8,203,0,0.3)] transition-all active:scale-95">
          <ArrowUpRight size={16} />
          {item.is_bidding ? 'Place a Bid on Marketplace' : 'Go to Marketplace'}
        </Link>
      </div>
    </Modal>
  );
}

/* ── Main ItemDetailCard ── */
export default function ItemDetailCard({ item, onClose, onBuy }) {
  const [showPurchaseModal, setShowPurchaseModal]         = useState(false);
  const [showMarketplaceModal, setShowMarketplaceModal]   = useState(false);
  // interest states: 'idle' | 'expressing' | 'pending' | 'accepted' | 'rejected'
  const [interestState, setInterestState] = useState('idle');
  const [interestError, setInterestError] = useState(null);

  // Reset when a different item is selected
  useEffect(() => {
    setInterestState('idle');
    setInterestError(null);
    setShowPurchaseModal(false);
  }, [item?.listing_id]);

  const expressInterest = async () => {
    setInterestState('expressing');
    setInterestError(null);
    try {
      const res = await fetch(
        `${API_BASE}/dispatch/offers/${item.submit_id}/accept`,
        { method: 'POST', credentials: 'include' }
      );
      const data = await res.json().catch(() => ({}));
      if (data.success) {
        setInterestState('accepted');
      } else {
        setInterestError(data.message || 'This item is no longer available.');
        setInterestState('idle');
      }
    } catch {
      setInterestError('Network error. Please try again.');
      setInterestState('idle');
    }
  };

  if (!item) return (
    <div className="bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-[32px] p-6 flex flex-col items-center justify-center gap-4 shadow-2xl h-full min-h-[300px]">
      <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
        <MapPin size={24} className="text-white/10" />
      </div>
      <p className="text-[9px] font-black uppercase tracking-widest text-white/20 text-center">
        Select a marker on the map<br />to view item details
      </p>
    </div>
  );

  const src   = SOURCE_CFG[item.source_type] || SOURCE_CFG.user;
  const SrcIcon = src.icon;
  const state = STATE_CFG[item.device_state?.toLowerCase()] || STATE_CFG.unknown;
  const isMarketplace = item.source_type === 'marketplace';

  return (
    <>
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-[32px] p-6 flex flex-col gap-5 shadow-2xl relative max-h-[65vh] overflow-y-auto scrollbar-thin">

        <div className="absolute top-0 right-0 w-48 h-48 bg-[#08CB00]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between relative z-10">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${src.bg}`}>
            <SrcIcon size={12} className={src.cls} />
            <span className={`text-[9px] font-black uppercase tracking-widest ${src.cls}`}>{src.label}</span>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all">
            <X size={12} />
          </button>
        </div>

        {/* Item name */}
        <div className="relative z-10">
          <h2 className="text-2xl font-black italic tracking-tighter text-white leading-tight">
            {item.item_name || item.brand_n_model || 'E-Waste Item'}
          </h2>
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">{item.category || '—'}</p>
        </div>

        {/* Price */}
        <div className="flex items-end gap-3 relative z-10">
          <span className="text-4xl font-black text-[#08CB00] tracking-tighter">
            {item.asking_price != null ? `$${item.asking_price}` : '—'}
          </span>
          {item.market_value && (
            <span className="text-[10px] font-bold text-white/20 line-through mb-1">${item.market_value}</span>
          )}
          {item.is_bidding && (
            <span className="mb-1 px-2.5 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-[9px] font-black uppercase tracking-widest text-yellow-400">
              Bidding
            </span>
          )}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 relative z-10">
          <div className="bg-white/5 border border-white/5 rounded-2xl p-3 flex flex-col gap-1">
            <Scale size={11} className="text-white/30" />
            <p className="text-[8px] text-white/30 font-black uppercase tracking-widest">Weight</p>
            <p className="text-sm font-black text-white">{item.estimated_weight ? `${item.estimated_weight} kg` : '—'}</p>
          </div>
          <div className="bg-white/5 border border-white/5 rounded-2xl p-3 flex flex-col gap-1">
            <Info size={11} className="text-white/30" />
            <p className="text-[8px] text-white/30 font-black uppercase tracking-widest">Condition</p>
            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border w-fit ${state.cls}`}>
              {state.label}
            </span>
          </div>
          <div className="bg-white/5 border border-white/5 rounded-2xl p-3 flex flex-col gap-1">
            <MapPin size={11} className="text-white/30" />
            <p className="text-[8px] text-white/30 font-black uppercase tracking-widest">Distance</p>
            <p className="text-sm font-black text-white">{item.distance != null ? `${item.distance} km` : '—'}</p>
          </div>
          <div className="bg-white/5 border border-white/5 rounded-2xl p-3 flex flex-col gap-1">
            <Star size={11} className="text-white/30" />
            <p className="text-[8px] text-white/30 font-black uppercase tracking-widest">Salvage Est.</p>
            <p className="text-sm font-black text-[#08CB00]">{item.salvage_value != null ? `$${item.salvage_value}` : '—'}</p>
          </div>
        </div>

        {/* Description */}
        {item.description && (
          <p className="text-[10px] text-white/30 leading-relaxed relative z-10 bg-white/[0.02] border border-white/5 rounded-2xl p-3">
            {item.description}
          </p>
        )}

        {/* CTA — differs by source */}
        {isMarketplace ? (
          <button
            onClick={() => setShowMarketplaceModal(true)}
            className="relative z-10 w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500/30 transition-all active:scale-95">
            <ArrowUpRight size={16} /> View on Marketplace
          </button>

        ) : interestState === 'idle' || interestState === 'expressing' ? (
          <div className="relative z-10 flex flex-col gap-2">
            {interestError && (
              <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
                <AlertCircle size={12} className="text-red-400 shrink-0 mt-0.5" />
                <p className="text-[9px] font-bold text-red-400 leading-snug">{interestError}</p>
              </div>
            )}
            <button onClick={expressInterest} disabled={interestState === 'expressing'}
              className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 ${
                interestState === 'expressing'
                  ? 'bg-white/5 border border-white/10 text-white/30 cursor-not-allowed'
                  : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:border-white/30'
              }`}>
              {interestState === 'expressing'
                ? <><Loader2 size={15} className="animate-spin" /> Accepting…</>
                : <><Bell size={15} /> Accept &amp; Express Interest</>
              }
            </button>
          </div>

        ) : interestState === 'accepted' ? (
          <div className="relative z-10 flex flex-col gap-3">
            {item.technician_side_status === 'ASSIGNED' ? (
              <>
                <div className="w-full px-4 py-3 rounded-2xl flex items-center gap-3 bg-[#08CB00]/10 border border-[#08CB00]/20">
                  <CheckCircle2 size={16} className="text-[#08CB00] shrink-0" />
                  <p className="text-[10px] font-black text-[#08CB00] uppercase tracking-widest">User Confirmed — Ready to Buy</p>
                </div>
                <button onClick={() => setShowPurchaseModal(true)}
                  className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 bg-[#08CB00] text-black hover:bg-[#06b800] shadow-[0_0_20px_rgba(8,203,0,0.3)] transition-all active:scale-95">
                  <ShoppingCart size={16} /> Buy Now
                </button>
              </>
            ) : (
              <>
                <div className="w-full px-4 py-3 rounded-2xl flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/20">
                  <Clock size={16} className="text-yellow-400 shrink-0 animate-pulse" />
                  <div>
                    <p className="text-[10px] font-black text-yellow-400 uppercase tracking-widest">Awaiting User Confirmation</p>
                    <p className="text-[8px] text-white/30 leading-snug mt-0.5">The seller has been notified and must confirm before you can purchase.</p>
                  </div>
                </div>
                <button disabled
                  className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white/20 cursor-not-allowed">
                  <ShoppingCart size={16} /> Buy Now
                </button>
              </>
            )}
          </div>
        ) : null}
      </div>

      {/* Modals */}
      {showPurchaseModal && (
        <PurchaseIntentModal
          item={item}
          onClose={() => setShowPurchaseModal(false)}
          onConfirm={onBuy}
        />
      )}
      {showMarketplaceModal && (
        <MarketplacePreviewModal
          item={item}
          onClose={() => setShowMarketplaceModal(false)}
        />
      )}
    </>
  );
}

/* ── Mini Notification Panel (shown below ItemDetailCard in the right column) ── */
export function TechNotificationPanel({ notifications = [], loading = false }) {
  const [dismissed, setDismissed] = useState([]);

  const visible = notifications.filter(n => !dismissed.includes(n.id));

  // API type values: 'purchase', 'success', 'warning', 'info'
  const TYPE_CFG = {
    purchase: { cls: 'bg-[#08CB00]/10 border-[#08CB00]/20', dot: 'bg-[#08CB00]',   label: 'Purchase Update' },
    success:  { cls: 'bg-[#08CB00]/10 border-[#08CB00]/20', dot: 'bg-[#08CB00]',   label: 'Completed' },
    warning:  { cls: 'bg-red-500/10 border-red-500/20',     dot: 'bg-red-500',     label: 'Cancelled' },
    info:     { cls: 'bg-blue-500/10 border-blue-500/20',   dot: 'bg-blue-400',    label: 'Update' },
  };

  const unread = visible.filter(n => !n.read).length;

  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-[24px] p-4 flex flex-col gap-3 max-h-[35vh] overflow-y-auto scrollbar-thin">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell size={13} className="text-white/30" />
          <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Activity</span>
        </div>
        {unread > 0 && (
          <span className="w-4 h-4 rounded-full bg-[#08CB00] flex items-center justify-center text-[8px] font-black text-black">
            {unread}
          </span>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-4 gap-2">
          <Loader2 size={14} className="animate-spin text-white/20" />
          <span className="text-[9px] text-white/20">Loading…</span>
        </div>
      )}

      {/* Empty */}
      {!loading && visible.length === 0 && (
        <div className="flex flex-col items-center justify-center py-5 gap-2">
          <Bell size={20} className="text-white/10" />
          <p className="text-[9px] text-white/20 uppercase tracking-widest">No new activity</p>
        </div>
      )}

      {/* Notification list */}
      {!loading && visible.map(n => {
        const cfg = TYPE_CFG[n.type] || TYPE_CFG.info;
        return (
          <div key={n.id} className={`flex items-start gap-3 p-3 rounded-2xl border transition-all ${cfg.cls} ${!n.read ? 'opacity-100' : 'opacity-60'}`}>
            <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${cfg.dot}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <span className="text-[9px] font-black uppercase tracking-widest text-white/50">{cfg.label}</span>
                {n.time_ago && <span className="text-[8px] text-white/20 shrink-0">{n.time_ago}</span>}
              </div>
              <p className="text-[10px] text-white/60 leading-snug">{n.message}</p>
              {n.device && (
                <p className="text-[9px] font-bold text-white/30 mt-0.5 truncate">{n.device}</p>
              )}
            </div>
            <button onClick={() => setDismissed(d => [...d, n.id])}
              className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/20 hover:text-white/60 transition-colors shrink-0">
              <X size={9} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

/* ── Queue Detail Modal ── */
function QueueDetailModal({ sub, onClose, onStatusChange }) {
  const [currentStatus, setCurrentStatus] = useState(sub.status);
  const [acting, setActing]               = useState(false);
  const [actionError, setActionError]     = useState(null);
  const [amountPaid, setAmountPaid]       = useState(null);
  const [done, setDone]                   = useState(false);
  const [showPurchaseFlow, setShowPurchaseFlow] = useState(false);

  // When purchase flow is active, render only PurchaseIntentModal (no double-modal stack)
  if (showPurchaseFlow) {
    const subAsItem = {
      submit_id:        sub.submit_id,
      item_name:        sub.brand_n_model || sub.category,
      brand_n_model:    sub.brand_n_model,
      category:         sub.category,
      device_state:     sub.device_state,
      estimated_weight: sub.estimated_weight,
      asking_price:     sub.estimated_payout,
      source_type:      'user',
    };
    return (
      <PurchaseIntentModal
        item={subAsItem}
        onClose={() => setShowPurchaseFlow(false)}
        onConfirm={() => {
          setShowPurchaseFlow(false);
          setCurrentStatus('in_transit');
          if (onStatusChange) onStatusChange(sub.submit_id, 'in_transit');
          onClose();
        }}
      />
    );
  }

  // Map queue sub shape → PurchaseIntentModal item shape
  const subAsItem = {
    submit_id:        sub.submit_id,
    item_name:        sub.brand_n_model || sub.category,
    brand_n_model:    sub.brand_n_model,
    category:         sub.category,
    device_state:     sub.device_state,
    estimated_weight: sub.estimated_weight,
    asking_price:     sub.estimated_payout,
    source_type:      'user',
  };

  const handleReceived = async () => {
    setActing(true);
    setActionError(null);
    try {
      const res = await fetch(`${API_BASE}/technician/received/${sub.submit_id}`, {
        method: 'POST', credentials: 'include',
      });
      const data = await res.json().catch(() => ({}));
      if (!data.success) {
        setActionError(data.error || 'Could not confirm receipt.');
      } else {
        setAmountPaid(data.amount_paid ?? null);
        setDone('received');
        if (onStatusChange) onStatusChange(sub.submit_id, 'completed');
      }
    } catch { setActionError('Network error. Please try again.'); }
    finally { setActing(false); }
  };

  const STATE_CFG_M = {
    good: { label: 'Good',  cls: 'bg-[#08CB00]/10 border-[#08CB00]/20 text-[#08CB00]' },
    fair: { label: 'Fair',  cls: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' },
    poor: { label: 'Poor',  cls: 'bg-red-500/10 border-red-500/20 text-red-400' },
  };
  const state = STATE_CFG_M[sub.device_state?.toLowerCase()] || { label: sub.device_state || '—', cls: 'bg-white/5 border-white/10 text-white/40' };

  return (
    <Modal onClose={onClose}>
      <div className="bg-[#0e0e0e] border border-white/10 rounded-[32px] p-6 flex flex-col gap-5 shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-none">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {currentStatus === 'in_transit' ? (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                  <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest">In Transit</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                  <span className="text-[8px] font-black text-yellow-400 uppercase tracking-widest">Accepted</span>
                </div>
              )}
            </div>
            <h2 className="text-xl font-black italic tracking-tighter text-white truncate">
              {sub.brand_n_model || sub.category}
            </h2>
            <p className="text-[9px] text-white/30 uppercase tracking-widest mt-0.5">{sub.category}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/30 hover:text-white transition-all shrink-0 ml-3">
            <X size={13} />
          </button>
        </div>

        {/* Key stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl px-4 py-3 flex flex-col gap-1">
            <span className="text-[8px] font-black uppercase tracking-widest text-white/25">Payout</span>
            <span className="text-xl font-black text-[#08CB00]">
              {sub.estimated_payout > 0 ? `$${Number(sub.estimated_payout).toFixed(2)}` : '—'}
            </span>
          </div>
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl px-4 py-3 flex flex-col gap-1">
            <span className="text-[8px] font-black uppercase tracking-widest text-white/25">Weight</span>
            <span className="text-xl font-black text-white">
              {sub.estimated_weight != null ? `${sub.estimated_weight}kg` : '—'}
            </span>
          </div>
        </div>

        {/* Details list */}
        <div className="flex flex-col gap-2">
          {sub.device_state && (
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Device State</span>
              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${state.cls}`}>{state.label}</span>
            </div>
          )}
          {sub.seller && (
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Seller</span>
              <div className="flex items-center gap-1.5 text-[10px] text-white/60">
                <User size={10} className="text-white/20" />
                <span>{sub.seller}</span>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Submission ID</span>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/40">
              <Hash size={10} className="text-white/20" />
              <span>{sub.submit_id}</span>
            </div>
          </div>
          {sub.time_ago && (
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Created</span>
              <span className="text-[10px] text-white/40">{sub.time_ago}</span>
            </div>
          )}
          {sub.technician_side_status && (
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Tech Status</span>
              <span className="text-[9px] font-black text-blue-400">{sub.technician_side_status}</span>
            </div>
          )}
        </div>

        {/* Handover token */}
        {sub.handover_token && (
          <div className="flex flex-col gap-2">
            <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Handover Token</p>
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
              <QrCode size={18} className="text-white/20 shrink-0" />
              <span className="text-sm font-mono font-bold text-white/60 tracking-widest break-all">{sub.handover_token}</span>
            </div>
          </div>
        )}

        {/* QR image */}
        {sub.handover_qr_url && (
          <div className="flex flex-col items-center gap-2">
            <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Handover QR</p>
            <div className="p-3 bg-white rounded-2xl">
              <img src={`${API_BASE}${sub.handover_qr_url}`} alt="Handover QR" className="w-36 h-36 object-contain" />
            </div>
          </div>
        )}

        {/* ── Action area ── */}
        {done === 'received' ? (
          /* Fully received */
          <div className="flex flex-col items-center gap-3 pt-2 border-t border-white/5">
            <PackageCheck size={28} className="text-[#08CB00]" />
            <p className="text-sm font-black text-white">Item Received!</p>
            {amountPaid != null && (
              <div className="bg-[#08CB00]/10 border border-[#08CB00]/20 rounded-2xl px-4 py-3 flex items-center justify-between w-full">
                <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Paid to Seller</span>
                <span className="text-lg font-black text-[#08CB00]">${Number(amountPaid).toFixed(2)}</span>
              </div>
            )}
            <button onClick={onClose} className="px-6 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors">
              Close
            </button>
          </div>

        ) : (
          <div className="flex flex-col gap-3 pt-2 border-t border-white/5">
            {actionError && (
              <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
                <AlertCircle size={12} className="text-red-400 shrink-0 mt-0.5" />
                <p className="text-[9px] font-bold text-red-400 leading-snug">{actionError}</p>
              </div>
            )}

            {currentStatus === 'ACCEPTED' && (
              <button onClick={() => setShowPurchaseFlow(true)}
                className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 bg-[#08CB00] text-black hover:bg-[#06b800] shadow-[0_0_20px_rgba(8,203,0,0.3)] transition-all active:scale-95">
                <Truck size={16} /> Confirm Pickup
              </button>
            )}

            {currentStatus === 'in_transit' && (
              <button onClick={handleReceived} disabled={acting}
                className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 ${
                  acting ? 'bg-white/5 border border-white/10 text-white/20 cursor-not-allowed'
                         : 'bg-[#08CB00] text-black hover:bg-[#06b800] shadow-[0_0_20px_rgba(8,203,0,0.3)]'
                }`}>
                {acting
                  ? <><Loader2 size={16} className="animate-spin" /> Confirming…</>
                  : <><PackageCheck size={16} /> Received</>
                }
              </button>
            )}
          </div>
        )}

      </div>
    </Modal>
  );
}

/* ── Active Queue (in-transit submissions confirmed by this technician) ── */
export function TechActiveQueue({ submissions = [], loading = false, onRefresh }) {
  const [selectedQueueItem, setSelectedQueueItem] = useState(null);

  const STATE_COLORS = {
    good: 'text-[#08CB00]', fair: 'text-yellow-400', poor: 'text-red-400',
  };

  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-[24px] p-4 flex flex-col gap-3 max-h-[40vh] overflow-y-auto scrollbar-thin">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Truck size={13} className="text-white/30" />
          <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Active Queue</span>
        </div>
        <div className="flex items-center gap-2">
          {submissions.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-[8px] font-black text-white">
              {submissions.length}
            </span>
          )}
          {onRefresh && (
            <button onClick={onRefresh}
              className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/20 hover:text-white/60 transition-colors">
              <RefreshCw size={9} className={loading ? 'animate-spin' : ''} />
            </button>
          )}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-4 gap-2">
          <Loader2 size={14} className="animate-spin text-white/20" />
          <span className="text-[9px] text-white/20">Loading…</span>
        </div>
      )}

      {/* Empty */}
      {!loading && submissions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-5 gap-2">
          <Package size={20} className="text-white/10" />
          <p className="text-[9px] text-white/20 uppercase tracking-widest">No active pickups</p>
        </div>
      )}

      {/* Submission cards */}
      {!loading && submissions.map(sub => {
        const stateColor = STATE_COLORS[sub.device_state?.toLowerCase()] || 'text-white/30';
        const isTransit = sub.status === 'in_transit';
        const statusBadge = isTransit
          ? { dot: 'bg-blue-400 animate-pulse', text: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', label: 'In Transit' }
          : { dot: 'bg-yellow-400',             text: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', label: 'Accepted' };
        return (
          <div key={sub.submit_id} onClick={() => setSelectedQueueItem(sub)} className="flex flex-col gap-2 p-3 rounded-2xl bg-white/[0.03] border border-white/8 hover:border-white/20 hover:bg-white/[0.05] transition-all cursor-pointer">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-black text-white truncate">{sub.brand_n_model || sub.category}</p>
                <p className="text-[9px] text-white/30 truncate">{sub.category}</p>
              </div>
              <div className={`flex items-center gap-1 shrink-0 px-2 py-0.5 rounded-full border ${statusBadge.bg}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`} />
                <span className={`text-[8px] font-black uppercase tracking-widest ${statusBadge.text}`}>{statusBadge.label}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {sub.device_state && (
                <span className={`text-[9px] font-bold uppercase tracking-widest ${stateColor}`}>{sub.device_state}</span>
              )}
              {sub.estimated_weight != null && (
                <span className="flex items-center gap-1 text-[9px] text-white/30">
                  <Scale size={9} /> {sub.estimated_weight}kg
                </span>
              )}
              {sub.estimated_payout > 0 && (
                <span className="text-[9px] font-black text-[#08CB00]">${sub.estimated_payout.toFixed(2)}</span>
              )}
              {sub.time_ago && (
                <span className="text-[8px] text-white/20 ml-auto">{sub.time_ago}</span>
              )}
            </div>

            {sub.seller && (
              <div className="flex items-center gap-1.5 text-[9px] text-white/30">
                <User size={9} className="text-white/20" />
                <span>Seller: {sub.seller}</span>
              </div>
            )}

            {sub.handover_token && (
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Token</span>
                <span className="text-[9px] font-mono text-white/50 truncate">{sub.handover_token}</span>
              </div>
            )}
          </div>
        );
      })}

      {selectedQueueItem && (
        <QueueDetailModal
          sub={selectedQueueItem}
          onClose={() => setSelectedQueueItem(null)}
        />
      )}
    </div>
  );
}
