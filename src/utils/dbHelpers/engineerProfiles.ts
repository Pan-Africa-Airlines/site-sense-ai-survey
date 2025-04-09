
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches engineer profiles from the database
 */
export const getEngineerProfiles = async () => {
  try {
    console.log("Fetching engineer profiles...");
    const { data, error } = await supabase
      .from('engineer_profiles')
      .select('*');
      
    if (error) {
      console.error("Error fetching engineer profiles:", error);
      throw error;
    }
    
    console.log(`Retrieved ${data?.length || 0} engineer profiles`);
    return data || [];
  } catch (error) {
    console.error("Failed to get engineer profiles:", error);
    // Return empty array as fallback
    return [];
  }
};

// Export the internal version to maintain compatibility
export { getEngineerProfiles as getEngineerProfilesInternal };

/**
 * Updates an engineer profile in the database
 */
export const updateEngineerProfile = async (profileId, profileData) => {
  try {
    console.log("Updating engineer profile:", profileId);
    const { data, error } = await supabase
      .from('engineer_profiles')
      .update(profileData)
      .eq('id', profileId)
      .select()
      .single();
      
    if (error) {
      console.error("Error updating engineer profile:", error);
      throw error;
    }
    
    console.log("Engineer profile updated successfully:", data);
    return data;
  } catch (error) {
    console.error("Failed to update engineer profile:", error);
    throw error;
  }
};
