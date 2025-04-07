
import React, { useEffect } from "react";
import AdminNavBar from "@/components/AdminNavBar";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FormFieldsConfiguration from "@/components/FormFieldsConfiguration";
import FieldConfigCard from "@/components/FieldConfigCard";
import EskomSiteConfiguration from "@/components/EskomSiteConfiguration";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Download, Upload, Settings, UserPlus, Building } from "lucide-react";
import ConfigFieldCard from "@/components/ConfigFieldCard";

const Configuration = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
    if (!adminLoggedIn) {
      navigate("/admin/login");
    }
  }, [navigate]);
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminNavBar />
      <div className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-3xl font-bold mb-6 text-akhanya">System Configuration</h1>
        
        <Tabs defaultValue="sites" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-4 h-auto">
            <TabsTrigger value="sites" className="py-2">Eskom Sites</TabsTrigger>
            <TabsTrigger value="forms" className="py-2">Form Fields</TabsTrigger>
            <TabsTrigger value="users" className="py-2">User Roles</TabsTrigger>
            <TabsTrigger value="system" className="py-2">System Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sites" className="mt-6">
            <EskomSiteConfiguration />
          </TabsContent>
          
          <TabsContent value="forms" className="mt-6">
            <FormFieldsConfiguration />
          </TabsContent>
          
          <TabsContent value="users" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle>Total Users</CardTitle>
                    <CardDescription>Active system users</CardDescription>
                  </div>
                  <UserPlus className="h-5 w-5 text-akhanya" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle>User Roles</CardTitle>
                    <CardDescription>Defined role types</CardDescription>
                  </div>
                  <Settings className="h-5 w-5 text-akhanya" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle>Departments</CardTitle>
                    <CardDescription>Business units</CardDescription>
                  </div>
                  <Building className="h-5 w-5 text-akhanya" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">6</div>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">User Role Configuration</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button className="bg-akhanya hover:bg-akhanya-dark" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Role
                </Button>
              </div>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Permissions</TableHead>
                      <TableHead>Users</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Administrator</TableCell>
                      <TableCell>Full system access</TableCell>
                      <TableCell>All permissions</TableCell>
                      <TableCell>2</TableCell>
                      <TableCell><Badge>Active</Badge></TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Supervisor</TableCell>
                      <TableCell>Team management access</TableCell>
                      <TableCell>View, approve, edit</TableCell>
                      <TableCell>4</TableCell>
                      <TableCell><Badge>Active</Badge></TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Field Engineer</TableCell>
                      <TableCell>Site assessment and installation</TableCell>
                      <TableCell>Create, edit own</TableCell>
                      <TableCell>16</TableCell>
                      <TableCell><Badge>Active</Badge></TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Viewer</TableCell>
                      <TableCell>Read-only system access</TableCell>
                      <TableCell>View only</TableCell>
                      <TableCell>2</TableCell>
                      <TableCell><Badge variant="outline">Inactive</Badge></TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="system" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ConfigFieldCard 
                title="Email Notifications" 
                description="Configure system email settings"
                fields={[
                  { name: "SMTP Server", type: "text", value: "smtp.akhanya.co.za" },
                  { name: "SMTP Port", type: "number", value: "587" },
                  { name: "Email From", type: "email", value: "notifications@akhanya.co.za" },
                  { name: "Use Authentication", type: "checkbox", value: true },
                ]}
              />
              
              <ConfigFieldCard 
                title="Data Retention" 
                description="Configure data retention policies"
                fields={[
                  { name: "Keep Assessment Data (days)", type: "number", value: "365" },
                  { name: "Keep Audit Logs (days)", type: "number", value: "90" },
                  { name: "Keep Site Photos (days)", type: "number", value: "730" },
                  { name: "Auto-archive completed sites", type: "checkbox", value: true },
                ]}
              />
              
              <ConfigFieldCard 
                title="API Integration" 
                description="Configure external API connections"
                fields={[
                  { name: "Enable Google Maps API", type: "checkbox", value: true },
                  { name: "Google Maps API Key", type: "password", value: "********" },
                  { name: "Weather API Integration", type: "checkbox", value: false },
                  { name: "Enable Eskom API", type: "checkbox", value: true },
                ]}
              />
              
              <ConfigFieldCard 
                title="Security Settings" 
                description="Configure system security options"
                fields={[
                  { name: "Password Expiry (days)", type: "number", value: "90" },
                  { name: "Failed Login Attempts", type: "number", value: "5" },
                  { name: "Session Timeout (minutes)", type: "number", value: "30" },
                  { name: "Enforce 2FA", type: "checkbox", value: false },
                ]}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Configuration;
