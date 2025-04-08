
import React, { useEffect, useState } from "react";
import { AdminNavLayout } from "@/components/admin/AdminNavLayout";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { getEngineerProfiles } from "@/utils/dbHelpers";
import UsersList from "@/components/admin/users/UsersList";
import UsersFilter from "@/components/admin/users/UsersFilter";
import CreateUserForm from "@/components/admin/users/CreateUserForm";
import { v4 as uuidv4 } from 'uuid'; // Using uuid instead of crypto

interface User {
  id: string | number;
  name: string;
  email: string;
  role: string;
  status: string;
  experience: string;
  regions: string[];
}

const AdminUsers = () => {
  const navigate = useNavigate();
  const [engineers, setEngineers] = useState<User[]>([]);
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
  
  const filteredUsers = engineers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === "all" || user.role.toLowerCase() === roleFilter.toLowerCase();
    
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleAddUser = (newUser: User) => {
    setEngineers(prev => [...prev, newUser]);
  };
  
  const handleUpdateUser = (updatedUser: User) => {
    setEngineers(prev => 
      prev.map(user => user.id === updatedUser.id ? updatedUser : user)
    );
    toast.success(`User ${updatedUser.name} updated successfully`);
  };
  
  return (
    <AdminNavLayout>
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-akhanya">Users</h1>
          <CreateUserForm onUserCreated={handleAddUser} />
        </div>
        
        <UsersFilter 
          searchQuery={searchQuery}
          roleFilter={roleFilter}
          statusFilter={statusFilter}
          onSearchChange={handleSearch}
          onRoleFilterChange={setRoleFilter}
          onStatusFilterChange={setStatusFilter}
        />
        
        <Card>
          <CardContent className="p-0">
            <UsersList 
              users={filteredUsers} 
              isLoading={isLoading}
              onUserUpdated={handleUpdateUser}
            />
          </CardContent>
        </Card>
      </div>
    </AdminNavLayout>
  );
};

export default AdminUsers;
