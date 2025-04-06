
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, FileDown } from "lucide-react";
import SiteInformation from "./survey/SiteInformation";
import EquipmentRoomGeneral from "./survey/EquipmentRoomGeneral";
import CabinetSpacePlanning from "./survey/CabinetSpacePlanning";
import TransportPlatforms from "./survey/TransportPlatforms";
import PowerDistribution from "./survey/PowerDistribution";
import EquipmentPhotos from "./survey/EquipmentPhotos";
import RequirementsRemarks from "./survey/RequirementsRemarks";
import AttendeeInformation from "./survey/AttendeeInformation";
import OpticalFrame from "./survey/OpticalFrame";
import html2pdf from 'html2pdf.js';
import { toast } from "sonner";

interface FormData {
  // Site Information
  siteName: string;
  siteId: string;
  siteType: string;
  region: string;
  date: string;
  address: string;
  gpsCoordinates: string;
  buildingPhoto: string;
  googleMapView: string;
  
  // Building Information
  buildingName: string;
  buildingType: string;
  floorLevel: string;
  equipmentRoomName: string;
  
  // Access Procedure
  accessRequirements: string;
  securityRequirements: string;
  vehicleType: string;
  
  // Site Contacts
  siteContacts: Array<{
    name: string;
    cellphone: string;
    email: string;
  }>;
  
  // Equipment Room General
  cableAccess: string;
  roomLighting: string;
  fireProtection: string;
  coolingMethod: string;
  coolingRating: string;
  roomTemperature: string;
  equipmentRoomCondition: string;
  
  // Cabinet Space Planning
  roomLayoutDrawing: string;
  numberOfRouters: string;
  roomLayoutMarkup: string;
  additionalDrawings: string[];
  
  // Transport Platforms
  transportLinks: Array<{
    linkNumber: string;
    linkType: string;
    direction: string;
    capacity: string;
  }>;
  
  // DC Power
  chargerA: string;
  chargerB: string;
  powerSupplyMethod: string;
  cableLength: string;
  endOfAisleLayout: string;
  
  // Photos
  equipmentRoomPhotos: string[];
  cabinetLocationPhotos: string[];
  powerDistributionPhotos: string[];
  transportEquipmentPhotos: string[];
  opticalFramePhotos: string[];
  accessEquipmentPhotos: string[];
  cableRoutingPhotos: string[];
  ceilingHVACPhotos: string[];
  
  // Requirements
  accessSecurity: string;
  coolingVentilation: string;
  flooringType: string;
  fireProt: string;
  lighting: string;
  roofType: string;
  powerCables: string;
  
  // General Remarks
  remarks: string;
  
  // ODF Layout
  odfCabinets: Array<{
    name: string;
    direction: string;
    connectionType: string;
    cores: string;
    usedPorts: Record<string, boolean>;
  }>;
  
  // Cabinet Layout
  cabinetLayoutDrawing: string;
  
  // 50V Charger Layout
  chargerDetails: {
    siteName: string;
    chargerLabel: string;
    chargerType: string;
    chargerA: Array<{
      circuit: string;
      mcbRating: string;
      used: boolean;
      label: string;
    }>;
    chargerB: Array<{
      circuit: string;
      mcbRating: string;
      used: boolean;
      label: string;
    }>;
  };
  
  // Attendee Information
  attendees: Array<{
    date: string;
    name: string;
    company: string;
    department: string;
    cellphone: string;
  }>;
  
  // Survey Outcome
  oemContractor: {
    name: string;
    signature: string;
    date: string;
    accepted: boolean;
    comments: string;
  };
  oemEngineer: {
    name: string;
    signature: string;
    date: string;
    accepted: boolean;
    comments: string;
  };
  eskomRepresentative: {
    name: string;
    signature: string;
    date: string;
    accepted: boolean;
    comments: string;
  };
  
  // Room Layout Scanned Drawing
  scannedRoomLayout: string;
}

interface EskomSurveyTabsProps {
  formData: FormData;
  onInputChange: (field: string, value: any) => void;
  showAIRecommendations?: boolean;
}

