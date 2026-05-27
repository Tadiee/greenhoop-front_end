"use client"
import React, { useState, useEffect } from 'react';
import {
  User, Phone, MapPin, Save, LogOut, Loader2, CheckCircle2,
  AlertCircle, ChevronRight, Settings, Wrench, Truck, Leaf,
  Building, ToggleLeft, ToggleRight, Weight, Star, Clock,
  Navigation, DollarSign, Activity
} from 'lucide-react';
import Link from 'next/link';

const API_BASE = 'http://127.0.0.1:8000';

/* ── Reusable field components ── */
function InputField({ label, name, value, onChange, type = 'text', icon: Icon, readOnly = false }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[9px] font-black uppercase tracking-widest text-white/30">{label}</label>
      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#08CB00] transition-colors">
            <Icon size={14} />
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value ?? ''}
          onChange={e => onChange(name, e.target.value)}
          readOnly={readOnly}
          className={`w-full bg-white/[0.03] border border-white/8 rounded-2xl py-3.5 ${Icon ? 'pl-11' : 'pl-4'} pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[#08CB00]/50 focus:border-[#08CB00]/50 transition-all ${readOnly ? 'opacity-40 cursor-not-allowed' : ''}`}
        />
      </div>
    </div>
  );
}

function ToggleField({ label, description, name, value, onChange }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/8 rounded-2xl hover:border-white/15 transition-all">
      <div>
        <p className="text-sm font-bold text-white capitalize">{label}</p>
        {description && <p className="text-[10px] text-white/30 mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(name, !value)}
        className={`w-12 h-6 rounded-full transition-all relative ${value ? 'bg-[#08CB00]' : 'bg-white/10'}`}
      >
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow ${value ? 'left-7' : 'left-1'}`} />
      </button>
    </div>
  );
}

function SectionTitle({ children }) {
  return <p className="text-[9px] font-black uppercase tracking-widest text-white/25 mt-2 mb-1">{children}</p>;
}

/* ── Role field configs ── */
const ROLE_CONFIG = {
  reguser: {
    apiGet:   null,
    apiPatch: `${API_BASE}/api/auth/users/me/profile`,
    useUserId: false,
    fields: (form, onChange) => (
      <>
        <SectionTitle>Personal</SectionTitle>
        <div className="grid grid-cols-2 gap-4">
          <InputField label="First Name"   name="first_name"   value={form.first_name}   onChange={onChange} icon={User} />
          <InputField label="Last Name"    name="last_name"    value={form.last_name}    onChange={onChange} icon={User} />
        </div>
        <InputField label="Phone Number"  name="phone_number" value={form.phone_number} onChange={onChange} icon={Phone} />
        <InputField label="Address"       name="address"      value={form.address}      onChange={onChange} icon={MapPin} />
        <div className="grid grid-cols-2 gap-4">
          <InputField label="City"         name="city"         value={form.city}         onChange={onChange} icon={MapPin} />
          <InputField label="Postal Code"  name="postal_code"  value={form.postal_code}  onChange={onChange} />
        </div>
        <SectionTitle>Preferences</SectionTitle>
        <ToggleField label="Notifications Enabled" name="notification_enabled" value={form.notification_enabled} onChange={onChange} />
        <SectionTitle>Read-only Stats</SectionTitle>
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Total Submissions" name="total_submissions" value={form.total_submissions} onChange={onChange} readOnly />
          <InputField label="Total Earned"      name="total_amount_earned" value={form.total_amount_earned} onChange={onChange} readOnly />
        </div>
      </>
    ),
    defaultForm: { first_name: '', last_name: '', phone_number: '', address: '', city: '', postal_code: '', notification_enabled: true, preferred_submission_type: '', total_submissions: '', total_amount_earned: '' },
  },

  technician: {
    apiGet:   null,
    apiPatch: (userId) => `${API_BASE}/api/auth/technicians/me/profile?userID=${userId}`,
    useUserId: true,
    fields: (form, onChange) => (
      <>
        <SectionTitle>Personal</SectionTitle>
        <div className="grid grid-cols-2 gap-4">
          <InputField label="First Name"   name="first_name"   value={form.first_name}   onChange={onChange} icon={User} />
          <InputField label="Last Name"    name="last_name"    value={form.last_name}    onChange={onChange} icon={User} />
        </div>
        <InputField label="Phone Number"  name="phone_number" value={form.phone_number} onChange={onChange} icon={Phone} />
        <SectionTitle>Service</SectionTitle>
        <InputField label="Expertise (comma-separated)" name="expertise" value={Array.isArray(form.expertise) ? form.expertise.join(', ') : (form.expertise || '')} onChange={(n, v) => onChange(n, v)} icon={Wrench} />
        <div className="grid grid-cols-3 gap-4">
          <InputField label="Service Radius (km)" name="service_radius_km"  value={form.service_radius_km}  onChange={onChange} type="number" icon={Navigation} />
          <InputField label="Max Jobs / Day"       name="max_jobs_per_day"   value={form.max_jobs_per_day}   onChange={onChange} type="number" />
          <InputField label="Years Experience"     name="years_of_experience" value={form.years_of_experience} onChange={onChange} type="number" icon={Clock} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Latitude"  name="latitude"  value={form.latitude}  onChange={onChange} type="number" />
          <InputField label="Longitude" name="longitude" value={form.longitude} onChange={onChange} type="number" />
        </div>
        <SectionTitle>Status</SectionTitle>
        <ToggleField label="Available for Jobs" name="is_available" value={form.is_available} onChange={onChange} />
        <SectionTitle>Read-only</SectionTitle>
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Verified"       name="is_verified"     value={form.is_verified ? 'Yes' : 'No'} onChange={onChange} readOnly />
          <InputField label="Average Rating" name="average_rating"  value={form.average_rating} onChange={onChange} readOnly icon={Star} />
        </div>
      </>
    ),
    defaultForm: { first_name: '', last_name: '', phone_number: '', expertise: '', certifications: '', years_of_experience: 0, service_radius_km: 0, max_jobs_per_day: 5, is_available: true, latitude: '', longitude: '', is_verified: false, average_rating: '' },
  },

  courier: {
    apiGet:   null,
    apiPatch: (userId) => `${API_BASE}/api/auth/couriers/me/profile?userID=${userId}`,
    useUserId: true,
    fields: (form, onChange) => (
      <>
        <SectionTitle>Company</SectionTitle>
        <InputField label="Company Name"        name="company_name"        value={form.company_name}        onChange={onChange} icon={Building} />
        <InputField label="Company Description" name="company_description" value={form.company_description} onChange={onChange} />
        <InputField label="Phone Number"        name="phone_number"        value={form.phone_number}        onChange={onChange} icon={Phone} />
        <InputField label="Address"             name="address"             value={form.address}             onChange={onChange} icon={MapPin} />
        <InputField label="Service Area"        name="service_area"        value={form.service_area}        onChange={onChange} icon={Navigation} />
        <SectionTitle>Capacity & Targets</SectionTitle>
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Max Weight (kg)"   name="max_weight_capacity_kg" value={form.max_weight_capacity_kg} onChange={onChange} type="number" icon={Weight} />
          <InputField label="Daily Target (USD)" name="daily_target_usd"       value={form.daily_target_usd}       onChange={onChange} type="number" icon={DollarSign} />
        </div>
        <SectionTitle>Location</SectionTitle>
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Latitude"  name="latitude"  value={form.latitude}  onChange={onChange} type="number" />
          <InputField label="Longitude" name="longitude" value={form.longitude} onChange={onChange} type="number" />
        </div>
        <SectionTitle>Status</SectionTitle>
        <div className="grid grid-cols-2 gap-4">
          <ToggleField label="Active"  name="is_active"  value={form.is_active}  onChange={onChange} />
          <ToggleField label="Online"  name="is_online"  value={form.is_online}  onChange={onChange} />
        </div>
        <SectionTitle>Read-only</SectionTitle>
        <InputField label="Current Load (kg)" name="current_load_kg" value={form.current_load_kg} onChange={onChange} readOnly icon={Weight} />
      </>
    ),
    defaultForm: { company_name: '', company_description: '', phone_number: '', address: '', service_area: '', max_weight_capacity_kg: 0, daily_target_usd: 0, latitude: '', longitude: '', is_active: true, is_online: true, current_load_kg: '' },
  },

  recycler: {
    apiGet:   null,
    apiPatch: (userId) => `${API_BASE}/api/auth/recyclers/me/profile?userID=${userId}`,
    useUserId: true,
    fields: (form, onChange) => (
      <>
        <SectionTitle>Facility</SectionTitle>
        <InputField label="Facility Name"        name="facility_name"        value={form.facility_name}        onChange={onChange} icon={Building} />
        <InputField label="Facility Description" name="facility_description" value={form.facility_description} onChange={onChange} />
        <InputField label="Phone Number"         name="phone_number"         value={form.phone_number}         onChange={onChange} icon={Phone} />
        <InputField label="Address"              name="address"              value={form.address}              onChange={onChange} icon={MapPin} />
        <InputField label="Max Weight (kg)"      name="max_weight_capacity_kg" value={form.max_weight_capacity_kg} onChange={onChange} type="number" icon={Weight} />
        <SectionTitle>Location</SectionTitle>
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Latitude"  name="latitude"  value={form.latitude}  onChange={onChange} type="number" />
          <InputField label="Longitude" name="longitude" value={form.longitude} onChange={onChange} type="number" />
        </div>
        <SectionTitle>Status</SectionTitle>
        <ToggleField label="Active" name="is_active" value={form.is_active} onChange={onChange} />
        <SectionTitle>Read-only</SectionTitle>
        <InputField label="Certified" name="is_certified" value={form.is_certified ? 'Yes' : 'No'} onChange={onChange} readOnly />
      </>
    ),
    defaultForm: { facility_name: '', facility_description: '', phone_number: '', address: '', max_weight_capacity_kg: 0, latitude: '', longitude: '', is_active: true, is_certified: false },
  },

  receiver: {
    apiGet:   null,
    apiPatch: `${API_BASE}/api/auth/receivers/me/profile`,
    useUserId: false,
    fields: (form, onChange) => (
      <>
        <SectionTitle>Facility</SectionTitle>
        <InputField label="Facility Name"        name="facility_name"        value={form.facility_name}        onChange={onChange} icon={Building} />
        <InputField label="Facility Description" name="facility_description" value={form.facility_description} onChange={onChange} />
        <InputField label="Phone Number"         name="phone_number"         value={form.phone_number}         onChange={onChange} icon={Phone} />
        <InputField label="Address"              name="address"              value={form.address}              onChange={onChange} icon={MapPin} />
        <InputField label="Max Weight (kg)"      name="max_weight_capacity_kg" value={form.max_weight_capacity_kg} onChange={onChange} type="number" icon={Weight} />
        <SectionTitle>Capabilities</SectionTitle>
        <div className="grid grid-cols-2 gap-4">
          <ToggleField label="Pickup Enabled"    name="pickup_enabled"    value={form.pickup_enabled}    onChange={onChange} />
          <ToggleField label="Drop-off Enabled"  name="drop_off_enabled"  value={form.drop_off_enabled}  onChange={onChange} />
        </div>
        <SectionTitle>Status</SectionTitle>
        <ToggleField label="Active" name="is_active" value={form.is_active} onChange={onChange} />
        <SectionTitle>Read-only</SectionTitle>
        <InputField label="Verified" name="is_verified" value={form.is_verified ? 'Yes' : 'No'} onChange={onChange} readOnly />
      </>
    ),
    defaultForm: { facility_name: '', facility_description: '', phone_number: '', address: '', max_weight_capacity_kg: 0, pickup_enabled: true, drop_off_enabled: true, is_active: true, is_verified: false },
  },
};

/* ── Main component ── */
export default function ProfileSettingsPage({ role, header: HeaderComponent, homeHref }) {
  const config = ROLE_CONFIG[role];
  const [form, setForm]       = useState(config.defaultForm);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [error, setError]     = useState(null);

  const userId = typeof window !== 'undefined' ? localStorage.getItem('user_id') : null;

  const handleChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const buildUrl = () => {
    const patch = config.apiPatch;
    return typeof patch === 'function' ? patch(userId) : patch;
  };

  const buildPayload = () => {
    const payload = { ...form };
    // Convert expertise string back to array for technician
    if (role === 'technician' && typeof payload.expertise === 'string') {
      payload.expertise = payload.expertise.split(',').map(s => s.trim()).filter(Boolean);
    }
    // Convert numeric strings to numbers
    ['latitude', 'longitude', 'max_weight_capacity_kg', 'daily_target_usd',
     'service_radius_km', 'max_jobs_per_day', 'years_of_experience'].forEach(k => {
      if (payload[k] !== '' && payload[k] != null) payload[k] = Number(payload[k]);
    });
    return payload;
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch(buildUrl(), {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload()),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        setError(data.message || data.error || 'Could not save profile. Please try again.');
      } else {
        if (data.data) setForm(prev => ({ ...prev, ...data.data }));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const initials = `${(form.first_name || form.company_name || form.facility_name || '?')[0] || '?'}`.toUpperCase();

  return (
    <div className="h-screen bg-[#0A0A0A] p-6 overflow-y-auto scrollbar-thin text-white font-sans">
      {HeaderComponent && <HeaderComponent />}

      <div className="max-w-3xl mx-auto px-6 py-6 pt-28">

        {/* Header card */}
        <div className="flex items-center gap-5 mb-8 p-5 bg-white/[0.03] border border-white/8 rounded-[28px]">
          <div className="w-16 h-16 rounded-[20px] bg-[#08CB00]/10 border border-[#08CB00]/30 flex items-center justify-center text-2xl font-black text-[#08CB00]">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-lg font-black text-white capitalize">
              {form.first_name && form.last_name
                ? `${form.first_name} ${form.last_name}`
                : form.company_name || form.facility_name || 'Your Profile'}
            </p>
            <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mt-0.5">{role} account</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#08CB00] animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-widest text-[#08CB00]">Active</span>
          </div>
        </div>

        {/* Fields */}
        <div className="bg-white/[0.02] border border-white/5 rounded-[28px] p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <p className="text-sm font-black text-white">Profile Settings</p>
            <Settings size={14} className="text-white/20" />
          </div>

          {config.fields(form, handleChange)}

          {/* Feedback */}
          {error && (
            <div className="flex items-start gap-2 px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/20">
              <AlertCircle size={14} className="text-red-400 shrink-0 mt-0.5" />
              <p className="text-[10px] text-red-400 font-bold leading-snug">{error}</p>
            </div>
          )}
          {saved && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#08CB00]/10 border border-[#08CB00]/20">
              <CheckCircle2 size={14} className="text-[#08CB00]" />
              <p className="text-[10px] text-[#08CB00] font-bold">Profile saved successfully.</p>
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 ${
              saving
                ? 'bg-white/5 border border-white/10 text-white/20 cursor-not-allowed'
                : 'bg-[#08CB00] text-black hover:bg-[#06b800] shadow-[0_0_20px_rgba(8,203,0,0.25)]'
            }`}
          >
            {saving ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : <><Save size={16} /> Save Changes</>}
          </button>
        </div>

        {/* Back link */}
        {homeHref && (
          <div className="mt-6 flex justify-center">
            <Link href={homeHref} className="text-[9px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors">
              ← Back to Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
