
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ensureEngineerProfile, generateAIInsights } from '@/utils/db';
import { processAssessmentData, processInstallationData, processActivitiesData } from '@/utils/dashboardUtils';
import { 
  EngineerProfile, 
  AIInsight, 
  ChartData, 
  DashboardTotals, 
  RecentActivity, 
  SiteAllocation 
} from '@/types/dashboard';

export const useDashboardData = () => {
  const { toast } = useToast();
  const [engineerProfile, setEngineerProfile] = useState<EngineerProfile | null>(null);
  const [allocatedSites, setAllocatedSites] = useState<SiteAllocation[]>([]);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [chartData, setChartData] = useState<ChartData>({
    assessments: [],
    installations: [],
  });
  const [totals, setTotals] = useState<DashboardTotals>({
    assessments: 0,
    completedInstallations: 0,
    satisfactionRate: 0,
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);

  const refreshData = async () => {
    try {
      setIsLoading(true);
      
      // Get user info
      const userEmail = localStorage.getItem("userEmail") || "john.doe@example.com";
      const userName = userEmail.split('@')[0].split('.').map(name => 
        name.charAt(0).toUpperCase() + name.slice(1)
      ).join(' ');
      
      // Generate unique ID based on email - in production use auth.user.id
      const dummyEngId = userEmail.toLowerCase().replace(/[^a-z0-9]/g, '-');
      
      // Ensure engineer profile exists
      const profile = await ensureEngineerProfile(dummyEngId, userName, userEmail);
      
      if (profile) {
        setEngineerProfile(profile);
        
        // Generate AI insights if needed
        const insights = await generateAIInsights(dummyEngId);
        setAiInsights(insights);
        
        // Fetch engineer allocations
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
        
        // Get installation count - use mock data
        const installationsCount = 32; // Mock data
        
        // Use profile data for ratings if available, otherwise use mock
        let satisfactionRate = profile.average_rating 
          ? Math.round((profile.average_rating / 5) * 100) 
          : 95;
        
        // Set chart data
        setChartData({
          assessments: processAssessmentData([]),
          installations: processInstallationData([])
        });
        
        // Set totals
        setTotals({
          assessments: 39, // Mock value
          completedInstallations: installationsCount,
          satisfactionRate: satisfactionRate
        });
        
        // Set recent activities
        setRecentActivities(processActivitiesData([]));
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast({
        title: "Error loading dashboard",
        description: "There was a problem loading your dashboard data.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    engineerProfile,
    allocatedSites,
    aiInsights,
    chartData,
    totals,
    recentActivities,
    isLoading,
    refreshData
  };
};
