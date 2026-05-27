import { Poppins } from "next/font/google";
import { DM_Sans } from "next/font/google";
import { Nova_Square } from "next/font/google";
import { Kavoon } from "next/font/google";
import { DM_Mono } from "next/font/google";
import {Inter} from "next/font/google";
import { Trykker } from "next/font/google";
import { Roboto } from "next/font/google";


export const poppins = Poppins ({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-poppins",
    
});

export const google_sans = DM_Sans ({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-google-sans",
})

export const nova_square =  Nova_Square ({
    subsets: ["latin"],
    weight: ["400"],
    variable: "--font-nova-square",
});

export const kavoon = Kavoon ({
    subsets: ["latin"],
    weight: ["400"],
    variable: "--font-kavoon",
})

export const google_sans_code = DM_Mono ({
    subsets: ["latin"],
    weight: ["400"],
    variable: "--font-google-sans-code",
})

export const inter = Inter ({
    subsets: ["latin"],
    weight: ["400"],
    variable: "--font-inter",
})

export const trykker = Trykker ({
    subsets: ["latin"],
    weight: ["400"],
    variable: "--font-trykker",
})

export const roboto = Roboto ({
    subsets: ["latin"],
    weight: ["400"],
    variable: "--font-roboto",
})