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

// Add this interface to match the ImageCapture component props
interface ImageCaptureComponentProps {
  onPhotoTaken: (photoUrl: string) => void;
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
          
          <TabsContent value="cover" className="mt-4">
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
                  
                  <h3 className="text-2xl font-semibold text-center mb-6">Eskom OT IP/MPLS Network Site Survey</h3>
                  
                  <div className="mb-4">
                    <Label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-1">
                      Site Name
                    </Label>
                    <Input
                      type="text"
                      id="siteName"
                      name="siteName"
                      value={siteName}
                      onChange={handleInputChange}
                      className="shadow-sm focus:ring-akhanya focus:border-akhanya block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Enter site name"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <Label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
                      Region
                    </Label>
                    <Input
                      type="text"
                      id="region"
                      name="region"
                      value={region}
                      onChange={handleInputChange}
                      className="shadow-sm focus:ring-akhanya focus:border-akhanya block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Enter region"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <Label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </Label>
                    <Input
                      type="date"
                      id="date"
                      name="date"
                      value={date}
                      onChange={handleInputChange}
                      className="shadow-sm focus:ring-akhanya focus:border-akhanya block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <Label className="block text-sm font-medium text-gray-700 mb-2">
                      Building Photo
                    </Label>
                    <ImageCapture 
                      onPhotoTaken={handleBuildingPhotoUpload} 
                    />
                    {buildingPhoto && (
                      <div className="mt-2">
                        <img src={buildingPhoto} alt="Building Preview" className="max-w-xs rounded-md" />
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right mt-4">
                    <p className="text-sm text-gray-500">Page 1 of 17</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end mt-4">
              <Button type="button" onClick={nextTab} className="ml-auto flex items-center">
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="attendees" className="mt-4">
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
                  
                  <h3 className="text-2xl font-semibold text-center mb-6">1. SITE VISIT ATTENDEES</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 p-2 text-left">Date</th>
                          <th className="border border-gray-300 p-2 text-left">Name</th>
                          <th className="border border-gray-300 p-2 text-left">Company</th>
                          <th className="border border-gray-300 p-2 text-left">Department</th>
                          <th className="border border-gray-300 p-2 text-left">Cellphone</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendees.map((attendee, index) => (
                          <tr key={index} className="border border-gray-300">
                            <td className="border border-gray-300 p-1">
                              <Input
                                type="date"
                                value={attendee.date}
                                onChange={(e) => handleAttendeeChange(index, 'date', e.target.value)}
                                className="border-0 focus-visible:ring-0 h-full w-full"
                              />
                            </td>
                            <td className="border border-gray-300 p-1">
                              <Input
                                type="text"
                                value={attendee.name}
                                onChange={(e) => handleAttendeeChange(index, 'name', e.target.value)}
                                className="border-0 focus-visible:ring-0 h-full w-full"
                                placeholder="Name"
                              />
                            </td>
                            <td className="border border-gray-300 p-1">
                              <Input
                                type="text"
                                value={attendee.company}
                                onChange={(e) => handleAttendeeChange(index, 'company', e.target.value)}
                                className="border-0 focus-visible:ring-0 h-full w-full"
                                placeholder="Company"
                              />
                            </td>
                            <td className="border border-gray-300 p-1">
                              <Input
                                type="text"
                                value={attendee.department}
                                onChange={(e) => handleAttendeeChange(index, 'department', e.target.value)}
                                className="border-0 focus-visible:ring-0 h-full w-full"
                                placeholder="Department"
                              />
                            </td>
                            <td className="border border-gray-300 p-1">
                              <Input
                                type="tel"
                                value={attendee.cellphone}
                                onChange={(e) => handleAttendeeChange(index, 'cellphone', e.target.value)}
                                className="border-0 focus-visible:ring-0 h-full w-full"
                                placeholder="Cellphone"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="text-right mt-4">
                    <p className="text-sm text-gray-500">Page 2 of 17</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-between mt-4">
              <Button type="button" onClick={prevTab} className="flex items-center">
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <Button type="button" onClick={nextTab} className="flex items-center">
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="contents" className="mt-4">
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
                  
                  <h3 className="text-2xl font-semibold text-center mb-6">TABLE OF CONTENTS</h3>
                  
                  <div className="mb-4">
                    <ol className="list-decimal pl-5">
                      <li>SITE VISIT ATTENDEES</li>
                      <li>EQUIPMENT ROOM (GENERAL)</li>
                      <li>DETAILED SITE RECORDS
                        <ol className="list-decimal pl-5 mt-2">
                          <li>Equipment Cabinet Space Planning</li>
                          <li>Power Requirements</li>
                          <li>Earthing</li>
                          <li>Optical Fibre</li>
                          <li>Ethernet</li>
                          <li>Microwave</li>
                          <li>Satellite</li>
                          <li>Security</li>
                          <li>Other</li>
                        </ol>
                      </li>
                      <li>APPROVAL</li>
                    </ol>
                  </div>
                  
                  <div className="text-right mt-4">
                    <p className="text-sm text-gray-500">Page 3 of 17</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-between mt-4">
              <Button type="button" onClick={prevTab} className="flex items-center">
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <Button type="button" onClick={nextTab} className="flex items-center">
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="site-info" className="mt-4">
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
                
                  <h3 className="text-2xl font-semibold text-center mb-6">1. SITE INFORMATION</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 p-2 text-left w-1/3">Subject</th>
                          <th className="border border-gray-300 p-2 text-left w-2/3">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        <TableInputRow
                          label="Site ID"
                          name="siteId"
                          value={siteId}
                          onChange={handleInputChange}
                        />
                        <TableInputRow
                          label="Site Type"
                          name="siteType"
                          value={siteType}
                          onChange={handleInputChange}
                        />
                        <TableInputRow
                          label="Address"
                          name="address"
                          value={address}
                          onChange={handleInputChange}
                        />
                        <tr className="border border-gray-300">
                          <td className="border border-gray-300 p-2 font-medium">GPS Coordinates</td>
                          <td className="border border-gray-300 p-1 relative">
                            <Input
                              type="text"
                              name="gpsCoordinates"
                              value={gpsCoordinates}
                              onChange={handleInputChange}
                              className="border-0 focus-visible:ring-0 h-full w-full"
                              placeholder="Latitude, Longitude"
                            />
                            {!loading && !gpsCoordinates && (
                              <Button
                                type="button"
                                onClick={retry}
                                disabled={loading}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-md shadow-sm px-3 py-1.5 text-sm font-semibold text-white bg-akhanya hover:bg-akhanya-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-akhanya focus-visible:ring-offset-2"
                              >
                                Get Location
                              </Button>
                            )}
                            {loading && <span className="location-badge">Detecting location...</span>}
                            {error && <span className="location-badge">Error: {error}</span>}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="text-right mt-4">
                    <p className="text-sm text-gray-500">Page 4 of 17</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-between mt-4">
              <Button type="button" onClick={prevTab} className="flex items-center">
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <Button type="button" onClick={nextTab} className="flex items-center">
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="equipment-details" className="mt-4">
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
                  
                  <h3 className="text-2xl font-semibold text-center mb-6">1. EQUIPMENT DETAILS</h3>
                  
                  <h4 className="text-xl font-semibold mt-4 mb-3">1.1. Equipment Location</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 p-2 text-left w-1/3">Subject</th>
                          <th className="border border-gray-300 p-2 text-left w-2/3">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        <TableInputRow
                          label="Building Name"
                          name="buildingName"
                          value={equipmentLocation.buildingName}
                          onChange={(e) => handleEquipmentLocationChange('buildingName', e.target.value)}
                        />
                        <TableInputRow
                          label="Building Type"
                          name="buildingType"
                          value={equipmentLocation.buildingType}
                          onChange={(e) => handleEquipmentLocationChange('buildingType', e.target.value)}
                        />
                        <TableInputRow
                          label="Floor Level"
                          name="floorLevel"
                          value={equipmentLocation.floorLevel}
                          onChange={(e) => handleEquipmentLocationChange('floorLevel', e.target.value)}
                        />
                        <TableInputRow
                          label="Room Number"
                          name="roomNumber"
                          value={equipmentLocation.roomNumber}
                          onChange={(e) => handleEquipmentLocationChange('roomNumber', e.target.value)}
                        />
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="text-right mt-4">
                    <p className="text-sm text-gray-500">Page 5 of 17</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-between mt-4">
              <Button type="button" onClick={prevTab} className="flex items-center">
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <Button type="button" onClick={nextTab} className="flex items-center">
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
          
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
                  
                  <h3 className="text-2xl font-semibold text-center mb-6">3.1. EQUIPMENT ROOM (GENERAL)</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 p-2 text-left w-1/3">Subject</th>
                          <th className="border border-gray-300 p-2 text-left w-2/3">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        <TableInputRow
                          label="Cable Access"
                          name="cableAccess"
                          value={equipmentRoomGeneral.cableAccess}
                          onChange={(e) => handleEquipmentRoomGeneralChange('cableAccess', e.target.value)}
                        />
                        <TableInputRow
                          label="Room Lighting"
                          name="roomLighting"
                          value={equipmentRoomGeneral.roomLighting}
                          onChange={(e) => handleEquipmentRoomGeneralChange('roomLighting', e.target.value)}
                        />
                        <TableInputRow
                          label="Fire Protection"
                          name="fireProtection"
                          value={equipmentRoomGeneral.fireProtection}
                          onChange={(e) => handleEquipmentRoomGeneralChange('fireProtection', e.target.value)}
                        />
                        <TableInputRow
                          label="Cooling Method"
                          name="coolingMethod"
                          value={equipmentRoomGeneral.coolingMethod}
                          onChange={(e) => handleEquipmentRoomGeneralChange('coolingMethod', e.target.value)}
                        />
                        <TableInputRow
                          label="Cooling Rating"
                          name="coolingRating"
                          value={equipmentRoomGeneral.coolingRating}
                          onChange={(e) => handleEquipmentRoomGeneralChange('coolingRating', e.target.value)}
                        />
                        <TableInputRow
                          label="Room Temperature"
                          name="roomTemperature"
                          value={equipmentRoomGeneral.roomTemperature}
                          onChange={(e) => handleEquipmentRoomGeneralChange('roomTemperature', e.target.value)}
                        />
                        <TableInputRow
                          label="Equipment Room Condition"
                          name="equipmentRoomCondition"
                          value={equipmentRoomGeneral.equipmentRoomCondition}
                          onChange={(e) => handleEquipmentRoomGeneralChange('equipmentRoomCondition', e.target.value)}
                        />
                      </tbody>
                    </table>
                  </div>
                  
                  <h3 className="text-2xl font-semibold text-center my-6">3.2. CABINET SPACE PLANNING</h3>
                  
                  <div className="mb-4">
                    <Label htmlFor="roomLayoutDrawing" className="block text-sm font-medium text-gray-700 mb-2">
                      Room Layout Drawing (Prior to site visit, Eskom will supply PDF version, as available). OEM to printout copies and bring to site). Red-lined scanned version to be attached to the site survey report.
                    </Label>
                    <p className="text-sm text-gray-500 mb-2">
                      Where no Room Layout drawing available, a free hand drawing (not to scale) to be provided by the OEM
                    </p>
                    <Textarea
                      id="roomLayoutDrawing"
                      value={cabinetSpacePlanning.roomLayoutDrawing}
                      onChange={(e) => handleCabinetSpacePlanningChange('roomLayoutDrawing', e.target.value)}
                      className="min-h-[300px] resize-y"
                      placeholder="Please add your room layout drawing notes here..."
                    />
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
              <div className="space-x-3">
                <Button type="button" variant="outline" onClick={handleSaveForLater} className="flex items-center">
                  <Save className="mr-2 h-4 w-4" /> Save for Later
                </Button>
                <Button type="submit" className="flex items-center bg-akhanya hover:bg-akhanya-dark">
                  Submit Survey <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
};

export default EskomSiteSurveyForm;
