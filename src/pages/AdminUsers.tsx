
import React, { useEffect, useState } from "react";
import { AdminNavLayout } from "@/components/admin/AdminNavLayout";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Eye, Edit, Trash2, Loader } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getEngineerProfiles } from "@/utils/dbHelpers";
import { toast } from "sonner";

const AdminUsers = () => {
  const navigate = useNavigate();
  const [engineers, setEngineers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
    if (!adminLoggedIn) {
      navigate("/admin/login");
    }
    
    fetchEngineerProfiles();
  }, [navigate]);
  
  const fetchEngineerProfiles = async () => {
    setIsLoading(true);
    try {
      const profiles = await getEngineerProfiles();
      
      if (profiles && profiles.length > 0) {
        // Transform profiles to match the user fields
        const engineerUsers = profiles.map(profile => ({
          id: profile.id,
          name: profile.name || "Unnamed Engineer",
          email: profile.email || "No email provided",
          role: profile.specializations?.length > 0 ? profile.specializations[0] : "Field Engineer",
          status: "active",
          experience: profile.experience || "Not specified",
          regions: profile.regions || []
        }));
        
        setEngineers(engineerUsers);
      } else {
        // Fallback to mock data if no profiles found
        setEngineers([
          { id: 1, name: "John Doe", email: "john.doe@example.com", role: "Field Engineer", status: "active", regions: ["Gauteng"], experience: "3 years" },
          { id: 2, name: "Jane Smith", email: "jane.smith@example.com", role: "Field Engineer", status: "active", regions: ["Western Cape"], experience: "5 years" },
          { id: 3, name: "Robert Johnson", email: "robert.johnson@example.com", role: "Field Engineer", status: "inactive", regions: ["Gauteng"], experience: "2 years" },
          { id: 4, name: "Sarah Williams", email: "sarah.williams@example.com", role: "Field Engineer", status: "active", regions: ["KwaZulu-Natal"], experience: "4 years" },
          { id: 5, name: "Michael Brown", email: "michael.brown@example.com", role: "Supervisor", status: "active", regions: ["Eastern Cape"], experience: "7 years" }
        ]);
      }
    } catch (error) {
      console.error("Error fetching engineer profiles:", error);
      toast.error("Failed to load engineer profiles");
      
      // Fallback to mock data
      setEngineers([
        { id: 1, name: "John Doe", email: "john.doe@example.com", role: "Field Engineer", status: "active", regions: ["Gauteng"], experience: "3 years" },
        { id: 2, name: "Jane Smith", email: "jane.smith@example.com", role: "Field Engineer", status: "active", regions: ["Western Cape"], experience: "5 years" },
        { id: 3, name: "Robert Johnson", email: "robert.johnson@example.com", role: "Field Engineer", status: "inactive", regions: ["Gauteng"], experience: "2 years" },
        { id: 4, name: "Sarah Williams", email: "sarah.williams@example.com", role: "Field Engineer", status: "active", regions: ["KwaZulu-Natal"], experience: "4 years" },
        { id: 5, name: "Michael Brown", email: "michael.brown@example.com", role: "Supervisor", status: "active", regions: ["Eastern Cape"], experience: "7 years" }
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filter users based on search query and filters
  const filteredUsers = engineers.filter(user => {
    // Search by name or email
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by role
    const matchesRole = roleFilter === "all" || user.role.toLowerCase() === roleFilter.toLowerCase();
    
    // Filter by status
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });
  
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const usersContent = (
    <div className="container mx-auto px-4 py-8 flex-1">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-akhanya">Users</h1>
        <Button className="bg-akhanya hover:bg-akhanya-dark">
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center relative flex-1">
              <Search className="absolute left-2 h-4 w-4 text-gray-500" />
              <Input 
                placeholder="Search users..." 
                className="pl-8" 
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <div className="flex gap-4">
              <Select 
                defaultValue="all" 
                value={roleFilter}
                onValueChange={setRoleFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="field engineer">Field Engineer</SelectItem>
                  <SelectItem value="supervisor">Supervisor</SelectItem>
                  <SelectItem value="administrator">Administrator</SelectItem>
                </SelectContent>
              </Select>
              <Select 
                defaultValue="all"
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <Loader className="h-8 w-8 animate-spin text-akhanya" />
              <span className="ml-2">Loading engineer profiles...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Regions</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No users found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.experience}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.regions && user.regions.length > 0 ? user.regions.map((region, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {region}
                            </Badge>
                          )) : (
                            <span className="text-gray-400 text-sm">No regions</span>
                          )}
                        </div>
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
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
  
  return (
    <AdminNavLayout>
      {usersContent}
    </AdminNavLayout>
  );
};

export default AdminUsers;
