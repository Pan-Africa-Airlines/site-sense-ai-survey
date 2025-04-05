
import React, { createContext, useContext, useState, ReactNode } from "react";

export interface AIContextType {
  isProcessing: boolean;
  analyzeImage: (imageData: string, context?: string) => Promise<string | null>;
  getSuggestion: (fieldName: string, currentValue: string) => Promise<string | null>;
  enhanceNotes: (notes: string, context?: string) => Promise<string>;
}

const defaultContext: AIContextType = {
  isProcessing: false,
  analyzeImage: async () => null,
  getSuggestion: async () => null,
  enhanceNotes: async (notes) => notes,
};

const AIContext = createContext<AIContextType>(defaultContext);

interface AIProviderProps {
  children: ReactNode;
}

export const AIProvider: React.FC<AIProviderProps> = ({ children }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const analyzeImage = async (imageData: string, context: string = "general"): Promise<string | null> => {
    setIsProcessing(true);
    try {
      // Simulate AI analysis with a delayed response
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Return a mock analysis based on the context
      let analysis = "";
      if (context === "site") {
        analysis = "This appears to be a commercial building with adequate infrastructure for installation.";
      } else if (context === "equipment") {
        analysis = "The equipment looks properly installed and in good condition.";
      } else {
        analysis = "The image has been analyzed. No specific issues detected.";
      }
      
      return analysis;
    } catch (error) {
      console.error("Error analyzing image:", error);
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const getSuggestion = async (fieldName: string, currentValue: string): Promise<string | null> => {
    setIsProcessing(true);
    try {
      // Simulate AI suggestion with a delayed response
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Return a mock suggestion based on the field name
      let suggestion = "";
      switch (fieldName) {
        case "siteType":
          suggestion = "Based on the address, this appears to be a commercial site.";
          break;
        case "accessRequirements":
          suggestion = "Standard security clearance and safety equipment required.";
          break;
        case "coolingMethod":
          suggestion = "Consider active cooling solutions for this location.";
          break;
        default:
          suggestion = "No specific suggestions for this field.";
      }
      
      return suggestion;
    } catch (error) {
      console.error("Error getting suggestion:", error);
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const enhanceNotes = async (notes: string, context: string = "general"): Promise<string> => {
    setIsProcessing(true);
    try {
      // Simulate AI enhancement with a delayed response
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Return enhanced notes with added details
      const enhancedNotes = notes + "\n\n[AI Enhanced] Additional considerations: Ensure proper documentation of all installation steps. Verify compliance with safety regulations.";
      
      return enhancedNotes;
    } catch (error) {
      console.error("Error enhancing notes:", error);
      return notes; // Return original notes if enhancement fails
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

export const useAI = () => useContext(AIContext);
