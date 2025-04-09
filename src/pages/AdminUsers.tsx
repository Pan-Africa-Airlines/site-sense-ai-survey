import React, { useEffect, useState } from "react";
import { AdminNavLayout } from "@/components/admin/AdminNavLayout";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { getEngineerProfiles } from "@/utils/dbHelpers";
import UsersList from "@/components/admin/users/UsersList";
import UsersFilter from "@/components/admin/users/UsersFilter";
import CreateUserForm from "@/components/admin/users/CreateUserForm";
import { supabase } from "@/integrations/supabase/client";

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
        toast.success(`Loaded ${engineerUsers.length} users`);
      } else {
        await createSampleUsers();
        const newProfiles = await getEngineerProfiles();
        
        if (newProfiles && newProfiles.length > 0) {
          const engineerUsers = newProfiles.map(profile => ({
            id: profile.id,
            name: profile.name || "Unnamed Engineer",
            email: profile.email || "No email provided",
            role: profile.specializations?.length > 0 ? profile.specializations[0] : "Field Engineer",
            status: "active",
            experience: profile.experience || "Not specified",
            regions: profile.regions || []
          }));
          
          setEngineers(engineerUsers);
          toast.success(`Created and loaded ${engineerUsers.length} sample users`);
        } else {
          toast.error("Failed to create sample users");
          setEngineers([]);
        }
      }
    } catch (error) {
      console.error("Error fetching engineer profiles:", error);
      toast.error("Failed to load engineer profiles");
      setEngineers([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const createSampleUsers = async () => {
    try {
      const sampleUsers = [
        { 
          id: crypto.randomUUID(), 
          name: "John Doe", 
          email: "john.doe@example.com", 
          specializations: ["Field Engineer"], 
          regions: ["Gauteng"], 
          experience: "3 years",
          average_rating: 4.5,
          total_reviews: 12
        },
        { 
          id: crypto.randomUUID(), 
          name: "Jane Smith", 
          email: "jane.smith@example.com", 
          specializations: ["Field Engineer"], 
          regions: ["Western Cape"], 
          experience: "5 years",
          average_rating: 4.8,
          total_reviews: 24
        },
        { 
          id: crypto.randomUUID(), 
          name: "Robert Johnson", 
          email: "robert.johnson@example.com", 
          specializations: ["Field Engineer"], 
          regions: ["Gauteng"], 
          experience: "2 years",
          average_rating: 3.9,
          total_reviews: 8
        },
        { 
          id: crypto.randomUUID(), 
          name: "Sarah Williams", 
          email: "sarah.williams@example.com", 
          specializations: ["Field Engineer"], 
          regions: ["KwaZulu-Natal"], 
          experience: "4 years",
          average_rating: 4.2,
          total_reviews: 15
        },
        { 
          id: crypto.randomUUID(), 
          name: "Michael Brown", 
          email: "michael.brown@example.com", 
          specializations: ["Supervisor"], 
          regions: ["Eastern Cape"], 
          experience: "7 years",
          average_rating: 4.7,
          total_reviews: 31
        },
        {
          id: crypto.randomUUID(),
          name: "Admin User",
          email: "admin@akhanya.co.za",
          specializations: ["Administrator"],
          regions: ["All Regions"],
          experience: "5 years",
          average_rating: 5.0,
          total_reviews: 10
        }
      ];
      
      for (const user of sampleUsers) {
        const { error } = await supabase
          .from('engineer_profiles')
          .insert(user);
          
        if (error) {
          console.error(`Error creating sample user ${user.name}:`, error);
        } else {
          console.log(`Created sample user: ${user.name}`);
        }
      }
      
      await supabase
        .from('system_logs')
        .insert({
          user_id: "system",
          user_name: "System",
          action: "sample_users_created",
          details: { count: sampleUsers.length }
        });
        
    } catch (error) {
      console.error("Error creating sample users:", error);
      throw error;
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
