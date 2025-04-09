
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { isUserAdmin, isAdminEmail } from "@/utils/userRoles";

const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkAdminRole = async () => {
      try {
        // In development mode, check if admin is logged in via localStorage
        if (process.env.NODE_ENV === 'development') {
          const adminLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
          if (adminLoggedIn) {
            console.log("Development mode: Admin logged in via localStorage");
            setIsAdminAuthenticated(true);
            setIsLoading(false);
            return;
          }
        }
        
        // Get current session from Supabase
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log("No active session found");
          setIsAdminAuthenticated(false);
          setIsLoading(false);
          return;
        }
        
        // First check if email suggests admin role (quicker check)
        if (isAdminEmail(session.user.email || '')) {
          console.log("User has admin email");
          setIsAdminAuthenticated(true);
          localStorage.setItem("adminLoggedIn", "true");
          localStorage.setItem("adminUsername", session.user.email || '');
          setIsLoading(false);
          return;
        }
        
        // If email doesn't suggest admin, check specializations
        const isAdmin = await isUserAdmin(session.user.id);
        
        if (isAdmin) {
          console.log("User has admin role via specializations");
          setIsAdminAuthenticated(true);
          localStorage.setItem("adminLoggedIn", "true");
          localStorage.setItem("adminUsername", session.user.email || '');
        } else {
          console.log("User does not have admin role");
          setIsAdminAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking admin authentication:", error);
        setIsAdminAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAdminRole();
  }, []);
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Checking admin access...</div>;
  }
  
  if (!isAdminAuthenticated) {
    toast.error("You don't have admin privileges");
    return <Navigate to="/login?role=admin" replace />;
  }
  
  return <>{children}</>;
};

export default AdminProtectedRoute;
