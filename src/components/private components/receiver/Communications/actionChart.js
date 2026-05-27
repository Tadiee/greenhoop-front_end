export default function ActionChartComp () {
    return (
        <> 
            <div className="col-span-12 lg:col-span-4 bg-[#141414] border border-white/5 rounded-[40px] p-8 shadow-2xl flex flex-col justify-between group hover:border-white/10 transition-all">
                <div className="flex justify-between items-start mb-6">
                    <div>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 mb-1 block">[ Requests Fulfilled ]</span>
                    <h3 className="text-5xl font-black text-white tracking-tighter">+42<span className="text-2xl text-white/20">%</span></h3>
                    </div>
                    <div className="bg-white/5 px-3 py-1.5 rounded-lg text-[9px] font-black text-white/60 uppercase tracking-widest">
                    This Month
                    </div>
                </div>

                {/* Smooth SVG Chart mimicking the inspo */}
                <div className="w-full h-32 relative mt-4">
                    <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                    {/* Background Line (In progress) */}
                    <path d="M 0 40 Q 20 20 40 30 T 80 10 T 100 20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeLinecap="round" />
                    {/* Foreground Line (Done/Green) */}
                    <path d="M 0 30 Q 30 50 50 20 T 90 30 T 100 5" fill="none" stroke="#08CB00" strokeWidth="3" strokeLinecap="round" className="drop-shadow-[0_0_8px_rgba(8,203,0,0.5)]" />
                    </svg>
                </div>
                
                <div className="flex justify-between mt-4">
                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#08CB00]"></span><span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Fulfilled</span></div>
                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-white/20"></span><span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Pending</span></div>
                </div>
            </div>
        
        </>
    )
}