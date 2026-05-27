import TechnicianHeader from "@/components/global components/header/technicianHeader"

export default function TechHomeLayout ({children}) {
    return (
        <>
            <TechnicianHeader />
            {children}
        </>
    )
}