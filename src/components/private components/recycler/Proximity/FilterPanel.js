"use client"
import React from 'react';
import { 
  Navigation,
  Filter,
  Zap,
  Weight,
  RefreshCw,
  MapPin,
  Package
} from 'lucide-react';
import { CATEGORY_ICONS, CATEGORIES, DEVICE_STATES } from './constants';

const FilterPanel = ({
  filteredSubmissions,
  selectedSubmission,
  filterRadius,
  setFilterRadius,
  filterCategory,
  setFilterCategory,
  filterDeviceState,
  setFilterDeviceState,
  filterMinWeight,
  setFilterMinWeight,
  filterMaxWeight,
  setFilterMaxWeight,
  filterNewOnly,
  setFilterNewOnly,
  onListClick,
  onResetFilters
}) => {
  return (
    <div className="w-80 bg-white/[0.02] border border-white/10 rounded-[32px] flex flex-col overflow-hidden">
      {/* Sidebar Header */}
      <div className="p-5 border-b border-white/10 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-[#08CB00]">Nearby Submissions</h2>
          <span className="text-[10px] font-bold text-white/40">{filteredSubmissions.length} found</span>
        </div>
        
        {/* Distance Filter */}
        <div className="flex items-center gap-2 mb-3">
          <Navigation size={12} className="text-white/30" />
          <select 
            value={filterRadius}
            onChange={(e) => setFilterRadius(Number(e.target.value))}
            className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-[10px] font-bold text-white/70 outline-none focus:border-[#08CB00]/50"
          >
            <option value={1}>Within 1 km</option>
            <option value={5}>Within 5 km</option>
            <option value={10}>Within 10 km</option>
            <option value={25}>Within 25 km</option>
            <option value={50}>Within 50 km</option>
          </select>
        </div>
        
        {/* Category Filter */}
        <div className="flex items-center gap-2 mb-3">
          <Filter size={12} className="text-white/30" />
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-[10px] font-bold text-white/70 outline-none focus:border-[#08CB00]/50"
          >
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        
        {/* Device State Filter */}
        <div className="flex items-center gap-2 mb-3">
          <Zap size={12} className="text-white/30" />
          <select 
            value={filterDeviceState}
            onChange={(e) => setFilterDeviceState(e.target.value)}
            className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-[10px] font-bold text-white/70 outline-none focus:border-[#08CB00]/50"
          >
            {DEVICE_STATES.map(state => <option key={state} value={state}>{state}</option>)}
          </select>
        </div>
        
        {/* Weight Range Filter */}
        <div className="flex items-center gap-2 mb-3">
          <Weight size={12} className="text-white/30" />
          <div className="flex items-center gap-2 flex-1">
            <input 
              type="number" 
              value={filterMinWeight}
              onChange={(e) => setFilterMinWeight(Number(e.target.value))}
              className="w-12 bg-black/40 border border-white/10 rounded-lg px-2 py-2 text-[10px] font-bold text-white/70 outline-none focus:border-[#08CB00]/50"
              min="0"
            />
            <span className="text-white/30 text-[10px]">-</span>
            <input 
              type="number" 
              value={filterMaxWeight}
              onChange={(e) => setFilterMaxWeight(Number(e.target.value))}
              className="w-12 bg-black/40 border border-white/10 rounded-lg px-2 py-2 text-[10px] font-bold text-white/70 outline-none focus:border-[#08CB00]/50"
              min="0"
            />
            <span className="text-white/30 text-[10px]">kg</span>
          </div>
        </div>
        
        {/* New Only Toggle */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="checkbox"
            checked={filterNewOnly}
            onChange={(e) => setFilterNewOnly(e.target.checked)}
            className="w-4 h-4 accent-[#08CB00] rounded border-white/20"
          />
          <span className="text-[10px] font-bold text-white/60">Show new submissions only</span>
        </label>
      </div>
      
      {/* Submissions List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-2">
        {filteredSubmissions.map((submission) => {
          const CategoryIcon = CATEGORY_ICONS[submission.category] || Package;
          const isSelected = selectedSubmission?.submit_id === submission.submit_id;
          
          return (
            <button
              key={submission.submit_id}
              onClick={() => onListClick(submission)}
              className={`w-full p-3 rounded-2xl border text-left transition-all ${
                isSelected 
                  ? 'bg-[#08CB00]/10 border-[#08CB00]/30' 
                  : 'bg-white/5 border-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl ${isSelected ? 'bg-[#08CB00]/20 text-[#08CB00]' : 'bg-black/40 text-white/40'}`}>
                  <CategoryIcon size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[11px] font-black uppercase truncate">{submission.brand_n_model}</p>
                    {submission.isNew && (
                      <span className="text-[8px] font-bold bg-[#08CB00] text-black px-1 py-0.5 rounded-full">NEW</span>
                    )}
                  </div>
                  <p className="text-[9px] text-white/30 mt-0.5">#{submission.submit_id} · {submission.category}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[9px] font-bold text-white/40">{submission.estimated_weight}kg</span>
                    <span className="text-[9px] font-bold text-[#08CB00]">{submission.distance}km away</span>
                    <span className="text-[9px] font-bold text-white/50">{submission.your_score}% match</span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
        
        {filteredSubmissions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 space-y-3">
            <MapPin size={28} className="text-white/15" />
            <p className="text-xs text-white/30 font-bold text-center">No submissions match filters</p>
          </div>
        )}
      </div>
      
      {/* Sidebar Footer */}
      <div className="p-3 border-t border-white/10 shrink-0">
        <button 
          onClick={onResetFilters}
          className="w-full py-3 bg-[#08CB00]/10 border border-[#08CB00]/20 rounded-xl text-[10px] font-black uppercase tracking-wider text-[#08CB00] flex items-center justify-center gap-2 hover:bg-[#08CB00]/20 transition-colors"
        >
          <RefreshCw size={12} />
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
