"use client"
import React, { useState } from 'react';
import { Mail, Lock, EyeOff, Eye, Leaf, ChevronDown } from 'lucide-react';
import { useRole } from '@/app/RoleConext';
import { useRouter } from 'next/navigation';



function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
   const router = useRouter();

  const roles = [
    'Reguser',
    'Courrier',
    'Technician',
    'Recycler',
    'Receiver'
  ];
  
  // Pull in the global setRole function
  const { setRole } = useRole(); 

  const handleAuthSubmit = (e) => {
    e.preventDefault(); // Prevent page reload
    
    // Save the role globally!
    setRole(selectedRole);

    // Continue with your actual login logic here...
    // e.g., router.push('/dashboard');
    console.log(`Logged in as ${selectedRole}`);

    const getBaseUrl = () => {
      if (!selectedRole) return '/'; // Fallback if no role is set
      return `/${selectedRole.toLowerCase().replace(' ', '-')}`;
    };
  
    const baseUrl = getBaseUrl();
   
    router.push(`${baseUrl}/Home`);
        
  }; 


  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#121212] font-sans relative overflow-hidden px-4">
      
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#08CB00_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.02] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#08CB00]/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Main Auth Container */}
      <div className="w-full max-w-md relative z-10">
        
        {/* Logo Header */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="bg-[#08CB00] p-2 rounded-full shadow-[0_0_20px_rgba(8,203,0,0.4)] mb-4">
            <Leaf size={24} className="text-black fill-black" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-white">
            green<span className="text-[#08CB00]">hoop</span>
          </h1>
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">
            Access your node
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-[#1A1A1A] border border-white/5 rounded-[32px] p-8 shadow-2xl backdrop-blur-xl">
          
          {/* Tabs (Login / Sign Up) */}
          <div className="flex mb-8 border-b border-white/10 relative">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 pb-4 text-xs font-black uppercase tracking-widest transition-colors ${isLogin ? 'text-[#08CB00]' : 'text-white/40 hover:text-white'}`}
            >
              Log In
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 pb-4 text-xs font-black uppercase tracking-widest transition-colors ${!isLogin ? 'text-[#08CB00]' : 'text-white/40 hover:text-white'}`}
            >
              Sign Up
            </button>
            {/* Active Tab Indicator */}
            <div 
              className={`absolute bottom-0 w-1/2 h-[2px] bg-[#08CB00] rounded-t-full transition-transform duration-300 ease-out shadow-[0_0_10px_#08CB00] ${isLogin ? 'translate-x-0' : 'translate-x-full'}`}
            ></div>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleAuthSubmit}>
            
            {/* Role Selector */}
            <div>
              <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1 block mb-2">Account Role</label>
              <div className="relative">
                <select 
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:border-[#08CB00] focus:ring-1 focus:ring-[#08CB00] transition-all appearance-none cursor-pointer"
                  required
                >
                  <option value="" disabled className="text-white/40">Select your role...</option>
                  {roles.map((role) => (
                    <option key={role} value={role} className="bg-[#1A1A1A] text-white">
                      {role}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1 block mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                  <Mail size={16} />
                </div>
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  className="w-full bg-black/50 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-sm font-bold text-white placeholder-white/20 focus:outline-none focus:border-[#08CB00] focus:ring-1 focus:ring-[#08CB00] transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1 block mb-2">Password</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                  <Lock size={16} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="w-full bg-black/50 border border-white/10 rounded-xl pl-11 pr-12 py-3.5 text-sm font-bold text-white placeholder-white/20 focus:outline-none focus:border-[#08CB00] focus:ring-1 focus:ring-[#08CB00] transition-all"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password (Only show on Login) */}
            {isLogin && (
              <div className="flex items-center justify-between mt-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="w-4 h-4 rounded border border-white/20 bg-black/50 flex items-center justify-center group-hover:border-[#08CB00] transition-colors relative">
                    <input type="checkbox" className="opacity-0 absolute inset-0 cursor-pointer peer" />
                    <svg className="w-2.5 h-2.5 text-transparent peer-checked:text-[#08CB00] pointer-events-none transition-colors" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-[10px] font-bold text-white/40 group-hover:text-white transition-colors">Remember me</span>
                </label>
                <a href="#" className="text-[10px] font-bold text-[#08CB00] hover:text-[#07b300] transition-colors">
                  Forgot Password?
                </a>
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full mt-4 bg-[#08CB00] hover:bg-[#07b300] text-black py-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all shadow-[0_0_20px_rgba(8,203,0,0.2)]"
              
            >
              {isLogin ? 'Access Account' : 'Create Account'}
            </button>

          </form>
        </div>

        {/* Footer info */}
        <p className="text-center text-[9px] font-bold text-white/30 uppercase tracking-widest mt-8">
          Secure node connection • GreenHoop v2.4
        </p>

      </div>
    </div>
  );
}

export default AuthPage;