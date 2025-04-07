
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches recent activities data
 */
export const getRecentActivities = async () => {
  try {
    // Get recent surveys (limited to 3)
    const { data: recentSurveys, error: surveysError } = await supabase
      .from('site_surveys')
      .select('site_name, region, date, status')
      .order('created_at', { ascending: false })
      .limit(3);
      
    if (surveysError) throw surveysError;
    
    // Format surveys data
    const surveyActivities = (recentSurveys || []).map(survey => ({
      id: Math.random().toString(36).substring(2),
      siteName: survey.site_name,
      region: survey.region,
      date: survey.date,
      status: survey.status,
      type: 'assessment'
    }));
    
    // Get recent vehicle checks (limited to 2)
    const { data: recentChecks, error: checksError } = await supabase
      .from('vehicle_checks')
      .select('vehicle_name, check_date, status')
      .order('check_date', { ascending: false })
      .limit(2);
      
    if (checksError) throw checksError;
    
    // Format vehicle checks data
    const checkActivities = (recentChecks || []).map(check => ({
      id: Math.random().toString(36).substring(2),
      siteName: check.vehicle_name,
      installDate: new Date(check.check_date).toISOString().split('T')[0],
      networkType: 'Vehicle Check',
      status: check.status
    }));
    
    return {
      recentAssessments: surveyActivities,
      recentInstallations: checkActivities
    };
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    return {
      recentAssessments: [],
      recentInstallations: []
    };
  }
};
