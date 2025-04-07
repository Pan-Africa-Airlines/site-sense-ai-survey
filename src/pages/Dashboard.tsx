
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Brain, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import EngineerRatingSurvey from "@/components/EngineerRatingSurvey";
import EngineerProfileCard from "@/components/dashboard/EngineerProfileCard";
import DashboardStatsCards from "@/components/dashboard/DashboardStatsCards";
import AIInsightsSection from "@/components/dashboard/AIInsightsSection";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import RecentActivitiesCard from "@/components/dashboard/RecentActivitiesCard";
import SiteAllocationsSection from "@/components/dashboard/SiteAllocationsSection";
import { EngineerProfile, AllocatedSite, AIInsight, ChartDataPoint, DashboardTotals, RecentActivity } from "@/types/dashboard";

const Dashboard: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [allocatedSites, setAllocatedSites] = useState<AllocatedSite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSurvey, setShowSurvey] = useState(false);
  const [selectedSite, setSelectedSite] = useState<AllocatedSite | null>(null);
  const [engineerData, setEngineerData] = useState({
    assessments: [
      { month: 'Jan', completed: 0, pending: 0 },
      { month: 'Feb', completed: 0, pending: 0 },
      { month: 'Mar', completed: 0, pending: 0 },
      { month: 'Apr', completed: 0, pending: 0 },
      { month: 'May', completed: 0, pending: 0 },
      { month: 'Jun', completed: 0, pending: 0 },
    ] as ChartDataPoint[],
    installations: [
      { month: 'Jan', installations: 0 },
      { month: 'Feb', installations: 0 },
      { month: 'Mar', installations: 0 },
      { month: 'Apr', installations: 0 },
      { month: 'May', installations: 0 },
      { month: 'Jun', installations: 0 },
    ] as ChartDataPoint[],
    totals: {
      assessments: 0,
      completedInstallations: 0,
      satisfactionRate: 0
    } as DashboardTotals,
    recentActivities: [] as RecentActivity[],
    aiInsights: [] as AIInsight[]
  });

  const userEmail = localStorage.getItem("userEmail") || "john.doe@example.com";
  const userName = userEmail.split('@')[0].split('.').map(name => 
    name.charAt(0).toUpperCase() + name.slice(1)
  ).join(' ');

  const [engineerProfile, setEngineerProfile] = useState<EngineerProfile>({
    id: "eng-001",
    name: userName,
    experience: "5 years",
    regions: ["Gauteng", "Western Cape", "Eastern Cape"],
    average_rating: 4.8,
    total_reviews: 124,
    specializations: ["Power Infrastructure", "Transmission Equipment"]
  });

  useEffect(() => {
    const fetchEngineerData = async () => {
      try {
        setIsLoading(true);
        
        // Use mock data for now since we don't have real data yet
        // In a production app, this would be replaced with actual database queries
        
        const mockProfileData = {
          id: "eng-001",
          name: userName,
          experience: "5 years",
          regions: ["Gauteng", "Western Cape", "Eastern Cape"],
          average_rating: 4.8,
          total_reviews: 124,
          specializations: ["Power Infrastructure", "Transmission Equipment"]
        };
        
        setEngineerProfile({
          id: mockProfileData.id,
          name: mockProfileData.name || userName,
          experience: mockProfileData.experience || "5 years",
          regions: mockProfileData.regions || ["Gauteng", "Western Cape", "Eastern Cape"],
          average_rating: mockProfileData.average_rating || 4.8,
          total_reviews: mockProfileData.total_reviews || 124,
          specializations: mockProfileData.specializations || ["Power Infrastructure", "Transmission Equipment"]
        });
        
        // Fetch assessments data - using mock data for now
        const mockAssessmentsData = [];
        
        // Fetch installations data - using mock data for now
        const mockInstallationsData = [];
        
        // Fetch engineer ratings - using mock data for now
        const mockRatingsData = [];
        
        // Fetch AI insights - using mock data for now
        const mockInsightsData = generateDefaultAIInsights();
        
        // Prepare data for charts
        const assessmentData = processAssessmentData(mockAssessmentsData || []);
        const installationData = processInstallationData(mockInstallationsData || []);
        const activitiesData = processActivitiesData([...(mockAssessmentsData || []), ...(mockInstallationsData || [])]);
        
        // Calculate averages and totals
        const totalAssessments = mockAssessmentsData?.length || 39;
        const completedInstallations = mockInstallationsData?.length || 32;
        
        // Calculate satisfaction rate from ratings
        let satisfactionRate = 95; // Default value
        if (mockRatingsData && mockRatingsData.length > 0) {
          const averageRating = mockRatingsData.reduce((sum, item) => sum + item.rating, 0) / mockRatingsData.length;
          satisfactionRate = Math.round((averageRating / 5) * 100);
        }
        
        setEngineerData({
          assessments: assessmentData,
          installations: installationData,
          totals: {
            assessments: totalAssessments,
            completedInstallations: completedInstallations,
            satisfactionRate: satisfactionRate
          },
          recentActivities: activitiesData,
          aiInsights: mockInsightsData || generateDefaultAIInsights()
        });

        // Fetch site allocations from the actual database
        const { data: allocations, error: allocationsError } = await supabase
          .from('engineer_allocations')
          .select('*');
        
        if (allocationsError) {
          console.error("Error fetching allocations:", allocationsError);
          toast({
            title: "Error fetching site allocations",
            description: allocationsError.message,
            variant: "destructive"
          });
        } else {
          setAllocatedSites(allocations || []);
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEngineerData();
  }, [toast, userEmail]);

  // Process assessment data for chart display
  const processAssessmentData = (data: any[]): ChartDataPoint[] => {
    // This would normally parse dates and group by month
    // For now, using mock data if database data is empty
    if (!data || data.length === 0) {
      return [
        { month: 'Jan', completed: 4, pending: 1 },
        { month: 'Feb', completed: 5, pending: 0 },
        { month: 'Mar', completed: 6, pending: 2 },
        { month: 'Apr', completed: 8, pending: 1 },
        { month: 'May', completed: 7, pending: 0 },
        { month: 'Jun', completed: 9, pending: 1 },
      ];
    }
    
    // Real implementation would process data here
    return [
      { month: 'Jan', completed: 4, pending: 1 },
      { month: 'Feb', completed: 5, pending: 0 },
      { month: 'Mar', completed: 6, pending: 2 },
      { month: 'Apr', completed: 8, pending: 1 },
      { month: 'May', completed: 7, pending: 0 },
      { month: 'Jun', completed: 9, pending: 1 },
    ];
  };
  
  // Process installation data for chart display
  const processInstallationData = (data: any[]): ChartDataPoint[] => {
    // This would normally parse dates and group by month
    // For now, using mock data if database data is empty
    if (!data || data.length === 0) {
      return [
        { month: 'Jan', installations: 2 },
        { month: 'Feb', installations: 4 },
        { month: 'Mar', installations: 5 },
        { month: 'Apr', installations: 7 },
        { month: 'May', installations: 6 },
        { month: 'Jun', installations: 8 },
      ];
    }
    
    // Real implementation would process data here
    return [
      { month: 'Jan', installations: 2 },
      { month: 'Feb', installations: 4 },
      { month: 'Mar', installations: 5 },
      { month: 'Apr', installations: 7 },
      { month: 'May', installations: 6 },
      { month: 'Jun', installations: 8 },
    ];
  };
  
  // Process activities data for recent activities display
  const processActivitiesData = (data: any[]): RecentActivity[] => {
    // This would normally parse dates and sort by most recent
    // For now, using mock data if database data is empty
    if (!data || data.length === 0) {
      return [
        { action: "Completed site assessment", time: "2 hours ago", location: "Johannesburg CBD" },
        { action: "Submitted installation report", time: "Yesterday", location: "Pretoria East" },
        { action: "Started vehicle check", time: "Yesterday", location: "Sandton" },
        { action: "Completed installation", time: "2 days ago", location: "Midrand" },
      ];
    }
    
    // Real implementation would process data here
    return [
      { action: "Completed site assessment", time: "2 hours ago", location: "Johannesburg CBD" },
      { action: "Submitted installation report", time: "Yesterday", location: "Pretoria East" },
      { action: "Started vehicle check", time: "Yesterday", location: "Sandton" },
      { action: "Completed installation", time: "2 days ago", location: "Midrand" },
    ];
  };
  
  const generateDefaultAIInsights = (): AIInsight[] => {
    return [
      {
        type: "predictive",
        title: "Predictive Analysis",
        description: "Equipment at site B12 showing early signs of performance degradation. Maintenance recommended within 14 days.",
        icon: "trend-up"
      },
      {
        type: "alert",
        title: "Network Anomaly Detected",
        description: "Unusual traffic pattern detected in Sandton branch. Possible security concern.",
        icon: "alert-triangle"
      },
      {
        type: "optimization",
        title: "Resource Optimization",
        description: "Your deployment efficiency increased by 12% this month. Review best practices for continued improvement.",
        icon: "check"
      }
    ];
  };

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
        <EngineerProfileCard engineerProfile={engineerProfile} />
        
        <div className="md:col-span-3">
          <DashboardStatsCards totals={engineerData.totals} />
        </div>
      </div>

      <AIInsightsSection insights={engineerData.aiInsights} />

      <SiteAllocationsSection 
        sites={allocatedSites} 
        isLoading={isLoading} 
        onOpenSurvey={handleOpenSurvey}
      />

      <DashboardCharts 
        assessmentData={engineerData.assessments}
        installationData={engineerData.installations}
      />

      <RecentActivitiesCard 
        activities={engineerData.recentActivities}
        engineerName={engineerProfile.name}
      />

      <Dialog open={showSurvey} onOpenChange={setShowSurvey}>
        <DialogContent className="sm:max-w-md">
          {selectedSite && (
            <EngineerRatingSurvey
              engineerId={engineerProfile.id}
              engineerName={engineerProfile.name}
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
