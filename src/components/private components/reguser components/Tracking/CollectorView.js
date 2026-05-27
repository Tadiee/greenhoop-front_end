"use client"
import React, { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { IoLocationOutline, IoCallOutline, IoMailOutline, IoStarOutline, IoStar, IoCheckmarkCircle, IoTimeOutline, IoSearchOutline, IoClose, IoMapOutline, IoListOutline } from 'react-icons/io5';
import { useRouter } from 'next/navigation';
import { MdVerified, MdRecycling } from 'react-icons/md';
import { HiOutlineTruck } from 'react-icons/hi2';

// Dynamically import the map component to avoid SSR issues
const CollectorMap = dynamic(() => import('./CollectorMap'), { ssr: false });

// Dummy collector/recycler data (Harare area coordinates)
const DUMMY_COLLECTORS = [
    {
        id: 'COL-001',
        name: 'GreenTech Recyclers',
        type: 'recycler',
        verified: true,
        rating: 4.8,
        reviews: 127,
        distance: 2.3,
        lat: -17.8292,
        lng: 31.0522,
        address: '45 Industrial Road, Harare CBD',
        phone: '+263 77 123 4567',
        email: 'collect@greentech.co.zw',
        accepts: ['laptop', 'smartphone', 'tablet', 'monitor', 'keyboard', 'mouse'],
        specialties: ['Bulk collections', 'Corporate accounts', 'Data destruction'],
        availability: 'available',
        nextSlot: '2026-04-08T09:00:00Z',
        payoutMultiplier: 1.0,
        description: 'Licensed e-waste recycler with secure data destruction services. EPA certified.',
    },
    {
        id: 'COL-002',
        name: 'TechRevive Solutions',
        type: 'technician',
        verified: true,
        rating: 4.9,
        reviews: 89,
        distance: 4.1,
        lat: -17.7912,
        lng: 31.0455,
        address: '12 Second Street, Avondale',
        phone: '+263 71 987 6543',
        email: 'service@techrevive.co.zw',
        accepts: ['laptop', 'smartphone', 'tablet'],
        specialties: ['Refurbishment', 'Component harvesting', 'Quick turnaround'],
        availability: 'available',
        nextSlot: '2026-04-08T14:00:00Z',
        payoutMultiplier: 1.15,
        description: 'Specialist in device refurbishment. Higher payouts for working devices.',
    },
    {
        id: 'COL-003',
        name: 'EcoWaste Hub',
        type: 'drop-off',
        verified: true,
        rating: 4.5,
        reviews: 203,
        distance: 1.8,
        lat: -17.8250,
        lng: 31.0500,
        address: '78 Samora Machel Ave, Harare',
        phone: '+263 78 555 1234',
        email: 'info@ecowaste.co.zw',
        accepts: ['laptop', 'smartphone', 'tablet', 'monitor', 'keyboard', 'mouse', 'printer', 'cables'],
        specialties: ['Walk-in accepted', 'No appointment needed', 'Instant valuation'],
        availability: 'available',
        nextSlot: null,
        payoutMultiplier: 0.95,
        description: 'Convenient drop-off location open 7 days. Accepts all e-waste types.',
    },
    {
        id: 'COL-004',
        name: 'Metro E-Collect',
        type: 'technician',
        verified: false,
        rating: 4.2,
        reviews: 34,
        distance: 6.7,
        lat: -17.7850,
        lng: 31.0850,
        address: '156 Enterprise Road, Highlands',
        phone: '+263 77 222 3333',
        email: 'pickup@metroecollect.co.zw',
        accepts: ['laptop', 'smartphone', 'monitor'],
        specialties: ['Same-day pickup', 'Evening slots available'],
        availability: 'busy',
        nextSlot: '2026-04-10T10:00:00Z',
        payoutMultiplier: 1.05,
        description: 'Flexible pickup times including evenings and weekends.',
    },
    {
        id: 'COL-005',
        name: 'CircuitBoard Salvage',
        type: 'recycler',
        verified: true,
        rating: 4.6,
        reviews: 67,
        distance: 8.2,
        lat: -17.7650,
        lng: 31.1200,
        address: '23 Mutare Road, Msasa',
        phone: '+263 71 444 5555',
        email: 'salvage@circuitboard.co.zw',
        accepts: ['laptop', 'smartphone', 'tablet', 'monitor', 'keyboard', 'mouse', 'printer', 'cables', 'batteries'],
        specialties: ['Precious metal recovery', 'Battery recycling', 'Large volumes'],
        availability: 'available',
        nextSlot: '2026-04-09T08:00:00Z',
        payoutMultiplier: 1.1,
        description: 'Specialized in precious metal recovery. Best rates for bulk submissions.',
    },
];

const TYPE_CONFIG = {
    recycler: { label: 'Recycler', icon: MdRecycling, bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
    technician: { label: 'Technician', icon: HiOutlineTruck, bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
    'drop-off': { label: 'Drop-off Point', icon: IoLocationOutline, bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
    receiver: { label: 'Receiver', icon: MdRecycling, bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
    courier: { label: 'Courier', icon: HiOutlineTruck, bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
};

const AVAILABILITY_CONFIG = {
    available: { label: 'Available', bg: 'bg-[#08CB00]/10', text: 'text-[#08CB00]', dot: 'bg-[#08CB00]' },
    busy: { label: 'Busy', bg: 'bg-yellow-500/10', text: 'text-yellow-400', dot: 'bg-yellow-400' },
    unavailable: { label: 'Unavailable', bg: 'bg-red-500/10', text: 'text-red-400', dot: 'bg-red-400' },
    offline: { label: 'Offline', bg: 'bg-red-500/10', text: 'text-red-400', dot: 'bg-red-400' },
};

function formatDate(dateStr) {
    if (!dateStr) return 'Walk-in anytime';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' at ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export default function CollectorView() {
    const searchParams = useSearchParams();
    const submitId = searchParams ? searchParams.get('submitId') : null;
    const router = useRouter();
    
    const [collectors, setCollectors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userLocation, setUserLocation] = useState(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [expandedId, setExpandedId] = useState(null);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'

    // Haversine formula to calculate distance between two points
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Earth's radius in kilometers
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
                Math.cos((lat2 * Math.PI) / 180) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return parseFloat(distance.toFixed(1)); // Return distance rounded to 1 decimal place
    };

    // Get user's current location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                    });
                },
                (error) => {
                    console.warn('Geolocation error:', error);
                    // Fallback to default location (Harare) if geolocation fails
                    setUserLocation({
                        lat: -17.8252,
                        lon: 31.0335,
                    });
                }
            );
        } else {
            // Fallback to default location if geolocation not supported
            setUserLocation({
                lat: -17.8252,
                lon: 31.0335,
            });
        }
    }, []);

    useEffect(() => {
        if (!submitId) {
            // No submission selected — prompt user to create one instead of showing dummy data
            setError('No submission selected. Create a submission to find collectors for your device.');
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        const loadData = () => {
            try {
                const storedData = sessionStorage.getItem(`dispatchData_${submitId}`);
                if (storedData) {
                    const parsedData = JSON.parse(storedData);
                    if (parsedData && parsedData.receiver_map_data) {
                        const mapData = parsedData.receiver_map_data;
                        // Handing both object (intelligent mode) and array (broadcast mode)
                        let collectorsArray = Array.isArray(mapData) ? mapData : [mapData];
                        
                        // Calculate distances from user location if available
                        if (userLocation) {
                            collectorsArray = collectorsArray.map((collector) => ({
                                ...collector,
                                calculatedDistance: calculateDistance(
                                    userLocation.lat,
                                    userLocation.lon,
                                    collector.lat,
                                    collector.lng
                                ),
                            }));
                        }
                        
                        setCollectors(collectorsArray);
                    } else {
                        setError('No collectors were found for this submission.');
                    }
                } else {
                    setError('Dispatch data not found. Please try submitting again or confirm your submission to trigger dispatch.');
                }
            } catch (err) {
                console.error("Error parsing dispatch data", err);
                setError('Failed to load collector data.');
            } finally {
                setIsLoading(false);
            }
        };

        // Slight timeout to ensure smooth transition state
        const timeoutId = setTimeout(loadData, 600);
        return () => clearTimeout(timeoutId);
    }, [submitId, userLocation]);

    const typeFilters = [
        { key: 'all', label: 'All' },
        { key: 'recycler', label: 'Recyclers' },
        { key: 'technician', label: 'Technicians' },
        { key: 'drop-off', label: 'Drop-off' },
    ];

    const filteredCollectors = useMemo(() => {
        return collectors
            .filter((c) => {
                if (typeFilter !== 'all' && c.type !== typeFilter) return false;
                return true;
            })
            .filter((c) => {
                if (!searchQuery.trim()) return true;
                const q = searchQuery.toLowerCase();
                return (
                    (c.name || '').toLowerCase().includes(q) ||
                    (c.address || '').toLowerCase().includes(q) ||
                    (c.accepts || []).some(cat => cat.toLowerCase().includes(q)) ||
                    (c.specialties || []).some(s => s.toLowerCase().includes(q))
                );
            })
            .sort((a, b) => {
                const distA = a.calculatedDistance !== undefined ? a.calculatedDistance : (a.distance || 0);
                const distB = b.calculatedDistance !== undefined ? b.calculatedDistance : (b.distance || 0);
                return distA - distB;
            });
    }, [collectors, typeFilter, searchQuery]);

    const availableCount = collectors.filter(c => c.availability === 'available').length;
    const avgRating = collectors.length > 0 ? (collectors.reduce((sum, c) => sum + (c.rating || 0), 0) / collectors.length).toFixed(1) : '0.0';

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 space-y-4 border border-white/5 rounded-2xl bg-white/5">
                <div className="w-10 h-10 border-4 border-[#08CB00]/20 border-t-[#08CB00] rounded-full animate-spin"></div>
                <p className="text-sm font-bold text-white/50 uppercase tracking-widest">Finding best matches...</p>
            </div>
        );
    }
    // No submission selected: show a professional empty state with CTAs
    if (!submitId) {
        return (
            <div className="flex items-center justify-center py-16">
                <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-3xl p-8 text-center">
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-16 h-16 rounded-full bg-[#08CB00]/10 flex items-center justify-center">
                            <MdRecycling className="text-[#08CB00]" size={28} />
                        </div>
                    </div>
                    <h3 className="text-2xl font-black text-white">No Submission Selected</h3>
                    <p className="text-sm text-white/40 mt-2">Create a submission to discover nearby collectors, technicians, and drop-off points tailored to your device.</p>
                    <div className="mt-6 flex items-center justify-center gap-3">
                        <button
                            onClick={() => router.push('/reguser/Submit')}
                            className="px-6 py-3 bg-[#08CB00] text-black rounded-xl font-bold"
                        >
                            Create Submission
                        </button>
                        <button
                            onClick={() => router.push('/reguser/Tracking?tab=submissions')}
                            className="px-6 py-3 border border-white/10 text-white/60 rounded-xl font-bold hover:bg-white/5"
                        >
                            View My Submissions
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center py-16">
                <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-3xl p-8 text-center">
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                            <IoClose className="text-red-400" size={26} />
                        </div>
                    </div>
                    <h3 className="text-xl font-black text-white">Could not load collectors</h3>
                    <p className="text-sm text-white/40 mt-2">{error}</p>
                    <div className="mt-6 flex items-center justify-center gap-3">
                        <button
                            onClick={() => window.location.reload()}
                            className="px-5 py-2.5 bg-[#08CB00] text-black rounded-xl font-bold"
                        >
                            Retry
                        </button>
                        <button
                            onClick={() => router.push('/reguser/Submit')}
                            className="px-5 py-2.5 border border-white/10 text-white/60 rounded-xl font-bold hover:bg-white/5"
                        >
                            Create Submission
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Total Collectors</p>
                    <p className="text-3xl font-black text-white">{collectors.length}</p>
                    <p className="text-[9px] text-white/20">in your area</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Available Now</p>
                    <p className="text-3xl font-black text-[#08CB00]">{availableCount}</p>
                    <p className="text-[9px] text-white/20">ready to collect</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Avg Rating</p>
                    <div className="flex items-center gap-2">
                        <p className="text-3xl font-black text-yellow-400">{avgRating}</p>
                        <IoStar className="text-yellow-400" size={20} />
                    </div>
                    <p className="text-[9px] text-white/20">across all collectors</p>
                </div>
                <div className="bg-[#08CB00] rounded-2xl p-5 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-black/50">Nearest</p>
                    <p className="text-lg font-black text-black">{filteredCollectors[0]?.distance !== undefined && filteredCollectors[0]?.distance !== null ? `${filteredCollectors[0].distance} km` : '—'}</p>
                    <p className="text-[9px] text-black/50 truncate">{filteredCollectors[0]?.name || 'None available'}</p>
                </div>
            </div>

            {/* Filter & Search */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                    {typeFilters.map((f) => (
                        <button
                            key={f.key}
                            onClick={() => setTypeFilter(f.key)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                                typeFilter === f.key
                                    ? 'bg-white text-black'
                                    : 'bg-white/5 text-white/40 hover:bg-white/10 border border-white/5'
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                    <div className="flex-1" />
                    <p className="text-[10px] text-white/20 uppercase tracking-widest">
                        {filteredCollectors.length} collector{filteredCollectors.length !== 1 ? 's' : ''}
                    </p>
                </div>

                {/* Search */}
                <div className="relative">
                    <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                    <input
                        type="text"
                        placeholder="Search by name, location, or device type..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/20 outline-none focus:border-[#08CB00]/30 transition-all"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50"
                        >
                            <IoClose size={14} />
                        </button>
                    )}
                </div>
            </div>
        
            {/* Split Layout: List + Map */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* List Column */}
                <div className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 pr-2">
                    {filteredCollectors.map((collector) => {
                        const typeConfig = TYPE_CONFIG[collector.type] || TYPE_CONFIG.recycler;
                        const TypeIcon = typeConfig.icon;
                        const availConfig = AVAILABILITY_CONFIG[collector.availability] || AVAILABILITY_CONFIG.unavailable;
                        const isExpanded = expandedId === collector.id;

                        return (
                            <div
                                key={collector.id}
                                className={`bg-white/5 border rounded-2xl overflow-hidden transition-all ${
                                    isExpanded ? 'border-white/20' : 'border-white/5 hover:border-white/10'
                                }`}
                            >
                                {/* Card Header */}
                                <button
                                    onClick={() => setExpandedId(isExpanded ? null : collector.id)}
                                    className="w-full p-5 text-left"
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Icon */}
                                        <div className={`w-12 h-12 rounded-xl ${typeConfig.bg} ${typeConfig.border} border flex items-center justify-center flex-shrink-0`}>
                                            <TypeIcon className={typeConfig.text} size={24} />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0 space-y-2">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-sm font-bold text-white truncate">{collector.name}</h3>
                                                {collector.verified && (
                                                    <MdVerified className="text-[#08CB00] flex-shrink-0" size={16} />
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3 text-[10px] text-white/40">
                                                <span className={`px-2 py-0.5 rounded-full font-bold uppercase ${typeConfig.bg} ${typeConfig.text}`}>
                                                    {typeConfig.label}
                                                </span>
                                                {collector.score !== null && collector.score !== undefined && (
                                                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full font-bold bg-[#08CB00]/20 text-[#08CB00] border border-[#08CB00]/30 group relative cursor-help">
                                                        <span>{Math.round(collector.score)}/100</span>
                                                        {/* Tooltip */}
                                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-black/90 rounded-lg text-[9px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/20">
                                                            Match score for your device
                                                        </div>
                                                    </div>
                                                )}
                                                <span className="flex items-center gap-1">
                                                    <IoLocationOutline size={12} />
                                                    {collector.distance !== null && collector.distance !== undefined ? `${collector.distance} km` : '--'}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <IoStar className="text-yellow-400" size={12} />
                                                    {collector.rating || 'N/A'} ({collector.reviews || 0})
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-white/30 truncate">{collector.address}</p>
                                        </div>

                                        {/* Availability & Payout */}
                                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${availConfig.bg}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${availConfig.dot}`} />
                                                <span className={`text-[9px] font-bold uppercase ${availConfig.text}`}>{availConfig.label}</span>
                                            </div>
                                            {collector.payoutMultiplier !== 1.0 && (
                                                <span className={`text-[9px] font-bold ${(collector.payoutMultiplier || 1.0) > 1 ? 'text-[#08CB00]' : 'text-white/30'}`}>
                                                    {(collector.payoutMultiplier || 1.0) > 1 ? '+' : ''}{(((collector.payoutMultiplier || 1.0) - 1) * 100).toFixed(0)}% payout
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </button>

                                {/* Expanded Details */}
                                {isExpanded && (
                                    <div className="px-5 pb-5 space-y-4 border-t border-white/5 pt-4">
                                        {/* Description */}
                                        {collector.description && <p className="text-xs text-white/50 leading-relaxed">{collector.description}</p>}

                                        {/* Accepts */}
                                        <div className="space-y-2">
                                            <p className="text-[9px] font-bold uppercase tracking-widest text-white/30">Accepts</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {(collector.accepts || []).map((cat) => (
                                                    <span key={cat} className="px-2 py-1 bg-white/5 border border-white/5 rounded-lg text-[9px] text-white/50 capitalize">
                                                        {cat}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Specialties */}
                                        <div className="space-y-2">
                                            <p className="text-[9px] font-bold uppercase tracking-widest text-white/30">Specialties</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {(collector.specialties || []).map((s) => (
                                                    <span key={s} className="px-2 py-1 bg-[#08CB00]/10 border border-[#08CB00]/20 rounded-lg text-[9px] text-[#08CB00]">
                                                        {s}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Next Available Slot */}
                                        <div className="flex items-center gap-2 text-xs text-white/40">
                                            <IoTimeOutline size={14} />
                                            <span>Next slot: <span className="text-white font-medium">{formatDate(collector.nextSlot)}</span></span>
                                        </div>

                                        {/* Contact & Action */}
                                        <div className="flex items-center gap-3 pt-2">
                                        {collector.phone && (
                                            <a
                                                href={`tel:${collector.phone}`}
                                                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white/60 hover:bg-white/10 transition-all"
                                            >
                                                <IoCallOutline size={14} />
                                                Call
                                            </a>
                                        )}
                                        {collector.email && (
                                            <a
                                                href={`mailto:${collector.email}`}
                                                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white/60 hover:bg-white/10 transition-all"
                                            >
                                                <IoMailOutline size={14} />
                                                Email
                                            </a>
                                        )}
                                            <div className="flex-1" />
                                            <button className="flex items-center gap-2 px-5 py-2.5 bg-[#08CB00] rounded-xl text-xs font-bold text-black hover:bg-[#08CB00]/90 transition-all">
                                                <IoCheckmarkCircle size={14} />
                                                Select Collector
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {filteredCollectors.length === 0 && (
                        <div className="text-center py-12 space-y-2">
                            <MdRecycling className="mx-auto text-white/10" size={40} />
                            <p className="text-sm text-white/30">No collectors found</p>
                            <p className="text-xs text-white/15">Try adjusting your filters or search</p>
                        </div>
                    )}
                </div>

                {/* Map Column - Real OpenStreetMap */}
                <div className="relative border border-white/10 rounded-2xl overflow-hidden h-[600px]">
                    <CollectorMap collectors={filteredCollectors} onPinClick={setExpandedId} />
                    
                    {/* Map Overlay Label */}
                    <div className="absolute top-4 left-14 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-lg border border-white/10 z-[1000]">
                        <p className="text-[10px] text-white/60 font-bold uppercase tracking-wider">Harare, Zimbabwe</p>
                    </div>
                </div>
            </div>
        </div>
    );
}