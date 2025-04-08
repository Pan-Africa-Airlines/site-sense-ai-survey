
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BarChart3, ClipboardList, Database, Users, Map, MapPin, Cog, LogOut, Activity } from "lucide-react";

interface NavItem {
  path: string;
  icon: any;
  label: string;
}

interface MobileAdminNavProps {
  adminUsername: string;
  handleLogout: () => void;
  isActive: (path: string) => boolean;
  navItems: NavItem[];
}

const MobileAdminNav: React.FC<MobileAdminNavProps> = ({
  adminUsername,
  handleLogout,
  isActive,
  navItems
}) => {
  // Default navigation items if not provided
  const defaultNavItems = [
    { path: "/admin/dashboard", icon: BarChart3, label: "Dashboard" },
    { path: "/admin/assessments", icon: ClipboardList, label: "Assessments" },
    { path: "/admin/installations", icon: Database, label: "Installations" },
    { path: "/admin/users", icon: Users, label: "Users" },
    { path: "/admin/map", icon: Map, label: "Map" },
    { path: "/admin/site-allocation", icon: MapPin, label: "Site Allocation" },
    { path: "/admin/system-logs", icon: Activity, label: "System Logs" },
    { path: "/configuration", icon: Cog, label: "Configuration" },
  ];

  const items = navItems && navItems.length > 0 ? navItems : defaultNavItems;

  return (
    <div className="bg-gray-900 text-white">
      <div className="flex justify-between items-center p-4 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center text-white font-semibold">
            {adminUsername.substring(0, 1).toUpperCase()}
          </div>
          <div>
            <div className="font-medium">{adminUsername}</div>
            <div className="text-xs text-gray-400">Administrator</div>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleLogout}
          className="text-gray-300 hover:text-white"
        >
          <LogOut className="h-4 w-4 mr-1" /> Logout
        </Button>
      </div>
      
      <div className="flex overflow-x-auto p-2 bg-gray-800">
        {items.map((item) => {
          const Icon = item.icon || (() => <></>);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-md ${
                isActive(item.path) 
                  ? "bg-gray-700 text-white" 
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileAdminNav;
