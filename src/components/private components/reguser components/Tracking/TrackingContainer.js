"use client"
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { IoChevronDown, IoChevronUp, IoCheckmarkCircle, IoTimeOutline, IoLocationOutline, IoCallOutline, IoNotificationsOutline, IoClose, IoSearchOutline, IoSwapVertical, IoRefreshOutline } from 'react-icons/io5';
import { MdDevices, MdLocalShipping, MdPendingActions, MdDoneAll, MdOutlineCancel } from 'react-icons/md';
import { HiOutlineTruck } from 'react-icons/hi2';
import CollectorView from './CollectorView';
import AcceptedActionPanel from './AcceptedActionPanel';
import TechnicianAcceptedPanel from './TechnicianAcceptedPanel';
import InTransitQRSection from './InTransitQRSection';

// Dummy submission data
const DUMMY_SUBMISSIONS = [
    {
        submit_id: 1042,
        detection_id: 'DET-8A3F21',
        category: 'laptop',
        brand_n_model: 'Apple MacBook Pro 2019',
        device_state: 'Working',
        submission_type: 'Technician Pickup',
        estimated_payout: 145.80,
        currency: 'USD',
        status: 'pickup_scheduled',
        created_at: '2026-04-05T10:32:00Z',
        preferred_date: '2026-04-08',
        preferred_time: '08:00',
        latitude: -17.8292,
        longitude: 31.0522,
        timeline: [
            { step: 'submitted', label: 'Submission Received', time: '2026-04-05 10:32 AM', done: true },
            { step: 'reviewed', label: 'AI Analysis Complete', time: '2026-04-05 10:33 AM', done: true },
            { step: 'approved', label: 'Approved for Pickup', time: '2026-04-05 02:15 PM', done: true },
            { step: 'pickup_scheduled', label: 'Pickup Scheduled', time: '2026-04-07 09:00 AM', done: true },
            { step: 'in_transit', label: 'In Transit', time: null, done: false },
            { step: 'completed', label: 'Completed & Paid', time: null, done: false },
        ],
    },
    {
        submit_id: 1039,
        detection_id: 'DET-6B2E10',
        category: 'smartphone',
        brand_n_model: 'Samsung Galaxy S22',
        device_state: 'Minor Issues',
        submission_type: 'Drop-off',
        estimated_payout: 62.50,
        currency: 'USD',
        status: 'in_transit',
        created_at: '2026-04-03T14:20:00Z',
        preferred_date: '2026-04-06',
        preferred_time: '12:00',
        latitude: -17.8312,
        longitude: 31.0455,
        timeline: [
            { step: 'submitted', label: 'Submission Received', time: '2026-04-03 02:20 PM', done: true },
            { step: 'reviewed', label: 'AI Analysis Complete', time: '2026-04-03 02:21 PM', done: true },
            { step: 'approved', label: 'Approved for Drop-off', time: '2026-04-03 04:00 PM', done: true },
            { step: 'pickup_scheduled', label: 'Drop-off Confirmed', time: '2026-04-05 10:00 AM', done: true },
            { step: 'in_transit', label: 'Device Received', time: '2026-04-06 11:30 AM', done: true },
            { step: 'completed', label: 'Completed & Paid', time: null, done: false },
        ],
    },
    {
        submit_id: 1035,
        detection_id: 'DET-4C1D08',
        category: 'monitor',
        brand_n_model: 'Dell UltraSharp U2720Q',
        device_state: 'Working',
        submission_type: 'Recycler Pickup',
        estimated_payout: 88.20,
        currency: 'USD',
        status: 'completed',
        created_at: '2026-03-28T09:15:00Z',
        preferred_date: '2026-03-30',
        preferred_time: '08:00',
        latitude: -17.8250,
        longitude: 31.0500,
        timeline: [
            { step: 'submitted', label: 'Submission Received', time: '2026-03-28 09:15 AM', done: true },
            { step: 'reviewed', label: 'AI Analysis Complete', time: '2026-03-28 09:16 AM', done: true },
            { step: 'approved', label: 'Approved for Pickup', time: '2026-03-28 11:45 AM', done: true },
            { step: 'pickup_scheduled', label: 'Pickup Scheduled', time: '2026-03-29 08:00 AM', done: true },
            { step: 'in_transit', label: 'In Transit', time: '2026-03-30 09:20 AM', done: true },
            { step: 'completed', label: 'Completed & Paid', time: '2026-03-31 03:00 PM', done: true },
        ],
    },
    {
        submit_id: 1044,
        detection_id: 'DET-9E5G33',
        category: 'keyboard',
        brand_n_model: 'Logitech MX Keys',
        device_state: 'Non-functional',
        submission_type: 'Marketplace',
        estimated_payout: 12.40,
        currency: 'USD',
        status: 'reviewed',
        created_at: '2026-04-07T08:10:00Z',
        preferred_date: null,
        preferred_time: null,
        latitude: null,
        longitude: null,
        timeline: [
            { step: 'submitted', label: 'Submission Received', time: '2026-04-07 08:10 AM', done: true },
            { step: 'reviewed', label: 'AI Analysis Complete', time: '2026-04-07 08:11 AM', done: true },
            { step: 'approved', label: 'Pending Approval', time: null, done: false },
            { step: 'pickup_scheduled', label: 'Awaiting Schedule', time: null, done: false },
            { step: 'in_transit', label: 'In Transit', time: null, done: false },
            { step: 'completed', label: 'Completed & Paid', time: null, done: false },
        ],
    },
];

