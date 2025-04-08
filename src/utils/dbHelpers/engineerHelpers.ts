
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
    
    // If profile exists, return it
    if (data) {
      console.log("Found existing profile:", data);
      return data;
    }
    
    console.log("No existing profile found, creating new one");
    
    // Create new profile with default values
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
