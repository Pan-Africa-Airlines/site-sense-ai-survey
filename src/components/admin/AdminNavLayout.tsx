
import React from "react";
import AdminLayout from "./AdminLayout";

export const AdminNavLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AdminLayout>
      <div className="p-4 md:p-6 bg-gray-50 min-h-screen w-full">
        {children}
      </div>
    </AdminLayout>
  );
};
