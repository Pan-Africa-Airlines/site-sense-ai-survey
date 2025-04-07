
import { supabase } from "@/integrations/supabase/client";
import { ensureEngineerProfile, generateAIInsights } from '@/utils/dbHelpers';
import { formatTimeAgo } from './dateUtils';
import { processAssessmentData, processInstallationData, processActivitiesData } from './chartDataUtils';

/**
 * Fetches all dashboard data for an engineer
 */
export const fetchDashboardData = async (setIsLoading: (loading: boolean) => void, toast: any) => {
  try {
    setIsLoading(true);
    
    // Check for authenticated user
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.log("No authenticated session found");
      return null;
    }
    
    // Get user info from auth
    const user = session.user;
    console.log("Authenticated user:", user);
    
    // Get metadata
    const metadata = user.user_metadata || {};
    const userEmail = user.email || localStorage.getItem("userEmail") || "john.doe@example.com";
    const userName = metadata.name || userEmail.split('@')[0].split('.').map(name => 
      name.charAt(0).toUpperCase() + name.slice(1)
    ).join(' ');
    
    // Generate unique ID based on email - in production use auth.user.id
    const engId = user.id || userEmail.toLowerCase().replace(/[^a-z0-9]/g, '-');
    
    // Ensure engineer profile exists
    const profile = await ensureEngineerProfile(engId, userName, userEmail);
    
    if (!profile) {
      return null;
    }
    
    // Generate AI insights if needed
    const insights = await generateAIInsights(engId);
    
    // Fetch engineer allocations for the specific engineer
    const { data: allocations, error: allocationsError } = await supabase
      .from('engineer_allocations')
      .select('*')
      .eq('engineer_id', engId);
    
    if (allocationsError) {
      console.error("Error fetching allocations:", allocationsError);
      toast({
        title: "Error fetching site allocations",
        description: allocationsError.message,
        variant: "destructive"
      });
      return null;
    }
    
    // Get installation count - specifically for this engineer
    const { data: installations, error: installationsError } = await supabase
      .from('site_installations')
      .select('*')
      .eq('engineer_id', engId);
      
    const installationsCount = installations?.length || 0;
    
    // Get site assessment count from site_surveys table
    const { data: siteAssessments, error: assessmentsError } = await supabase
      .from('site_surveys')
      .select('*')
      .eq('user_id', user.id);
    
    if (assessmentsError) {
      console.error("Error fetching site assessments:", assessmentsError);
    }
    
    // Calculate total assessments count
    const assessmentsCount = siteAssessments?.length || 0;
    
    // Get vehicle check count for fallback if needed
    const { data: vehicleChecks, error: vehicleChecksError } = await supabase
      .from('vehicle_checks')
      .select('*')
      .eq('engineer_id', engId);
      
    // Use profile data for ratings if available, otherwise use mock
    let satisfactionRate = 0;
    if (profile.average_rating) {
      // Convert average_rating to number to ensure it's a number
      const avgRating = parseFloat(profile.average_rating.toString());
      // Calculate satisfaction rate as a percentage of 5
      satisfactionRate = Math.round((avgRating / 5) * 100);
    } else {
      satisfactionRate = 95; // Mock fallback
    }
    
    // Set chart data based on the real assessments and installations
    const chartData = {
      assessments: siteAssessments && siteAssessments.length > 0 
        ? processAssessmentData(siteAssessments) 
        : processAssessmentData([]),
      installations: installations && installations.length > 0
        ? processInstallationData(installations)
        : processInstallationData([])
    };
    
    // Set totals - use real data with fallbacks only if needed
    const totals = {
      assessments: assessmentsCount || vehicleChecks?.length || 0,
      completedInstallations: installationsCount || 0,
      satisfactionRate: satisfactionRate || 0
    };
    
    // Fetch recent activities
    const { data: recentSurveys, error: surveysError } = await supabase
      .from('site_surveys')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);
      
    // Process real activities if available
    let recentActivities = [];
    if (recentSurveys && recentSurveys.length > 0) {
      recentActivities = recentSurveys.map(survey => ({
        action: `Completed site assessment for ${survey.site_name}`,
        time: formatTimeAgo(new Date(survey.created_at)),
        location: survey.region || "Unknown"
      }));
    } else {
      // Fallback to mock data
      recentActivities = processActivitiesData([]);
    }
    
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
      description: "There was a problem loading your dashboard data.",
      variant: "destructive"
    });
    return null;
  } finally {
    setIsLoading(false);
  }
};
