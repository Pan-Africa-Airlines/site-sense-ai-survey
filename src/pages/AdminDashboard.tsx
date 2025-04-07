
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
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean | null>(null);
  const [engineerAllocations, setEngineerAllocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [engineers, setEngineers] = useState<any[]>([]);

  useEffect(() => {
    console.log("AdminDashboard mounted");
    const adminLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
    console.log("Admin logged in status:", adminLoggedIn);
    setIsAdminAuthenticated(adminLoggedIn);
    
    if (!adminLoggedIn) {
      console.log("Admin not logged in, redirecting to login");
      navigate("/admin/login");
    } else {
      console.log("Admin is logged in, fetching dashboard data");
      // For testing purposes, set adminLoggedIn to true
      localStorage.setItem("adminLoggedIn", "true");
      fetchDashboardData();
    }
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      console.log("Fetching dashboard data...");
      setIsLoading(true);
      
      // Fetch allocations from the database
      const allocations = await getEngineerAllocations();
      console.log("Engineer allocations fetched:", allocations);
      setEngineerAllocations(allocations);
      
      // Get unique engineers from allocations
      const uniqueEngineers = new Map();
      allocations.forEach(allocation => {
        if (allocation.engineer_id && allocation.engineer_name) {
          if (!uniqueEngineers.has(allocation.engineer_id)) {
            uniqueEngineers.set(allocation.engineer_id, {
              id: allocation.engineer_id,
              name: allocation.engineer_name,
              status: "available",
              vehicle: "Vehicle info not available"
            });
          }
        }
      });
      
      // If no engineers found from allocations, use mock data
      if (uniqueEngineers.size === 0) {
        console.log("No engineers found, using mock data");
        setEngineers([
          { id: "1", name: "John Doe", status: "available", vehicle: "Toyota Hilux" },
          { id: "2", name: "Jane Smith", status: "available", vehicle: "Ford Ranger" },
          { id: "3", name: "Robert Johnson", status: "busy", vehicle: "Nissan Navara" },
        ]);
      } else {
        console.log(`Found ${uniqueEngineers.size} engineers`);
        setEngineers(Array.from(uniqueEngineers.values()));
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      toast.error("Failed to load dashboard data");
      
      // Fallback to mock data
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

  // For testing purposes, simulate admin is authenticated
  if (isAdminAuthenticated === null) {
    console.log("Auth state still loading, showing loading state");
    return (
      <AdminNavLayout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6 text-akhanya">Loading Dashboard...</h1>
        </div>
      </AdminNavLayout>
    );
  }

  // Always render dashboard even if admin is not yet authenticated
  // This is temporary until authentication is properly implemented
  console.log("Rendering admin dashboard content");
  
  return (
    <AdminNavLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-akhanya">Admin Dashboard</h1>
        
        <DashboardStatsCards />
        
        <SiteAllocationsTable 
          engineerAllocations={engineerAllocations}
          isLoading={isLoading}
          navigateToSiteAllocation={navigateToSiteAllocation}
        />
        
        <EngineerAvailabilityTable
          engineers={engineers}
          engineerAllocations={engineerAllocations}
          navigateToSiteAllocation={navigateToSiteAllocation}
        />
        
        <DashboardCharts />
        
        <RecentActivitiesCards />
      </div>
    </AdminNavLayout>
  );
};

export default AdminDashboard;
