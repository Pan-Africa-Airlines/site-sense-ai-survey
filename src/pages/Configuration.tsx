
import React from "react";
import { AdminNavLayout } from "@/components/admin/AdminNavLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import EskomSiteConfiguration from "@/components/EskomSiteConfiguration";

const Configuration = () => {
  return (
    <AdminNavLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-akhanya">System Configuration</h1>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Configuration Settings</CardTitle>
            <CardDescription>
              Manage system-wide settings and configurations for the Eskom Site IQ application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              This section allows administrators to configure various aspects of the system,
              including site management, user permissions, and application behavior.
            </p>
          </CardContent>
        </Card>
        
        <EskomSiteConfiguration />
      </div>
    </AdminNavLayout>
  );
};

export default Configuration;
