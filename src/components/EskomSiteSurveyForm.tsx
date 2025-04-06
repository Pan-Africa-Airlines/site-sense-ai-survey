
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import ImageCapture from "./ImageCapture";
import { Json } from "@/integrations/supabase/types";
import { Save } from "lucide-react";

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
  const [formProgress, setFormProgress] = useState(0);
  const [siteName, setSiteName] = useState("");
  const [region, setRegion] = useState("");
  const [date, setDate] = useState("");
  const [buildingPhoto, setBuildingPhoto] = useState("");
  
  // Site Information fields
  const [siteId, setSiteId] = useState("");
  const [siteType, setSiteType] = useState("");
  const [address, setAddress] = useState("");
  const [gpsCoordinates, setGpsCoordinates] = useState("");
  const [engineerId, setEngineerId] = useState("");
  
  const { toast } = useToast();
  const navigate = useNavigate();

  // Get the current user ID as engineer ID
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setEngineerId(data.user.id);
      }
    };
    
    getUser();
  }, []);

  // Update form progress when fields change
  useEffect(() => {
    const filledFields = [siteName, region, date, buildingPhoto, siteId, siteType, address, gpsCoordinates].filter(Boolean).length;
    const totalFields = 8;
    setFormProgress(Math.floor((filledFields / totalFields) * 100));
  }, [siteName, region, date, buildingPhoto, siteId, siteType, address, gpsCoordinates]);

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
        survey_data: {
          engineerId,
          lastUpdated: new Date().toISOString()
        } as Json
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
          engineerId,
          lastUpdated: new Date().toISOString(),
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
      <Progress value={formProgress} className="mb-6" />

      <form onSubmit={handleSubmit}>
        <FormTab active={true}>
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">1. SITE INFORMATION & LOCATION</h3>
            
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
                      <Input 
                        type="date"
                        name="date"
                        value={date}
                        onChange={handleInputChange}
                        className="border-0 focus-visible:ring-0 h-full w-full"
                      />
                    </td>
                  </tr>
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

            <div className="mt-8">
              <p className="font-medium mb-2">Full front view photo of building where IP/MPLS equipment will be situated.</p>
              <div className="min-h-[300px]">
                <ImageCapture 
                  onCapture={handleBuildingPhotoUpload} 
                  label="Building Photo"
                  description="Take a photo of the front view of the building."
                  capturedImage={buildingPhoto}
                />
              </div>
            </div>
            
            {showAIRecommendations && (
              <Card className="bg-akhanya-light/20 border-akhanya/30 mt-4">
                <CardContent className="pt-4">
                  <h4 className="font-semibold text-akhanya mb-2">AI Recommendations</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Make sure the entire building facade is clearly visible in your photo.</li>
                    <li>Ensure GPS coordinates are in the correct WGS84 format (e.g., -26.195246, 28.034088).</li>
                    <li>For Site Type, use standard Eskom abbreviations (Sub-TX for Substation Transmission, RS for Repeater Station, etc.).</li>
                    <li>Include nearby landmarks in the Address field to help locate the site.</li>
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
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
            <Button
              type="submit"
              className="bg-akhanya hover:bg-akhanya/80"
            >
              Submit Survey
            </Button>
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
