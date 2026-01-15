import PerfomanceBottomContainer from "./bottomContainer"
import PerfomanceMiddleContainer from "./middleContainer"
import PerfomanceTopContainer from "./topContainer"

export default function PerfomanceBundle () {
    return (
        <>
            <PerfomanceTopContainer />
            <PerfomanceMiddleContainer />
            <PerfomanceBottomContainer />
        </>
    )
}