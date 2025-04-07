
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import NavigationBar from "@/components/NavigationBar";
import { Button } from "@/components/ui/button";
import SiteAssessmentForm from "@/components/SiteAssessmentForm";
import NetworkingBanner from "@/components/NetworkingBanner";
import { useAI } from "@/contexts/AIContext";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Define a type for Eskom sites that matches the database structure
interface EskomSite {
  id: string;
  name: string;
  type: string | null;
  created_at?: string;
}

// Mock site data based on siteId
const MOCK_SITE_DATA: Record<string, any> = {
  "1": {
    siteName: "Eskom Substation Alpha",
    siteAddress: "123 Main Road, Johannesburg",
    siteType: "Substation",
    customerName: "Eskom Holdings",
    region: "Gauteng"
  },
  "2": {
    siteName: "Power Station Beta",
    siteAddress: "45 Industrial Way, Pretoria",
    siteType: "Power Station",
    customerName: "Eskom Holdings",
    region: "Gauteng"
  },
  "3": {
    siteName: "Transmission Tower Charlie",
    siteAddress: "78 Hill Street, Midrand",
    siteType: "Transmission Tower",
    customerName: "Eskom Holdings",
    region: "Gauteng"
  }
};

const Assessment = () => {
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);
  const [configSites, setConfigSites] = useState<EskomSite[]>([]);
  const { isProcessing } = useAI();
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get('draftId');
  const siteId = searchParams.get('siteId');
  
  // Get the site data based on siteId
  const siteData = siteId ? MOCK_SITE_DATA[siteId] || {} : {};

  useEffect(() => {
    const fetchConfiguredSites = async () => {
      try {
        const { data, error } = await supabase
          .from("eskom_sites")
          .select("*")
          .order("name");

        if (error) throw error;
        setConfigSites((data || []) as EskomSite[]);
        
        // Add configured sites to MOCK_SITE_DATA
        if (data && data.length > 0) {
          data.forEach((site: EskomSite, index: number) => {
            const siteKey = (100 + index).toString();
            MOCK_SITE_DATA[siteKey] = {
              siteName: site.name,
              siteType: site.type || "Not specified",
              customerName: "Eskom Holdings",
              region: "Gauteng" // Default region
            };
          });
        }
      } catch (error) {
        console.error("Error fetching configured sites:", error);
      }
    };

    fetchConfiguredSites();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      <NetworkingBanner
        title="Site Assessment"
        subtitle="Comprehensive evaluation of network infrastructure requirements"
      />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-akhanya">
              {siteId 
                ? `Assessment for ${siteData.siteName || `Site #${siteId}`}`
                : draftId 
                  ? `Edit Draft: ${draftId}` 
                  : "New Site Assessment"}
            </h2>
            <p className="text-gray-600">
              Complete the form below to assess the installation site
            </p>
          </div>
          <Button
            variant="outline"
            className={`flex items-center gap-2 ${
              showAIRecommendations ? "bg-akhanya-light text-akhanya border-akhanya" : ""
            }`}
            onClick={() => setShowAIRecommendations(!showAIRecommendations)}
          >
            <Sparkles className="h-4 w-4" />
            AI Recommendations {showAIRecommendations ? "On" : "Off"}
          </Button>
        </div>
        <SiteAssessmentForm 
          showAIRecommendations={showAIRecommendations}
          initialData={{...siteData, configSites}}
        />
      </div>
    </div>
  );
};

export default Assessment;
