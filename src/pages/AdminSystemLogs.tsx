
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";

const AdminSystemLogs = () => {
  return (
    <AdminLayout>
      <Container>
        <div className="space-y-4 py-8">
          <h1 className="text-3xl font-bold">System Logs</h1>
          <p className="text-muted-foreground">
            View and filter system logs to track user activity and system events.
          </p>

          <Card className="p-6">
            <div className="text-center py-8">
              <p>System logs functionality is coming soon.</p>
            </div>
          </Card>
        </div>
      </Container>
    </AdminLayout>
  );
};

export default AdminSystemLogs;
