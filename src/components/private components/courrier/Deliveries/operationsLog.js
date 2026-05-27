import { MoreVertical, Package} from 'lucide-react';

export default function OperationLog () {
    const deliveries = [
        { id: 'DL-8821', customer: 'Acme Corp', zone: 'Sector 4', status: 'Completed', weight: '120kg', battery: '88%' },
        { id: 'DL-8822', customer: 'Global Tech', zone: 'Sector 7', status: 'Pending', weight: '45kg', battery: '42%' },
        { id: 'DL-8823', customer: 'Hyperion', zone: 'Sector 2', status: 'Scheduled', weight: '210kg', battery: '100%' },
        { id: 'DL-8824', customer: 'Nova Logistics', zone: 'Sector 4', status: 'In Transit', weight: '850kg', battery: '65%' },
        ];
    return (
        <>
            <div className="bg-white rounded-[40px] shadow-xl overflow-hidden border border-gray-100">
                <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white">
                <h3 className="font-black uppercase text-xs tracking-widest text-black flex items-center gap-3">
                    <Package size={18} className="text-[#08CB00]"/> Operations Log
                </h3>
                <button className="text-[10px] font-black text-[#08CB00] uppercase hover:text-black tracking-widest transition-colors bg-[#08CB00]/10 px-4 py-2 rounded-lg">Export CSV</button>
                </div>
                
                <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                    <tr className="bg-[#F8FAF8]">
                        <th className="p-5 pl-8 text-[9px] font-black uppercase text-gray-400 tracking-widest">ID / Dest</th>
                        <th className="p-5 text-[9px] font-black uppercase text-gray-400 tracking-widest">Customer</th>
                        <th className="p-5 text-[9px] font-black uppercase text-gray-400 tracking-widest">Status / Wgt</th>
                        <th className="p-5 text-[9px] font-black uppercase text-gray-400 tracking-widest">Telemetry</th>
                        <th className="p-5 pr-8 text-[9px] font-black uppercase text-gray-400 tracking-widest text-right">Action</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {deliveries.map((d, i) => (
                        <tr key={i} className="group hover:bg-[#F4F7F4]/60 transition-colors cursor-pointer">
                        <td className="p-5 pl-8">
                            <p className="text-sm font-black text-black tracking-tight">{d.id}</p>
                            <p className="text-[9px] text-[#08CB00] font-black uppercase tracking-widest mt-1">{d.zone}</p>
                        </td>
                        <td className="p-5">
                            <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl bg-black flex items-center justify-center text-[12px] font-black text-[#08CB00] shadow-md">
                                {d.customer[0]}
                            </div>
                            <p className="text-xs font-black text-black uppercase">{d.customer}</p>
                            </div>
                        </td>
                        <td className="p-5">
                            <div className="flex flex-col items-start gap-1.5">
                            <span className={`text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest border ${
                                d.status === 'Completed' ? 'bg-[#08CB00]/10 border-[#08CB00]/20 text-[#08CB00]' : 
                                d.status === 'In Transit' ? 'bg-black text-[#08CB00] border-black shadow-md' : 
                                'bg-gray-100 border-gray-200 text-gray-500'
                            }`}>{d.status}</span>
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter ml-1">{d.weight} payload</span>
                            </div>
                        </td>
                        <td className="p-5">
                            <div className="w-28">
                            <div className="flex justify-between items-end mb-1.5">
                                <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Power</span>
                                <span className="text-[10px] font-black text-black leading-none">{d.battery}</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                className={`h-full transition-all duration-1000 ${parseInt(d.battery) > 50 ? 'bg-[#08CB00]' : 'bg-orange-500'}`} 
                                style={{ width: d.battery }}
                                ></div>
                            </div>
                            </div>
                        </td>
                        <td className="p-5 pr-8 text-right">
                            <button className="p-2.5 hover:bg-white border border-transparent hover:border-gray-200 rounded-xl transition-all shadow-none hover:shadow-sm text-gray-400 hover:text-[#08CB00]">
                            <MoreVertical size={16} />
                            </button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
          </div>
        
        </>
    )
}