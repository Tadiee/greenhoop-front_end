import ReguserHeader from "../../../../components/global components/header/reguserHeader"
import { google_sans } from "../../../../fonts/fonts"

/**
 * Root Dashboard Layout
 * ---------------------
 * This layout serves as the base wrapper for all pages within the dashboard.
 * It ensures the header is always visible and manages global viewport constraints.
 */
export default function DashboardLayout({ children }) {
  return (

      <>
          
      {/* The Body tag defines the global "Viewport" for the application:
          - h-screen / w-screen: Locks the app to the exact size of the user's monitor.
          - overflow-hidden: Critical for Dashboards. It prevents the whole browser 
            window from scrolling, allowing individual sections (like the Sidebar 
            or Notification Hub) to have their own independent scrollbars.
          - google_sans.className: Applies your primary branding font globally.
      */}
        
        {/* Persistent Navigation: Remains fixed at the top across all routes */}
        <ReguserHeader />

        {/* Page Content Injection:
            This is where your Home, Profile, or Marketplace pages are rendered.
            Based on your Home file, this takes up the remaining vertical space.
        */}
        {children}
        
      </>
    
  )
}