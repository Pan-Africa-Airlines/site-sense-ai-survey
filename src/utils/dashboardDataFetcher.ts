
import { supabase } from "@/integrations/supabase/client";
import { ensureEngineerProfile, generateAIInsights } from '@/utils/dbHelpers/engineerHelpers';
import { processAssessmentData, processInstallationData } from './chartDataUtils';
import { getAuthenticatedUserInfo } from './dashboardUserData';
import { generateMockDashboardData } from './dashboardMockData';
import { fetchEngineerAssessments } from './dashboardAssessmentData';
import { fetchEngineerInstallations, fetchEngineerAllocations, calculateSatisfactionRate } from './dashboardInstallationsData';
import { fetchRecentActivities } from './dashboardActivitiesData';

/**
 * Logs an action performed by a user to the system_logs table
 */
export const logUserAction = async (
  userId: string, 
  userName: string, 
  action: string, 
  details: any = {}
) => {
  try {
    // Use type assertion to tell TypeScript this is a valid table
    const { data, error } = await supabase
      .from('system_logs')
      .insert({
        user_id: userId,
        user_name: userName,
        action,
        details
      });
      
    if (error) {
      console.error("Error logging user action:", error);
    }
    
    return { success: !error, error };
  } catch (err) {
    console.error("Exception logging user action:", err);
    return { success: false, error: err };
  }
};

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
    const { allocations, count: allocationsCount } = await fetchEngineerAllocations(engId);
    
    // Get installations data for this engineer
    const { installations, count: installationsCount } = await fetchEngineerInstallations(engId);
    
    // Get site assessments for this engineer
    const { assessments: siteAssessments, count: assessmentsCount, status: assessmentStatus, completedCount: completedAssessmentsCount } = 
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
      completedAssessments: completedAssessmentsCount,
      allocations: allocationsCount,
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
