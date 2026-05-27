"use client"
import React from 'react';
import { IoCheckmarkCircle, IoCloseCircle, IoWarning } from 'react-icons/io5';

export default function ResultModal({ isOpen, data, onClose, onConfirm, isSubmitting }) {
    if (!isOpen || !data) return null;

    const isAccepted = data.success;
    const isCategoryMatch = data.category_matches;
    // Parse confidence - handle both "95%" and 95 formats
    const confidenceStr = data.confidence || '0%';
    const confidenceNum = parseInt(confidenceStr.toString().replace('%', ''));

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-b from-black to-black/95 border border-white/10 rounded-[40px] max-w-2xl w-full p-8 md:p-12 space-y-8 relative overflow-hidden">
                
                {/* Decorative background elements */}
                <div className={`absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl opacity-20 ${isAccepted ? (isCategoryMatch ? 'bg-[#08CB00]' : 'bg-yellow-500') : 'bg-red-500'}`}></div>
                
                {/* Status Flag */}
                <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-4">
                    {isAccepted ? (
                        <>
                            <div className="relative">
                                <div className={`absolute inset-0 rounded-full blur-2xl animate-pulse ${isCategoryMatch ? 'bg-[#08CB00]/20' : 'bg-yellow-500/20'}`}></div>
                                <IoCheckmarkCircle size={80} className={`relative ${isCategoryMatch ? 'text-[#08CB00]' : 'text-yellow-500'}`} />
                            </div>
                            <h1 className={`text-4xl md:text-5xl font-black uppercase tracking-tight ${isCategoryMatch ? 'text-[#08CB00]' : 'text-yellow-500'}`}>
                                {isCategoryMatch ? 'Accepted' : 'Review Needed'}
                            </h1>
                        </>
                    ) : (
                        <>
                            <div className="relative">
                                <div className="absolute inset-0 bg-red-500/20 rounded-full blur-2xl animate-pulse"></div>
                                <IoCloseCircle size={80} className="text-red-500 relative" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-red-500 uppercase tracking-tight">
                                Detection Failed
                            </h1>
                        </>
                    )}
                    <p className="text-white/60 text-sm md:text-base">{data.message}</p>
                    
                    {/* Category Match Warning */}
                    {isAccepted && !isCategoryMatch && (
                        <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-4 py-2">
                            <IoWarning className="text-yellow-500" size={16} />
                            <span className="text-yellow-500 text-xs font-bold uppercase">Category Mismatch</span>
                        </div>
                    )}
                </div>

                {/* Detection Information */}
                <div className="relative z-10 space-y-4 bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8">
                    <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">AI Detection Results</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
                        {/* Detected Label */}
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40">Detected Item</p>
                            <p className="text-lg md:text-xl font-bold">{data.detected_label || 'Unknown'}</p>
                        </div>

                        {/* Matched Device */}
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40">Matched Device</p>
                            <p className="text-lg md:text-xl font-bold">{data.matched_device || 'Unknown'}</p>
                        </div>

                        {/* Confidence Score */}
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40">Detection Confidence</p>
                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full transition-all ${confidenceNum >= 80 ? 'bg-[#08CB00]' : confidenceNum >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                        style={{ width: `${confidenceNum}%` }}
                                    ></div>
                                </div>
                                <span className="text-lg font-bold">{confidenceStr}</span>
                            </div>
                        </div>

                        {/* Provided Category */}
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40">Your Submitted Item</p>
                            <p className="text-lg md:text-xl font-bold">{data.provided_category?.charAt(0)?.toUpperCase() + data.provided_category?.slice(1) || 'Not specified'}</p>
                        </div>

                        {/* Detection ID */}
                        <div className="space-y-2 md:col-span-2">
                            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40">Detection ID</p>
                            <p className="text-sm font-mono text-white/60">{data.detection_id}</p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="relative z-10 flex flex-col md:flex-row gap-4 justify-end">
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-8 py-4 rounded-full border border-white/10 text-white text-xs font-bold uppercase hover:bg-white/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        Back to Form
                    </button>
                    {isAccepted && isCategoryMatch && (
                        <button
                            onClick={onConfirm}
                            disabled={isSubmitting}
                            className="px-8 py-4 rounded-full bg-[#08CB00] text-black text-xs font-bold uppercase hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-3 justify-center"
                        >
                            {isSubmitting && (
                                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                            )}
                            {isSubmitting ? 'Submitting...' : 'Confirm & Continue'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
