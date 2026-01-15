import Image from "next/image";
import React from 'react';
import { poppins, inter, roboto } from "@/fonts/fonts";
import { FaLeaf } from "react-icons/fa";
import { HiCpuChip } from "react-icons/hi2";
import { RiSmartphoneLine } from "react-icons/ri";
import { IoPhonePortrait } from "react-icons/io5";
import { BsLaptopFill } from "react-icons/bs";
import { MdOutlinePublic, MdOutlineMonitor, MdOutlineBolt } from 'react-icons/md';


export default function MiddleContainer() {
  const stats = [
    {
      id: 1,
      label: "Global Recycled",
      value: "1.2M",
      unit: "tons",
      icon: <MdOutlinePublic className="text-[#08CB00]" />,
    },
    {
      id: 2,
      label: "CO2 Saved",
      value: "45.8k",
      unit: "kg",
      icon: <FaLeaf className="text-[#08CB00]" />,
    },
    {
      id: 3,
      label: "Devices Salvaged",
      value: "892",
      unit: "today",
      icon: <MdOutlineMonitor className="text-[#08CB00]" />,
    },
    {
      id: 4,
      label: "Energy Recovered",
      value: "12.4",
      unit: "MWh",
      icon: <MdOutlineBolt className="text-[#08CB00]" />,
    },
  ];
  return (
    <div className="flex h-full flex-col w-[65%] bg-hero-radial items-center justify-between font-sans dark:bg-black rounded-xl relative overflow-hidden" >
      
        
        <div className="w-full max-w-4xl px-6 py-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl flex items-center justify-between shadow-2xl">
        {stats.map((stat, index) => (
          <React.Fragment key={stat.id}>
            <div className="flex flex-col items-center gap-1 group cursor-default">
              {/* Icon and Label */}
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl opacity-80 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold">
                  {stat.label}
                </span>
              </div>
              
              {/* Value and Unit */}
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white tracking-tight">
                  {stat.value}
                </span>
                <span className="text-[10px] text-[#08CB00] font-bold uppercase">
                  {stat.unit}
                </span>
              </div>
            </div>
            
            {/* Divider line between items, but not after the last one */}
            {index !== stats.length - 1 && (
              <div className="h-8 w-[1px] bg-white/10 mx-2" />
            )}
          </React.Fragment>
        ))}
      </div>
        


      <div className="flex h-[15%] flex-col w-full items-center justify-start ">
        {/* 4. Buttons & Sub-text Container */}
        {/* Positioned absolutely at the bottom of the container, with a high z-index */}
        <div className="absolute z-30 bottom-5 flex flex-col items-center gap-6">
          {/* Two-Button Layout */}
          <div className="flex items-center gap-4">
            {/* Primary Button: Solid Green */}
            <button className="px-8 py-3 bg-[#08CB00] text-white font-bold rounded-full shadow-lg hover:bg-[#06a000] hover:shadow-[#08cb0080]/50 hover:shadow-xl transition-all duration-300 active:scale-95">
              Recycle Now
            </button>
            
            {/* Secondary Button: Outline White */}
            <button className="px-8 py-3 border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-all duration-300 active:scale-95">
              View Rewards
            </button>
          </div>
          
          {/* Sub-text for Engagement */}
          <p className="text-white/80 text-sm font-medium">
            You've traded in <strong>12kg</strong> of materials so far. Keep it going!
          </p>
        </div>
       
      </div>
      {/* 2. Middle Layer: The Text (Behind the model) */}
      {/* We use a lower z-index. Select-none stops users from annoying highlighting. */}
      <div className="absolute z-10 top-[25%] select-none text-center">
        <h1 className={`text-[170px] leading-none font-extrabold text-white tracking-tighter uppercase ${poppins.className}`}>
          RETHINK <br /> WASTE
        </h1>
      </div>

      {/* 3. Top Layer: The 3D Model (In front) */}
      {/* Higher z-index puts it on top. */}
      {/* Using 'mix-blend-mode' sometimes helps integrate it better, test it out. */}
      <div className="absolute top-[10%] z-20 w-[550px] h-[550px] pointer-events-none animate-float-slow">
         <Image 
           src={"/img/globe model2.png"}
           alt="3D E-waste illustration"
           fill
           style={{objectFit: "contain"}}
           priority
         />
      </div>
     
    </div>
  );
}
