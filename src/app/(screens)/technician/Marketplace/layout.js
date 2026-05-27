import TechnicianHeader from "@/components/global components/header/technicianHeader";

export default function TechnicianMarketplaceLayout({ children }) {
    return (
        <>
            <TechnicianHeader />
            {children}
        </>
    );
}
