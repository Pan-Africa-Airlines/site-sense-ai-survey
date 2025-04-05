
import React, { useState, useEffect } from "react";
import NavigationBar from "./NavigationBar";

const DynamicHeader: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };
    
    window.addEventListener("scroll", handleScroll);
    
    // Initial check in case page is loaded with scroll position
    handleScroll();
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "shadow-md" : ""}`}>
      <NavigationBar isCompact={isScrolled} />
    </div>
  );
};

export default DynamicHeader;
