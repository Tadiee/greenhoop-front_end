import RecyclerHeader from "@/components/global components/recyclerHeader/header";

export default function ExpenditureLayout({ children }) {
  return (
    <>
      <RecyclerHeader />
      {children}
    </>
  );
}