
"use client"
import React from 'react';
import { 
  Filter, 
  Search, Building2, 
} from 'lucide-react';

export default function PartnerRevenueComp() {
    return (
        <>
            <div className="w-2/3 bg-white/[0.02] border border-white/5 rounded-[48px] p-8 flex flex-col overflow-hidden shadow-2xl group">
                <div className="flex justify-between items-center mb-6 shrink-0">
                <div className="space-y-1">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/60">Strategic Partner Revenue</h3>
                    <p className="text-[8px] font-bold text-[#08CB00] uppercase tracking-widest">3 Active Settlement Streams</p>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 bg-white/5 border border-white/10 rounded-xl text-white/20 hover:text-white transition-all"><Filter size={14}/></button>
                    <button className="p-2 bg-white/5 border border-white/10 rounded-xl text-white/20 hover:text-white transition-all"><Search size={14}/></button>
                </div>
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-thin pr-2 space-y-2">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-6 py-3 text-[9px] font-black uppercase tracking-widest text-white/20 border-b border-white/5">
                    <div className="col-span-5">Partner Facility / ID</div>
                    <div className="col-span-3">Inbound Volume</div>
                    <div className="col-span-4 text-right">Settlement Actions</div>
                </div>

                {/* Table Rows */}
                {[
                    { name: 'Mbare Central Yard', id: 'FAC-881', vol: '14.2', status: 'Verified' },
                    { name: 'Borrowdale Hub', id: 'FAC-204', vol: '8.4', status: 'Pending' },
                    { name: 'Mt Pleasant Yard', id: 'FAC-412', vol: '12.1', status: 'Verified' },
                ].map((customer, i) => (
                    <div key={i} className="grid grid-cols-12 gap-4 p-5 bg-black/40 border border-white/5 rounded-3xl items-center group/row hover:border-[#08CB00]/30 transition-all">
                    <div className="col-span-5 flex items-center gap-4">
                        <div className={`p-2.5 rounded-xl bg-white/5 text-white/30 group-hover/row:text-[#08CB00] transition-colors`}>
                        <Building2 size={16} />
                        </div>
                        <div>
                        <p className="text-[11px] font-black uppercase italic leading-none">{customer.name}</p>
                        <p className="text-[8px] font-mono text-white/20 mt-2 uppercase">{customer.id}</p>
                        </div>
                    </div>
                    <div className="col-span-3">
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black italic tracking-tighter">{customer.vol}</span>
                            <span className="text-[9px] font-black text-white/20 uppercase">Tons</span>
                        </div>
                    </div>
                    <div className="col-span-4 flex justify-end gap-3">
                        <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase hover:bg-white hover:text-black transition-all">Audit Logs</button>
                        <button className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${customer.status === 'Verified' ? 'bg-[#08CB00] text-black shadow-lg shadow-[#08CB00]/10' : 'bg-white/10 text-white/40'}`}>
                        {customer.status === 'Verified' ? 'Issue Payout' : 'Awaiting'}
                        </button>
                    </div>
                    </div>
                ))}
                </div>
            </div>
        </>
    );
}