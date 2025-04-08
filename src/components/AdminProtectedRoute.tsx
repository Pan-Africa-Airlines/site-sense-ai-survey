
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { isUserAdmin } from "@/utils/userRoles";

const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean | null>(null);
  
  useEffect(() => {
    const checkAdminRole = async () => {
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log("No active session found");
          setIsAdminAuthenticated(false);
          return;
        }
        
        // Check if user has admin role via specializations
        const isAdmin = await isUserAdmin(session.user.id);
        
        if (isAdmin) {
          console.log("User has admin role");
          setIsAdminAuthenticated(true);
          // Update localStorage for backward compatibility
          localStorage.setItem("adminLoggedIn", "true");
          localStorage.setItem("adminUsername", session.user.email);
        } else {
          console.log("User does not have admin role");
          setIsAdminAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking admin authentication:", error);
        setIsAdminAuthenticated(false);
      }
    };
    
    checkAdminRole();
  }, []);
  
  if (isAdminAuthenticated === null) {
    // Still loading auth state
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!isAdminAuthenticated) {
    toast.error("You don't have admin privileges");
    return <Navigate to="/admin/login" replace />;
  }
  
  return <>{children}</>;
};

export default AdminProtectedRoute;
