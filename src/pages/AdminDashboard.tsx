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
    const adminLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
    setIsAdminAuthenticated(adminLoggedIn);
    
    if (!adminLoggedIn) {
      navigate("/admin/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch allocations from the database
        const allocations = await getEngineerAllocations();
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
          setEngineers([
            { id: "1", name: "John Doe", status: "available", vehicle: "Toyota Hilux" },
            { id: "2", name: "Jane Smith", status: "available", vehicle: "Ford Ranger" },
            { id: "3", name: "Robert Johnson", status: "busy", vehicle: "Nissan Navara" },
          ]);
        } else {
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
    
    if (isAdminAuthenticated) {
      fetchDashboardData();
    }
  }, [isAdminAuthenticated]);

  const navigateToSiteAllocation = () => {
    navigate("/admin/site-allocation");
  }

  const dashboardContent = (
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
  );

  return (
    <AdminNavLayout>
      {dashboardContent}
    </AdminNavLayout>
  );
};

export default AdminDashboard;
