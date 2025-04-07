
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { EskomSite } from "@/types/site";
import { dummySites } from "@/utils/dummySiteData";
import { toast } from "sonner";

export const useEskomSitesData = () => {
  const [sites, setSites] = useState<EskomSite[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSites = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("eskom_sites")
        .select("*")
        .order("name");

      if (error) throw error;

      if (data && data.length > 0) {
        // Sites already exist
        setSites(data as EskomSite[]);
      } else {
        // No sites found, insert dummy sites
        const { data: insertedData, error: insertError } = await supabase
          .from("eskom_sites")
          .insert(dummySites)
          .select();
        
        if (insertError) throw insertError;
        
        if (insertedData) {
          setSites(insertedData as EskomSite[]);
          toast.success("Demo sites loaded successfully");
        }
      }
    } catch (error) {
      console.error("Error fetching sites:", error);
      toast.error("Failed to load sites");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSites();
  }, []);

  return { 
    sites,
    loading,
    setSites,
    refreshSites: fetchSites
  };
};
