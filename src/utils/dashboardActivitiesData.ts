
import { supabase } from "@/integrations/supabase/client";
import { formatTimeAgo } from './dateUtils';
import { RecentActivity } from "@/types/dashboard";

/**
 * Fetches recent activities for a specific engineer
 */
export const fetchRecentActivities = async (userId: string): Promise<RecentActivity[]> => {
  try {
    const { data: recentSurveys, error: surveysError } = await supabase
      .from('site_surveys')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);
      
    if (surveysError) {
      console.error("Error fetching recent surveys:", surveysError);
      return [];
    }
    
    // Process real activities if available
    if (recentSurveys && recentSurveys.length > 0) {
      return recentSurveys.map(survey => ({
        action: `Completed site assessment for ${survey.site_name}`,
        time: formatTimeAgo(new Date(survey.created_at)),
        location: survey.region || "Unknown"
      }));
    }
    
    // Return empty array if no data
    return [];
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    return [];
  }
};
