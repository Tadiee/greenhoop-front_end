"use client"
import ProfileSettingsPage from '@/components/global components/ProfileSettings/ProfileSettingsPage';
import TechnicianHeader from '@/components/global components/header/technicianHeader';

export default function TechnicianProfileSettings() {
  return (
    <ProfileSettingsPage
      role="technician"
      header={TechnicianHeader}
      homeHref="/technician/Home"
    />
  );
}
