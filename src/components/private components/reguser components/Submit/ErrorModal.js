"use client"
import React from 'react';
import { IoCloseCircle, IoWarning, IoWifi, IoAlertCircle } from 'react-icons/io5';

const ERROR_TYPES = {
    validation: {
        icon: IoWarning,
        color: 'yellow-500',
        title: 'Validation Error',
        bgGlow: 'bg-yellow-500',
    },
    network: {
        icon: IoWifi,
        color: 'red-500',
        title: 'Connection Error',
        bgGlow: 'bg-red-500',
    },
    server: {
        icon: IoCloseCircle,
        color: 'red-500',
        title: 'Server Error',
        bgGlow: 'bg-red-500',
    },
    general: {
        icon: IoAlertCircle,
        color: 'orange-400',
        title: 'Something Went Wrong',
        bgGlow: 'bg-orange-400',
    },
};

export default function ErrorModal({ isOpen, error, onClose, onRetry }) {
    if (!isOpen || !error) return null;

    const type = ERROR_TYPES[error.type] || ERROR_TYPES.general;
    const Icon = type.icon;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-b from-black to-black/95 border border-white/10 rounded-[32px] max-w-lg w-full p-8 md:p-10 space-y-6 relative overflow-hidden">
                
                {/* Decorative glow */}
                <div className={`absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl opacity-20 ${type.bgGlow}`}></div>

                {/* Icon & Title */}
                <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                    <div className="relative">
                        <div className={`absolute inset-0 ${type.bgGlow}/20 rounded-full blur-2xl animate-pulse`}></div>
                        <Icon size={64} className={`relative text-${type.color}`} />
                    </div>
                    <h2 className={`text-2xl md:text-3xl font-black uppercase tracking-tight text-${type.color}`}>
                        {error.title || type.title}
                    </h2>
                </div>

                {/* Message */}
                <div className="relative z-10 bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
                    <p className="text-white/70 text-sm leading-relaxed text-center">{error.message}</p>
                    
                    {/* Validation field errors */}
                    {error.fields && error.fields.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-white/5">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Please fix the following:</p>
                            <ul className="space-y-1.5">
                                {error.fields.map((field, i) => (
                                    <li key={i} className="flex items-start gap-2 text-xs">
                                        <span className="text-yellow-500 mt-0.5">•</span>
                                        <span className="text-white/60">{field}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Technical details (collapsible) */}
                    {error.details && (
                        <details className="pt-2 border-t border-white/5">
                            <summary className="text-[10px] font-bold uppercase tracking-widest text-white/20 cursor-pointer hover:text-white/40 transition-all">
                                Technical Details
                            </summary>
                            <p className="text-[10px] text-white/30 font-mono mt-2 break-all leading-relaxed">{error.details}</p>
                        </details>
                    )}
                </div>

                {/* Actions */}
                <div className="relative z-10 flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={onClose}
                        className="px-8 py-3.5 rounded-full border border-white/10 text-white text-xs font-bold uppercase hover:bg-white/5 transition-all"
                    >
                        Dismiss
                    </button>
                    {onRetry && (
                        <button
                            onClick={() => { onClose(); onRetry(); }}
                            className="px-8 py-3.5 rounded-full bg-white text-black text-xs font-bold uppercase hover:bg-[#08CB00] transition-all"
                        >
                            Try Again
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
