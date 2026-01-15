export default function PerfomanceBottomContainer () {
    return (
        <>
            {/* --- 03. REVENUE JOURNAL --- */}
            <section className="space-y-8 bg-white/[0.02] border border-white/5 rounded-[56px] p-10">
            <h3 className="text-sm font-black uppercase tracking-[0.4em] text-white/30 px-4">Recent Marketplace Interaction</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                <thead>
                    <tr className="text-[10px] font-black tracking-widest text-white/20 border-b border-white/5">
                    <th className="px-10 py-6">Listing ID</th>
                    <th className="px-10 py-6">Product</th>
                    <th className="px-10 py-6 text-center">Status</th>
                    <th className="px-10 py-6 text-right">Potential Value</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    <tr className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-10 py-8 text-xs font-mono text-white/30 group-hover:text-[#08CB00]">MP-4412</td>
                    <td className="px-10 py-8">
                        <p className="text-sm font-black uppercase italic tracking-tight leading-none">MacBook Air M2</p>
                        <p className="text-[10px] text-white/40 font-bold mt-1">Laptops • Jan 15, 2026</p>
                    </td>
                    <td className="px-10 py-8 text-center">
                        <span className="text-[9px] font-black uppercase px-4 py-1.5 rounded-full border border-yellow-500/30 text-yellow-500 bg-yellow-500/5">
                        Pending Sale
                        </span>
                    </td>
                    <td className="px-10 py-8 text-right text-2xl font-black text-[#08CB00]">+$850.00</td>
                    </tr>
                </tbody>
                </table>
            </div>
            </section>
        </>
        
    )
}