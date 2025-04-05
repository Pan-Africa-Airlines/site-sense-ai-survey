
import React from "react";
import { toast } from "sonner";
import NavigationBar from "@/components/NavigationBar";
import SiteAssessmentForm from "@/components/SiteAssessmentForm";
import { useAI } from "@/contexts/AIContext";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

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
        <div className="mb-6 flex items-center">
          <Link to="/dashboard" className="inline-flex items-center text-akhanya hover:text-akhanya-dark mr-4">
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to Dashboard
          </Link>
          <nav className="text-sm">
            <ol className="flex items-center space-x-2">
              <li>
                <Link to="/dashboard" className="text-gray-500 hover:text-akhanya">Dashboard</Link>
              </li>
              <li className="text-gray-400">/</li>
              <li className="font-medium text-akhanya">Site Assessment</li>
            </ol>
          </nav>
        </div>
        
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
