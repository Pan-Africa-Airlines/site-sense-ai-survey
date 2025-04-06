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

interface ElectricalDCDistributionPhotos {
  photos: string[];
}

interface TransportEquipmentPhotos {
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

  const [cabinetLocationPhotos, setCabinetLocationPhotos] = useState<CabinetLocationPhotos>({
    photos: [""]
  });
  
  const [dcPowerDistributionPhotos, setDcPowerDistributionPhotos] = useState<DCPowerDistributionPhotos>({
    photos: [""]
  });

  const [electricalDCDistributionPhotos, setElectricalDCDistributionPhotos] = useState<ElectricalDCDistributionPhotos>({
    photos: [""]
  });
  
  const [transportEquipmentPhotos, setTransportEquipmentPhotos] = useState<TransportEquipmentPhotos>({
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

  const handleElectricalDCDistributionPhotoUpload = (photoUrl: string) => {
    if (photoUrl) {
      const updatedPhotos = electricalDCDistributionPhotos.photos.filter(p => p).concat(photoUrl);
      setElectricalDCDistributionPhotos({
        photos: updatedPhotos
      });
      
      toast({
        title: "Photo uploaded",
        description: "Electrical DC distribution photo has been saved.",
      });
    }
  };
  
  const handleTransportEquipmentPhotoUpload = (photoUrl: string) => {
    if (photoUrl) {
      const updatedPhotos = transportEquipmentPhotos.photos.filter(p => p).concat(photoUrl);
      setTransportEquipmentPhotos({
        photos: updatedPhotos
      });
      
      toast({
        title: "Photo uploaded",
        description: "Transport equipment photo has been saved.",
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

  const removeElectricalDCDistributionPhoto = (index: number) => {
    const updatedPhotos = [...electricalDCDistributionPhotos.photos];
    updatedPhotos.splice(index, 1);
    
    setElectricalDCDistributionPhotos({
      photos: updatedPhotos.length ? updatedPhotos : [""]
    });
  };
  
  const removeTransportEquipmentPhoto = (index: number) => {
    const updatedPhotos = [...transportEquipmentPhotos.photos];
    updatedPhotos.splice(index, 1);
    
    setTransportEquipmentPhotos({
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
        cabinetLocationPhotos,
        dcPowerDistributionPhotos,
        electricalDCDistributionPhotos,
        transportEquipmentPhotos,
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
        cabinetLocationPhotos,
        dcPowerDistributionPhotos,
        electricalDCDistributionPhotos,
        transportEquipmentPhotos,
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
      setCurrentTab("additional-photos");
    } else if (currentTab === "additional-photos") {
      setCurrentTab("technical-details");
    }
  };

  const prevTab = () => {
    if (currentTab === "technical-details") {
      setCurrentTab("additional-photos");
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
                  
                  <div className="mb-6">
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
                  
                  <div className="mb-6">
                    <Label className="block text-sm font-medium text-gray-700 mb-1">
                      Building Photo
                    </Label>
                    {buildingPhoto ? (
                      <div className="relative mb-4">
                        <img src={buildingPhoto} alt="Building" className="rounded-md max-h-64 mx-auto" />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => setBuildingPhoto("")}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <ImageCapture onCapture={handleBuildingPhotoUpload} />
                    )}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3">Site Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="siteId" className="block text-sm font-medium text-gray-700 mb-1">
                        Site ID
                      </Label>
                      <Input
                        type="text"
                        id="siteId"
                        name="siteId"
                        value={siteId}
                        onChange={handleInputChange}
                        className="shadow-sm focus:ring-akhanya focus:border-akhanya block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Enter site ID"
                      />
                    </div>
                    <div>
                      <Label htmlFor="siteType" className="block text-sm font-medium text-gray-700 mb-1">
                        Site Type
                      </Label>
                      <Select value={siteType} onValueChange={(value) => setSiteType(value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select site type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="substation">Substation</SelectItem>
                          <SelectItem value="power-station">Power Station</SelectItem>
                          <SelectItem value="distribution-station">Distribution Station</SelectItem>
                          <SelectItem value="control-center">Control Center</SelectItem>
                          <SelectItem value="office">Office</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <Label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={address}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-akhanya focus:border-akhanya block w-full sm:text-sm border-gray-300 rounded-md min-h-20"
                    placeholder="Enter site address"
                  />
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="gpsCoordinates" className="block text-sm font-medium text-gray-700 mb-1">
                    GPS Coordinates
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      id="gpsCoordinates"
                      name="gpsCoordinates"
                      value={gpsCoordinates}
                      onChange={handleInputChange}
                      className="shadow-sm focus:ring-akhanya focus:border-akhanya block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Latitude, Longitude"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={retry}
                      className="flex items-center gap-1"
                      disabled={loading}
                    >
                      <MapPin className="h-4 w-4" />
                      {loading ? "Detecting..." : "Auto-detect"}
                    </Button>
                  </div>
                  {error && (
                    <p className="text-sm text-red-600 mt-1">
                      Error detecting location. Please enter coordinates manually.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-between mt-6">
              <div></div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={handleSaveForLater}>
                  <Save className="h-4 w-4 mr-2" />
                  Save for Later
                </Button>
                <Button type="button" onClick={nextTab} className="bg-akhanya hover:bg-akhanya-dark">
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="attendees" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4">Attendees</h3>
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="border border-gray-300 p-2 font-medium">Date</th>
                        <th className="border border-gray-300 p-2 font-medium">Name</th>
                        <th className="border border-gray-300 p-2 font-medium">Company</th>
                        <th className="border border-gray-300 p-2 font-medium">Department</th>
                        <th className="border border-gray-300 p-2 font-medium">Cellphone</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendees.map((attendee, index) => (
                        <TableInputRow
                          key={index}
                          label="Date"
                          name={`attendees[${index}].date`}
                          value={attendee.date}
                          onChange={(e) => handleAttendeeChange(index, "date", e.target.value)}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-between mt-6">
              <Button type="button" variant="outline" onClick={prevTab}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={handleSaveForLater}>
                  <Save className="h-4 w-4 mr-2" />
                  Save for Later
                </Button>
                <Button type="button" onClick={nextTab} className="bg-akhanya hover:bg-akhanya-dark">
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contents" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4">Contents</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="oemContractor.name" className="block text-sm font-medium text-gray-700 mb-1">
                        OEM Contractor Name
                      </Label>
                      <Input
                        type="text"
                        id="oemContractor.name"
                        name="oemContractor.name"
                        value={oemContractor.name}
                        onChange={(e) => handleApprovalChange("oemContractor", "name", e.target.value)}
                        className="shadow-sm focus:ring-akhanya focus:border-akhanya block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <Label htmlFor="oemContractor.signature" className="block text-sm font-medium text-gray-700 mb-1">
                        OEM Contractor Signature
                      </Label>
                      <Input
                        type="text"
                        id="oemContractor.signature"
                        name="oemContractor.signature"
                        value={oemContractor.signature}
                        onChange={(e) => handleApprovalChange("oemContractor", "signature", e.target.value)}
                        className="shadow-sm focus:ring-akhanya focus:border-akhanya block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-between mt-6">
              <Button type="button" variant="outline" onClick={prevTab}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={handleSaveForLater}>
                  <Save className="h-4 w-4 mr-2" />
                  Save for Later
                </Button>
                <Button type="button" onClick={nextTab} className="bg-akhanya hover:bg-akhanya-dark">
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="site-info" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4">Site Info</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="siteOwnerContacts[0].name" className="block text-sm font-medium text-gray-700 mb-1">
                        Site Owner Contact Name
                      </Label>
                      <Input
                        type="text"
                        id="siteOwnerContacts[0].name"
                        name="siteOwnerContacts[0].name"
                        value={siteOwnerContacts[0].name}
                        onChange={(e) => handleSiteOwnerContactChange(0, "name", e.target.value)}
                        className="shadow-sm focus:ring-akhanya focus:border-akhanya block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <Label htmlFor="siteOwnerContacts[0].cellphone" className="block text-sm font-medium text-gray-700 mb-1">
                        Site Owner Contact Cellphone
                      </Label>
                      <Input
                        type="text"
                        id="siteOwnerContacts[0].cellphone"
                        name="siteOwnerContacts[0].cellphone"
                        value={siteOwnerContacts[0].cellphone}
                        onChange={(e) => handleSiteOwnerContactChange(0, "cellphone", e.target.value)}
                        className="shadow-sm focus:ring-akhanya focus:border-akhanya block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-between mt-6">
              <Button type="button" variant="outline" onClick={prevTab}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={handleSaveForLater}>
                  <Save className="h-4 w-4 mr-2" />
                  Save for Later
                </Button>
                <Button type="button" onClick={nextTab} className="bg-akhanya hover:bg-akhanya-dark">
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="equipment-details" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4">Equipment</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="equipmentLocation.buildingName" className="block text-sm font-medium text-gray-700 mb-1">
                        Building Name
                      </Label>
                      <Input
                        type="text"
                        id="equipmentLocation.buildingName"
                        name="equipmentLocation.buildingName"
                        value={equipmentLocation.buildingName}
                        onChange={(e) => handleEquipmentLocationChange("buildingName", e.target.value)}
                        className="shadow-sm focus:ring-akhanya focus:border-akhanya block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <Label htmlFor="equipmentLocation.buildingType" className="block text-sm font-medium text-gray-700 mb-1">
                        Building Type
                      </Label>
                      <Input
                        type="text"
                        id="equipmentLocation.buildingType"
                        name="equipmentLocation.buildingType"
                        value={equipmentLocation.buildingType}
                        onChange={(e) => handleEquipmentLocationChange("buildingType", e.target.value)}
                        className="shadow-sm focus:ring-akhanya focus:border-akhanya block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-between mt-6">
              <Button type="button" variant="outline" onClick={prevTab}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={handleSaveForLater}>
                  <Save className="h-4 w-4 mr-2" />
                  Save for Later
                </Button>
                <Button type="button" onClick={nextTab} className="bg-akhanya hover:bg-akhanya-dark">
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="equipment-room" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4">Room Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="equipmentRoomGeneral.cableAccess" className="block text-sm font-medium text-gray-700 mb-1">
                        Cable Access
                      </Label>
                      <Input
                        type="text"
                        id="equipmentRoomGeneral.cableAccess"
                        name="equipmentRoomGeneral.cableAccess"
                        value={equipmentRoomGeneral.cableAccess}
                        onChange={(e) => handleEquipmentRoomGeneralChange("cableAccess", e.target.value)}
                        className="shadow-sm focus:ring-akhanya focus:border-akhanya block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <Label htmlFor="equipmentRoomGeneral.roomLighting" className="block text-sm font-medium text-gray-700 mb-1">
                        Room Lighting
                      </Label>
                      <Input
                        type="text"
                        id="equipmentRoomGeneral.roomLighting"
                        name="equipmentRoomGeneral.roomLighting"
                        value={equipmentRoomGeneral.roomLighting}
                        onChange={(e) => handleEquipmentRoomGeneralChange("roomLighting", e.target.value)}
                        className="shadow-sm focus:ring-akhanya focus:border-akhanya block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-between mt-6">
              <Button type="button" variant="outline" onClick={prevTab}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={handleSaveForLater}>
                  <Save className="h-4 w-4 mr-2" />
                  Save for Later
                </Button>
                <Button type="button" onClick={nextTab} className="bg-akhanya hover:bg-akhanya-dark">
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="additional-photos" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4">Equipment Room Photos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {equipmentRoomPhotos.photos.filter(Boolean).map((photo, index) => (
                      <div key={index} className="relative rounded-md overflow-hidden border border-gray-200">
                        <img src={photo} alt={`Equipment Room ${index + 1}`} className="w-full h-48 object-cover" />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => removeEquipmentRoomPhoto(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex items-center justify-center border border-dashed border-gray-300 rounded-md h-48">
                      <ImageCapture onCapture={handleEquipmentRoomPhotoUpload}>
                        <div className="flex flex-col items-center p-4">
                          <Camera className="h-10 w-10 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">Add Equipment Room Photo</p>
                        </div>
                      </ImageCapture>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4">Cabinet Location Photos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {cabinetLocationPhotos.photos.filter(Boolean).map((photo, index) => (
                      <div key={index} className="relative rounded-md overflow-hidden border border-gray-200">
                        <img src={photo} alt={`Cabinet Location ${index + 1}`} className="w-full h-48 object-cover" />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => removeCabinetLocationPhoto(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex items-center justify-center border border-dashed border-gray-300 rounded-md h-48">
                      <ImageCapture onCapture={handleCabinetLocationPhotoUpload}>
                        <div className="flex flex-col items-center p-4">
                          <Camera className="h-10 w-10 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">Add Cabinet Location Photo</p>
                        </div>
                      </ImageCapture>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4">DC Power Distribution Photos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {dcPowerDistributionPhotos.photos.filter(Boolean).map((photo, index) => (
                      <div key={index} className="relative rounded-md overflow-hidden border border-gray-200">
                        <img src={photo} alt={`DC Power Distribution ${index + 1}`} className="w-full h-48 object-cover" />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => removeDcPowerDistributionPhoto(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex items-center justify-center border border-dashed border-gray-300 rounded-md h-48">
                      <ImageCapture onCapture={handleDcPowerDistributionPhotoUpload}>
                        <div className="flex flex-col items-center p-4">
                          <Camera className="h-10 w-10 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">Add DC Power Distribution Photo</p>
                        </div>
                      </ImageCapture>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4">Electrical DC Distribution Photos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {electricalDCDistributionPhotos.photos.filter(Boolean).map((photo, index) => (
                      <div key={index} className="relative rounded-md overflow-hidden border border-gray-200">
                        <img src={photo} alt={`Electrical DC Distribution ${index + 1}`} className="w-full h-48 object-cover" />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => removeElectricalDCDistributionPhoto(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex items-center justify-center border border-dashed border-gray-300 rounded-md h-48">
                      <ImageCapture onCapture={handleElectricalDCDistributionPhotoUpload}>
                        <div className="flex flex-col items-center p-4">
                          <Camera className="h-10 w-10 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">Add Electrical DC Distribution Photo</p>
                        </div>
                      </ImageCapture>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4">Transport Equipment Photos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {transportEquipmentPhotos.photos.filter(Boolean).map((photo, index) => (
                      <div key={index} className="relative rounded-md overflow-hidden border border-gray-200">
                        <img src={photo} alt={`Transport Equipment ${index + 1}`} className="w-full h-48 object-cover" />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => removeTransportEquipmentPhoto(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex items-center justify-center border border-dashed border-gray-300 rounded-md h-48">
                      <ImageCapture onCapture={handleTransportEquipmentPhotoUpload}>
                        <div className="flex flex-col items-center p-4">
                          <Camera className="h-10 w-10 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">Add Transport Equipment Photo</p>
                        </div>
                      </ImageCapture>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-between mt-6">
              <Button type="button" variant="outline" onClick={prevTab}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={handleSaveForLater}>
                  <Save className="h-4 w-4 mr-2" />
                  Save for Later
                </Button>
                <Button type="button" onClick={nextTab} className="bg-akhanya hover:bg-akhanya-dark">
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="technical-details" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4">Technical</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="accessProcedure.requirements" className="block text-sm font-medium text-gray-700 mb-1">
                        Access Procedure Requirements
                      </Label>
                      <Input
                        type="text"
                        id="accessProcedure.requirements"
                        name="accessProcedure.requirements"
                        value={accessProcedure.requirements}
                        onChange={(e) => handleAccessProcedureChange("requirements", e.target.value)}
                        className="shadow-sm focus:ring-akhanya focus:border-akhanya block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <Label htmlFor="accessProcedure.securityRequirements" className="block text-sm font-medium text-gray-700 mb-1">
                        Access Procedure Security Requirements
                      </Label>
                      <Input
                        type="text"
                        id="accessProcedure.securityRequirements"
                        name="accessProcedure.securityRequirements"
                        value={accessProcedure.securityRequirements}
                        onChange={(e) => handleAccessProcedureChange("securityRequirements", e.target.value)}
                        className="shadow-sm focus:ring-akhanya focus:border-akhanya block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-between mt-6">
              <Button type="button" variant="outline" onClick={prevTab}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={handleSaveForLater}>
                  <Save className="h-4 w-4 mr-2" />
                  Save for Later
                </Button>
                <Button type="button" onClick={nextTab} className="bg-akhanya hover:bg-akhanya-dark">
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
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
