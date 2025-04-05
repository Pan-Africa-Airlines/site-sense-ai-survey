
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AIContextType {
  isProcessing: boolean;
  analyzeImage: (imageData: string, field: string, prompt?: string) => Promise<string>;
  getSuggestion: (fieldName: string, currentData: Record<string, any>) => Promise<string | null>;
  enhanceNotes: (notes: string, prompt?: string) => Promise<string>;
  generateReport: (surveyData: Record<string, any>) => Promise<string>;
  detectAnomalies: (surveyData: Record<string, any>) => Promise<string>;
  recommendMaintenance: (surveyData: Record<string, any>, imageData?: string) => Promise<string>;
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

  // Real AI image analysis function using OpenAI
  const analyzeImage = async (imageData: string, field: string, prompt?: string): Promise<string> => {
    setIsProcessing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('openai-analysis', {
        body: {
          action: 'analyzeImage',
          data: { imageData, field, prompt }
        }
      });
      
      if (error) throw error;
      return data.analysis || "Could not analyze image";
    } catch (error) {
      console.error("Error analyzing image:", error);
      toast.error("Failed to analyze image");
      return "Could not analyze image";
    } finally {
      setIsProcessing(false);
    }
  };

  // Real AI function to get suggestions based on current form data
  const getSuggestion = async (fieldName: string, currentData: Record<string, any>): Promise<string | null> => {
    setIsProcessing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('openai-analysis', {
        body: {
          action: 'getSuggestion',
          data: { fieldName, currentData }
        }
      });
      
      if (error) throw error;
      return data.suggestion || null;
    } catch (error) {
      console.error("Error getting AI suggestion:", error);
      toast.error("Failed to get AI suggestion");
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  // Real AI function to enhance/improve notes
  const enhanceNotes = async (notes: string, prompt?: string): Promise<string> => {
    if (!notes || notes.trim() === '') return '';
    
    setIsProcessing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('openai-analysis', {
        body: {
          action: 'enhanceNotes',
          data: { notes, prompt }
        }
      });
      
      if (error) throw error;
      return data.enhancedNotes || notes;
    } catch (error) {
      console.error("Error enhancing notes:", error);
      toast.error("Failed to enhance notes");
      return notes;
    } finally {
      setIsProcessing(false);
    }
  };

  // Generate comprehensive reports based on survey data
  const generateReport = async (surveyData: Record<string, any>): Promise<string> => {
    setIsProcessing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('openai-analysis', {
        body: {
          action: 'generateReport',
          data: { surveyData }
        }
      });
      
      if (error) throw error;
      return data.report || "Could not generate report";
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate report");
      return "Could not generate report";
    } finally {
      setIsProcessing(false);
    }
  };

  // Detect anomalies in survey data
  const detectAnomalies = async (surveyData: Record<string, any>): Promise<string> => {
    setIsProcessing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('openai-analysis', {
        body: {
          action: 'detectAnomalies',
          data: { surveyData }
        }
      });
      
      if (error) throw error;
      return data.anomalies || "No anomalies detected";
    } catch (error) {
      console.error("Error detecting anomalies:", error);
      toast.error("Failed to detect anomalies");
      return "Could not analyze for anomalies";
    } finally {
      setIsProcessing(false);
    }
  };

  // Recommend maintenance based on survey data and images
  const recommendMaintenance = async (surveyData: Record<string, any>, imageData?: string): Promise<string> => {
    setIsProcessing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('openai-analysis', {
        body: {
          action: 'recommendMaintenance',
          data: { surveyData, imageData }
        }
      });
      
      if (error) throw error;
      return data.recommendations || "Could not generate maintenance recommendations";
    } catch (error) {
      console.error("Error recommending maintenance:", error);
      toast.error("Failed to generate maintenance recommendations");
      return "Could not generate maintenance recommendations";
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
        enhanceNotes,
        generateReport,
        detectAnomalies,
        recommendMaintenance
      }}
    >
      {children}
    </AIContext.Provider>
  );
};
