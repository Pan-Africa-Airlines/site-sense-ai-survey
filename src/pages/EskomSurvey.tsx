
import React, { useState } from "react";
import NavigationBar from "@/components/NavigationBar";
import EskomSiteSurveyForm from "@/components/EskomSiteSurveyForm";
import NetworkingBanner from "@/components/NetworkingBanner";
import { Button } from "@/components/ui/button";
import { useAI } from "@/contexts/AIContext";
import { Sparkles, FileText } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const EskomSurvey = () => {
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);
  const { isProcessing } = useAI();

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      <NetworkingBanner
        title="Eskom OT IP/MPLS Network"
        subtitle="Site Survey Report for Comprehensive Network Infrastructure Assessment"
      />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-akhanya">Eskom OT IP/MPLS Network Site Survey</h2>
            <p className="text-gray-600">
              Complete the form below to document the comprehensive site survey information
            </p>
          </div>
          <div className="flex space-x-3">
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
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => window.open("/public/lovable-uploads/3d43a04f-8853-44d0-aa58-fe39e729336d.png", "_blank")}
                  >
                    <FileText className="h-4 w-4" />
                    View Template
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View the original survey template</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <EskomSiteSurveyForm showAIRecommendations={showAIRecommendations} />
      </div>
    </div>
  );
};

export default EskomSurvey;
