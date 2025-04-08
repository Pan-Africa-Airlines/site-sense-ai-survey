
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { NavigationBarProps } from "./types";
import UserMenu from "./UserMenu";
import LogoSection from "./LogoSection";
import MainNavigation from "./MainNavigation";
import NavigationBreadcrumb from "./Breadcrumb";

const NavigationBar: React.FC<NavigationBarProps> = ({ isCompact = false }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("userEmail");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out."
    });
    navigate("/login");
  };
  
  const getPageTitle = () => {
    switch(location.pathname) {
      case "/dashboard": return "Dashboard";
      case "/car-checkup": return "Vehicle Check";
      case "/eskom-survey/new": return "Eskom Site Survey";
      case "/installation": return "Installation";
      case "/eskom-surveys": return "Eskom Surveys";
      case "/my-allocations": return "My Allocations";
      case "/assessment": return "Site Assessment";
      default: 
        if (location.pathname.startsWith("/eskom-survey/")) return "Eskom Site Survey";
        return "";
    }
  };

  const headerHeight = isCompact ? 'h-24!' : 'h-28!';
  const iconSize = isCompact ? 'w-4 h-4' : 'w-5 h-5';
  
  const activePaths = {
    "/dashboard": location.pathname === "/dashboard",
    "/car-checkup": location.pathname === "/car-checkup",
    "/eskom-survey": location.pathname.startsWith("/eskom-survey"),
    "/eskom-surveys": location.pathname === "/eskom-surveys",
    "/installation": location.pathname === "/installation",
    "/my-allocations": location.pathname === "/my-allocations",
    "/assessment": location.pathname === "/assessment"
  };

  return (
    <header className="bg-black border-b border-gray-700 !transition-none !duration-0 z-10 text-white">
      <div className={`${headerHeight} w-full !transition-none !duration-0`}>
        <div className="container mx-auto px-4 h-full">
          <div className="flex justify-between items-center h-full">
            <LogoSection isCompact={isCompact} />
            <MainNavigation 
              isCompact={isCompact} 
              iconSize={iconSize} 
              activePaths={activePaths}
              onNavigate={(path) => navigate(path)}
            />
            <UserMenu 
              isCompact={isCompact} 
              onLogout={handleLogout} 
            />
          </div>
        </div>
      </div>
      
      {location.pathname !== "/dashboard" && (
        <NavigationBreadcrumb currentPageTitle={getPageTitle()} />
      )}
    </header>
  );
};

export default NavigationBar;
