
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAI } from "@/contexts/AIContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import ImageCapture from "./ImageCapture";
import { Json } from "@/integrations/supabase/types";
import { Calendar, ChevronLeft, ChevronRight, Save } from "lucide-react";

interface FormTabProps {
  children: React.ReactNode;
  active: boolean;
}

const FormTab: React.FC<FormTabProps> = ({ children, active }) => {
  return (
    <div className={`${active ? "block" : "hidden"}`}>
      {children}
    </div>
  );
};

interface TabIndicatorProps {
  currentTab: number;
  totalTabs: number;
  goToTab: (tab: number) => void;
}

const TabIndicator: React.FC<TabIndicatorProps> = ({ currentTab, totalTabs, goToTab }) => {
  return (
    <div className="flex justify-center items-center space-x-2 mb-8">
      {Array.from({ length: totalTabs }, (_, i) => (
        <div 
          key={i} 
          className={`
            flex items-center justify-center 
            w-8 h-8 rounded-full cursor-pointer
            border-2 transition-all
            ${currentTab === i 
              ? "bg-akhanya text-white border-akhanya" 
              : i < currentTab 
                ? "bg-gray-200 border-gray-300 text-gray-700" 
                : "bg-white border-gray-300 text-gray-500"
            }
          `}
          onClick={() => goToTab(i)}
        >
          {i + 1}
        </div>
      ))}
    </div>
  );
};

interface TableInputRowProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TableInputRow: React.FC<TableInputRowProps> = ({ label, name, value, onChange }) => {
  return (
    <tr className="border border-gray-300">
      <td className="border border-gray-300 p-2 font-medium">{label}</td>
      <td className="border border-gray-300 p-1">
        <Input 
          type="text" 
          name={name} 
          value={value} 
          onChange={onChange}
          className="border-0 focus-visible:ring-0 h-full w-full"
        />
      </td>
    </tr>
  );
};

