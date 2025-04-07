
import React from "react";
import AdminLayout from "./AdminLayout";

export const AdminNavLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AdminLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        {children}
      </div>
    </AdminLayout>
  );
};

export default AdminNavLayout;
