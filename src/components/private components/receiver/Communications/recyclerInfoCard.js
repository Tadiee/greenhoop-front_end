"use client"
import { Phone, Mail, FileText
} from 'lucide-react';

export default function RecyclerInforComp () {
    return (
        <> 
                <div className="col-span-12 md:col-span-8 lg:col-span-4 bg-[#1A1A1A] border border-white/5 rounded-[40px] p-8 shadow-2xl flex flex-col justify-between hover:border-white/10 transition-all">
          <div>
            <h3 className="text-xl font-black text-white tracking-tight mb-4">Partner Details</h3>
            <p className="text-[12px] font-bold text-white/60 leading-relaxed">
              Use this channel to negotiate material quantities, schedule checkouts, and verify quality reports directly with Apex Recycling.
            </p>
          </div>
          
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl">
              <Phone size={14} className="text-[#08CB00]" />
              <span className="text-[10px] font-black text-white tracking-widest">(555) 019-8234</span>
            </div>
            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl">
              <Mail size={14} className="text-[#08CB00]" />
              <span className="text-[10px] font-black text-white tracking-widest">ops@apexrecycling.co</span>
            </div>
          </div>

          <button className="mt-6 w-full flex items-center justify-center gap-2 bg-transparent border-2 border-white/10 text-white/60 hover:text-white hover:border-white/30 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all">
            <FileText size={14} /> View Contract
          </button>
        </div>
        
        </>
    )
}