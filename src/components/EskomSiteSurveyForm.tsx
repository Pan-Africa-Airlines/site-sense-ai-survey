import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import ImageCapture from "./ImageCapture";
import { Json } from "@/integrations/supabase/types";
import { Save, MapPin, ChevronRight, ChevronLeft, PlusCircle } from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

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

// Interface for site attendee
interface SiteAttendee {
  date: string;
  name: string;
  company: string;
  department: string;
  cellphone: string;
}

// Interface for approval section
interface ApprovalSection {
  name: string;
  signature: string;
  date: string;
  accepted: boolean;
  rejected: boolean;
  comments: string;
}

// Interface for equipment location
interface EquipmentLocation {
  buildingName: string;
  buildingType: string;
  floorLevel: string;
  roomNumber: string;
}

// Interface for access procedure
interface AccessProcedure {
  requirements: string;
  securityRequirements: string;
  vehicleType: string;
}

// Interface for site owner contact
interface SiteOwnerContact {
  name: string;
  cellphone: string;
  email: string;
}

// Interface for equipment room general
interface EquipmentRoomGeneral {
  cableAccess: string;
  roomLighting: string;
  fireProtection: string;
  coolingMethod: string;
  coolingRating: string;
  roomTemperature: string;
  equipmentRoomCondition: string;
}

// Interface for cabinet space planning
interface CabinetSpacePlanning {
  roomLayoutDrawing: string;
  numberOfRouters: number;
  roomLayoutMarkup: string;
}

