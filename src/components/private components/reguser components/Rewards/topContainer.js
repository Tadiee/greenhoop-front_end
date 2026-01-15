
import { ArrowUpRight, Download, ShieldCheck, Clock } from 'lucide-react';

export default function TopContainer () {
    return (
        <>
            {/* --- SECTION 1: WALLET, CHART & TIER --- */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Wallet Card */}
            <div className="lg:col-span-8 bg-gradient-to-br from-[#08CB00]/10 to-transparent border border-white/5 rounded-[56px] p-12 space-y-10 relative overflow-hidden ">
                <div className="flex justify-between items-start relative z-10">
                <div className="space-y-2">
                    <p className="text-[11px] font-black uppercase tracking-[0.5em] text-[#08CB00]">Available Earnings</p>
                    <h1 className="text-9xl font-black tracking-tighter leading-none">$168.50</h1>
                </div>
                
                {/* Verification Queue */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-3xl flex items-center gap-4">
                    <div className="p-3 bg-white/7 rounded-2xl text-yellow-500">
                    <Clock size={20} className='text-accent-green' />
                    </div>
                    <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Verification Queue</p>
                    <p className="text-xl font-black text-white">$12.00</p>
                    </div>
                </div>
                </div>

                {/* Activity Chart Integration */}
                <div className="h-40 flex items-end flex-col justify-between gap-2 px-2 relative z-10">
                    <p className="text-[11px] font-black uppercase tracking-[0.5em] text-white/30">Activity Chart</p>
                    <div className="flex items-center gap-2 h-[90%] w-full flex items-end justify-center">
                        {[45, 80, 55, 110, 95, 70, 130, 85, 100, 60, 115, 140].map((h, i) => (
                            <div key={i} className="group relative flex-1">
                                
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black px-2 py-1 rounded text-[8px] font-black opacity-0 group-hover:opacity-100 transition-all shadow-xl">+${(h/10).toFixed(2)}</div>
                                <div style={{ height: `${h}px` }} className={`w-full rounded-t-xl transition-all duration-700 ${i === 11 ? 'bg-[#08CB00]' : 'bg-white/10 group-hover:bg-[#08CB00]/40'}`}></div>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="flex gap-4 relative z-10">
                <button className="bg-[#08CB00] text-black px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-white transition-all shadow-xl shadow-[#08CB00]/20">Withdraw <ArrowUpRight size={14} /></button>
                <button className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all flex items-center gap-2"><Download size={14} /> Statement</button>
                </div>
            </div>

            {/* Citizen Tier Card - REFINED TO FILL GAP */}
            <div className="lg:col-span-4 bg-[#08CB00] rounded-[56px] p-10 text-black flex flex-col justify-between group">
                <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Citizen Status</p>
                <h3 className="text-3xl font-black italic tracking-tighter leading-tight">FOREST GUARDIAN</h3>
                <p className="text-xs font-bold bg-black/5 inline-block px-4 py-1.5 rounded-full mt-2 uppercase tracking-tighter">Top 4% in Harare</p>
                </div>

                {/* ADDED TO FILL GAP: Milestone Rewards */}
                <div className="bg-black/5 rounded-3xl p-6 space-y-4 border border-black/5">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Next Milestone Reward</p>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-[#08CB00] shadow-lg">
                    <ShieldCheck size={24} />
                    </div>
                    <div>
                    <p className="text-sm font-black uppercase tracking-tight">Priority Pickup</p>
                    <p className="text-[10px] font-bold opacity-60">Unlock at Level 25</p>
                    </div>
                </div>
                </div>

                <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-black"><span>TIER PROGRESS</span><span>84.2%</span></div>
                <div className="w-full h-5 bg-black/10 rounded-2xl overflow-hidden p-1">
                    <div className="h-full bg-black rounded-xl transition-all duration-1000" style={{width: '84.2%'}}></div>
                </div>
                </div>
            </div>
            </section>            
        </>
    )
}