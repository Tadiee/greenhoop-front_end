import {CheckCircle2, Calendar, Map} from 'lucide-react';

export default function DeliveriesKPIs () {
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
                {[
                { label: 'Completed', icon: CheckCircle2, count: 84, color: '#08CB00' },
                { label: 'In Transit', icon: Map, count: 12, color: '#000000' },
                { label: 'Scheduled', icon: Calendar, count: 32, color: '#999999' }
                ].map((stat, i) => (
                <div key={i} className="bg-white rounded-[32px] p-6 border-2 border-transparent hover:border-[#08CB00]/50 shadow-lg flex items-center justify-between group transition-all cursor-pointer">
                    <div className="flex items-center gap-5">
                    <div className="p-3.5 rounded-2xl bg-[#F4F7F4] group-hover:bg-[#08CB00]/10 transition-colors">
                        <stat.icon size={24} style={{ color: stat.color }} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                        <p className="text-3xl font-black text-black leading-none">{stat.count}</p>
                    </div>
                    </div>
                </div>
                ))}
            </div>
        
        </>
    )
}