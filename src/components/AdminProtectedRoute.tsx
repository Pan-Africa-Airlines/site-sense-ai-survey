
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
        
        // Check user role in engineer_profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('engineer_profiles')
          .select('specializations')
          .eq('id', session.user.id)
          .single();
          
        if (profileError) {
          console.error("Error fetching user role:", profileError);
          setIsAdminAuthenticated(false);
          return;
        }
        
        if (profileData && profileData.specializations && profileData.specializations.includes('Administrator')) {
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
