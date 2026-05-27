"use client"
import React from 'react';
import MarketplaceBundle from '@/components/private components/reguser components/Marketplace/marketplaceBundle';

const TechnicianMarketplace = () => {
  return (
    <div className="h-screen bg-[#050505] text-white font-sans selection:bg-[#08CB00] overflow-y-auto scrollbar-thin">
      <MarketplaceBundle readOnly={true} />
    </div>
  );
};

export default TechnicianMarketplace;
