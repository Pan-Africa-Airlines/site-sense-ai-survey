import { supabase } from "@/integrations/supabase/client";
import { EskomSite } from "@/types/site";

export const getConfiguredSites = async (): Promise<EskomSite[]> => {
  try {
    const { data, error } = await supabase
      .from("eskom_sites")
      .select("*")
      .order("name");

    if (error) throw error;
    return (data || []) as EskomSite[];
  } catch (error) {
    console.error("Error fetching sites:", error);
    return [];
  }
};

export const createInitialAllocations = async () => {
  try {
    // Check if allocations already exist
    const { data: existingAllocations, error: checkError } = await supabase
      .from("engineer_allocations")
      .select("id")
      .limit(1);

    if (checkError) throw checkError;

    // If allocations already exist, don't add demo data
    if (existingAllocations && existingAllocations.length > 0) {
      return;
    }

    // Demo allocations data
    const demoAllocations = [
      {
        site_id: "SITE001",
        site_name: "Eskom Substation Alpha",
        region: "Gauteng",
        address: "123 Main Road, Johannesburg",
        priority: "high",
        status: "pending",
        scheduled_date: "2025-04-10",
        distance: 15
      },
      {
        site_id: "SITE002",
        site_name: "Power Station Beta",
        region: "Western Cape",
        address: "45 Industrial Way, Pretoria",
        priority: "medium",
        status: "in-progress",
        scheduled_date: "2025-04-12",
        distance: 28
      },
      {
        site_id: "SITE003",
        site_name: "Transmission Tower Charlie",
        region: "KwaZulu-Natal",
        address: "78 Hill Street, Midrand",
        priority: "low",
        status: "pending",
        scheduled_date: "2025-04-15",
        distance: 7
      }
    ];

    // Insert demo allocations
    const { error: insertError } = await supabase
      .from("engineer_allocations")
      .insert(demoAllocations);

    if (insertError) throw insertError;
    
    console.log("Demo allocations added successfully");
    
  } catch (error) {
    console.error("Error creating initial allocations:", error);
  }
};

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

export const saveVehicleCheck = async (
  engineerId: string,
  status: "passed" | "fair" | "failed",
  vehicleName: string,
  notes?: string,
  details?: any
) => {
  try {
    const checkData = {
      engineer_id: engineerId,
      status,
      vehicle_name: vehicleName,
      notes: notes || null,
      details: details || {},
      check_date: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('vehicle_checks')
      .insert(checkData)
      .select() as { data: any; error: any };
      
    if (error) {
      console.error("Error saving vehicle check:", error);
      return null;
    }
    
    return data?.[0] || null;
  } catch (error) {
    console.error("Error in saveVehicleCheck:", error);
    return null;
  }
};

export const getLatestVehicleCheck = async (engineerId: string) => {
  try {
    const { data, error } = await supabase
      .from('vehicle_checks')
      .select('*')
      .eq('engineer_id', engineerId)
      .order('check_date', { ascending: false })
      .limit(1)
      .maybeSingle() as { data: any; error: any };
      
    if (error) {
      console.error("Error fetching vehicle check:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in getLatestVehicleCheck:", error);
    return null;
  }
};

export const formatDbDate = (dbDate: string | null): string => {
  if (!dbDate) return "Not scheduled";
  
  try {
    const date = new Date(dbDate);
    return date.toLocaleDateString('en-ZA', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  } catch (error) {
    // If dbDate is already formatted or can't be parsed, return as is
    return dbDate;
  }
};
