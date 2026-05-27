import RecyclerHeader from "@/components/global components/recyclerHeader/header";

export default function RecyclerHomeLayout({ children }) {
  return (
    <>
      <RecyclerHeader />
      {children}
    </>
  );
}