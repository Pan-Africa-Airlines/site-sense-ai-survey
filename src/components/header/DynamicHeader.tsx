
import React, { useState, useEffect } from "react";
import { 
  Home, MapPin, FileSpreadsheet, Network, ListChecks, Car
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileHeader from "./MobileHeader";
import DesktopNavigation from "./DesktopNavigation";
import { NavigationItem } from "./types";

const DynamicHeader: React.FC = () => {
  const [theme, setTheme] = useState<string>("light");
  const [isMounted, setIsMounted] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setIsMounted(true);
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const navigationItems: NavigationItem[] = [
    {
      title: "Dashboard",
      href: "/",
      description: "View system overview and metrics",
      icon: <Home className="h-4 w-4" />,
    },
    {
      title: "My Allocations",
      href: "/my-allocations",
      description: "View and manage your allocated sites",
      icon: <MapPin className="h-4 w-4" />,
    },
    {
      title: "Eskom Survey",
      href: "/eskom-survey/new",
      description: "Create a new Eskom site survey",
      icon: <FileSpreadsheet className="h-4 w-4" />,
    },
    {
      title: "Installation",
      href: "/installation",
      description: "Submit network installation details",
      icon: <Network className="h-4 w-4" />,
    },
    {
      title: "Survey History",
      href: "/eskom-surveys",
      description: "View completed Eskom surveys",
      icon: <ListChecks className="h-4 w-4" />,
    },
    {
      title: "Vehicle Check",
      href: "/car-checkup",
      description: "Complete a vehicle safety check",
      icon: <Car className="h-4 w-4" />,
    }
  ];

  const headerHeight = "h-14";
  
  return (
    <header className={`sticky top-0 z-50 w-full border-b bg-background/95 !duration-0 !transition-none`}>
      <div className={`${headerHeight} container flex items-center !duration-0 !transition-none`}>
        {isMobile ? (
          <MobileHeader 
            navigationItems={navigationItems}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        ) : (
          <DesktopNavigation 
            navigationItems={navigationItems}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        )}
      </div>
    </header>
  );
};

export default DynamicHeader;
