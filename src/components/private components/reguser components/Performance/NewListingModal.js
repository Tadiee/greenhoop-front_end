"use client"
import { useState, useEffect, useRef } from 'react';
import { X, ChevronRight, ChevronLeft, Loader2, Package, DollarSign, Truck, Leaf, Search, ImagePlus } from 'lucide-react';

const STEPS = [
    { label: 'Basic Info', icon: Package },
    { label: 'Condition & Pricing', icon: DollarSign },
    { label: 'Details & Shipping', icon: Truck },
];

const CONDITION_SCORES = {
    NEW: 10,
    LIKE_NEW: 9,
    EXCELLENT: 8,
    GOOD: 7,
    FAIR: 5,
    POOR: 3,
    FOR_PARTS: 1,
};

const CONDITION_LABELS = {
    NEW: { label: 'Brand New', color: 'text-[#08CB00]' },
    LIKE_NEW: { label: 'Like New', color: 'text-[#08CB00]' },
    EXCELLENT: { label: 'Excellent', color: 'text-emerald-400' },
    GOOD: { label: 'Good', color: 'text-yellow-400' },
    FAIR: { label: 'Fair', color: 'text-orange-400' },
    POOR: { label: 'Poor', color: 'text-red-400' },
    FOR_PARTS: { label: 'Parts Only', color: 'text-red-500' },
};

const INITIAL_FORM = {
    device_id: '',
    title: '',
    description: '',
    listing_type: 'SALE',
    condition: 'GOOD',
    condition_notes: '',
    condition_score: 5,
    listing_price: '',
    starting_price: '',
    reserve_price: '',
    specifications: '',
    missing_parts: '',
    physical_damage: '',
    functional_status: '',
    is_ewaste: false,
    estimated_recyclable_value: '',
    estimated_co2_offset: '',
    shipping_available: false,
    local_pickup_available: true,
    days_to_expire: 30,
};

