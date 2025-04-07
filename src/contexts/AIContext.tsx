import React, { createContext, useContext, useState, ReactNode } from "react";

export interface AIContextType {
  isProcessing: boolean;
  analyzeImage: (imageData: string, context?: string) => Promise<string>;
  getSuggestion: (fieldName: string, currentValue: string) => Promise<string>;
  enhanceNotes: (notes: string, context?: string) => Promise<string>;
  detectAnomalies: (data: any) => Promise<string>;
  recommendMaintenance: (data: any, imageData?: string) => Promise<string>;
  optimizeRoute: (startLocation: any, destinations: any[]) => Promise<any[]>;
  predictETAs: (routes: any[]) => Promise<any[]>;
  inspectVehicleComponent: (imageData: string, componentType: VehicleComponentType) => Promise<VehicleComponentAnalysis>;
}

export type VehicleComponentType = 
  | "tires" 
  | "windscreen" 
  | "rear_windscreen"
  | "odometer"
  | "side_mirrors"
  | "license_disc"
  | "drivers_license";

export interface VehicleComponentAnalysis {
  score: number; // 0-100
  condition: "excellent" | "good" | "fair" | "poor" | "critical";
  details: string;
  recommendations?: string;
  expiryDate?: string; // For license related components
}

const defaultContext: AIContextType = {
  isProcessing: false,
  analyzeImage: async (imageData: string, context: string = "general") => "Image analysis not available",
  getSuggestion: async (fieldName: string, currentValue: string) => "Suggestions not available",
  enhanceNotes: async (notes: string, context: string = "general") => notes,
  detectAnomalies: async (data: any) => "No anomalies detected",
  recommendMaintenance: async (data: any, imageData?: string) => "No maintenance recommendations available",
  optimizeRoute: async (startLocation: any, destinations: any[]) => destinations,
  predictETAs: async (routes: any[]) => routes.map(() => ({ minutes: 30 })),
  inspectVehicleComponent: async (imageData: string, componentType: VehicleComponentType): Promise<VehicleComponentAnalysis> => ({
    score: 0,
    condition: "fair",
    details: "No analysis available",
  }),
};

const AIContext = createContext<AIContextType>(defaultContext);

export const useAI = () => useContext(AIContext);

interface AIProviderProps {
  children: ReactNode;
}

