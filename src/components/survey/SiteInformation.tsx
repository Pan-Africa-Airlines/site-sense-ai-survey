
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { EskomSite } from "@/types/site";

// Import all the smaller components
import SurveyHeader from "./site-information/SurveyHeader";
import SiteIdentification from "./site-information/SiteIdentification";
import BuildingPhoto from "./site-information/BuildingPhoto";
import SiteLocation from "./site-information/SiteLocation";
import EquipmentLocation from "./site-information/EquipmentLocation";
import AccessProcedure from "./site-information/AccessProcedure";
import SiteContactDetails from "./site-information/SiteContactDetails";

interface SiteInformationProps {
  formData: any;
  onInputChange: (field: string, value: any) => void;
  showAIRecommendations?: boolean;
}

const SiteInformation: React.FC<SiteInformationProps> = ({
  formData,
  onInputChange,
  showAIRecommendations = false
}) => {
  const [sites, setSites] = useState<EskomSite[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSites = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("eskom_sites")
          .select("*")
          .order("name");

        if (error) throw error;
        setSites((data || []) as EskomSite[]);
      } catch (error) {
        console.error("Error fetching sites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSites();
  }, []);

  return (
    <div className="space-y-6">
      <SurveyHeader />
      
      <SiteIdentification 
        formData={formData} 
        onInputChange={onInputChange}
        sites={sites}
        loading={loading}
      />
      
      <BuildingPhoto 
        formData={formData} 
        onInputChange={onInputChange} 
      />
      
      <SiteLocation 
        formData={formData} 
        onInputChange={onInputChange} 
      />
      
      <EquipmentLocation 
        formData={formData} 
        onInputChange={onInputChange} 
      />
      
      <AccessProcedure 
        formData={formData} 
        onInputChange={onInputChange} 
      />
      
      <SiteContactDetails 
        formData={formData} 
        onInputChange={onInputChange} 
      />
    </div>
  );
};

export default SiteInformation;
