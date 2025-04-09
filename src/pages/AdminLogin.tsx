
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { createAdminUser } from "@/utils/dbHelpers/engineerProfiles";

const AdminLogin = () => {
  useEffect(() => {
    // In development mode, we don't need to ensure admin user exists
    // Just redirect to login page with admin role
    if (process.env.NODE_ENV === 'development') {
      toast.success("Development mode: Admin credentials ready.");
      return;
    }
    
    // Only try to create admin user in production
    const ensureAdminUser = async () => {
      try {
        const adminUser = await createAdminUser();
        if (adminUser) {
          toast.success("Admin user is ready. You can login with admin@akhanya.co.za / admin123");
        }
      } catch (error) {
        console.error("Error ensuring admin user exists:", error);
      }
    };
    
    ensureAdminUser();
  }, []);

  return <Navigate to="/login?role=admin" replace />;
};

export default AdminLogin;