const EskomSiteSurveyForm = ({ showAIRecommendations = false }) => {
  const [currentTab, setCurrentTab] = useState(0);
  const totalTabs = 13;
  const [formProgress, setFormProgress] = useState(0);
  const [siteName, setSiteName] = useState("");
  const [region, setRegion] = useState("");
  const [date, setDate] = useState("");
  const [buildingPhoto, setBuildingPhoto] = useState("");
  
  // Additional form fields
  const [siteId, setSiteId] = useState("");
  const [siteType, setSiteType] = useState("");
  const [address, setAddress] = useState("");
  const [gpsCoordinates, setGpsCoordinates] = useState("");
  
  const { toast } = useToast();
  const navigate = useNavigate();

  // Update form progress when fields change
  useEffect(() => {
    const filledFields = [siteName, region, date, buildingPhoto].filter(Boolean).length;
    const totalFields = 4;
    setFormProgress(Math.floor((filledFields / totalFields) * 100));
  }, [siteName, region, date, buildingPhoto]);

  const goToTab = (tabIndex: number) => {
    if (tabIndex >= 0 && tabIndex < totalTabs) {
      setCurrentTab(tabIndex);
    }
  };

  const nextTab = () => {
    if (currentTab < totalTabs - 1) {
      setCurrentTab(currentTab + 1);
    }
  };

  const prevTab = () => {
    if (currentTab > 0) {
      setCurrentTab(currentTab - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case "siteName":
        setSiteName(value);
        break;
      case "region":
        setRegion(value);
        break;
      case "date":
        setDate(value);
        break;
      case "siteId":
        setSiteId(value);
        break;
      case "siteType":
        setSiteType(value);
        break;
      case "address":
        setAddress(value);
        break;
      case "gpsCoordinates":
        setGpsCoordinates(value);
        break;
      default:
        break;
    }
  };

  const handleBuildingPhotoUpload = (photoUrl: string) => {
    setBuildingPhoto(photoUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const surveyRecord = {
        site_name: siteName,
        region: region,
        date: date,
        site_type: siteType,
        site_id: siteId,
        address: address,
        gps_coordinates: gpsCoordinates,
        building_photo: buildingPhoto,
        user_id: user?.id,
        status: "Draft",
        survey_data: {} as Json
      };
      
      const { data, error } = await supabase
        .from('site_surveys')
        .insert([surveyRecord]);

      if (error) {
        toast({
          title: "Error submitting survey",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Survey submitted successfully",
          description: "Your survey has been saved.",
        });
        navigate("/eskom-surveys");
      }
    } catch (error: any) {
      toast({
        title: "Unexpected error",
        description: error.message || "Failed to submit the survey. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSaveForLater = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const surveyRecord = {
        site_name: siteName || "Untitled Survey",
        region: region,
        date: date,
        site_type: siteType,
        site_id: siteId,
        address: address,
        gps_coordinates: gpsCoordinates,
        building_photo: buildingPhoto,
        user_id: user?.id,
        status: "Draft",
        survey_data: {
          currentTab,
          formProgress
        } as Json
      };
      
      const { data, error } = await supabase
        .from('site_surveys')
        .insert([surveyRecord]);

      if (error) {
        toast({
          title: "Error saving survey",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Survey saved",
          description: "Your progress has been saved. You can continue later.",
        });
        navigate("/eskom-surveys");
      }
    } catch (error: any) {
      toast({
        title: "Unexpected error",
        description: error.message || "Failed to save the survey. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mt-6">
      <TabIndicator 
        currentTab={currentTab}
        totalTabs={totalTabs}
        goToTab={goToTab}
      />

      <Progress value={formProgress} className="mb-6" />

      <form onSubmit={handleSubmit}>
        {/* Tab 1: Site Information & Basic Details */}
        <FormTab active={currentTab === 0}>
          <div className="space-y-6">
            <table className="w-full border-collapse border border-gray-300">
              <tbody>
                <TableInputRow 
                  label="Site Name:" 
                  name="siteName" 
                  value={siteName} 
                  onChange={handleInputChange}
                />
                <tr className="border border-gray-300">
                  <td className="border border-gray-300 p-2 font-medium">Region:</td>
                  <td className="border border-gray-300 p-1">
                    <Select value={region} onValueChange={(value) => setRegion(value)}>
                      <SelectTrigger className="border-0 focus:ring-0 h-full w-full">
                        <SelectValue placeholder="Select a region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Gauteng">Gauteng</SelectItem>
                        <SelectItem value="Western Cape">Western Cape</SelectItem>
                        <SelectItem value="Eastern Cape">Eastern Cape</SelectItem>
                        <SelectItem value="KwaZulu-Natal">KwaZulu-Natal</SelectItem>
                        <SelectItem value="Free State">Free State</SelectItem>
                        <SelectItem value="North West">North West</SelectItem>
                        <SelectItem value="Mpumalanga">Mpumalanga</SelectItem>
                        <SelectItem value="Limpopo">Limpopo</SelectItem>
                        <SelectItem value="Northern Cape">Northern Cape</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
                <tr className="border border-gray-300">
                  <td className="border border-gray-300 p-2 font-medium">Date:</td>
                  <td className="border border-gray-300 p-1">
                    <div className="flex items-center">
                      <Input
                        type="date"
                        name="date"
                        value={date}
                        onChange={handleInputChange}
                        className="border-0 focus-visible:ring-0 h-full w-full"
                      />
                      <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="mt-8 p-4 border border-gray-300">
              <p className="mb-2">Full front view photo of building where IP/MPLS equipment will be situated.</p>
              <div className="min-h-[300px] flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-4">
                {buildingPhoto ? (
                  <div className="relative w-full h-[300px]">
                    <img
                      src={buildingPhoto}
                      alt="Building Photo"
                      className="w-full h-full object-contain"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => setBuildingPhoto("")}
                    >
                      Change Photo
                    </Button>
                  </div>
                ) : (
                  <ImageCapture onCapture={handleBuildingPhotoUpload} />
                )}
              </div>
            </div>
          </div>
        </FormTab>

        {/* Additional tabs would be added here */}
        <FormTab active={currentTab === 1}>
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">1. SITE INFORMATION & LOCATION</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-md font-semibold mb-2">1.1. Site Identification</h4>
                  <table className="w-full border-collapse border border-gray-300">
                    <tbody>
                      <TableInputRow 
                        label="Site Name" 
                        name="siteName" 
                        value={siteName} 
                        onChange={handleInputChange}
                      />
                      <TableInputRow 
                        label="Site ID (WorkPlace ID)" 
                        name="siteId" 
                        value={siteId} 
                        onChange={handleInputChange}
                      />
                      <TableInputRow 
                        label="Site Type (Sub-TX, RS, PS-Coal)" 
                        name="siteType" 
                        value={siteType} 
                        onChange={handleInputChange}
                      />
                      <TableInputRow 
                        label="Address/Location Description" 
                        name="address" 
                        value={address} 
                        onChange={handleInputChange}
                      />
                      <TableInputRow 
                        label="GPS coordinates WGS84 (Lat/Long)" 
                        name="gpsCoordinates" 
                        value={gpsCoordinates} 
                        onChange={handleInputChange}
                      />
                    </tbody>
                  </table>
                </div>
                
                <div>
                  <h4 className="text-md font-semibold mb-2">1.2. Eskom Site Location</h4>
                  <div className="p-4 border border-gray-300 min-h-[200px] flex items-center justify-center bg-gray-50">
                    <p className="text-gray-500">Please provide a Google Map view of the site location with coordinates.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </FormTab>

        {/* Navigation and action buttons */}
        <div className="mt-8 flex justify-between">
          <div>
            <Button
              type="button"
              variant="outline"
              onClick={handleSaveForLater}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save and Continue Later
            </Button>
          </div>
          <div className="flex gap-2">
            {currentTab > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={prevTab}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
            )}
            {currentTab < totalTabs - 1 ? (
              <Button
                type="button"
                onClick={nextTab}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                className="bg-akhanya hover:bg-akhanya/80"
              >
                Submit Survey
              </Button>
            )}
          </div>
        </div>
      </form>
      
      <div className="flex items-center justify-between mt-8 text-sm text-gray-500">
        <div>
          <p>Approved by: ________________</p>
        </div>
        <div>
          <p>Authorized Date: {date || 'DD/MM/YYYY'}</p>
        </div>
      </div>
    </div>
  );
};

export default EskomSiteSurveyForm;
