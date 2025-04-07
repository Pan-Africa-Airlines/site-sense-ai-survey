
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileAdminNav from "./MobileAdminNav";
import DesktopAdminNav from "./DesktopAdminNav";
import { 
  BarChart3, 
  ClipboardList,
  Database, 
  Users, 
  Cog, 
  Map,
  Settings
} from "lucide-react";

export const AdminNavLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const isActive = (path: string) => location.pathname === path;
  
  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminUsername");
    toast({
      title: "Logged out",
      description: "You have been logged out of the admin panel."
    });
    navigate("/admin/login");
  };
  
  const adminUsername = localStorage.getItem("adminUsername") || "Admin";

  const navItems = [
    { path: "/admin/dashboard", icon: BarChart3, label: "Dashboard" },
    { path: "/admin/assessments", icon: ClipboardList, label: "Assessments" },
    { path: "/admin/installations", icon: Database, label: "Installations" },
    { path: "/admin/users", icon: Users, label: "Users" },
    { path: "/admin/map", icon: Map, label: "Map" },
    { path: "/configuration", icon: Cog, label: "Configuration" },
  ];

  return (
    <div className="flex h-screen">
      {isMobile ? (
        <div className="flex flex-col w-full">
          <MobileAdminNav 
            adminUsername={adminUsername}
            handleLogout={handleLogout}
            isActive={isActive}
            navItems={navItems}
          />
          <div className="flex-1 overflow-auto bg-gray-50">
            {children}
          </div>
        </div>
      ) : (
        <>
          <DesktopAdminNav 
            adminUsername={adminUsername}
            handleLogout={handleLogout}
            isActive={isActive}
            navItems={navItems}
          />
          <div className="flex-1 overflow-auto bg-gray-50">
            {children}
          </div>
        </>
      )}
    </div>
  );
};
