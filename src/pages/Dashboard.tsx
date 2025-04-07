
import React, { useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import EngineerRatingSurvey from "@/components/EngineerRatingSurvey";
import { useDashboard } from "@/contexts/DashboardContext";

// Import the new components
import DashboardStatsSection from "@/components/dashboard/DashboardStatsSection";
import AIInsightsSection from "@/components/dashboard/AIInsightsSection";
import SiteAllocationsSection from "@/components/dashboard/SiteAllocationsSection";
import ChartsSection from "@/components/dashboard/ChartsSection";
import RecentActivitySection from "@/components/dashboard/RecentActivitySection";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
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
    setSelectedSite,
    handleOpenSurvey,
    handleCloseSurvey,
    refreshData
  } = useDashboard();

  const handleVehicleCheck = () => {
    navigate("/car-check");
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-akhanya">Dashboard</h1>
          <p className="text-gray-600">Welcome to the SiteSense monitoring platform</p>
        </div>
      </div>

      {engineerProfile && (
        <DashboardStatsSection 
          engineerProfile={engineerProfile} 
          totals={totals} 
        />
      )}

      <AIInsightsSection aiInsights={aiInsights} />

      <SiteAllocationsSection 
        allocatedSites={allocatedSites} 
        isLoading={isLoading} 
        handleOpenSurvey={handleOpenSurvey} 
      />

      <ChartsSection 
        assessmentData={chartData.assessments} 
        installationData={chartData.installations} 
        chartConfig={{
          completed: {
            label: "Completed",
            color: "#E13B45"
          },
          pending: {
            label: "Pending",
            color: "#3C3C3C"
          },
          installations: {
            label: "Installations",
            color: "#E13B45"
          }
        }} 
      />

      <RecentActivitySection 
        activities={recentActivities} 
        engineerInitials={engineerProfile ? engineerProfile.name.split(' ').map(name => name[0]).join('').toUpperCase() : ""} 
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
