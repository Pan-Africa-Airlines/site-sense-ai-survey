
import React from "react";
import { useDashboard } from "@/contexts/DashboardContext";
import DashboardHeader from "./DashboardHeader";
import DashboardStatsCards from "./DashboardStatsCards";
import AIInsightsSection from "./AIInsightsSection";
import DashboardCharts from "./DashboardCharts";
import RecentActivitiesCard from "./RecentActivitiesCard";
import SiteAllocationsSection from "./SiteAllocationsSection";
import VehicleStatusCard from "./VehicleStatusCard";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import EngineerRatingSurvey from "@/components/EngineerRatingSurvey";
import { AllocatedSite } from "@/types/dashboard";

const EngineerDashboardContainer: React.FC = () => {
  const {
    engineerProfile,
    allocatedSites,
    aiInsights,
    chartData,
    totals,
    recentActivities,
    isLoading,
    selectedSite,
    showSurvey,
    setShowSurvey,
    handleOpenSurvey,
    handleCloseSurvey,
    refreshData
  } = useDashboard();

  return (
    <div className="container mx-auto px-4 py-6">
      <DashboardHeader 
        engineerName={engineerProfile?.name || "Engineer"} 
        onRefresh={refreshData}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <DashboardCharts 
          assessmentData={chartData.assessments}
          installationData={chartData.installations}
          isLoading={isLoading}
        />
        
        <RecentActivitiesCard 
          activities={recentActivities}
          engineerName={engineerProfile?.name || ""}
        />
      </div>

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

export default EngineerDashboardContainer;
