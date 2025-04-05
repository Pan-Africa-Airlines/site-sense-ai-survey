
import React from "react";
import { toast } from "sonner";
import NavigationBar from "@/components/NavigationBar";
import SiteAssessmentForm from "@/components/SiteAssessmentForm";
import { useAI } from "@/contexts/AIContext";

const Assessment = () => {
  const { isProcessing } = useAI();

  const handleSubmit = (data: any) => {
    // In a real app, this would send data to your backend
    console.log("Assessment form submitted:", data);
    
    // Show success message
    toast.success("Site assessment completed successfully!", {
      description: "The data has been saved for review.",
    });
    
    // For demo purposes, we're just logging the data to console
    // In a real app, you would likely:
    // 1. Send this to your backend API
    // 2. Store in a database
    // 3. Allow retrieval later for installation phase
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavigationBar />
      <div className="container mx-auto px-4 py-6 flex-1">
        <SiteAssessmentForm onSubmit={handleSubmit} />
        
        {isProcessing && (
          <div className="fixed bottom-4 right-4 bg-akhanya text-white px-3 py-2 rounded-md shadow-lg animate-pulse-light">
            AI is processing...
          </div>
        )}
      </div>
    </div>
  );
};

export default Assessment;
