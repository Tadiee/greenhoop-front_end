"use client"
import ProfileSettingsPage from '@/components/global components/ProfileSettings/ProfileSettingsPage';
import ReceiverHeader from '@/components/global components/header/receiverHeader';

export default function ReceiverProfileSettings() {
  return (
    <ProfileSettingsPage
      role="receiver"
      header={() => <ReceiverHeader subHeader="Receiver" />}
      homeHref="/receiver/Home"
    />
  );
}