export default function NewListingModal({ isOpen, onClose }) {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState(INITIAL_FORM);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [images, setImages] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const fileInputRef = useRef(null);

    // Silently capture user location when modal opens
    useEffect(() => {
        if (isOpen && !userLocation && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                () => {},
                { enableHighAccuracy: false, timeout: 5000 }
            );
        }
    }, [isOpen]);

    const MAX_IMAGES = 5;

    const handleImageAdd = (files) => {
        const newFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
        setImages(prev => {
            const combined = [...prev, ...newFiles];
            return combined.slice(0, MAX_IMAGES);
        });
    };

    const handleImageRemove = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    // Device autocomplete state
    const [deviceQuery, setDeviceQuery] = useState('');
    const [deviceSuggestions, setDeviceSuggestions] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [searchingDevices, setSearchingDevices] = useState(false);
    const debounceRef = useRef(null);
    const dropdownRef = useRef(null);

    // Debounced device search
    useEffect(() => {
        if (selectedDevice) return;
        const trimmed = deviceQuery.trim();
        if (trimmed.length < 2) {
            setDeviceSuggestions([]);
            setShowSuggestions(false);
            return;
        }
        setSearchingDevices(true);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            try {
                const res = await fetch(`http://127.0.0.1:8000/marketplace/devices/autocomplete?query=${encodeURIComponent(trimmed)}`, {
                    credentials: 'include',
                });
                if (res.ok) {
                    const data = await res.json();
                    setDeviceSuggestions(data);
                    setShowSuggestions(true);
                }
            } catch (err) {
                console.error('Device search error:', err);
            } finally {
                setSearchingDevices(false);
            }
        }, 300);
        return () => clearTimeout(debounceRef.current);
    }, [deviceQuery]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelectDevice = (device) => {
        setSelectedDevice(device);
        setDeviceQuery(device.display_name);
        set('device_id', device.device_id);
        setShowSuggestions(false);
    };

    const handleClearDevice = () => {
        setSelectedDevice(null);
        setDeviceQuery('');
        set('device_id', '');
    };

    if (!isOpen) return null;

    const set = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError(null);

        try {
            const body = new FormData();
            // Required fields
            body.append('device_id', String(formData.device_id));
            body.append('title', formData.title);
            body.append('description', formData.description);
            body.append('listing_type', formData.listing_type);
            body.append('condition', formData.condition);
            body.append('condition_score', String(parseFloat(formData.condition_score) || 0));
            body.append('listing_price', String(parseFloat(formData.listing_price) || 0));
            body.append('is_ewaste', formData.is_ewaste ? 'true' : 'false');
            body.append('shipping_available', formData.shipping_available ? 'true' : 'false');
            body.append('local_pickup_available', formData.local_pickup_available ? 'true' : 'false');
            body.append('days_to_expire', String(parseInt(formData.days_to_expire) || 30));

            // Optional string fields — only send if non-empty
            if (formData.condition_notes) body.append('condition_notes', formData.condition_notes);
            if (formData.missing_parts) body.append('missing_parts', formData.missing_parts);
            if (formData.physical_damage) body.append('physical_damage', formData.physical_damage);

            // Optional decimal fields — only send if provided
            if (formData.starting_price) body.append('starting_price', String(parseFloat(formData.starting_price)));
            if (formData.reserve_price) body.append('reserve_price', String(parseFloat(formData.reserve_price)));
            if (formData.estimated_recyclable_value) body.append('estimated_recyclable_value', String(parseFloat(formData.estimated_recyclable_value)));
            if (formData.estimated_co2_offset) body.append('estimated_co2_offset', String(parseFloat(formData.estimated_co2_offset)));

            // Optional dict fields — sent as JSON strings, parsed server-side
            if (formData.specifications && formData.specifications.trim()) {
                body.append('specifications', formData.specifications.trim());
            }
            if (formData.functional_status && formData.functional_status.trim()) {
                body.append('functional_status', formData.functional_status.trim());
            }

            // Location
            if (userLocation) {
                body.append('latitude', String(userLocation.lat));
                body.append('longitude', String(userLocation.lng));
            }

            // Images
            images.forEach((file) => {
                body.append('images', file);
            });

            const response = await fetch('http://127.0.0.1:8000/marketplace/listings', {
                method: 'POST',
                credentials: 'include',
                body: body,
            });

            if (!response.ok) {
                const result = await response.json().catch(() => ({}));
                console.log('Server error response:', JSON.stringify(result, null, 2));
                let msg = `Server returned ${response.status}`;
                if (Array.isArray(result.detail)) {
                    msg = result.detail.map(e => `${(e.loc || []).join(' → ')}: ${e.msg || e.type || 'invalid'}`).join('; ');
                } else if (typeof result.detail === 'string') {
                    msg = result.detail;
                } else if (result.error) {
                    msg = result.error;
                }
                throw new Error(msg);
            }

            setSuccess(true);
            setTimeout(() => {
                handleClose();
            }, 2000);
        } catch (err) {
            console.error('Error creating listing:', err);
            setError(err.message || 'Failed to create listing. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setStep(0);
        setFormData(INITIAL_FORM);
        setError(null);
        setSuccess(false);
        setDeviceQuery('');
        setDeviceSuggestions([]);
        setSelectedDevice(null);
        setShowSuggestions(false);
        setImages([]);
        onClose();
    };

    const inputClass = "w-full bg-black border border-white/10 rounded-xl p-4 focus:border-[#08CB00] outline-none transition-all text-sm text-white placeholder-white/30";
    const labelClass = "text-[10px] font-bold uppercase tracking-[0.2em] text-white/40";

    // --- Step Content ---
    const renderStep = () => {
        switch (step) {
            case 0:
                return (
                    <div className="space-y-5">
                        <div className="relative space-y-2" ref={dropdownRef}>
                            <label className={labelClass}>Device (Brand & Model) *</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                                    {searchingDevices ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                                </div>
                                <input
                                    type="text"
                                    value={deviceQuery}
                                    onChange={e => { setDeviceQuery(e.target.value); if (selectedDevice) { setSelectedDevice(null); set('device_id', ''); } }}
                                    placeholder="Search by brand or model name..."
                                    className={`${inputClass} pl-11 ${selectedDevice ? '!border-[#08CB00]/50 !bg-[#08CB00]/5' : ''}`}
                                />
                                {selectedDevice && (
                                    <button type="button" onClick={handleClearDevice} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                            {selectedDevice && (
                                <div className="flex items-center gap-3 text-[10px] mt-1.5">
                                    <span className="bg-[#08CB00]/10 text-[#08CB00] px-3 py-1 rounded-full font-bold uppercase tracking-wider">{selectedDevice.brand}</span>
                                    <span className="text-white/30 font-bold">{selectedDevice.model_name}</span>
                                    {selectedDevice.year_released && <span className="text-white/20">{selectedDevice.year_released}</span>}
                                </div>
                            )}
                            {showSuggestions && deviceSuggestions.length > 0 && (
                                <div className="absolute z-50 left-0 right-0 mt-1 bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 max-h-[280px] overflow-y-auto">
                                    {deviceSuggestions.map(device => (
                                        <button key={device.device_id} type="button" onClick={() => handleSelectDevice(device)}
                                            className="w-full text-left px-6 py-4 hover:bg-[#08CB00]/10 transition-colors border-b border-white/5 last:border-0 group">
                                            <p className="text-base font-bold text-white group-hover:text-[#08CB00] transition-colors">{device.display_name}</p>
                                            <p className="text-xs text-white/40 mt-1">{device.brand} {device.year_released ? `• ${device.year_released}` : ''}</p>
                                        </button>
                                    ))}
                                </div>
                            )}
                            {showSuggestions && deviceSuggestions.length === 0 && deviceQuery.trim().length >= 2 && !searchingDevices && (
                                <div className="absolute z-50 left-0 right-0 mt-1 bg-[#111] border border-white/10 rounded-2xl p-6 text-center">
                                    <p className="text-white/40 text-sm">No devices found for "{deviceQuery}"</p>
                                </div>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className={labelClass}>Listing Title *</label>
                            <input type="text" value={formData.title} onChange={e => set('title', e.target.value)} placeholder="e.g. MacBook Air M2 — Excellent Condition" className={inputClass} />
                        </div>
                        <div className="space-y-2">
                            <label className={labelClass}>Description *</label>
                            <textarea rows={4} value={formData.description} onChange={e => set('description', e.target.value)} placeholder="Describe your item, its history, and what the buyer can expect..." className={`${inputClass} resize-none`} />
                        </div>
                        <div className="space-y-2">
                            <label className={labelClass}>Listing Type *</label>
                            <div className="flex gap-3">
                                {['SALE', 'AUCTION'].map(type => (
                                    <button key={type} type="button" onClick={() => set('listing_type', type)}
                                        className={`flex-1 py-4 rounded-2xl border text-xs font-bold uppercase tracking-widest transition-all ${formData.listing_type === type ? 'bg-[#08CB00] text-black border-[#08CB00]' : 'border-white/10 text-white/60 hover:border-white/30'}`}>
                                        {type === 'SALE' ? 'Fixed Price Sale' : 'Auction'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className={labelClass}>Product Images</label>
                                <span className="text-[10px] text-white/20 font-bold">{images.length}/{MAX_IMAGES}</span>
                            </div>
                            <div className="grid grid-cols-5 gap-3">
                                {images.map((file, i) => (
                                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group">
                                        <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                                        <button type="button" onClick={() => handleImageRemove(i)}
                                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <X size={16} className="text-white" />
                                        </button>
                                    </div>
                                ))}
                                {images.length < MAX_IMAGES && (
                                    <button type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        onDragOver={e => e.preventDefault()}
                                        onDrop={e => { e.preventDefault(); handleImageAdd(e.dataTransfer.files); }}
                                        className="aspect-square rounded-xl border-2 border-dashed border-white/10 hover:border-[#08CB00]/40 hover:bg-[#08CB00]/5 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer">
                                        <ImagePlus size={18} className="text-white/20" />
                                        <span className="text-[9px] text-white/20 font-bold uppercase">Add</span>
                                    </button>
                                )}
                            </div>
                            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
                                onChange={e => { handleImageAdd(e.target.files); e.target.value = ''; }} />
                        </div>
                    </div>
                );

            case 1: {
                const condInfo = CONDITION_LABELS[formData.condition] || { label: formData.condition, color: 'text-white' };
                return (
                    <div className="space-y-6">
                        {/* Condition Selection */}
                        <div className="space-y-3">
                            <label className={labelClass}>Item Condition *</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {Object.entries(CONDITION_LABELS).map(([key, { label, color }]) => (
                                    <button key={key} type="button"
                                        onClick={() => { set('condition', key); set('condition_score', CONDITION_SCORES[key]); }}
                                        className={`py-3 px-3 rounded-xl border text-[11px] font-bold uppercase tracking-wider transition-all ${
                                            formData.condition === key
                                                ? 'bg-[#08CB00] text-black border-[#08CB00] shadow-lg shadow-[#08CB00]/20'
                                                : 'border-white/10 text-white/50 hover:border-white/25 hover:text-white/70'
                                        }`}>
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Condition Score Visual */}
                        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 space-y-3">
                            <div className="flex items-center justify-between">
                                <label className={labelClass}>Condition Score</label>
                                <span className={`text-2xl font-black ${condInfo.color}`}>{formData.condition_score}%</span>
                            </div>
                            <input type="range" min="0" max="100" value={formData.condition_score} onChange={e => set('condition_score', e.target.value)}
                                className="w-full h-3 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#08CB00] [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full" />
                            <div className="flex justify-between text-[9px] text-white/20 font-bold uppercase tracking-widest">
                                <span>For Parts</span>
                                <span>Brand New</span>
                            </div>
                        </div>

                        {/* Condition Notes */}
                        <div className="space-y-2">
                            <label className={labelClass}>Condition Notes</label>
                            <textarea rows={2} value={formData.condition_notes} onChange={e => set('condition_notes', e.target.value)} placeholder="Any additional notes about the condition..." className={`${inputClass} resize-none`} />
                        </div>

                        {/* Pricing Section */}
                        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 space-y-5">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[#08CB00]/10 flex items-center justify-center">
                                    <DollarSign size={16} className="text-[#08CB00]" />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Pricing</p>
                            </div>

                            <div className="space-y-2">
                                <label className={labelClass}>Listing Price *</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm font-bold">$</span>
                                    <input type="number" step="0.01" min="0" value={formData.listing_price} onChange={e => set('listing_price', e.target.value)} placeholder="0.00" className={`${inputClass} pl-9 text-lg font-black`} />
                                </div>
                            </div>

                            {formData.listing_type === 'AUCTION' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className={labelClass}>Starting Price</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm font-bold">$</span>
                                            <input type="number" step="0.01" min="0" value={formData.starting_price} onChange={e => set('starting_price', e.target.value)} placeholder="0.00" className={`${inputClass} pl-9`} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className={labelClass}>Reserve Price</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm font-bold">$</span>
                                            <input type="number" step="0.01" min="0" value={formData.reserve_price} onChange={e => set('reserve_price', e.target.value)} placeholder="0.00" className={`${inputClass} pl-9`} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            }

            case 2:
                return (
                    <div className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className={labelClass}>Missing Parts</label>
                                <input type="text" value={formData.missing_parts} onChange={e => set('missing_parts', e.target.value)} placeholder="e.g. Charger, back cover" className={inputClass} />
                            </div>
                            <div className="space-y-2">
                                <label className={labelClass}>Physical Damage</label>
                                <input type="text" value={formData.physical_damage} onChange={e => set('physical_damage', e.target.value)} placeholder="e.g. Minor scratch on screen" className={inputClass} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className={labelClass}>Specifications (JSON or text)</label>
                            <textarea rows={2} value={formData.specifications} onChange={e => set('specifications', e.target.value)} placeholder='e.g. {"ram": "16GB", "storage": "512GB"}' className={`${inputClass} resize-none font-mono text-xs`} />
                        </div>
                        <div className="space-y-2">
                            <label className={labelClass}>Functional Status (JSON or text)</label>
                            <textarea rows={2} value={formData.functional_status} onChange={e => set('functional_status', e.target.value)} placeholder='e.g. {"screen": "working", "speaker": "working"}' className={`${inputClass} resize-none font-mono text-xs`} />
                        </div>

                        <div className="h-px bg-white/5 my-2"></div>

                        {/* Toggle switches */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ToggleField label="E-Waste Item" description="Mark if this item qualifies as e-waste" checked={formData.is_ewaste} onChange={v => set('is_ewaste', v)} />
                            <ToggleField label="Shipping Available" description="You can ship this item to the buyer" checked={formData.shipping_available} onChange={v => set('shipping_available', v)} />
                            <ToggleField label="Local Pickup" description="Buyer can collect in person" checked={formData.local_pickup_available} onChange={v => set('local_pickup_available', v)} />
                        </div>

                        {formData.is_ewaste && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 bg-[#08CB00]/5 border border-[#08CB00]/20 rounded-2xl">
                                <div className="space-y-2">
                                    <label className={`${labelClass} !text-[#08CB00]/60`}>Est. Recyclable Value ($)</label>
                                    <input type="number" step="0.01" min="0" value={formData.estimated_recyclable_value} onChange={e => set('estimated_recyclable_value', e.target.value)} placeholder="0.00" className={inputClass} />
                                </div>
                                <div className="space-y-2">
                                    <label className={`${labelClass} !text-[#08CB00]/60`}>Est. CO₂ Offset (kg)</label>
                                    <input type="number" step="0.01" min="0" value={formData.estimated_co2_offset} onChange={e => set('estimated_co2_offset', e.target.value)} placeholder="0.00" className={inputClass} />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className={labelClass}>Days Until Expiry</label>
                            <input type="number" min="1" max="365" value={formData.days_to_expire} onChange={e => set('days_to_expire', e.target.value)} className={inputClass} />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    // --- Validation per step ---
    const canProceed = () => {
        if (step === 0) return formData.device_id && formData.title && formData.description;
        if (step === 1) return formData.listing_price;
        return true;
    };

    // --- Success View ---
    if (success) {
        return (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={handleClose}>
                <div className="bg-[#0a0a0a] border border-[#08CB00]/30 rounded-[40px] p-12 max-w-md w-full text-center space-y-6" onClick={e => e.stopPropagation()}>
                    <div className="w-20 h-20 rounded-full bg-[#08CB00]/10 border-2 border-[#08CB00] flex items-center justify-center mx-auto">
                        <Leaf size={36} className="text-[#08CB00]" />
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tight text-white">Listing Created!</h2>
                    <p className="text-white/40 text-sm">Your item is now live on the GreenHoop marketplace.</p>
                    <button onClick={handleClose} className="bg-[#08CB00] text-black px-10 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-white transition-all">
                        Done
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={handleClose}>
            <div className="bg-[#0a0a0a] border border-white/10 rounded-[40px] w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="flex items-center justify-between p-8 pb-0">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#08CB00]">New Listing</p>
                        <h2 className="text-2xl font-black uppercase tracking-tight text-white mt-1">{STEPS[step].label}</h2>
                    </div>
                    <button onClick={handleClose} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
                        <X size={18} />
                    </button>
                </div>

                {/* Step Indicator */}
                <div className="flex items-center gap-2 px-8 pt-6">
                    {STEPS.map((s, i) => (
                        <div key={i} className="flex items-center gap-2 flex-1">
                            <div className={`h-1.5 rounded-full flex-1 transition-all ${i <= step ? 'bg-[#08CB00]' : 'bg-white/10'}`} />
                        </div>
                    ))}
                </div>
                <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest px-8 pt-2">Step {step + 1} of {STEPS.length}</p>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
                    {renderStep()}

                    {error && (
                        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl">
                            <p className="text-red-400 text-sm font-bold">{error}</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-8 pt-4 border-t border-white/5">
                    <button onClick={() => step > 0 ? setStep(step - 1) : handleClose}
                        className="flex items-center gap-2 text-white/40 hover:text-white text-[11px] font-black uppercase tracking-widest transition-all">
                        <ChevronLeft size={16} />
                        {step > 0 ? 'Back' : 'Cancel'}
                    </button>

                    {step < STEPS.length - 1 ? (
                        <button onClick={() => setStep(step + 1)} disabled={!canProceed()}
                            className="bg-[#08CB00] text-black px-10 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-white transition-all flex items-center gap-2 shadow-xl shadow-[#08CB00]/20 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[#08CB00]">
                            Continue <ChevronRight size={16} />
                        </button>
                    ) : (
                        <button onClick={handleSubmit} disabled={isSubmitting || !canProceed()}
                            className="bg-[#08CB00] text-black px-10 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-white transition-all flex items-center gap-2 shadow-xl shadow-[#08CB00]/20 disabled:opacity-50 disabled:cursor-not-allowed">
                            {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Creating...</> : 'Create Listing'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

function ToggleField({ label, description, checked, onChange }) {
    return (
        <div onClick={() => onChange(!checked)}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${checked ? 'bg-[#08CB00]/10 border-[#08CB00]/40' : 'bg-black border-white/10 hover:border-white/20'}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-bold uppercase text-white">{label}</p>
                    <p className="text-[10px] text-white/40 mt-0.5">{description}</p>
                </div>
                <div className={`w-10 h-6 rounded-full transition-all flex items-center px-1 ${checked ? 'bg-[#08CB00]' : 'bg-white/10'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white transition-all ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
            </div>
        </div>
    );
}
