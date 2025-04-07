
import { supabase } from "@/integrations/supabase/client";

/**
 * Saves a vehicle check record
 */
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

/**
 * Gets the most recent vehicle check for an engineer
 */
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
