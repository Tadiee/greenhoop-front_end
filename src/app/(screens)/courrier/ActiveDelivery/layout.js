import CourrierHeader from "@/components/global components/header/courrierHeader";

export default function ActiveDeliveryLayout({ children }) {
  return (
    <>
      <CourrierHeader />
      {children}
    </>
  );
}
