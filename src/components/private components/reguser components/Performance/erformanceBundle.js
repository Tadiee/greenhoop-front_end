"use client"
import { useState } from 'react';
import PerfomanceBottomContainer from "./bottomContainer"
import PerfomanceMiddleContainer from "./middleContainer"
import PerfomanceTopContainer from "./topContainer"
import NewListingModal from "./NewListingModal"

export default function PerfomanceBundle () {
    const [showListingModal, setShowListingModal] = useState(false);
    const [summary, setSummary] = useState(null);

    return (
        <>
            <PerfomanceTopContainer onOpenModal={() => setShowListingModal(true)} summary={summary} />
            <PerfomanceMiddleContainer onOpenModal={() => setShowListingModal(true)} />
            <PerfomanceBottomContainer onSummaryLoaded={setSummary} />
            <NewListingModal isOpen={showListingModal} onClose={() => setShowListingModal(false)} />
        </>
    )
}