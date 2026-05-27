"use client"
import React from 'react';
import { 
  CheckCircle2, Clock, Zap, MapPin, 
  Truck, ShieldCheck, Activity, BarChart3, Leaf,
  Smartphone, QrCode, ClipboardCheck, Globe, Check, MessageSquare
} from 'lucide-react';

function LandingPage() {
  return (
    // Added `scroll-smooth` for silky navigation jumps
    <div className="h-screen w-full bg-[#121212] text-white font-sans relative overflow-x-hidden overflow-y-auto scrollbar-thin selection:bg-[#08CB00] selection:text-black scroll-smooth">
      
      {/* Background Grid & Glows */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(#08CB00_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.03] pointer-events-none"></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#08CB00]/5 rounded-full blur-[150px] pointer-events-none opacity-50"></div>

      {/* Navigation Bar - Made Sticky */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-8 py-4 max-w-7xl mx-auto border-b border-white/5 bg-[#121212]/80 backdrop-blur-xl md:rounded-b-3xl mt-0 md:mt-2">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
          <div className="bg-[#08CB00] p-1.5 rounded-full shadow-[0_0_15px_rgba(8,203,0,0.4)]">
             <Leaf size={20} className="text-black fill-black" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white">
            green<span className="text-[#08CB00]">hoop</span>
          </span>
        </div>

        {/* Center Links (Updated with How it Works) */}
        <div className="hidden lg:flex items-center gap-8 text-xs font-black uppercase tracking-widest text-white/50">
          <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#solutions" className="hover:text-white transition-colors">Solutions</a>
          <a href="#network" className="hover:text-white transition-colors">Network</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-4 md:gap-6 text-xs font-black uppercase tracking-widest">
          <a href="/login" className="text-white hover:text-[#08CB00] transition-colors hidden sm:block">Sign in</a>
          <button className="bg-white/5 border border-white/10 text-white hover:bg-[#08CB00] hover:text-black hover:border-[#08CB00] px-6 py-2.5 rounded-full transition-all shadow-lg">
            Get Demo
          </button>
        </div>
      </nav>

      {/* Main Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-100px)] text-center px-4 pt-12 pb-32">
        {/* Center Floating Icon */}
        <div className="w-16 h-16 bg-[#1A1A1A] border border-white/10 rounded-2xl flex items-center justify-center mb-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-bounce relative group cursor-pointer">
           <div className="absolute inset-0 bg-[#08CB00]/20 rounded-2xl blur-xl group-hover:bg-[#08CB00]/40 transition-all duration-500"></div>
           <Leaf size={32} className="text-[#08CB00] relative z-10" />
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-[1.1] max-w-5xl z-20">
          Track, manage, and recycle <br className="hidden md:block" /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#08CB00] to-[#058a00]">
            all in one place
          </span>
        </h1>
        
        <p className="text-white/40 mt-6 text-sm md:text-base font-bold uppercase tracking-widest max-w-xl z-20">
          Efficiently manage your e-waste logistics, monitor fleet telemetry, and boost operational sustainability.
        </p>

        <button className="mt-10 bg-[#08CB00] text-black hover:bg-[#07b300] hover:-translate-y-1 transition-all duration-300 px-8 py-4 rounded-full text-sm font-black uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(8,203,0,0.3)] z-20">
          Get Free Demo
        </button>

        {/* --- FLOATING UI WIDGETS --- */}
        {/* Widget 1: Sticky Note Alert */}
        <div className="absolute top-[15%] left-[5%] xl:left-[10%] transform -rotate-6 hover:rotate-0 hover:-translate-y-4 transition-all duration-500 cursor-pointer hidden lg:block z-30">
          <div className="bg-[#FFEAA7] text-black p-5 rounded-bl-3xl rounded-tr-3xl rounded-tl-sm rounded-br-sm shadow-[10px_10px_30px_rgba(0,0,0,0.5)] w-56 relative overflow-hidden">
             <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-red-500 shadow-sm border border-red-700"></div>
             <p className="mt-4 text-xs font-black italic opacity-80">
               "System alert: Sector B storage is nearing 92% capacity. Route incoming couriers to Sector C."
             </p>
          </div>
          <div className="absolute -bottom-8 -right-8 bg-[#1A1A1A] border border-white/10 p-4 rounded-2xl shadow-2xl backdrop-blur-md">
             <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
               <CheckCircle2 size={20} className="text-blue-400" />
             </div>
          </div>
        </div>

        {/* Widget 2: Telemetry */}
        <div className="absolute top-[20%] right-[5%] xl:right-[12%] transform rotate-3 hover:rotate-0 hover:-translate-y-4 transition-all duration-500 cursor-pointer hidden md:block z-30">
          <div className="bg-[#1A1A1A] border border-white/10 p-5 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl w-64 relative">
             <div className="absolute -top-4 -left-4 w-12 h-12 bg-black border border-white/10 rounded-2xl shadow-xl flex items-center justify-center">
                <Clock size={20} className="text-[#08CB00]" />
             </div>
             <div className="pl-6">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Live Telemetry</h4>
                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                   <p className="text-xs font-black text-white">Courier #452</p>
                   <p className="text-[9px] font-bold text-[#08CB00] uppercase tracking-widest mt-1">ETA: 13:00 - 13:45</p>
                </div>
             </div>
          </div>
        </div>

        {/* Widget 3: Chart */}
        <div className="absolute bottom-[-5%] left-[2%] xl:left-[8%] transform rotate-2 hover:rotate-0 hover:-translate-y-4 transition-all duration-500 cursor-pointer hidden md:block z-30">
          <div className="bg-[#1A1A1A] border border-white/10 p-6 rounded-[32px] shadow-[0_30px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl w-72">
             <h4 className="text-sm font-black text-white tracking-tight mb-4">Today's Operations</h4>
             <div className="space-y-4">
                <div>
                   <div className="flex justify-between items-end mb-1">
                      <div className="flex items-center gap-2">
                         <div className="w-6 h-6 rounded-md bg-[#08CB00]/20 flex items-center justify-center"><Activity size={10} className="text-[#08CB00]" /></div>
                         <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">Handovers</span>
                      </div>
                      <span className="text-[9px] font-black text-[#08CB00]">92%</span>
                   </div>
                   <div className="h-1.5 w-full bg-white/5 rounded-full"><div className="h-full bg-[#08CB00] rounded-full w-[92%] shadow-[0_0_10px_rgba(8,203,0,0.4)]"></div></div>
                </div>
             </div>
          </div>
        </div>
      </main>

      {/* --- SCROLLABLE CONTENT SECTIONS --- */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 space-y-32 pb-32 relative z-10">
        
        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" className="scroll-mt-32 pt-16">
          <div className="text-center mb-16">
             <p className="text-[#08CB00] text-[10px] font-black uppercase tracking-[0.2em] mb-4">The Process</p>
             <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">How GreenHoop <span className="text-[#08CB00]">Works</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connecting Line (Hidden on mobile) */}
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-[2px] bg-white/5 z-0">
               <div className="h-full bg-gradient-to-r from-[#08CB00]/0 via-[#08CB00]/50 to-[#08CB00]/0"></div>
            </div>
            
            {[
              { step: '01', icon: Smartphone, title: 'Request', desc: 'Users request e-waste pickups via the client app.' },
              { step: '02', icon: Truck, title: 'Dispatch', desc: 'Couriers are auto-routed for efficient sector collection.' },
              { step: '03', icon: QrCode, title: 'Check-In', desc: 'Receivers scan QR codes at the hub to log materials instantly.' },
              { step: '04', icon: ClipboardCheck, title: 'Recycle', desc: 'Batches are securely checked-out to verified recyclers.' }
            ].map((item, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-24 h-24 bg-[#1A1A1A] border border-white/10 rounded-full flex items-center justify-center mb-6 shadow-xl group-hover:border-[#08CB00]/50 group-hover:shadow-[0_0_30px_rgba(8,203,0,0.2)] transition-all duration-500 relative">
                  <span className="absolute -top-2 -right-2 bg-black text-[#08CB00] border border-[#08CB00]/30 text-[10px] font-black px-2 py-1 rounded-full">{item.step}</span>
                  <item.icon size={32} className="text-white/60 group-hover:text-[#08CB00] transition-colors" />
                </div>
                <h3 className="text-xl font-black text-white mb-2">{item.title}</h3>
                <p className="text-xs font-bold text-white/40 leading-relaxed max-w-[200px]">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="scroll-mt-32">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
               <p className="text-[#08CB00] text-[10px] font-black uppercase tracking-[0.2em] mb-4">Core Capabilities</p>
               <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter max-w-lg">Everything you need to <span className="text-[#08CB00]">scale operations</span></h2>
            </div>
            <button className="text-xs font-black text-white uppercase tracking-widest hover:text-[#08CB00] transition-colors flex items-center gap-2">
              View all features &rarr;
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {[
               { title: "Live Telemetry", desc: "Monitor your courier fleet in real-time with GPS tracking and ETA predictions.", icon: MapPin },
               { title: "QR Material Logging", desc: "Instantly check-in and categorize incoming e-waste batches using our high-speed scanner.", icon: QrCode },
               { title: "Automated Manifests", desc: "Generate secure handover documents instantly when checking materials out to recyclers.", icon: ClipboardCheck },
               { title: "Capacity Alerts", desc: "Prevent bottlenecks with predictive storage alerts and facility utilization metrics.", icon: ShieldCheck },
               { title: "Advanced Analytics", desc: "Deep dive into your operational efficiency, revenue leakage, and throughput.", icon: BarChart3 },
               { title: "Partner Chat Hub", desc: "Communicate directly with assigned recyclers to negotiate and verify drop-offs.", icon: MessageSquare }
             ].map((feat, i) => (
               <div key={i} className="bg-[#1A1A1A] border border-white/5 p-8 rounded-[32px] hover:bg-white/5 hover:border-[#08CB00]/30 transition-all duration-300 group">
                  <div className="w-12 h-12 bg-black border border-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-[0_0_15px_rgba(8,203,0,0.3)] transition-all">
                    <feat.icon size={20} className="text-[#08CB00]" />
                  </div>
                  <h3 className="text-lg font-black text-white mb-3">{feat.title}</h3>
                  <p className="text-[11px] font-bold text-white/40 leading-relaxed uppercase tracking-widest">{feat.desc}</p>
               </div>
             ))}
          </div>
        </section>

        {/* SOLUTIONS SECTION */}
        <section id="solutions" className="scroll-mt-32">
          <div className="bg-[#1A1A1A] border border-white/5 rounded-[40px] p-8 md:p-16 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#08CB00]/10 rounded-full blur-[100px] pointer-events-none"></div>
             
             <div className="relative z-10 text-center mb-16">
               <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">Tailored <span className="text-[#08CB00]">Solutions</span></h2>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                <div className="p-6 bg-black/40 border border-white/5 rounded-[24px]">
                   <h3 className="text-xl font-black text-white mb-2">For Recyclers</h3>
                   <p className="text-xs font-bold text-white/40 mb-6 uppercase tracking-widest leading-relaxed">Secure a steady stream of pre-sorted materials with transparent tracking.</p>
                   <ul className="space-y-3 text-[11px] font-bold text-white/60">
                     <li className="flex items-center gap-2"><Check size={14} className="text-[#08CB00]" /> Direct Receiver Chat</li>
                     <li className="flex items-center gap-2"><Check size={14} className="text-[#08CB00]" /> Verified digital manifests</li>
                   </ul>
                </div>
                <div className="p-6 bg-[#08CB00] border border-[#08CB00] rounded-[24px] shadow-[0_20px_50px_rgba(8,203,0,0.2)] transform md:-translate-y-4">
                   <h3 className="text-xl font-black text-black mb-2">For Hub Managers</h3>
                   <p className="text-xs font-bold text-black/60 mb-6 uppercase tracking-widest leading-relaxed">Total oversight of your facility, from incoming couriers to outgoing capacity.</p>
                   <ul className="space-y-3 text-[11px] font-black text-black/80">
                     <li className="flex items-center gap-2"><Check size={14} className="text-black" /> Live facility dashboards</li>
                     <li className="flex items-center gap-2"><Check size={14} className="text-black" /> Auto QR input nodes</li>
                   </ul>
                </div>
                <div className="p-6 bg-black/40 border border-white/5 rounded-[24px]">
                   <h3 className="text-xl font-black text-white mb-2">For Couriers</h3>
                   <p className="text-xs font-bold text-white/40 mb-6 uppercase tracking-widest leading-relaxed">Maximize your trips with smart routing and a dedicated discovery interface.</p>
                   <ul className="space-y-3 text-[11px] font-bold text-white/60">
                     <li className="flex items-center gap-2"><Check size={14} className="text-[#08CB00]" /> Trip Discovery Map</li>
                     <li className="flex items-center gap-2"><Check size={14} className="text-[#08CB00]" /> Automated payouts</li>
                   </ul>
                </div>
             </div>
          </div>
        </section>

        {/* NETWORK SECTION */}
        <section id="network" className="scroll-mt-32 flex flex-col items-center text-center">
           <div className="w-20 h-20 bg-[#1A1A1A] border border-white/10 rounded-full flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(8,203,0,0.2)]">
             <Globe size={32} className="text-[#08CB00]" />
           </div>
           <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6">A growing <span className="text-[#08CB00]">ecosystem</span></h2>
           <p className="text-xs font-bold text-white/40 uppercase tracking-widest max-w-2xl mb-16 leading-relaxed">
             Join hundreds of hubs, couriers, and recyclers communicating seamlessly on the Navexa Logi-System infrastructure.
           </p>

           <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              <div>
                <h4 className="text-5xl font-black text-white tracking-tighter mb-2">124</h4>
                <p className="text-[10px] font-black text-[#08CB00] uppercase tracking-[0.2em]">Active Hubs</p>
              </div>
              <div className="hidden md:block w-px h-16 bg-white/10"></div>
              <div>
                <h4 className="text-5xl font-black text-white tracking-tighter mb-2">8.2<span className="text-2xl text-white/40">k</span></h4>
                <p className="text-[10px] font-black text-[#08CB00] uppercase tracking-[0.2em]">Tons Processed</p>
              </div>
              <div className="hidden md:block w-px h-16 bg-white/10"></div>
              <div>
                <h4 className="text-5xl font-black text-white tracking-tighter mb-2">99<span className="text-2xl text-white/40">%</span></h4>
                <p className="text-[10px] font-black text-[#08CB00] uppercase tracking-[0.2em]">Uptime SLA</p>
              </div>
           </div>
        </section>

        {/* PRICING SECTION */}
        <section id="pricing" className="scroll-mt-32 pb-16">
          <div className="text-center mb-16">
             <p className="text-[#08CB00] text-[10px] font-black uppercase tracking-[0.2em] mb-4">Transparent Pricing</p>
             <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">Scale at your <span className="text-[#08CB00]">own pace</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
             {/* Starter */}
             <div className="bg-[#1A1A1A] border border-white/5 rounded-[32px] p-8 flex flex-col">
               <h3 className="text-xl font-black text-white mb-2">Starter Node</h3>
               <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-6">For independent couriers</p>
               <div className="mb-8"><span className="text-4xl font-black text-white">Free</span></div>
               <ul className="space-y-4 text-xs font-bold text-white/60 mb-8 flex-1">
                 <li className="flex items-center gap-3"><Check size={14} className="text-[#08CB00]" /> Access Discovery Map</li>
                 <li className="flex items-center gap-3"><Check size={14} className="text-[#08CB00]" /> Standard Support</li>
                 <li className="flex items-center gap-3 opacity-50"><Check size={14} className="text-white/20" /> No Telemetry features</li>
               </ul>
               <button className="w-full bg-white/5 border border-white/10 text-white py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-colors">Get Started</button>
             </div>

             {/* Pro (Highlighted) */}
             <div className="bg-black border-2 border-[#08CB00] rounded-[32px] p-8 flex flex-col relative shadow-[0_20px_60px_rgba(8,203,0,0.15)] transform md:-translate-y-4">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#08CB00] text-black text-[9px] font-black uppercase tracking-widest px-4 py-1 rounded-b-xl">Most Popular</div>
               <h3 className="text-xl font-black text-white mb-2 mt-4">Hub Pro</h3>
               <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-6">For active facilities</p>
               <div className="mb-8"><span className="text-4xl font-black text-white">$299</span><span className="text-sm text-white/40 font-bold">/mo</span></div>
               <ul className="space-y-4 text-xs font-bold text-white/80 mb-8 flex-1">
                 <li className="flex items-center gap-3"><Check size={14} className="text-[#08CB00]" /> Unlimited QR Scanning</li>
                 <li className="flex items-center gap-3"><Check size={14} className="text-[#08CB00]" /> Full Telemetry Access</li>
                 <li className="flex items-center gap-3"><Check size={14} className="text-[#08CB00]" /> Automated Check-outs</li>
                 <li className="flex items-center gap-3"><Check size={14} className="text-[#08CB00]" /> Priority Chat Support</li>
               </ul>
               <button className="w-full bg-[#08CB00] text-black py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#07b300] transition-colors shadow-lg">Upgrade to Pro</button>
             </div>

             {/* Enterprise */}
             <div className="bg-[#1A1A1A] border border-white/5 rounded-[32px] p-8 flex flex-col">
               <h3 className="text-xl font-black text-white mb-2">Enterprise</h3>
               <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-6">For large scale recyclers</p>
               <div className="mb-8"><span className="text-4xl font-black text-white">Custom</span></div>
               <ul className="space-y-4 text-xs font-bold text-white/60 mb-8 flex-1">
                 <li className="flex items-center gap-3"><Check size={14} className="text-[#08CB00]" /> Custom API Integration</li>
                 <li className="flex items-center gap-3"><Check size={14} className="text-[#08CB00]" /> Dedicated Account Manager</li>
                 <li className="flex items-center gap-3"><Check size={14} className="text-[#08CB00]" /> White-labeled manifests</li>
               </ul>
               <button className="w-full bg-white/5 border border-white/10 text-white py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-colors">Contact Sales</button>
             </div>
          </div>
        </section>
      </div>
      
      {/* Simple Footer */}
      <footer className="border-t border-white/5 bg-black py-8 text-center text-[10px] font-bold text-white/30 uppercase tracking-widest relative z-10">
        <p>&copy; 2026 GreenHoop Logistics Node. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;