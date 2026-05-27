import AuditStreamComp from '@/components/private components/technician/Expenditure/auditStreamComp';
import OperatingAnalysisComp from '@/components/private components/technician/Expenditure/operatingAnalysis';
import MaterialThroughputComp from '@/components/private components/technician/Expenditure/materialThroughput';
import PartnerRevenueComp from '@/components/private components/technician/Expenditure/partnerRevenue';
import OutflowComp from '@/components/private components/technician/Expenditure/outflow';

const TechExpenditure = () => {
  return (
    <div className="h-screen w-full bg-[#050505] text-white font-sans selection:bg-[#08CB00] overflow-hidden flex flex-col p-6 gap-6">
      
        {/* --- 01. INTEGRATED NAV BAR --- */}
        <header className="w-full flex justify-center h-16 shrink-0 relative">
        </header>

        {/* --- 02. ASYMMETRIC FINANCIAL GRID --- */}
        <div className="flex-1 flex gap-6 min-h-0">
        
            {/* --- LEFT SIDE: TACTICAL LEDGER (1/4 Width) --- */}
            {/* --- LEFT SIDE: TACTICAL AUDIT LEDGER (1/4 Width) --- */}
            <div className="w-1/4 flex flex-col gap-6 h-full relative z-50">
            
                {/* 01. FISCAL AUDIT STREAM (Transaction Ledger) */}
                <AuditStreamComp />

                {/* 02. OPERATIONAL INTAKE SENTINEL (Waste Metrics) */}
                <MaterialThroughputComp />

            </div>

            {/* --- RIGHT SIDE: FISCAL ANALYSIS ENGINE (3/4 Width) --- */}
            <div className="w-3/4 flex flex-col gap-6">
            
                {/* TOP 2/3: EXPENSE ANALYTICS & CHARTS */}
                {/* --- FISCAL OPERATING ANALYSIS: HARDENED REDESIGN --- */}
                <OperatingAnalysisComp />


                {/* BOTTOM 1/3: TOP CUSTOMERS & TOTAL SPEND FIGURE */}
                {/* --- BOTTOM ROW: SETTLEMENT & OUTFLOW HUB --- */}
                <div className="h-1/3 flex gap-6">
                
                    {/* 01. STRATEGIC PARTNER REVENUE (Manifest Style) */}
                    <PartnerRevenueComp />

                    {/* Total Expenditure Component (1/3 Width) */}
                    <OutflowComp />

                </div>
            </div>

        </div>
    </div>
  );
};

export default TechExpenditure;