const STATUS_CONFIG = {
    submitted: { label: 'Submitted', color: 'bg-blue-500', text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: MdPendingActions },
    reviewed: { label: 'Under Review', color: 'bg-yellow-500', text: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: MdPendingActions },
    PENDING_RECIEVER: { label: 'Finding Receiver', color: 'bg-cyan-500', text: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', icon: MdPendingActions },
    OFFERED: { label: 'Offer Sent', color: 'bg-indigo-500', text: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', icon: IoTimeOutline },
    ACCEPTED: { label: 'Accepted', color: 'bg-emerald-500', text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: IoCheckmarkCircle },
    EXPIRED: { label: 'Offer Expired', color: 'bg-orange-500', text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: IoTimeOutline },
    FALLBACK: { label: 'Routed to Facility', color: 'bg-gray-500', text: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20', icon: MdLocalShipping },
    approved: { label: 'Approved', color: 'bg-emerald-500', text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: IoCheckmarkCircle },
    PENDING_PICKUP: { label: 'Courier Pickup', color: 'bg-purple-500', text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: HiOutlineTruck },
    in_transit: { label: 'In Transit', color: 'bg-orange-500', text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: MdLocalShipping },
    completed: { label: 'Completed', color: 'bg-[#08CB00]', text: 'text-[#08CB00]', bg: 'bg-[#08CB00]/10', border: 'border-[#08CB00]/20', icon: MdDoneAll },
    cancelled: { label: 'Cancelled', color: 'bg-red-500', text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: MdOutlineCancel },
};

// Notifications loaded from server; empty initial state
const DUMMY_NOTIFICATIONS = [];

function formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function timeAgo(dateStr) {
    const now = new Date();
    const then = new Date(dateStr);
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHrs > 0) return `${diffHrs}h ago`;
    return `${diffMins}m ago`;
}

export default function TrackingContainer() {
    const searchParams = useSearchParams();
    const [mainTab, setMainTab] = useState('submissions'); // 'submissions' or 'collectors'

    useEffect(() => {
        if (searchParams && searchParams.get('tab') === 'collectors') {
            setMainTab('collectors');
        }
    }, [searchParams]);

    const [expandedId, setExpandedId] = useState(null);
    const [filter, setFilter] = useState('all');
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState(DUMMY_NOTIFICATIONS);
    const [submissions, setSubmissions] = useState([]);
    const [stats, setStats] = useState({ total_submissions: 0, active_count: 0, total_earned: 0 });
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchSubmissions();
        setRefreshing(false);
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    const markNotificationsRead = async (notificationIds = null) => {
        try {
            const body = new FormData();
            if (Array.isArray(notificationIds) && notificationIds.length > 0) {
                notificationIds.forEach(id => body.append('notification_ids', String(id)));
            }

            const res = await fetch('http://127.0.0.1:8000/e-waste-submission/submissions/notifications/mark-read', {
                method: 'POST',
                credentials: 'include',
                body,
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({ error: 'Request failed' }));
                console.error('Failed to mark notifications read', err);
                return false;
            }

            const result = await res.json().catch(() => ({ success: true }));

            // Update local notification state to reflect read status
            if (notificationIds && notificationIds.length > 0) {
                setNotifications(prev => prev.map(n => notificationIds.includes(n.id) ? { ...n, read: true } : n));
            } else {
                setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            }

            return result;
        } catch (err) {
            console.error('Error marking notifications read', err);
            return false;
        }
    };

    const markAllRead = () => {
        // mark all on server then update local state
        markNotificationsRead();
    };

    const fetchSubmissions = async ({ filterParam = filter, pageParam = page, pageSizeParam = pageSize } = {}) => {
        try {
            const q = new URLSearchParams({ filter: filterParam, page: String(pageParam), page_size: String(pageSizeParam) });
            const res = await fetch(`http://127.0.0.1:8000/e-waste-submission/submissions/tracking?${q.toString()}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!res.ok) {
                console.error('Failed to fetch submissions tracking', res.status);
                return;
            }

            const data = await res.json();
            setSubmissions(data.submissions || []);
            setStats(data.stats || { total_submissions: 0, active_count: 0, total_earned: 0 });
        } catch (err) {
            console.error('Error fetching submissions tracking', err);
        }
    };

    // Load notifications from server
    const fetchNotifications = async ({ pageParam = 1, pageSizeParam = 20 } = {}) => {
        try {
            const q = new URLSearchParams({ page: String(pageParam), page_size: String(pageSizeParam) });
            const res = await fetch(`http://127.0.0.1:8000/e-waste-submission/submissions/notifications?${q.toString()}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!res.ok) {
                console.error('Failed to fetch notifications', res.status);
                return;
            }

            const data = await res.json();
            setNotifications(data.notifications || []);
        } catch (err) {
            console.error('Error fetching notifications', err);
        }
    };

    useEffect(() => {
        fetchSubmissions();
    }, [filter, page, pageSize]);

    useEffect(() => {
        // fetch notifications on component mount
        fetchNotifications();
    }, []);

    const updateSubmissionStatus = async (submitId, newStatus) => {
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
                throw new Error(err.error || 'Failed to update status');
            }

            // Refresh submissions to get updated timeline & status
            await fetchSubmissions();
            return true;
        } catch (err) {
            console.error('Error updating submission status', err);
            return false;
        }
    };

    const filters = [
        { key: 'all', label: 'All' },
        { key: 'active', label: 'Active' },
        { key: 'completed', label: 'Completed' },
    ];

    const dataSource = submissions; // use server-provided submissions only

    const filteredSubmissions = dataSource
        .filter((s) => {
            if (filter === 'active') return s.status !== 'completed' && s.status !== 'cancelled';
            if (filter === 'completed') return s.status === 'completed';
            return true;
        })
        .filter((s) => {
            if (!searchQuery.trim()) return true;
            const q = searchQuery.toLowerCase();
            return (
                s.brand_n_model.toLowerCase().includes(q) ||
                s.category.toLowerCase().includes(q) ||
                s.detection_id.toLowerCase().includes(q) ||
                String(s.submit_id).includes(q) ||
                s.submission_type.toLowerCase().includes(q)
            );
        })
        .sort((a, b) => {
            if (sortBy === 'newest') return new Date(b.created_at) - new Date(a.created_at);
            if (sortBy === 'oldest') return new Date(a.created_at) - new Date(b.created_at);
            if (sortBy === 'value_high') return b.estimated_payout - a.estimated_payout;
            if (sortBy === 'value_low') return a.estimated_payout - b.estimated_payout;
            if (sortBy === 'status') {
                const order = ['submitted', 'reviewed', 'PENDING_RECIEVER', 'OFFERED', 'ACCEPTED', 'pickup_scheduled', 'in_transit', 'completed', 'EXPIRED', 'FALLBACK', 'cancelled'];
                return order.indexOf(a.status) - order.indexOf(b.status);
            }
            return 0;
        });

    // Recent activity: take the 5 most recent notifications for the feed
    const recentActivity = [...notifications].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);

    const activeCount = (dataSource || []).filter(s => s.status !== 'completed' && s.status !== 'cancelled').length;
    const pendingAction = (dataSource || []).filter(s => s.status === 'reviewed' || s.status === 'submitted').length;
    const nextPickupSub = dataSource
        ? dataSource.filter(s => s.preferred_date && s.status !== 'completed' && s.status !== 'cancelled')
        .sort((a, b) => new Date(a.preferred_date) - new Date(b.preferred_date))[0]
        : null;

    return (
        <div className="lg:col-span-12 space-y-8 relative">

            {/* Main Tabs */}
            <div className="flex items-center gap-1 p-1 bg-white/5 border border-white/10 rounded-2xl w-fit">
                <button
                    onClick={() => setMainTab('submissions')}
                    className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                        mainTab === 'submissions'
                            ? 'bg-[#08CB00] text-black'
                            : 'text-white/40 hover:text-white/60'
                    }`}
                >
                    My Submissions
                </button>
                <button
                    onClick={() => setMainTab('collectors')}
                    className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                        mainTab === 'collectors'
                            ? 'bg-[#08CB00] text-black'
                            : 'text-white/40 hover:text-white/60'
                    }`}
                >
                    Collectors
                </button>
            </div>

            {/* Collectors Tab */}
            {mainTab === 'collectors' && <CollectorView />}

            {/* Submissions Tab */}
            {mainTab === 'submissions' && (
            <>
            {/* Notification Panel Overlay */}
            {showNotifications && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                    <div className="fixed right-6 top-24 w-[400px] max-h-[80vh] bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 z-50 flex flex-col overflow-hidden">
                        {/* Panel Header */}
                        <div className="flex items-center justify-between p-5 border-b border-white/5">
                            <div className="flex items-center gap-2">
                                <IoNotificationsOutline className="text-[#08CB00]" size={18} />
                                <h3 className="text-sm font-bold text-white">Notifications</h3>
                                {unreadCount > 0 && (
                                    <span className="text-[8px] bg-[#08CB00] text-black px-1.5 py-0.5 rounded-full font-bold">{unreadCount}</span>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                {unreadCount > 0 && (
                                    <button onClick={markAllRead} className="text-[9px] text-[#08CB00] font-bold uppercase tracking-wider hover:underline">
                                        Mark all read
                                    </button>
                                )}
                                <button onClick={() => setShowNotifications(false)} className="text-white/30 hover:text-white transition-colors">
                                    <IoClose size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Notification List */}
                        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
                            {notifications.map((notif) => {
                                const toStatus = STATUS_CONFIG[notif.to] || STATUS_CONFIG.submitted;
                                const ToIcon = toStatus.icon;
                                return (
                                    <div
                                        key={notif.id}
                                        className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${
                                            !notif.read ? 'bg-white/[0.02]' : ''
                                        }`}
                                        onClick={() => {
                                            setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
                                            setShowNotifications(false);
                                            setExpandedId(notif.submit_id);
                                        }}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`w-8 h-8 rounded-lg ${toStatus.bg} ${toStatus.border} border flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                                <ToIcon className={toStatus.text} size={16} />
                                            </div>
                                            <div className="min-w-0 flex-1 space-y-1">
                                                <div className="flex items-center justify-between gap-2">
                                                    <p className="text-xs font-bold text-white truncate">{notif.device}</p>
                                                    {!notif.read && (
                                                        <div className="w-2 h-2 rounded-full bg-[#08CB00] flex-shrink-0" />
                                                    )}
                                                </div>
                                                <p className="text-[10px] text-white/50 leading-relaxed">{notif.message}</p>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase ${toStatus.bg} ${toStatus.text}`}>
                                                        {toStatus.label}
                                                    </span>
                                                    <span className="text-[9px] text-white/20">{timeAgo(notif.time)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {notifications.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-12 space-y-2">
                                    <IoNotificationsOutline className="text-white/10" size={28} />
                                    <p className="text-xs text-white/20">No notifications yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* Header Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Total</p>
                    <p className="text-3xl font-black text-white">{dataSource.length}</p>
                    <p className="text-[9px] text-white/20">submissions</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Active</p>
                    <p className="text-3xl font-black text-[#08CB00]">{activeCount}</p>
                    <p className="text-[9px] text-white/20">in progress</p>
                </div>
                <div className={`rounded-2xl p-5 space-y-2 ${pendingAction > 0 ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-white/5 border border-white/10'}`}>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${pendingAction > 0 ? 'text-yellow-400/60' : 'text-white/30'}`}>Needs Attention</p>
                    <p className={`text-3xl font-black ${pendingAction > 0 ? 'text-yellow-400' : 'text-white/20'}`}>{pendingAction}</p>
                    <p className={`text-[9px] ${pendingAction > 0 ? 'text-yellow-400/40' : 'text-white/20'}`}>awaiting review</p>
                </div>
                <div className={`rounded-2xl p-5 space-y-2 ${nextPickupSub ? 'bg-[#08CB00] text-black' : 'bg-white/5 border border-white/10'}`}>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${nextPickupSub ? 'text-black/50' : 'text-white/30'}`}>Next Pickup</p>
                    {nextPickupSub ? (
                        <>
                            <p className="text-lg font-black">{formatDate(nextPickupSub.preferred_date)}</p>
                            <p className="text-[9px] text-black/50 truncate">{nextPickupSub.brand_n_model}</p>
                        </>
                    ) : (
                        <>
                            <p className="text-lg font-black text-white/20">—</p>
                            <p className="text-[9px] text-white/20">none scheduled</p>
                        </>
                    )}
                </div>
            </div>

            {/* Recent Activity Feed */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/30">Recent Activity</h3>
                    <button onClick={handleRefresh} disabled={refreshing}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-white/30 hover:text-white/60 disabled:opacity-40">
                        <IoRefreshOutline size={13} className={refreshing ? 'animate-spin' : ''} />
                        <span className="text-[9px] font-bold uppercase tracking-widest">Refresh</span>
                    </button>
                </div>
                <div className="flex gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-white/10 pb-1">
                    {recentActivity.length === 0 ? (
                        <div className="flex flex-col items-center justify-center w-full py-8 text-center">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-2">
                                <IoNotificationsOutline className="text-white/20" size={18} />
                            </div>
                            <p className="text-[11px] font-bold text-white/30">No recent activity</p>
                            <p className="text-[9px] text-white/20 mt-0.5">Notifications will appear here when submissions change status</p>
                        </div>
                    ) : (
                        recentActivity.map((activity) => {
                            const toStatus = STATUS_CONFIG[activity.to] || STATUS_CONFIG.submitted;
                            const ToIcon = toStatus.icon;
                            return (
                                <button
                                    key={activity.id}
                                    onClick={() => {
                                        setExpandedId(activity.submit_id);
                                    }}
                                    className="flex-shrink-0 w-56 bg-black rounded-xl border border-white/5 p-3 space-y-2 hover:border-white/15 transition-all text-left"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className={`w-6 h-6 rounded-md ${toStatus.bg} flex items-center justify-center`}>
                                            <ToIcon className={toStatus.text} size={12} />
                                        </div>
                                        <p className="text-[10px] font-bold text-white truncate flex-1">{activity.device}</p>
                                        <span className="text-[8px] text-white/15">{timeAgo(activity.time)}</span>
                                    </div>
                                    <p className="text-[9px] text-white/35 leading-relaxed line-clamp-2">{activity.message}</p>
                                    <span className={`inline-block text-[7px] px-1.5 py-0.5 rounded-full font-bold uppercase ${toStatus.bg} ${toStatus.text}`}>
                                        {toStatus.label}
                                    </span>
                                </button>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Filter Tabs + Search + Sort */}
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    {filters.map((f) => (
                        <button
                            key={f.key}
                            onClick={() => setFilter(f.key)}
                            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                                filter === f.key
                                    ? 'bg-white text-black'
                                    : 'bg-white/5 text-white/40 hover:bg-white/10 border border-white/5'
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                    <div className="flex-1" />
                    <p className="text-[10px] text-white/20 uppercase tracking-widest mr-3">
                        {filteredSubmissions.length} submission{filteredSubmissions.length !== 1 ? 's' : ''}
                    </p>
                    {/* Refresh button */}
                    <button onClick={handleRefresh} disabled={refreshing}
                        className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-white/50 disabled:opacity-40">
                        <IoRefreshOutline size={18} className={refreshing ? 'animate-spin' : ''} />
                    </button>
                    {/* Notification Bell */}
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all"
                    >
                        <IoNotificationsOutline className="text-white/50" size={18} />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#08CB00] rounded-full flex items-center justify-center text-[8px] font-black text-black">
                                {unreadCount}
                            </span>
                        )}
                    </button>
                </div>

                {/* Search & Sort Row */}
                <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                        <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                        <input
                            type="text"
                            placeholder="Search by device, ID, or category..."
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
                    <div className="relative">
                        <IoSwapVertical className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-white/5 border border-white/5 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white/60 outline-none focus:border-[#08CB00]/30 transition-all appearance-none cursor-pointer"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="value_high">Highest Value</option>
                            <option value="value_low">Lowest Value</option>
                            <option value="status">By Status</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Submission Cards */}
            <div className="space-y-4">
                {(!dataSource || dataSource.length === 0) ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                            <MdDevices className="text-white/20" size={36} />
                        </div>
                        <h3 className="text-xl font-black text-white">No submissions yet</h3>
                        <p className="text-sm text-white/30">Create your first submission to track progress here.</p>
                        <button
                            onClick={() => window.location.assign('/reguser/Submit')}
                            className="mt-4 px-6 py-3 bg-[#08CB00] text-black rounded-xl font-bold"
                        >
                            Create Submission
                        </button>
                    </div>
                ) : filteredSubmissions.map((sub) => {
                    const status = STATUS_CONFIG[sub.status] || STATUS_CONFIG.submitted;
                    const StatusIcon = status.icon;
                    const isExpanded = expandedId === sub.submit_id;
                    const currentStepIndex = sub.timeline.findIndex(t => !t.done);
                    const progress = currentStepIndex === -1 ? 100 : Math.round((currentStepIndex / sub.timeline.length) * 100);

                    return (
                        <div
                            key={sub.submit_id}
                            className={`bg-white/5 border rounded-2xl overflow-hidden transition-all ${
                                isExpanded ? 'border-white/20' : 'border-white/5 hover:border-white/10'
                            }`}
                        >
                            {/* Card Header */}
                            <button
                                onClick={() => setExpandedId(isExpanded ? null : sub.submit_id)}
                                className="w-full p-6 text-left"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    {/* Left: device info */}
                                    <div className="flex items-start gap-4 min-w-0 flex-1">
                                        <div className={`w-12 h-12 rounded-xl ${status.bg} ${status.border} border flex items-center justify-center flex-shrink-0`}>
                                            <MdDevices className={status.text} size={22} />
                                        </div>
                                        <div className="min-w-0 space-y-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="text-sm font-bold text-white truncate">{sub.brand_n_model}</h3>
                                                <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase ${status.bg} ${status.text} ${status.border} border`}>
                                                    {status.label}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 text-[10px] text-white/30">
                                                <span className="capitalize">{sub.category}</span>
                                                <span>•</span>
                                                <span>{sub.submission_type}</span>
                                                <span>•</span>
                                                <span>{timeAgo(sub.created_at)}</span>
                                            </div>
                                            {/* Progress bar */}
                                            <div className="flex items-center gap-3 pt-1">
                                                <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all ${status.color}`}
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                                <span className="text-[9px] text-white/20 font-bold">{progress}%</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: payout + chevron */}
                                    <div className="flex items-center gap-4 flex-shrink-0">
                                        <div className="text-right">
                                            <p className="text-lg font-black text-white">${sub.estimated_payout.toFixed(2)}</p>
                                            <p className="text-[9px] text-white/20 uppercase">{sub.currency}</p>
                                        </div>
                                        {isExpanded ? (
                                            <IoChevronUp className="text-white/30" size={18} />
                                        ) : (
                                            <IoChevronDown className="text-white/30" size={18} />
                                        )}
                                    </div>
                                </div>
                            </button>

                            {/* Expanded Details */}
                            {isExpanded && (
                                <div className="px-6 pb-6 space-y-6 border-t border-white/5">

                                    {/* Info Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
                                        <div className="bg-black rounded-xl p-3 border border-white/5">
                                            <p className="text-[9px] text-white/30 uppercase tracking-widest font-bold">Submit ID</p>
                                            <p className="text-xs text-white font-bold mt-1">#{sub.submit_id}</p>
                                        </div>
                                        <div className="bg-black rounded-xl p-3 border border-white/5">
                                            <p className="text-[9px] text-white/30 uppercase tracking-widest font-bold">Detection</p>
                                            <p className="text-xs text-white font-mono mt-1">{sub.detection_id}</p>
                                        </div>
                                        <div className="bg-black rounded-xl p-3 border border-white/5">
                                            <p className="text-[9px] text-white/30 uppercase tracking-widest font-bold">Condition</p>
                                            <p className="text-xs text-white font-bold mt-1">{sub.device_state}</p>
                                        </div>
                                        <div className="bg-black rounded-xl p-3 border border-white/5">
                                            <p className="text-[9px] text-white/30 uppercase tracking-widest font-bold">Pickup Date</p>
                                            <p className="text-xs text-white font-bold mt-1">{formatDate(sub.preferred_date)}</p>
                                        </div>
                                    </div>

                                    {/* Timeline */}
                                    <div className="space-y-2">
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/30">Progress Timeline</h4>
                                        <div className="space-y-0">
                                            {sub.timeline.map((step, i) => {
                                                const isLast = i === sub.timeline.length - 1;
                                                const isCurrent = !step.done && (i === 0 || sub.timeline[i - 1].done);
                                                return (
                                                    <div key={step.step} className="flex items-start gap-3">
                                                        {/* Dot + Line */}
                                                        <div className="flex flex-col items-center">
                                                            <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                                                                step.done
                                                                    ? 'bg-[#08CB00]'
                                                                    : isCurrent
                                                                        ? 'bg-white border-2 border-[#08CB00] animate-pulse'
                                                                        : 'bg-white/10'
                                                            }`} />
                                                            {!isLast && (
                                                                <div className={`w-0.5 h-8 ${step.done ? 'bg-[#08CB00]/30' : 'bg-white/5'}`} />
                                                            )}
                                                        </div>
                                                        {/* Label + Time */}
                                                        <div className={`-mt-0.5 ${!isLast ? 'pb-2' : ''}`}>
                                                            <p className={`text-xs font-bold ${
                                                                step.done ? 'text-white' : isCurrent ? 'text-[#08CB00]' : 'text-white/20'
                                                            }`}>
                                                                {step.label}
                                                            </p>
                                                            {step.time && (
                                                                <p className="text-[9px] text-white/30">{step.time}</p>
                                                            )}
                                                            {isCurrent && !step.time && (
                                                                <p className="text-[9px] text-[#08CB00]/60 italic">Waiting...</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* IN TRANSIT: persistent QR code section */}
                                    {sub.status === 'in_transit' && (
                                        <InTransitQRSection submission={sub} />
                                    )}

                                    {/* ACCEPTED + RECYCLER_PICKUP: user confirms drop-off */}
                                    {sub.status === 'ACCEPTED' && sub.submission_type === 'RECYCLER_PICKUP' && (
                                        <AcceptedActionPanel
                                            submission={sub}
                                            onStatusChange={(id, newStatus) => {
                                                setSubmissions(prev => prev.map(s =>
                                                    s.submit_id === id ? { ...s, status: newStatus } : s
                                                ));
                                            }}
                                        />
                                    )}

                                    {/* ACCEPTED + TECHNICIAN_PICKUP: user sees technician details and approves or cancels */}
                                    {/* Hide once technician_side_status is ASSIGNED+ — means user already responded */}
                                    {sub.status === 'ACCEPTED' && sub.submission_type === 'TECHNICIAN_PICKUP' && !['ASSIGNED', 'in_transit', 'completed', 'DIAGNOSIS'].includes(sub.technician.technician_side_status) && (
                                        <TechnicianAcceptedPanel
                                            submission={sub}
                                            onStatusChange={(id, newStatus) => {
                                                setSubmissions(prev => prev.map(s =>
                                                    s.submit_id === id ? { ...s, status: newStatus } : s
                                                ));
                                            }}
                                        />
                                    )}

                                    {/* Actions */}
                                    <div className="flex items-center gap-3 pt-2">
                                        {sub.status !== 'completed' && sub.status !== 'cancelled' && sub.status !== 'ACCEPTED' && (
                                            <>
                                                <button className="px-5 py-2.5 rounded-xl bg-[#08CB00] text-black text-[10px] font-bold uppercase tracking-wider hover:scale-105 transition-all flex items-center gap-2">
                                                    <IoCallOutline size={14} />
                                                    Contact Support
                                                </button>
                                                <button className="px-5 py-2.5 rounded-xl border border-white/10 text-white/40 text-[10px] font-bold uppercase tracking-wider hover:bg-white/5 transition-all">
                                                    Cancel Submission
                                                </button>
                                            </>
                                        )}
                                        {sub.status === 'completed' && (
                                            <button className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 text-[10px] font-bold uppercase tracking-wider hover:bg-white/10 transition-all">
                                                View Receipt
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}

                {filteredSubmissions.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                            <MdDevices className="text-white/20" size={28} />
                        </div>
                        <p className="text-sm text-white/30">No submissions found</p>
                        <p className="text-[10px] text-white/15">Try adjusting your filter or submit a new device</p>
                    </div>
                )}
            </div>
            </>
            )}
        </div>
    );
}
