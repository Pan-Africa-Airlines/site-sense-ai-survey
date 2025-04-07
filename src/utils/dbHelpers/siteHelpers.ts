
import { supabase } from "@/integrations/supabase/client";
import { EskomSite } from "@/types/site";
import { toast } from "sonner";

/**
 * Fetches all configured sites from the database
 */
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

/**
 * Formats a database date for display
 */
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
