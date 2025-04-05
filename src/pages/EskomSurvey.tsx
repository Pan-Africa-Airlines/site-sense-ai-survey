
import React, { useState } from "react";
import NavigationBar from "@/components/NavigationBar";
import EskomSiteSurveyForm from "@/components/EskomSiteSurveyForm";
import NetworkingBanner from "@/components/NetworkingBanner";
import { Button } from "@/components/ui/button";
import { useAI } from "@/contexts/AIContext";
import { Sparkles } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const EskomSurvey = () => {
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);
  const { isProcessing } = useAI();

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      <NetworkingBanner
        title="Eskom Site Survey"
        subtitle="Comprehensive evaluation of network infrastructure for Eskom sites"
      />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-akhanya">Eskom Site Survey</h2>
            <p className="text-gray-600">
              Complete the form below to document the site survey information
            </p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
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
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle AI assistance for this form</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <EskomSiteSurveyForm showAIRecommendations={showAIRecommendations} />
      </div>
    </div>
  );
};

export default EskomSurvey;
