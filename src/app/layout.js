import "./globals.css";
import { google_sans } from "@/fonts/fonts";
import { RoleProvider } from "./RoleConext";

export const metadata = {
  title: "GreenHoop",
  description: "An e-waste management platform",
  
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <RoleProvider>
      <body className={`h-screen w-screen  overflow-hidden ${google_sans.className}`}>
          {children}
      </body>
      </RoleProvider>
    </html>
  );
}
