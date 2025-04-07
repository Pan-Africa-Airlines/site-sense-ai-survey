
import { supabase } from "@/integrations/supabase/client";

// Generate dummy AI insights based on engineer performance
export const generateAIInsights = async (engineerId: string) => {
  try {
    // Check if we already have insights for this engineer
    const { data: existingInsights } = await supabase
      .from('ai_insights')
      .select('*')
      .eq('engineer_id', engineerId) as { data: any[] | null };
      
    // If there are already insights, don't generate new ones
    if (existingInsights && existingInsights.length > 0) {
      return existingInsights;
    }
    
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
    const { error } = await supabase
      .from('ai_insights')
      .insert(insights) as { error: any };
      
    if (error) {
      console.error("Error inserting AI insights:", error);
      return [];
    }
    
    return insights;
  } catch (error) {
    console.error("Error generating AI insights:", error);
    return [];
  }
};
