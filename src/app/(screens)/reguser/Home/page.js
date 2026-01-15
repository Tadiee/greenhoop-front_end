import MainContainer from "../../../../components/private components/reguser components/Home/mainSection";
import Footer from "../../../../components/global components/footer/globalFooter";

/**
 * Registered User Home Page
 * -------------------------
 * This is the primary dashboard landing page. It manages the high-level 
 * layout, stacking the main content area and the footer vertically.
 */
export default function Home() {
  return (
    /* Outer Page Wrapper:
       - Uses a vertical flexbox (flex-col) to stack sections.
       - h-[77%]: Sets a custom height for the main viewing area.
       - w-screen: Ensures the application fills the horizontal viewport.
       - dark:bg-black: Provides a fallback background for dark mode.
    */
    <div className="flex flex-col h-[77%] w-screen items-start justify-center font-sans dark:bg-black" >
      
      {/* Main Container: 
          Includes the "Rethink Waste" hero section, User Stats, 
          Quick Stats bar, and Notifications. 
      */}
      <MainContainer/>

      {/* Footer Area Wrapper:
          - h-[13%]: Allocates specific vertical space for footer content.
          - bg-gray-50: Adds a subtle grey tint to distinguish the footer from the white background.
      */}
      <div className="flex h-[13%] w-full bg-gray-50 items-center justify-center font-sans dark:bg-black" >
        
        {/* Global Footer component containing features, branding, and contact info */}
        <Footer/>
        
      </div> 
    </div>
  );
}