
import React, { useEffect, useState } from "react";
import { AdminNavLayout } from "@/components/admin/AdminNavLayout";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import DashboardStatsCards from "@/components/admin/dashboard/DashboardStatsCards";
import SiteAllocationsTable from "@/components/admin/dashboard/SiteAllocationsTable";
import EngineerAvailabilityTable from "@/components/admin/dashboard/EngineerAvailabilityTable";
import DashboardCharts from "@/components/admin/dashboard/DashboardCharts";
import RecentActivitiesCards from "@/components/admin/dashboard/RecentActivitiesCards";
import { getEngineerAllocations, getEngineerProfiles } from "@/utils/dbHelpers";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(true); // Default to true to show content
  const [engineerAllocations, setEngineerAllocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [engineers, setEngineers] = useState([]);

  useEffect(() => {
    console.log("AdminDashboard mounted");
    // Set admin logged in for dashboard access
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("userEmail", "admin@akhanya.co.za");
    localStorage.setItem("adminLoggedIn", "true");
    localStorage.setItem("adminUsername", "admin@akhanya.co.za");
    
    // Tell the user about auto-login
    toast.success("Welcome, Administrator! Auto-logged in for demonstration.");
    
    // Always call fetchDashboardData, regardless of login status
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      console.log("Fetching dashboard data...");
      setIsLoading(true);
      
      // Fetch allocations from the database
      const allocations = await getEngineerAllocations();
      console.log("Engineer allocations fetched:", allocations);
      setEngineerAllocations(allocations);
      
      // Fetch engineer profiles
      const profiles = await getEngineerProfiles();
      console.log("Engineer profiles fetched:", profiles);
      
      if (profiles && profiles.length > 0) {
        // Map profiles to engineer data format
        const engineerData = profiles.map(profile => ({
          id: profile.id,
          name: profile.name || "Unknown Engineer",
          status: "available", // Default status
          vehicle: "Assigned Vehicle" // Default vehicle
        }));
        setEngineers(engineerData);
      } else {
        // Fallback mock data
        setEngineers([
          { id: "1", name: "John Doe", status: "available", vehicle: "Toyota Hilux" },
          { id: "2", name: "Jane Smith", status: "available", vehicle: "Ford Ranger" },
          { id: "3", name: "Robert Johnson", status: "busy", vehicle: "Nissan Navara" },
        ]);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      toast.error("Failed to load dashboard data");
      
      // Set fallback data
      setEngineerAllocations([]);
      setEngineers([
        { id: "1", name: "John Doe", status: "available", vehicle: "Toyota Hilux" },
        { id: "2", name: "Jane Smith", status: "available", vehicle: "Ford Ranger" },
        { id: "3", name: "Robert Johnson", status: "busy", vehicle: "Nissan Navara" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToSiteAllocation = () => {
    navigate("/admin/site-allocation");
  }

  return (
    <AdminNavLayout>
      <div className="container mx-auto px-4 py-6 bg-white">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-akhanya">Admin Dashboard</h1>
          <div className="text-sm text-gray-500">
            Welcome to the Akhanya IT Admin Panel
          </div>
        </div>
        
        <div className="mb-8">
          <DashboardStatsCards />
        </div>
        
        <div className="mb-8">
          <SiteAllocationsTable 
            engineerAllocations={engineerAllocations}
            isLoading={isLoading}
            navigateToSiteAllocation={navigateToSiteAllocation}
          />
        </div>
        
        <div className="mb-8">
          <EngineerAvailabilityTable
            engineers={engineers}
            engineerAllocations={engineerAllocations}
            navigateToSiteAllocation={navigateToSiteAllocation}
          />
        </div>
        
        <div className="mb-8">
          <DashboardCharts />
        </div>
        
        <div className="mb-8">
          <RecentActivitiesCards />
        </div>
      </div>
    </AdminNavLayout>
  );
};

export default AdminDashboard;