const EskomSiteSurveyForm = ({ showAIRecommendations = false }) => {
  const [currentTab, setCurrentTab] = useState("cover");
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
  
  // Site visit attendees
  const [attendees, setAttendees] = useState<SiteAttendee[]>([
    { date: "", name: "", company: "", department: "", cellphone: "" },
    { date: "", name: "", company: "", department: "", cellphone: "" },
    { date: "", name: "", company: "", department: "", cellphone: "" },
    { date: "", name: "", company: "", department: "", cellphone: "" },
    { date: "", name: "", company: "", department: "", cellphone: "" },
    { date: "", name: "", company: "", department: "", cellphone: "" },
  ]);
  
  // Equipment location information
  const [equipmentLocation, setEquipmentLocation] = useState<EquipmentLocation>({
    buildingName: "",
    buildingType: "",
    floorLevel: "",
    roomNumber: ""
  });

  // Access procedure information
  const [accessProcedure, setAccessProcedure] = useState<AccessProcedure>({
    requirements: "",
    securityRequirements: "",
    vehicleType: ""
  });

  // Site owner contacts
  const [siteOwnerContacts, setSiteOwnerContacts] = useState<SiteOwnerContact[]>([
    { name: "", cellphone: "", email: "" },
    { name: "", cellphone: "", email: "" },
    { name: "", cellphone: "", email: "" }
  ]);
  
  // Equipment room general information
  const [equipmentRoomGeneral, setEquipmentRoomGeneral] = useState<EquipmentRoomGeneral>({
    cableAccess: "",
    roomLighting: "",
    fireProtection: "",
    coolingMethod: "",
    coolingRating: "",
    roomTemperature: "",
    equipmentRoomCondition: ""
  });
  
  // Cabinet space planning
  const [cabinetSpacePlanning, setCabinetSpacePlanning] = useState<CabinetSpacePlanning>({
    roomLayoutDrawing: "",
    numberOfRouters: 0,
    roomLayoutMarkup: ""
  });
  
  // Approval sections
  const [oemContractor, setOemContractor] = useState<ApprovalSection>({
    name: "",
    signature: "",
    date: "",
    accepted: false,
    rejected: false,
    comments: ""
  });
  
  const [oemEngineer, setOemEngineer] = useState<ApprovalSection>({
    name: "",
    signature: "",
    date: "",
    accepted: false,
    rejected: false,
    comments: ""
  });
  
  const [eskomRepresentative, setEskomRepresentative] = useState<ApprovalSection>({
    name: "",
    signature: "",
    date: "",
    accepted: false,
    rejected: false,
    comments: ""
  });
  
  // Use the geolocation hook
  const { latitude, longitude, loading, error, retry, address: geoAddress } = useGeolocation();
  
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

  // Set coordinates when geolocation data is available
  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      setGpsCoordinates(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
      
      // Optionally set the address if it's available and the user hasn't manually entered one
      if (geoAddress && !address) {
        setAddress(geoAddress);
      }
    }
  }, [latitude, longitude, geoAddress]);

  // Initialize the date field with today's date if it's empty
  useEffect(() => {
    if (!date) {
      const today = new Date().toISOString().split('T')[0];
      setDate(today);
    }
  }, [date]);

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

  // Handle equipment location changes
  const handleEquipmentLocationChange = (field: keyof EquipmentLocation, value: string) => {
    setEquipmentLocation({
      ...equipmentLocation,
      [field]: value
    });
  };

  // Handle access procedure changes
  const handleAccessProcedureChange = (field: keyof AccessProcedure, value: string) => {
    setAccessProcedure({
      ...accessProcedure,
      [field]: value
    });
  };

  // Handle equipment room general changes
  const handleEquipmentRoomGeneralChange = (field: keyof EquipmentRoomGeneral, value: string) => {
    setEquipmentRoomGeneral({
      ...equipmentRoomGeneral,
      [field]: value
    });
  };

  // Handle cabinet space planning changes
  const handleCabinetSpacePlanningChange = (field: keyof CabinetSpacePlanning, value: string | number) => {
    setCabinetSpacePlanning({
      ...cabinetSpacePlanning,
      [field]: value
    });
  };

  // Handle site owner contact changes
  const handleSiteOwnerContactChange = (index: number, field: keyof SiteOwnerContact, value: string) => {
    const updatedContacts = [...siteOwnerContacts];
    updatedContacts[index] = {
      ...updatedContacts[index],
      [field]: value
    };
    setSiteOwnerContacts(updatedContacts);
  };

  // Handle attendee changes
  const handleAttendeeChange = (index: number, field: keyof SiteAttendee, value: string) => {
    const updatedAttendees = [...attendees];
    updatedAttendees[index] = {
      ...updatedAttendees[index],
      [field]: value
    };
    setAttendees(updatedAttendees);
  };

  // Handle approval section changes
  const handleApprovalChange = (
    section: "oemContractor" | "oemEngineer" | "eskomRepresentative",
    field: keyof ApprovalSection,
    value: string | boolean
  ) => {
    switch (section) {
      case "oemContractor":
        setOemContractor({ ...oemContractor, [field]: value });
        break;
      case "oemEngineer":
        setOemEngineer({ ...oemEngineer, [field]: value });
        break;
      case "eskomRepresentative":
        setEskomRepresentative({ ...eskomRepresentative, [field]: value });
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
      
      const surveyData = {
        engineerId,
        lastUpdated: new Date().toISOString(),
        approved: false,  // Initial approval status
        approvedBy: null, // Will be filled by admin later
        approvalDate: null, // Will be filled by admin later
        attendees,
        equipmentLocation,
        accessProcedure,
        siteOwnerContacts,
        equipmentRoomGeneral,
        cabinetSpacePlanning,
        approvals: {
          oemContractor,
          oemEngineer,
          eskomRepresentative
        }
      };
      
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
        status: "submitted",
        survey_data: surveyData as unknown as Json
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
          description: "Your survey has been saved and sent for approval.",
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
      
      const surveyData = {
        engineerId,
        lastUpdated: new Date().toISOString(),
        currentTab,
        formProgress,
        approved: false,
        approvedBy: null,
        approvalDate: null,
        attendees,
        equipmentLocation,
        accessProcedure,
        siteOwnerContacts,
        equipmentRoomGeneral,
        cabinetSpacePlanning,
        approvals: {
          oemContractor,
          oemEngineer,
          eskomRepresentative
        }
      };
      
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
        status: "draft",
        survey_data: surveyData as unknown as Json
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

  const nextTab = () => {
    if (currentTab === "cover") {
      setCurrentTab("attendees");
    } else if (currentTab === "attendees") {
      setCurrentTab("contents");
    } else if (currentTab === "contents") {
      setCurrentTab("site-info");
    } else if (currentTab === "site-info") {
      setCurrentTab("equipment-details");
    } else if (currentTab === "equipment-details") {
      setCurrentTab("equipment-room");
    }
  };

  const prevTab = () => {
    if (currentTab === "equipment-room") {
      setCurrentTab("equipment-details");
    } else if (currentTab === "equipment-details") {
      setCurrentTab("site-info");
    } else if (currentTab === "site-info") {
      setCurrentTab("contents");
    } else if (currentTab === "contents") {
      setCurrentTab("attendees");
    } else if (currentTab === "attendees") {
      setCurrentTab("cover");
    }
  };

  return (
    <div className="mt-6">
      <Progress value={formProgress} className="mb-6" />

      <form onSubmit={handleSubmit}>
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger value="cover" className="flex items-center justify-center gap-2 relative">
              <div className="bg-akhanya text-white w-6 h-6 rounded-full flex items-center justify-center font-medium">1</div>
              <span>Cover Page</span>
            </TabsTrigger>
            <TabsTrigger value="attendees" className="flex items-center justify-center gap-2">
              <div className="bg-akhanya text-white w-6 h-6 rounded-full flex items-center justify-center font-medium">2</div>
              <span>Attendees</span>
            </TabsTrigger>
            <TabsTrigger value="contents" className="flex items-center justify-center gap-2">
              <div className="bg-akhanya text-white w-6 h-6 rounded-full flex items-center justify-center font-medium">3</div>
              <span>Contents</span>
            </TabsTrigger>
            <TabsTrigger value="site-info" className="flex items-center justify-center gap-2">
              <div className="bg-akhanya text-white w-6 h-6 rounded-full flex items-center justify-center font-medium">4</div>
              <span>Site Info</span>
            </TabsTrigger>
            <TabsTrigger value="equipment-details" className="flex items-center justify-center gap-2">
              <div className="bg-akhanya text-white w-6 h-6 rounded-full flex items-center justify-center font-medium">5</div>
              <span>Equipment</span>
            </TabsTrigger>
            <TabsTrigger value="equipment-room" className="flex items-center justify-center gap-2">
              <div className="bg-akhanya text-white w-6 h-6 rounded-full flex items-center justify-center font-medium">6</div>
              <span>Room Details</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Keep existing TabsContent sections */}
          <TabsContent value="cover" className="mt-4">
            {/* ... keep existing code (Cover page tab content) */}
          </TabsContent>
          
          <TabsContent value="attendees" className="mt-4">
            {/* ... keep existing code (Attendees tab content) */}
          </TabsContent>
          
          <TabsContent value="contents" className="mt-4">
            {/* ... keep existing code (Contents tab content) */}
          </TabsContent>
          
          <TabsContent value="site-info" className="mt-4">
            {/* ... keep existing code (Site info tab content) */}
          </TabsContent>
          
          <TabsContent value="equipment-details" className="mt-4">
            {/* ... keep existing code (Equipment details tab content) */}
          </TabsContent>
          
          {/* New "Equipment Room General" tab content */}
          <TabsContent value="equipment-room" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-8">
                  <div className="flex justify-end mb-4">
                    <img 
                      src="/public/lovable-uploads/86add713-b146-4f31-ab69-d80b3051168b.png" 
                      alt="BCX Logo" 
                      className="w-32"
                    />
                  </div>
                  
                  <div className="mb-8">
                    <h3 className="text-2xl font-semibold text-center mb-6">2. EQUIPMENT ROOM (GENERAL)</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 p-2 text-left w-1/3">Subject</th>
                            <th className="border border-gray-300 p-2 text-left w-2/3">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border border-gray-300">
                            <td className="border border-gray-300 p-2 font-medium">
                              Cable access to the cabinet (Underfloor, Overhead)
                            </td>
                            <td className="border border-gray-300 p-1">
                              <Input 
                                type="text" 
                                value={equipmentRoomGeneral.cableAccess}
                                onChange={(e) => handleEquipmentRoomGeneralChange('cableAccess', e.target.value)}
                                className="border-0 focus-visible:ring-0 h-full w-full"
                                placeholder="Underfloor, Overhead, etc."
                              />
                            </td>
                          </tr>
                          <tr className="border border-gray-300">
                            <td className="border border-gray-300 p-2 font-medium">
                              Room lighting (Indicate if any lights are faulty)
                            </td>
                            <td className="border border-gray-300 p-1">
                              <Input 
                                type="text" 
                                value={equipmentRoomGeneral.roomLighting}
                                onChange={(e) => handleEquipmentRoomGeneralChange('roomLighting', e.target.value)}
                                className="border-0 focus-visible:ring-0 h-full w-full"
                                placeholder="Indicate if any lights are faulty"
                              />
                            </td>
                          </tr>
                          <tr className="border border-gray-300">
                            <td className="border border-gray-300 p-2 font-medium">
                              Fire Protection
                            </td>
                            <td className="border border-gray-300 p-1">
                              <Input 
                                type="text" 
                                value={equipmentRoomGeneral.fireProtection}
                                onChange={(e) => handleEquipmentRoomGeneralChange('fireProtection', e.target.value)}
                                className="border-0 focus-visible:ring-0 h-full w-full"
                                placeholder="Fire extinguishers, sprinklers, etc."
                              />
                            </td>
                          </tr>
                          <tr className="border border-gray-300">
                            <td className="border border-gray-300 p-2 font-medium">
                              Cooling Method (Air-conditioning, Fans etc)
                            </td>
                            <td className="border border-gray-300 p-1">
                              <Input 
                                type="text" 
                                value={equipmentRoomGeneral.coolingMethod}
                                onChange={(e) => handleEquipmentRoomGeneralChange('coolingMethod', e.target.value)}
                                className="border-0 focus-visible:ring-0 h-full w-full"
                                placeholder="Air-conditioning, Fans, etc."
                              />
                            </td>
                          </tr>
                          <tr className="border border-gray-300">
                            <td className="border border-gray-300 p-2 font-medium">
                              Cooling Rating (BTU or Central Controlled)
                            </td>
                            <td className="border border-gray-300 p-1">
                              <Input 
                                type="text" 
                                value={equipmentRoomGeneral.coolingRating}
                                onChange={(e) => handleEquipmentRoomGeneralChange('coolingRating', e.target.value)}
                                className="border-0 focus-visible:ring-0 h-full w-full"
                                placeholder="BTU or Central Controlled"
                              />
                            </td>
                          </tr>
                          <tr className="border border-gray-300">
                            <td className="border border-gray-300 p-2 font-medium">
                              Measured room temperature (Deg C)
                            </td>
                            <td className="border border-gray-300 p-1">
                              <Input 
                                type="text" 
                                value={equipmentRoomGeneral.roomTemperature}
                                onChange={(e) => handleEquipmentRoomGeneralChange('roomTemperature', e.target.value)}
                                className="border-0 focus-visible:ring-0 h-full w-full"
                                placeholder="Temperature in degrees Celsius"
                              />
                            </td>
                          </tr>
                          <tr className="border border-gray-300">
                            <td className="border border-gray-300 p-2 font-medium">
                              General condition of equipment room
                            </td>
                            <td className="border border-gray-300 p-1">
                              <Textarea 
                                value={equipmentRoomGeneral.equipmentRoomCondition}
                                onChange={(e) => handleEquipmentRoomGeneralChange('equipmentRoomCondition', e.target.value)}
                                className="border-0 focus-visible:ring-0 h-full w-full min-h-[80px]"
                                placeholder="Describe general condition, cleanliness, etc."
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-2xl font-semibold text-center mb-6">3. DETAILED SITE RECORDS</h3>
                    <h4 className="text-xl font-semibold mt-4 mb-3">3.1. Equipment Cabinet Space Planning</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 p-2 text-left w-1/3">Subject</th>
                            <th className="border border-gray-300 p-2 text-left w-2/3">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border border-gray-300">
                            <td className="border border-gray-300 p-2 font-medium">
                              Room Layout Drawing (Prior to site visit, Eskom will supply PDF version, as available). OEM to printout copies and bring to site. Red-lined scanned version to be attached to the site survey report.
                            </td>
                            <td className="border border-gray-300 p-1">
                              <Textarea 
                                value={cabinetSpacePlanning.roomLayoutDrawing}
                                onChange={(e) => handleCabinetSpacePlanningChange('roomLayoutDrawing', e.target.value)}
                                className="border-0 focus-visible:ring-0 h-full w-full min-h-[80px]"
                                placeholder="Description of room layout drawing"
                              />
                            </td>
                          </tr>
                          <tr className="border border-gray-300">
                            <td className="border border-gray-300 p-2 font-medium">
                              Please indicate number of new routers required?
                            </td>
                            <td className="border border-gray-300 p-1">
                              <Input 
                                type="number" 
                                value={cabinetSpacePlanning.numberOfRouters.toString()}
                                onChange={(e) => handleCabinetSpacePlanningChange('numberOfRouters', parseInt(e.target.value) || 0)}
                                className="border-0 focus-visible:ring-0 h-full w-full"
                                placeholder="Enter number of routers"
                              />
                            </td>
                          </tr>
                          <tr className="border border-gray-300">
                            <td className="border border-gray-300 p-2 font-medium">
                              Please red-line Room Layout Drawing to indicate:
                              <ul className="list-disc ml-5 mt-2">
                                <li>Location of new IP/MPLS Cabinet(s).</li>
                                <li>Location of existing ODFs needed for project.</li>
                                <li>Location of existing Ericsson ADM.</li>
                                <li>Location of the OTN Box.</li>
                                <li>Location of existing BME (Transmission sites).</li>
                                <li>Location of existing FOX.</li>
                                <li>Location of existing OT Router (ASR Network).</li>
                                <li>Location of existing DC Chargers.</li>
                                <li>Location of existing EOA DB board.</li>
                                <li>Location of air-conditioners.</li>
                              </ul>
                            </td>
                            <td className="border border-gray-300 p-1">
                              <Textarea 
                                value={cabinetSpacePlanning.roomLayoutMarkup}
                                onChange={(e) => handleCabinetSpacePlanningChange('roomLayoutMarkup', e.target.value)}
                                className="border-0 focus-visible:ring-0 h-full w-full min-h-[200px]"
                                placeholder="Describe room layout markup"
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="text-right mt-4">
                    <p className="text-sm text-gray-500">Page 6 of 17</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-between mt-4">
              <Button type="button" onClick={prevTab} className="flex items-center">
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <div className="flex gap-2">
                <Button type="button" onClick={handleSaveForLater} variant="outline" className="flex items-center gap-1">
                  <Save className="h-4 w-4" /> Save Draft
                </Button>
                <Button type="submit" className="flex items-center">
                  Submit Survey
                </Button>
              </div>
            </div>
          </TabsContent>
          
        </Tabs>

        {/* Bottom action buttons */}
        {currentTab !== "equipment-room" && (
          <div className="flex justify-between mt-4">
            {currentTab !== "cover" ? (
              <Button type="button" onClick={prevTab} className="flex items-center">
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
            ) : (
              <div></div> // Empty div to maintain alignment
            )}
            
            <div className="flex gap-2">
              <Button type="button" onClick={handleSaveForLater} variant="outline" className="flex items-center gap-1">
                <Save className="h-4 w-4" /> Save Draft
              </Button>
              
              {currentTab !== "equipment-room" ? (
                <Button type="button" onClick={nextTab} className="flex items-center">
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" className="flex items-center">
                  Submit Survey
                </Button>
              )}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default EskomSiteSurveyForm;
