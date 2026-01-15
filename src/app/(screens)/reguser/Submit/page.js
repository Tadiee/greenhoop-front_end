"use client"
import AlternateHeader from "@/components/global components/header/alternateHeader"
import CombinedContainer from "@/components/private components/reguser components/Submit/combinedContainer"


export default function SubmitPage() {


    return(
        <div className="relative w-full h-full bg-black overflow-x-hidden overflow-y-auto scrollbar-thin">
            {/* --- NAVIGATION --- */}
            <AlternateHeader />

            {/* --- MAIN CONTENT --- */}
            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
                <CombinedContainer />
            </main>

        </div>
    )
}