export const AIProvider = ({ children }: AIProviderProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const analyzeImage = async (imageData: string, context: string = "general"): Promise<string> => {
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      let analysis = "";
      if (context === "site") {
        analysis = "This appears to be a commercial building with adequate infrastructure for installation.";
      } else if (context === "equipment") {
        analysis = "The equipment looks properly installed and in good condition.";
      } else if (context === "engine") {
        analysis = "The engine appears to be in good condition with no visible leaks or damage.";
      } else if (context === "tire") {
        analysis = "The tire tread depth is adequate. No visible damage or excessive wear detected.";
      } else if (context === "brake") {
        analysis = "Brake components appear to be in good condition. No excessive wear on pads.";
      } else {
        analysis = "The image has been analyzed. No specific issues detected.";
      }
      
      return analysis;
    } catch (error) {
      console.error("Error analyzing image:", error);
      return "Error analyzing image";
    } finally {
      setIsProcessing(false);
    }
  };

  const getSuggestion = async (fieldName: string, currentValue: string): Promise<string> => {
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
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
      return "Error getting suggestion";
    } finally {
      setIsProcessing(false);
    }
  };

  const enhanceNotes = async (notes: string, context: string = "general"): Promise<string> => {
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const enhancedNotes = notes + "\n\n[AI Enhanced] Additional considerations: Ensure proper documentation of all installation steps. Verify compliance with safety regulations.";
      
      return enhancedNotes;
    } catch (error) {
      console.error("Error enhancing notes:", error);
      return notes;
    } finally {
      setIsProcessing(false);
    }
  };

  const detectAnomalies = async (data: any): Promise<string> => {
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      return `Potential issues detected:

1. Engine: Warning - Oil level appears to be slightly low.
2. Tires: Caution - Rear right tire shows signs of uneven wear.
3. Brakes: Advisory - Brake fluid may need to be checked.

Overall vehicle status: Maintenance recommended.`;
    } catch (error) {
      console.error("Error detecting anomalies:", error);
      return "Error analyzing vehicle data";
    } finally {
      setIsProcessing(false);
    }
  };

  const recommendMaintenance = async (data: any, imageData?: string): Promise<string> => {
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      return `<h3>Recommended Maintenance</h3>

<h4>High Priority (Within 15 days)</h4>
<ul>
  <li>Change engine oil and filter</li>
  <li>Check and top up brake fluid</li>
  <li>Rotate tires to ensure even wear</li>
</ul>

<h4>Medium Priority (Within 30 days)</h4>
<ul>
  <li>Inspect air filter and replace if necessary</li>
  <li>Check battery terminals for corrosion</li>
  <li>Verify alignment to address uneven tire wear</li>
</ul>

<h4>Regular Maintenance</h4>
<ul>
  <li>Schedule full vehicle inspection in 3 months</li>
  <li>Consider brake pad replacement at next service</li>
</ul>`;
    } catch (error) {
      console.error("Error recommending maintenance:", error);
      return "Error generating maintenance recommendations";
    } finally {
      setIsProcessing(false);
    }
  };

  const optimizeRoute = async (startLocation: any, destinations: any[]): Promise<any[]> => {
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1800));
      
      return [...destinations];
    } catch (error) {
      console.error("Error optimizing route:", error);
      return destinations;
    } finally {
      setIsProcessing(false);
    }
  };

  const predictETAs = async (routes: any[]): Promise<any[]> => {
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      return routes.map(route => {
        const baseMinutes = Math.floor(route.distance * 1.5);
        const trafficFactor = route.traffic === 'heavy' ? 1.8 : 
                             route.traffic === 'moderate' ? 1.3 : 1.0;
        
        return {
          minutes: Math.round(baseMinutes * trafficFactor),
          traffic: route.traffic
        };
      });
    } catch (error) {
      console.error("Error predicting ETAs:", error);
      return routes.map(() => ({ minutes: 30 }));
    } finally {
      setIsProcessing(false);
    }
  };

  const inspectVehicleComponent = async (
    imageData: string,
    componentType: VehicleComponentType
  ): Promise<VehicleComponentAnalysis> => {
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1800));
      
      let response: VehicleComponentAnalysis;
      
      switch (componentType) {
        case "tires":
          response = {
            score: 85,
            condition: "good",
            details: "Tread depth is adequate at approximately 5mm. Minor wear on outer edges. No visible cuts or bulges detected.",
            recommendations: "Consider rotation at next service interval. Monitor outer edge wear pattern."
          };
          break;
        case "windscreen":
          response = {
            score: 95,
            condition: "excellent",
            details: "No cracks or chips detected. Visibility is clear. Wiper condition good with no streaking.",
            recommendations: "No action required."
          };
          break;
        case "rear_windscreen":
          response = {
            score: 90,
            condition: "good",
            details: "No cracks detected. Minor scratches present. Heating elements appear functional.",
            recommendations: "No immediate action required."
          };
          break;
        case "odometer":
          response = {
            score: 100,
            condition: "excellent",
            details: "Digital display is clear and functional. Reading appears accurate at 45,678 km.",
            recommendations: "No action required."
          };
          break;
        case "side_mirrors":
          response = {
            score: 75,
            condition: "fair",
            details: "Driver side mirror shows minor scratches. Passenger mirror has slight adjustment issues. Both are functional.",
            recommendations: "Check passenger side mirror adjustment mechanism at next service."
          };
          break;
        case "license_disc":
          response = {
            score: 65,
            condition: "fair",
            details: "License disc is present and valid. Expiry approaching in 45 days.",
            recommendations: "Plan for renewal within next 30 days.",
            expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          };
          break;
        case "drivers_license":
          response = {
            score: 80,
            condition: "good",
            details: "Driver's license is valid with all required endorsements.",
            recommendations: "No action required.",
            expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          };
          break;
        default:
          response = {
            score: 50,
            condition: "fair",
            details: "Component analyzed but specific details unavailable.",
            recommendations: "Consider manual inspection."
          };
      }
      
      return response;
    } catch (error) {
      console.error("Error analyzing vehicle component:", error);
      return {
        score: 0,
        condition: "critical",
        details: "Error analyzing component. Please retry or perform manual inspection.",
      };
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AIContext.Provider value={{ 
      isProcessing, 
      analyzeImage, 
      getSuggestion, 
      enhanceNotes,
      detectAnomalies,
      recommendMaintenance,
      optimizeRoute,
      predictETAs,
      inspectVehicleComponent
    }}>
      {children}
    </AIContext.Provider>
  );
};
