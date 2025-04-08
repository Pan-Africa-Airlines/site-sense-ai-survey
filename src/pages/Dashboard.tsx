
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Brain, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import EngineerRatingSurvey from "@/components/EngineerRatingSurvey";
import DashboardStatsCards from "@/components/dashboard/DashboardStatsCards";
import AIInsightsSection from "@/components/dashboard/AIInsightsSection";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import RecentActivitiesCard from "@/components/dashboard/RecentActivitiesCard";
import SiteAllocationsSection from "@/components/dashboard/SiteAllocationsSection";
import { EngineerProfile, AllocatedSite, AIInsight, ChartDataPoint, DashboardTotals, RecentActivity } from "@/types/dashboard";
import { useDashboardData } from "@/hooks/useDashboardData";
import VehicleStatusCard from "@/components/dashboard/VehicleStatusCard";

const Dashboard: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showSurvey, setShowSurvey] = useState(false);
  const [selectedSite, setSelectedSite] = useState<AllocatedSite | null>(null);
  
  // Use our custom dashboard data hook to fetch all data from the database
  const {
    engineerProfile,
    allocatedSites,
    aiInsights,
    chartData,
    totals,
    recentActivities,
    isLoading,
    refreshData
  } = useDashboardData();

  const handleVehicleCheck = () => {
    navigate("/car-check");
  };

  const handleOpenSurvey = (site: AllocatedSite) => {
    setSelectedSite(site);
    setShowSurvey(true);
  };

  const handleCloseSurvey = () => {
    setShowSurvey(false);
    setSelectedSite(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-akhanya">Dashboard</h1>
          <p className="text-gray-600">Welcome to the SiteSense monitoring platform</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        <VehicleStatusCard engineerId={engineerProfile?.id} isLoading={isLoading} />
        
        <div className="md:col-span-3">
          <DashboardStatsCards totals={totals} isLoading={isLoading} />
        </div>
      </div>

      <AIInsightsSection insights={aiInsights} />

      <SiteAllocationsSection 
        sites={allocatedSites} 
        isLoading={isLoading} 
        onOpenSurvey={handleOpenSurvey}
      />

      <DashboardCharts 
        assessmentData={chartData.assessments}
        installationData={chartData.installations}
      />

      <RecentActivitiesCard 
        activities={recentActivities}
        engineerName={engineerProfile?.name || ""}
      />

      <Dialog open={showSurvey} onOpenChange={setShowSurvey}>
        <DialogContent className="sm:max-w-md">
          {selectedSite && (
            <EngineerRatingSurvey
              engineerId={engineerProfile?.id || ""}
              engineerName={engineerProfile?.name || ""}
              siteId={selectedSite.site_id}
              siteName={selectedSite.site_name}
              onClose={handleCloseSurvey}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
