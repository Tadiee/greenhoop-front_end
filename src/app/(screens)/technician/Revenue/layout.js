import TechnicianHeader from "@/components/global components/header/technicianHeader";

export default function TechRevenueLayout({ children }) {
    return (
    <>
        <TechnicianHeader />
        {children}
    </>
    );
}