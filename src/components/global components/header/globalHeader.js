import Image from "next/image"
import { inter } from "../../../fonts/fonts"
import { poppins } from "../../../fonts/fonts"
import {trykker} from "../../../fonts/fonts"

export default function GlobalHeader () {
    return (        
        <header className="flex flex-col h-[23%] w-full bg-[url('/img/headerpic8.png')] bg-cover bg-center  ">

            <div className="flex flex-row items-center justify-between h-[30%] w-full bg-white/10 backdrop-blur-xs p-2 rounded-xl ">
                {/* Left side */}
                <div className=" items-center justify-start w-[35%]">
                    <Image src="/img/brandLogo.png" alt="Logo"  width={70} height={70} className = "rounded-full "/>
                </div>

                {/* Center side */}
                <div className="flex h-full items-center justify-center bg-white/50 p-2 w-[20%] rounded-xl">
                    <div className={`text-2xl font-bold text-black tracking-wide ${poppins.className} flex flex-row`}>green<h1 className={`text-2xl font-bold text-accent-green tracking-wide ${poppins.className}`}>hoop</h1></div>
                </div>

                {/* Right side */}
                <div className="flex h-full items-center justify-around w-[38%] bg-white rounded-xl ">
                    <button className="flex h-1/2 items-center justify-center  p-2 rounded-xl hover:bg-light-green hover:scale-110 transition-all duration-300 ">
                        <p className="text-accent-green tracking-wide text-xs">Home</p>
                    </button>
                    <button className="flex h-1/2 items-center justify-center  p-2 rounded-xl hover:bg-light-green hover:scale-110 transition-all duration-300">
                        <p className="text-accent-black tracking-wide text-xs">Submit</p>
                    </button>
                    <button className="flex h-1/2 items-center justify-center p-2 rounded-xl hover:bg-light-green hover:scale-110 transition-all duration-300">
                        <p className="text-black tracking-wide text-xs">Promiximity</p>
                    </button>
                    <button className="flex h-1/2 items-center justify-center p-2 rounded-xl hover:bg-light-green hover:scale-110 transition-all duration-300">
                        <p className="text-black tracking-wide text-xs">Incentives</p>
                    </button>
                    <button className="flex h-1/2 items-center justify-center p-2 rounded-xl hover:bg-light-green hover:scale-110 transition-all duration-300">
                        <p className="text-black tracking-wide text-xs">Marketplace</p>
                    </button>
                    <button className="flex h-1/2 items-center justify-center bg-blue-700 p-2 rounded-xl hover:scale-110 transition-all duration-300">
                        <p className="text-accent-white tracking-wide text-xs">Contributions</p>
                    </button>
                    <button className="flex h-1/2 items-center justify-center border-1  p-2 rounded-xl hover:scale-110 transition-all duration-300">
                        <p className="text-black tracking-wide text-xs">Settings</p>
                    </button>
                    <button className="flex h-full items-center justify-between  p-1 rounded-xl space-x-2 ml-8 ">
                        <img src="/img/headIcon.png" alt="Logo"  className = "rounded-full h-full w-[45%] border-2 border-green"/>
                        <p className="text-black tracking-wide text-xs">Tadiee </p>
                    </button>

                </div>
            </div>

            <div className="flex flex-col items-center justify-around p-2 h-[65%] w-full">
                <h1 className={`text-4xl text-green tracking-wide font-bold ${poppins.className}`}>Closing the Loop</h1>
                <p className={`text-green`}>Redefining sustainability through innovation and transparency. <br/> A look into the GreenHoop brand and our projected environmental impact.</p>
                
            </div>
        </header>
    )
}