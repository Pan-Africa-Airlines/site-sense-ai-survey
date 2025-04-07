
import { supabase } from "@/integrations/supabase/client";

// Get engineer allocations with fallback to mock data
export const getEngineerAllocations = async () => {
  try {
    const { data, error } = await supabase
      .from('engineer_allocations')
      .select('*') as { data: any[]; error: any };
      
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
