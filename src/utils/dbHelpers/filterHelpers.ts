
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Fetches installations that meet specific criteria:
 * 1. Site exists in eskom_sites (configured)
 * 2. Has an engineer allocated
 * 3. Has a completed eskom site survey
 */
export const getFilteredInstallations = async () => {
  try {
    // First, get sites that have completed surveys
    const { data: surveysData, error: surveysError } = await supabase
      .from('site_surveys')
      .select('site_id')
      .eq('status', 'completed');
      
    if (surveysError) throw surveysError;
    
    // Extract site IDs with completed surveys
    const siteIdsWithCompletedSurveys = surveysData.map(survey => survey.site_id).filter(Boolean);
    
    if (siteIdsWithCompletedSurveys.length === 0) {
      console.log("No sites with completed surveys found");
      return [];
    }
    
    // Then get allocated sites that also have completed surveys
    const { data: allocationsData, error: allocationsError } = await supabase
      .from('engineer_allocations')
      .select(`
        id,
        site_id,
        site_name,
        engineer_id,
        engineer_name,
        status,
        scheduled_date,
        priority,
        region
      `)
      .not('engineer_id', 'is', null)
      .in('site_id', siteIdsWithCompletedSurveys);
      
    if (allocationsError) throw allocationsError;
    
    if (!allocationsData || allocationsData.length === 0) {
      console.log("No allocated sites with completed surveys found");
      return [];
    }
    
    // Format the data for the installations table
    const installations = allocationsData.map(allocation => ({
      id: allocation.id,
      siteName: allocation.site_name,
      siteId: allocation.site_id,
      engineer: allocation.engineer_name || "Unassigned",
      engineerId: allocation.engineer_id,
      installDate: allocation.scheduled_date || "Not scheduled",
      status: allocation.status || "pending",
      priority: allocation.priority || "medium",
      region: allocation.region || "Unknown"
    }));
    
    return installations;
  } catch (error) {
    console.error("Error fetching filtered installations:", error);
    toast.error("Failed to load installation data");
    return [];
  }
};

/**
 * Fetches assessments that meet specific criteria:
 * 1. Site exists in eskom_sites (configured)
 * 2. Has an engineer allocated
 * 3. Has a completed eskom site survey
 */
export const getFilteredAssessments = async () => {
  try {
    // First, get sites that have completed surveys
    const { data: surveysData, error: surveysError } = await supabase
      .from('site_surveys')
      .select('site_id, site_name, status, date, region')
      .eq('status', 'completed');
      
    if (surveysError) throw surveysError;
    
    // Extract site IDs with completed surveys
    const siteIdsWithCompletedSurveys = surveysData.map(survey => survey.site_id).filter(Boolean);
    
    if (siteIdsWithCompletedSurveys.length === 0) {
      console.log("No sites with completed surveys found");
      return [];
    }
    
    // Then get allocated sites that also have completed surveys
    const { data: allocationsData, error: allocationsError } = await supabase
      .from('engineer_allocations')
      .select(`
        id,
        site_id,
        site_name,
        engineer_id,
        engineer_name,
        status,
        region
      `)
      .not('engineer_id', 'is', null)
      .in('site_id', siteIdsWithCompletedSurveys);
      
    if (allocationsError) throw allocationsError;
    
    if (!allocationsData || allocationsData.length === 0) {
      console.log("No allocated sites with completed surveys found");
      return [];
    }
    
    // Combine data from surveys with allocations data
    const assessments = surveysData
      .filter(survey => {
        // Only include surveys whose site_id is also in allocations
        return allocationsData.some(alloc => alloc.site_id === survey.site_id);
      })
      .map(survey => {
        // Find the matching allocation
        const allocation = allocationsData.find(alloc => alloc.site_id === survey.site_id);
        
        return {
          id: survey.site_id,
          siteName: survey.site_name,
          engineer: allocation?.engineer_name || "Unassigned",
          date: survey.date,
          status: survey.status
        };
      });
    
    return assessments;
  } catch (error) {
    console.error("Error fetching filtered assessments:", error);
    toast.error("Failed to load assessment data");
    return [];
  }
};
