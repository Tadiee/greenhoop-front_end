"use client"
import ProfileSettingsPage from '@/components/global components/ProfileSettings/ProfileSettingsPage';
import RecyclerHeader from '@/components/global components/recyclerHeader/header';

export default function RecyclerProfileSettings() {
  return (
    <ProfileSettingsPage
      role="recycler"
      header={RecyclerHeader}
      homeHref="/recycler/Home"
    />
  );
}
