"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IoChevronDown, IoChevronUp, IoCheckmarkCircle, IoStar } from 'react-icons/io5';

export default function RightContainer ({ analysisData, recommendationData })  {
    const router = useRouter();
    const [fulfillment, setFulfillment] = useState('pickup'); 
    const [showMinerals, setShowMinerals] = useState(false);
    const [selectedType, setSelectedType] = useState(null);
    const [expandedType, setExpandedType] = useState(null);
    const [isConfirming, setIsConfirming] = useState(false);
    const [isDispatching, setIsDispatching] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [confirmError, setConfirmError] = useState(null);

    const hasAnalysis = analysisData && analysisData.estimated_payout !== undefined;

    // Helper to create/update timeline entries on server
    const updateSubmissionStatus = async (submitId, newStatus) => {
        if (!submitId) return false;
        try {
            const body = new FormData();
            body.append('new_status', newStatus);

            const res = await fetch(`http://127.0.0.1:8000/e-waste-submission/submissions/${submitId}/update-status`, {
                method: 'POST',
                credentials: 'include',
                body,
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({ error: 'Request failed' }));
                console.warn('updateSubmissionStatus failed', err);
                return false;
            }

            return true;
        } catch (err) {
            console.error('Error updating submission status', err);
            return false;
        }
    };

    // Mapping between display names and backend enum values
    const SUBMISSION_TYPE_MAP = {
        'Drop-off': 'DROP_OFF',
        'Technician Pickup': 'TECHNICIAN_PICKUP',
        'Recycler Pickup': 'RECYCLER_PICKUP',
        'Marketplace': 'MARKETPLACE',
    };

    // Format mineral name from key like "gold_usd" → "Gold"
    const formatMineral = (key) => key.replace('_usd', '').charAt(0).toUpperCase() + key.replace('_usd', '').slice(1);

    const handleConfirmSubmissionType = async () => {
        setIsConfirming(true);
        setConfirmError(null); 

        const submitId = recommendationData?.submit_id;
        // Prioritize user selection, then fall back to recommended type
        const selectedDisplayType = selectedType || recommendationData?.recommended_type;
        const submissionType = SUBMISSION_TYPE_MAP[selectedDisplayType];

        console.log("Confirming submission type:", { submitId, selectedDisplayType, submissionType });

        if (!submitId || !submissionType) {
            setConfirmError("Could not find submission ID or type. Please refresh and try again.");
            setIsConfirming(false);
            return;
        }

        const body = new FormData();
        body.append('submission_type', submissionType);

        try {
            // Step 1: Update submission type
            const typeUpdateResponse = await fetch(`http://127.0.0.1:8000/e-waste-submission/submissions/${submitId}/submission-type`, {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ submission_type: submissionType }),
            });

            if (!typeUpdateResponse.ok) {
                const errorResult = await typeUpdateResponse.json().catch(() => ({ error: `Request failed with status ${typeUpdateResponse.status}` }));
                throw new Error(errorResult.error || 'Failed to update submission type.');
            }
            await typeUpdateResponse.json();

            // Step 2: Trigger dispatch to find collectors
            setIsDispatching(true);
            const dispatchResponse = await fetch(`http://127.0.0.1:8000/dispatch/dispatch/${submitId}`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            });

            const dispatchResult = await dispatchResponse.json();

            if (!dispatchResponse.ok || !dispatchResult.success) {
                const errorMsg = dispatchResult.error || dispatchResult.detail || 'Failed to find collectors. You can check the status in your dashboard.';
                throw new Error(errorMsg);
            }

            // Inform server that dispatch was initiated so timeline can be updated
            try {
                await updateSubmissionStatus(submitId, 'DISPATCH_INITIATED');
            } catch (e) {
                console.warn('Failed to update timeline on dispatch', e);
            }

            // Step 3: Store data in sessionStorage and set for redirect
            sessionStorage.setItem(`dispatchData_${submitId}`, JSON.stringify(dispatchResult));
            setIsConfirmed(true);

            // Redirect to the tracking page after a short delay
            setTimeout(() => {
                router.push(`/reguser/Tracking?submitId=${submitId}&tab=collectors`);
            }, 1500);

        } catch (error) {
            setConfirmError(error.message);
        } finally {
            setIsConfirming(false);
            setIsDispatching(false);
        }
    };

    return (
        <>
            {/* RIGHT COLUMN: REWARD ANALYTICS */}
            <div className={`lg:col-span-4 space-y-6 ${hasAnalysis ? 'order-first lg:order-none' : ''}`}>
            
            <div className="sticky top-32 space-y-6 max-h-[calc(100vh-10rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent pr-1">

                {/* Total Payout Card */}
                <div className="bg-[#08CB00] p-8 rounded-[40px] text-black overflow-hidden relative group">
                <div className="relative z-10 space-y-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">
                        {hasAnalysis ? 'Estimated Payout' : 'Value Breakdown'}
                    </p>
                    {hasAnalysis ? (
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold opacity-60"><span>Detected Item</span><span>{analysisData.detected_item}</span></div>
                        <div className="flex justify-between text-xs font-bold opacity-60"><span>Brand / Model</span><span>{analysisData.brand_or_model}</span></div>
                        <div className="flex justify-between text-xs font-bold opacity-60"><span>Confidence</span><span>{analysisData.confidence}</span></div>
                        <div className="h-[1px] bg-black/10 my-4"></div>
                        <div className="flex justify-between items-end">
                            <span className="text-sm font-black uppercase">You Receive</span>
                            <span className="text-5xl font-black tracking-tighter">${analysisData.estimated_payout.toFixed(2)}</span>
                        </div>
                        <p className="text-[10px] opacity-50 text-right">{analysisData.currency}</p>
                    </div>
                    ) : (
                    <div className="flex items-center justify-center py-8">
                        <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-6 text-center mx-auto">
                            <div className="flex items-center justify-center mb-4">
                                <div className="w-12 h-12 rounded-full bg-[#08CB00]/10 flex items-center justify-center">
                                    <IoStar className="text-[#08CB00]" size={22} />
                                </div>
                            </div>
                            <h3 className="text-2xl font-black text-white">No Analysis Available</h3>
                            <p className="text-sm text-white/40 mt-2">Upload 3 photos to run the AI review and receive submission recommendations.</p>
                            <div className="mt-6 flex items-center justify-center gap-3">
                                <button
                                    onClick={() => router.push('/reguser/Submit')}
                                    className="px-5 py-2.5 bg-[#08CB00] text-black rounded-xl font-bold shadow-md hover:brightness-95 transition"
                                >
                                    Create Submission
                                </button>
                                <button
                                    onClick={() => router.push('/reguser/Tracking?tab=submissions')}
                                    className="px-5 py-2.5 border border-white/10 text-white/60 rounded-xl font-bold hover:bg-white/5 transition"
                                >
                                    View Submissions
                                </button>
                            </div>
                        </div>
                    </div>
                    )}
                </div>
                {/* Decorative "Liquid" background element */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-black/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                </div>

                {/* Price Breakdown - only shown when analysis is complete */}
                {hasAnalysis && (
                <div className="bg-white/5 border border-white/10 p-6 rounded-[32px] space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#08CB00]">Price Breakdown</h3>
                    
                    {/* Base → Condition → Accessory → Subtotal → Fee → Total */}
                    <div className="space-y-3">
                        <div className="flex justify-between text-xs text-white/60"><span>Base Material Value</span><span className="text-white font-bold">${analysisData.base_value.toFixed(2)}</span></div>
                        <div className="flex justify-between text-xs text-white/60"><span>Condition Bonus</span><span className="text-[#08CB00] font-bold">+${analysisData.condition_bonus.toFixed(2)}</span></div>
                        <div className="flex justify-between text-xs text-white/60"><span>Accessory Bonus</span><span className="text-[#08CB00] font-bold">+${analysisData.accessory_bonus.toFixed(2)}</span></div>
                        <div className="h-[1px] bg-white/10 my-2"></div>
                        <div className="flex justify-between text-xs text-white/60"><span>Subtotal</span><span className="text-white font-bold">${analysisData.subtotal.toFixed(2)}</span></div>
                        <div className="flex justify-between text-xs text-white/60"><span>Platform Fee (10%)</span><span className="text-red-400 font-bold">-${analysisData.platform_fee.toFixed(2)}</span></div>
                        <div className="h-[1px] bg-white/10 my-2"></div>
                        <div className="flex justify-between text-sm font-black text-white"><span>TOTAL PAYOUT</span><span className="text-[#08CB00]">${analysisData.estimated_payout.toFixed(2)}</span></div>
                    </div>
                </div>
                )}

                {/* Condition Factors - only shown when analysis is complete */}
                {hasAnalysis && analysisData.condition_factors && Object.keys(analysisData.condition_factors).length > 0 && (
                <div className="bg-white/5 border border-white/10 p-6 rounded-[32px] space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#08CB00]">Condition Factors</h3>
                    <div className="space-y-3">
                        {Object.entries(analysisData.condition_factors).map(([key, value]) => (
                            <div key={key} className="text-xs">
                                <p className="text-white/40 capitalize mb-1">{key.replace(/_/g, ' ')}</p>
                                <p className="text-white/80 font-medium text-[11px] leading-relaxed break-words">{value}</p>
                            </div>
                        ))}
                    </div>
                    {analysisData.multipliers_applied && (
                        <div className="pt-2 border-t border-white/5 space-y-1">
                            {analysisData.multipliers_applied.condition_multiplier_percent !== undefined && (
                                <div className="flex justify-between text-[10px]">
                                    <span className="text-white/30">Condition Multiplier</span>
                                    <span className="text-[#08CB00] font-bold">+{analysisData.multipliers_applied.condition_multiplier_percent}%</span>
                                </div>
                            )}
                            {analysisData.multipliers_applied.accessory_multiplier_percent !== undefined && (
                                <div className="flex justify-between text-[10px]">
                                    <span className="text-white/30">Accessory Multiplier</span>
                                    <span className="text-[#08CB00] font-bold">+{analysisData.multipliers_applied.accessory_multiplier_percent}%</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                )}

                {/* Mineral Composition - collapsible, only shown when analysis is complete */}
                {hasAnalysis && analysisData.mineral_composition && Object.keys(analysisData.mineral_composition).length > 0 && (
                <div className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden">
                    <button 
                        onClick={() => setShowMinerals(!showMinerals)}
                        className="w-full flex justify-between items-center p-6 text-xs font-bold uppercase tracking-widest text-[#08CB00] hover:bg-white/5 transition-all"
                    >
                        <span>Mineral Composition</span>
                        {showMinerals ? <IoChevronUp size={16} /> : <IoChevronDown size={16} />}
                    </button>
                    {showMinerals && (
                        <div className="px-6 pb-6 space-y-2">
                            {Object.entries(analysisData.mineral_composition)
                                .filter(([, val]) => val > 0)
                                .sort(([, a], [, b]) => b - a)
                                .map(([mineral, value]) => (
                                <div key={mineral} className="flex justify-between items-center text-xs">
                                    <span className="text-white/40">{formatMineral(mineral)}</span>
                                    <div className="flex items-center gap-3">
                                        <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-[#08CB00] rounded-full"
                                                style={{ width: `${Math.min((value / analysisData.base_value * 60) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-white/80 font-mono w-16 text-right">${value.toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                )}

                {/* Submission Type Recommendation - shown when recommendation data is available */}
                {recommendationData && recommendationData.success && (
                <div className="bg-white/5 border border-white/10 p-6 rounded-[32px] space-y-5">
                    <div className="space-y-2">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-[#08CB00]">Recommended Submission Type</h3>
                        <p className="text-[10px] text-white/40 leading-relaxed">{recommendationData.reason}</p>
                    </div>

                    {/* Submission Type Options - ranked by score */}
                    <div className="space-y-2">
                        {(recommendationData.scores_ranking || []).map(([type, score]) => {
                            const isRecommended = type === recommendationData.recommended_type;
                            const isSelected = (selectedType || recommendationData.recommended_type) === type;
                            const multiplier = recommendationData.payout_multipliers?.[type];
                            const reasons = recommendationData.breakdown?.[type] || [];
                            const isExpanded = expandedType === type;
                            const payout = hasAnalysis && multiplier ? (analysisData.estimated_payout * multiplier).toFixed(2) : null;

                            return (
                                <div key={type} className="rounded-2xl border overflow-hidden transition-all">
                                    <button
                                        onClick={() => {
                                            setSelectedType(type);
                                            setExpandedType(isExpanded ? null : type);
                                        }}
                                        className={`w-full p-4 text-left transition-all ${
                                            isSelected
                                                ? 'bg-white text-black border-white'
                                                : 'bg-transparent text-white/60 border-white/5 hover:bg-white/5'
                                        }`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                {isRecommended && (
                                                    <IoStar className={`${isSelected ? 'text-[#08CB00]' : 'text-[#08CB00]/60'}`} size={14} />
                                                )}
                                                <span className="text-xs font-bold uppercase">{type}</span>
                                                {isRecommended && (
                                                    <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase ${isSelected ? 'bg-[#08CB00] text-black' : 'bg-[#08CB00]/20 text-[#08CB00]'}`}>
                                                        Best Match
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="text-right">
                                                    {payout && (
                                                        <p className={`text-sm font-black ${isSelected ? 'text-black' : 'text-white'}`}>${payout}</p>
                                                    )}
                                                    <p className={`text-[9px] ${isSelected ? 'text-black/50' : 'text-white/30'}`}>
                                                        {multiplier ? `${multiplier}x multiplier` : ''}
                                                    </p>
                                                </div>
                                                {isExpanded ? <IoChevronUp size={14} /> : <IoChevronDown size={14} />}
                                            </div>
                                        </div>

                                        {/* Score bar */}
                                        <div className="mt-3 flex items-center gap-3">
                                            <div className={`flex-1 h-1.5 rounded-full overflow-hidden ${isSelected ? 'bg-black/10' : 'bg-white/10'}`}>
                                                <div
                                                    className={`h-full rounded-full transition-all ${isSelected ? 'bg-[#08CB00]' : 'bg-[#08CB00]/40'}`}
                                                    style={{ width: `${score}%` }}
                                                ></div>
                                            </div>
                                            <span className={`text-[10px] font-bold w-8 text-right ${isSelected ? 'text-black/60' : 'text-white/40'}`}>{score}</span>
                                        </div>
                                    </button>

                                    {/* Expanded breakdown */}
                                    {isExpanded && reasons.length > 0 && (
                                        <div className={`px-4 pb-4 space-y-1 ${isSelected ? 'bg-white' : 'bg-white/5'}`}>
                                            <p className={`text-[9px] font-bold uppercase tracking-widest ${isSelected ? 'text-black/40' : 'text-white/30'}`}>Why this option</p>
                                            {reasons.map((reason, i) => (
                                                <div key={i} className="flex items-start gap-2">
                                                    <IoCheckmarkCircle className={`mt-0.5 flex-shrink-0 ${isSelected ? 'text-[#08CB00]' : 'text-[#08CB00]/40'}`} size={12} />
                                                    <p className={`text-[10px] leading-relaxed ${isSelected ? 'text-black/70' : 'text-white/50'}`}>{reason}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Confirm button */}
                    <button
                        onClick={handleConfirmSubmissionType}
                        disabled={isConfirming || isDispatching || isConfirmed}
                        className="w-full bg-[#08CB00] text-black py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-[1.02] transition-all shadow-[0_20px_40px_-15px_rgba(8,203,0,0.3)] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isConfirmed
                            ? 'Redirecting...'
                            : isDispatching
                                ? 'Finding Collectors...'
                                : isConfirming
                                    ? 'Confirming...'
                                    : `Confirm ${selectedType || recommendationData?.recommended_type}`
                        }
                    </button>
                    {confirmError && (
                        <p className="text-red-400 text-xs text-center mt-2">{confirmError}</p>
                    )}
                </div>
                )}

                {/* Waiting for recommendation - shown when analysis is done but recommendation hasn't loaded */}
                {hasAnalysis && !recommendationData && (
                <div className="bg-white/5 border border-white/10 p-8 rounded-[40px] space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#08CB00]">Submission Type</h3>
                    <div className="flex items-center justify-center gap-3 py-6">
                        <div className="w-5 h-5 border-2 border-[#08CB00]/30 border-t-[#08CB00] rounded-full animate-spin"></div>
                        <p className="text-xs text-white/40">Calculating best submission method...</p>
                    </div>
                </div>
                )}

                {/* Community Milestone Marker */}
                <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-center">
                    <p className="text-[10px] text-white/30 font-medium">Join 412 others in <span className="text-white">Harare</span> who recycled this week.</p>
                </div>

            </div>


            </div>
    
    </>
    )
}