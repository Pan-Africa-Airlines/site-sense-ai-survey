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
import { Save, MapPin, ChevronRight, ChevronLeft, PlusCircle, Trash2, Camera } from "lucide-react";
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
  roomLayoutDrawings: string[];
  roomLayoutImages: string[];
  numberOfRouters: number;
}

interface TransportPlatform {
  linkNumber: number;
  linkTypeDirectionCapacity: string;
}

interface DCPowerDistribution {
  chargerALoadCurrent: string;
  chargerBLoadCurrent: string;
  cabinetsDirect: string;
  cableLength: string;
  eoaDbLayout: string;
}

interface EquipmentRoomPhotos {
  photos: string[];
}

interface CabinetLocationPhotos {
  photos: string[];
}

interface DCPowerDistributionPhotos {
  photos: string[];
}

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
    roomLayoutDrawings: [""],
    roomLayoutImages: [""],
    numberOfRouters: 0
  });
  
  const [currentDrawingIndex, setCurrentDrawingIndex] = useState(0);
  
  const [redlineDrawing, setRedlineDrawing] = useState("");
  
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
  
  const [transportPlatforms, setTransportPlatforms] = useState<TransportPlatform[]>([
    { linkNumber: 1, linkTypeDirectionCapacity: "" },
    { linkNumber: 2, linkTypeDirectionCapacity: "" },
    { linkNumber: 3, linkTypeDirectionCapacity: "" },
    { linkNumber: 4, linkTypeDirectionCapacity: "" },
  ]);

  const [dcPowerDistribution, setDcPowerDistribution] = useState<DCPowerDistribution>({
    chargerALoadCurrent: "",
    chargerBLoadCurrent: "",
    cabinetsDirect: "",
    cableLength: "",
    eoaDbLayout: "",
  });

  const [equipmentRoomPhotos, setEquipmentRoomPhotos] = useState<EquipmentRoomPhotos>({
    photos: [""]
  });

  // New state for slide 8 - cabinet location photos and DC power distribution photos
  const [cabinetLocationPhotos, setCabinetLocationPhotos] = useState<CabinetLocationPhotos>({
    photos: [""]
  });
  
  const [dcPowerDistributionPhotos, setDcPowerDistributionPhotos] = useState<DCPowerDistributionPhotos>({
    photos: [""]
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

  const handleCabinetSpacePlanningChange = (field: keyof CabinetSpacePlanning, value: string | number | string[]) => {
    setCabinetSpacePlanning({
      ...cabinetSpacePlanning,
      [field]: value
    });
  };

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

  const handleRedlineDrawingSave = (dataUrl: string) => {
    setRedlineDrawing(dataUrl);
    
    toast({
      title: "Red-line drawing saved",
      description: "Your red-line layout drawing has been saved.",
    });
  };

  const addNewDrawing = () => {
    const updatedImages = [...cabinetSpacePlanning.roomLayoutImages, ""];
    const updatedDrawings = [...cabinetSpacePlanning.roomLayoutDrawings, ""];
    
    setCabinetSpacePlanning({
      ...cabinetSpacePlanning,
      roomLayoutImages: updatedImages,
      roomLayoutDrawings: updatedDrawings
    });
    
    setCurrentDrawingIndex(updatedImages.length - 1);
    
    toast({
      title: "New drawing added",
      description: `Drawing #${updatedImages.length} added. You can now create a new drawing.`,
    });
  };

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
    
    if (currentDrawingIndex >= updatedImages.length) {
      setCurrentDrawingIndex(updatedImages.length - 1);
    }
    
    toast({
      title: "Drawing removed",
      description: `Drawing #${index + 1} has been removed.`,
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

  const handleTransportPlatformChange = (index: number, value: string) => {
    const updatedPlatforms = [...transportPlatforms];
    updatedPlatforms[index] = {
      ...updatedPlatforms[index],
      linkTypeDirectionCapacity: value
    };
    setTransportPlatforms(updatedPlatforms);
  };

  const handleDcPowerDistributionChange = (field: keyof DCPowerDistribution, value: string) => {
    setDcPowerDistribution({
      ...dcPowerDistribution,
      [field]: value
    });
  };

  const handleEquipmentRoomPhotoUpload = (photoUrl: string) => {
    if (photoUrl) {
      const updatedPhotos = equipmentRoomPhotos.photos.filter(p => p).concat(photoUrl);
      setEquipmentRoomPhotos({
        photos: updatedPhotos
      });
      
      toast({
        title: "Photo uploaded",
        description: "Equipment room photo has been saved.",
      });
    }
  };
  
  // New handlers for slide 8
  const handleCabinetLocationPhotoUpload = (photoUrl: string) => {
    if (photoUrl) {
      const updatedPhotos = cabinetLocationPhotos.photos.filter(p => p).concat(photoUrl);
      setCabinetLocationPhotos({
        photos: updatedPhotos
      });
      
      toast({
        title: "Photo uploaded",
        description: "Cabinet location photo has been saved.",
      });
    }
  };
  
  const handleDcPowerDistributionPhotoUpload = (photoUrl: string) => {
    if (photoUrl) {
      const updatedPhotos = dcPowerDistributionPhotos.photos.filter(p => p).concat(photoUrl);
      setDcPowerDistributionPhotos({
        photos: updatedPhotos
      });
      
      toast({
        title: "Photo uploaded",
        description: "DC power distribution photo has been saved.",
      });
    }
  };

  const removeEquipmentRoomPhoto = (index: number) => {
    const updatedPhotos = [...equipmentRoomPhotos.photos];
    updatedPhotos.splice(index, 1);
    
    setEquipmentRoomPhotos({
      photos: updatedPhotos.length ? updatedPhotos : [""]
    });
  };
  
  // New methods for removing photos in slide 8
  const removeCabinetLocationPhoto = (index: number) => {
    const updatedPhotos = [...cabinetLocationPhotos.photos];
    updatedPhotos.splice(index, 1);
    
    setCabinetLocationPhotos({
      photos: updatedPhotos.length ? updatedPhotos : [""]
    });
  };
  
  const removeDcPowerDistributionPhoto = (index: number) => {
    const updatedPhotos = [...dcPowerDistributionPhotos.photos];
    updatedPhotos.splice(index, 1);
    
    setDcPowerDistributionPhotos({
      photos: updatedPhotos.length ? updatedPhotos : [""]
    });
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
        redlineDrawing,
        transportPlatforms,
        dcPowerDistribution,
        equipmentRoomPhotos,
        cabinetLocationPhotos,         // Add new fields for slide 8
        dcPowerDistributionPhotos,     // Add new fields for slide 8
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
        redlineDrawing,
        transportPlatforms,
        dcPowerDistribution,
        equipmentRoomPhotos,
        cabinetLocationPhotos,         // Add new fields for slide 8
        dcPowerDistributionPhotos,     // Add new fields for slide 8
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
      setCurrentTab("additional-photos");  // New tab for slide 8
    } else if (currentTab === "additional-photos") {
      setCurrentTab("technical-details");
    }
  };

  const prevTab = () => {
    if (currentTab === "technical-details") {
      setCurrentTab("additional-photos");  // New tab transition
    } else if (currentTab === "additional-photos") {
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
          <TabsList className="grid w-full grid-cols-8 mb-6">
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
            <TabsTrigger value="additional-photos" className="flex items-center justify-center gap-2">
              <div className="bg-akhanya text-white w-6 h-6 rounded-full flex items-center justify-center font-medium">7</div>
              <span>Photos</span>
            </TabsTrigger>
            <TabsTrigger value="technical-details" className="flex items-center justify-center gap-2">
              <div className="bg-akhanya text-white w-6 h-6 rounded-full flex items-center justify-center font-medium">8</div>
              <span>Technical</span>
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
                        <TableInputRow
                          label="Cable access to the cabinet (Underfloor, Overhead)"
                          name="cableAccess"
                          value={equipmentRoomGeneral.cableAccess}
                          onChange={(e) => handleEquipmentRoomGeneralChange('cableAccess', e.target.value)}
                        />
                        <TableInputRow
                          label="Room lighting (Indicate if any lights are faulty)"
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
                          label="Cooling Method (Air-conditioning, Fans etc)"
                          name="coolingMethod"
                          value={equipmentRoomGeneral.coolingMethod}
                          onChange={(e) => handleEquipmentRoomGeneralChange('coolingMethod', e.target.value)}
                        />
                        <TableInputRow
                          label="Cooling Rating (BTU or Central Controlled)"
                          name="coolingRating"
                          value={equipmentRoomGeneral.coolingRating}
                          onChange={(e) => handleEquipmentRoomGeneralChange('coolingRating', e.target.value)}
                        />
                        <TableInputRow
                          label="Measured room temperature (Deg C)"
                          name="roomTemperature"
                          value={equipmentRoomGeneral.roomTemperature}
                          onChange={(e) => handleEquipmentRoomGeneralChange('roomTemperature', e.target.value)}
                        />
                        <TableInputRow
                          label="General condition of equipment room"
                          name="equipmentRoomCondition"
                          value={equipmentRoomGeneral.equipmentRoomCondition}
                          onChange={(e) => handleEquipmentRoomGeneralChange('equipmentRoomCondition', e.target.value)}
                        />
                      </tbody>
                    </table>
                  </div>
                  
                  <h3 className="text-2xl font-semibold text-center my-6">3. DETAILED SITE RECORDS</h3>
                  <h4 className="text-xl font-semibold mt-4 mb-3">3.1. Equipment Cabinet Space Planning</h4>
                  
                  <div className="mb-4">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300 mb-6">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 p-2 text-left w-1/3">Subject</th>
                            <th className="border border-gray-300 p-2 text-left w-2/3">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border border-gray-300">
                            <td className="border border-gray-300 p-2">
                              <p className="font-medium">Room Layout Drawing (Prior to site visit, Eskom will supply PDF version, as available). OEM to printout copies and bring to site). Red-lined scanned version to be attached to the site survey report.</p>
                              <p className="mt-2 text-sm text-gray-600">Where no Room Layout drawing available, a free hand drawing (not to scale) to be provided by the OEM.</p>
                            </td>
                            <td className="border border-gray-300 p-2">
                              <div className="mb-2">
                                <div className="flex justify-between items-center mb-4">
                                  <div className="flex items-center gap-2">
                                    <h5 className="font-semibold">Drawing #{currentDrawingIndex + 1}</h5>
                                    {cabinetSpacePlanning.roomLayoutImages.length > 1 && (
                                      <div className="flex gap-1">
                                        {cabinetSpacePlanning.roomLayoutImages.map((_, index) => (
                                          <Button 
                                            key={index}
                                            type="button"
                                            variant={currentDrawingIndex === index ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setCurrentDrawingIndex(index)}
                                            className="h-7 w-7 p-0"
                                          >
                                            {index + 1}
                                          </Button>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      onClick={addNewDrawing}
                                      className="flex items-center gap-1"
                                    >
                                      <PlusCircle className="h-4 w-4" /> Add Drawing
                                    </Button>
                                    {cabinetSpacePlanning.roomLayoutImages.length > 1 && (
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={() => removeDrawing(currentDrawingIndex)}
                                        className="flex items-center gap-1 text-red-500 hover:text-red-700"
                                      >
                                        <Trash2 className="h-4 w-4" /> Remove
                                      </Button>
                                    )}
                                  </div>
                                </div>
                                
                                <DrawingCanvas 
                                  onSave={handleRoomLayoutImageSave} 
                                  initialValue={cabinetSpacePlanning.roomLayoutImages[currentDrawingIndex]}
                                />
                              </div>
                            </td>
                          </tr>
                          <tr className="border border-gray-300">
                            <td className="border border-gray-300 p-2 font-medium">
                              Please indicate number of new routers required?
                            </td>
                            <td className="border border-gray-300 p-1">
                              <Input 
                                type="number" 
                                name="numberOfRouters"
                                value={cabinetSpacePlanning.numberOfRouters.toString()}
                                onChange={(e) => handleCabinetSpacePlanningChange('numberOfRouters', parseInt(e.target.value) || 0)}
                                className="border-0 focus-visible:ring-0 h-full w-full"
                              />
                            </td>
                          </tr>
                          <tr className="border border-gray-300">
                            <td className="border border-gray-300 p-2">
                              <p className="font-medium">Please red-line Room Layout Drawing to indicate:</p>
                              <ul className="list-disc pl-6 mt-2 space-y-1">
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
                            <td className="border border-gray-300 p-2">
                              <div className="mb-2">
                                <h5 className="font-semibold mb-4">Red-line Drawing</h5>
                                <DrawingCanvas 
                                  onSave={handleRedlineDrawingSave} 
                                  initialValue={redlineDrawing}
                                />
                                <p className="text-sm text-gray-600 mt-2">
                                  Use the drawing tool above to mark the location of all equipment items. 
                                  We recommend using red color for visibility.
                                </p>
                              </div>
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
              <Button type="button" onClick={nextTab} className="flex items-center">
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="additional-photos" className="mt-4">
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
                  
                  <h3 className="text-2xl font-semibold text-center mb-6">3.5. NEW CABINET LOCATION PHOTOS</h3>
                  
                  <div className="mb-8 border border-gray-300 p-4 rounded-md">
                    <p className="mb-4 font-medium">
                      Please provide a clear colour photograph that shows the available floor space and proposed new cabinet locations(s) in the room, indicated with red block(s)
                    </p>
                    
                    {cabinetLocationPhotos.photos.filter(p => p).map((photo, index) => (
                      <div key={index} className="mb-4 border rounded-md p-4 relative">
                        <img src={photo} alt={`Cabinet Location ${index + 1}`} className="max-w-full h-auto" />
                        <Button 
                          type="button" 
                          variant="outline"
                          size="sm" 
                          className="absolute top-2 right-2" 
                          onClick={() => removeCabinetLocationPhoto(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    <div className="mt-4">
                      <ImageCapture 
                        onImageCaptured={handleCabinetLocationPhotoUpload}
                        buttonText="Take Cabinet Location Photo"
                      />
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-semibold text-center mb-6">3.6. DC POWER DISTRIBUTION PHOTOS</h3>
                  
                  <div className="mb-8 border border-gray-300 p-4 rounded-md">
                    <p className="mb-4 font-medium">
                      Please provide clear photographs of the DC power distribution system
                    </p>
                    
                    {dcPowerDistributionPhotos.photos.filter(p => p).map((photo, index) => (
                      <div key={index} className="mb-4 border rounded-md p-4 relative">
                        <img src={photo} alt={`DC Power Distribution ${index + 1}`} className="max-w-full h-auto" />
                        <Button 
                          type="button" 
                          variant="outline"
                          size="sm" 
                          className="absolute top-2 right-2" 
                          onClick={() => removeDcPowerDistributionPhoto(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    <div className="mt-4">
                      <ImageCapture 
                        onImageCaptured={handleDcPowerDistributionPhotoUpload}
                        buttonText="Take DC Power Distribution Photo"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-8">
                    <div className="flex items-center">
                      <p className="text-sm">Approved by: _________________</p>
                    </div>
                    <div className="flex items-center">
                      <p className="text-sm">Authorized Date: DD/MM/YYYY</p>
                    </div>
                  </div>
                  
                  <div className="text-right mt-4">
                    <p className="text-sm text-gray-500">Page 8 of 17</p>
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
                <Button type="button" onClick={nextTab} className="flex items-center">
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="technical-details" className="mt-4">
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
                  
                  <h3 className="text-2xl font-semibold text-center mb-6">3.2. TRANSPORT PLATFORMS</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 mb-8">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 p-2 text-left w-1/3">Subject</th>
                          <th className="border border-gray-300 p-2 text-left w-2/3">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transportPlatforms.map((platform, index) => (
                          <tr key={index} className="border border-gray-300">
                            <td className="border border-gray-300 p-2 font-medium">
                              Link {platform.linkNumber} – Link Type, Direction, Capacity
                            </td>
                            <td className="border border-gray-300 p-1">
                              <Input 
                                type="text" 
                                value={platform.linkTypeDirectionCapacity}
                                onChange={(e) => handleTransportPlatformChange(index, e.target.value)}
                                className="border-0 focus-visible:ring-0 h-full w-full"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <h3 className="text-2xl font-semibold text-center mb-6">3.3. 50V DC POWER DISTRIBUTION</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 mb-8">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 p-2 text-left w-1/3">Subject</th>
                          <th className="border border-gray-300 p-2 text-left w-2/3">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border border-gray-300">
                          <td className="border border-gray-300 p-2 font-medium">
                            50V Charger A: DC Load Current (Total Amps)
                          </td>
                          <td className="border border-gray-300 p-1">
                            <Input 
                              type="text" 
                              value={dcPowerDistribution.chargerALoadCurrent}
                              onChange={(e) => handleDcPowerDistributionChange('chargerALoadCurrent', e.target.value)}
                              className="border-0 focus-visible:ring-0 h-full w-full"
                            />
                          </td>
                        </tr>
                        <tr className="border border-gray-300">
                          <td className="border border-gray-300 p-2 font-medium">
                            50V Charger B: DC Load Current (Total Amps)
                          </td>
                          <td className="border border-gray-300 p-1">
                            <Input 
                              type="text" 
                              value={dcPowerDistribution.chargerBLoadCurrent}
                              onChange={(e) => handleDcPowerDistributionChange('chargerBLoadCurrent', e.target.value)}
                              className="border-0 focus-visible:ring-0 h-full w-full"
                            />
                          </td>
                        </tr>
                        <tr className="border border-gray-300">
                          <td className="border border-gray-300 p-2 font-medium">
                            Are cabinets supplied by the 50V DC Charger direct or via End of Aisle (EOA) DB boards?
                          </td>
                          <td className="border border-gray-300 p-1">
                            <Input 
                              type="text" 
                              value={dcPowerDistribution.cabinetsDirect}
                              onChange={(e) => handleDcPowerDistributionChange('cabinetsDirect', e.target.value)}
                              className="border-0 focus-visible:ring-0 h-full w-full"
                            />
                          </td>
                        </tr>
                        <tr className="border border-gray-300">
                          <td className="border border-gray-300 p-2 font-medium">
                            Measure DC Cable length required to OTN cabinet
                          </td>
                          <td className="border border-gray-300 p-1">
                            <Input 
                              type="text" 
                              value={dcPowerDistribution.cableLength}
                              onChange={(e) => handleDcPowerDistributionChange('cableLength', e.target.value)}
                              className="border-0 focus-visible:ring-0 h-full w-full"
                            />
                          </td>
                        </tr>
                        <tr className="border border-gray-300">
                          <td className="border border-gray-300 p-2 font-medium">
                            Where cabinets are supplied via EOA DB, please complete End of Aisle DB Layout, Annexure D
                          </td>
                          <td className="border border-gray-300 p-1">
                            <Input 
                              type="text" 
                              value={dcPowerDistribution.eoaDbLayout}
                              onChange={(e) => handleDcPowerDistributionChange('eoaDbLayout', e.target.value)}
                              className="border-0 focus-visible:ring-0 h-full w-full"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <h3 className="text-2xl font-semibold text-center mb-6">3.4. ESKOM EQUIPMENT ROOM PHOTOS</h3>
                  
                  <div className="mb-4">
                    <p className="mb-4">
                      Please provide clear colour photographs that shows general equipment room layout, including Telecomms
                      equipment cabinets, front and back (BME, ADM, Bearer Comms, Fibre Optic, 50V Charger, etc)
                    </p>
                    
                    {equipmentRoomPhotos.photos.filter(p => p).map((photo, index) => (
                      <div key={index} className="mb-4 border rounded-md p-4 relative">
                        <img src={photo} alt={`Equipment Room ${index + 1}`} className="max-w-full h-auto" />
                        <Button 
                          type="button" 
                          variant="outline"
                          size="sm" 
                          className="absolute top-2 right-2" 
                          onClick={() => removeEquipmentRoomPhoto(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    <div className="mt-4">
                      <ImageCapture 
                        onImageCaptured={handleEquipmentRoomPhotoUpload}
                        buttonText="Take Equipment Room Photo"
                      />
                    </div>
                  </div>
                  
                  <div className="text-right mt-4">
                    <p className="text-sm text-gray-500">Page 7 of 17</p>
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
