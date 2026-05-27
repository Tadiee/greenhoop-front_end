"use client"
import ProfileSettingsPage from '@/components/global components/ProfileSettings/ProfileSettingsPage';
import AlternateHeader from '@/components/global components/header/alternateHeader';

export default function ProfileSettings() {
  return (
    <ProfileSettingsPage
      role="reguser"
      header={AlternateHeader}
      homeHref="/reguser/Home"
    />
  );
}

function _OldProfileSettings() {
  const [activeTab, setActiveTab] = useState('personal');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: 'Tadiee',
    lastName: 'User',
    email: 'tadiee@example.com',
    phone: '+263 123 456 789',
    location: 'Harare, Zimbabwe',
    bio: 'Passionate about e-waste recycling and environmental sustainability',
    userLevel: 'Gold Contributor',
    totalRecycled: '250 kg',
    co2Saved: '450 kg',
    contributions: 45,
    language: 'English',
    currency: 'USD',
    timezone: 'Africa/Harare',
    notifications: {
      email: true, push: true, sms: false, marketing: false,
      collectionReminders: true, incentiveUpdates: true, environmentalTips: true
    },
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    showLocation: true,
    showRecyclingStats: true
  });

  const tabs = [
    { id: 'personal', label: 'Account', icon: User },
    { id: 'recycling', label: 'Impact Data', icon: Recycle },
    { id: 'preferences', label: 'Regional', icon: Globe },
    { id: 'notifications', label: 'Alerts', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'privacy', label: 'Privacy', icon: Eye }
  ];

  const handleInputChange = (section, field, value) => {
    if (section) {
      setFormData(prev => ({
        ...prev, [section]: { ...prev[section], [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  return (
    // Changed bg to deep dark gray, text to white
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans">
      <ReguserHeader />
      
      <div className="pt-24 max-w-[1400px] mx-auto px-6 pb-12">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3 space-y-4">
            {/* Sidebar retains black, border is refined for dark */}
            <div className="bg-black rounded-3xl p-6 text-white shadow-2xl shadow-black/30 border border-gray-800">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="relative group">
                  {/* Green border refined for pop on dark */}
                  <div className="w-24 h-24 rounded-full border-2 border-[#08CB00] p-1 mb-4 transition-transform group-hover:scale-105 duration-300">
                    <div className="w-full h-full bg-[#1A1A1A] rounded-full flex items-center justify-center text-2xl font-bold text-[#08CB00]">
                      {formData.firstName[0]}{formData.lastName[0]}
                    </div>
                  </div>
                  <button className="absolute bottom-4 right-0 w-8 h-8 bg-[#08CB00] rounded-full flex items-center justify-center text-black hover:scale-110 transition-all border-2 border-black">
                    <Camera size={14} />
                  </button>
                </div>
                <h2 className="text-xl font-bold text-white">{formData.firstName} {formData.lastName}</h2>
                <p className="text-gray-400 text-sm">{formData.userLevel}</p>
              </div>

              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive 
                          ? 'bg-[#08CB00] text-black shadow-lg shadow-[#08CB00]/20' 
                          : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon size={18} />
                      {tab.label}
                      {isActive && <ChevronRight size={14} className="ml-auto" />}
                    </button>
                  );
                })}
              </nav>

              <div className="mt-8 pt-8 border-t border-white/10">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-400/10 transition-all">
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            </div>
          </aside>

          {/* Content Area */}
          <main className="lg:col-span-9 space-y-6 relative z-10">
            
            {/* Quick Stats Header (Retains black, pops with green) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard icon={<Recycle className="text-[#08CB00]" />} label="Recycled" value={formData.totalRecycled} color="bg-black" />
              <StatCard icon={<TrendingUp className="text-[#08CB00]" />} label="Carbon Saved" value={formData.co2Saved} color="bg-black" />
              <StatCard icon={<Award className="text-[#08CB00]" />} label="Contribution Score" value={formData.contributions} color="bg-black" />
            </div>

            {/* Dynamic Content Card - Inverted to black, dark border */}
            <div className="bg-black rounded-3xl shadow-2xl shadow-black/10 border border-gray-800/70 overflow-hidden relative">
              <div className="p-8 border-b border-gray-800 flex justify-between items-center bg-black">
                <div>
                  <h3 className="text-2xl font-bold capitalize text-white">{activeTab} Settings</h3>
                  <p className="text-gray-400 text-sm">Update your information and account security</p>
                </div>
                <button 
                  onClick={() => console.log('Saved')}
                  className="bg-black text-[#08CB00] px-8 py-3 rounded-xl font-bold text-sm hover:scale-105 transition-all flex items-center gap-2 border border-[#08CB00]/50"
                >
                  <Save size={18} /> Save Changes
                </button>
              </div>

              {/* Scrollbar styled for dark mode if custom styles are enabled */}
              <div className="p-8 max-h-[600px] overflow-y-auto custom-scrollbar bg-black text-white">
                {activeTab === 'personal' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField label="First Name" value={formData.firstName} icon={<User size={18}/>} />
                      <InputField label="Last Name" value={formData.lastName} icon={<User size={18}/>} />
                    </div>
                    <InputField label="Email Address" value={formData.email} icon={<Mail size={18}/>} />
                    <InputField label="Mobile Phone" value={formData.phone} icon={<Phone size={18}/>} />
                    <InputField label="Current Location" value={formData.location} icon={<MapPin size={18}/>} />
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Bio / About Me</label>
                      {/* Dark gray bg, deep gray border, light text */}
                      <textarea 
                        className="w-full bg-[#1A1A1A] border border-gray-700 rounded-2xl p-4 focus:ring-2 focus:ring-[#08CB00] focus:border-transparent outline-none transition-all resize-none min-h-[120px] text-white"
                        defaultValue={formData.bio}
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="space-y-4 animate-in fade-in duration-500">
                    <h3 className="text-lg font-semibold text-white mb-4">Notification Preferences</h3>
                    {Object.entries(formData.notifications).map(([key, value]) => (
                      <ToggleSwitch 
                        key={key} 
                        label={key.replace(/([A-Z])/g, ' $1').trim()} 
                        description={`Manage ${key} delivery status`} 
                        active={value} 
                      />
                    ))}
                  </div>
                )}

                {/* Other tabs follow similar inverted clean pattern */}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

// Sub-components updated for dark theme
function StatCard({ icon, label, value, color }) {
  return (
    <div className={`${color} p-6 rounded-3xl text-white border border-gray-800 flex items-center gap-5 group transition-all`}>
      <div className="bg-white/5 p-4 rounded-2xl group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}

function InputField({ label, value, icon }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-wider text-gray-400">{label}</label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#08CB00] transition-colors">
          {icon}
        </div>
        {/* Dark gray bg, deep gray border, light text, custom style for light focus ring */}
        <input 
          type="text" 
          defaultValue={value}
          className="w-full bg-[#1A1A1A] border border-gray-700 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-[#08CB00] focus:border-transparent outline-none transition-all font-medium text-white placeholder-gray-500"
        />
      </div>
    </div>
  );
}

function ToggleSwitch({ label, description, active }) {
  const [isOn, setIsOn] = useState(active);
  return (
    // Dark gray bg, refined deep gray border, refined hover border color
    <div className="flex items-center justify-between p-5 bg-[#1A1A1A] rounded-2xl border border-gray-800 hover:border-[#08CB00]/30 transition-all">
      <div>
        <p className="font-bold text-white capitalize">{label}</p>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
      <button 
        onClick={() => setIsOn(!isOn)}
        className={`w-14 h-8 rounded-full transition-all relative ${isOn ? 'bg-[#08CB00]' : 'bg-gray-300'}`}
      >
        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${isOn ? 'left-7' : 'left-1 shadow-md'}`} />
      </button>
    </div>
  );
}