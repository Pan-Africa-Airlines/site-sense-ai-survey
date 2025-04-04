
import React from "react";
import { toast } from "sonner";
import SiteInstallationForm from "@/components/SiteInstallationForm";
import { useAI } from "@/contexts/AIContext";

const Installation = () => {
  const { isProcessing } = useAI();

  const handleSubmit = (data: any) => {
    // In a real app, this would send data to your backend
    console.log("Installation form submitted:", data);
    
    // Show success message
    toast.success("Installation record submitted successfully!", {
      description: "The data has been saved for review.",
    });
    
    // For demo purposes, we're just logging the data to console
    // In a real app, you would likely:
    // 1. Send this to your backend API
    // 2. Store in a database
    // 3. Generate reports or notifications
  };

  // In a real app, you might fetch the assessment data
  // const [assessmentData, setAssessmentData] = useState(null);
  // 
  // useEffect(() => {
  //   // Fetch assessment data from API or local storage
  //   // setAssessmentData(data);
  // }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <SiteInstallationForm 
        onSubmit={handleSubmit} 
        // assessmentData={assessmentData} 
      />
      
      {isProcessing && (
        <div className="fixed bottom-4 right-4 bg-bcx text-white px-3 py-2 rounded-md shadow-lg animate-pulse-light">
          AI is processing...
        </div>
      )}
    </div>
  );
};

export default Installation;
