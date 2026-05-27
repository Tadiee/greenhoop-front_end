import { Truck } from 'lucide-react';

export default function VehicleRegistry({ vehicles: vehiclesProp = [], loading }) {
    const vehicles = vehiclesProp.length > 0 ? vehiclesProp : [];

    return (
        <>
                <div className="flex-1 bg-black border border-white/10 rounded-[40px] p-8 flex flex-col overflow-hidden shadow-2xl relative">
                     {/* Header Decor */}
                     <div className="absolute top-0 right-10 w-20 h-[2px] bg-gradient-to-r from-transparent via-[#08CB00] to-transparent opacity-30"></div>
                     
                     <div className="flex justify-between items-center mb-8">
                        <div>
                           <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#08CB00]">
                           Fleet Assets
                           </h3>
                           <h2 className="text-xl font-black text-white italic">VEHICLE <span className="text-white/20">REGISTRY</span></h2>
                        </div>
                        <div className="flex items-center gap-3">
                           <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest">Live Sync</span>
                           <div className="w-2 h-2 rounded-full bg-[#08CB00] animate-pulse"></div>
                        </div>
                     </div>

                     {/* Registry List */}
                     <div className="flex-1 overflow-y-auto scrollbar-none pr-1 space-y-3">
                        {loading ? (
                          <div className="text-center py-8 text-[10px] text-white/20">Loading...</div>
                        ) : vehicles.length === 0 ? (
                          <div className="text-center py-8 text-[10px] text-white/20">No vehicles registered</div>
                        ) : vehicles.map((v, i) => (
                           <div 
                           key={i} 
                           className="group relative p-4 bg-white/[0.03] border border-white/5 rounded-3xl flex items-center justify-between hover:bg-white/[0.07] hover:border-[#08CB00]/30 transition-all duration-500 cursor-pointer overflow-hidden"
                           >
                           {/* Hover Background Glow */}
                           <div className="absolute inset-0 bg-gradient-to-r from-[#08CB00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                           <div className="flex items-center gap-5 relative z-10">
                              {/* Icon with Status Ring */}
                              <div className="relative">
                                 <div className="w-12 h-12 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-white/40 group-hover:text-[#08CB00] group-hover:border-[#08CB00]/40 transition-all duration-500">
                                 <Truck size={20} strokeWidth={2.5} />
                                 </div>
                                 {/* Health Mini-Dot */}
                                 <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 border-black ${v.status === 'active' || v.status === 'available' ? 'bg-[#08CB00]' : v.status === 'maintenance' ? 'bg-yellow-500' : 'bg-gray-600'}`}></div>
                              </div>

                              <div>
                                 <p className="text-[12px] font-black text-white tracking-wide uppercase group-hover:tracking-widest transition-all">
                                 {v.make_model || '—'}
                                 </p>
                                 <div className="flex items-center gap-3 mt-1.5">
                                 <span className="text-[9px] font-bold text-white/20 font-mono tracking-tighter">
                                    {v.vehicle_id_tag || '—'}
                                 </span>
                                 <div className="h-1 w-1 rounded-full bg-white/10"></div>
                                 {/* Simulated Telemetry Bar */}
                                 <div className="flex gap-[2px]">
                                    {[1, 2, 3, 4, 5].map((step) => (
                                       <div 
                                       key={step} 
                                       className={`h-[3px] w-3 rounded-full ${step < 5 ? 'bg-[#08CB00]/40' : 'bg-white/10'}`}
                                       ></div>
                                    ))}
                                 </div>
                                 </div>
                              </div>
                           </div>

                           {/* Tactical Status Badge */}
                           <div className="text-right relative z-10">
                              <div className={`text-[9px] font-black uppercase italic px-3 py-1 rounded-lg border-l-2 ${
                                 v.status === 'active' || v.status === 'available'
                                 ? 'bg-[#08CB00]/5 border-[#08CB00] text-[#08CB00]' 
                                 : v.status === 'in_transit' 
                                 ? 'bg-white/5 border-white text-white' 
                                 : 'bg-yellow-500/5 border-yellow-500 text-yellow-500'
                              }`}>
                                 {v.status_display || v.status || '—'}
                              </div>
                              <p className="text-[7px] font-bold text-white/10 mt-1 uppercase tracking-tighter group-hover:text-white/30 transition-colors">
                                 Telemetry: OK
                              </p>
                           </div>
                           </div>
                        ))}
                     </div>

                     {/* Footer Control */}
                     <div className="mt-6 flex items-center justify-between px-2">
                        <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]">Total Units: {vehicles.length}</p>
                        <button className="text-[9px] font-black text-[#08CB00] uppercase tracking-widest hover:text-white transition-colors">
                           Filter List +
                        </button>
                     </div>
                </div>
        </>
    );
}