
import { supabase } from "@/integrations/supabase/client";

/**
 * Internal version of getEngineerAllocations to avoid name conflicts
 * This is used internally by dashboard helpers
 */
export const getEngineerAllocationsInternal = async () => {
  try {
    console.log("Fetching engineer allocations (internal)...");
    const { data, error } = await supabase
      .from('engineer_allocations')
      .select('*');
      
    if (error) {
      console.error("Error fetching engineer allocations:", error);
      throw error;
    }
    
    console.log(`Retrieved ${data?.length || 0} engineer allocations`);
    return data || [];
  } catch (error) {
    console.error("Failed to get engineer allocations:", error);
    // Return empty array as fallback
    return [];
  }
};
