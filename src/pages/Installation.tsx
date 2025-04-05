
import React, { useState } from "react";
import NavigationBar from "@/components/NavigationBar";
import SiteInstallationForm from "@/components/SiteInstallationForm";
import NetworkingBanner from "@/components/NetworkingBanner";
import { Button } from "@/components/ui/button";
import { useAI } from "@/contexts/AIContext";
import { Sparkles } from "lucide-react";

const Installation = () => {
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);
  const { isProcessing } = useAI();

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      <NetworkingBanner
        title="Network Installation"
        subtitle="Streamlined equipment and infrastructure deployment process"
      />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-akhanya">New Installation</h2>
            <p className="text-gray-600">
              Track and document the installation process
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
        <SiteInstallationForm showAIRecommendations={showAIRecommendations} />
      </div>
    </div>
  );
};

export default Installation;
