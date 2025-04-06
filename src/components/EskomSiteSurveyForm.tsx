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
import { Tabs, TabsList, TabsTrigger, TabsContent, TabsListVertical } from "@/components/ui/tabs";
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

interface SiteAttendee {
  date: string;
  name: string;
  company: string;
  department: string;
  cellphone: string;
}

interface ApprovalSection {
  name: string;
  signature: string;
  date: string;
  accepted: boolean;
  rejected: boolean;
  comments: string;
}

interface EquipmentLocation {
  buildingName: string;
  buildingType: string;
  floorLevel: string;
  roomNumber: string;
}

interface AccessProcedure {
  requirements: string;
  securityRequirements: string;
  vehicleType: string;
}

interface SiteOwnerContact {
  name: string;
  cellphone: string;
  email: string;
}

interface EquipmentRoomGeneral {
  cableAccess: string;
  roomLighting: string;
  fireProtection: string;
  coolingMethod: string;
  coolingRating: string;
  roomTemperature: string;
  equipmentRoomCondition: string;
}

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
  
  const [siteId, setSiteId] = useState("");
  const [siteType, setSiteType] = useState("");
  const [address, setAddress] = useState("");
  const [gpsCoordinates, setGpsCoordinates] = useState("");
  const [engineerId, setEngineerId] = useState("");
  
  const [attendees, setAttendees] = useState<SiteAttendee[]>([
    { date: "", name: "", company: "", department: "", cellphone: "" },
    { date: "", name: "", company: "", department: "", cellphone: "" },
    { date: "", name: "", company: "", department: "", cellphone: "" },
    { date: "", name: "", company: "", department: "", cellphone: "" },
    { date: "", name: "", company: "", department: "", cellphone: "" },
    { date: "", name: "", company: "", department: "", cellphone: "" },
  ]);
  
  const [equipmentLocation, setEquipmentLocation] = useState<EquipmentLocation>({
    buildingName: "",
    buildingType: "",
    floorLevel: "",
    roomNumber: ""
  });

  const [accessProcedure, setAccessProcedure] = useState<AccessProcedure>({
    requirements: "",
    securityRequirements: "",
    vehicleType: ""
  });

  const [siteOwnerContacts, setSiteOwnerContacts] = useState<SiteOwnerContact[]>([
    { name: "", cellphone: "", email: "" },
    { name: "", cellphone: "", email: "" },
    { name: "", cellphone: "", email: "" }
  ]);
  
  const [equipmentRoomGeneral, setEquipmentRoomGeneral] = useState<EquipmentRoomGeneral>({
    cableAccess: "",
    roomLighting: "",
    fireProtection: "",
    coolingMethod: "",
    coolingRating: "",
    roomTemperature: "",
    equipmentRoomCondition: ""
  });
  
  const [cabinetSpacePlanning, setCabinetSpacePlanning] = useState<CabinetSpacePlanning>({
    roomLayoutDrawing: "",
    numberOfRouters: 0,
    roomLayoutMarkup: ""
  });
  
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
  
  const { latitude, longitude, loading, error, retry, address: geoAddress } = useGeolocation();
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setEngineerId(data.user.id);
      }
    };
    
    getUser();
  }, []);

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      setGpsCoordinates(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
      
      if (geoAddress && !address) {
        setAddress(geoAddress);
      }
    }
  }, [latitude, longitude, geoAddress]);

  useEffect(() => {
    if (!date) {
      const today = new Date().toISOString().split('T')[0];
      setDate(today);
    }
  }, [date]);

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

  const handleEquipmentLocationChange = (field: keyof EquipmentLocation, value: string) => {
    setEquipmentLocation({
      ...equipmentLocation,
      [field]: value
    });
  };

  const handleAccessProcedureChange = (field: keyof AccessProcedure, value: string) => {
    setAccessProcedure({
      ...accessProcedure,
      [field]: value
    });
  };

  const handleEquipmentRoomGeneralChange = (field: keyof EquipmentRoomGeneral, value: string) => {
    setEquipmentRoomGeneral({
      ...equipmentRoomGeneral,
      [field]: value
    });
  };

  const handleCabinetSpacePlanningChange = (field: keyof CabinetSpacePlanning, value: string | number) => {
    setCabinetSpacePlanning({
      ...cabinetSpacePlanning,
      [field]: value
    });
  };

  const handleSiteOwnerContactChange = (index: number, field: keyof SiteOwnerContact, value: string) => {
    const updatedContacts = [...siteOwnerContacts];
    updatedContacts[index] = {
      ...updatedContacts[index],
      [field]: value
    };
    setSiteOwnerContacts(updatedContacts);
  };

  const handleAttendeeChange = (index: number, field: keyof SiteAttendee, value: string) => {
    const updatedAttendees = [...attendees];
    updatedAttendees[index] = {
      ...updatedAttendees[index],
      [field]: value
    };
    setAttendees(updatedAttendees);
  };

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
    } else if (currentTab === "equipment-room") {
      setCurrentTab("site-records");
    } else if (currentTab === "site-records") {
      setCurrentTab("network-integration");
    } else if (currentTab === "network-integration") {
      setCurrentTab("power-supply");
    } else if (currentTab === "power-supply") {
      setCurrentTab("optical-fiber");
    } else if (currentTab === "optical-fiber") {
      setCurrentTab("earthing");
    } else if (currentTab === "earthing") {
      setCurrentTab("installation-materials");
    } else if (currentTab === "installation-materials") {
      setCurrentTab("approval");
    }
  };

  const prevTab = () => {
    if (currentTab === "approval") {
      setCurrentTab("installation-materials");
    } else if (currentTab === "installation-materials") {
      setCurrentTab("earthing");
    } else if (currentTab === "earthing") {
      setCurrentTab("optical-fiber");
    } else if (currentTab === "optical-fiber") {
      setCurrentTab("power-supply");
    } else if (currentTab === "power-supply") {
      setCurrentTab("network-integration");
    } else if (currentTab === "network-integration") {
      setCurrentTab("site-records");
    } else if (currentTab === "site-records") {
      setCurrentTab("equipment-room");
    } else if (currentTab === "equipment-room") {
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
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/4 lg:w-1/5">
              <TabsListVertical className="sticky top-4 w-full border rounded-lg bg-white shadow-sm">
                <div className="w-full bg-akhanya text-white py-2 px-3 rounded-t-lg font-medium text-center">
                  Survey Sections
                </div>
                <TabsTrigger value="cover" className="w-full justify-start text-left">
                  <div className="flex items-center gap-2">
                    <div className="bg-akhanya text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">1</div>
                    <span className="truncate">Cover Page</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="attendees" className="w-full justify-start text-left">
                  <div className="flex items-center gap-2">
                    <div className="bg-akhanya text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">2</div>
                    <span className="truncate">Attendees</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="contents" className="w-full justify-start text-left">
                  <div className="flex items-center gap-2">
                    <div className="bg-akhanya text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">3</div>
                    <span className="truncate">Contents</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="site-info" className="w-full justify-start text-left">
                  <div className="flex items-center gap-2">
                    <div className="bg-akhanya text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">4</div>
                    <span className="truncate">Site Info</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="equipment-details" className="w-full justify-start text-left">
                  <div className="flex items-center gap-2">
                    <div className="bg-akhanya text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">5</div>
                    <span className="truncate">Equipment</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="equipment-room" className="w-full justify-start text-left">
                  <div className="flex items-center gap-2">
                    <div className="bg-akhanya text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">6</div>
                    <span className="truncate">Room Details</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="site-records" className="w-full justify-start text-left">
                  <div className="flex items-center gap-2">
                    <div className="bg-akhanya text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">7</div>
                    <span className="truncate">Site Records</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="network-integration" className="w-full justify-start text-left">
                  <div className="flex items-center gap-2">
                    <div className="bg-akhanya text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">8</div>
                    <span className="truncate">Network Integration</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="power-supply" className="w-full justify-start text-left">
                  <div className="flex items-center gap-2">
                    <div className="bg-akhanya text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">9</div>
                    <span className="truncate">Power Supply</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="optical-fiber" className="w-full justify-start text-left">
                  <div className="flex items-center gap-2">
                    <div className="bg-akhanya text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">10</div>
                    <span className="truncate">Optical Fiber</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="earthing" className="w-full justify-start text-left">
                  <div className="flex items-center gap-2">
                    <div className="bg-akhanya text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">11</div>
                    <span className="truncate">Earthing</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="installation-materials" className="w-full justify-start text-left">
                  <div className="flex items-center gap-2">
                    <div className="bg-akhanya text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">12</div>
                    <span className="truncate">Installation Materials</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="approval" className="w-full justify-start text-left">
                  <div className="flex items-center gap-2">
                    <div className="bg-akhanya text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">13</div>
                    <span className="truncate">Approval</span>
                  </div>
                </TabsTrigger>
              </TabsListVertical>
              
              <div className="mt-4 space-y-2 hidden md:block">
                <Button type="button" onClick={handleSaveForLater} variant="outline" className="w-full flex items-center gap-1">
                  <Save className="h-4 w-4" /> Save Draft
                </Button>
                <Button type="submit" className="w-full">Submit Survey</Button>
              </div>
            </div>
            
            <div className="md:w-3/4 lg:w-4/5">
              <TabsContent value="cover" className="mt-0">
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
                      
                      <h3 className="text-2xl font-semibold text-center mb-6">1. COVER PAGE</h3>
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
                                Site Name
                              </td>
                              <td className="border border-gray-300 p-1">
                                <Input 
                                  type="text" 
                                  name="siteName" 
                                  value={siteName} 
                                  onChange={handleInputChange}
                                  className="border-0 focus-visible:ring-0 h-full w-full"
                                />
                              </td>
                            </tr>
                            <tr className="border border-gray-300">
                              <td className="border border-gray-300 p-2 font-medium">
                                Region
                              </td>
                              <td className="border border-gray-300 p-1">
                                <Input 
                                  type="text" 
                                  name="region" 
                                  value={region} 
                                  onChange={handleInputChange}
                                  className="border-0 focus-visible:ring-0 h-full w-full"
                                />
                              </td>
                            </tr>
                            <tr className="border border-gray-300">
                              <td className="border border-gray-300 p-2 font-medium">
                                Date
                              </td>
                              <td className="border border-gray-300 p-1">
                                <Input 
                                  type="text" 
                                  name="date" 
                                  value={date} 
                                  onChange={handleInputChange}
                                  className="border-0 focus-visible:ring-0 h-full w-full"
                                />
                              </td>
                            </tr>
                            <tr className="border border-gray-300">
                              <td className="border border-gray-300 p-2 font-medium">
                                Building Photo
                              </td>
                              <td className="border border-gray-300 p-1">
                                <Input 
                                  type="text" 
                                  name="buildingPhoto" 
                                  value={buildingPhoto} 
                                  onChange={handleInputChange}
                                  className="border-0 focus-visible:ring-0 h-full w-full"
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="attendees" className="mt-0">
                <Card>
                  <CardContent className="pt-6">
                    <div className="mb-8">
                      <h3 className="text-2xl font-semibold text-center mb-6">2. SITE VISIT ATTENDEES</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="border border-gray-300 p-2 text-left w-1/3">Subject</th>
                              <th className="border border-gray-300 p-2 text-left w-2/3">Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            {attendees.map((attendee, index) => (
                              <tr key={index} className="border border-gray-300">
                                <td className="border border-gray-300 p-2 font-medium">
                                  Date
                                </td>
                                <td className="border border-gray-300 p-1">
                                  <Input 
                                    type="text" 
                                    name={`attendees[${index}].date`} 
                                    value={attendee.date} 
                                    onChange={(e) => handleAttendeeChange(index, "date", e.target.value)}
                                    className="border-0 focus-visible:ring-0 h-full w-full"
                                  />
                                </td>
                                <td className="border border-gray-300 p-2 font-medium">
                                  Name
                                </td>
                                <td className="border border-gray-300 p-1">
                                  <Input 
                                    type="text" 
                                    name={`attendees[${index}].name`} 
                                    value={attendee.name} 
                                    onChange={(e) => handleAttendeeChange(index, "name", e.target.value)}
                                    className="border-0 focus-visible:ring-0 h-full w-full"
                                  />
                                </td>
                                <td className="border border-gray-300 p-2 font-medium">
                                  Company
                                </td>
                                <td className="border border-gray-300 p-1">
                                  <Input 
                                    type="text" 
                                    name={`attendees[${index}].company`} 
                                    value={attendee.company} 
                                    onChange={(e) => handleAttendeeChange(index, "company", e.target.value)}
                                    className="border-0 focus-visible:ring-0 h-full w-full"
                                  />
                                </td>
                                <td className="border border-gray-300 p-2 font-medium">
                                  Department
                                </td>
                                <td className="border border-gray-300 p-1">
                                  <Input 
                                    type="text" 
                                    name={`attendees[${index}].department`} 
                                    value={attendee.department} 
                                    onChange={(e) => handleAttendeeChange(index, "department", e.target.value)}
                                    className="border-0 focus-visible:ring-0 h-full w-full"
                                  />
                                </td>
                                <td className="border border-gray-300 p-2 font-medium">
                                  Cellphone
                                </td>
                                <td className="border border-gray-300 p-1">
                                  <Input 
                                    type="text" 
                                    name={`attendees[${index}].cellphone`} 
                                    value={attendee.cellphone} 
                                    onChange={(e) => handleAttendeeChange(index, "cellphone", e.target.value)}
                                    className="border-0 focus-visible:ring-0 h-full w-full"
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="contents" className="mt-0">
                <Card>
                  <CardContent className="pt-6">
                    <div className="mb-8">
                      <h3 className="text-2xl font-semibold text-center mb-6">3. CONTENTS</h3>
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
                                Site ID
                              </td>
                              <td className="border border-gray-300 p-1">
                                <Input 
                                  type="text" 
                                  name="siteId" 
                                  value={siteId} 
                                  onChange={handleInputChange}
                                  className="border-0 focus-visible:ring-0 h-full w-full"
                                />
                              </td>
                            </tr>
                            <tr className="border border-gray-300">
                              <td className="border border-gray-300 p-2 font-medium">
                                Site Type
                              </td>
                              <td className="border border-gray-300 p-1">
                                <Input 
                                  type="text" 
                                  name="siteType" 
                                  value={siteType} 
                                  onChange={handleInputChange}
                                  className="border-0 focus-visible:ring-0 h-full w-full"
                                />
                              </td>
                            </tr>
                            <tr className="border border-gray-300">
                              <td className="border border-gray-300 p-2 font-medium">
                                Address
                              </td>
                              <td className="border border-gray-300 p-1">
                                <Input 
                                  type="text" 
                                  name="address" 
                                  value={address} 
                                  onChange={handleInputChange}
                                  className="border-0 focus-visible:ring-0 h-full w-full"
                                />
                              </td>
                            </tr>
                            <tr className="border border-gray-300">
                              <td className="border border-gray-300 p-2 font-medium">
                                GPS Coordinates
                              </td>
                              <td className="border border-gray-300 p-1">
                                <Input 
                                  type="text" 
                                  name="gpsCoordinates" 
                                  value={gpsCoordinates} 
                                  onChange={handleInputChange}
                                  className="border-0 focus-visible:ring-0 h-full w-full"
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="site-info" className="mt-0">
                <Card>
                  <CardContent className="pt-6">
                    <div className="mb-8">
                      <h3 className="text-2xl font-semibold text-center mb-6">4. SITE INFO</h3>
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
                                Building Name
                              </td>
                              <td className="border border-gray-300 p-1">
                                <Input 
                                  type="text" 
                                  name="equipmentLocation.buildingName" 
                                  value={equipmentLocation.buildingName} 
                                  onChange={(e) => handleEquipmentLocationChange('buildingName', e.target.value)}
                                  className="border-0 focus-visible:ring-0 h-full w-full"
                                />
                              </td>
                            </tr>
                            <tr className="border border-gray-300">
                              <td className="border border-gray-300 p-2 font-medium">
                                Building Type
                              </td>
                              <td className="border border-gray-300 p-1">
                                <Input 
                                  type="text" 
                                  name="equipmentLocation.buildingType" 
                                  value={equipmentLocation.buildingType} 
                                  onChange={(e) => handleEquipmentLocationChange('buildingType', e.target.value)}
                                  className="border-0 focus-visible:ring-0 h-full w-full"
                                />
                              </td>
                            </tr>
                            <tr className="border border-gray-300">
                              <td className="border border-gray-300 p-2 font-medium">
                                Floor Level
                              </td>
                              <td className="border border-gray-300 p-1">
                                <Input 
                                  type="text" 
                                  name="equipmentLocation.floorLevel" 
                                  value={equipmentLocation.floorLevel} 
                                  onChange={(e) => handleEquipmentLocationChange('floorLevel', e.target.value)}
                                  className="border-0 focus-visible:ring-0 h-full w-full"
                                />
                              </td>
                            </tr>
                            <tr className="border border-gray-300">
                              <td className="border border-gray-300 p-2 font-medium">
                                Room Number
                              </td>
                              <td className="border border-gray-300 p-1">
                                <Input 
                                  type="text" 
                                  name="equipmentLocation.roomNumber" 
                                  value={equipmentLocation.roomNumber} 
                                  onChange={(e) => handleEquipmentLocationChange('roomNumber', e.target.value)}
                                  className="border-0 focus-visible:ring-0 h-full w-full"
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="equipment-details" className="mt-0">
                <Card>
                  <CardContent className="pt-6">
                    <div className="mb-8">
                      <h3 className="text-2xl font-semibold text-center mb-6">5. EQUIPMENT</h3>
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
                                Requirements
                              </td>
                              <td className="border border-gray-300 p-1">
                                <Input 
                                  type="text" 
                                  name="accessProcedure.requirements" 
                                  value={accessProcedure.requirements} 
                                  onChange={(e) => handleAccessProcedureChange('requirements', e.target.value)}
                                  className="border-0 focus-visible:ring-0 h-full w-full"
                                />
                              </td>
                            </tr>
                            <tr className="border border-gray-300">
                              <td className="border border-gray-300 p-2 font-medium">
                                Security Requirements
                              </td>
                              <td className="border border-gray-300 p-1">
                                <Input 
                                  type="text" 
                                  name="accessProcedure.securityRequirements" 
                                  value={accessProcedure.securityRequirements} 
                                  onChange={(e) => handleAccessProcedureChange('securityRequirements', e.target.value)}
                                  className="border-0 focus-visible:ring-0 h-full w-full"
                                />
                              </td>
                            </tr>
                            <tr className="border border-gray-300">
                              <td className="border border-gray-300 p-2 font-medium">
                                Vehicle Type
                              </td>
                              <td className="border border-gray-300 p-1">
                                <Input 
                                  type="text" 
                                  name="accessProcedure.vehicleType" 
                                  value={accessProcedure.vehicleType} 
                                  onChange={(e) => handleAccessProcedureChange('vehicleType', e.target.value)}
                                  className="border-0 focus-visible:ring-0 h-full w-full"
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="equipment-room" className="mt-0">
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
              </TabsContent>
              
              <TabsContent value="site-records" className="mt-0">
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
                      
                      <h3 className="text-2xl font-semibold text-center mb-6">3. DETAILED SITE RECORDS (CONTINUED)</h3>
                      <p className="text-center text-gray-500 mb-4">Please complete the detailed site records information</p>
                      
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                        <p className="text-yellow-800">This section will be implemented in the next phase. For now, please continue to the next section.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {["network-integration", "power-supply", "optical-fiber", "earthing", "installation-materials", "approval"].map((tabId) => (
                <TabsContent key={tabId} value={tabId} className="mt-0">
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
                        
                        <h3 className="text-2xl font-semibold text-center mb-6">
                          {tabId === "network-integration" && "4. NETWORK INTEGRATION"}
                          {tabId === "power-supply" && "5. POWER SUPPLY"}
                          {tabId === "optical-fiber" && "6. OPTICAL FIBER"}
                          {tabId === "earthing" && "7. EARTHING"}
                          {tabId === "installation-materials" && "8. INSTALLATION MATERIALS"}
                          {tabId === "approval" && "9. FINAL APPROVAL"}
                        </h3>
                        
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                          <p className="text-yellow-800">This section will be implemented in the next phase. For now, please continue or submit your survey.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </div>
          </div>
        </Tabs>

        <div className="flex justify-between mt-4 md:hidden">
          {currentTab !== "cover" ? (
            <Button type="button" onClick={prevTab} className="flex items-center">
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
          ) : (
            <div></div>
          )}
          
          <div className="flex gap-2">
            <Button type="button" onClick={handleSaveForLater} variant="outline" className="flex items-center gap-1">
              <Save className="h-4 w-4" /> Save
            </Button>
            
            {currentTab !== "approval" ? (
              <Button type="button" onClick={nextTab} className="flex items-center">
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" className="flex items-center">
                Submit
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default EskomSiteSurveyForm;
