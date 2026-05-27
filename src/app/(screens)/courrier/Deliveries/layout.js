import CourrierHeader from "@/components/global components/header/courrierHeader";

export default function DeliveriesLayout({ children }) {
  return (
    <>
      <CourrierHeader />
      {children}
    </>
  );
}