"use client"
import { useState } from "react"
import dynamic from "next/dynamic"
import RightContainer from "./rightContainer"

const LeftContainer = dynamic(() => import("./leftContainer"), { ssr: false })

export default function CombinedContainer () {
    const [analysisData, setAnalysisData] = useState(null);
    const [recommendationData, setRecommendationData] = useState(null);

    return (
        <>
        <LeftContainer onAnalysisComplete={setAnalysisData} onRecommendationComplete={setRecommendationData} analysisData={analysisData} />
        <RightContainer analysisData={analysisData} recommendationData={recommendationData} />
        </>
    )
}