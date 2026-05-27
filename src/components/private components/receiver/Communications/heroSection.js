"use client"
import {ArrowUpRight} from 'lucide-react';

export default function HeroSectionComp () {
    return (
        <> 
            <div className="col-span-12 lg:col-span-8 bg-[#1A1A1A] border border-white/5 rounded-[40px] shadow-2xl relative overflow-hidden group flex flex-col md:flex-row items-center">
                
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#08CB00]/10 rounded-full blur-[100px] pointer-events-none transition-all duration-1000 group-hover:bg-[#08CB00]/20"></div>
    
                {/* Image Area */}
                <div className="w-full md:w-2/5 h-64 md:h-full relative overflow-hidden bg-black">
                {/* Professional placeholder representing the Recycler Partner Manager */}
                <img 
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop" 
                    alt="Partner Manager" 
                    className="w-full h-full object-cover opacity-80 mix-blend-luminosity group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1A1A1A] hidden md:block"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] to-transparent md:hidden"></div>
                </div>
    
                {/* Content Area */}
                <div className="w-full md:w-3/5 p-8 relative z-10">
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50 border border-white/10 px-3 py-1 rounded-md">
                    [ Assigned Recycler ]
                    </span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none mb-2">
                    Apex Recycling Co.
                </h2>
                <p className="text-sm font-bold text-white/40 mb-8">
                    Account Manager: Michael T.
                </p>
    
                <div className="flex items-center gap-4">
                    <button className="bg-[#08CB00] text-black px-6 py-4 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-3 hover:bg-[#07b300] hover:scale-105 transition-all shadow-[0_0_20px_rgba(8,203,0,0.3)]">
                    Open Chat <ArrowUpRight size={18} />
                    </button>
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-3 rounded-full">
                        <span className="w-2.5 h-2.5 bg-[#08CB00] rounded-full animate-pulse shadow-[0_0_8px_#08CB00]"></span>
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Online</span>
                    </div>
                </div>
                </div>
                    </div>
        </>
    )
}