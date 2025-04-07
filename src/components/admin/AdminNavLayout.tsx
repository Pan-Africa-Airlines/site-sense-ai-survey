
import React from "react";
import AdminLayout from "./AdminLayout";

export const AdminNavLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AdminLayout>
      {children}
    </AdminLayout>
  );
};

export default AdminNavLayout;
