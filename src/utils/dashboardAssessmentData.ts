
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches site assessments for a specific engineer
 */
export const fetchEngineerAssessments = async (userId: string) => {
  try {
    console.log("Fetching assessments for user:", userId);
    const { data: siteAssessments, error: assessmentsError } = await supabase
      .from('site_surveys')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (assessmentsError) {
      console.error("Error fetching site assessments:", assessmentsError);
      return { assessments: [], count: 0, status: "None", completedCount: 0 };
    }
    
    console.log(`Retrieved ${siteAssessments?.length || 0} assessments for user ${userId}`);
    
    // Calculate total assessments count
    const assessmentsCount = siteAssessments?.length || 0;
    
    // Count completed assessments
    const completedAssessments = siteAssessments?.filter(
      assessment => assessment.status?.toLowerCase() === 'completed' || 
                    assessment.status?.toLowerCase() === 'approved'
    ) || [];
    const completedCount = completedAssessments.length;
    
    console.log(`Found ${completedCount} completed assessments`);
    
    // Determine the latest assessment status
    let assessmentStatus = "None";
    if (siteAssessments && siteAssessments.length > 0) {
      const latestAssessment = siteAssessments[0];
      // Map database status to UI-friendly status
      assessmentStatus = mapAssessmentStatus(latestAssessment.status);
    }
    
    return { 
      assessments: siteAssessments || [], 
      count: assessmentsCount, 
      status: assessmentStatus,
      completedCount: completedCount
    };
  } catch (error) {
    console.error("Error in fetchEngineerAssessments:", error);
    return { assessments: [], count: 0, status: "None", completedCount: 0 };
  }
};

/**
 * Maps database status to UI-friendly status
 */
export const mapAssessmentStatus = (dbStatus: string): string => {
  switch(dbStatus.toLowerCase()) {
    case 'draft':
      return "Started";
    case 'in_progress':
    case 'pending':
      return "In Progress";
    case 'completed':
    case 'approved':
      return "Completed";
    case 'expired':
    case 'rejected':
      return "Expired";
    default:
      return dbStatus;
  }
};
