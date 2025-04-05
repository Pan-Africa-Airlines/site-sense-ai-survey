
import React, { useState } from "react";
import AdminNavBar from "@/components/AdminNavBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, FileText, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

// Mock data for installations
const MOCK_INSTALLATIONS = [
  { 
    id: 1, 
    siteName: "Western Cape Sub-Station", 
    date: "2025-03-15", 
    engineer: "John Doe", 
    status: "Completed",
    equipmentInstalled: "Router, Switch, UPS",
    region: "Western Cape"
  },
  { 
    id: 2, 
    siteName: "Gauteng Distribution Center", 
    date: "2025-03-25", 
    engineer: "Jane Smith", 
    status: "In Progress",
    equipmentInstalled: "Router, Firewall",
    region: "Gauteng"
  },
  { 
    id: 3, 
    siteName: "KZN Main Station", 
    date: "2025-04-02", 
    engineer: "Steve Johnson", 
    status: "Scheduled",
    equipmentInstalled: "Pending",
    region: "KwaZulu-Natal"
  },
  { 
    id: 4, 
    siteName: "Eastern Cape Sub-Station", 
    date: "2025-03-10", 
    engineer: "Mary Williams", 
    status: "Completed",
    equipmentInstalled: "Router, Switch, Security Gateway",
    region: "Eastern Cape"
  },
  { 
    id: 5, 
    siteName: "Northern Cape Power Plant", 
    date: "2025-04-10", 
    engineer: "Unassigned", 
    status: "Scheduled",
    equipmentInstalled: "Pending",
    region: "Northern Cape"
  },
];

const AdminInstallations = () => {
  const [installations, setInstallations] = useState(MOCK_INSTALLATIONS);
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            <CheckCircle2 className="h-3 w-3 mr-1" /> Completed
          </Badge>
        );
      case "In Progress":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
            <Clock className="h-3 w-3 mr-1" /> In Progress
          </Badge>
        );
      case "Scheduled":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
            <AlertTriangle className="h-3 w-3 mr-1" /> Scheduled
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavBar />
      
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Installation Management</h1>
          <Button className="bg-red-600 hover:bg-red-700">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Installation
          </Button>
        </div>
        
        <Card>
          <CardHeader className="bg-gray-50">
            <CardTitle>Network Equipment Installations</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Site Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Engineer</TableHead>
                  <TableHead>Equipment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {installations.map((installation) => (
                  <TableRow key={installation.id}>
                    <TableCell className="font-medium">{installation.siteName}</TableCell>
                    <TableCell>{installation.date}</TableCell>
                    <TableCell>{installation.region}</TableCell>
                    <TableCell>{installation.engineer}</TableCell>
                    <TableCell>{installation.equipmentInstalled}</TableCell>
                    <TableCell>{getStatusBadge(installation.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="h-8 px-2">
                        <FileText className="h-4 w-4 mr-1" /> View Details
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
