
import React, { useEffect } from "react";
import AdminNavBar from "@/components/AdminNavBar";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download, Eye, Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminInstallations = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
    if (!adminLoggedIn) {
      navigate("/admin/login");
    }
  }, [navigate]);
  
  // Mock data
  const installations = [
    { id: 1, siteName: "Eskom Substation A", engineer: "John Doe", installDate: "2025-04-10", status: "completed" },
    { id: 2, siteName: "Power Station B", engineer: "Jane Smith", installDate: "2025-04-15", status: "scheduled" },
    { id: 3, siteName: "Transmission Tower C", engineer: "Robert Johnson", installDate: "2025-04-20", status: "in-progress" },
    { id: 4, siteName: "Distribution Center D", engineer: "Sarah Williams", installDate: "2025-03-28", status: "completed" },
    { id: 5, siteName: "Renewable Plant E", engineer: "Michael Brown", installDate: "2025-03-25", status: "completed" },
    { id: 6, siteName: "Substation F", engineer: "Emily Jones", installDate: "2025-05-05", status: "scheduled" },
    { id: 7, siteName: "Power Station G", engineer: "David Wilson", installDate: "2025-05-10", status: "scheduled" },
    { id: 8, siteName: "Control Room H", engineer: "Lisa Taylor", installDate: "2025-04-05", status: "delayed" },
  ];
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminNavBar />
      <div className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-3xl font-bold mb-6 text-akhanya">Installations</h1>
        
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex items-center relative flex-1">
                <Search className="absolute left-2 h-4 w-4 text-gray-500" />
                <Input placeholder="Search installations..." className="pl-8" />
              </div>
              <div className="flex gap-4">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="delayed">Delayed</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Date Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="this-week">This Week</SelectItem>
                    <SelectItem value="this-month">This Month</SelectItem>
                    <SelectItem value="next-month">Next Month</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Site Name</TableHead>
                  <TableHead>Engineer</TableHead>
                  <TableHead>Install Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {installations.map((installation) => (
                  <TableRow key={installation.id}>
                    <TableCell className="font-medium">{installation.id}</TableCell>
                    <TableCell>{installation.siteName}</TableCell>
                    <TableCell>{installation.engineer}</TableCell>
                    <TableCell>{installation.installDate}</TableCell>
                    <TableCell>
                      <Badge variant={
                        installation.status === 'completed' ? 'default' : 
                        installation.status === 'in-progress' ? 'secondary' : 
                        installation.status === 'scheduled' ? 'outline' : 
                        'destructive'
                      }>
                        {installation.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminInstallations;
