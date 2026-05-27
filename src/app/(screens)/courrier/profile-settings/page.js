"use client"
import ProfileSettingsPage from '@/components/global components/ProfileSettings/ProfileSettingsPage';
import CourrierHeader from '@/components/global components/header/courrierHeader';

export default function CourierProfileSettings() {
  return (
    <ProfileSettingsPage
      role="courier"
      header={CourrierHeader}
      homeHref="/courrier/Home"
    />
  );
}
