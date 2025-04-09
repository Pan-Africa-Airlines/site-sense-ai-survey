
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Set admin logged in for dashboard access
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("userEmail", "admin@akhanya.co.za");
    localStorage.setItem("adminLoggedIn", "true");
    localStorage.setItem("adminUsername", "admin@akhanya.co.za");
  }, []);

  // Auto admin login - skip validation for direct dashboard access
  const isAdmin = true;

  if (!isAdmin) {
    toast.error("Access denied. Admin privileges required.");
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
