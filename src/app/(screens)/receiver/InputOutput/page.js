"use client"
import React, { useState, useCallback } from 'react';
import ReceiverHeader from '@/components/global components/header/receiverHeader';
import TopStatusBarComp from '@/components/private components/receiver/InputOutput/topStatusBar';
import OperationalLedger from '@/components/private components/receiver/InputOutput/ledger';
import ManualInputComp from '@/components/private components/receiver/InputOutput/manualInput';
import QrCodeComp from '@/components/private components/receiver/InputOutput/qrCode';
import PendingArrivalsComp from '@/components/private components/receiver/InputOutput/output';

function InputOutputPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleConfirmed = useCallback(() => {
    setRefreshTrigger(t => t + 1);
  }, []);

  return (
    <div className="w-full h-screen flex flex-col scrollbar-thin bg-[#121212] font-sans p-8 relative overflow-y-auto">
      <div className="fixed inset-0 z-0 bg-[radial-gradient(#08CB00_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.13] pointer-events-none" />

      <ReceiverHeader subHeader="Input/Output Node" />

      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 md:px-8 pb-12">
        <div className="py-6">
          <h1 className="text-3xl font-black text-white tracking-tighter">Input/Output <span className="text-[#08CB00]">Node</span></h1>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mt-1">Scan user QR · verify submission · confirm receipt · status: COMPLETED</p>
        </div>

        <TopStatusBarComp refreshTrigger={refreshTrigger} />

        <div className="grid grid-cols-12 gap-6">
          <QrCodeComp onConfirmed={handleConfirmed} />
          <ManualInputComp onConfirmed={handleConfirmed} />
          <PendingArrivalsComp refreshTrigger={refreshTrigger} />
        </div>

        <OperationalLedger refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
}

export default InputOutputPage;