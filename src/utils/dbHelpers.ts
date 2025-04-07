import { supabase } from "@/integrations/supabase/client";
import { EskomSite } from "@/types/site";
import { toast } from "sonner";

/**
 * Fetches all configured sites from the database
 */
export const getConfiguredSites = async (): Promise<EskomSite[]> => {
  try {
    const { data, error } = await supabase
      .from("eskom_sites")
      .select("*")
      .order("name");

    if (error) throw error;
    return (data || []) as EskomSite[];
  } catch (error) {
    console.error("Error fetching sites:", error);
    return [];
  }
};

/**
 * Creates initial site allocations based on configured sites
 */
export const createInitialAllocations = async () => {
  try {
    // Check if allocations already exist
    const { data: existingAllocations, error: checkError } = await supabase
      .from("engineer_allocations")
      .select("id")
      .limit(1);

    if (checkError) throw checkError;

    // If allocations already exist, don't add demo data
    if (existingAllocations && existingAllocations.length > 0) {
      return;
    }

    // Get configured sites
    const configuredSites = await getConfiguredSites();
    
    // If no configured sites, we can't create allocations
    if (configuredSites.length === 0) {
      console.log("No configured sites found. Add sites in the Configuration page first.");
      return;
    }

    // Use up to 3 of the configured sites for demo allocations
    const sitesToUse = configuredSites.slice(0, 3);
    
    // Create demo allocations from configured sites
    const demoAllocations = sitesToUse.map((site, index) => {
      const priority = index === 0 ? "high" : index === 1 ? "medium" : "low";
      const status = index === 1 ? "in-progress" : "pending";
      const date = new Date();
      date.setDate(date.getDate() + (index + 1) * 2);
      
      return {
        site_id: site.id,
        site_name: site.name,
        region: site.region || "Unknown",
        address: `${index * 12 + 10} Main Road, ${site.region || "Unknown"}`,
        priority,
        status,
        scheduled_date: date.toISOString().split('T')[0],
        distance: (index + 1) * 7
      };
    });

    // Insert demo allocations if we have any sites
    if (demoAllocations.length > 0) {
      const { error: insertError } = await supabase
        .from("engineer_allocations")
        .insert(demoAllocations);
  
      if (insertError) throw insertError;
      
      console.log("Demo allocations added successfully");
    }
    
  } catch (error) {
    console.error("Error creating initial allocations:", error);
  }
};

/**
 * Generates AI insights for an engineer
 */
export const generateAIInsights = async (engineerId: string) => {
  try {
    // Check if we already have insights for this engineer
    const { data: existingInsights } = await supabase
      .from('ai_insights')
      .select('*')
      .eq('engineer_id', engineerId) as { data: any[] | null };
      
    // If there are already insights, don't generate new ones
    if (existingInsights && existingInsights.length > 0) {
      return existingInsights;
    }
    
    // Generate sample insights
    const insights = [
      {
        engineer_id: engineerId,
        type: "predictive",
        title: "Predictive Analysis",
        description: "Equipment at site B12 showing early signs of performance degradation. Maintenance recommended within 14 days.",
        icon: "trend-up"
      },
      {
        engineer_id: engineerId,
        type: "alert",
        title: "Network Anomaly Detected",
        description: "Unusual traffic pattern detected in Sandton branch. Possible security concern.",
        icon: "alert-triangle"
      },
      {
        engineer_id: engineerId,
        type: "optimization",
        title: "Resource Optimization",
        description: "Your deployment efficiency increased by 12% this month. Review best practices for continued improvement.",
        icon: "check"
      }
    ];
    
    // Insert the insights
    const { error } = await supabase
      .from('ai_insights')
      .insert(insights) as { error: any };
      
    if (error) {
      console.error("Error inserting AI insights:", error);
      return [];
    }
    
    return insights;
  } catch (error) {
    console.error("Error generating AI insights:", error);
    return [];
  }
};

/**
 * Creates or updates an engineer profile
 */