const EskomSurveyTabs: React.FC<EskomSurveyTabsProps> = ({
  formData,
  onInputChange,
  showAIRecommendations = false
}) => {
  const [activeTab, setActiveTab] = useState("site-info");
  
  const tabs = [
    { id: "site-info", label: "1. Site Information" },
    { id: "attendees", label: "2. Attendees" },
    { id: "equipment-room", label: "3. Equipment Room" },
    { id: "cabinet-planning", label: "4. Cabinet Planning" },
    { id: "transport", label: "5. Transport" },
    { id: "power", label: "6. Power Distribution" },
    { id: "photos", label: "7. Equipment Photos" },
    { id: "odf", label: "8. Optical Frame" },
    { id: "requirements", label: "9. Requirements" }
  ];
  
  const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab);
  
  const handleNextTab = () => {
    if (currentTabIndex < tabs.length - 1) {
      setActiveTab(tabs[currentTabIndex + 1].id);
    }
  };
  
  const handlePrevTab = () => {
    if (currentTabIndex > 0) {
      setActiveTab(tabs[currentTabIndex - 1].id);
    }
  };
  
  const generatePDF = () => {
    const element = document.getElementById('survey-content');
    if (!element) {
      toast.error("Could not find content to export");
      return;
    }

    const opt = {
      margin: 10,
      filename: `Eskom_Site_Survey_${formData.siteName || 'Report'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    toast.info("Generating PDF, please wait...");
    
    html2pdf().from(element).set(opt).save()
      .then(() => {
        toast.success("PDF generated successfully!");
      })
      .catch((error) => {
        console.error("PDF generation failed:", error);
        toast.error("Failed to generate PDF");
      });
  };

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 mb-2">
            {tabs.map(tab => (
              <TabsTrigger key={tab.id} value={tab.id} className="text-xs md:text-sm">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <Button 
            onClick={generatePDF}
            className="flex items-center gap-2 bg-akhanya hover:bg-akhanya-dark"
            type="button"
          >
            <FileDown className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
        
        <div id="survey-content" className="mt-4">
          <TabsContent value="site-info">
            <SiteInformation 
              formData={formData}
              onInputChange={onInputChange}
              showAIRecommendations={showAIRecommendations}
            />
          </TabsContent>
          
          <TabsContent value="attendees">
            <AttendeeInformation 
              formData={formData}
              onInputChange={onInputChange}
              showAIRecommendations={showAIRecommendations}
            />
          </TabsContent>
          
          <TabsContent value="equipment-room">
            <EquipmentRoomGeneral 
              formData={formData}
              onInputChange={onInputChange}
              showAIRecommendations={showAIRecommendations}
            />
          </TabsContent>
          
          <TabsContent value="cabinet-planning">
            <CabinetSpacePlanning 
              formData={formData}
              onInputChange={onInputChange}
              showAIRecommendations={showAIRecommendations}
            />
          </TabsContent>
          
          <TabsContent value="transport">
            <TransportPlatforms 
              formData={formData}
              onInputChange={onInputChange}
              showAIRecommendations={showAIRecommendations}
            />
          </TabsContent>
          
          <TabsContent value="power">
            <PowerDistribution 
              formData={formData}
              onInputChange={onInputChange}
              showAIRecommendations={showAIRecommendations}
            />
          </TabsContent>
          
          <TabsContent value="photos">
            <EquipmentPhotos 
              formData={formData}
              onInputChange={onInputChange}
              showAIRecommendations={showAIRecommendations}
            />
          </TabsContent>
          
          <TabsContent value="odf">
            <OpticalFrame 
              formData={formData}
              onInputChange={onInputChange}
              showAIRecommendations={showAIRecommendations}
            />
          </TabsContent>
          
          <TabsContent value="requirements">
            <RequirementsRemarks 
              formData={formData}
              onInputChange={onInputChange}
              showAIRecommendations={showAIRecommendations}
            />
          </TabsContent>
        </div>
      </Tabs>
      
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handlePrevTab}
          disabled={currentTabIndex === 0}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Previous
        </Button>
        
        <Button
          onClick={handleNextTab}
          disabled={currentTabIndex === tabs.length - 1}
          className="flex items-center gap-2 bg-akhanya hover:bg-akhanya-dark"
        >
          Next <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default EskomSurveyTabs;
