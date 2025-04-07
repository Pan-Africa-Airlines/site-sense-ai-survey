
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from "./AdminSidebar";
import MobileAdminNav from "./MobileAdminNav";

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean | null>(null);
  
  useEffect(() => {
    // We're not adding dark mode to the entire document anymore
    // Only the sidebar will have dark styling
    
    // Clean up function
    return () => {
      // No need to remove dark mode class from document
    };
  }, []);
  
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
    // No need to remove dark mode when logging out
    toast({
      title: "Logged out",
      description: "You have been logged out of the admin panel."
    });
    navigate("/admin/login");
  };
  
  const adminUsername = localStorage.getItem("adminUsername") || "Admin";

  if (isMobile) {
    return (
      <div className="flex flex-col h-screen">
        <MobileAdminNav
          adminUsername={adminUsername}
          handleLogout={handleLogout}
          isActive={(path) => location.pathname === path}
          navItems={[
            { path: "/admin/dashboard", icon: () => <></>, label: "Dashboard" },
            { path: "/admin/assessments", icon: () => <></>, label: "Assessments" },
            { path: "/admin/installations", icon: () => <></>, label: "Installations" },
            { path: "/admin/users", icon: () => <></>, label: "Users" },
            { path: "/admin/map", icon: () => <></>, label: "Map" },
            { path: "/admin/site-allocation", icon: () => <></>, label: "Site Allocation" },
            { path: "/admin/configuration", icon: () => <></>, label: "Configuration" },
          ]}
        />
        <div className="flex-1 overflow-auto bg-white">
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
        <div className="flex-1 overflow-auto bg-white">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
