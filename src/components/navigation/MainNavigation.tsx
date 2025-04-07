
import React from "react";
import { Home, Car, HardHat, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainNavigationProps } from "./types";

const MainNavigation: React.FC<MainNavigationProps> = ({ 
  isCompact = false, 
  iconSize, 
  activePaths, 
  onNavigate 
}) => {
  return (
    <div className="flex space-x-3">
      <Button
        variant={activePaths["/"] ? "default" : "ghost"}
        size="sm"
        onClick={() => onNavigate("/")}
        className={`!transition-none !duration-0 ${activePaths["/"] ? "bg-akhanya hover:bg-akhanya-dark" : "text-white hover:text-white hover:bg-gray-800"}`}
      >
        <Home className={`mr-1 ${iconSize}`} /> Dashboard
      </Button>
      <Button
        variant={activePaths["/car-checkup"] ? "default" : "ghost"}
        size="sm"
        onClick={() => onNavigate("/car-checkup")}
        className={`!transition-none !duration-0 ${activePaths["/car-checkup"] ? "bg-akhanya hover:bg-akhanya-dark" : "text-white hover:text-white hover:bg-gray-800"}`}
      >
        <Car className={`mr-1 ${iconSize}`} /> Vehicle Check
      </Button>
      <Button
        variant={activePaths["/eskom-survey"] ? "default" : "ghost"}
        size="sm"
        onClick={() => onNavigate("/eskom-survey/new")}
        className={`!transition-none !duration-0 ${activePaths["/eskom-survey"] ? "bg-akhanya hover:bg-akhanya-dark" : "text-white hover:text-white hover:bg-gray-800"}`}
      >
        <FileSpreadsheet className={`mr-1 ${iconSize}`} /> Eskom Survey
      </Button>
      <Button
        variant={activePaths["/installation"] ? "default" : "ghost"}
        size="sm"
        onClick={() => onNavigate("/installation")}
        className={`!transition-none !duration-0 ${activePaths["/installation"] ? "bg-akhanya hover:bg-akhanya-dark" : "text-white hover:text-white hover:bg-gray-800"}`}
      >
        <HardHat className={`mr-1 ${iconSize}`} /> Installation
      </Button>
    </div>
  );
};

export default MainNavigation;
