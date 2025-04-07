
import React from "react";
import MobileNavigation from "./MobileNavigation";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { NavigationItem } from "./types";

interface MobileHeaderProps {
  navigationItems: NavigationItem[];
  theme: string;
  toggleTheme: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  navigationItems,
  theme,
  toggleTheme
}) => {
  return (
    <>
      <MobileNavigation 
        navigationItems={navigationItems} 
        theme={theme} 
        toggleTheme={toggleTheme} 
      />
      <div className="mx-auto">
        <Logo />
      </div>
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} isMobile />
    </>
  );
};

export default MobileHeader;
