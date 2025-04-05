
import React, { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAI } from "@/contexts/AIContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import ImageCapture from "@/components/ImageCapture";
import NavigationBar from "@/components/NavigationBar";
import { CheckCircle2, XCircle } from "lucide-react";

type CarCheckupFormValues = {
  vehicleRegistration: string;
  odometerReading: string;
  fuelLevel: string;
  hasValidLicense: boolean;
  tiresCondition: string;
  lightsWorking: boolean;
  brakesFunctional: boolean;
  additionalNotes: string;
};

type ImageValidation = {
  imageData: string;
  validationResult: "pending" | "valid" | "invalid" | null;
  aiComment: string;
};

const CarCheckup = () => {
  const navigate = useNavigate();
  const { analyzeImage, isProcessing } = useAI();
  const [images, setImages] = useState<Record<string, ImageValidation>>({
    tires: { imageData: "", validationResult: null, aiComment: "" },
    licenseDisc: { imageData: "", validationResult: null, aiComment: "" },
    dashboard: { imageData: "", validationResult: null, aiComment: "" },
    carExterior: { imageData: "", validationResult: null, aiComment: "" }
  });

  const form = useForm<CarCheckupFormValues>({
    defaultValues: {
      vehicleRegistration: "",
      odometerReading: "",
      fuelLevel: "",
      hasValidLicense: false,
      tiresCondition: "",
      lightsWorking: false,
      brakesFunctional: false,
      additionalNotes: ""
    }
  });

  const handleImageCapture = async (type: string, imageData: string) => {
    if (!imageData) {
      setImages(prev => ({
        ...prev,
        [type]: { imageData: "", validationResult: null, aiComment: "" }
      }));
      return;
    }

    setImages(prev => ({
      ...prev,
      [type]: { ...prev[type], imageData, validationResult: "pending" }
    }));

    try {
      // Analyze the image with AI
      const analysis = await analyzeImage(imageData);
      
      // Determine if image is valid based on type-specific criteria
      let isValid = false;
      let comment = analysis;
      
      if (type === "tires") {
        isValid = !analysis.toLowerCase().includes("worn") && 
                 !analysis.toLowerCase().includes("damaged") &&
                 !analysis.toLowerCase().includes("flat");
      } else if (type === "licenseDisc") {
        isValid = analysis.toLowerCase().includes("valid") || 
                 !analysis.toLowerCase().includes("expired");
      } else if (type === "dashboard") {
        isValid = !analysis.toLowerCase().includes("warning") &&
                 !analysis.toLowerCase().includes("error");
      } else if (type === "carExterior") {
        isValid = !analysis.toLowerCase().includes("damaged") &&
                 !analysis.toLowerCase().includes("dent");
      }
      
      setImages(prev => ({
        ...prev,
        [type]: { 
          imageData, 
          validationResult: isValid ? "valid" : "invalid", 
          aiComment: comment 
        }
      }));
    } catch (error) {
      console.error("Error analyzing image:", error);
      setImages(prev => ({
        ...prev,
        [type]: { 
          imageData, 
          validationResult: null, 
          aiComment: "Failed to analyze image" 
        }
      }));
    }
  };

  const onSubmit = async (data: CarCheckupFormValues) => {
    // Check if any images are missing or invalid
    const missingImages = Object.entries(images).filter(([_, img]) => !img.imageData);
    const invalidImages = Object.entries(images).filter(([_, img]) => img.validationResult === "invalid");
    
    if (missingImages.length > 0) {
      toast.error(`Please capture all required images`, {
        description: missingImages.map(([type]) => type).join(", ")
      });
      return;
    }
    
    if (invalidImages.length > 0) {
      // Show warning but allow submission
      const proceed = confirm(`Some images show potential issues with: ${invalidImages.map(([type]) => type).join(", ")}. Do you want to proceed anyway?`);
      if (!proceed) return;
    }
    
    // In a real app, we would submit the data to a backend
    console.log("Car checkup data:", { ...data, images });
    
    toast.success("Car check completed successfully!", {
      description: "You can now proceed to site assessment."
    });
    
    // Navigate to the main app
    navigate("/");
  };

  return (
    <>
      <NavigationBar />
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader className="bg-akhanya-light">
            <CardTitle className="text-akhanya text-2xl">Vehicle Safety Check</CardTitle>
            <CardDescription>
              Complete this safety check before traveling to site
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="form-section">
                  <div className="section-title">Vehicle Information</div>
                  <div className="field-row">
                    <FormField
                      control={form.control}
                      name="vehicleRegistration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="required">Registration Number</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. ABC 123 GP" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="odometerReading"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="required">Odometer Reading (km)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="e.g. 45000" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="field-row">
                    <FormField
                      control={form.control}
                      name="fuelLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="required">Fuel Level</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 3/4 full" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="hasValidLicense"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-8">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Vehicle has valid license disk
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="form-section">
                  <div className="section-title">Vehicle Condition</div>
                  <div className="field-row">
                    <FormField
                      control={form.control}
                      name="tiresCondition"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="required">Tires Condition</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Good tread, no visible damage" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="field-row">
                    <FormField
                      control={form.control}
                      name="lightsWorking"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              All lights are working properly
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="brakesFunctional"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Brakes are functional
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="form-section">
                  <div className="section-title">Image Documentation</div>
                  <p className="text-sm text-gray-600 mb-4">
                    Take clear photos of the following items. AI will analyze each image for safety concerns.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <ImageCapture
                        label="Vehicle Tires"
                        description="Take a photo of the front tires"
                        onCapture={(imageData) => handleImageCapture("tires", imageData)}
                        capturedImage={images.tires.imageData}
                      />
                      {images.tires.validationResult && (
                        <div className={`mt-2 p-2 rounded-md ${
                          images.tires.validationResult === "valid" 
                            ? "bg-green-50 text-green-800" 
                            : images.tires.validationResult === "invalid" 
                              ? "bg-red-50 text-red-800" 
                              : "bg-yellow-50 text-yellow-800"
                        }`}>
                          {images.tires.validationResult === "valid" && (
                            <div className="flex items-center gap-1">
                              <CheckCircle2 className="h-4 w-4" />
                              <span>Tires appear in good condition</span>
                            </div>
                          )}
                          {images.tires.validationResult === "invalid" && (
                            <div className="flex items-center gap-1">
                              <XCircle className="h-4 w-4" />
                              <span>Possible issues with tires</span>
                            </div>
                          )}
                          {images.tires.validationResult === "pending" && (
                            <span>Analyzing image...</span>
                          )}
                          <p className="text-xs mt-1">{images.tires.aiComment}</p>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <ImageCapture
                        label="License Disc"
                        description="Take a clear photo of the license disc"
                        onCapture={(imageData) => handleImageCapture("licenseDisc", imageData)}
                        capturedImage={images.licenseDisc.imageData}
                      />
                      {images.licenseDisc.validationResult && (
                        <div className={`mt-2 p-2 rounded-md ${
                          images.licenseDisc.validationResult === "valid" 
                            ? "bg-green-50 text-green-800" 
                            : images.licenseDisc.validationResult === "invalid" 
                              ? "bg-red-50 text-red-800" 
                              : "bg-yellow-50 text-yellow-800"
                        }`}>
                          {images.licenseDisc.validationResult === "valid" && (
                            <div className="flex items-center gap-1">
                              <CheckCircle2 className="h-4 w-4" />
                              <span>License appears valid</span>
                            </div>
                          )}
                          {images.licenseDisc.validationResult === "invalid" && (
                            <div className="flex items-center gap-1">
                              <XCircle className="h-4 w-4" />
                              <span>Possible issues with license</span>
                            </div>
                          )}
                          {images.licenseDisc.validationResult === "pending" && (
                            <span>Analyzing image...</span>
                          )}
                          <p className="text-xs mt-1">{images.licenseDisc.aiComment}</p>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <ImageCapture
                        label="Dashboard/Instrument Panel"
                        description="Take a photo showing all gauges and warning lights"
                        onCapture={(imageData) => handleImageCapture("dashboard", imageData)}
                        capturedImage={images.dashboard.imageData}
                      />
                      {images.dashboard.validationResult && (
                        <div className={`mt-2 p-2 rounded-md ${
                          images.dashboard.validationResult === "valid" 
                            ? "bg-green-50 text-green-800" 
                            : images.dashboard.validationResult === "invalid" 
                              ? "bg-red-50 text-red-800" 
                              : "bg-yellow-50 text-yellow-800"
                        }`}>
                          {images.dashboard.validationResult === "valid" && (
                            <div className="flex items-center gap-1">
                              <CheckCircle2 className="h-4 w-4" />
                              <span>No warning lights detected</span>
                            </div>
                          )}
                          {images.dashboard.validationResult === "invalid" && (
                            <div className="flex items-center gap-1">
                              <XCircle className="h-4 w-4" />
                              <span>Warning lights may be active</span>
                            </div>
                          )}
                          {images.dashboard.validationResult === "pending" && (
                            <span>Analyzing image...</span>
                          )}
                          <p className="text-xs mt-1">{images.dashboard.aiComment}</p>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <ImageCapture
                        label="Car Exterior"
                        description="Take a photo of the car exterior (front view)"
                        onCapture={(imageData) => handleImageCapture("carExterior", imageData)}
                        capturedImage={images.carExterior.imageData}
                      />
                      {images.carExterior.validationResult && (
                        <div className={`mt-2 p-2 rounded-md ${
                          images.carExterior.validationResult === "valid" 
                            ? "bg-green-50 text-green-800" 
                            : images.carExterior.validationResult === "invalid" 
                              ? "bg-red-50 text-red-800" 
                              : "bg-yellow-50 text-yellow-800"
                        }`}>
                          {images.carExterior.validationResult === "valid" && (
                            <div className="flex items-center gap-1">
                              <CheckCircle2 className="h-4 w-4" />
                              <span>Exterior appears in good condition</span>
                            </div>
                          )}
                          {images.carExterior.validationResult === "invalid" && (
                            <div className="flex items-center gap-1">
                              <XCircle className="h-4 w-4" />
                              <span>Possible issues with exterior</span>
                            </div>
                          )}
                          {images.carExterior.validationResult === "pending" && (
                            <span>Analyzing image...</span>
                          )}
                          <p className="text-xs mt-1">{images.carExterior.aiComment}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <div className="section-title">Additional Notes</div>
                  <FormField
                    control={form.control}
                    name="additionalNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Any other issues or concerns</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter any additional information about the vehicle condition"
                            className="min-h-32"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/")}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-akhanya-purple hover:bg-akhanya-dark"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : "Submit Vehicle Check"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default CarCheckup;
