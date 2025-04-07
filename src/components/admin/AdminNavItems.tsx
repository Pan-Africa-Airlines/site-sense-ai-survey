
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  ClipboardCheck,
  Wrench,
  MapPin,
  UserCheck,
  Settings,
  Users,
} from "lucide-react";

interface NavItem {
  path: string;
  icon: React.ElementType;
  label: string;
}

interface AdminNavItemsProps {
  navItems?: NavItem[];
  isActive?: (path: string) => boolean;
  onClick?: (path: string) => void;
}

export const AdminNavItems: React.FC<AdminNavItemsProps> = ({ 
  navItems,
  isActive,
  onClick
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  
  // If props are provided, use them. Otherwise use the default behavior
  const checkActive = isActive || ((path: string) => path === currentPath);
  const handleClick = onClick || ((path: string) => navigate(path));

  // If navItems are provided, use those instead of the hardcoded buttons
  if (navItems) {
    return (
      <>
        {navItems.map((item) => (
          <Button
            key={item.path}
            variant={checkActive(item.path) ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => handleClick(item.path)}
          >
            {item.icon && <item.icon className="mr-2 h-4 w-4" />}
            {item.label}
          </Button>
        ))}
      </>
    );
  }

  // Default hardcoded navigation items if none are provided
  return (
    <>
      <Button
        variant={currentPath === "/admin/dashboard" ? "default" : "ghost"}
        className="w-full justify-start"
        onClick={() => navigate("/admin/dashboard")}
      >
        <LayoutDashboard className="mr-2 h-4 w-4" />
        Dashboard
      </Button>
      <Button
        variant={currentPath === "/admin/assessments" ? "default" : "ghost"}
        className="w-full justify-start"
        onClick={() => navigate("/admin/assessments")}
      >
        <ClipboardCheck className="mr-2 h-4 w-4" />
        Assessments
      </Button>
      <Button
        variant={currentPath === "/admin/installations" ? "default" : "ghost"}
        className="w-full justify-start"
        onClick={() => navigate("/admin/installations")}
      >
        <Wrench className="mr-2 h-4 w-4" />
        Installations
      </Button>
      <Button
        variant={currentPath === "/admin/map" ? "default" : "ghost"}
        className="w-full justify-start"
        onClick={() => navigate("/admin/map")}
      >
        <MapPin className="mr-2 h-4 w-4" />
        Map
      </Button>
      <Button
        variant={currentPath === "/admin/site-allocation" ? "default" : "ghost"}
        className="w-full justify-start"
        onClick={() => navigate("/admin/site-allocation")}
      >
        <Users className="mr-2 h-4 w-4" />
        Site Allocation
      </Button>
      <Button
        variant={currentPath === "/admin/users" ? "default" : "ghost"}
        className="w-full justify-start"
        onClick={() => navigate("/admin/users")}
      >
        <UserCheck className="mr-2 h-4 w-4" />
        Users
      </Button>
      <Button
        variant={currentPath === "/admin/configuration" ? "default" : "ghost"}
        className="w-full justify-start"
        onClick={() => navigate("/admin/configuration")}
      >
        <Settings className="mr-2 h-4 w-4" />
        Configuration
      </Button>
    </>
  );
};
