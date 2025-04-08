
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches installation data for a specific engineer
 */
export const fetchEngineerInstallations = async (engineerId: string) => {
  try {
    console.log("Fetching installations for engineer:", engineerId);
    const { data: installations, error: installationsError } = await supabase
      .from('site_installations')
      .select('*')
      .eq('engineer_id', engineerId);
      
    if (installationsError) {
      console.error("Error fetching installations:", installationsError);
      return { installations: [], count: 0 };
    }
    
    // Log the data for debugging
    console.log(`Retrieved ${installations?.length || 0} installations for engineer ${engineerId}`);
    
    return {
      installations: installations || [],
      count: installations?.length || 0
    };
  } catch (error) {
    console.error("Error in fetchEngineerInstallations:", error);
    return { installations: [], count: 0 };
  }
};

/**
 * Fetches engineer allocations for a specific engineer
 */
export const fetchEngineerAllocations = async (engineerId: string) => {
  try {
    console.log("Fetching allocations for engineer:", engineerId);
    const { data: allocations, error: allocationsError } = await supabase
      .from('engineer_allocations')
      .select('*')
      .eq('engineer_id', engineerId);
      
    if (allocationsError) {
      console.error("Error fetching allocations:", allocationsError);
      return { allocations: [], count: 0 };
    }
    
    // Log the data for debugging
    console.log(`Retrieved ${allocations?.length || 0} allocations for engineer ${engineerId}`);
    
    return {
      allocations: allocations || [],
      count: allocations?.length || 0
    };
  } catch (error) {
    console.error("Error in fetchEngineerAllocations:", error);
    return { allocations: [], count: 0 };
  }
};

/**
 * Calculates satisfaction rate from engineer profile or provides fallback
 */
export const calculateSatisfactionRate = (profile: any): number => {
  if (profile?.average_rating) {
    // Convert average_rating to number to ensure it's a number
    const avgRating = parseFloat(profile.average_rating.toString());
    // Calculate satisfaction rate as a percentage of 5
    return Math.round((avgRating / 5) * 100);
  } 
  return 95; // Fallback value
};
