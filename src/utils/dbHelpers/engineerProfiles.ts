
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches engineer profiles from the database
 * Internal version to avoid naming conflicts
 */
export const getEngineerProfilesInternal = async () => {
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

/**
 * Gets an engineer profile by ID
 */
export const getEngineerProfileById = async (profileId) => {
  try {
    console.log("Fetching engineer profile by ID:", profileId);
    const { data, error } = await supabase
      .from('engineer_profiles')
      .select('*')
      .eq('id', profileId)
      .maybeSingle();
      
    if (error) {
      console.error("Error fetching engineer profile:", error);
      throw error;
    }
    
    console.log("Engineer profile retrieved:", data);
    return data;
  } catch (error) {
    console.error("Failed to get engineer profile:", error);
    return null;
  }
};

/**
 * Update engineer profile from vehicle check
 */
export const updateProfileFromVehicleCheck = async (engineerId, vehicleData) => {
  try {
    // First get the existing profile
    const profile = await getEngineerProfileById(engineerId);
    
    if (!profile) {
      console.error("No profile found for engineer:", engineerId);
      return null;
    }
    
    // We could update profile based on vehicle data here if needed
    // For now, we'll just log that we received the data
    console.log("Received vehicle check data for engineer profile update:", vehicleData);
    
    return profile;
  } catch (error) {
    console.error("Failed to update profile from vehicle check:", error);
    return null;
  }
};
