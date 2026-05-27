import TechnicianHeader from "@/components/global components/header/technicianHeader";

export default function TechExpanditureLayout({ children }) {
    return (
    <>
        <TechnicianHeader />
        {children}
    </>
    );
}