
import { supabase } from "@/integrations/supabase/client";
import { ensureEngineerProfile, generateAIInsights } from '@/utils/dbHelpers/engineerHelpers';
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
      // Use fallback data for development
      const mockEngId = "fallback-user-id";
      const mockUserName = "Test Engineer";
      const mockEmail = "test.engineer@example.com";
      
      // Create a fallback profile
      const fallbackProfile = {
        id: mockEngId,
        name: mockUserName,
        email: mockEmail,
        experience: "5+ years",
        regions: ["Gauteng", "Western Cape"],
        average_rating: 4.8,
        total_reviews: 24,
        specializations: ["Network Installation", "Fiber Optics"]
      };
      
      // Generate mock insights
      const mockInsights = [
        {
          engineer_id: mockEngId,
          type: "predictive",
          title: "Predictive Analysis",
          description: "Equipment at site B12 showing early signs of performance degradation. Maintenance recommended within 14 days.",
          icon: "trend-up"
        },
        {
          engineer_id: mockEngId,
          type: "alert",
          title: "Network Anomaly Detected",
          description: "Unusual traffic pattern detected in Sandton branch. Possible security concern.",
          icon: "alert-triangle"
        },
        {
          engineer_id: mockEngId,
          type: "optimization",
          title: "Resource Optimization",
          description: "Your deployment efficiency increased by 12% this month. Review best practices for continued improvement.",
          icon: "check"
        }
      ];
      
      const mockTotals = {
        assessments: 24,
        completedInstallations: 18,
        satisfactionRate: 96,
        assessmentStatus: "In Progress"
      };
      
      return {
        engineerProfile: fallbackProfile,
        allocatedSites: [],
        aiInsights: mockInsights,
        chartData: {
          assessments: processAssessmentData([]),
          installations: processInstallationData([])
        },
        totals: mockTotals,
        recentActivities: processActivitiesData([])
      };
    }
    
    // Get user info from auth
    const user = session.user;
    console.log("Authenticated user:", user.id);
    
    // Get metadata
    const metadata = user.user_metadata || {};
    const userEmail = user.email || localStorage.getItem("userEmail") || "john.doe@example.com";
    const userName = metadata.name || userEmail.split('@')[0].split('.').map(name => 
      name.charAt(0).toUpperCase() + name.slice(1)
    ).join(' ');
    
    // Use auth.user.id as the engineer ID
    const engId = user.id;
    
    // Ensure engineer profile exists
    const profile = await ensureEngineerProfile(engId, userName, userEmail);
    
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
        title: "Error fetching site allocations",
        description: allocationsError.message
      });
    }
    
    // Get installation count - specifically for this engineer
    const { data: installations, error: installationsError } = await supabase
      .from('site_installations')
      .select('*')
      .eq('engineer_id', engId);
      
    const installationsCount = installations?.length || 0;
    
    // Get site assessment count from site_surveys table for this specific engineer
    const { data: siteAssessments, error: assessmentsError } = await supabase
      .from('site_surveys')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (assessmentsError) {
      console.error("Error fetching site assessments:", assessmentsError);
    }
    
    // Calculate total assessments count
    const assessmentsCount = siteAssessments?.length || 0;
    
    // Determine the latest assessment status
    let assessmentStatus = "None";
    if (siteAssessments && siteAssessments.length > 0) {
      const latestAssessment = siteAssessments[0];
      // Map database status to UI-friendly status
      switch(latestAssessment.status.toLowerCase()) {
        case 'draft':
          assessmentStatus = "Started";
          break;
        case 'in_progress':
        case 'pending':
          assessmentStatus = "In Progress";
          break;
        case 'completed':
        case 'approved':
          assessmentStatus = "Completed";
          break;
        case 'expired':
        case 'rejected':
          assessmentStatus = "Expired";
          break;
        default:
          assessmentStatus = latestAssessment.status;
      }
    }
    
    // Get vehicle check count for fallback if needed
    const { data: vehicleChecks, error: vehicleChecksError } = await supabase
      .from('vehicle_checks')
      .select('*')
      .eq('engineer_id', engId);
      
    // Use profile data for ratings if available, otherwise use fallback
    let satisfactionRate = 0;
    if (profile.average_rating) {
      // Convert average_rating to number to ensure it's a number
      const avgRating = parseFloat(profile.average_rating.toString());
      // Calculate satisfaction rate as a percentage of 5
      satisfactionRate = Math.round((avgRating / 5) * 100);
    } else {
      satisfactionRate = 95; // Fallback
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
      assessments: assessmentsCount,
      completedInstallations: installationsCount || 0,
      satisfactionRate: satisfactionRate || 0,
      assessmentStatus: assessmentStatus
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
      description: "There was a problem loading your dashboard data."
    });
    return null;
  } finally {
    setIsLoading(false);
  }
};
