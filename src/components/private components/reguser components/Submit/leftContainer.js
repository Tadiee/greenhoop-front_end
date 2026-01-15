
"use client"
import { IoMdCamera } from "react-icons/io";
import { useState } from "react";

export default function LeftContainer () {
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

    
    const toggleAccessory = (acc) => {
        setFormData(prev => ({
        ...prev,
        accessories: prev.accessories.includes(acc) 
            ? prev.accessories.filter(a => a !== acc) 
            : [...prev.accessories, acc]
        }));
    };
    return (
        <>
                {/* LEFT COLUMN: THE SUBMISSION ENGINE */}
                <div className="lg:col-span-8 space-y-10">
                
                {/* Section 1: Device Identification */}
                <section className="space-y-6">
                    <div className="flex items-center gap-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#08CB00] text-black font-bold text-sm">1</span>
                    <h2 className="text-2xl text-white font-bold tracking-tight uppercase italic">Device Identification</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 p-8 rounded-3xl border border-white/10 text-white">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Category</label>
                            <select className="w-full bg-black border border-white/10 rounded-xl p-4 focus:border-[#08CB00] outline-none transition-all text-sm">
                            <option>Select Category</option>
                            <option value="laptop">High-End Computing (Laptops/PCs)</option>
                            <option value="mobile">Mobile Devices & Tablets</option>
                            <option value="audio">Audio & Wearables</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Brand & Model</label>
                            <input type="text" placeholder="e.g. Apple MacBook Pro M2" className="w-full bg-black border border-white/10 rounded-xl p-4 focus:border-[#08CB00] outline-none text-sm" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Serial Number / IMEI (Optional)</label>
                            <input type="text" placeholder="Enables faster verification & higher trust score" className="w-full bg-black border border-white/10 rounded-xl p-4 focus:border-[#08CB00] outline-none text-sm" />
                        </div>
                    </div>
                </section>

                <section className=" space-y-6 ">
                    
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4 text-white">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#08CB00] text-black font-bold text-sm">2</span>
                        <h2 className="text-2xl font-bold tracking-tight uppercase italic">Technical Audit</h2>
                        </div>
                        
                        <span className="text-[10px] bg-[#08CB00]/20 text-[#08CB00] px-3 py-1 rounded-full font-bold uppercase">Verification Required</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-white/5 border border-white/10 rounded-[32px] space-y-8 text-white">
                    {/* Power State */}
                    <div className="space-y-4">
                        <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Power-on Test</label>
                        <div className="flex gap-3 h-[80%] w-full items-center justify-center">
                        <button 
                            onClick={() => setFormData({...formData, powerOn: true})}
                            className={`flex-1 py-4  rounded-2xl border text-xs font-bold transition-all ${formData.powerOn === true ? 'bg-[#08CB00] text-black border-[#08CB00]' : 'border-white/10 hover:border-white/30'}`}
                        >
                            REACHES HOME SCREEN
                        </button>
                        <button 
                            onClick={() => setFormData({...formData, powerOn: false})}
                            className={`flex-1 py-4 rounded-2xl border text-xs font-bold transition-all ${formData.powerOn === false ? 'bg-red-500 text-white border-red-500' : 'border-white/10 hover:border-white/30'}`}
                        >
                            NO POWER / LOGO LOOP
                        </button>
                        </div>
                    </div>

                    {/* Security Lock Check */}
                    <div className="space-y-4">
                        <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Account Status</label>
                        <div className={`p-4 rounded-2xl border transition-all ${formData.accountsLoggedOut ? 'bg-[#08CB00]/10 border-[#08CB00]' : 'bg-black border-white/10'}`}>
                        <div className="flex items-start gap-3">
                            <input 
                            type="checkbox" 
                            className="mt-1 w-5 h-5 accent-[#08CB00]" 
                            checked={formData.accountsLoggedOut}
                            onChange={(e) => setFormData({...formData, accountsLoggedOut: e.target.checked})}
                            />
                            <div>
                            <p className="text-xs font-bold uppercase">iCloud / Google Logged Out</p>
                            <p className="text-[10px] text-white/40 leading-relaxed mt-1">Locked devices cannot be repurposed and will be valued as scrap.</p>
                            </div>
                        </div>
                        </div>
                    </div>

                    {/* Battery & Hardware Details */}
                    <div className="space-y-4 h-[100%]">
                        <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Battery Health: {formData.batteryHealth}%</label>
                            <div className="w-full h-[80%] flex items-center justify-center">
                                <input 
                                type="range" 
                                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#08CB00] " 
                                min="0" max="100" 
                                value={formData.batteryHealth}
                                onChange={(e) => setFormData({...formData, batteryHealth: e.target.value})}
                                />
                            </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Hardware Integrity</label>
                        <button 
                        onClick={() => setFormData({...formData, thirdPartyParts: !formData.thirdPartyParts})}
                        className={`w-full py-4 rounded-2xl border text-xs font-bold transition-all ${formData.thirdPartyParts ? 'border-[#08CB00] text-[#08CB00]' : 'border-white/10'}`}
                        >
                        {formData.thirdPartyParts ? 'HAS 3RD PARTY REPAIRS' : 'ALL ORIGINAL COMPONENTS'}
                        </button>
                    </div>
                    </div>
                </section>

                {/* Section 3: Condition */}
                <section className="space-y-6">
                    <div className="flex items-center gap-4 text-white">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#08CB00] text-black font-bold text-sm">3</span>
                    <h2 className="text-2xl font-bold tracking-tight uppercase italic">Condition & Add-ons</h2>
                    </div>
                    
                    <div className="bg-white/5 p-8 rounded-3xl border border-white/10 space-y-8 text-white">
                    {/* Condition Toggle */}
                    <div className="space-y-4">
                        <p className="text-sm font-medium text-white/40">What is the current state of the device?</p>
                        <div className="grid grid-cols-3 gap-3">
                        {['working', 'damaged', 'scrap'].map((c) => (
                            <button key={c} onClick={() => setFormData({...formData, condition: c})}
                            className={`py-4 rounded-2xl border text-xs font-bold uppercase tracking-widest transition-all ${formData.condition === c ? 'bg-[#08CB00] border-[#08CB00] text-black' : 'border-white/10 text-white/40 hover:border-white/30'}`}>
                            {c}
                            </button>
                        ))}
                        </div>
                    </div>

                    {/* Accessories Checklist */}
                    <div className="space-y-4">
                        <p className="text-sm font-medium text-white/40">Included Accessories (Increases Value)</p>
                        <div className="flex flex-wrap gap-3">
                        {['Original Charger', 'Box', 'Cables', 'Warranty Card'].map((acc) => (
                            <button key={acc} onClick={() => toggleAccessory(acc)}
                            className={`px-6 py-2 rounded-full border text-[10px] font-bold uppercase transition-all ${formData.accessories.includes(acc) ? 'border-[#08CB00] text-[#08CB00] bg-[#08CB00]/10' : 'border-white/10 text-white/40'}`}>
                            {acc}
                            </button>
                        ))}
                        </div>
                    </div>
                    </div>
                </section>

                {/* STEP 4: DATA SECURITY & LOGISTICS */}
                <section className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4 text-white">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#08CB00] text-black font-bold text-sm">4</span>
                        <h2 className="text-2xl font-bold tracking-tight uppercase italic">Privacy & Logistics</h2>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:flex md:flex-row gap-8 p-8 bg-white/5 border border-white/10 rounded-[32px] space-y-8 text-white">

                    <div className="p-6 bg-black rounded-3xl border border-white/5 space-y-4 w-1/2 h-full">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-[#08CB00]">DATA DESTRUCTION</span>
                            <button className="text-[10px] text-white/40 underline">VIEW WIPING GUIDE</button>
                        </div>
                        <p className="text-[10px] text-white/40">You will receive a <b>Digital Data Destruction Certificate</b> once the recycler processes your device.</p>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 accent-[#08CB00]" onChange={(e) => setFormData({...formData, dataWiped: e.target.checked})} />
                            <span className="text-xs font-medium">I have wiped my data</span>
                        </label>
                    </div>

                    <div className="p-6 bg-black rounded-3xl border border-white/5 space-y-4 w-1/2 h-full">
                        <span className="text-xs font-bold text-[#08CB00]">PACKAGING ASSISTANT</span>
                        <p className="text-[10px] text-white/40">Protect your device during transit to maintain the estimated value.</p>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 accent-[#08CB00]" onChange={(e) => setFormData({...formData, requestBox: e.target.checked})} />
                            <span className="text-xs font-medium">Send me a GreenHoop Eco-Box</span>
                        </label>
                    </div>
                    </div>
                </section>

                {/* Section 5: Media */}
                <section className="space-y-6">
                    <div className="flex items-center gap-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#08CB00] text-black font-bold text-sm">5</span>
                    <h2 className="text-2xl font-bold tracking-tight uppercase text-white italic">Verification</h2>
                    </div>
                    
                    <div className="bg-white/5 p-8 rounded-3xl border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-8">

                    <h2 className="text-xs font-bold text-white/40 uppercase tracking-[0.2em]">Required Media Verification</h2>
                    <div className="grid grid-cols-3 gap-4 md:col-span-2 flex items-center justify-center" >
                        {['FRONT (Screen On)', 'BACK (Serial No.)', 'PORTS / DAMAGE'].map(label => (
                            <div key={label} className="aspect-square bg-black border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-[#08CB00]/5 hover:border-[#08CB00]/40 transition-all cursor-pointer">
                            <span className="text-xl"> <IoMdCamera className="text-white" size={24} /></span>
                            <span className="text-[8px] text-white/80 uppercase text-center px-2">{label}</span>
                            </div>
                        ))}
                    </div>


                    <div className="space-y-4 flex flex-col justify-center items-center md:col-span-2">
                        <div className="flex items-start gap-3 p-4 bg-black rounded-2xl border border-[#08CB00]/20">
                        <input type="checkbox" className="mt-1 accent-[#08CB00]" onChange={(e) => setFormData({...formData, dataWiped: e.target.checked})} />
                        <div className="space-y-1">
                            <p className="text-xs font-bold uppercase text-[#08CB00]">Data Erasure Confirmation</p>
                            <p className="text-[10px] text-white/40 leading-relaxed">I confirm that all personal data has been removed from this device.</p>
                        </div>
                        </div>
                    </div>
                    </div>
                    
                    {/* Action Footer */}
                    <div className="flex justify-between items-center pt-4">
                        <button className="text-white/30 text-xs font-bold uppercase hover:text-white transition-all underline underline-offset-8">Cancel Entry</button>
                        <div className="flex gap-4">
                            <button className="px-8 py-4 rounded-full border border-white/10 text-xs font-bold uppercase hover:bg-white/5 transition-all">Save Draft</button>
                            <button className="px-8 py-4 rounded-full bg-white text-black text-xs font-bold uppercase hover:bg-[#08CB00] transition-all">Next Step</button>
                        </div>
                    </div>
                </section>
                </div>
            
        </>
        
    )
}