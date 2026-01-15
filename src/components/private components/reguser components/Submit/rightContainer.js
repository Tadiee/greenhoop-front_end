"use client"
import React, { useState } from 'react';

export default function RightContainer ()  {
    const [formData, setFormData] = useState({
        category: '',
        brand: '',
        model: '',
        serial: '',
        condition: 'working',
        quantity: 1,
        accessories: [],
        dataWiped: false
    });
    
    const [fulfillment, setFulfillment] = useState('pickup'); 

    // Professional Reward Logic with Breakdown
    const getBaseValue = () => (formData.category === 'laptop' ? 45 : 15);
    const conditionMult = formData.condition === 'working' ? 1.5 : 0.5;
    const accessoryBonus = formData.accessories.length * 2;
    const total = (getBaseValue() * conditionMult + accessoryBonus) * formData.quantity;

    
    return (
        <>
            {/* RIGHT COLUMN: REWARD ANALYTICS */}
            <div className="lg:col-span-4 space-y-6">
            
            <div className="sticky top-32 space-y-6">
                {/* Live Value Breakdown */}
                <div className="bg-[#08CB00] p-8 rounded-[40px] text-black overflow-hidden relative group">
                <div className="relative z-10 space-y-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Value Breakdown</p>
                    <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold opacity-60"><span>Base Value</span><span>${getBaseValue()}</span></div>
                    <div className="flex justify-between text-xs font-bold opacity-60"><span>Condition ({formData.condition})</span><span>x{conditionMult}</span></div>
                    <div className="flex justify-between text-xs font-bold opacity-60"><span>Accessory Bonus</span><span>+${accessoryBonus}</span></div>
                    <div className="h-[1px] bg-black/10 my-4"></div>
                    <div className="flex justify-between items-end">
                        <span className="text-sm font-black uppercase">Total Reward</span>
                        <span className="text-5xl font-black tracking-tighter">${total.toFixed(2)}</span>
                    </div>
                    </div>
                </div>
                {/* Decorative "Liquid" background element */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-black/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                </div>

                {/* Fulfillment Selector */}
                <div className="bg-white/5 border border-white/10 p-8 rounded-[40px] space-y-6">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#08CB00]">Collection Method</h3>
                    <div className="space-y-3">
                        <button onClick={() => setFulfillment('pickup')} className={`w-full flex justify-between items-center p-5 rounded-2xl border transition-all ${fulfillment === 'pickup' ? 'bg-white text-black border-white font-bold' : 'border-white/5 text-white/40'}`}>
                            <span className="text-xs uppercase">Home Pickup</span>
                            <span className="text-[10px] opacity-60">FREE</span>
                        </button>
                        <button onClick={() => setFulfillment('drop')} className={`w-full flex justify-between items-center p-5 rounded-2xl border transition-all ${fulfillment === 'drop' ? 'bg-white text-black border-white font-bold' : 'border-white/5 text-white/40'}`}>
                            <span className="text-xs uppercase">Local Hub Drop</span>
                            <span className="text-[10px] opacity-60">+50 Points</span>
                        </button>
                    </div>
                    
                    <button className="w-full bg-[#08CB00] text-black py-6 rounded-3xl font-black uppercase tracking-widest text-sm hover:scale-[1.02] transition-all shadow-[0_20px_40px_-15px_rgba(8,203,0,0.3)]">
                    Confirm Submission
                    </button>
                </div>

                {/* Community Milestone Marker */}
                <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-center">
                    <p className="text-[10px] text-white/30 font-medium">Join 412 others in <span className="text-white">Harare</span> who recycled this week.</p>
                </div>

            </div>


            </div>
    
    </>
    )
}