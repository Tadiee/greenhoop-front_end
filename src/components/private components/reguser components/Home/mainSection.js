import LeftConatiner from "./leftContainer";
import RightContainer from "./rightContainer";
import MiddleContainer from "./middleContainer";

/**
 * Main Section Container
 * -----------------------
 * This component acts as the primary 3-column grid for the user dashboard.
 * It organizes the layout into Left (Stats/Notifications), Middle (Hero), and Right (Help Center) sections.
 */
export default function MainContainer() {
  return (
    /* Main Layout Wrapper:
       - flex-row: Aligns the three sub-containers horizontally.
       - h-[85%]: Occupies 85% of the parent's vertical height.
       - mt-3: Adds a small top margin to separate the dashboard from the header/navigation.
       - justify-between: Evenly distributes space so the containers stick to the left, center, and right.
       - p-1: Provides a tiny internal padding to prevent content from touching the screen edges.
    */
    <div className="flex flex-row h-[85%] mt-3 w-full items-center justify-between font-sans dark:bg-black p-1" >
      
      {/* Left Column: 
          Typically contains the User Stats (Submission Rate/Money) and the Notifications Hub. 
      */}
      <LeftConatiner/>
      
      {/* Middle Column: 
          The focal point containing the "Rethink Waste" text, 3D Earth model, and Primary Action buttons. 
      */}
      <MiddleContainer />
      
      {/* Right Column: 
          Contains the redesigned Help Center/Resources accordion for user guidance. 
      */}
      <RightContainer />   
      
    </div>
  );
}