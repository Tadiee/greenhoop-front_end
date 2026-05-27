"use client"
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import TopComponent from "@/components/private components/courrier/Discovery/topComp";
const DiscoveryMapComp = dynamic(() => import("@/components/private components/courrier/Discovery/mapComp"), { ssr: false });
import ServicenTargetComp from "@/components/private components/courrier/Discovery/service&target";
import NearbyJobsComp from "@/components/private components/courrier/Discovery/nearbyJobsComp";

function DiscoveryPage() {
  const [filter, setFilter] = useState('All');
  const [selectedJobId, setSelectedJobId] = useState(null);

  return (
    // Added an inner shadow at the top so the white header looks like it casts a shadow over this dark dashboard
    <div className="h-[90%] w-full flex flex-col bg-[#121212] p-4 md:p-8 font-sans relative overflow-x-hidden overflow-y-auto scrollbar-thin shadow-[inset_0_20px_40px_rgba(0,0,1,1)] min-h-0">
      
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#08CB00_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.13] pointer-events-none"></div>

      
      {/* Page Top Comp */}
      <TopComponent activeFilter={filter} onFilterChange={setFilter} />

      {/* Main Grid Layout */}
      <div className="relative z-10 grid grid-cols-12 gap-5 pb-8 flex-1 min-h-0" style={{ gridAutoRows: 'minmax(0,1fr)' }}>
        
        {/* Left Area: The Massive Map Session */}
        <DiscoveryMapComp filter={filter} selectedJobId={selectedJobId} />

        {/* Right Area: Stacked Sidebar */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 h-full">
          
          {/* Card 1 & 2: Service Availability Toggle & Earnings Target Gauge  */}
          <ServicenTargetComp />

          {/* Live nearby jobs list */}
          <NearbyJobsComp onSelectJob={(job) => setSelectedJobId(job.id)} />

        </div>
      </div>
    </div>
  );
}

export default DiscoveryPage;