
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import NavigationBar from "@/components/NavigationBar";
import { Button } from "@/components/ui/button";
import SiteAssessmentForm from "@/components/SiteAssessmentForm";
import NetworkingBanner from "@/components/NetworkingBanner";
import { useAI } from "@/contexts/AIContext";
import { Sparkles } from "lucide-react";

const Assessment = () => {
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);
  const { isProcessing } = useAI();
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get('draftId');

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
              {draftId ? `Edit Draft: ${draftId}` : "New Site Assessment"}
            </h2>
            <p className="text-gray-600">
              Complete the form below to assess a new installation site
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
        <SiteAssessmentForm showAIRecommendations={showAIRecommendations} />
      </div>
    </div>
  );
};

export default Assessment;
