import { poppins } from '@/fonts/fonts';
import { Plus } from 'lucide-react';
import { PackageCheck } from 'lucide-react';

export default function PerfomanceTopContainer () {
    return (
        <>
            {/* --- 01. SELLER OVERVIEW --- */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 ">
            <div className="lg:col-span-8 bg-gradient-to-br from-[#08CB00]/10 to-transparent border border-white/5 rounded-[56px] p-12 relative overflow-hidden group">
                <div className="relative z-10 flex flex-col justify-between h-full space-y-12">
                <div className="flex justify-between items-start">
                    <div className="space-y-2">
                    <p className="text-[11px] font-black uppercase tracking-[0.5em] text-[#08CB00]">Marketplace Sales</p>
                    <h1 className="text-9xl font-black tracking-tighter leading-none">$655.<span>00</span></h1>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Active Offers</p>
                    <p className="text-2xl font-black text-[#08CB00]">04</p>
                    </div>
                </div>
                
                <div className="flex flex-wrap gap-4">
                    <button className="bg-[#08CB00] text-black px-12 py-5 rounded-3xl font-black uppercase text-[11px] tracking-widest hover:bg-white transition-all shadow-xl shadow-[#08CB00]/20 flex items-center gap-3">
                    Post New Item <Plus size={16} />
                    </button>
                    <button className="bg-white/5 border border-white/10 text-white px-10 py-5 rounded-3xl font-black uppercase text-[11px] tracking-widest hover:bg-white/10 transition-all flex items-center gap-3">
                    Store Settings
                    </button>
                </div>
                </div>
                <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#08CB00]/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="lg:col-span-4 bg-white rounded-[56px] p-10 text-black flex flex-col justify-between">
                <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Seller Rating</p>
                <h3 className={`text-4xl font-black italic tracking-tighter ${poppins.className}`}>TRUSTED MERCHANT</h3>
                <p className="text-xs font-bold bg-black/5 inline-block px-4 py-1.5 rounded-full mt-2 uppercase tracking-tighter">Verified in Harare</p>
                </div>
                
                <div className="bg-black/5 rounded-3xl p-6 border border-black/5 space-y-4">
                    <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-[#08CB00]">
                        <PackageCheck size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-black uppercase">Next Reward</p>
                        <p className="text-[10px] font-bold opacity-60">0% Commission Sales</p>
                    </div>
                    </div>
                </div>
            </div>
            </section>
        </>
    )
}