
import { supabase } from "@/integrations/supabase/client";

// Create or update engineer profile
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
