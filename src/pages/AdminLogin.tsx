
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

const AdminLogin = () => {
  return <Navigate to="/login?role=admin" replace />;
};

export default AdminLogin;
