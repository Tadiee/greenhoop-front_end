"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { MdInfoOutline, MdCheckCircleOutline } from "react-icons/md";
import { MdOutlineError } from "react-icons/md";
import { MdOutlineWarning } from "react-icons/md";
import { poppins } from "../../../../fonts/fonts";
import { inter } from "../../../../fonts/fonts";
import { MdOutlineThumbUp } from "react-icons/md";
import { BsArrowUpShort, BsArrowDownShort } from "react-icons/bs";

// Static notifications displayed in the Notifications Hub.
// Each object represents a single toast-like message with its metadata.
const notifications = [
    {"type": "success", "message": "You have successfully submitted your waste for disposal", "time": "2 days ago", "hour": "12:09 pm"},
    {"type": "error", "message": "Your account has been suspended for 30 days", "time": "7 days ago", "hour": "14:06 pm"},
    {"type": "warning", "message": "You blocked a user", "time": "10 days ago", "hour": "14:26 pm"},
    {"type": "info", "message": "You have received a new message", "time": "14 days ago", "hour": "15:40 pm"},
]

// Fun educational facts about e-waste shown in a rotating carousel.
// The `factIndex` state cycles through this array every 10 s.
const E_WASTE_FACTS = [
  {
    id: 1,
    title: "Urban Mining",
    fact: "There is 100 times more gold in a tonne of smartphones than in a tonne of gold ore. Your old phone is literally a tiny gold mine!",
    impact: "Resource Recovery"
  },
  {
    id: 2,
    title: "The Weight of Giants",
    fact: "The world produces 50 million tonnes of e-waste annually. That is equivalent to throwing away 1,000 laptops every single second.",
    impact: "Global Volume"
  },
  {
    id: 3,
    title: "The Ghost of Gadgets",
    fact: "Only about 20% of global e-waste is formally recycled. The rest often ends up in landfills, where toxic metals can leak into the soil.",
    impact: "Environmental Safety"
  },
  {
    id: 4,
    title: "Circular Energy",
    fact: "Recycling aluminum from old electronics saves 95% of the energy needed to make new aluminum from scratch.",
    impact: "Energy Saving"
  },
  {
    id: 5,
    title: "Second Life",
    fact: "Up to 80% of a computer is recyclable. Most of your old device can be transformed into jewelry, car parts, or even new tech!",
    impact: "Sustainability"
  }
];

// Helper to map notification types to specific styles
  const getStatusStyles = (type) => {
    switch (type) {
      case "success": return { icon: <MdCheckCircleOutline />, color: "text-[#08CB00]", bg: "bg-[#08CB00]/10" };
      case "error": return { icon: <MdOutlineError />, color: "text-red-500", bg: "bg-red-50" };
      case "warning": return { icon: <MdOutlineWarning />, color: "text-amber-500", bg: "bg-amber-50" };
      default: return { icon: <MdInfoOutline />, color: "text-blue-500", bg: "bg-blue-50" };
    }
  };

