import CourrierHeader from "@/components/global components/header/courrierHeader"

export default function CourrierVehicleManagementLayout ({children}) {
    return (
        <> 
        <CourrierHeader />
        {children}
        </>
    )
}