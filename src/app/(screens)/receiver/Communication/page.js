import HistoryComp from '@/components/private components/receiver/Communications/historyComp';
import RecyclerInforComp from '@/components/private components/receiver/Communications/recyclerInfoCard';
import RatingComp from '@/components/private components/receiver/Communications/ratingCard';
import FiltersComp from '@/components/private components/receiver/Communications/filters';
import HeroSectionComp from '@/components/private components/receiver/Communications/heroSection';
import ActionChartComp from '@/components/private components/receiver/Communications/actionChart';
import ReceiverHeader from "@/components/global components/header/receiverHeader"

function CommunicationPage() {

  return (
    <div className="h-screen w-full flex flex-col bg-[#121212] p-4 md:p-8 font-sans relative overflow-hidden shadow-[inset_0_20px_40px_rgba(0,0,0,0.6)]">
      
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#08CB00_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.12] pointer-events-none"></div>

      <ReceiverHeader subHeader="Communication" />      
      
      {/* Filters */}
      <FiltersComp />


      {/* Bento Box Main Grid */}
      <div className="relative z-10 grid grid-cols-12 auto-rows-auto gap-6 flex-1 min-h-0 pb-2">
        
        {/* TOP LEFT: Hero Chat Entry (Inspired by the large purple block with the person) */}
        <HeroSectionComp />


        {/* TOP RIGHT: Action Chart (Inspired by the dark graph card) */}
        <ActionChartComp />


        {/* BOTTOM LEFT: Solid Accent Card (Inspired by the solid blue 'Rating' card) */}
        <RatingComp />


        {/* BOTTOM MIDDLE: Info Card (Inspired by the white central block) */}
        <RecyclerInforComp />

        {/* BOTTOM RIGHT: History / Inbox (Matches the bento structural need for a list) */}
        <HistoryComp />


      </div>
    </div>
  );
}

export default CommunicationPage;