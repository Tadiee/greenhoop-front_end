
import RightContainer from "@/components/private components/technician/Revenue/rightContainer";
import LeftContainer from "@/components/private components/technician/Revenue/leftContainer";
import MiddleContainer from "@/components/private components/technician/Revenue/middleContainer";

const TechnicianRevenue = () => {
  return (
    <div className="flex flex-col h-screen bg-[#050505] justify-between text-white font-sans overflow-hidden selection:bg-[#08CB00] ">
        <div className='h-[5%] w-full'>

        </div>
    
        <div className='w-full h-[93%] flex justify-around items-center' >    
            {/* --- LEFT SIDEBAR: REPORT CONFIGURATION (1/5 Width) --- */}
            <LeftContainer />


            <div className='h-16'>

            </div>

            {/* --- MIDDLE COLUMN: ANALYTICS & HISTORY (3/5 Width) --- */}
            <main className="w-[60%] flex flex-col h-full p-6 md:p-8 lg:p-6 gap-6">
               <MiddleContainer />

            </main>

            {/* --- RIGHT COLUMN: TOP PERFORMERS & ACQUISITIONS (1/5 Width) --- */}
            <RightContainer />

         </div>
    </div>
  );
};

export default TechnicianRevenue;