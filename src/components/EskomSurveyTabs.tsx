
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import EquipmentRoomGeneral from "./EquipmentRoomGeneral";
import CabinetSpacePlanning from "./CabinetSpacePlanning";

interface FormData {
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
  numberOfRouters: number | string;
  roomLayoutMarkup: string;
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
    { id: "equipment-room", label: "2. Equipment Room" },
    { id: "cabinet-planning", label: "3. Cabinet Planning" },
    { id: "transport", label: "4. Transport" },
    { id: "power", label: "5. Power Distribution" },
    { id: "requirements", label: "6. Requirements" }
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
  
  const equipmentRoomGeneralData = {
    cableAccess: formData.cableAccess,
    roomLighting: formData.roomLighting,
    fireProtection: formData.fireProtection,
    coolingMethod: formData.coolingMethod,
    coolingRating: formData.coolingRating,
    roomTemperature: formData.roomTemperature,
    equipmentRoomCondition: formData.equipmentRoomCondition
  };
  
  const cabinetSpacePlanningData = {
    roomLayoutDrawing: formData.roomLayoutDrawing,
    numberOfRouters: formData.numberOfRouters,
    roomLayoutMarkup: formData.roomLayoutMarkup
  };

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-6">
          {tabs.map(tab => (
            <TabsTrigger key={tab.id} value={tab.id} className="text-xs md:text-sm">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="site-info">
          <div className="p-4 text-center">
            <p>Site Information section will be displayed here</p>
          </div>
        </TabsContent>
        
        <TabsContent value="equipment-room">
          <EquipmentRoomGeneral 
            formData={equipmentRoomGeneralData} 
            onInputChange={onInputChange} 
            showAIRecommendations={showAIRecommendations}
          />
        </TabsContent>
        
        <TabsContent value="cabinet-planning">
          <CabinetSpacePlanning 
            formData={cabinetSpacePlanningData} 
            onInputChange={onInputChange} 
            showAIRecommendations={showAIRecommendations}
          />
        </TabsContent>
        
        <TabsContent value="transport">
          <div className="p-4 text-center">
            <p>Transport section will be displayed here</p>
          </div>
        </TabsContent>
        
        <TabsContent value="power">
          <div className="p-4 text-center">
            <p>Power Distribution section will be displayed here</p>
          </div>
        </TabsContent>
        
        <TabsContent value="requirements">
          <div className="p-4 text-center">
            <p>Requirements section will be displayed here</p>
          </div>
        </TabsContent>
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
