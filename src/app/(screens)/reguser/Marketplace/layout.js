import AlternateHeader from "@/components/global components/header/alternateHeader"

export default function MarketplaceLayout ({children}) {
    return(
        <>
            <AlternateHeader />
            {children}
        </>
        
    )
}