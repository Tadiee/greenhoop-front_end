"use client"
import React, { useState } from 'react';
import { 
  Package,
  Building2,
  Truck,
  Clock,
  MapPin,
  MessageCircle,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  Filter,
  Search,
  ArrowUpRight,
  Phone,
  Calendar,
  User,
  DollarSign,
  Shield,
  Navigation
} from 'lucide-react';
import { CATEGORY_ICONS } from './constants';

// Dummy accepted submissions data
const DUMMY_ACCEPTED_SUBMISSIONS = [
  {
    id: 1,
    submit_id: 101,
    category: 'Laptop',
    brand_n_model: 'Dell Latitude 5520',
    device_state: 'Scrap',
    estimated_weight: 2.1,
    estimated_cost: 45.00,
    status: 'AWAITING_USER_DROP_OFF',
    delivery_method: 'DROPOFF',
    drop_off_site: {
      name: 'GreenHoop Main Hub',
      address: '123 Industrial Road, Msasa, Harare',
      contact: '+263 242 123 456'
    },
    submitted_by: {
      name: 'John Mutasa',
      phone: '+263 77 123 4567',
      user_id: 501
    },
    accepted_at: '2026-04-13T10:30:00Z',
    expected_drop_off: '2026-04-15T14:30:00Z',
    payment_status: 'PAID',
    payment_method: 'WALLET',
    tracking: [
      { status: 'ACCEPTED', timestamp: '2026-04-13T10:30:00Z', note: 'Submission accepted' },
      { status: 'NOTIFIED_USER', timestamp: '2026-04-13T10:31:00Z', note: 'User notified of drop-off location' }
    ],
    communications: [
      { from: 'USER', message: 'I will drop it off tomorrow afternoon', timestamp: '2026-04-13T11:00:00Z', read: true }
    ]
  },
  {
    id: 2,
    submit_id: 103,
    category: 'Battery',
    brand_n_model: 'Li-Ion Pack 48V',
    device_state: 'Scrap',
    estimated_weight: 12.5,
    estimated_cost: 85.00,
    status: 'COURIER_ASSIGNED',
    delivery_method: 'COURIER',
    courier: {
      company_name: 'SwiftEco Logistics',
      contact_person: 'Tinashe M.',
      phone: '+263 77 123 4567',
      eta_minutes: 35,
      vehicle_type: 'Refrigerated Van'
    },
    submitted_by: {
      name: 'Sarah Ndlovu',
      phone: '+263 77 987 6543',
      user_id: 502
    },
    accepted_at: '2026-04-13T09:15:00Z',
    payment_status: 'PAID',
    payment_method: 'CARD',
    tracking: [
      { status: 'ACCEPTED', timestamp: '2026-04-13T09:15:00Z', note: 'Submission accepted' },
      { status: 'COURIER_DISPATCHED', timestamp: '2026-04-13T09:20:00Z', note: 'SwiftEco Logistics assigned' },
      { status: 'COURIER_EN_ROUTE', timestamp: '2026-04-13T09:45:00Z', note: 'Courier en route to pickup location' }
    ],
    communications: [
      { from: 'COURIER', message: 'I am 10 minutes away from the pickup location', timestamp: '2026-04-13T09:40:00Z', read: false }
    ]
  },
  {
    id: 3,
    submit_id: 106,
    category: 'Desktop PC',
    brand_n_model: 'HP Pavilion Gaming',
    device_state: 'Damaged',
    estimated_weight: 8.5,
    estimated_cost: 55.00,
    status: 'DROPPED_OFF',
    delivery_method: 'DROPOFF',
    drop_off_site: {
      name: 'Avondale Tech Hub',
      address: 'King George Road, Avondale, Harare',
      contact: '+263 242 901 234'
    },
    submitted_by: {
      name: 'Michael Chiwara',
      phone: '+263 77 456 7890',
      user_id: 503
    },
    accepted_at: '2026-04-12T14:00:00Z',
    dropped_off_at: '2026-04-13T08:30:00Z',
    payment_status: 'PAID',
    payment_method: 'BANK',
    tracking: [
      { status: 'ACCEPTED', timestamp: '2026-04-12T14:00:00Z', note: 'Submission accepted' },
      { status: 'NOTIFIED_USER', timestamp: '2026-04-12T14:01:00Z', note: 'User notified' },
      { status: 'DROPPED_OFF', timestamp: '2026-04-13T08:30:00Z', note: 'Item dropped off at Avondale Tech Hub' },
      { status: 'RECEIVED', timestamp: '2026-04-13T09:00:00Z', note: 'Received and verified' }
    ],
    communications: []
  },
  {
    id: 4,
    submit_id: 102,
    category: 'Mobile Phone',
    brand_n_model: 'Samsung Galaxy S21',
    device_state: 'Damaged',
    estimated_weight: 0.18,
    estimated_cost: 12.50,
    status: 'DECLINED',
    delivery_method: null,
    submitted_by: {
      name: 'Patience Moyo',
      phone: '+263 77 234 5678',
      user_id: 504
    },
    declined_at: '2026-04-13T08:00:00Z',
    decline_reason: 'Price too low',
    payment_status: 'N/A',
    tracking: [
      { status: 'DECLINED', timestamp: '2026-04-13T08:00:00Z', note: 'Offer declined' }
    ],
    communications: []
  }
];

