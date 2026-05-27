import TechnicianHeader from "@/components/global components/header/technicianHeader";

export default function ServiceLayout({ children }) {
    return (
        <>
            <TechnicianHeader />
            {children}
        </>
    );
}