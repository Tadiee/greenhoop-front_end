"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import DeliveriesKPIs from "@/components/private components/courrier/Deliveries/deliveriesKPIs";
import DeliveriesTopComp from "@/components/private components/courrier/Deliveries/delieveriesTopComp";
import JobQueueComp from "@/components/private components/courrier/Deliveries/jobQueueComp";

function DeliveriesPage() {
  const router = useRouter();

  const handleStartJob = (job) => {
    router.push(`/courrier/ActiveDelivery?jobId=${job.submit_id}`);
  };

  return (
    <div className="h-[90%] w-full flex flex-col overflow-x-hidden bg-[#121212] p-4 md:p-8 font-sans relative scrollbar-thin min-h-0">
      {/* Background Pattern */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(#08CB00_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.1] pointer-events-none"></div>

      {/* Top Section */}
      <div className="relative z-10 shrink-0">
        <DeliveriesTopComp />
      </div>

      {/* Main Content — fills remaining height */}
      <div className="relative z-10 grid grid-cols-12 gap-6 flex-1 min-h-0">

        {/* Left: KPI Cards */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 overflow-y-auto scrollbar-none pb-8">
          <DeliveriesKPIs />
        </div>

        {/* Right: Job Queue with 3 tabs — fills full height */}
        <div className="col-span-12 lg:col-span-8 flex flex-col min-h-0 pb-8">
          <JobQueueComp onStartJob={handleStartJob} />
        </div>

      </div>
    </div>
  );
}

export default DeliveriesPage;