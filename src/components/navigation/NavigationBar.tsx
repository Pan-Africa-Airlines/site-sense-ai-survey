import React from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { NavigationBarProps } from "./types";
import UserMenu from "./UserMenu";
import LogoSection from "./LogoSection";
import MainNavigation from "./MainNavigation";
import NavigationBreadcrumb from "./Breadcrumb";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";
import { Home, Car, HardHat, ChevronRight, Settings, LogOut, User, ShieldAlert, Badge, FileSpreadsheet } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import BCXLogo from "@/components/ui/logo";

const NavigationBar: React.FC<NavigationBarProps> = ({ isCompact = false }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  
  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("userEmail");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out."
    });
    navigate("/login");
  };
  
  const userEmail = localStorage.getItem("userEmail") || "User";
  const userName = userEmail.split('@')[0].split('.').map(name => 
    name.charAt(0).toUpperCase() + name.slice(1)
  ).join(' ');
  
  const getInitials = (email: string) => {
    if (email === "User") return "U";
    const nameParts = email.split('@')[0].split('.');
    if (nameParts.length > 1) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    }
    return email.substring(0, 2).toUpperCase();
  };

  const getPageTitle = () => {
    switch(location.pathname) {
      case "/": return "Dashboard";
      case "/car-checkup": return "Vehicle Check";
      case "/eskom-survey/new": return "Eskom Site Survey";
      case "/installation": return "Installation";
      case "/eskom-surveys": return "Eskom Surveys";
      case "/my-allocations": return "My Allocations";
      default: 
        if (location.pathname.startsWith("/eskom-survey/")) return "Eskom Site Survey";
        return "";
    }
  };

  const headerHeight = isCompact ? 'h-24!' : 'h-28!';
  const logoHeight = isCompact ? 'h-16' : 'h-20';
  const eskLogo = isCompact ? 'h-11' : 'h-14';
  const textSize = isCompact ? 'text-base' : 'text-lg';
  const iconSize = isCompact ? 'w-4 h-4' : 'w-5 h-5';
  const avatarSize = isCompact ? 'h-10 w-10' : 'h-12 w-12';
  
  const breadcrumbHeight = 'h-12';

  const activePaths = {
    "/": location.pathname === "/",
    "/car-checkup": location.pathname === "/car-checkup",
    "/eskom-survey": location.pathname.startsWith("/eskom-survey"),
    "/installation": location.pathname === "/installation",
    "/engineer-dashboard": location.pathname === "/engineer-dashboard"
  };

  return (
    <header className="bg-black border-b border-gray-700 !transition-none !duration-0 z-10 text-white">
      <div className={`${headerHeight} w-full !transition-none !duration-0`}>
        <div className="container mx-auto px-4 h-full">
          <div className="flex justify-between items-center h-full">
            <LogoSection isCompact={isCompact} />
            <div className="flex space-x-3">
              {/* Add Engineer Dashboard button */}
              <Button
                variant={activePaths["/engineer-dashboard"] ? "default" : "ghost"}
                size="sm"
                onClick={() => navigate("/engineer-dashboard")}
                className={`!transition-none !duration-0 ${activePaths["/engineer-dashboard"] ? "bg-akhanya hover:bg-akhanya-dark" : "text-white hover:text-white hover:bg-gray-800"}`}
              >
                <LayoutDashboard className={`mr-1 ${iconSize}`} /> Engineer Dashboard
              </Button>
              <Button
                variant={isActive("/") ? "default" : "ghost"}
                size="sm"
                onClick={() => navigate("/")}
                className={`!transition-none !duration-0 ${isActive("/") ? "bg-akhanya hover:bg-akhanya-dark" : "text-white hover:text-white hover:bg-gray-800"}`}
              >
                <Home className={`mr-1 ${iconSize}`} /> Dashboard
              </Button>
              <Button
                variant={isActive("/car-checkup") ? "default" : "ghost"}
                size="sm"
                onClick={() => navigate("/car-checkup")}
                className={`!transition-none !duration-0 ${isActive("/car-checkup") ? "bg-akhanya hover:bg-akhanya-dark" : "text-white hover:text-white hover:bg-gray-800"}`}
              >
                <Car className={`mr-1 ${iconSize}`} /> Vehicle Check
              </Button>
              <Button
                variant={location.pathname.startsWith("/eskom-survey") ? "default" : "ghost"}
                size="sm"
                onClick={() => navigate("/eskom-survey/new")}
                className={`!transition-none !duration-0 ${location.pathname.startsWith("/eskom-survey") ? "bg-akhanya hover:bg-akhanya-dark" : "text-white hover:text-white hover:bg-gray-800"}`}
              >
                <FileSpreadsheet className={`mr-1 ${iconSize}`} /> Eskom Survey
              </Button>
              <Button
                variant={isActive("/installation") ? "default" : "ghost"}
                size="sm"
                onClick={() => navigate("/installation")}
                className={`!transition-none !duration-0 ${isActive("/installation") ? "bg-akhanya hover:bg-akhanya-dark" : "text-white hover:text-white hover:bg-gray-800"}`}
              >
                <HardHat className={`mr-1 ${iconSize}`} /> Installation
              </Button>
            </div>
            <UserMenu 
              isCompact={isCompact} 
              onLogout={handleLogout} 
            />
          </div>
        </div>
      </div>
      
      {location.pathname !== "/" && (
        <NavigationBreadcrumb currentPageTitle={getPageTitle()} />
      )}
    </header>
  );
};

export default NavigationBar;
