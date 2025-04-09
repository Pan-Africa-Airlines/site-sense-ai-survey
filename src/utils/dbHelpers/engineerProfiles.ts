
import { supabase } from "@/integrations/supabase/client";
import { EngineerProfile } from "@/types/user";

/**
 * Fetches engineer profiles from the database
 */
export const getEngineerProfiles = async (): Promise<EngineerProfile[]> => {
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
export const updateEngineerProfile = async (
  profileId: string, 
  profileData: Partial<EngineerProfile>
): Promise<EngineerProfile> => {
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
 * Creates an engineer profile directly in the database
 * 
 * Fix for TypeScript error: Ensure id is always present in the data we send to Supabase
 */
export const createEngineerProfile = async (
  profileData: Partial<EngineerProfile>
): Promise<EngineerProfile> => {
  try {
    console.log("Creating engineer profile with data:", profileData);
    
    // Make sure the ID is set before insertion
    // This is necessary because Supabase expects 'id' to be a required field
    const dataWithId = {
      ...profileData,
      id: profileData.id || crypto.randomUUID()
    };
    
    console.log("Inserting profile with ID:", dataWithId.id);
    
    const { data, error } = await supabase
      .from('engineer_profiles')
      .insert(dataWithId)
      .select()
      .single();
      
    if (error) {
      console.error("Error creating engineer profile:", error);
      throw error;
    }
    
    console.log("Engineer profile created successfully:", data);
    return data;
  } catch (error) {
    console.error("Failed to create engineer profile:", error);
    throw error;
  }
};

/**
 * Creates an admin user in the database
 */
export const createAdminUser = async (): Promise<EngineerProfile | null> => {
  try {
    console.log("Checking if admin user exists...");
    
    // First check if admin user already exists
    const { data: existingAdmin, error: searchError } = await supabase
      .from('engineer_profiles')
      .select('*')
      .eq('email', 'admin@akhanya.co.za')
      .maybeSingle();
      
    if (searchError) {
      console.error("Error checking for admin user:", searchError);
      throw searchError;
    }
    
    // If admin already exists, return it
    if (existingAdmin) {
      console.log("Admin user already exists:", existingAdmin);
      return existingAdmin;
    }
    
    console.log("Admin user does not exist, creating...");
    
    // Generate user ID
    const userId = crypto.randomUUID();
    
    // Create engineer profile
    const adminProfile = {
      id: userId,
      name: "Admin User",
      email: "admin@akhanya.co.za",
      specializations: ["Administrator"],
      regions: ["All Regions"],
      experience: "Senior Admin",
      average_rating: 5.0,
      total_reviews: 0
    };
    
    const { data: newAdmin, error: profileError } = await supabase
      .from('engineer_profiles')
      .insert(adminProfile)
      .select()
      .single();
      
    if (profileError) {
      console.error("Error creating admin profile:", profileError);
      throw profileError;
    }
    
    console.log("Admin user created successfully:", newAdmin);
    
    // Log this action
    await supabase
      .from('system_logs')
      .insert({
        user_id: "system",
        user_name: "System",
        action: "admin_user_created",
        details: { email: 'admin@akhanya.co.za' }
      });
      
    return newAdmin;
  } catch (error) {
    console.error("Failed to create admin user:", error);
    return null;
  }
};
