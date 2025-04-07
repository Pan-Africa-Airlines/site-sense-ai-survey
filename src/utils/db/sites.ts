
import { supabase } from "@/integrations/supabase/client";

// Helper function to get all sites from configuration
export const getConfiguredSites = async () => {
  try {
    const { data, error } = await supabase
      .from('eskom_sites')
      .select('*')
      .order('name');
      
    if (error) {
      console.error("Error fetching sites:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getConfiguredSites:", error);
    return [];
  }
};
