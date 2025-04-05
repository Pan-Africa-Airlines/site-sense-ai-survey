
import React, { createContext, useContext, useState } from 'react';

interface AIContextType {
  isProcessing: boolean;
  analyzeImage: (imageData: string, type: string, prompt?: string) => Promise<string | null>;
  getSuggestion: (fieldName: string, formData: any, prompt?: string) => Promise<string | null>;
  enhanceNotes: (notes: string, prompt?: string) => Promise<string>;
}

const AIContext = createContext<AIContextType>({
  isProcessing: false,
  analyzeImage: async () => null,
  getSuggestion: async () => null,
  enhanceNotes: async () => "",
});

export const useAI = () => useContext(AIContext);

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const analyzeImage = async (imageData: string, type: string, prompt: string = ""): Promise<string | null> => {
    setIsProcessing(true);
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let response = "";
      if (type === "buildingPhoto") {
        response = "Building appears to be a standard substation structure with good access. No visible obstructions.";
      } else if (type.includes("cabinet")) {
        response = "Cabinet has sufficient space for equipment. Cooling systems appear adequate.";
      } else if (type.includes("power")) {
        response = "Power distribution looks well-organized with clear labeling of circuits.";
      } else {
        response = "Image analyzed successfully. No specific recommendations.";
      }
      
      return response;
    } catch (error) {
      console.error("Error analyzing image:", error);
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const getSuggestion = async (fieldName: string, formData: any, prompt: string = ""): Promise<string | null> => {
    setIsProcessing(true);
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let suggestion = "";
      
      if (fieldName === "accessRequirements") {
        suggestion = "Recommend scheduling access 48 hours in advance with security clearance requirements.";
      } else if (fieldName === "coolingMethod") {
        suggestion = "Based on the equipment load, recommend HVAC system with redundancy.";
      } else if (fieldName === "generalRemarks") {
        suggestion = "Consider adding details about future expansion requirements and maintenance access.";
      } else {
        suggestion = "AI has analyzed the form data and has no specific recommendations for this field.";
      }
      
      return suggestion;
    } catch (error) {
      console.error("Error generating suggestion:", error);
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const enhanceNotes = async (notes: string, prompt: string = ""): Promise<string> => {
    setIsProcessing(true);
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Simple enhancement by adding structured information
      const enhanced = notes + "\n\nAdditional considerations:\n- Ensure all equipment meets IP67 rating for dust protection\n- Verify backup power systems are properly configured\n- Confirm network redundancy paths are established";
      
      return enhanced;
    } catch (error) {
      console.error("Error enhancing notes:", error);
      return notes;
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AIContext.Provider value={{ isProcessing, analyzeImage, getSuggestion, enhanceNotes }}>
      {children}
    </AIContext.Provider>
  );
};
