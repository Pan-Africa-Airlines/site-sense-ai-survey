
import { supabase } from "@/integrations/supabase/client";
import { ensureEngineerProfile, generateAIInsights } from '@/utils/dbHelpers/engineerHelpers';
import { processAssessmentData, processInstallationData } from './chartDataUtils';
import { getAuthenticatedUserInfo } from './dashboardUserData';
import { generateMockDashboardData } from './dashboardMockData';
import { fetchEngineerAssessments } from './dashboardAssessmentData';
import { fetchEngineerInstallations, calculateSatisfactionRate } from './dashboardInstallationsData';
import { fetchRecentActivities } from './dashboardActivitiesData';

/**
 * Fetches all dashboard data for an engineer
 */
export const fetchDashboardData = async (setIsLoading: (loading: boolean) => void, toast: any) => {
  try {
    setIsLoading(true);
    
    // Get user info (authenticated or fallback)
    const userInfo = await getAuthenticatedUserInfo();
    
    // If not authenticated, return mock data
    if (!userInfo.isAuthenticated) {
      console.log("No authenticated user, using mock data");
      return generateMockDashboardData(userInfo.userId, userInfo.userName, userInfo.userEmail);
    }
    
    // Use auth user ID as the engineer ID
    const engId = userInfo.userId;
    console.log("Fetching dashboard data for engineer:", engId);
    
    // Ensure engineer profile exists
    const profile = await ensureEngineerProfile(engId, userInfo.userName, userInfo.userEmail);
    
    if (!profile) {
      console.error("Failed to create or retrieve engineer profile");
      toast({
        title: "Error loading profile",
        description: "Could not load your profile data. Please try again later."
      });
      return null;
    }
    
    console.log("Working with profile:", profile);
    
    // Generate AI insights
    const insights = await generateAIInsights(engId);
    console.log("Generated insights:", insights.length);
    
    // Fetch engineer allocations for the specific engineer
    const { data: allocations, error: allocationsError } = await supabase
      .from('engineer_allocations')
      .select('*')
      .eq('engineer_id', engId);
    
    if (allocationsError) {
      console.error("Error fetching allocations:", allocationsError);
      toast({
        title: "Error fetching allocations",
        description: allocationsError.message
      });
    }
    
    // Get installations data for this engineer
    const { installations, count: installationsCount } = await fetchEngineerInstallations(engId);
    
    // Get site assessments for this engineer
    const { assessments: siteAssessments, count: assessmentsCount, status: assessmentStatus } = 
      await fetchEngineerAssessments(userInfo.userId);
    
    // Calculate satisfaction rate
    const satisfactionRate = calculateSatisfactionRate(profile);
    
    console.log(`Processing chart data: ${siteAssessments?.length || 0} assessments, ${installations?.length || 0} installations`);
    
    // Set chart data based on the real assessments and installations
    const chartData = {
      assessments: processAssessmentData(siteAssessments), 
      installations: processInstallationData(installations)
    };
    
    // Set totals using real data
    const totals = {
      assessments: assessmentsCount,
      completedInstallations: installationsCount,
      satisfactionRate: satisfactionRate,
      assessmentStatus: assessmentStatus
    };
    
    // Fetch recent activities for this engineer
    const recentActivities = await fetchRecentActivities(userInfo.userId);
    
    return {
      engineerProfile: profile,
      allocatedSites: allocations || [],
      aiInsights: insights,
      chartData,
      totals,
      recentActivities
    };
    
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    toast({
      title: "Error loading dashboard",
      description: "There was a problem loading your dashboard data."
    });
    return null;
  } finally {
    setIsLoading(false);
  }
};
