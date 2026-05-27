"use client"
import {MoreHorizontal} from 'lucide-react';

const chatHistory = [
  { id: 1, name: 'Apex Recycling Co.', msg: 'Can we schedule the pickup for Friday?', time: '10:42 AM', unread: true },
  { id: 2, name: 'Logistics Team', msg: 'Courier #442 is 15 mins out.', time: '09:15 AM', unread: false },
  { id: 3, name: 'System Alerts', msg: 'Weekly storage report generated.', time: 'Yesterday', unread: false },
  { id: 4, name: 'Apex Recycling Co.', msg: 'Received the last batch, quality looks good.', time: 'Mon', unread: false },
];

export default function HistoryComp () {
    return (
        <> 
                <div className="col-span-12 lg:col-span-5 bg-[#1A1A1A] border border-white/5 rounded-[40px] p-6 shadow-2xl flex flex-col h-full overflow-hidden scrollbar-thin  ">
          <div className="flex justify-between items-center mb-6 px-2">
            <h3 className="text-white font-black tracking-tight">Recent Threads</h3>
            <MoreHorizontal size={18} className="text-white/40 cursor-pointer hover:text-white transition-colors" />
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-none space-y-2 pr-1">
            {chatHistory.map((chat) => (
              <div key={chat.id} className="flex items-center justify-between p-4 bg-white/5 border border-transparent hover:border-white/10 rounded-[24px] group transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  {/* Avatar Placeholder */}
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-black border border-white/10 flex items-center justify-center overflow-hidden">
                       <span className="text-xs font-black text-[#08CB00]">{chat.name.charAt(0)}</span>
                    </div>
                    {chat.unread && <span className="absolute top-0 right-0 w-3 h-3 bg-[#08CB00] rounded-full border-2 border-[#1A1A1A]"></span>}
                  </div>
                  
                  <div className="flex-1 min-w-0 pr-4">
                    <h4 className={`text-xs font-black uppercase tracking-widest truncate ${chat.unread ? 'text-white' : 'text-white/60'}`}>{chat.name}</h4>
                    <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 truncate ${chat.unread ? 'text-[#08CB00]' : 'text-white/30'}`}>
                      {chat.msg}
                    </p>
                  </div>
                </div>
                
                <div className="text-right shrink-0">
                  <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">{chat.time}</span>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all">
            View All History
          </button>
        </div>
        
        </>
    )
}