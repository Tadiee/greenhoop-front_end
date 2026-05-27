"use client"
import { IoMdCamera, IoMdLocate } from "react-icons/io";
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";
import { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import ResultModal from "./ResultModal";
import ErrorModal from "./ErrorModal";

const CATEGORY_GROUPS = {
    smart_device:    ['laptop', 'phone', 'tablet'],
    computer_part:   ['gpu', 'cpu-component', 'harddisk', 'motherboard', 'pc-case'],
    display:         ['monitor', 'television'],
    appliance:       ['iron', 'fan', 'fridge', 'microwave', 'washing-machine', 'dvd-player', 'rice-cooker', 'clock', 'lamp', 'flashlight'],
    peripheral:      ['keyboard', 'mouse', 'game-controller', 'printer', 'microphone', 'speaker', 'remote', 'walkie-talkie', 'radio'],
    accessory:       ['cable', 'charger', 'battery', 'electronic-socket', 'router', 'solar-panel', 'powerbank', 'calculator', 'body-weight-scale'],
};

function getCategoryGroup(category) {
    if (!category) return null;
    for (const [group, cats] of Object.entries(CATEGORY_GROUPS)) {
        if (cats.includes(category)) return group;
    }
    return 'accessory';
}

function getFieldConfig(category) {
    const group = getCategoryGroup(category);
    return {
        showPowerTest:       ['smart_device', 'display', 'appliance', 'peripheral'].includes(group),
        showAccountStatus:   group === 'smart_device',
        showBatteryHealth:   group === 'smart_device' || category === 'powerbank',
        showHardwareIntegrity: true,
        showDataDestruction: group === 'smart_device' || category === 'harddisk',
        powerTestOptions: group === 'smart_device'
            ? [
                { label: 'REACHES HOME SCREEN', value: 'REACHES_HOMESCREEN' },
                { label: 'NO POWER / LOGO LOOP',  value: 'NO_POWER_LOG_LOOP' },
              ]
            : [
                { label: 'POWERS ON', value: 'POWER_ON' },
                { label: 'NO POWER',  value: 'NO_POWER_LOG_LOOP' },
              ],
    };
}

export default function LeftContainer ({ onAnalysisComplete, onRecommendationComplete, analysisData }) {
    const isLocked = analysisData && analysisData.estimated_payout !== undefined;
    const [formData, setFormData] = useState({
        category: '',
        brand: '',
        model: '',
        serial: '',
        quantity: 1,
        condition: 'working',
        accessories: [],
        dataWiped: false,
        powerOn: null,
        accountsLoggedOut: false,
        batteryHealth: 80,
        thirdPartyParts: false,
        requestBox: false,
        preferredDate: '',
        preferredTime: '08:00',
        estimatedWeight: 0.5,
        latitude: null,
        longitude: null,
        photos: [], // Store photo files
        detectionId: null // Store detection ID from API
    });

    const [showResultModal, setShowResultModal] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); // For second step
    const [detectionComplete, setDetectionComplete] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorData, setErrorData] = useState(null);
    const [retryAction, setRetryAction] = useState(null);

    const showError = (type, message, { title, fields, details, retry } = {}) => {
        setErrorData({ type, message, title, fields, details });
        setRetryAction(() => retry || null);
        setShowErrorModal(true);
    };

    const [isMapFullscreen, setIsMapFullscreen] = useState(false);
    const [mapCenter, setMapCenter] = useState([-26.2041, 28.0473]);
    const [isMapMounted, setIsMapMounted] = useState(false);
    // Helper: update submission status to build timeline entries on server
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
    const fileInputRef = useRef(null);

    // Get user location on component mount
    useEffect(() => {
        setIsMapMounted(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setFormData(prev => ({...prev, latitude, longitude}));
                    setMapCenter([latitude, longitude]);
                },
                (error) => {
                    console.log('Geolocation error:', error.message);
                    // Keep default location if geolocation fails
                }
            );
        }
    }, []);

    // Update map center when formData coordinates change
    useEffect(() => {
        if (formData.latitude && formData.longitude) {
            setMapCenter([formData.latitude, formData.longitude]);
        }
    }, [formData.latitude, formData.longitude]);

    
    const toggleAccessory = (acc) => {
        setFormData(prev => ({
        ...prev,
        accessories: prev.accessories.includes(acc) 
            ? prev.accessories.filter(a => a !== acc) 
            : [...prev.accessories, acc]
        }));
    };

    const handlePhotoUpload = (index, file) => {
        const newPhotos = [...formData.photos];
        newPhotos[index] = file;
        setFormData({...formData, photos: newPhotos});
    };

    // Step 1: Call detection API with photos and category
    const handleNextStep = async () => {
        // Validation
        const validPhotos = formData.photos.filter(p => p !== null && p !== undefined);
        const validationErrors = [];

        if (!formData.category) validationErrors.push('Please select a device category in Step 1.');
        if (validPhotos.length !== 3) validationErrors.push(`Upload exactly 3 photos (Front, Back, Label). You have ${validPhotos.length}.`);
        if (formData.powerOn === null) validationErrors.push('Complete the Power-on Test in Step 2.');
        if (!formData.brand.trim()) validationErrors.push('Enter a brand & model name in Step 1.');

        if (validationErrors.length > 0) {
            showError('validation', 'Please complete all required fields before proceeding.', {
                title: 'Incomplete Form',
                fields: validationErrors,
            });
            return;
        }

        setIsLoading(true);
        
        try {
            const formDataToSend = new FormData();
            validPhotos.forEach((file) => {
                formDataToSend.append('files', file);
            });
            formDataToSend.append('category', formData.category);

            const response = await fetch('http://127.0.0.1:8000/e-waste-submission/detect', {
                method: 'POST',
                body: formDataToSend,
            });

            if (!response.ok) {
                const result = await response.json().catch(() => ({}));
                throw { type: 'server', status: response.status, serverMessage: result.error || result.detail || `Server returned ${response.status}` };
            }

            const result = await response.json();
            
            if (result.success) {
                setFormData(prev => ({...prev, detectionId: result.detection_id}));
                setDetectionComplete(true);
                
                setModalData({
                    success: true,
                    detected_label: result.detected_label,
                    matched_device: result.matched_device,
                    confidence: result.confidence,
                    category_matches: result.category_matches,
                    provided_category: result.provided_category,
                    detection_id: result.detection_id,
                    message: result.message
                });
                setShowResultModal(true);
            } else {
                throw { type: 'server', serverMessage: result.error || 'Detection failed' };
            }
        } catch (error) {
            console.error('Error in detection:', error);

            if (error.type === 'server') {
                showError('server', error.serverMessage, {
                    title: 'Detection Failed',
                    details: error.status ? `HTTP ${error.status}` : undefined,
                    retry: handleNextStep,
                });
            } else if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError') || error.message?.includes('ERR_CONNECTION_REFUSED')) {
                showError('network', 'Unable to reach the server. Please check that the backend is running and try again.', {
                    title: 'Connection Failed',
                    details: error.message,
                    retry: handleNextStep,
                });
            } else {
                showError('general', error.message || 'An unexpected error occurred during detection.', {
                    details: error.stack,
                    retry: handleNextStep,
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Step 2: Complete submission with all data
    const handleCompleteSubmission = async () => {
        if (!formData.detectionId) {
            showError('validation', 'No detection data found. Please complete Step 1 first.', {
                title: 'Missing Detection',
                fields: ['Run the AI detection by clicking "Next Step" before confirming.'],
            });
            return;
        }

        setIsSubmitting(true);
        setShowResultModal(false);
        
        try {
            const submissionData = {
                detection_id: formData.detectionId,
                category: formData.category,
                submission_type: 'DROP_OFF',
                brand_n_model: `${formData.brand} ${formData.model}`.trim(),
                serial_number: formData.serial || '',
                power_status: formData.powerOn || null,
                battery_health: parseInt(formData.batteryHealth) || 0,
                device_state: formData.condition.charAt(0).toUpperCase() + formData.condition.slice(1),
                accessories: formData.accessories.join(', ') || '',
                data_deletion: formData.dataWiped,
                packaging_request: formData.requestBox,
                estimated_quatity: formData.quantity,
                preferred_date: formData.preferredDate || null,
                preferred_time: formData.preferredTime,
                estimated_weight: parseFloat(formData.estimatedWeight) || 0.5,
                latitude: formData.latitude || null,
                longitude: formData.longitude || null
            };

            const response = await fetch('http://127.0.0.1:8000/e-waste-submission/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(submissionData)
            });

            if (!response.ok) {
                const result = await response.json().catch(() => ({}));
                // Extract field-level errors from backend validation
                const fieldErrors = result.detail
                    ? (Array.isArray(result.detail) ? result.detail.map(d => `${d.loc?.join(' → ')}: ${d.msg}`) : [result.detail])
                    : [];
                throw { type: response.status === 400 ? 'validation' : 'server', status: response.status, serverMessage: result.error || `Server returned ${response.status}`, fieldErrors };
            }

            const result = await response.json();
            
            if (result.success) {
                const submitId = result.submit_id;

                // Create initial timeline entry for submission
                try {
                    await updateSubmissionStatus(submitId, 'SUBMITTED');
                } catch (e) {
                    console.warn('Could not create initial timeline entry', e);
                }

                // setModalData({
                //     success: true,
                //     detected_label: result.message,
                //     matched_device: `Submission ID: ${result.submit_id}`,
                //     confidence: 'Submitted',
                //     category_matches: true,
                //     detection_id: result.detection_id,
                //     message: 'Submission complete! Calculating estimated value...'
                // });
                // setShowResultModal(true);

                // Step 3: Analyze Waste
                try {
                    const analyzeResponse = await fetch(`http://127.0.0.1:8000/e-waste-submission/analyze-waste/${formData.detectionId}`, {
                        method: 'GET',
                        credentials: 'include',
                    });

                    const analyzeResult = await analyzeResponse.json();

                    if (analyzeResponse.ok && analyzeResult.success) {
                        if (onAnalysisComplete) {
                            onAnalysisComplete(analyzeResult);
                        }

                        // Step 4: Get Submission Type Recommendation
                        try {
                            const recommendationResponse = await fetch(`http://127.0.0.1:8000/dispatch/recommendation/${submitId}`, {
                                method: 'GET',
                                credentials: 'include',
                            });

                            const recommendationResult = await recommendationResponse.json();

                            if (recommendationResponse.ok && recommendationResult.success) {
                                if (onRecommendationComplete) {
                                    onRecommendationComplete(recommendationResult);
                                    console.log("Received recommendation:", recommendationResult);
                                    console.log("Received Sutmission ID for recommendation:", recommendationResult.submit_id);
                                }
                            } else {
                                console.error('Recommendation failed:', recommendationResult.error);
                                showError('server', 'Your submission was saved and analyzed, but we could not generate submission type recommendations.', {
                                    title: 'Recommendation Error',
                                    details: recommendationResult.error || `HTTP ${recommendationResponse.status}`,
                                });
                            }
                        } catch (recommendationError) {
                            console.error('Error in recommendation:', recommendationError);
                            const isNetwork = recommendationError.message?.includes('Failed to fetch') || recommendationError.message?.includes('NetworkError');
                            showError(isNetwork ? 'network' : 'general', 'Your submission was saved and analyzed, but we could not reach the recommendation service.', {
                                title: 'Recommendation Unavailable',
                                details: recommendationError.message,
                            });
                        }

                        // setModalData({
                        //     success: true,
                        //     detected_label: analyzeResult.detected_item,
                        //     matched_device: analyzeResult.brand_or_model,
                        //     confidence: analyzeResult.confidence,
                        //     category_matches: true,
                        //     detection_id: analyzeResult.detection_id,
                        //     message: `Estimated payout: $${analyzeResult.estimated_payout} ${analyzeResult.currency}`
                        // });
                        // setTimeout(() => { setShowResultModal(false); }, 3000);
                    } else {
                        console.error('Analysis failed:', analyzeResult.error);
                        setShowResultModal(false);
                        showError('server', 'Your submission was saved, but the value analysis failed.', {
                            title: 'Analysis Error',
                            details: analyzeResult.error || `HTTP ${analyzeResponse.status}`,
                        });
                    }
                } catch (analyzeError) {
                    console.error('Error in analysis:', analyzeError);
                    setShowResultModal(false);
                    const isNetwork = analyzeError.message?.includes('Failed to fetch') || analyzeError.message?.includes('NetworkError');
                    showError(isNetwork ? 'network' : 'general', 'Your submission was saved, but we could not reach the analysis service.', {
                        title: 'Analysis Unavailable',
                        details: analyzeError.message,
                    });
                }
            } else {
                throw { type: 'server', serverMessage: result.error || 'Submission failed', fieldErrors: [] };
            }
        } catch (error) {
            console.error('Error completing submission:', error);
            setShowResultModal(false);

            if (error.type === 'validation') {
                showError('validation', error.serverMessage || 'The server rejected your submission due to invalid data.', {
                    title: 'Invalid Submission',
                    fields: error.fieldErrors?.length ? error.fieldErrors : undefined,
                    details: `HTTP ${error.status}`,
                    retry: handleCompleteSubmission,
                });
            } else if (error.type === 'server') {
                showError('server', error.serverMessage, {
                    title: 'Submission Failed',
                    details: error.status ? `HTTP ${error.status}` : undefined,
                    retry: handleCompleteSubmission,
                });
            } else if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError') || error.message?.includes('ERR_CONNECTION_REFUSED')) {
                showError('network', 'Unable to reach the server. Please check that the backend is running and try again.', {
                    title: 'Connection Failed',
                    details: error.message,
                    retry: handleCompleteSubmission,
                });
            } else {
                showError('general', error.message || 'An unexpected error occurred during submission.', {
                    details: error.stack,
                    retry: handleCompleteSubmission,
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            category: '',
            brand: '',
            model: '',
            serial: '',
            quantity: 1,
            condition: 'working',
            accessories: [],
            dataWiped: false,
            powerOn: null,
            accountsLoggedOut: false,
            batteryHealth: 80,
            thirdPartyParts: false,
            requestBox: false,
            preferredDate: '',
            preferredTime: '08:00',
            estimatedWeight: 0.5,
            latitude: null,
            longitude: null,
            photos: [],
            detectionId: null
        });
        setDetectionComplete(false);
    };

    const handleCloseModal = () => {
        setShowResultModal(false);
        // If detection was successful, we can proceed with second step
        if (detectionComplete && modalData?.success) {
            // Modal stays open or user can continue
        }
    };

    const MapClickHandler = () => {
        const map = useMapEvents({
            click: (e) => {
                setFormData({...formData, latitude: e.latlng.lat, longitude: e.latlng.lng});
            }
        });
        return null;
    };

    const MapViewUpdater = () => {
        const map = useMap();
        useEffect(() => {
            if (mapCenter) {
                map.setView(mapCenter, 13);
            }
        }, [map, mapCenter]);
        return null;
    };

    return (
        <>
            {/* Loading Overlay */}
            {isLoading && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center">
                    <div className="bg-black border border-[#08CB00]/30 rounded-3xl p-8 flex flex-col items-center gap-4 max-w-sm mx-4">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-[#08CB00]/20 rounded-full"></div>
                            <div className="w-16 h-16 border-4 border-[#08CB00] rounded-full border-t-transparent animate-spin absolute inset-0"></div>
                        </div>
                        <div className="text-center">
                            <h3 className="text-white font-bold text-lg mb-1">Processing...</h3>
                            <p className="text-white/60 text-sm">Our AI is analyzing your device images. Please wait.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* LEFT COLUMN: THE SUBMISSION ENGINE */}
            {isLocked ? (
                <div className="lg:col-span-8 space-y-6">
                    {/* Compact Submission Complete Card */}
                    <div className="bg-white/5 border border-[#08CB00]/20 rounded-[32px] p-10 text-center space-y-6">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-[#08CB00]/10 border-2 border-[#08CB00] flex items-center justify-center">
                                <svg className="w-8 h-8 text-[#08CB00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-black text-white uppercase tracking-tight">Submission Complete</h2>
                                <p className="text-white/40 text-sm max-w-md mx-auto">Your device has been successfully analyzed. Review your estimated payout and choose a collection method.</p>
                            </div>
                        </div>

                        <div className="h-[1px] bg-white/10"></div>

                        {/* Quick Summary */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-black rounded-2xl p-4 border border-white/5">
                                <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Category</p>
                                <p className="text-sm text-white font-bold mt-1 capitalize">{formData.category.replace(/-/g, ' ')}</p>
                            </div>
                            <div className="bg-black rounded-2xl p-4 border border-white/5">
                                <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Brand</p>
                                <p className="text-sm text-white font-bold mt-1">{formData.brand || '—'}</p>
                            </div>
                            <div className="bg-black rounded-2xl p-4 border border-white/5">
                                <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Condition</p>
                                <p className="text-sm text-white font-bold mt-1 capitalize">{formData.condition}</p>
                            </div>
                            <div className="bg-black rounded-2xl p-4 border border-white/5">
                                <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Quantity</p>
                                <p className="text-sm text-white font-bold mt-1">{formData.quantity}</p>
                            </div>
                        </div>

                        <p className="text-[10px] text-white/20 uppercase tracking-widest">Detection ID: {formData.detectionId}</p>
                    </div>
                </div>
            ) : (
            <div className={`lg:col-span-8 space-y-10 relative ${isLoading ? 'pointer-events-none opacity-50' : ''}`}>
                {/* Empty-state prompt when user hasn't started a submission */}
                {(!detectionComplete && (!formData.photos || formData.photos.filter(Boolean).length === 0)) && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                        <h3 className="text-lg font-black text-white">Create Submission</h3>
                        <p className="text-sm text-white/40 mt-2">Upload 3 photos (Front, Back, Label) to start the AI review.</p>
                    </div>
                )}
                
                {/* Section 1: Device Identification */}
                <section className="space-y-6">
                    <div className="flex items-center gap-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#08CB00] text-black font-bold text-sm">1</span>
                    <h2 className="text-2xl text-white font-bold tracking-tight uppercase italic">Device Identification</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 p-8 rounded-3xl border border-white/10 text-white">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Category</label>
                            <select 
                                value={formData.category}
                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                                disabled={isLoading}
                                className="w-full bg-black border border-white/10 rounded-xl p-4 focus:border-[#08CB00] outline-none transition-all text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                            <option value="">Select Category</option>
                            <option value="battery">Battery</option>
                            <option value="body-weight-scale">Body Weight Scale</option>
                            <option value="cpu-component">CPU Component</option>
                            <option value="cable">Cable</option>
                            <option value="calculator">Calculator</option>
                            <option value="charger">Charger</option>
                            <option value="clock">Clock</option>
                            <option value="dvd-player">DVD Player</option>
                            <option value="electronic-socket">Electronic Socket</option>
                            <option value="fan">Fan</option>
                            <option value="flashlight">Flashlight</option>
                            <option value="fridge">Fridge</option>
                            <option value="gpu">GPU</option>
                            <option value="game-controller">Game Controller</option>
                            <option value="harddisk">Harddisk</option>
                            <option value="iron">Iron</option>
                            <option value="keyboard">Keyboard</option>
                            <option value="lamp">Lamp</option>
                            <option value="laptop">Laptop</option>
                            <option value="microphone">Microphone</option>
                            <option value="microwave">Microwave</option>
                            <option value="monitor">Monitor</option>
                            <option value="motherboard">Motherboard</option>
                            <option value="mouse">Mouse</option>
                            <option value="pc-case">PC Case</option>
                            <option value="phone">Phone</option>
                            <option value="powerbank">Powerbank</option>
                            <option value="printer">Printer</option>
                            <option value="radio">Radio</option>
                            <option value="remote">Remote</option>
                            <option value="rice-cooker">Rice Cooker</option>
                            <option value="router">Router</option>
                            <option value="solar-panel">Solar Panel</option>
                            <option value="speaker">Speaker</option>
                            <option value="television">Television</option>
                            <option value="walkie-talkie">Walkie Talkie</option>
                            <option value="washing-machine">Washing Machine</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Brand & Model</label>
                            <input 
                                type="text" 
                                value={formData.brand}
                                onChange={(e) => setFormData({...formData, brand: e.target.value})}
                                disabled={isLoading}
                                placeholder="e.g. Apple MacBook Pro M2" 
                                className="w-full bg-black border border-white/10 rounded-xl p-4 focus:border-[#08CB00] outline-none transition-all text-sm text-white placeholder-white/30 disabled:opacity-50 disabled:cursor-not-allowed" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Quantity</label>
                            <input 
                                type="number" 
                                min="1"
                                value={formData.quantity}
                                onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 1})}
                                disabled={isLoading}
                                placeholder="Number of devices" 
                                className="w-full bg-black border border-white/10 rounded-xl p-4 focus:border-[#08CB00] outline-none transition-all text-sm text-white placeholder-white/30 disabled:opacity-50 disabled:cursor-not-allowed" 
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Serial Number / IMEI (Optional)</label>
                            <input 
                                type="text" 
                                value={formData.serial}
                                onChange={(e) => setFormData({...formData, serial: e.target.value})}
                                disabled={isLoading}
                                placeholder="Enables faster verification & higher trust score" 
                                className="w-full bg-black border border-white/10 rounded-xl p-4 focus:border-[#08CB00] outline-none transition-all text-sm text-white placeholder-white/30 disabled:opacity-50 disabled:cursor-not-allowed" 
                            />
                        </div>
                    </div>
                </section>

                {(() => {
                    const fieldCfg = getFieldConfig(formData.category);
                    const hasAnyField = fieldCfg.showPowerTest || fieldCfg.showAccountStatus || fieldCfg.showBatteryHealth || fieldCfg.showDataDestruction;
                    if (!hasAnyField && !fieldCfg.showHardwareIntegrity) return null;
                    return (
                    <section className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4 text-white">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#08CB00] text-black font-bold text-sm">2</span>
                                <h2 className="text-2xl font-bold tracking-tight uppercase italic">Technical Audit</h2>
                            </div>
                            <span className="text-[10px] bg-[#08CB00]/20 text-[#08CB00] px-3 py-1 rounded-full font-bold uppercase">Verification Required</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-white/5 border border-white/10 rounded-[32px] text-white">

                            {/* Power-on Test */}
                            {fieldCfg.showPowerTest && (
                            <div className="space-y-4">
                                <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Power-on Test</label>
                                <div className="flex gap-3 h-[80%] w-full items-center justify-center">
                                    {fieldCfg.powerTestOptions.map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => !isLoading && setFormData({...formData, powerOn: opt.value})}
                                            disabled={isLoading}
                                            className={`flex-1 py-4 rounded-2xl border text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                                                formData.powerOn === opt.value
                                                    ? opt.value === 'NO_POWER_LOG_LOOP'
                                                        ? 'bg-red-500 text-white border-red-500'
                                                        : 'bg-[#08CB00] text-black border-[#08CB00]'
                                                    : 'border-white/10 hover:border-white/30'
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            )}

                            {/* Account Status — smart devices only */}
                            {fieldCfg.showAccountStatus && (
                            <div className="space-y-4">
                                <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Account Status</label>
                                <div className={`p-4 rounded-2xl border transition-all ${formData.accountsLoggedOut ? 'bg-[#08CB00]/10 border-[#08CB00]' : 'bg-black border-white/10'}`}>
                                    <div className="flex items-start gap-3">
                                        <input
                                            type="checkbox"
                                            className="mt-1 w-5 h-5 accent-[#08CB00] disabled:opacity-50 disabled:cursor-not-allowed"
                                            checked={formData.accountsLoggedOut}
                                            disabled={isLoading}
                                            onChange={(e) => setFormData({...formData, accountsLoggedOut: e.target.checked})}
                                        />
                                        <div>
                                            <p className="text-xs font-bold uppercase">iCloud / Google Logged Out</p>
                                            <p className="text-[10px] text-white/40 leading-relaxed mt-1">Locked devices cannot be repurposed and will be valued as scrap.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            )}

                            {/* Battery Health */}
                            {fieldCfg.showBatteryHealth && (
                            <div className="space-y-4 h-[100%]">
                                <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Battery Health: {formData.batteryHealth}%</label>
                                <div className="w-full h-[80%] flex items-center justify-center">
                                    <input
                                        type="range"
                                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#08CB00] disabled:opacity-50 disabled:cursor-not-allowed"
                                        min="0" max="100"
                                        value={formData.batteryHealth}
                                        disabled={isLoading}
                                        onChange={(e) => setFormData({...formData, batteryHealth: e.target.value})}
                                    />
                                </div>
                            </div>
                            )}

                            {/* Hardware Integrity — always shown */}
                            <div className="space-y-4">
                                <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Hardware Integrity</label>
                                <button
                                    onClick={() => !isLoading && setFormData({...formData, thirdPartyParts: !formData.thirdPartyParts})}
                                    disabled={isLoading}
                                    className={`w-full py-4 rounded-2xl border text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${formData.thirdPartyParts ? 'border-[#08CB00] text-[#08CB00]' : 'border-white/10'}`}
                                >
                                    {formData.thirdPartyParts ? 'HAS 3RD PARTY REPAIRS' : 'ALL ORIGINAL COMPONENTS'}
                                </button>
                            </div>

                        </div>
                    </section>
                    );
                })()}

                {/* Section 3: Condition */}
                <section className="space-y-6">
                    <div className="flex items-center gap-4 text-white">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#08CB00] text-black font-bold text-sm">3</span>
                    <h2 className="text-2xl font-bold tracking-tight uppercase italic">Condition & Add-ons</h2>
                    </div>
                    
                    <div className="bg-white/5 p-8 rounded-3xl border border-white/10 space-y-8 text-white">
                    {/* Condition Toggle */}
                    <div className="space-y-4">
                        <p className="text-sm font-medium text-white/40">What is the current state of the device?</p>
                        <div className="grid grid-cols-3 gap-3">
                        {['working', 'damaged', 'scrap'].map((c) => (
                            <button key={c} 
                                onClick={() => !isLoading && setFormData({...formData, condition: c})}
                                disabled={isLoading}
                                className={`py-4 rounded-2xl border text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed ${formData.condition === c ? 'bg-[#08CB00] border-[#08CB00] text-black' : 'border-white/10 text-white/40 hover:border-white/30'}`}>
                            {c}
                            </button>
                        ))}
                        </div>
                    </div>

                    {/* Accessories Checklist */}
                    <div className="space-y-4">
                        <p className="text-sm font-medium text-white/40">Included Accessories (Increases Value)</p>
                        <div className="flex flex-wrap gap-3">
                        {['Original Charger', 'Box', 'Cables', 'Warranty Card'].map((acc) => (
                            <button key={acc} 
                                onClick={() => !isLoading && toggleAccessory(acc)}
                                disabled={isLoading}
                                className={`px-6 py-2 rounded-full border text-[10px] font-bold uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed ${formData.accessories.includes(acc) ? 'border-[#08CB00] text-[#08CB00] bg-[#08CB00]/10' : 'border-white/10 text-white/40'}`}>
                            {acc}
                            </button>
                        ))}
                        </div>
                    </div>
                    </div>
                </section>

                {/* STEP 4: DATA SECURITY & LOGISTICS */}
                <section className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4 text-white">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#08CB00] text-black font-bold text-sm">4</span>
                        <h2 className="text-2xl font-bold tracking-tight uppercase italic">Privacy & Logistics</h2>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:flex md:flex-row gap-8 p-8 bg-white/5 border border-white/10 rounded-[32px] space-y-8 text-white">

                    {getFieldConfig(formData.category).showDataDestruction && (
                    <div className="p-6 bg-black rounded-3xl border border-white/5 space-y-4 flex-1">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-[#08CB00]">DATA DESTRUCTION</span>
                            <button className="text-[10px] text-white/40 underline">VIEW WIPING GUIDE</button>
                        </div>
                        <p className="text-[10px] text-white/40">You will receive a <b>Digital Data Destruction Certificate</b> once the recycler processes your device.</p>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox"
                                className="w-4 h-4 accent-[#08CB00] disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isLoading}
                                onChange={(e) => setFormData({...formData, dataWiped: e.target.checked})} />
                            <span className="text-xs font-medium">I have wiped my data</span>
                        </label>
                    </div>
                    )}

                    <div className="p-6 bg-black rounded-3xl border border-white/5 space-y-4 flex-1">
                        <span className="text-xs font-bold text-[#08CB00]">PACKAGING ASSISTANT</span>
                        <p className="text-[10px] text-white/40">Protect your device during transit to maintain the estimated value.</p>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox"
                                className="w-4 h-4 accent-[#08CB00] disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isLoading}
                                onChange={(e) => setFormData({...formData, requestBox: e.target.checked})} />
                            <span className="text-xs font-medium">Send me a GreenHoop Eco-Box</span>
                        </label>
                    </div>
                    </div>
                </section>

                {/* STEP 5: PICKUP DETAILS */}
                <section className="space-y-6">
                    <div className="flex items-center gap-4 text-white">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#08CB00] text-black font-bold text-sm">5</span>
                        <h2 className="text-2xl font-bold tracking-tight uppercase italic">Pickup Details</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 bg-white/5 border border-white/10 rounded-[32px]">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Preferred Date</label>
                            <input 
                                type="date" 
                                value={formData.preferredDate}
                                onChange={(e) => setFormData({...formData, preferredDate: e.target.value})}
                                disabled={isLoading}
                                className="w-full bg-black border border-white/10 rounded-xl p-4 focus:border-[#08CB00] outline-none transition-all text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed [color-scheme:dark]" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Preferred Time</label>
                            <select 
                                value={formData.preferredTime}
                                onChange={(e) => setFormData({...formData, preferredTime: e.target.value})}
                                disabled={isLoading}
                                className="w-full bg-black border border-white/10 rounded-xl p-4 focus:border-[#08CB00] outline-none transition-all text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <option value="08:00">Morning (8AM - 12PM)</option>
                                <option value="12:00">Afternoon (12PM - 5PM)</option>
                                <option value="17:00">Evening (5PM - 8PM)</option>
                            </select>
                        </div>
                        <div className="space-y-2 col-span-2">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Estimated Weight (kg)</label>
                            <input 
                                type="number" 
                                step="0.1"
                                min="0"
                                value={formData.estimatedWeight}
                                onChange={(e) => setFormData({...formData, estimatedWeight: parseFloat(e.target.value) || 0})}
                                disabled={isLoading}
                                placeholder="e.g. 2.5" 
                                className="w-full bg-black border border-white/10 rounded-xl p-4 focus:border-[#08CB00] outline-none transition-all text-sm text-white placeholder-white/30 disabled:opacity-50 disabled:cursor-not-allowed" 
                            />
                        </div>
                        <div className="space-y-2 col-span-2">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Location</label>
                                <button 
                                    onClick={() => setFormData({...formData, latitude: null, longitude: null})}
                                    disabled={isLoading || (!formData.latitude && !formData.longitude)}
                                    className="text-[10px] text-white/40 hover:text-red-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    Clear Location
                                </button>
                            </div>
                            
                            {/* Leaflet Map */}
                            <div className="relative w-full h-48 border border-white/10 rounded-xl overflow-hidden z-0">
                                <button
                                    onClick={() => setIsMapFullscreen(true)}
                                    className="absolute top-3 right-3 z-[1000] bg-black/70 hover:bg-black text-white p-2 rounded-lg transition-all"
                                    title="Expand Map"
                                >
                                    <MdFullscreen size={20} />
                                </button>
                                {isMapMounted ? (
                                <MapContainer
                                    center={mapCenter}
                                    zoom={13}
                                    scrollWheelZoom={false}
                                    style={{ height: '100%', width: '100%' }}
                                    className="z-0"
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    {formData.latitude && formData.longitude && (
                                        <Marker 
                                            position={[formData.latitude, formData.longitude]}
                                            icon={L.divIcon({
                                                className: 'custom-marker',
                                                html: `<svg viewBox="0 0 24 24" fill="#08CB00" style="width:32px;height:32px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5))"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`,
                                                iconSize: [32, 32],
                                                iconAnchor: [16, 32]
                                            })}
                                        />
                                    )}
                                    <MapClickHandler />
                                    <MapViewUpdater />
                                </MapContainer>
                                ) : (
                                    <div className="w-full h-full bg-black flex items-center justify-center">
                                        <p className="text-white/50 text-sm">Loading map...</p>
                                    </div>
                                )}
                                {!formData.latitude && !formData.longitude && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/20">
                                        <p className="text-[10px] text-white/50 uppercase bg-black/60 px-3 py-1 rounded">Click map to drop pin</p>
                                    </div>
                                )}
                            </div>

                            {/* Map Modal */}
                            {isMapFullscreen && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                                    <div className="relative w-full max-w-4xl h-[80vh] bg-black rounded-2xl border border-white/10 overflow-hidden">
                                        <div className="absolute top-4 right-4 z-[1000] flex gap-2">
                                            <button
                                                onClick={() => setIsMapFullscreen(false)}
                                                className="bg-black/70 hover:bg-black text-white p-3 rounded-lg transition-all"
                                                title="Close"
                                            >
                                                <MdFullscreenExit size={24} />
                                            </button>
                                        </div>
                                        {isMapMounted && (
                                            <MapContainer
                                                center={mapCenter}
                                                zoom={15}
                                                scrollWheelZoom={true}
                                                style={{ height: '100%', width: '100%' }}
                                                className="z-0"
                                            >
                                                <TileLayer
                                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                />
                                                {formData.latitude && formData.longitude && (
                                                    <Marker 
                                                        position={[formData.latitude, formData.longitude]}
                                                        icon={L.divIcon({
                                                            className: 'custom-marker',
                                                            html: `<svg viewBox="0 0 24 24" fill="#08CB00" style="width:40px;height:40px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5))"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`,
                                                            iconSize: [40, 40],
                                                            iconAnchor: [20, 40]
                                                        })}
                                                    />
                                                )}
                                                <MapClickHandler />
                                                <MapViewUpdater />
                                            </MapContainer>
                                        )}
                                        {!formData.latitude && !formData.longitude && (
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/20">
                                                <p className="text-white/50 uppercase bg-black/60 px-4 py-2 rounded">Click map to drop pin</p>
                                            </div>
                                        )}
                                        <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="text-[10px] text-white/40 uppercase tracking-wider">Selected Location</p>
                                                    <p className="text-sm text-white">
                                                        {formData.latitude && formData.longitude 
                                                            ? `${formData.latitude.toFixed(6)}, ${formData.longitude.toFixed(6)}`
                                                            : 'No location selected'
                                                        }
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => setIsMapFullscreen(false)}
                                                    className="px-6 py-2 bg-[#08CB00] text-black text-xs font-bold uppercase rounded-lg hover:bg-[#08CB00]/80 transition-all"
                                                >
                                                    Done
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-2">
                                <input 
                                    type="number" 
                                    step="0.000001"
                                    value={formData.latitude || ''}
                                    onChange={(e) => setFormData({...formData, latitude: e.target.value ? parseFloat(e.target.value) : null})}
                                    disabled={isLoading}
                                    placeholder="Latitude" 
                                    className="flex-1 bg-black border border-white/10 rounded-xl p-4 focus:border-[#08CB00] outline-none transition-all text-sm text-white placeholder-white/30 disabled:opacity-50 disabled:cursor-not-allowed" 
                                />
                                <input 
                                    type="number" 
                                    step="0.000001"
                                    value={formData.longitude || ''}
                                    onChange={(e) => setFormData({...formData, longitude: e.target.value ? parseFloat(e.target.value) : null})}
                                    disabled={isLoading}
                                    placeholder="Longitude" 
                                    className="flex-1 bg-black border border-white/10 rounded-xl p-4 focus:border-[#08CB00] outline-none transition-all text-sm text-white placeholder-white/30 disabled:opacity-50 disabled:cursor-not-allowed" 
                                />
                                <button 
                                    onClick={() => {
                                        if (navigator.geolocation) {
                                            navigator.geolocation.getCurrentPosition(
                                                (position) => {
                                                    const { latitude, longitude } = position.coords;
                                                    setFormData({
                                                        ...formData, 
                                                        latitude,
                                                        longitude
                                                    });
                                                    setMapCenter([latitude, longitude]);
                                                },
                                                (error) => {
                                                    showError('general', 'Could not retrieve your location. Please enter coordinates manually or try again.', {
                                                        title: 'Location Error',
                                                        details: error.message,
                                                    });
                                                }
                                            );
                                        } else {
                                            showError('general', 'Your browser does not support geolocation. Please enter coordinates manually.', {
                                                title: 'Unsupported Feature',
                                            });
                                        }
                                    }}
                                    disabled={isLoading}
                                    className="px-4 py-4 rounded-xl bg-[#08CB00]/20 border border-[#08CB00]/40 text-[#08CB00] hover:bg-[#08CB00]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    <IoMdLocate size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* STEP 6: VERIFICATION */}
                <section className="space-y-6">
                    <div className="flex items-center gap-4 text-white">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#08CB00] text-black font-bold text-sm">6</span>
                        <h2 className="text-2xl font-bold tracking-tight uppercase italic">Verification</h2>
                    </div>
                    
                    <div className="bg-white/5 p-8 rounded-3xl border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <h2 className="text-xs font-bold text-white/40 uppercase tracking-[0.2em]">Required Media Verification</h2>
                        <div className="grid grid-cols-3 gap-4 md:col-span-2 flex items-center justify-center" >
                            {['FRONT (Screen On)', 'BACK (Serial No.)', 'PORTS / DAMAGE'].map((label, index) => (
                                <div 
                                    key={label} 
                                    onClick={() => !isLoading && fileInputRef.current?.click()}
                                    className={`aspect-square bg-black border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-[#08CB00]/5 hover:border-[#08CB00]/40 transition-all relative overflow-hidden ${isLoading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
                                >
                                    {formData.photos[index] ? (
                                        <>
                                            <img 
                                                src={URL.createObjectURL(formData.photos[index])} 
                                                alt={label}
                                                className="absolute inset-0 w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                <span className="text-[8px] text-white uppercase text-center px-2">{label}</span>
                                            </div>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const newPhotos = [...formData.photos];
                                                    newPhotos[index] = null;
                                                    setFormData({...formData, photos: newPhotos});
                                                }}
                                                className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full text-white text-xs flex items-center justify-center z-10 hover:bg-red-600"
                                            >
                                                ×
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-xl"> <IoMdCamera className="text-white" size={24} /></span>
                                            <span className="text-[8px] text-white/80 uppercase text-center px-2">{label}</span>
                                            <span className="text-[8px] text-[#08CB00] uppercase">Click to upload</span>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Hidden file input */}
                        <input 
                            type="file" 
                            ref={fileInputRef}
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    const emptyIndex = formData.photos.findIndex(p => !p);
                                    const targetIndex = emptyIndex !== -1 ? emptyIndex : formData.photos.length;
                                    if (targetIndex < 3) {
                                        handlePhotoUpload(targetIndex, file);
                                    }
                                }
                                e.target.value = ''; // Reset input
                            }}
                        />

                        <div className="space-y-4 flex flex-col justify-center items-center md:col-span-2">
                            <div className="flex items-start gap-3 p-4 bg-black rounded-2xl border border-[#08CB00]/20">
                                <input type="checkbox" 
                                    className="mt-1 accent-[#08CB00] disabled:opacity-50 disabled:cursor-not-allowed" 
                                    disabled={isLoading}
                                    onChange={(e) => setFormData({...formData, dataWiped: e.target.checked})} />
                                <div className="space-y-1">
                                    <p className="text-xs font-bold uppercase text-[#08CB00]">Data Erasure Confirmation</p>
                                    <p className="text-[10px] text-white/40 leading-relaxed">I confirm that all personal data has been removed from this device.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Action Footer */}
                    <div className="flex justify-between items-center pt-4">
                        <button className="text-white/30 text-xs font-bold uppercase hover:text-white transition-all underline underline-offset-8 disabled:opacity-50 disabled:cursor-not-allowed" disabled={isLoading}>Cancel Entry</button>
                        <div className="flex gap-4">
                            <button className="px-8 py-4 rounded-full border border-white/10 text-xs font-bold uppercase hover:bg-white/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed" disabled={isLoading}>Save Draft</button>
                            <button 
                                onClick={handleNextStep}
                                disabled={isLoading}
                                className="px-8 py-4 rounded-full bg-white text-black text-xs font-bold uppercase hover:bg-[#08CB00] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Processing...' : 'Next Step'}
                            </button>
                        </div>
                    </div>
                </section>
            </div>
            )}

                {/* Result Modal */}
                <ResultModal 
                    isOpen={showResultModal} 
                    data={modalData} 
                    onClose={handleCloseModal}
                    onConfirm={handleCompleteSubmission}
                    isSubmitting={isSubmitting}
                />

                {/* Error Modal */}
                <ErrorModal
                    isOpen={showErrorModal}
                    error={errorData}
                    onClose={() => setShowErrorModal(false)}
                    onRetry={retryAction}
                />
            
        </>
        
    );
}