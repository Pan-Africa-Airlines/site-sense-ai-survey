
import React, { useEffect, useState } from "react";
import { AdminNavLayout } from "@/components/admin/AdminNavLayout";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import DashboardStatsCards from "@/components/admin/dashboard/DashboardStatsCards";
import SiteAllocationsTable from "@/components/admin/dashboard/SiteAllocationsTable";
import EngineerAvailabilityTable from "@/components/admin/dashboard/EngineerAvailabilityTable";
import DashboardCharts from "@/components/admin/dashboard/DashboardCharts";
import RecentActivitiesCards from "@/components/admin/dashboard/RecentActivitiesCards";

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
    const fetchEngineerAllocations = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('engineer_allocations')
          .select('*');
        
        if (error) {
          console.error("Error fetching allocations:", error);
        } else {
          setEngineerAllocations(data || []);
        }

        setEngineers([
          { id: "1", name: "John Doe", status: "available", vehicle: "Toyota Hilux" },
          { id: "2", name: "Jane Smith", status: "available", vehicle: "Ford Ranger" },
          { id: "3", name: "Robert Johnson", status: "busy", vehicle: "Nissan Navara" },
        ]);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Set up real-time listener for allocations table changes
    const setupRealtimeSubscription = () => {
      const channel = supabase
        .channel('dashboard-allocation-changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'engineer_allocations' },
          (payload) => {
            console.log('Dashboard real-time update received:', payload);
            // Refresh data when allocations change
            fetchEngineerAllocations();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };
    
    if (isAdminAuthenticated) {
      fetchEngineerAllocations();
      const unsubscribe = setupRealtimeSubscription();
      
      return () => {
        unsubscribe();
      };
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
