
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
import { getEngineerAllocations } from "@/utils/dbHelpers";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(true); // Default to true to show content
  const [engineerAllocations, setEngineerAllocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [engineers, setEngineers] = useState([
    { id: "1", name: "John Doe", status: "available", vehicle: "Toyota Hilux" },
    { id: "2", name: "Jane Smith", status: "available", vehicle: "Ford Ranger" },
    { id: "3", name: "Robert Johnson", status: "busy", vehicle: "Nissan Navara" },
  ]);

  useEffect(() => {
    console.log("AdminDashboard mounted");
    // Set admin logged in for testing
    localStorage.setItem("adminLoggedIn", "true");
    
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
      
      // If no allocations found, use mock data
      if (!allocations || allocations.length === 0) {
        console.log("No allocations found, using mock data");
        setEngineerAllocations([
          {
            id: "1",
            site_id: "site-1",
            site_name: "Johannesburg Substation",
            region: "Gauteng",
            priority: "high",
            status: "pending",
            scheduled_date: "2025-04-10",
            engineer_name: "John Doe"
          },
          {
            id: "2",
            site_id: "site-2",
            site_name: "Cape Town Network Hub",
            region: "Western Cape",
            priority: "medium",
            status: "in-progress",
            scheduled_date: "2025-04-12",
            engineer_name: "Jane Smith"
          }
        ]);
      } else {
        setEngineerAllocations(allocations);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      toast.error("Failed to load dashboard data");
      
      // Always set mock data as fallback
      setEngineerAllocations([
        {
          id: "1",
          site_id: "site-1",
          site_name: "Johannesburg Substation",
          region: "Gauteng",
          priority: "high",
          status: "pending",
          scheduled_date: "2025-04-10",
          engineer_name: "John Doe"
        },
        {
          id: "2",
          site_id: "site-2",
          site_name: "Cape Town Network Hub",
          region: "Western Cape",
          priority: "medium",
          status: "in-progress",
          scheduled_date: "2025-04-12",
          engineer_name: "Jane Smith"
        }
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
      <div className="container mx-auto px-4 py-6">
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
