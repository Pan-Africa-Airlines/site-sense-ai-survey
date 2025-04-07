
import React from "react";
import AdminLayout from "./AdminLayout";

export const AdminNavLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AdminLayout>
      <div className="p-6 bg-background min-h-screen">
        {children}
      </div>
    </AdminLayout>
  );
};

export default AdminNavLayout;
