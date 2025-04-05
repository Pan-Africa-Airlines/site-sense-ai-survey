
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import NavigationBar from "@/components/NavigationBar";
import { Button } from "@/components/ui/button";
import SiteAssessmentForm from "@/components/SiteAssessmentForm";
import NetworkingBanner from "@/components/NetworkingBanner";
import { useAI } from "@/contexts/AIContext";
import { Sparkles } from "lucide-react";

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
  const { isProcessing } = useAI();
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get('draftId');
  const siteId = searchParams.get('siteId');
  
  // Get the site data based on siteId
  const siteData = siteId ? MOCK_SITE_DATA[siteId] || {} : {};

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
          initialData={siteData}
        />
      </div>
    </div>
  );
};

export default Assessment;