const STATUS_CONFIG = {
  'AWAITING_USER_DROP_OFF': { label: 'Awaiting Drop-off', color: 'text-yellow-500', bg: 'bg-yellow-500/10', icon: Clock },
  'COURIER_ASSIGNED': { label: 'Courier Assigned', color: 'text-blue-400', bg: 'bg-blue-500/10', icon: Truck },
  'COURIER_EN_ROUTE': { label: 'Courier En Route', color: 'text-blue-400', bg: 'bg-blue-500/10', icon: Navigation },
  'COURIER_COLLECTED': { label: 'Collected', color: 'text-blue-400', bg: 'bg-blue-500/10', icon: CheckCircle2 },
  'DROPPED_OFF': { label: 'Dropped Off', color: 'text-[#08CB00]', bg: 'bg-[#08CB00]/10', icon: Building2 },
  'RECEIVED': { label: 'Received', color: 'text-[#08CB00]', bg: 'bg-[#08CB00]/10', icon: CheckCircle2 },
  'PROCESSING': { label: 'Processing', color: 'text-[#08CB00]', bg: 'bg-[#08CB00]/10', icon: Clock },
  'DECLINED': { label: 'Declined', color: 'text-red-400', bg: 'bg-red-500/10', icon: XCircle },
  'CANCELLED': { label: 'Cancelled', color: 'text-red-400', bg: 'bg-red-500/10', icon: XCircle }
};

