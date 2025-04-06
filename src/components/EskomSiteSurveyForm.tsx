
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
import { Save, MapPin, ChevronRight, ChevronLeft, PlusCircle, Trash2 } from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import DrawingCanvas from "./DrawingCanvas";

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
  roomLayoutDrawings: string[];
  roomLayoutImages: string[];
  numberOfRouters: number;
  redlineDrawing: string; // Added for redline drawing
}

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

interface EskomSiteSurveyFormProps {
  showAIRecommendations?: boolean;
}

const EskomSiteSurveyForm: React.FC<EskomSiteSurveyFormProps> = ({ showAIRecommendations = false }) => {
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
    roomLayoutDrawings: [""],
    roomLayoutImages: [""],
    numberOfRouters: 0,
    redlineDrawing: "" // Added for redline drawing
  });
  
  // Current drawing canvas index
  const [currentDrawingIndex, setCurrentDrawingIndex] = useState(0);
  
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

  // Handle redlining drawing save
  const handleRedlineDrawingSave = (dataUrl: string) => {
    setCabinetSpacePlanning({
      ...cabinetSpacePlanning,
      redlineDrawing: dataUrl
    });
    
    toast({
      title: "Redline drawing saved",
      description: "Your redline drawing has been saved."
    });
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
  const handleCabinetSpacePlanningChange = (field: keyof CabinetSpacePlanning, value: string | number | string[]) => {
    setCabinetSpacePlanning({
      ...cabinetSpacePlanning,
      [field]: value
    });
  };

  // Handle room layout drawing image save
  const handleRoomLayoutImageSave = (dataUrl: string) => {
    const updatedImages = [...cabinetSpacePlanning.roomLayoutImages];
    updatedImages[currentDrawingIndex] = dataUrl;
    
    setCabinetSpacePlanning({
      ...cabinetSpacePlanning,
      roomLayoutImages: updatedImages
    });
    
    toast({
      title: "Drawing saved",
      description: `Room layout drawing #${currentDrawingIndex + 1} has been saved.`,
    });
  };

  // Add a new drawing canvas
  const addNewDrawing = () => {
    const updatedImages = [...cabinetSpacePlanning.roomLayoutImages, ""];
    const updatedDrawings = [...cabinetSpacePlanning.roomLayoutDrawings, ""];
    
    setCabinetSpacePlanning({
      ...cabinetSpacePlanning,
      roomLayoutImages: updatedImages,
      roomLayoutDrawings: updatedDrawings
    });
    
    // Set the current drawing index to the new one
    setCurrentDrawingIndex(updatedImages.length - 1);
    
    toast({
      title: "New drawing added",
      description: `Drawing #${updatedImages.length} added. You can now create a new drawing.`,
    });
  };

  // Remove a drawing
  const removeDrawing = (index: number) => {
    if (cabinetSpacePlanning.roomLayoutImages.length <= 1) {
      toast({
        title: "Cannot remove",
        description: "You must have at least one drawing.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedImages = [...cabinetSpacePlanning.roomLayoutImages];
    const updatedDrawings = [...cabinetSpacePlanning.roomLayoutDrawings];
    
    updatedImages.splice(index, 1);
    updatedDrawings.splice(index, 1);
    
    setCabinetSpacePlanning({
      ...cabinetSpacePlanning,
      roomLayoutImages: updatedImages,
      roomLayoutDrawings: updatedDrawings
    });
    
    // Adjust current drawing index if needed
    if (currentDrawingIndex >= updatedImages.length) {
      setCurrentDrawingIndex(updatedImages.length - 1);
    }
    
    toast({
      title: "Drawing removed",
      description: `Drawing #${index + 1} has been removed.`,
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
                      onImageCaptured={handleBuildingPhotoUpload} 
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
                  
                  <h3 className="text-2xl font-semibold text-center mb-6">2. EQUIPMENT LOCATION</h3>
                  
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
                          <td className="border border-gray-300 p-2 font-medium">Building Name</td>
                          <td className="border border-gray-300 p-1">
                            <Input 
                              type="text" 
                              value={equipmentLocation.buildingName}
                              onChange={(e) => handleEquipmentLocationChange('buildingName', e.target.value)}
                              className="border-0 focus-visible:ring-0 h-full w-full"
                              placeholder="Building Name"
                            />
                          </td>
                        </tr>
                        <tr className="border border-gray-300">
                          <td className="border border-gray-300 p-2 font-medium">Building Type</td>
                          <td className="border border-gray-300 p-1">
                            <Input 
                              type="text" 
                              value={equipmentLocation.buildingType}
                              onChange={(e) => handleEquipmentLocationChange('buildingType', e.target.value)}
                              className="border-0 focus-visible:ring-0 h-full w-full"
                              placeholder="Building Type"
                            />
                          </td>
                        </tr>
                        <tr className="border border-gray-300">
                          <td className="border border-gray-300 p-2 font-medium">Floor Level</td>
                          <td className="border border-gray-300 p-1">
                            <Input 
                              type="text" 
                              value={equipmentLocation.floorLevel}
                              onChange={(e) => handleEquipmentLocationChange('floorLevel', e.target.value)}
                              className="border-0 focus-visible:ring-0 h-full w-full"
                              placeholder="Floor Level"
                            />
                          </td>
                        </tr>
                        <tr className="border border-gray-300">
                          <td className="border border-gray-300 p-2 font-medium">Room Number</td>
                          <td className="border border-gray-300 p-1">
                            <Input 
                              type="text" 
                              value={equipmentLocation.roomNumber}
                              onChange={(e) => handleEquipmentLocationChange('roomNumber', e.target.value)}
                              className="border-0 focus-visible:ring-0 h-full w-full"
                              placeholder="Room Number"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <h3 className="text-xl font-semibold mt-8 mb-4">3. ACCESS PROCEDURE</h3>
                  
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
                          <td className="border border-gray-300 p-2 font-medium">Requirements</td>
                          <td className="border border-gray-300 p-1">
                            <Textarea 
                              value={accessProcedure.requirements}
                              onChange={(e) => handleAccessProcedureChange('requirements', e.target.value)}
                              className="border-0 focus-visible:ring-0 h-full w-full min-h-[100px]"
                              placeholder="Describe access requirements..."
                            />
                          </td>
                        </tr>
                        <tr className="border border-gray-300">
                          <td className="border border-gray-300 p-2 font-medium">Security Requirements</td>
                          <td className="border border-gray-300 p-1">
                            <Textarea 
                              value={accessProcedure.securityRequirements}
                              onChange={(e) => handleAccessProcedureChange('securityRequirements', e.target.value)}
                              className="border-0 focus-visible:ring-0 h-full w-full min-h-[100px]"
                              placeholder="Describe security requirements..."
                            />
                          </td>
                        </tr>
                        <tr className="border border-gray-300">
                          <td className="border border-gray-300 p-2 font-medium">Type of Vehicle Required</td>
                          <td className="border border-gray-300 p-1">
                            <Input 
                              type="text" 
                              value={accessProcedure.vehicleType}
                              onChange={(e) => handleAccessProcedureChange('vehicleType', e.target.value)}
                              className="border-0 focus-visible:ring-0 h-full w-full"
                              placeholder="Vehicle Type"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <h3 className="text-xl font-semibold mt-8 mb-4">4. SITE OWNER CONTACTS</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 p-2 text-left">Name</th>
                          <th className="border border-gray-300 p-2 text-left">Cellphone</th>
                          <th className="border border-gray-300 p-2 text-left">Email</th>
                        </tr>
                      </thead>
                      <tbody>
                        {siteOwnerContacts.map((contact, index) => (
                          <tr key={index} className="border border-gray-300">
                            <td className="border border-gray-300 p-1">
                              <Input
                                type="text"
                                value={contact.name}
                                onChange={(e) => handleSiteOwnerContactChange(index, 'name', e.target.value)}
                                className="border-0 focus-visible:ring-0 h-full w-full"
                                placeholder="Name"
                              />
                            </td>
                            <td className="border border-gray-300 p-1">
                              <Input
                                type="tel"
                                value={contact.cellphone}
                                onChange={(e) => handleSiteOwnerContactChange(index, 'cellphone', e.target.value)}
                                className="border-0 focus-visible:ring-0 h-full w-full"
                                placeholder="Cellphone"
                              />
                            </td>
                            <td className="border border-gray-300 p-1">
                              <Input
                                type="email"
                                value={contact.email}
                                onChange={(e) => handleSiteOwnerContactChange(index, 'email', e.target.value)}
                                className="border-0 focus-visible:ring-0 h-full w-full"
                                placeholder="Email"
                              />
                            </td>
                          </tr>
                        ))}
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
                  
                  <h3 className="text-2xl font-semibold text-center mb-6">5. EQUIPMENT ROOM (GENERAL)</h3>
                  
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
                          <td className="border border-gray-300 p-2 font-medium">Cable Access Routes</td>
                          <td className="border border-gray-300 p-1">
                            <Textarea 
                              value={equipmentRoomGeneral.cableAccess}
                              onChange={(e) => handleEquipmentRoomGeneralChange('cableAccess', e.target.value)}
                              className="border-0 focus-visible:ring-0 h-full w-full min-h-[100px]"
                              placeholder="Describe cable access routes..."
                            />
                          </td>
                        </tr>
                        <tr className="border border-gray-300">
                          <td className="border border-gray-300 p-2 font-medium">Room Lighting</td>
                          <td className="border border-gray-300 p-1">
                            <Input 
                              type="text" 
                              value={equipmentRoomGeneral.roomLighting}
                              onChange={(e) => handleEquipmentRoomGeneralChange('roomLighting', e.target.value)}
                              className="border-0 focus-visible:ring-0 h-full w-full"
                              placeholder="Room lighting details"
                            />
                          </td>
                        </tr>
                        <tr className="border border-gray-300">
                          <td className="border border-gray-300 p-2 font-medium">Fire Protection</td>
                          <td className="border border-gray-300 p-1">
                            <Input 
                              type="text" 
                              value={equipmentRoomGeneral.fireProtection}
                              onChange={(e) => handleEquipmentRoomGeneralChange('fireProtection', e.target.value)}
                              className="border-0 focus-visible:ring-0 h-full w-full"
                              placeholder="Fire protection details"
                            />
                          </td>
                        </tr>
                        <tr className="border border-gray-300">
                          <td className="border border-gray-300 p-2 font-medium">Cooling Method</td>
                          <td className="border border-gray-300 p-1">
                            <Input 
                              type="text" 
                              value={equipmentRoomGeneral.coolingMethod}
                              onChange={(e) => handleEquipmentRoomGeneralChange('coolingMethod', e.target.value)}
                              className="border-0 focus-visible:ring-0 h-full w-full"
                              placeholder="Cooling method"
                            />
                          </td>
                        </tr>
                        <tr className="border border-gray-300">
                          <td className="border border-gray-300 p-2 font-medium">Cooling Rating (BTU)</td>
                          <td className="border border-gray-300 p-1">
                            <Input 
                              type="text" 
                              value={equipmentRoomGeneral.coolingRating}
                              onChange={(e) => handleEquipmentRoomGeneralChange('coolingRating', e.target.value)}
                              className="border-0 focus-visible:ring-0 h-full w-full"
                              placeholder="Cooling rating"
                            />
                          </td>
                        </tr>
                        <tr className="border border-gray-300">
                          <td className="border border-gray-300 p-2 font-medium">Room Temperature</td>
                          <td className="border border-gray-300 p-1">
                            <Input 
                              type="text" 
                              value={equipmentRoomGeneral.roomTemperature}
                              onChange={(e) => handleEquipmentRoomGeneralChange('roomTemperature', e.target.value)}
                              className="border-0 focus-visible:ring-0 h-full w-full"
                              placeholder="Room temperature"
                            />
                          </td>
                        </tr>
                        <tr className="border border-gray-300">
                          <td className="border border-gray-300 p-2 font-medium">Equipment Room Condition</td>
                          <td className="border border-gray-300 p-1">
                            <Textarea 
                              value={equipmentRoomGeneral.equipmentRoomCondition}
                              onChange={(e) => handleEquipmentRoomGeneralChange('equipmentRoomCondition', e.target.value)}
                              className="border-0 focus-visible:ring-0 h-full w-full min-h-[100px]"
                              placeholder="Describe equipment room condition..."
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <h3 className="text-xl font-semibold mt-8 mb-4">6. EQUIPMENT CABINET SPACE PLANNING</h3>
                  
                  <div className="mb-4">
                    <Label htmlFor="numberOfRouters" className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Routers
                    </Label>
                    <Input
                      type="number"
                      id="numberOfRouters"
                      value={cabinetSpacePlanning.numberOfRouters}
                      onChange={(e) => handleCabinetSpacePlanningChange('numberOfRouters', parseInt(e.target.value) || 0)}
                      className="shadow-sm focus:ring-akhanya focus:border-akhanya block w-full sm:text-sm border-gray-300 rounded-md"
                      min="0"
                    />
                  </div>
                  
                  <div className="mb-8">
                    <Label className="block text-sm font-medium text-gray-700 mb-2">
                      Room Layout Drawing
                    </Label>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex space-x-2">
                        {cabinetSpacePlanning.roomLayoutImages.map((_, index) => (
                          <Button
                            key={index}
                            type="button"
                            variant={currentDrawingIndex === index ? "default" : "outline"}
                            onClick={() => setCurrentDrawingIndex(index)}
                            size="sm"
                          >
                            Drawing {index + 1}
                          </Button>
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          type="button"
                          size="sm"
                          onClick={addNewDrawing}
                          className="flex items-center"
                        >
                          <PlusCircle className="h-4 w-4 mr-1" /> Add Drawing
                        </Button>
                        {cabinetSpacePlanning.roomLayoutImages.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeDrawing(currentDrawingIndex)}
                            className="flex items-center text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4 mr-1" /> Remove
                          </Button>
                        )}
                      </div>
                    </div>
                    <DrawingCanvas 
                      onSave={handleRoomLayoutImageSave}
                      initialValue={cabinetSpacePlanning.roomLayoutImages[currentDrawingIndex]}
                    />
                  </div>

                  <div className="mt-8 mb-8">
                    <Label className="block text-lg font-semibold text-gray-700 mb-2">
                      Please red-line Room Layout Drawing to indicate:
                    </Label>
                    <ul className="list-disc pl-5 mb-4 text-sm text-gray-600">
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
                    <DrawingCanvas 
                      onSave={handleRedlineDrawingSave}
                      initialValue={cabinetSpacePlanning.redlineDrawing}
                    />
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">13. APPROVAL</h3>
                    
                    <div className="mb-6">
                      <h4 className="font-medium mb-2">OEM Contractor:</h4>
                      <div className="flex flex-col space-y-4">
                        <div className="flex space-x-4">
                          <div className="flex-1">
                            <Label htmlFor="oemContractorName" className="text-sm">Name</Label>
                            <Input
                              id="oemContractorName"
                              value={oemContractor.name}
                              onChange={(e) => handleApprovalChange('oemContractor', 'name', e.target.value)}
                              className="mt-1"
                            />
                          </div>
                          <div className="flex-1">
                            <Label htmlFor="oemContractorSignature" className="text-sm">Signature</Label>
                            <Input
                              id="oemContractorSignature"
                              value={oemContractor.signature}
                              onChange={(e) => handleApprovalChange('oemContractor', 'signature', e.target.value)}
                              className="mt-1"
                            />
                          </div>
                          <div className="w-32">
                            <Label htmlFor="oemContractorDate" className="text-sm">Date</Label>
                            <Input
                              id="oemContractorDate"
                              type="date"
                              value={oemContractor.date}
                              onChange={(e) => handleApprovalChange('oemContractor', 'date', e.target.value)}
                              className="mt-1"
                            />
                          </div>
                        </div>
                        <div className="flex space-x-4 items-center">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="oemContractorAccepted"
                              checked={oemContractor.accepted}
                              onCheckedChange={(checked) => handleApprovalChange('oemContractor', 'accepted', !!checked)}
                            />
                            <label
                              htmlFor="oemContractorAccepted"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Accepted
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="oemContractorRejected"
                              checked={oemContractor.rejected}
                              onCheckedChange={(checked) => handleApprovalChange('oemContractor', 'rejected', !!checked)}
                            />
                            <label
                              htmlFor="oemContractorRejected"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Rejected
                            </label>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="oemContractorComments" className="text-sm">Comments</Label>
                          <Textarea
                            id="oemContractorComments"
                            value={oemContractor.comments}
                            onChange={(e) => handleApprovalChange('oemContractor', 'comments', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="font-medium mb-2">OEM Engineer:</h4>
                      <div className="flex flex-col space-y-4">
                        <div className="flex space-x-4">
                          <div className="flex-1">
                            <Label htmlFor="oemEngineerName" className="text-sm">Name</Label>
                            <Input
                              id="oemEngineerName"
                              value={oemEngineer.name}
                              onChange={(e) => handleApprovalChange('oemEngineer', 'name', e.target.value)}
                              className="mt-1"
                            />
                          </div>
                          <div className="flex-1">
                            <Label htmlFor="oemEngineerSignature" className="text-sm">Signature</Label>
                            <Input
                              id="oemEngineerSignature"
                              value={oemEngineer.signature}
                              onChange={(e) => handleApprovalChange('oemEngineer', 'signature', e.target.value)}
                              className="mt-1"
                            />
                          </div>
                          <div className="w-32">
                            <Label htmlFor="oemEngineerDate" className="text-sm">Date</Label>
                            <Input
                              id="oemEngineerDate"
                              type="date"
                              value={oemEngineer.date}
                              onChange={(e) => handleApprovalChange('oemEngineer', 'date', e.target.value)}
                              className="mt-1"
                            />
                          </div>
                        </div>
                        <div className="flex space-x-4 items-center">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="oemEngineerAccepted"
                              checked={oemEngineer.accepted}
                              onCheckedChange={(checked) => handleApprovalChange('oemEngineer', 'accepted', !!checked)}
                            />
                            <label
                              htmlFor="oemEngineerAccepted"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Accepted
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="oemEngineerRejected"
                              checked={oemEngineer.rejected}
                              onCheckedChange={(checked) => handleApprovalChange('oemEngineer', 'rejected', !!checked)}
                            />
                            <label
                              htmlFor="oemEngineerRejected"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Rejected
                            </label>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="oemEngineerComments" className="text-sm">Comments</Label>
                          <Textarea
                            id="oemEngineerComments"
                            value={oemEngineer.comments}
                            onChange={(e) => handleApprovalChange('oemEngineer', 'comments', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="font-medium mb-2">Eskom Representative:</h4>
                      <div className="flex flex-col space-y-4">
                        <div className="flex space-x-4">
                          <div className="flex-1">
                            <Label htmlFor="eskomRepName" className="text-sm">Name</Label>
                            <Input
                              id="eskomRepName"
                              value={eskomRepresentative.name}
                              onChange={(e) => handleApprovalChange('eskomRepresentative', 'name', e.target.value)}
                              className="mt-1"
                            />
                          </div>
                          <div className="flex-1">
                            <Label htmlFor="eskomRepSignature" className="text-sm">Signature</Label>
                            <Input
                              id="eskomRepSignature"
                              value={eskomRepresentative.signature}
                              onChange={(e) => handleApprovalChange('eskomRepresentative', 'signature', e.target.value)}
                              className="mt-1"
                            />
                          </div>
                          <div className="w-32">
                            <Label htmlFor="eskomRepDate" className="text-sm">Date</Label>
                            <Input
                              id="eskomRepDate"
                              type="date"
                              value={eskomRepresentative.date}
                              onChange={(e) => handleApprovalChange('eskomRepresentative', 'date', e.target.value)}
                              className="mt-1"
                            />
                          </div>
                        </div>
                        <div className="flex space-x-4 items-center">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="eskomRepAccepted"
                              checked={eskomRepresentative.accepted}
                              onCheckedChange={(checked) => handleApprovalChange('eskomRepresentative', 'accepted', !!checked)}
                            />
                            <label
                              htmlFor="eskomRepAccepted"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Accepted
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="eskomRepRejected"
                              checked={eskomRepresentative.rejected}
                              onCheckedChange={(checked) => handleApprovalChange('eskomRepresentative', 'rejected', !!checked)}
                            />
                            <label
                              htmlFor="eskomRepRejected"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Rejected
                            </label>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="eskomRepComments" className="text-sm">Comments</Label>
                          <Textarea
                            id="eskomRepComments"
                            value={eskomRepresentative.comments}
                            onChange={(e) => handleApprovalChange('eskomRepresentative', 'comments', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right mt-4">
                    <p className="text-sm text-gray-500">Page 17 of 17</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-between mt-4">
              <Button type="button" onClick={prevTab} className="flex items-center">
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <div className="flex space-x-3">
                <Button type="button" variant="outline" onClick={handleSaveForLater} className="flex items-center">
                  <Save className="mr-2 h-4 w-4" /> Save for Later
                </Button>
                <Button type="submit" className="bg-akhanya hover:bg-akhanya-dark">Submit Survey</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
};

export default EskomSiteSurveyForm;
