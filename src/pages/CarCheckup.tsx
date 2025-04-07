
import React, { useState, useEffect } from "react";
import NavigationBar from "@/components/NavigationBar";
import { Button } from "@/components/ui/button";
import NetworkingBanner from "@/components/NetworkingBanner";
import { Shield, Car } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getLatestVehicleCheck, saveVehicleCheck } from "@/utils/db";
import VehicleStatusIndicator from "@/components/VehicleStatusIndicator";
import AIVehicleInspection from "@/components/AIVehicleInspection";

const CarCheckup = () => {
  const [vehicleStatus, setVehicleStatus] = useState<"passed" | "fair" | "failed" | "unknown">("unknown");
  const [lastCheckDate, setLastCheckDate] = useState<string | null>(null);
  const [vehicleName, setVehicleName] = useState("Toyota Hilux");
  const [showAIInspection, setShowAIInspection] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const userEmail = localStorage.getItem("userEmail") || "john.doe@example.com";
  const engineerId = userEmail.toLowerCase().replace(/[^a-z0-9]/g, '-');

  useEffect(() => {
    const fetchLatestCheck = async () => {
      const latestCheck = await getLatestVehicleCheck(engineerId);
      if (latestCheck) {
        setVehicleStatus(latestCheck.status as "passed" | "fair" | "failed");
        setLastCheckDate(latestCheck.check_date);
        if (latestCheck.vehicle_name) {
          setVehicleName(latestCheck.vehicle_name);
        }
      }
    };
    
    fetchLatestCheck();
  }, [engineerId]);

  const handleAIInspectionComplete = async (status: "passed" | "fair" | "failed", score: number, details: any) => {
    setIsProcessing(true);
    try {
      // Save to database
      await saveVehicleCheck(
        engineerId,
        status,
        vehicleName,
        `AI Critical Components Check - Overall Score: ${score}/100`,
        details
      );
      
      // Update UI
      setVehicleStatus(status);
      setLastCheckDate(new Date().toISOString());
      setShowAIInspection(false);
      
      toast.success("AI Vehicle inspection completed and saved to database");
    } catch (error) {
      console.error("Error saving inspection:", error);
      toast.error("Failed to save inspection results");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      <NetworkingBanner
        title="Vehicle Checkup"
        subtitle="Comprehensive evaluation of vehicle condition"
      />
      <div className="container mx-auto px-4 py-8">
        {/* Prominent Vehicle Status Card at the top */}
        <Card className="mb-6 shadow-md border-t-4 border-t-akhanya">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="flex-grow">
                <h2 className="text-2xl font-bold text-akhanya mb-4">Vehicle Status</h2>
                <div className="scale-110 origin-left">
                  <VehicleStatusIndicator 
                    status={vehicleStatus} 
                    lastCheckDate={lastCheckDate}
                    vehicleName={vehicleName}
                  />
                </div>
              </div>
              <div className="flex-shrink-0">
                <Button 
                  onClick={() => setShowAIInspection(true)}
                  size="lg"
                  className="bg-akhanya hover:bg-akhanya/90 text-white"
                  disabled={isProcessing}
                >
                  <Shield className="h-5 w-5 mr-2" />
                  Perform AI Critical Components Check
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-akhanya mb-4">Vehicle Inspection</h2>
          <p className="text-gray-600 mb-6">
            Our AI Critical Components Check performs a comprehensive analysis of your vehicle's critical components including tires, windscreen, odometer, and more. Each component is rated for safety and compliance.
          </p>
          
          <Card className="bg-muted/40">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm">
                  <Car className="h-8 w-8 text-akhanya mb-2" />
                  <h3 className="font-semibold">Complete Inspection</h3>
                  <p className="text-sm text-gray-600 mt-2">Full AI analysis of 7 critical vehicle components</p>
                </div>
                
                <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm">
                  <Shield className="h-8 w-8 text-akhanya mb-2" />
                  <h3 className="font-semibold">Safety Scoring</h3>
                  <p className="text-sm text-gray-600 mt-2">Get detailed safety ratings for each component</p>
                </div>
                
                <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="h-8 w-8 flex items-center justify-center bg-akhanya text-white rounded-full mb-2">AI</div>
                  <h3 className="font-semibold">AI-Powered</h3>
                  <p className="text-sm text-gray-600 mt-2">Advanced AI technology detects issues human eyes might miss</p>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <Button 
                  onClick={() => setShowAIInspection(true)}
                  size="lg"
                  className="bg-akhanya hover:bg-akhanya/90 text-white"
                  disabled={isProcessing}
                >
                  Start AI Critical Components Check
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showAIInspection} onOpenChange={setShowAIInspection}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-akhanya" />
              AI Critical Components Inspection
            </DialogTitle>
          </DialogHeader>
          
          <AIVehicleInspection 
            engineerId={engineerId}
            vehicleName={vehicleName}
            onComplete={handleAIInspectionComplete}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CarCheckup;