const AcceptedSubmissions = () => {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [activeTab, setActiveTab] = useState('ACTIVE'); // ACTIVE, COMPLETED, DECLINED

  const getStatusBadge = (status) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG['AWAITING_USER_DROP_OFF'];
    const Icon = config.icon;
    return (
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${config.bg}`}>
        <Icon size={14} className={config.color} />
        <span className={`text-[10px] font-bold ${config.color}`}>{config.label}</span>
      </div>
    );
  };

  const filteredSubmissions = DUMMY_ACCEPTED_SUBMISSIONS.filter(sub => {
    const matchesSearch = sub.brand_n_model.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sub.submit_id.toString().includes(searchQuery);
    const matchesTab = activeTab === 'ALL' ||
                      (activeTab === 'ACTIVE' && !['DECLINED', 'CANCELLED', 'RECEIVED'].includes(sub.status)) ||
                      (activeTab === 'COMPLETED' && ['RECEIVED', 'DROPPED_OFF'].includes(sub.status)) ||
                      (activeTab === 'DECLINED' && ['DECLINED', 'CANCELLED'].includes(sub.status));
    return matchesSearch && matchesTab;
  });

  const SubmissionDetail = ({ submission, onClose }) => {
    const CategoryIcon = CATEGORY_ICONS[submission.category] || Package;
    const hasUnreadMessages = submission.communications.some(c => !c.read);

    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose}></div>
        <div className="relative bg-[#0a0a0a] border border-white/10 rounded-[32px] p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-thin">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/40 hover:text-white transition-colors"
          >
            <XCircle size={24} />
          </button>

          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-[#08CB00]/10 rounded-2xl">
              <CategoryIcon size={24} className="text-[#08CB00]" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-black text-white">{submission.brand_n_model}</h3>
              <p className="text-xs text-white/40">#{submission.submit_id} · {submission.category}</p>
            </div>
            {getStatusBadge(submission.status)}
          </div>

          {/* Delivery Info */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 mb-4">
            <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-3">Delivery Information</h4>
            {submission.delivery_method === 'DROPOFF' && submission.drop_off_site && (
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Building2 size={16} className="text-[#08CB00]" />
                  <div>
                    <p className="text-sm font-bold text-white">{submission.drop_off_site.name}</p>
                    <p className="text-xs text-white/40">{submission.drop_off_site.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-white/40" />
                  <p className="text-xs text-white/60">{submission.drop_off_site.contact}</p>
                </div>
                {submission.expected_drop_off && (
                  <div className="flex items-center gap-3">
                    <Calendar size={16} className="text-white/40" />
                    <p className="text-xs text-white/60">Expected: {new Date(submission.expected_drop_off).toLocaleString()}</p>
                  </div>
                )}
              </div>
            )}
            {submission.delivery_method === 'COURIER' && submission.courier && (
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Truck size={16} className="text-blue-400" />
                  <div>
                    <p className="text-sm font-bold text-white">{submission.courier.company_name}</p>
                    <p className="text-xs text-white/40">{submission.courier.contact_person}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-white/40" />
                  <p className="text-xs text-white/60">{submission.courier.phone}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-white/40" />
                  <p className="text-xs text-white/60">ETA: {submission.courier.eta_minutes} minutes</p>
                </div>
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 mb-4">
            <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-3">Submitted By</h4>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <User size={20} className="text-white/60" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white">{submission.submitted_by.name}</p>
                <p className="text-xs text-white/40">User #{submission.submitted_by.user_id}</p>
              </div>
              <button className="p-2 bg-[#08CB00]/10 rounded-lg text-[#08CB00] hover:bg-[#08CB00]/20">
                <Phone size={18} />
              </button>
              <button className="p-2 bg-white/10 rounded-lg text-white/60 hover:bg-white/20 relative">
                <MessageCircle size={18} />
                {hasUnreadMessages && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                )}
              </button>
            </div>
          </div>

          {/* Tracking Timeline */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 mb-4">
            <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-4">Tracking Timeline</h4>
            <div className="space-y-4">
              {submission.tracking.map((track, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 ${index === 0 ? 'bg-[#08CB00]' : 'bg-white/30'}`}></div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-white">{track.status.replace(/_/g, ' ')}</p>
                    <p className="text-[10px] text-white/40">{track.note}</p>
                    <p className="text-[9px] text-white/30">{new Date(track.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 mb-4">
            <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-3">Payment</h4>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <DollarSign size={16} className="text-[#08CB00]" />
                <span className="text-sm text-white/60">Amount</span>
              </div>
              <span className="text-xl font-black text-[#08CB00]">${submission.estimated_cost}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-white/40" />
                <span className="text-sm text-white/60">Method</span>
              </div>
              <span className="text-sm font-bold text-white">{submission.payment_method}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-white/40" />
                <span className="text-sm text-white/60">Status</span>
              </div>
              <span className={`text-sm font-bold ${submission.payment_status === 'PAID' ? 'text-[#08CB00]' : 'text-yellow-500'}`}>
                {submission.payment_status}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-white">My Submissions</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/40">{filteredSubmissions.length} items</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-4">
          {['ACTIVE', 'COMPLETED', 'DECLINED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                activeTab === tab 
                  ? 'bg-[#08CB00] text-black' 
                  : 'bg-white/5 text-white/40 hover:bg-white/10'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search by model or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#08CB00]/50"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-2">
        {filteredSubmissions.map((submission) => {
          const CategoryIcon = CATEGORY_ICONS[submission.category] || Package;
          const hasUnread = submission.communications.some(c => !c.read);

          return (
            <div
              key={submission.id}
              onClick={() => setSelectedSubmission(submission)}
              className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-white/20 transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-black/40 rounded-xl flex items-center justify-center shrink-0">
                  <CategoryIcon size={18} className="text-white/40" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-bold text-white truncate">{submission.brand_n_model}</p>
                    {hasUnread && (
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                  </div>
                  <p className="text-[9px] text-white/30 mb-2">#{submission.submit_id} · {submission.category}</p>
                  
                  <div className="flex items-center gap-3">
                    {getStatusBadge(submission.status)}
                    {submission.delivery_method === 'DROPOFF' ? (
                      <span className="flex items-center gap-1 text-[9px] text-white/40">
                        <Building2 size={10} />
                        Drop-off
                      </span>
                    ) : submission.delivery_method === 'COURIER' ? (
                      <span className="flex items-center gap-1 text-[9px] text-blue-400">
                        <Truck size={10} />
                        Courier
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-[#08CB00]">${submission.estimated_cost}</p>
                  <ChevronRight size={16} className="text-white/20 group-hover:text-white/40 ml-auto" />
                </div>
              </div>
            </div>
          );
        })}

        {filteredSubmissions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Package size={32} className="text-white/10 mb-3" />
            <p className="text-xs text-white/30 font-bold">No submissions found</p>
            <p className="text-[10px] text-white/20 mt-1">Try adjusting your filters</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedSubmission && (
        <SubmissionDetail 
          submission={selectedSubmission} 
          onClose={() => setSelectedSubmission(null)} 
        />
      )}
    </div>
  );
};

export default AcceptedSubmissions;
