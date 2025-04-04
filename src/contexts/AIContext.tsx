
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from "sonner";

interface AIContextType {
  isProcessing: boolean;
  analyzeImage: (imageData: string) => Promise<string>;
  getSuggestion: (fieldName: string, currentData: Record<string, any>) => Promise<string | null>;
  enhanceNotes: (notes: string) => Promise<string>;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const useAI = () => {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};

interface AIProviderProps {
  children: ReactNode;
}

export const AIProvider: React.FC<AIProviderProps> = ({ children }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock AI image analysis function
  const analyzeImage = async (imageData: string): Promise<string> => {
    setIsProcessing(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, return canned responses based on timestamp to simulate different analyses
      const timestamp = new Date().getTime();
      const responses = [
        "The image shows a well-maintained network cabinet with proper cable management.",
        "The image appears to show outdated networking equipment that may need replacement.",
        "The image shows a server room with adequate cooling and power infrastructure.",
        "The image shows improperly installed cabling that may cause connectivity issues.",
        "The image shows a clean, well-organized rack setup with modern equipment."
      ];
      
      const responseIndex = timestamp % responses.length;
      return responses[responseIndex];
    } catch (error) {
      console.error("Error analyzing image:", error);
      toast.error("Failed to analyze image");
      return "Could not analyze image";
    } finally {
      setIsProcessing(false);
    }
  };

  // Mock function to get AI suggestions based on current form data
  const getSuggestion = async (fieldName: string, currentData: Record<string, any>): Promise<string | null> => {
    setIsProcessing(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // For demo purposes, return canned suggestions for specific fields
      const suggestions: Record<string, string> = {
        'siteCondition': 'Based on your entries, the site appears to be in good condition with minor maintenance needed.',
        'networkAvailability': 'Given the location details, fiber connectivity should be available from major ISPs.',
        'powerInfrastructure': 'Recommend checking UPS capacity based on the equipment specifications.',
        'coolingRequirements': 'Consider additional cooling based on the number of devices and room dimensions.',
        'equipmentRecommendation': 'Based on site requirements, recommend Cisco Catalyst switches and Meraki access points.',
        'installationNotes': 'Remember to include cable labeling and documentation of network topology.'
      };
      
      return suggestions[fieldName] || null;
    } catch (error) {
      console.error("Error getting AI suggestion:", error);
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  // Mock function to enhance/improve notes
  const enhanceNotes = async (notes: string): Promise<string> => {
    if (!notes || notes.trim() === '') return '';
    
    setIsProcessing(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // For demo purposes, just add some professional language to the notes
      const enhancedNotes = notes + "\n\nAdditional observations: Site appears to meet standards for the planned deployment. Recommend proceeding with standard implementation plan while noting the specific requirements documented above.";
      
      return enhancedNotes;
    } catch (error) {
      console.error("Error enhancing notes:", error);
      return notes;
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AIContext.Provider
      value={{
        isProcessing,
        analyzeImage,
        getSuggestion,
        enhanceNotes
      }}
    >
      {children}
    </AIContext.Provider>
  );
};
