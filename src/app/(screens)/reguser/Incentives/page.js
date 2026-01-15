
import CombinedContainer from '@/components/private components/reguser components/Rewards/combinedContainer';
import '@/app/globals.css'

const GreenHoopIncentivesFinal = () => {

  return (
    <div className="h-screen w-screen bg-[#050505] text-white font-sans selection:bg-[#08CB00] overflow-x-hidden overflow-y-auto scrollbar-thin  ">
      <main className="max-w-7xl mx-auto px-6 py-20 space-y-16 flex flex-col overflow-x-hidden overflow-y-auto ">
        <CombinedContainer />
      </main>
    </div>
  );
};

export default GreenHoopIncentivesFinal;