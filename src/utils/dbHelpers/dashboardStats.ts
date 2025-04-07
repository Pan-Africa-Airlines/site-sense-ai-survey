
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Fetches dashboard statistics from the database
 */
export const getDashboardStats = async () => {
  try {
    console.log("Fetching dashboard stats...");
    
    // Always initialize with zeros
    const statsData = {
      completedAssessments: 0,
      vehicleChecks: 0,
      installations: 0,
      pendingApprovals: 0
    };
    
    try {
      // Get completed site assessments count
      const { data: completedAssessments, error: assessmentsError } = await supabase
        .from('site_surveys')
        .select('id')
        .eq('status', 'completed');
        
      if (assessmentsError) throw assessmentsError;
      console.log("Completed assessments:", completedAssessments?.length || 0);
      statsData.completedAssessments = completedAssessments?.length || 0;
      
      // Get vehicle checks count - count unique engineers with vehicle checks
      const { data: vehicleChecks, error: vehicleChecksError } = await supabase
        .from('vehicle_checks')
        .select('id, engineer_id');
        
      if (vehicleChecksError) throw vehicleChecksError;
      
      const uniqueEngineers = new Set();
      vehicleChecks?.forEach(check => {
        if (check.engineer_id) uniqueEngineers.add(check.engineer_id);
      });
      console.log("Vehicle checks by unique engineers:", uniqueEngineers.size);
      statsData.vehicleChecks = uniqueEngineers.size;
      
      // Get installations count
      const { data: installations, error: installationsError } = await supabase
        .from('site_installations')
        .select('id');
        
      if (installationsError) throw installationsError;
      console.log("Installations:", installations?.length || 0);
      statsData.installations = installations?.length || 0;
      
      // Get approved assessments count
      const { data: approvedAssessments, error: approvedError } = await supabase
        .from('site_surveys')
        .select('id')
        .eq('status', 'approved');
        
      if (approvedError) throw approvedError;
      console.log("Approved assessments:", approvedAssessments?.length || 0);
      statsData.pendingApprovals = approvedAssessments?.length || 0;
      
      return statsData;
    } catch (dbError) {
      console.error("Database error:", dbError);
      console.log("Using fallback data due to DB error");
      return statsData;
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    toast.error("Failed to load dashboard statistics");
    
    // Return zeros if there's an error
    return {
      completedAssessments: 0,
      vehicleChecks: 0,
      installations: 0,
      pendingApprovals: 0
    };
  }
};
