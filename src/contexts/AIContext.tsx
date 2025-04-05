
import React, { createContext, useContext, useState } from 'react';

interface AIContextType {
  isProcessing: boolean;
  analyzeImage: (imageData: string, type: string, prompt?: string) => Promise<string | null>;
  getSuggestion: (fieldName: string, formData: any, prompt?: string) => Promise<string | null>;
  enhanceNotes: (notes: string, prompt?: string) => Promise<string>;
  detectAnomalies: (data: any) => Promise<string>;
  recommendMaintenance: (data: any, image?: string) => Promise<string>;
  optimizeRoute: (origin: {lat: number, lng: number}, destinations: any[]) => Promise<any[]>;
  predictETAs: (routeMetrics: any[]) => Promise<number[]>;
}

const AIContext = createContext<AIContextType>({
  isProcessing: false,
  analyzeImage: async () => null,
  getSuggestion: async () => null,
  enhanceNotes: async () => "",
  detectAnomalies: async () => "",
  recommendMaintenance: async () => "",
  optimizeRoute: async () => [],
  predictETAs: async () => []
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
      } else if (type === "engine") {
        response = "Engine appears to be in good condition. No visible leaks or damage.";
      } else if (type === "tire") {
        response = "Tire tread depth is adequate. No visible sidewall damage.";
      } else if (type === "brake") {
        response = "Brake pads appear to have sufficient material. No visible damage to rotors.";
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

  // Add new functions for CarCheckup page
  const detectAnomalies = async (data: any): Promise<string> => {
    setIsProcessing(true);
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 1800));
      
      return `<h3>Anomaly Detection Report</h3>
<p>Analysis completed on ${new Date().toLocaleDateString()}</p>

<h4>Engine Anomalies</h4>
<ul>
  <li>Coolant level appears to be slightly below recommended level</li>
  <li>Minor oil residue detected near valve cover gasket</li>
</ul>

<h4>Tire Anomalies</h4>
<ul>
  <li>Right front tire shows signs of uneven wear on outer edge - possible alignment issue</li>
  <li>Rear tires have approximately 60% tread life remaining</li>
</ul>

<h4>Brake System</h4>
<ul>
  <li>No significant anomalies detected in brake system</li>
  <li>Brake fluid appears to be at appropriate level</li>
</ul>

<p><strong>Recommendation:</strong> Schedule maintenance for engine gasket inspection and wheel alignment within next 30 days.</p>`;
    } catch (error) {
      console.error("Error detecting anomalies:", error);
      return "Error occurred during anomaly detection. Please try again.";
    } finally {
      setIsProcessing(false);
    }
  };

  const recommendMaintenance = async (data: any, image: string = ""): Promise<string> => {
    setIsProcessing(true);
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return `<h3>Recommended Maintenance Schedule</h3>
<p>Based on vehicle inspection conducted on ${new Date().toLocaleDateString()}</p>

<h4>Immediate Attention (0-30 days)</h4>
<ul>
  <li>Replace valve cover gasket to address minor oil seepage</li>
  <li>Perform four-wheel alignment to correct uneven tire wear</li>
  <li>Top off coolant to recommended level</li>
</ul>

<h4>Near-Term Maintenance (30-90 days)</h4>
<ul>
  <li>Schedule oil and filter change</li>
  <li>Inspect air filter and replace if necessary</li>
  <li>Check and clean battery terminals</li>
</ul>

<h4>Future Maintenance (90-180 days)</h4>
<ul>
  <li>Inspect brake pads and rotors</li>
  <li>Check transmission fluid level and condition</li>
  <li>Rotate tires and check pressure</li>
</ul>

<p><strong>Note:</strong> This maintenance schedule is generated based on current vehicle condition and may need adjustment as vehicle usage patterns change.</p>`;
    } catch (error) {
      console.error("Error recommending maintenance:", error);
      return "Error occurred during maintenance recommendation generation. Please try again.";
    } finally {
      setIsProcessing(false);
    }
  };

  // Add new functions for AdminMap page
  const optimizeRoute = async (origin: {lat: number, lng: number}, destinations: any[]): Promise<any[]> => {
    setIsProcessing(true);
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simple algorithm to sort destinations by distance from origin
      // In a real app, this would use a proper routing algorithm
      const sortedDestinations = [...destinations].sort((a, b) => {
        const distA = Math.sqrt(Math.pow(a.lat - origin.lat, 2) + Math.pow(a.lng - origin.lng, 2));
        const distB = Math.sqrt(Math.pow(b.lat - origin.lat, 2) + Math.pow(b.lng - origin.lng, 2));
        return distA - distB;
      });
      
      return sortedDestinations;
    } catch (error) {
      console.error("Error optimizing route:", error);
      return destinations;
    } finally {
      setIsProcessing(false);
    }
  };

  const predictETAs = async (routeMetrics: any[]): Promise<number[]> => {
    setIsProcessing(true);
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Calculate estimated travel times based on distance and traffic
      return routeMetrics.map(metric => {
        const baseTime = metric.distance * 1.2; // minutes per km
        const trafficMultiplier = 
          metric.traffic === "light" ? 1 : 
          metric.traffic === "moderate" ? 1.3 : 
          1.6; // heavy traffic
        
        return Math.round(baseTime * trafficMultiplier);
      });
    } catch (error) {
      console.error("Error predicting ETAs:", error);
      return routeMetrics.map(() => 0);
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
      predictETAs
    }}>
      {children}
    </AIContext.Provider>
  );
};
