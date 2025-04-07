
import React from "react";
import { Store, Car, FileText, Wrench, Map, Calendar } from "lucide-react";
import { MainNavigationProps } from "./types";

const MainNavigation: React.FC<MainNavigationProps> = ({ 
  isCompact = false, 
  iconSize,
  activePaths,
  onNavigate
}) => {
  const menuItems = [
    { path: "/", icon: Store, label: "Dashboard", isActive: activePaths["/"] },
    { path: "/car-checkup", icon: Car, label: "Vehicle Check", isActive: activePaths["/car-checkup"] },
    { path: "/eskom-survey/new", icon: FileText, label: "Site Survey", isActive: activePaths["/eskom-survey"] },
    { path: "/my-allocations", icon: Map, label: "My Allocations", isActive: activePaths["/my-allocations"] }
  ];

  const textStyle = isCompact ? 'text-xs' : 'text-sm';
  
  return (
    <nav className="flex items-center justify-center space-x-2 lg:space-x-4">
      {menuItems.map(item => (
        <button
          key={item.path}
          className={`px-3 py-2 rounded-lg flex flex-col items-center transition-colors
            ${item.isActive ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
          onClick={() => onNavigate(item.path)}
        >
          <item.icon className={iconSize} />
          <span className={`${textStyle} mt-1 font-medium`}>{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default MainNavigation;
