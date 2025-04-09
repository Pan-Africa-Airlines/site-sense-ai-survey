
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { createAdminUser } from "@/utils/dbHelpers/engineerProfiles";

const AdminLogin = () => {
  useEffect(() => {
    // Ensure admin user exists when this page is loaded
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
