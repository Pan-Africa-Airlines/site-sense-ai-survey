
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import NavigationBar from "@/components/navigation/NavigationBar";
import { Button } from "@/components/ui/button";
import SiteAssessmentForm from "@/components/SiteAssessmentForm";
import NetworkingBanner from "@/components/NetworkingBanner";
import { useAI } from "@/contexts/AIContext";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getConfiguredSites } from "@/utils/dbHelpers";
import { EskomSite } from "@/types/site";

const Assessment = () => {
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);
  const [configSites, setConfigSites] = useState<EskomSite[]>([]);
  const [siteData, setSiteData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const { isProcessing } = useAI();
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get('draftId');
  const siteId = searchParams.get('siteId');
  
  useEffect(() => {
    const fetchConfiguredSitesAndData = async () => {
      try {
        setIsLoading(true);
        // Get all configured sites
        const sites = await getConfiguredSites();
        setConfigSites(sites);
        
        // If a siteId is provided, find the matching site
        if (siteId) {
          const site = sites.find(s => s.id === siteId);
          if (site) {
            // Format site data for the form
            setSiteData({
              siteName: site.name,
              siteType: site.type || "Not specified",
              siteAddress: `Address for ${site.name}`, // Placeholder
              customerName: "Eskom Holdings",
              region: site.region || "Not specified",
              contactName: site.contact_name,
              contactPhone: site.contact_phone,
              contactEmail: site.contact_email
            });
          }
        }
      } catch (error) {
        console.error("Error fetching configured sites:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfiguredSitesAndData();
  }, [siteId]);

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
        {isLoading ? (
          <div className="text-center py-12">Loading site data...</div>
        ) : (
          <SiteAssessmentForm 
            showAIRecommendations={showAIRecommendations}
            initialData={{...siteData, configSites}}
          />
        )}
      </div>
    </div>
  );
};

export default Assessment;
