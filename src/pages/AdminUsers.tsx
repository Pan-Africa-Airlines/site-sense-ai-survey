
import React, { useState, useEffect } from "react";
import AdminNavBar from "@/components/AdminNavBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";

// Mock data for users
const MOCK_USERS = [
  { id: 1, name: "John Doe", email: "john@akhanya.co.za", role: "Engineer", region: "Western Cape" },
  { id: 2, name: "Jane Smith", email: "jane@akhanya.co.za", role: "Engineer", region: "Gauteng" },
  { id: 3, name: "Admin User", email: "admin@akhanya.co.za", role: "Admin", region: "Head Office" },
  { id: 4, name: "Steve Johnson", email: "steve@akhanya.co.za", role: "Engineer", region: "KwaZulu-Natal" },
  { id: 5, name: "Mary Williams", email: "mary@akhanya.co.za", role: "Engineer", region: "Eastern Cape" },
];

const AdminUsers = () => {
  const [users, setUsers] = useState(MOCK_USERS);
  
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavBar />
      
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          <Button className="bg-red-600 hover:bg-red-700">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New User
          </Button>
        </div>
        
        <Card>
          <CardHeader className="bg-gray-50">
            <CardTitle>System Users</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.role === "Admin" 
                          ? "bg-red-100 text-red-800" 
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell>{user.region}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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

export default AdminUsers;
