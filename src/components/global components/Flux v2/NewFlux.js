"use client"
import React, { useState } from 'react';
import { 
  Eye, Heart, Gavel, 
  Edit3, Trash2, TrendingUp, Image as ImageIcon,
  X, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { poppins } from '@/fonts/fonts';
import ViewBidsModal from './ViewBidsModal';

const STATUS_STYLES = {
  ACTIVE: 'text-[#08CB00] bg-[#08CB00]/10 border-[#08CB00]/20',
  SOLD: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  PENDING: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
  EXPIRED: 'text-white/40 bg-white/5 border-white/10',
  CANCELLED: 'text-red-500 bg-red-500/10 border-red-500/20',
  FLAGGED: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
};

const CONDITION_LABELS = {
  NEW: 'New', LIKE_NEW: 'Like New', EXCELLENT: 'Excellent',
  VERY_GOOD: 'Very Good', GOOD: 'Good', ACCEPTABLE: 'Acceptable',
  POOR: 'Poor', FOR_PARTS: 'For Parts', SCRAP: 'Scrap',
};

const resolveUrl = (url) => url && (url.startsWith('http') ? url : `http://127.0.0.1:8000${url}`);

const NewFlux = ({ item }) => {
  const statusColor = STATUS_STYLES[item.status] || STATUS_STYLES.ACTIVE;
  const conditionLabel = CONDITION_LABELS[item.condition] || item.condition;
  const timeAgo = item.created_at ? new Date(item.created_at).toLocaleDateString() : '';

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [bidsModalOpen, setBidsModalOpen] = useState(false);
  const allImages = (item.images && item.images.length > 0) ? item.images : (item.thumbnail ? [item.thumbnail] : []);

  const openLightbox = (startIndex = 0) => {
    if (allImages.length === 0) return;
    setLightboxIndex(startIndex);
    setLightboxOpen(true);
  };

  return (
    <div className="group relative w-full">
      {/* --- Lightbox overlay --- */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md" onClick={() => setLightboxOpen(false)}>
          <button onClick={() => setLightboxOpen(false)} className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
            <X size={24} />
          </button>

          {allImages.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); setLightboxIndex((prev) => (prev - 1 + allImages.length) % allImages.length); }}
                className="absolute left-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
                <ChevronLeft size={28} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); setLightboxIndex((prev) => (prev + 1) % allImages.length); }}
                className="absolute right-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
                <ChevronRight size={28} />
              </button>
            </>
          )}

          <div className="max-w-[90vw] max-h-[85vh] flex flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
            <img src={resolveUrl(allImages[lightboxIndex])} alt={`${item.device_brand_model} - Image ${lightboxIndex + 1}`}
              className="max-h-[80vh] max-w-full object-contain rounded-2xl" />
            {allImages.length > 1 && (
              <p className="text-white/50 text-xs font-bold uppercase tracking-widest">{lightboxIndex + 1} / {allImages.length}</p>
            )}
          </div>
        </div>
      )}

      <div className="relative overflow-hidden rounded-[32px] bg-zinc-900/70 backdrop-blur-xl border border-white/10 p-6 transition-all duration-500 hover:border-[#08CB00]/50 hover:shadow-[0_0_30px_-10px_rgba(8,203,0,0.3)]">
        
        {/* Background accent gradient */}
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-[#08CB00]/5 blur-3xl transition-all duration-700 group-hover:bg-[#08CB00]/20"></div>

        {/* --- Thumbnail --- */}
        {item.thumbnail ? (
          <div className="relative z-10 mb-5 rounded-2xl overflow-hidden h-72 bg-black/40 cursor-pointer" onClick={() => openLightbox(0)}>
            <img src={resolveUrl(item.thumbnail)} alt={item.device_brand_model} className="w-full h-full object-cover" />
            {allImages.length > 1 && (
              <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 text-white/70 text-[10px] font-bold">
                <ImageIcon size={10} /> {allImages.length}
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
              <Eye size={28} className="text-white/70" />
            </div>
          </div>
        ) : (
          <div className="relative z-10 mb-5 rounded-2xl overflow-hidden h-40 bg-black/30 border border-white/5 flex items-center justify-center">
            <ImageIcon size={32} className="text-white/10" />
          </div>
        )}

        {/* --- Header --- */}
        <div className="relative z-10 flex justify-between items-start mb-5">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusColor}`}>
                {item.status}
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 text-white/50 bg-white/5">
                {conditionLabel}
              </span>
            </div>
            <h3 className={`text-xl font-black uppercase italic tracking-tight ${poppins.className} text-white leading-none mb-1 group-hover:text-[#08CB00] transition-colors truncate`}>
              {item.device_brand_model}
            </h3>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider">{timeAgo}</p>
          </div>
          <div className="text-right ml-4 shrink-0">
            <div className="text-3xl font-black tracking-tighter text-[#08CB00]">${item.listing_price}</div>
          </div>
        </div>

        {/* --- Stats Strip --- */}
        <div className="relative z-10 mb-6 p-4 rounded-2xl bg-black/40 border border-white/5 grid grid-cols-4 gap-3">
          <div className="flex flex-col items-center gap-1">
            <Eye size={14} className="text-white/30" />
            <span className="text-sm font-black text-white">{item.view_count}</span>
            <span className="text-[8px] font-bold text-white/40 uppercase tracking-wider">Views</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Heart size={14} className="text-white/30" />
            <span className="text-sm font-black text-white">{item.like_count}</span>
            <span className="text-[8px] font-bold text-white/40 uppercase tracking-wider">Likes</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Gavel size={14} className="text-white/30" />
            <span className="text-sm font-black text-white">{item.bid_count}</span>
            <span className="text-[8px] font-bold text-white/40 uppercase tracking-wider">Bids</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <TrendingUp size={14} className="text-[#08CB00]/50" />
            <span className="text-sm font-black text-[#08CB00]">{item.listing_score}</span>
            <span className="text-[8px] font-bold text-white/40 uppercase tracking-wider">Score</span>
          </div>
        </div>

        {/* --- Actions --- */}
        <div className="relative z-10 flex gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-accent-green py-3.5 text-xs font-black uppercase tracking-widest text-black transition-all hover:bg-[#08CB00]/90 hover:scale-[1.02] active:scale-95">
            <Edit3 size={16} /> Edit Details
          </button>
          {item.bid_count > 0 && (
            <button 
              onClick={() => setBidsModalOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-amber-400/10 border border-amber-400/20 py-3.5 text-xs font-black uppercase tracking-widest text-amber-400 transition-all hover:bg-amber-400/20 hover:scale-[1.02] active:scale-95"
            >
              <Gavel size={16} /> View Bids ({item.bid_count})
            </button>
          )}
          <button className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/40 transition-all hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-500">
            <Trash2 size={18} />
          </button>
        </div>

      </div>

      {/* Bids Modal */}
      <ViewBidsModal
        isOpen={bidsModalOpen}
        onClose={() => setBidsModalOpen(false)}
        listingId={item.listing_id}
        listingTitle={item.device_brand_model}
        listingType={item.listing_type}
      />
    </div>
  );
};
export default NewFlux;