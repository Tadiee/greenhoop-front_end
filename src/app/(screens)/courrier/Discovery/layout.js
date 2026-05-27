import CourrierHeader from "@/components/global components/header/courrierHeader";

export default function DiscoveryLayout({ children }) {
    return (
        <>
            <CourrierHeader />
            {children}
        </>
    );
}