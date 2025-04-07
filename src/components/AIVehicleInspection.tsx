
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Camera, Shield, AlertTriangle, CheckCircle, RotateCw, Calendar } from "lucide-react";
import ImageCapture from "@/components/ImageCapture";
import { useAI, VehicleComponentType, VehicleComponentAnalysis } from "@/contexts/AIContext";
import { saveVehicleCheck } from "@/utils/dbHelpers";

interface AIVehicleInspectionProps {
  engineerId: string;
  vehicleName: string;
  onComplete?: (status: "passed" | "fair" | "failed") => void;
}

const componentLabels: Record<VehicleComponentType, string> = {
  tires: "Tires",
  windscreen: "Windscreen",
  rear_windscreen: "Rear Windscreen",
  odometer: "Odometer",
  side_mirrors: "Side Mirrors",
  license_disc: "License Disc",
  drivers_license: "Driver's License"
};

const ComponentIcon: React.FC<{ condition: VehicleComponentAnalysis["condition"] }> = ({ condition }) => {
  switch (condition) {
    case "excellent":
    case "good":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "fair":
      return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    case "poor":
    case "critical":
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
    default:
      return <Shield className="h-5 w-5 text-gray-400" />;
  }
};

const conditionColors: Record<VehicleComponentAnalysis["condition"], string> = {
  excellent: "bg-green-100 text-green-800 border-green-200",
  good: "bg-green-50 text-green-700 border-green-100",
  fair: "bg-amber-50 text-amber-700 border-amber-100",
  poor: "bg-orange-50 text-orange-700 border-orange-100",
  critical: "bg-red-50 text-red-700 border-red-100"
};

