import { inter, poppins } from "../../../fonts/fonts";
import { MdSupportAgent, MdEmail } from "react-icons/md";
import { MdInsertChart } from "react-icons/md";
import { GoArrowUpRight } from "react-icons/go";
import { FiPhone } from "react-icons/fi";
import { FaInfoCircle } from "react-icons/fa";
import { RiCoinsFill } from "react-icons/ri";

/**
 * Main Footer Component
 * Layout: 3-Column flexbox (Features | Branding | Contact/About)
 */
export default function Footer () { 
    return(
        <footer className="h-full w-full flex flex-row items-center justify-around space-x-2">
            
            {/* COLUMN 1: PLATFORM FEATURES QUICK LINKS */}
            <div className="flex flex-row items-center justify-center space-y-2 w-1/3 h-full p-1 ">
                
                {/* Feature Label Badge */}
                <h1 className={`text-xs ${inter.className} text-blue-500 tracking-wide bg-blue-200 p-1 rounded-lg w-[10%]  `}>Features</h1>

                {/* Features Card Container */}
                <div className=" flex flex-row items-center justify-center w-full h-full w-[90%] p-1 space-x-2">

                    {/* Rewards Card: Light theme with green accent */}
                    <div className="flex flex-col items-start justify-around space-y-1 w-1/3 h-full p-2 bg-white rounded-lg hover:bg-blue-200">
                        <div className="flex flex-row items-center justify-between space-x-2 w-full ">
                          <RiCoinsFill className="text-2xl text-black" />
                          <GoArrowUpRight className="text-sm text-blue-500" />
                        </div>
                        <h1 className={`text-xl ${inter.className} text-accent-green tracking-wide rounded-lg font-bold`}>Rewards</h1>
                    </div>

                    {/* Insights Card: Brand-colored theme */}
                    <div className="flex flex-col items-start justify-around space-y-1 w-1/3 h-full p-2 bg-accent-green rounded-lg hover:bg-blue-200">
                        <div className="flex flex-row items-center justify-between space-x-2 w-full ">
                          <MdInsertChart className="text-2xl text-black" />
                          <GoArrowUpRight className="text-sm text-white" />
                        </div>
                        <h1 className={`text-xl ${inter.className} text-white tracking-wide rounded-lg font-bold`}>Insights</h1>
                    </div>

                    {/* Support Card: Dark theme */}
                    <div className="flex flex-col items-start justify-around space-y-1 w-1/3 h-full p-2 bg-black rounded-lg hover:bg-blue-200">
                        <div className="flex flex-row items-center justify-between space-x-2 w-full ">
                          <MdSupportAgent className="text-2xl text-accent-green" />
                          <GoArrowUpRight className="text-sm text-blue-500" />
                        </div>
                        <h1 className={`text-xl ${inter.className} text-white tracking-wide rounded-lg font-bold`}>24/7 Support</h1>
                    </div>

                </div>
            </div>

            {/* COLUMN 2: BRANDING AND COPYRIGHT */}
            <div className="flex flex-col items-center justify-center space-y-2 w-1/3 h-full bg-white p-2">
                <h1 className="text-black text-sm font-bold">Green<span className="text-accent-green">Hoop</span></h1>
                <p className="text-black text-xs text-center">
                    Copyright © 2025 GreenHoop. <br />
                    <span className="text-accent-green">All rights reserved.</span>
                </p>
            </div>

            {/* COLUMN 3: CONTACT INFORMATION AND MISSION STATEMENT */}
            <div className="flex flex-row items-center justify-between w-1/3 h-full space-x-2 p-1">
                
                {/* Contact Us Card: Dark theme with nested flex for details */}
                <div className="flex flex-col items-start justify-center p-2 rounded-lg w-1/2 h-full space-y-1 bg-black">
                    <h2 className={`flex items-center gap-1 text-sm ${inter.className} font-semibold text-accent-green`}>
                        <MdSupportAgent className="text-base"/>Contact&nbsp;Us
                    </h2>
                    <div className="flex flex-row items-center space-x-2 w-full h-full">
                        <p className="flex items-center gap-1 text-[10px] text-gray-500"><MdEmail className="text-xs"/>support@greenhoop.io</p>
                        <p className="flex items-center gap-1 text-[10px] text-gray-500"><FiPhone className="text-xs"/>+27&nbsp;11&nbsp;123&nbsp;4567</p>
                    </div>
                    {/* External Mail Link */}
                    <a href="mailto:support@greenhoop.io" className="text-[10px] flex items-center gap-1 text-accent-green underline hover:text-blue-800">
                        <GoArrowUpRight className="text-xs"/>Chat
                    </a>
                </div>

                {/* About Us Card: Clean white theme with mission text */}
                <div className="flex flex-col items-start justify-center p-2 rounded-lg h-full w-1/2 space-y-2 bg-white">
                    <h2 className={`flex items-center gap-1 text-sm ${inter.className} font-semibold text-accent-green`}>
                        <FaInfoCircle className="text-base"/>About&nbsp;Us
                    </h2>
                    <p className="text-[10px] text-gray-700 leading-tight">
                        We close the loop on e-waste with rewards and transparency.
                    </p>
                </div>
                
            </div>
            
        </footer>
    )
}