// LeftContainer renders the right-hand sidebar on the regular user dashboard.
// It contains:
// 1. An educational e-waste fact with illustration.
// 2. Two quick stats cards (submission rate & money received).
export default function LeftConatiner() {
  const [hover, setHover] = useState(false);
  const [factIndex, setFactIndex] = useState(0);

  // cycle facts every 10 seconds
  useEffect(() => {
    const id = setInterval(() => {
      setFactIndex((idx) => (idx + 1) % E_WASTE_FACTS.length);
    }, 10000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex  flex-col h-full w-[20%] rounded-r-xl items-center p-1 justify-between font-sans dark:bg-black" >
      <div className="flex flex-row items-center justify-around p-2 rounded-xl h-[50%] w-full space-x-2">

        <div className="flex flex-col items-center justify-around bg-green-50 p-2 rounded-xl h-full w-[50%]">
          <div className="flex flex-col items-center justify-between rounded-xl h-1/2 w-[100%] h-[35%]">
            <Image src="/img/phone.png" width={200} height={200} alt="earth" className="w-full h-full object-contain" />
          </div>

          <div className="flex flex-col items-start justify-center rounded-xl h-1/2 w-full px-2 space-y-1">
            <h1 className={`${inter.className} text-xs font-semibold text-gray-800`}>{E_WASTE_FACTS[factIndex].title}</h1>
            <p className="text-[10px] text-gray-600 leading-tight">{E_WASTE_FACTS[factIndex].fact}</p>
            <span className="text-[9px] italic text-accent-green">{E_WASTE_FACTS[factIndex].impact}</span>
          </div>
          
        </div>

        <div className="flex flex-col h-full w-[50%] gap-4 ">
      
          {/* 1. SUBMISSION RATE CARD */}
          <div className="group flex flex-col justify-between bg-white border border-gray-100 rounded-2xl p-4 h-1/2 w-full hover:shadow-xl hover:shadow-[#08CB00]/5 transition-all duration-500">
            <div className="flex justify-between items-start">
              <h2 className={`${inter.className} text-[9px] font-bold text-gray-400 uppercase tracking-widest`}>
                Submission Rate
              </h2>
              {/* A tiny visual trend indicator */}
              <div className="w-12 h-6 flex items-end gap-[2px]">
                <div className="w-full h-[40%] bg-gray-100 rounded-t-sm" />
                <div className="w-full h-[60%] bg-gray-100 rounded-t-sm" />
                <div className="w-full h-[50%] bg-gray-100 rounded-t-sm" />
                <div className="w-full h-[90%] bg-[#08CB00] rounded-t-sm animate-pulse" />
              </div>
            </div>

            <div className="mt-2">
              <div className="flex items-baseline gap-1">
                <span className={`${poppins.className} text-3xl font-black text-gray-900`}>65%</span>
                <div className="flex items-center text-[#08CB00] font-bold text-xs bg-[#08CB00]/10 px-1.5 py-0.5 rounded-lg">
                  <BsArrowUpShort className="text-lg" />
                  <span>8%</span>
                </div>
              </div>
              <p className={`${inter.className} text-[10px] text-gray-400 mt-1 italic`}>
                Increased from last month
              </p>
            </div>
          </div>

          {/* 2. MONEY RECEIVED CARD */}
          <div className="group flex flex-col justify-between bg-white border border-gray-100 rounded-2xl p-4 h-1/2 w-full hover:shadow-xl hover:shadow-red-500/5 transition-all duration-500">
            <div className="flex justify-between items-start">
              <h2 className={`${inter.className} text-[10px] font-bold text-gray-400 uppercase tracking-widest`}>
                Money Received
              </h2>
              {/* Negative trend visual */}
              <div className="w-12 h-6 flex items-end gap-[2px]">
                <div className="w-full h-[80%] bg-gray-100 rounded-t-sm" />
                <div className="w-full h-[70%] bg-gray-100 rounded-t-sm" />
                <div className="w-full h-[40%] bg-red-500 rounded-t-sm" />
                <div className="w-full h-[30%] bg-red-200 rounded-t-sm" />
              </div>
            </div>

            <div className="mt-2">
              <div className="flex items-baseline gap-1">
                <span className={`${poppins.className} text-3xl font-black text-gray-900`}>10%</span>
                <div className="flex items-center text-red-500 font-bold text-xs bg-red-50 px-1.5 py-0.5 rounded-lg">
                  <BsArrowDownShort className="text-lg" />
                  <span>5%</span>
                </div>
              </div>
              <p className={`${inter.className} text-[8px] text-gray-400 mt-1 italic`}>
                Decrease in payout frequency
              </p>
            </div>
          </div>

      </div>
        
      </div>

      {/* 3. A scrollable notifications hub. */}
    <div className="flex flex-col bg-white border border-gray-100 rounded-3xl h-full w-full overflow-hidden shadow-sm scrollbar-hidden scrollbar-custom">
      
      {/* 1. HEADER: Clean & Minimal */}
      <div className="flex items-center justify-between p-4 border-b border-gray-50">
        <h2 className={`${inter.className} text-sm font-black text-gray-900 uppercase tracking-tighter bg-accent-green p-1 rounded-lg`}>
          Notifications Hub<span className="ml-1 text-blue-500">•</span>
        </h2>
        <button className="text-[10px] font-bold text-gray-400 hover:text-[#08CB00] transition-colors">
          Mark all as read
        </button>
      </div>

      {/* 2. NOTIFICATION LIST */}
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className={`flex flex-col p-2 overflow-y-auto transition-all scrollbar-hidden scrollbar-custom ${
          hover ? 'opacity-100' : 'opacity-90'
        }`}
      >
        {notifications.map((notif, index) => {
          const style = getStatusStyles(notif.type);
          
          return (
            <div 
              key={index} 
              className="group flex flex-row items-start gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-all duration-300 cursor-pointer mb-1 border border-b-gray-100 border-transparent hover:border-gray-100"
            >
              {/* Status Icon */}
              <div className={`mt-1 p-2 rounded-xl ${style.bg} ${style.color} text-lg transition-transform group-hover:scale-110`}>
                {style.icon}
              </div>

              {/* Text Content */}
              <div className="flex flex-col flex-1 min-w-0">
                <p className={`text-[11px] font-medium text-gray-700 leading-snug group-hover:text-gray-900 transition-colors`}>
                  {notif.message}
                </p>

                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[9px] font-bold text-gray-300 uppercase tracking-wider">
                    {notif.time}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-gray-200" />
                  <span className="text-[9px] font-black text-[#08CB00]/60">
                    {notif.hour}
                  </span>
                </div>
              </div>

              {/* "Unread" indicator dot (Optional) */}
              {index < 2 && (
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shadow-[0_0_8px_#08CB00]" />
              )}
            </div>
          );
        })}
      </div>

      {/* 3. FOOTER: Quick Action */}
      <div className="mt-auto p-3 bg-gray-50/50 border-t border-gray-50 flex justify-center">
        <button className="text-[10px] font-black text-gray-500 hover:text-gray-900 uppercase tracking-widest transition-all">
          View All Activity
        </button>
      </div>
    </div>
      
     
    </div>
  );
}
