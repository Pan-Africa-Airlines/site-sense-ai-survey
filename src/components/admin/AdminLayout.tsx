
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from "./AdminSidebar";
import MobileAdminNav from "./MobileAdminNav";
import { BarChart3, ClipboardList, Database, Users, Map, MapPin, Cog, Activity } from "lucide-react";

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean | null>(null);
  
  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
    setIsAdminAuthenticated(adminLoggedIn);
    
    if (!adminLoggedIn) {
      navigate("/admin/login");
    }
  }, [navigate]);
  
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
    { path: "/admin/site-allocation", icon: MapPin, label: "Site Allocation" },
    { path: "/admin/system-logs", icon: Activity, label: "System Logs" },
    { path: "/configuration", icon: Cog, label: "Configuration" },
  ];

  if (isMobile) {
    return (
      <div className="flex flex-col h-screen">
        <MobileAdminNav
          adminUsername={adminUsername}
          handleLogout={handleLogout}
          isActive={(path) => location.pathname === path}
          navItems={navItems}
        />
        <div className="flex-1 overflow-auto bg-gray-50">
          {children}
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar 
          adminUsername={adminUsername}
          handleLogout={handleLogout}
        />
        <div className="flex-1 overflow-auto bg-gray-50">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
