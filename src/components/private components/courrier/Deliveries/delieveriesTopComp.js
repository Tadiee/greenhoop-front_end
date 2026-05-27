import {ArrowUpRight, Navigation} from 'lucide-react';

export default function DeliveriesTopComp () {
    return (
        <>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between md:justify-center space-x-8 gap-6 mb-8 mt-2">
                <div>
                <h1 className="text-4xl font-black text-white tracking-tighter">Deliveries <span className="text-[#08CB00]">Flow</span></h1>
                <p className="text-white/40 text-xs font-bold uppercase tracking-[0.2em] mt-2">Navexa Logi-System v2.4</p>
                </div>

                <div className="flex gap-4">
                <div className="bg-white px-5 py-4 rounded-[24px] shadow-lg flex items-center gap-4">
                    <div className="h-10 w-10 bg-[#08CB00]/10 rounded-2xl flex items-center justify-center text-[#08CB00]">
                    <Navigation size={20} />
                    </div>
                    <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Distance</p>
                    <p className="text-xl font-black text-black">1,240 <span className="text-xs text-gray-400">KM</span></p>
                    </div>
                </div>
                <div className="bg-black border border-white/10 px-5 py-4 rounded-[24px] shadow-xl flex items-center gap-4 text-white">
                    <div className="h-10 w-10 bg-[#08CB00]/10 rounded-2xl flex items-center justify-center text-[#08CB00]">
                    <ArrowUpRight size={20} />
                    </div>
                    <div>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Active Nodes</p>
                    <p className="text-xl font-black">42 <span className="text-[#08CB00] text-xs animate-pulse">●</span></p>
                    </div>
                </div>
                </div>
            </div>
        
        </>
    )
}