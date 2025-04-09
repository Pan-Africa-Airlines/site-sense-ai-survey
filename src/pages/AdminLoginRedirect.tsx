
import React from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

const AdminLoginRedirect = () => {
  React.useEffect(() => {
    toast.info("Redirecting to admin login page...");
  }, []);

  return <Navigate to="/admin/login" replace />;
};

export default AdminLoginRedirect;