const AIVehicleInspection: React.FC<AIVehicleInspectionProps> = ({
  engineerId,
  vehicleName,
  onComplete
}) => {
  const { isProcessing, inspectVehicleComponent } = useAI();
  const [activeComponent, setActiveComponent] = useState<VehicleComponentType>("tires");
  const [capturedImages, setCapturedImages] = useState<Record<VehicleComponentType, string>>({} as Record<VehicleComponentType, string>);
  const [analyses, setAnalyses] = useState<Record<VehicleComponentType, VehicleComponentAnalysis | null>>({} as Record<VehicleComponentType, VehicleComponentAnalysis | null>);
  
  const componentTypes: VehicleComponentType[] = [
    "tires", "windscreen", "rear_windscreen", "odometer", "side_mirrors", "license_disc", "drivers_license"
  ];

  const handleImageCapture = (imageData: string) => {
    setCapturedImages(prev => ({
      ...prev,
      [activeComponent]: imageData
    }));
    
    analyzeComponent(imageData, activeComponent);
  };

  const analyzeComponent = async (imageData: string, componentType: VehicleComponentType) => {
    toast.info(`Analyzing ${componentLabels[componentType]}...`);
    
    try {
      const analysis = await inspectVehicleComponent(imageData, componentType);
      
      setAnalyses(prev => ({
        ...prev,
        [componentType]: analysis
      }));
      
      toast.success(`${componentLabels[componentType]} analysis complete`);
    } catch (error) {
      console.error("Error analyzing component:", error);
      toast.error(`Failed to analyze ${componentLabels[componentType]}`);
    }
  };

  const getOverallScore = (): number => {
    const completedAnalyses = Object.values(analyses).filter(Boolean);
    if (completedAnalyses.length === 0) return 0;
    
    const totalScore = completedAnalyses.reduce((sum, analysis) => sum + (analysis?.score || 0), 0);
    return Math.round(totalScore / completedAnalyses.length);
  };

  const getOverallStatus = (): "passed" | "fair" | "failed" => {
    const score = getOverallScore();
    if (score >= 80) return "passed";
    if (score >= 60) return "fair";
    return "failed";
  };

  const getCompletionPercentage = (): number => {
    const completedCount = Object.values(analyses).filter(Boolean).length;
    return Math.round((completedCount / componentTypes.length) * 100);
  };

  const handleSaveInspection = async () => {
    const completionPercentage = getCompletionPercentage();
    if (completionPercentage < 100) {
      toast.warning(`Only ${completionPercentage}% of inspection complete. Please complete all checks.`);
      return;
    }
    
    const status = getOverallStatus();
    const overallScore = getOverallScore();
    
    try {
      await saveVehicleCheck(
        engineerId,
        status,
        vehicleName,
        `AI Vehicle Inspection - Overall Score: ${overallScore}/100`,
        { analyses }
      );
      
      toast.success("Vehicle inspection saved successfully");
      if (onComplete) onComplete(status);
    } catch (error) {
      console.error("Error saving inspection:", error);
      toast.error("Failed to save inspection");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg">
          <Shield className="h-5 w-5 mr-2 text-akhanya" />
          AI Vehicle Inspection
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">Inspection Progress</h3>
          <div className="flex items-center gap-3">
            <Progress value={getCompletionPercentage()} className="flex-1" />
            <span className="text-sm font-medium">{getCompletionPercentage()}%</span>
          </div>
          
          {getCompletionPercentage() > 0 && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm font-medium">Overall Score:</span>
              <div className="flex items-center">
                <ComponentIcon condition={getOverallStatus() as VehicleComponentAnalysis["condition"]} />
                <span className="ml-1 text-sm font-medium">{getOverallScore()}/100</span>
              </div>
            </div>
          )}
        </div>
        
        <Tabs value={activeComponent} onValueChange={(v) => setActiveComponent(v as VehicleComponentType)}>
          <TabsList className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 mb-4">
            {componentTypes.map(type => (
              <TabsTrigger 
                key={type} 
                value={type}
                className="relative"
              >
                {componentLabels[type]}
                {analyses[type] && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className={`absolute inline-flex h-full w-full rounded-full ${
                      analyses[type]?.condition === "excellent" || analyses[type]?.condition === "good" 
                        ? "bg-green-400" 
                        : analyses[type]?.condition === "fair" 
                          ? "bg-amber-400" 
                          : "bg-red-400"
                    } opacity-75 animate-ping`}></span>
                    <span className={`relative inline-flex rounded-full h-3 w-3 ${
                      analyses[type]?.condition === "excellent" || analyses[type]?.condition === "good" 
                        ? "bg-green-500" 
                        : analyses[type]?.condition === "fair" 
                          ? "bg-amber-500" 
                          : "bg-red-500"
                    }`}></span>
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {componentTypes.map(type => (
            <TabsContent key={type} value={type} className="mt-0">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Capture {componentLabels[type]} Image</h3>
                    <ImageCapture
                      label={`${componentLabels[type]} Inspection`}
                      description={`Take a clear photo of the ${componentLabels[type].toLowerCase()}`}
                      onImageCaptured={handleImageCapture}
                      onCapture={handleImageCapture}
                      capturedImage={capturedImages[type] || ""}
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">AI Analysis</h3>
                    
                    {isProcessing && type === activeComponent ? (
                      <div className="flex items-center justify-center p-8 border rounded-md bg-gray-50">
                        <RotateCw className="h-6 w-6 animate-spin text-akhanya mr-2" />
                        <span>Analyzing {componentLabels[type]}...</span>
                      </div>
                    ) : analyses[type] ? (
                      <div className="p-4 border rounded-md">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <ComponentIcon condition={analyses[type]?.condition || "fair"} />
                            <span className="font-medium ml-2">Score: {analyses[type]?.score}/100</span>
                          </div>
                          <Badge className={conditionColors[analyses[type]?.condition || "fair"]}>
                            {analyses[type]?.condition.charAt(0).toUpperCase() + analyses[type]?.condition.slice(1)}
                          </Badge>
                        </div>
                        
                        <p className="text-sm mb-3">{analyses[type]?.details}</p>
                        
                        {analyses[type]?.recommendations && (
                          <div className="mt-2 text-sm">
                            <strong>Recommendation:</strong> {analyses[type]?.recommendations}
                          </div>
                        )}
                        
                        {analyses[type]?.expiryDate && (
                          <div className="mt-2 flex items-center text-sm">
                            <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                            <span>
                              <strong>Expires:</strong> {analyses[type]?.expiryDate}
                            </span>
                          </div>
                        )}
                      </div>
                    ) : capturedImages[type] ? (
                      <div className="flex items-center justify-center p-8 border rounded-md bg-gray-50">
                        <RotateCw className="h-6 w-6 animate-spin text-akhanya mr-2" />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-8 border rounded-md bg-gray-50 text-gray-500">
                        <Camera className="h-10 w-10 mb-2" />
                        <p>Capture an image to perform AI analysis</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
        
        <div className="mt-6 flex justify-end">
          <Button 
            onClick={handleSaveInspection}
            disabled={getCompletionPercentage() < 100 || isProcessing}
          >
            Complete Inspection
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIVehicleInspection;