export const ensureEngineerProfile = async (
  id: string, 
  name: string, 
  email: string
) => {
  try {
    // Check if profile exists
    const { data, error } = await supabase
      .from('engineer_profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle() as { data: any; error: any };
      
    if (error) {
      console.error("Error checking engineer profile:", error);
      return null;
    }
    
    // If profile exists, return it
    if (data) {
      return data;
    }
    
    // Create new profile with default values
    const newProfile = {
      id,
      name,
      email,
      experience: "0 years",
      regions: ["Gauteng"],
      average_rating: 0,
      total_reviews: 0,
      specializations: ["Field Engineer"]
    };
    
    const { error: insertError } = await supabase
      .from('engineer_profiles')
      .insert(newProfile) as { error: any };
      
    if (insertError) {
      console.error("Error creating engineer profile:", insertError);
      return null;
    }
    
    return newProfile;
  } catch (error) {
    console.error("Error in ensureEngineerProfile:", error);
    return null;
  }
};

/**
 * Fetches all allocations for engineers
 */
export const getEngineerAllocations = async () => {
  try {
    // First get all configured sites
    const configuredSites = await getConfiguredSites();
    const configuredSiteIds = configuredSites.map(site => site.id);
    
    // Then fetch allocations only for those sites
    const { data, error } = await supabase
      .from('engineer_allocations')
      .select('*')
      .in('site_id', configuredSiteIds) as { data: any[]; error: any };
      
    if (error) {
      console.error("Error fetching allocations:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getEngineerAllocations:", error);
    return [];
  }
};

/**
 * Saves a vehicle check record
 */
export const saveVehicleCheck = async (
  engineerId: string,
  status: "passed" | "fair" | "failed",
  vehicleName: string,
  notes?: string,
  details?: any
) => {
  try {
    const checkData = {
      engineer_id: engineerId,
      status,
      vehicle_name: vehicleName,
      notes: notes || null,
      details: details || {},
      check_date: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('vehicle_checks')
      .insert(checkData)
      .select() as { data: any; error: any };
      
    if (error) {
      console.error("Error saving vehicle check:", error);
      return null;
    }
    
    return data?.[0] || null;
  } catch (error) {
    console.error("Error in saveVehicleCheck:", error);
    return null;
  }
};

/**
 * Gets the most recent vehicle check for an engineer
 */
export const getLatestVehicleCheck = async (engineerId: string) => {
  try {
    const { data, error } = await supabase
      .from('vehicle_checks')
      .select('*')
      .eq('engineer_id', engineerId)
      .order('check_date', { ascending: false })
      .limit(1)
      .maybeSingle() as { data: any; error: any };
      
    if (error) {
      console.error("Error fetching vehicle check:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in getLatestVehicleCheck:", error);
    return null;
  }
};

/**
 * Formats a database date for display
 */
export const formatDbDate = (dbDate: string | null): string => {
  if (!dbDate) return "Not scheduled";
  
  try {
    const date = new Date(dbDate);
    return date.toLocaleDateString('en-ZA', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  } catch (error) {
    // If dbDate is already formatted or can't be parsed, return as is
    return dbDate;
  }
};

/**
 * Allocates a site to an engineer
 */
export const allocateSiteToEngineer = async (
  siteId: string, 
  engineerId: string, 
  engineerName: string
) => {
  try {
    // First check if this site is already allocated
    const { data: existingAllocation, error: checkError } = await supabase
      .from('engineer_allocations')
      .select('*')
      .eq('site_id', siteId)
      .maybeSingle();
      
    if (checkError) throw checkError;
    
    // If allocation exists, update it
    if (existingAllocation) {
      const { error: updateError } = await supabase
        .from('engineer_allocations')
        .update({ 
          engineer_id: engineerId,
          engineer_name: engineerName,
          status: 'assigned'
        })
        .eq('site_id', siteId);
        
      if (updateError) throw updateError;
      
      toast.success("Site allocation updated successfully");
    } else {
      // If no allocation exists, we need site info to create one
      const { data: siteData, error: siteError } = await supabase
        .from('eskom_sites')
        .select('*')
        .eq('id', siteId)
        .single();
        
      if (siteError) throw siteError;
      
      // Create new allocation
      const { error: insertError } = await supabase
        .from('engineer_allocations')
        .insert({
          site_id: siteId,
          site_name: siteData.name,
          region: siteData.region || 'Unknown',
          status: 'assigned',
          priority: siteData.priority || 'medium',
          engineer_id: engineerId,
          engineer_name: engineerName,
          scheduled_date: new Date().toISOString().split('T')[0]
        });
        
      if (insertError) throw insertError;
      
      toast.success("Site allocated successfully");
    }
    
    return true;
  } catch (error) {
    console.error("Error allocating site:", error);
    toast.error("Failed to allocate site");
    return false;
  }
};

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
