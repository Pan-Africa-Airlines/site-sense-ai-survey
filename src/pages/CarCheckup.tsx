
import React, { useState } from "react";
import NavigationBar from "@/components/NavigationBar";
import { Button } from "@/components/ui/button";
import NetworkingBanner from "@/components/NetworkingBanner";
import { useAI } from "@/contexts/AIContext";
import { Sparkles, FileText, AlertTriangle, Check, Car } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import ImageCapture from "@/components/ImageCapture";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import VehicleCheckWizard from "@/components/VehicleCheckWizard";

const CarCheckup = () => {
  const [activeTab, setActiveTab] = useState("engine");
  const { isProcessing, analyzeImage, detectAnomalies, recommendMaintenance } = useAI();
  const [engineImage, setEngineImage] = useState("");
  const [tireImage, setTireImage] = useState("");
  const [brakeImage, setBrakeImage] = useState("");
  const [engineNotes, setEngineNotes] = useState("");
  const [tireNotes, setTireNotes] = useState("");
  const [brakeNotes, setBrakeNotes] = useState("");
  const [engineAnalysis, setEngineAnalysis] = useState("");
  const [tireAnalysis, setTireAnalysis] = useState("");
  const [brakeAnalysis, setBrakeAnalysis] = useState("");
  const [anomaliesReport, setAnomaliesReport] = useState("");
  const [maintenanceRecommendations, setMaintenanceRecommendations] = useState("");
  const [vehicleCheckOpen, setVehicleCheckOpen] = useState(false);
  const [vehicleCheckCompleted, setVehicleCheckCompleted] = useState(false);

  const handleEngineImageCapture = (imageData: string) => {
    setEngineImage(imageData);
    if (imageData) {
      analyzeImage(imageData, 'engine').then(analysis => {
        setEngineAnalysis(analysis);
        toast.success("Engine image analyzed");
      });
    }
  };

  const handleTireImageCapture = (imageData: string) => {
    setTireImage(imageData);
    if (imageData) {
      analyzeImage(imageData, 'tire').then(analysis => {
        setTireAnalysis(analysis);
        toast.success("Tire image analyzed");
      });
    }
  };

  const handleBrakeImageCapture = (imageData: string) => {
    setBrakeImage(imageData);
    if (imageData) {
      analyzeImage(imageData, 'brake').then(analysis => {
        setBrakeAnalysis(analysis);
        toast.success("Brake image analyzed");
      });
    }
  };

  const checkForAnomalies = async () => {
    const data = {
      engine: { image: engineImage, notes: engineNotes, analysis: engineAnalysis },
      tires: { image: tireImage, notes: tireNotes, analysis: tireAnalysis },
      brakes: { image: brakeImage, notes: brakeNotes, analysis: brakeAnalysis },
    };
    
    const anomalies = await detectAnomalies(data);
    setAnomaliesReport(anomalies);
    toast.success("Vehicle anomalies detected");
  };

  const getMaintenanceRecommendations = async () => {
    const data = {
      engine: { image: engineImage, notes: engineNotes, analysis: engineAnalysis },
      tires: { image: tireImage, notes: tireNotes, analysis: tireAnalysis },
      brakes: { image: brakeImage, notes: brakeNotes, analysis: brakeAnalysis },
    };
    
    const recommendations = await recommendMaintenance(data, engineImage);
    setMaintenanceRecommendations(recommendations);
    toast.success("Maintenance recommendations generated");
  };

  const handleVehicleCheckComplete = () => {
    setVehicleCheckCompleted(true);
    setVehicleCheckOpen(false);
    toast.success("Vehicle safety check completed successfully");
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      <NetworkingBanner
        title="Vehicle Checkup"
        subtitle="Comprehensive evaluation of vehicle condition"
      />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-akhanya">Vehicle Inspection</h2>
            <p className="text-gray-600">
              Capture images of key vehicle components for AI-assisted analysis
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 bg-blue-50 border-blue-100 text-blue-700 hover:bg-blue-100"
              onClick={() => setVehicleCheckOpen(true)}
            >
              <Car className="h-4 w-4" />
              {vehicleCheckCompleted ? "Review Safety Check" : "Complete Safety Check"}
            </Button>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2" onClick={checkForAnomalies}>
                  <AlertTriangle className="h-4 w-4" />
                  Detect Anomalies
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle>Vehicle Anomaly Analysis</DialogTitle>
                </DialogHeader>
                <div className="p-4 bg-muted/50 rounded-md mt-4 max-h-[60vh] overflow-y-auto">
                  {anomaliesReport ? (
                    <div dangerouslySetInnerHTML={{ __html: anomaliesReport.replace(/\n/g, '<br>') }} />
                  ) : (
                    <p>Click "Detect Anomalies" to analyze your vehicle data for potential issues.</p>
                  )}
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2" onClick={getMaintenanceRecommendations}>
                  <FileText className="h-4 w-4" />
                  Maintenance Report
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle>Recommended Maintenance</DialogTitle>
                </DialogHeader>
                <div className="p-4 bg-muted/50 rounded-md mt-4 max-h-[60vh] overflow-y-auto">
                  {maintenanceRecommendations ? (
                    <div dangerouslySetInnerHTML={{ __html: maintenanceRecommendations.replace(/\n/g, '<br>') }} />
                  ) : (
                    <p>Click "Maintenance Report" to generate recommendations based on your vehicle inspection.</p>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {vehicleCheckCompleted && (
          <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-lg flex items-start">
            <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
            <div>
              <h3 className="font-medium text-green-800">Safety Check Completed</h3>
              <p className="text-green-700 text-sm">
                Your vehicle has passed all the required safety checks and is ready for operation.
              </p>
            </div>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="engine">Engine</TabsTrigger>
            <TabsTrigger value="tires">Tires</TabsTrigger>
            <TabsTrigger value="brakes">Brakes</TabsTrigger>
          </TabsList>

          <TabsContent value="engine" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Engine Inspection</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <ImageCapture
                      label="Engine Compartment"
                      description="Capture a clear image of the engine compartment"
                      onImageCaptured={handleEngineImageCapture}
                      onCapture={handleEngineImageCapture}
                      capturedImage={engineImage}
                    />
                    {engineAnalysis && (
                      <div className="mt-4 p-3 bg-muted rounded-md">
                        <p className="text-sm font-medium">AI Analysis:</p>
                        <p className="text-sm"><Check size={12} className="inline mr-1 text-green-500" /> {engineAnalysis}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="engineNotes">Notes</Label>
                    <Textarea
                      id="engineNotes"
                      value={engineNotes}
                      onChange={(e) => setEngineNotes(e.target.value)}
                      placeholder="Enter any observations about the engine condition"
                      rows={5}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tires" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Tire Inspection</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <ImageCapture
                      label="Tire Condition"
                      description="Capture a clear image of the tire tread"
                      onImageCaptured={handleTireImageCapture}
                      onCapture={handleTireImageCapture}
                      capturedImage={tireImage}
                    />
                    {tireAnalysis && (
                      <div className="mt-4 p-3 bg-muted rounded-md">
                        <p className="text-sm font-medium">AI Analysis:</p>
                        <p className="text-sm"><Check size={12} className="inline mr-1 text-green-500" /> {tireAnalysis}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="tireNotes">Notes</Label>
                    <Textarea
                      id="tireNotes"
                      value={tireNotes}
                      onChange={(e) => setTireNotes(e.target.value)}
                      placeholder="Enter any observations about the tire condition"
                      rows={5}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="brakes" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Brake Inspection</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <ImageCapture
                      label="Brake Components"
                      description="Capture a clear image of the brake components"
                      onImageCaptured={handleBrakeImageCapture}
                      onCapture={handleBrakeImageCapture}
                      capturedImage={brakeImage}
                    />
                    {brakeAnalysis && (
                      <div className="mt-4 p-3 bg-muted rounded-md">
                        <p className="text-sm font-medium">AI Analysis:</p>
                        <p className="text-sm"><Check size={12} className="inline mr-1 text-green-500" /> {brakeAnalysis}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="brakeNotes">Notes</Label>
                    <Textarea
                      id="brakeNotes"
                      value={brakeNotes}
                      onChange={(e) => setBrakeNotes(e.target.value)}
                      placeholder="Enter any observations about the brake condition"
                      rows={5}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-6">
          <Button 
            onClick={() => toast.success("Vehicle inspection report saved")}
            className="px-6"
          >
            Save Report
          </Button>
        </div>
      </div>
      
      <VehicleCheckWizard
        open={vehicleCheckOpen}
        onClose={() => setVehicleCheckOpen(false)}
        onConfirm={handleVehicleCheckComplete}
        vehicle="Toyota Land Cruiser (ABC-123)"
        isProcessing={false}
      />
    </div>
  );
};

export default CarCheckup;
