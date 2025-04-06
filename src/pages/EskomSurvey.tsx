
import React, { useState } from "react";
import NavigationBar from "@/components/NavigationBar";
import NetworkingBanner from "@/components/NetworkingBanner";
import { Button } from "@/components/ui/button";
import { useAI } from "@/contexts/AIContext";
import { Sparkles, FileText, Save } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import Footer from "@/components/Footer";
import EskomSurveyTabs from "@/components/EskomSurveyTabs";

const EskomSurvey = () => {
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);
  const { isProcessing } = useAI();
  
  const [formData, setFormData] = useState({
    // Site Information
    siteName: "",
    siteId: "",
    siteType: "",
    region: "",
    date: "",
    address: "",
    gpsCoordinates: "",
    buildingPhoto: "",
    googleMapView: "",
    
    // Building Information
    buildingName: "",
    buildingType: "",
    floorLevel: "",
    equipmentRoomName: "",
    
    // Access Procedure
    accessRequirements: "",
    securityRequirements: "",
    vehicleType: "",
    
    // Site Contacts
    siteContacts: [
      { name: "", cellphone: "", email: "" },
      { name: "", cellphone: "", email: "" },
      { name: "", cellphone: "", email: "" }
    ],
    
    // Equipment Room General
    cableAccess: "",
    roomLighting: "",
    fireProtection: "",
    coolingMethod: "",
    coolingRating: "",
    roomTemperature: "",
    equipmentRoomCondition: "",
    
    // Cabinet Space Planning
    roomLayoutDrawing: "",
    numberOfRouters: "",
    roomLayoutMarkup: "",
    additionalDrawings: [""],
    
    // Transport Platforms
    transportLinks: [
      { linkNumber: "1", linkType: "", direction: "", capacity: "" },
      { linkNumber: "2", linkType: "", direction: "", capacity: "" },
      { linkNumber: "3", linkType: "", direction: "", capacity: "" },
      { linkNumber: "4", linkType: "", direction: "", capacity: "" }
    ],
    
    // DC Power
    chargerA: "",
    chargerB: "",
    powerSupplyMethod: "",
    cableLength: "",
    endOfAisleLayout: "",
    
    // Photos
    equipmentRoomPhotos: [""],
    cabinetLocationPhotos: [""],
    powerDistributionPhotos: [""],
    transportEquipmentPhotos: [""],
    opticalFramePhotos: [""],
    accessEquipmentPhotos: [""],
    cableRoutingPhotos: [""],
    ceilingHVACPhotos: [""],
    
    // Requirements
    accessSecurity: "",
    coolingVentilation: "",
    flooringType: "",
    fireProt: "",
    lighting: "",
    roofType: "",
    powerCables: "",
    
    // General Remarks
    remarks: "",
    
    // ODF Layout
    odfCabinets: [
      {
        name: "Cabinet 1",
        direction: "",
        connectionType: "",
        cores: "",
        usedPorts: {}
      },
      {
        name: "Cabinet 2",
        direction: "",
        connectionType: "",
        cores: "",
        usedPorts: {}
      },
      {
        name: "Cabinet 3",
        direction: "",
        connectionType: "",
        cores: "",
        usedPorts: {}
      },
      {
        name: "Cabinet 4",
        direction: "",
        connectionType: "",
        cores: "",
        usedPorts: {}
      }
    ],
    
    // Cabinet Layout
    cabinetLayoutDrawing: "",
    
    // 50V Charger Layout
    chargerDetails: {
      siteName: "",
      chargerLabel: "",
      chargerType: "Single",
      chargerA: Array.from({ length: 26 }, (_, i) => ({
        circuit: String.fromCharCode(65 + i),
        mcbRating: "",
        used: false,
        label: ""
      })),
      chargerB: Array.from({ length: 26 }, (_, i) => ({
        circuit: String.fromCharCode(65 + i),
        mcbRating: "",
        used: false,
        label: ""
      }))
    },
    
    // Attendee Information
    attendees: [
      { date: "", name: "", company: "", department: "", cellphone: "" },
      { date: "", name: "", company: "", department: "", cellphone: "" },
      { date: "", name: "", company: "", department: "", cellphone: "" },
      { date: "", name: "", company: "", department: "", cellphone: "" },
      { date: "", name: "", company: "", department: "", cellphone: "" }
    ],
    
    // Survey Outcome
    oemContractor: {
      name: "",
      signature: "",
      date: "",
      accepted: false,
      comments: ""
    },
    oemEngineer: {
      name: "",
      signature: "",
      date: "",
      accepted: false,
      comments: ""
    },
    eskomRepresentative: {
      name: "",
      signature: "",
      date: "",
      accepted: false,
      comments: ""
    },
    
    // Room Layout Scanned Drawing
    scannedRoomLayout: ""
  });
  
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => {
      // Handle nested fields with dot notation (e.g., "oemContractor.name")
      if (field.includes('.')) {
        const [parentField, childField] = field.split('.');
        return {
          ...prev,
          [parentField]: {
            ...prev[parentField as keyof typeof prev],
            [childField]: value
          }
        };
      }
      
      // Handle regular fields
      return {
        ...prev,
        [field]: value
      };
    });
  };
  
  const handleSave = () => {
    // Here you would normally save the data to a database
    console.log("Saving form data:", formData);
    toast.success("Survey data saved successfully!");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavigationBar />
      <NetworkingBanner
        title="Eskom OT IP/MPLS Network"
        subtitle="Site Survey Report"
      />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-akhanya">Eskom OT IP/MPLS Network Site Survey</h2>
            <p className="text-gray-600">
              Complete the form below to document the site information
            </p>
          </div>
          <div className="flex space-x-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className={`flex items-center gap-2 ${
                      showAIRecommendations ? "bg-akhanya-light text-akhanya border-akhanya" : ""
                    }`}
                    onClick={() => setShowAIRecommendations(!showAIRecommendations)}
                  >
                    <Sparkles className="h-4 w-4" />
                    AI Recommendations {showAIRecommendations ? "On" : "Off"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle AI assistance for this form</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => window.open("/public/lovable-uploads/3d43a04f-8853-44d0-aa58-fe39e729336d.png", "_blank")}
                  >
                    <FileText className="h-4 w-4" />
                    View Template
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View the original survey template</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Button 
              onClick={handleSave}
              className="flex items-center gap-2 bg-akhanya hover:bg-akhanya-dark"
            >
              <Save className="h-4 w-4" />
              Save Survey
            </Button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <EskomSurveyTabs 
            formData={formData} 
            onInputChange={handleInputChange} 
            showAIRecommendations={showAIRecommendations} 
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EskomSurvey;
