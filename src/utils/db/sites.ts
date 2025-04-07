
import { supabase } from "@/integrations/supabase/client";
import { EskomSite } from "@/types/site";
import { toast } from "sonner";

// Helper function to get all sites from configuration
export const getConfiguredSites = async (): Promise<EskomSite[]> => {
  try {
    const { data, error } = await supabase
      .from('eskom_sites')
      .select('*')
      .order('name');
      
    if (error) {
      console.error("Error fetching sites:", error);
      toast.error("Failed to load sites. Please try again.");
      return [];
    }
    
    console.log("Fetched sites:", data?.length || 0);
    return data || [];
  } catch (error) {
    console.error("Error in getConfiguredSites:", error);
    toast.error("An unexpected error occurred while loading sites.");
    return [];
  }
};

// New function to get a specific site by ID
export const getSiteById = async (siteId: string): Promise<EskomSite | null> => {
  try {
    const { data, error } = await supabase
      .from('eskom_sites')
      .select('*')
      .eq('id', siteId)
      .single();
      
    if (error) {
      console.error("Error fetching site by ID:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in getSiteById:", error);
    return null;
  }
};
