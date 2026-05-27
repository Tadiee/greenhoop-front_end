import Insights from '@/components/private components/recycler/Reports/insights';
import Revenue from '@/components/private components/recycler/Reports/revenue';
import MonthlyDisclosure from '@/components/private components/recycler/Reports/monthlyDisclosure';
import AuditGeneration from '@/components/private components/recycler/Reports/auditGeneration';
import AuditLedger from '@/components/private components/recycler/Reports/auditLedger';

const Reports = () => {
  return (
    <div className="h-screen w-full bg-[#121212] text-white font-sans selection:bg-[#08CB00] overflow-hidden flex flex-col p-8 gap-10">
      
        {/* --- 01. HEADER: PERSONALIZED GREETING --- */}
        <header className="flex justify-between h-16 items-center shrink-0">

        </header>
        
        <div className="space-y-1">
            <h1 className="text-4xl font-medium tracking-tight">Hello, <span className="text-accent-green">Facility Manager</span></h1>
            <p className="text-white/40 text-sm font-medium uppercase tracking-widest">Harare Sector A-01</p>
        </div>

      {/* --- 02. DASHBOARD CARDS --- */}
      <div className="flex-1 flex flex-col gap-8 min-h-0">
         
         {/* TOP ROW: STATISTICS & OVERVIEW */}
         <div className="h-1/2 flex gap-8">
            
            {/* CARD 1: NARRATIVE INSIGHTS (Bar Chart Style) */}
            <Insights />

            {/* CARD 2: REVENUE BY STREAM (Doughnut Style) */}
            <Revenue />

            {/* CARD 3 & 4: QUICK IMPACT STATS and Monthly Disclosure */}
            <MonthlyDisclosure />

         </div>

         {/* BOTTOM ROW: DISCLOSURE TIMELINE */}
         {/* --- INTEGRATED AUDIT & LEDGER ROW --- */}
         <div className="grid grid-cols-12 gap-6 shrink-0">

            {/* 01. AUDIT GENERATION TIMELINE (7/12 Width) */}
            <AuditGeneration />

            {/* 02. AUDIT LEDGER REGISTRY (5/12 Width) */}
            <AuditLedger />

         </div>

      </div>
    </div>
  );
};

export default Reports;