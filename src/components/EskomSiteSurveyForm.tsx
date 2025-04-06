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
    }
  };

  const prevTab = () => {
    if (currentTab === "equipment-details") {
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
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="cover" className="flex items-center justify-center gap-2 relative">
              <div className="bg-akhanya text-white w-6 h-6 rounded-full flex items-center justify-center font-medium">1</div>
              <span>Cover Page</span>
            </TabsTrigger>
            <TabsTrigger value="attendees" className="flex items-center justify-center gap-2">
              <div className="bg-akhanya text-white w-6 h-6 rounded-full flex items-center justify-center font-medium">2</div>
              <span>Attendees & Approval</span>
            </TabsTrigger>
            <TabsTrigger value="contents" className="flex items-center justify-center gap-2">
              <div className="bg-akhanya text-white w-6 h-6 rounded-full flex items-center justify-center font-medium">3</div>
              <span>Table of Contents</span>
            </TabsTrigger>
            <TabsTrigger value="site-info" className="flex items-center justify-center gap-2">
              <div className="bg-akhanya text-white w-6 h-6 rounded-full flex items-center justify-center font-medium">4</div>
              <span>Site Information</span>
            </TabsTrigger>
            <TabsTrigger value="equipment-details" className="flex items-center justify-center gap-2">
              <div className="bg-akhanya text-white w-6 h-6 rounded-full flex items-center justify-center font-medium">5</div>
              <span>Equipment Details</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="cover" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center mb-8 relative">
                  <div className="flex justify-end mb-4">
                    <img 
                      src="/public/lovable-uploads/86add713-b146-4f31-ab69-d80b3051168b.png" 
                      alt="BCX Logo" 
                      className="w-32"
                    />
                  </div>
                  <h1 className="text-3xl font-bold mb-6">ESKOM OT IP/MPLS NETWORK</h1>
                  <h2 className="text-2xl font-bold mb-8">SITE SURVEY REPORT</h2>
                  
                  <table className="w-full border-collapse border border-gray-300 mb-6">
                    <tbody>
                      <tr className="border border-gray-300">
                        <td className="border border-gray-300 p-2 font-medium w-1/3">Site Name:</td>
                        <td className="border border-gray-300 p-2">
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
                        <td className="border border-gray-300 p-2 font-medium">Region:</td>
                        <td className="border border-gray-300 p-2">
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
                        <td className="border border-gray-300 p-2">
                          <Input 
                            type="date"
                            name="date"
                            value={date}
                            onChange={handleInputChange}
                            className="border-0 focus-visible:ring-0 h-full w-full"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  
                  <div className="border border-gray-300 p-2 mb-6">
                    <p className="font-medium mb-2">Full front view photo of building where IP/MPLS equipment will be situated.</p>
                    <div className="min-h-[300px]">
                      <ImageCapture 
                        onCapture={handleBuildingPhotoUpload} 
                        label="Building Photo"
                        description=""
                        capturedImage={buildingPhoto}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="text-right mt-4">
                  <p className="text-sm text-gray-500">Page 1 of 5</p>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end mt-4">
              <Button type="button" onClick={nextTab} className="flex items-center">
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
                  
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-center mb-4">Site visit attendee's information</h3>
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
                                />
                              </td>
                              <td className="border border-gray-300 p-1">
                                <Input 
                                  type="text"
                                  value={attendee.company}
                                  onChange={(e) => handleAttendeeChange(index, 'company', e.target.value)}
                                  className="border-0 focus-visible:ring-0 h-full w-full"
                                />
                              </td>
                              <td className="border border-gray-300 p-1">
                                <Input 
                                  type="text"
                                  value={attendee.department}
                                  onChange={(e) => handleAttendeeChange(index, 'department', e.target.value)}
                                  className="border-0 focus-visible:ring-0 h-full w-full"
                                />
                              </td>
                              <td className="border border-gray-300 p-1">
                                <Input 
                                  type="text"
                                  value={attendee.cellphone}
                                  onChange={(e) => handleAttendeeChange(index, 'cellphone', e.target.value)}
                                  className="border-0 focus-visible:ring-0 h-full w-full"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-xl font-semibold text-center mb-4">Site survey outcome</h3>
                    
                    {/* OEM Contractor Section */}
                    <div className="mb-6">
                      <table className="w-full border-collapse border border-gray-300">
                        <tbody>
                          <tr className="bg-gray-100">
                            <td colSpan={3} className="border border-gray-300 p-2 font-bold">OEM Contractor</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 p-2">Name</td>
                            <td className="border border-gray-300 p-2">Signature</td>
                            <td className="border border-gray-300 p-2">Date</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 p-1">
                              <Input 
                                type="text"
                                value={oemContractor.name}
                                onChange={(e) => handleApprovalChange("oemContractor", "name", e.target.value)}
                                className="border-0 focus-visible:ring-0 h-full w-full"
                              />
                            </td>
                            <td className="border border-gray-300 p-1">
                              <Input 
                                type="text"
                                value={oemContractor.signature}
                                onChange={(e) => handleApprovalChange("oemContractor", "signature", e.target.value)}
                                className="border-0 focus-visible:ring-0 h-full w-full"
                                placeholder="Electronic signature"
                              />
                            </td>
                            <td className="border border-gray-300 p-1">
                              <Input 
                                type="date"
                                value={oemContractor.date}
                                onChange={(e) => handleApprovalChange("oemContractor", "date", e.target.value)}
                                className="border-0 focus-visible:ring-0 h-full w-full"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 p-2 text-center">
                              <div className="flex items-center justify-center space-x-2">
                                <div className="flex items-center space-x-2">
                                  <Checkbox 
                                    id="oem-contractor-accepted"
                                    checked={oemContractor.accepted}
                                    onCheckedChange={(checked) => {
                                      handleApprovalChange("oemContractor", "accepted", checked === true);
                                      if (checked === true) handleApprovalChange("oemContractor", "rejected", false);
                                    }}
                                  />
                                  <label htmlFor="oem-contractor-accepted">Accepted</label>
                                </div>
                              </div>
                            </td>
                            <td className="border border-gray-300 p-2 text-center">
                              <div className="flex items-center justify-center space-x-2">
                                <div className="flex items-center space-x-2">
                                  <Checkbox 
                                    id="oem-contractor-rejected"
                                    checked={oemContractor.rejected}
                                    onCheckedChange={(checked) => {
                                      handleApprovalChange("oemContractor", "rejected", checked === true);
                                      if (checked === true) handleApprovalChange("oemContractor", "accepted", false);
                                    }}
                                  />
                                  <label htmlFor="oem-contractor-rejected">Rejected</label>
                                </div>
                              </div>
                            </td>
                            <td className="border border-gray-300 p-2 font-medium text-center">Comments</td>
                          </tr>
                          <tr>
                            <td colSpan={3} className="border border-gray-300 p-1">
                              <Textarea 
                                value={oemContractor.comments}
                                onChange={(e) => handleApprovalChange("oemContractor", "comments", e.target.value)}
                                className="border-0 focus-visible:ring-0 h-full w-full min-h-[80px]"
                                placeholder="Enter comments here"
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    {/* OEM Engineer Section */}
                    <div className="mb-6">
                      <table className="w-full border-collapse border border-gray-300">
                        <tbody>
                          <tr className="bg-gray-100">
                            <td colSpan={3} className="border border-gray-300 p-2 font-bold">OEM Engineer</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 p-2">Name</td>
                            <td className="border border-gray-300 p-2">Signature</td>
                            <td className="border border-gray-300 p-2">Date</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 p-1">
                              <Input 
                                type="text"
                                value={oemEngineer.name}
                                onChange={(e) => handleApprovalChange("oemEngineer", "name", e.target.value)}
                                className="border-0 focus-visible:ring-0 h-full w-full"
                              />
                            </td>
                            <td className="border border-gray-300 p-1">
                              <Input 
                                type="text"
                                value={oemEngineer.signature}
                                onChange={(e) => handleApprovalChange("oemEngineer", "signature", e.target.value)}
                                className="border-0 focus-visible:ring-0 h-full w-full"
                                placeholder="Electronic signature"
                              />
                            </td>
                            <td className="border border-gray-300 p-1">
                              <Input 
                                type="date"
                                value={oemEngineer.date}
                                onChange={(e) => handleApprovalChange("oemEngineer", "date", e.target.value)}
                                className="border-0 focus-visible:ring-0 h-full w-full"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 p-2 text-center">
                              <div className="flex items-center justify-center space-x-2">
                                <div className="flex items-center space-x-2">
                                  <Checkbox 
                                    id="oem-engineer-accepted"
                                    checked={oemEngineer.accepted}
                                    onCheckedChange={(checked) => {
                                      handleApprovalChange("oemEngineer", "accepted", checked === true);
                                      if (checked === true) handleApprovalChange("oemEngineer", "rejected", false);
                                    }}
                                  />
                                  <label htmlFor="oem-engineer-accepted">Accepted</label>
                                </div>
                              </div>
                            </td>
                            <td className="border border-gray-300 p-2 text-center">
                              <div className="flex items-center justify-center space-x-2">
                                <div className="flex items-center space-x-2">
                                  <Checkbox 
                                    id="oem-engineer-rejected"
                                    checked={oemEngineer.rejected}
                                    onCheckedChange={(checked) => {
                                      handleApprovalChange("oemEngineer", "rejected", checked === true);
                                      if (checked === true) handleApprovalChange("oemEngineer", "accepted", false);
                                    }}
                                  />
                                  <label htmlFor="oem-engineer-rejected">Rejected</label>
                                </div>
                              </div>
                            </td>
                            <td className="border border-gray-300 p-2 font-medium text-center">Comments</td>
                          </tr>
                          <tr>
                            <td colSpan={3} className="border border-gray-300 p-1">
                              <Textarea 
                                value={oemEngineer.comments}
                                onChange={(e) => handleApprovalChange("oemEngineer", "comments", e.target.value)}
                                className="border-0 focus-visible:ring-0 h-full w-full min-h-[80px]"
                                placeholder="Enter comments here"
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Eskom Representative Section */}
                    <div className="mb-6">
                      <table className="w-full border-collapse border border-gray-300">
                        <tbody>
                          <tr className="bg-gray-100">
                            <td colSpan={3} className="border border-gray-300 p-2 font-bold">Eskom Representative</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 p-2">Name</td>
                            <td className="border border-gray-300 p-2">Signature</td>
                            <td className="border border-gray-300 p-2">Date</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 p-1">
                              <Input 
                                type="text"
                                value={eskomRepresentative.name}
                                onChange={(e) => handleApprovalChange("eskomRepresentative", "name", e.target.value)}
                                className="border-0 focus-visible:ring-0 h-full w-full"
                              />
                            </td>
                            <td className="border border-gray-300 p-1">
                              <Input 
                                type="text"
                                value={eskomRepresentative.signature}
                                onChange={(e) => handleApprovalChange("eskomRepresentative", "signature", e.target.value)}
                                className="border-0 focus-visible:ring-0 h-full w-full"
                                placeholder="Electronic signature"
                              />
                            </td>
                            <td className="border border-gray-300 p-1">
                              <Input 
                                type="date"
                                value={eskomRepresentative.date}
                                onChange={(e) => handleApprovalChange("eskomRepresentative", "date", e.target.value)}
                                className="border-0 focus-visible:ring-0 h-full w-full"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 p-2 text-center">
                              <div className="flex items-center justify-center space-x
