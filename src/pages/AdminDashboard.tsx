
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

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean | null>(null);
  const [engineerAllocations, setEngineerAllocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [engineers, setEngineers] = useState<any[]>([]);
  const [stats, setStats] = useState({
    assessmentCount: 32,
    installationCount: 18,
    vehicleCheckCount: 27,
    pendingApprovalCount: 8
  });

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
        
        // Fetch allocations
        const { data, error } = await supabase
          .from('engineer_allocations')
          .select('*');
        
        if (error) {
          console.error("Error fetching allocations:", error);
          toast.error("Failed to fetch engineer allocations");
        } else {
          setEngineerAllocations(data || []);
        }

        // Fetch site surveys count for stats
        const { count: surveysCount, error: surveysError } = await supabase
          .from('site_surveys')
          .select('*', { count: 'exact', head: true });
          
        // Fetch installations count for stats
        const { count: installationsCount, error: installationsError } = await supabase
          .from('site_installations')
          .select('*', { count: 'exact', head: true });
          
        // Fetch vehicle checks count for stats
        const { count: checksCount, error: checksError } = await supabase
          .from('vehicle_checks')
          .select('*', { count: 'exact', head: true });
          
        // Update stats with real data if available
        setStats({
          assessmentCount: surveysCount !== null ? surveysCount : 32,
          installationCount: installationsCount !== null ? installationsCount : 18,
          vehicleCheckCount: checksCount !== null ? checksCount : 27,
          pendingApprovalCount: 8 // This could be replaced with a real count if available
        });

        // Set mock engineers data
        setEngineers([
          { id: "1", name: "John Doe", status: "available", vehicle: "Toyota Hilux" },
          { id: "2", name: "Jane Smith", status: "available", vehicle: "Ford Ranger" },
          { id: "3", name: "Robert Johnson", status: "busy", vehicle: "Nissan Navara" },
        ]);
      } catch (err) {
        console.error("Error:", err);
        toast.error("An error occurred while fetching dashboard data");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isAdminAuthenticated) {
      fetchEngineerAllocations();
    }
  }, [isAdminAuthenticated]);

  const navigateToSiteAllocation = () => {
    navigate("/admin/site-allocation");
  }

  const dashboardContent = (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-akhanya">Admin Dashboard</h1>
      
      <DashboardStatsCards 
        assessmentCount={stats.assessmentCount}
        installationCount={stats.installationCount}
        vehicleCheckCount={stats.vehicleCheckCount}
        pendingApprovalCount={stats.pendingApprovalCount}
      />
      
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
