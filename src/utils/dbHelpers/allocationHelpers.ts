
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getConfiguredSites } from "./siteHelpers";

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
