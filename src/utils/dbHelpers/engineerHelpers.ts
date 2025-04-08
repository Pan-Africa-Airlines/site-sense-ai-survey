
import { supabase } from "@/integrations/supabase/client";

/**
 * Generates AI insights for an engineer
 */
export const generateAIInsights = async (engineerId: string) => {
  try {
    console.log("Generating AI insights for engineer:", engineerId);
    
    // Check if we already have insights for this engineer
    const { data: existingInsights, error: fetchError } = await supabase
      .from('ai_insights')
      .select('*')
      .eq('engineer_id', engineerId);
      
    if (fetchError) {
      console.error("Error fetching existing insights:", fetchError);
      return [];
    }
      
    // If there are already insights, return them
    if (existingInsights && existingInsights.length > 0) {
      console.log("Found existing insights:", existingInsights.length);
      return existingInsights;
    }
    
    console.log("No existing insights found, generating new ones");
    
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
    const { error: insertError } = await supabase
      .from('ai_insights')
      .insert(insights);
      
    if (insertError) {
      console.error("Error inserting AI insights:", insertError);
      return [];
    }
    
    console.log("Successfully generated and inserted new insights");
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
    console.log("Ensuring engineer profile exists for:", id);
    console.log("Using name:", name);
    
    // Check if profile exists
    const { data, error } = await supabase
      .from('engineer_profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle();
      
    if (error) {
      console.error("Error checking engineer profile:", error);
      return null;
    }
    
    // If profile exists and has a default name, update it
    if (data) {
      console.log("Found existing profile:", data);
      
      // Update name if it's a default value
      if (data.name === "Test Engineer" || !data.name || data.name.includes("Unknown")) {
        console.log("Updating profile with real name:", name);
        const { data: updatedProfile, error: updateError } = await supabase
          .from('engineer_profiles')
          .update({ name })
          .eq('id', id)
          .select()
          .single();
          
        if (updateError) {
          console.error("Error updating profile name:", updateError);
          return data;
        }
        
        console.log("Profile updated with real name:", updatedProfile);
        return updatedProfile;
      }
      
      return data;
    }
    
    console.log("No existing profile found, creating new one with name:", name);
    
    // Create new profile with provided values
    const newProfile = {
      id,
      name,
      email,
      experience: "Member since 2024",
      regions: ["Gauteng"],
      average_rating: 0,
      total_reviews: 0,
      specializations: ["Field Engineer"]
    };
    
    const { error: insertError, data: insertedProfile } = await supabase
      .from('engineer_profiles')
      .insert(newProfile)
      .select()
      .single();
      
    if (insertError) {
      console.error("Error creating engineer profile:", insertError);
      return null;
    }
    
    console.log("Successfully created new profile:", insertedProfile);
    return insertedProfile || newProfile;
  } catch (error) {
    console.error("Error in ensureEngineerProfile:", error);
    return null;
  }
};

/**
 * Get current user's engineer profile - added to directly link to auth state
 */
export const getCurrentEngineerProfile = async () => {
  try {
    // Get the current session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.log("No authenticated session found");
      return null;
    }
    
    // Get user info from auth
    const user = session.user;
    console.log("Fetching engineer profile for authenticated user:", user.id);
    
    // Get metadata for display name
    const metadata = user.user_metadata || {};
    const userEmail = user.email || "";
    const userName = metadata.name || userEmail.split('@')[0].split('.').map(name => 
      name.charAt(0).toUpperCase() + name.slice(1)
    ).join(' ');
    
    console.log("Using authenticated user name:", userName);
    
    // Check if profile exists
    const { data, error } = await supabase
      .from('engineer_profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();
      
    if (error) {
      console.error("Error fetching engineer profile:", error);
      return null;
    }
    
    // If profile exists, return it (possibly after updating name)
    if (data) {
      console.log("Found existing engineer profile:", data);
      
      // Update name if it's a default value
      if (data.name === "Test Engineer" || !data.name || data.name.includes("Unknown")) {
        console.log("Updating profile with real name:", userName);
        const { data: updatedProfile, error: updateError } = await supabase
          .from('engineer_profiles')
          .update({ name: userName })
          .eq('id', user.id)
          .select()
          .single();
          
        if (updateError) {
          console.error("Error updating profile name:", updateError);
          return data;
        }
        
        console.log("Profile updated with real name:", updatedProfile);
        return updatedProfile;
      }
      
      return data;
    }
    
    // If no profile exists, create one
    console.log("No existing profile found, creating one for:", userName);
    return await ensureEngineerProfile(user.id, userName, userEmail);
  } catch (error) {
    console.error("Error getting current engineer profile:", error);
    return null;
  }
};
