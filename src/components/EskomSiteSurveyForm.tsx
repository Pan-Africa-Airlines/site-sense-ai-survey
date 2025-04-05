import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Sparkles, ChevronDown, ChevronUp, AlertCircle, Calendar, MapPin, Check, 
  MapIcon, User, Network, Router, BatteryCharging, Box, Shield, 
  CloudLightning, Zap, Columns, Home, Navigation, Edit
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAI } from "@/contexts/AIContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import ImageCapture from "./ImageCapture";
import { Json } from "@/integrations/supabase/types";

interface Core {
  number: number;
  used: boolean;
}

interface Circuit {
  circuit: string;
  mcbRating: string;
  used: boolean;
  label: string;
}

interface FiberConnection {
  direction: string;
  connectionType: string;
  numberOfCores: string;
  cores: Core[];
}

interface DBBox {
  chargerLabel: string;
  chargerType: "single" | "dual";
  circuits: {
    chargerA: Circuit[];
    chargerB: Circuit[];
  };
}

interface EskomSurveyFormData {
  siteName: string;
  region: string;
  date: string;
  siteType: string;
  siteId: string;
  address: string;
  gpsCoordinates: string;
  buildingPhoto: string;
  status: string;
  contactPersonName: string;
  contactPersonNumber: string;
  accessToSite: string;
  siteAccessibilityComments: string;
  networkAvailability: string;
  existingNetworkInfrastructure: string;
  fiberConnections: FiberConnection[];
  routerLocation: string;
  routerPowerAvailability: string;
  routerRackMounting: string;
  routerComments: string;
  upsAvailability: string;
  upsSpecifications: string;
  upsComments: string;
  dbBoxAvailability: string;
  dbBox: DBBox;
  dbBoxComments: string;
  earthingAvailability: string;
  earthingQuality: string;
  earthingComments: string;
  lightningProtectionAvailability: string;
  lightningProtectionType: string;
  lightningProtectionComments: string;
  surgeProtectionAvailability: string;
  surgeProtectionType: string;
  surgeProtectionComments: string;
  poleAvailability: string;
  poleType: string;
  poleCondition: string;
  poleHeight: string;
  poleComments: string;
  rooftopAccess: string;
  rooftopType: string;
  rooftopCondition: string;
  rooftopHeight: string;
  rooftopComments: string;
  towerAvailability: string;
  towerType: string;
  towerCondition: string;
  towerHeight: string;
  towerComments: string;
  additionalNotes: string;
}

const EskomSiteSurveyForm = ({ showAIRecommendations = false }) => {
  const [siteName, setSiteName] = useState("");
  const [region, setRegion] = useState("");
  const [date, setDate] = useState("");
  const [siteType, setSiteType] = useState("");
  const [siteId, setSiteId] = useState("");
  const [address, setAddress] = useState("");
  const [gpsCoordinates, setGpsCoordinates] = useState("");
  const [buildingPhoto, setBuildingPhoto] = useState("");
  const [status, setStatus] = useState("");
  const [contactPersonName, setContactPersonName] = useState("");
  const [contactPersonNumber, setContactPersonNumber] = useState("");
  const [accessToSite, setAccessToSite] = useState("");
  const [siteAccessibilityComments, setSiteAccessibilityComments] = useState("");
  const [networkAvailability, setNetworkAvailability] = useState("");
  const [existingNetworkInfrastructure, setExistingNetworkInfrastructure] = useState("");
  const [routerLocation, setRouterLocation] = useState("");
  const [routerPowerAvailability, setRouterPowerAvailability] = useState("");
  const [routerRackMounting, setRouterRackMounting] = useState("");
  const [routerComments, setRouterComments] = useState("");
  const [upsAvailability, setUpsAvailability] = useState("");
  const [upsSpecifications, setUpsSpecifications] = useState("");
  const [upsComments, setUpsComments] = useState("");
  const [dbBoxAvailability, setDbBoxAvailability] = useState("");
  const [dbBoxComments, setDbBoxComments] = useState("");
  const [earthingAvailability, setEarthingAvailability] = useState("");
  const [earthingQuality, setEarthingQuality] = useState("");
  const [earthingComments, setEarthingComments] = useState("");
  const [lightningProtectionAvailability, setLightningProtectionAvailability] = useState("");
  const [lightningProtectionType, setLightningProtectionType] = useState("");
  const [lightningProtectionComments, setLightningProtectionComments] = useState("");
  const [surgeProtectionAvailability, setSurgeProtectionAvailability] = useState("");
  const [surgeProtectionType, setSurgeProtectionType] = useState("");
  const [surgeProtectionComments, setSurgeProtectionComments] = useState("");
  const [poleAvailability, setPoleAvailability] = useState("");
  const [poleType, setPoleType] = useState("");
  const [poleCondition, setPoleCondition] = useState("");
  const [poleHeight, setPoleHeight] = useState("");
  const [poleComments, setPoleComments] = useState("");
  const [rooftopAccess, setRooftopAccess] = useState("");
  const [rooftopType, setRooftopType] = useState("");
  const [rooftopCondition, setRooftopCondition] = useState("");
  const [rooftopHeight, setRooftopHeight] = useState("");
  const [rooftopComments, setRooftopComments] = useState("");
  const [towerAvailability, setTowerAvailability] = useState("");
  const [towerType, setTowerType] = useState("");
  const [towerCondition, setTowerCondition] = useState("");
  const [towerHeight, setTowerHeight] = useState("");
  const [towerComments, setTowerComments] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  
  const [formData, setFormData] = useState<EskomSurveyFormData>({
    siteName: "",
    region: "",
    date: "",
    siteType: "",
    siteId: "",
    address: "",
    gpsCoordinates: "",
    buildingPhoto: "",
    status: "",
    contactPersonName: "",
    contactPersonNumber: "",
    accessToSite: "",
    siteAccessibilityComments: "",
    networkAvailability: "",
    existingNetworkInfrastructure: "",
    fiberConnections: [
      {
        direction: "",
        connectionType: "",
        numberOfCores: "",
        cores: Array.from({ length: 12 }, (_, i) => ({ number: i + 1, used: false }))
      }
    ],
    routerLocation: "",
    routerPowerAvailability: "",
    routerRackMounting: "",
    routerComments: "",
    upsAvailability: "",
    upsSpecifications: "",
    upsComments: "",
    dbBoxAvailability: "",
    dbBox: {
      chargerLabel: "",
      chargerType: "single",
      circuits: {
        chargerA: [
          { circuit: "Circuit 1", mcbRating: "", used: false, label: "" },
          { circuit: "Circuit 2", mcbRating: "", used: false, label: "" }
        ],
        chargerB: [
          { circuit: "Circuit 1", mcbRating: "", used: false, label: "" },
          { circuit: "Circuit 2", mcbRating: "", used: false, label: "" }
        ]
      }
    },
    dbBoxComments: "",
    earthingAvailability: "",
    earthingQuality: "",
    earthingComments: "",
    lightningProtectionAvailability: "",
    lightningProtectionType: "",
    lightningProtectionComments: "",
    surgeProtectionAvailability: "",
    surgeProtectionType: "",
    surgeProtectionComments: "",
    poleAvailability: "",
    poleType: "",
    poleCondition: "",
    poleHeight: "",
    poleComments: "",
    rooftopAccess: "",
    rooftopType: "",
    rooftopCondition: "",
    rooftopHeight: "",
    rooftopComments: "",
    towerAvailability: "",
    towerType: "",
    towerCondition: "",
    towerHeight: "",
    towerComments: "",
    additionalNotes: ""
  });
  
  const [sectionCompletion, setSectionCompletion] = useState({
    "Site Information": false,
    "Contact Information": false,
    "Network Infrastructure": false,
    "Router Details": false,
    "UPS Details": false,
    "DB Box Details": false,
    "Earthing Details": false,
    "Lightning Protection": false,
    "Surge Protection": false,
    "Pole Details": false,
    "Rooftop Details": false,
    "Tower Details": false,
    "Additional Notes": false,
  });
  
  const [aiSuggestions, setAiSuggestions] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();
  const { getSuggestion, isProcessing } = useAI();
  const navigate = useNavigate();

  const updateSectionCompletion = (section: string, isComplete: boolean) => {
    setSectionCompletion(prev => ({
      ...prev,
      [section]: isComplete
    }));
  };

  const validateSiteInformation = () => {
    return (
      siteName !== "" &&
      region !== "" &&
      date !== "" &&
      siteType !== "" &&
      siteId !== "" &&
      address !== "" &&
      gpsCoordinates !== "" &&
      buildingPhoto !== "" &&
      status !== ""
    );
  };

  const validateContactInformation = () => {
    return (
      contactPersonName !== "" &&
      contactPersonNumber !== "" &&
      accessToSite !== "" &&
      siteAccessibilityComments !== ""
    );
  };

  const validateNetworkInfrastructure = () => {
    return (
      networkAvailability !== "" &&
      existingNetworkInfrastructure !== ""
    );
  };

  const validateRouterDetails = () => {
    return (
      routerLocation !== "" &&
      routerPowerAvailability !== "" &&
      routerRackMounting !== "" &&
      routerComments !== ""
    );
  };

  const validateUPSDetails = () => {
    return (
      upsAvailability !== "" &&
      upsSpecifications !== "" &&
      upsComments !== ""
    );
  };

  const validateDBBoxDetails = () => {
    return (
      dbBoxAvailability !== "" &&
      formData.dbBox.chargerLabel !== "" &&
      dbBoxComments !== ""
    );
  };

  const validateEarthingDetails = () => {
    return (
      earthingAvailability !== "" &&
      earthingQuality !== "" &&
      earthingComments !== ""
    );
  };

  const validateLightningProtection = () => {
    return (
      lightningProtectionAvailability !== "" &&
      lightningProtectionType !== "" &&
      lightningProtectionComments !== ""
    );
  };

  const validateSurgeProtection = () => {
    return (
      surgeProtectionAvailability !== "" &&
      surgeProtectionType !== "" &&
      surgeProtectionComments !== ""
    );
  };

  const validatePoleDetails = () => {
    return (
      poleAvailability !== "" &&
      poleType !== "" &&
      poleCondition !== "" &&
      poleHeight !== "" &&
      poleComments !== ""
    );
  };

  const validateRooftopDetails = () => {
    return (
      rooftopAccess !== "" &&
      rooftopType !== "" &&
      rooftopCondition !== "" &&
      rooftopHeight !== "" &&
      rooftopComments !== ""
    );
  };

  const validateTowerDetails = () => {
    return (
      towerAvailability !== "" &&
      towerType !== "" &&
      towerCondition !== "" &&
      towerHeight !== "" &&
      towerComments !== ""
    );
  };

  const validateAdditionalNotes = () => {
    return additionalNotes !== "";
  };

  useEffect(() => {
    updateSectionCompletion("Site Information", validateSiteInformation());
  }, [siteName, region, date, siteType, siteId, address, gpsCoordinates, buildingPhoto, status]);

  useEffect(() => {
    updateSectionCompletion("Contact Information", validateContactInformation());
  }, [contactPersonName, contactPersonNumber, accessToSite, siteAccessibilityComments]);

  useEffect(() => {
    updateSectionCompletion("Network Infrastructure", validateNetworkInfrastructure());
  }, [networkAvailability, existingNetworkInfrastructure]);

  useEffect(() => {
    updateSectionCompletion("Router Details", validateRouterDetails());
  }, [routerLocation, routerPowerAvailability, routerRackMounting, routerComments]);

  useEffect(() => {
    updateSectionCompletion("UPS Details", validateUPSDetails());
  }, [upsAvailability, upsSpecifications, upsComments]);

  useEffect(() => {
    updateSectionCompletion("DB Box Details", validateDBBoxDetails());
  }, [dbBoxAvailability, formData.dbBox.chargerLabel, dbBoxComments]);

  useEffect(() => {
    updateSectionCompletion("Earthing Details", validateEarthingDetails());
  }, [earthingAvailability, earthingQuality, earthingComments]);

  useEffect(() => {
    updateSectionCompletion("Lightning Protection", validateLightningProtection());
  }, [lightningProtectionAvailability, lightningProtectionType, lightningProtectionComments]);

  useEffect(() => {
    updateSectionCompletion("Surge Protection", validateSurgeProtection());
  }, [surgeProtectionAvailability, surgeProtectionType, surgeProtectionComments]);

  useEffect(() => {
    updateSectionCompletion("Pole Details", validatePoleDetails());
  }, [poleAvailability, poleType, poleCondition, poleHeight, poleComments]);

  useEffect(() => {
    updateSectionCompletion("Rooftop Details", validateRooftopDetails());
  }, [rooftopAccess, rooftopType, rooftopCondition, rooftopHeight, rooftopComments]);

  useEffect(() => {
    updateSectionCompletion("Tower Details", validateTowerDetails());
  }, [towerAvailability, towerType, towerCondition, towerHeight, towerComments]);

  useEffect(() => {
    updateSectionCompletion("Additional Notes", validateAdditionalNotes());
  }, [additionalNotes]);

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
      case "siteType":
        setSiteType(value);
        break;
      case "siteId":
        setSiteId(value);
        break;
      case "address":
        setAddress(value);
        break;
      case "gpsCoordinates":
        setGpsCoordinates(value);
        break;
      case "buildingPhoto":
        setBuildingPhoto(value);
        break;
      case "status":
        setStatus(value);
        break;
      case "contactPersonName":
        setContactPersonName(value);
        break;
      case "contactPersonNumber":
        setContactPersonNumber(value);
        break;
      case "accessToSite":
        setAccessToSite(value);
        break;
      case "siteAccessibilityComments":
        setSiteAccessibilityComments(value);
        break;
      case "networkAvailability":
        setNetworkAvailability(value);
        break;
      case "existingNetworkInfrastructure":
        setExistingNetworkInfrastructure(value);
        break;
      case "routerLocation":
        setRouterLocation(value);
        break;
      case "routerPowerAvailability":
        setRouterPowerAvailability(value);
        break;
      case "routerRackMounting":
        setRouterRackMounting(value);
        break;
      case "routerComments":
        setRouterComments(value);
        break;
      case "upsAvailability":
        setUpsAvailability(value);
        break;
      case "upsSpecifications":
        setUpsSpecifications(value);
        break;
      case "upsComments":
        setUpsComments(value);
        break;
      case "dbBoxAvailability":
        setDbBoxAvailability(value);
        break;
      case "dbBoxComments":
        setDbBoxComments(value);
        break;
      case "earthingAvailability":
        setEarthingAvailability(value);
        break;
      case "earthingQuality":
        setEarthingQuality(value);
        break;
      case "earthingComments":
        setEarthingComments(value);
        break;
      case "lightningProtectionAvailability":
        setLightningProtectionAvailability(value);
        break;
      case "lightningProtectionType":
        setLightningProtectionType(value);
        break;
      case "lightningProtectionComments":
        setLightningProtectionComments(value);
        break;
      case "surgeProtectionAvailability":
        setSurgeProtectionAvailability(value);
        break;
      case "surgeProtectionType":
        setSurgeProtectionType(value);
        break;
      case "surgeProtectionComments":
        setSurgeProtectionComments(value);
        break;
      case "poleAvailability":
        setPoleAvailability(value);
        break;
      case "poleType":
        setPoleType(value);
        break;
      case "poleCondition":
        setPoleCondition(value);
        break;
      case "poleHeight":
        setPoleHeight(value);
        break;
      case "poleComments":
        setPoleComments(value);
        break;
      case "rooftopAccess":
        setRooftopAccess(value);
        break;
      case "rooftopType":
        setRooftopType(value);
        break;
      case "rooftopCondition":
        setRooftopCondition(value);
        break;
      case "rooftopHeight":
        setRooftopHeight(value);
        break;
      case "rooftopComments":
        setRooftopComments(value);
        break;
      case "towerAvailability":
        setTowerAvailability(value);
        break;
      case "towerType":
        setTowerType(value);
        break;
      case "towerCondition":
        setTowerCondition(value);
        break;
      case "towerHeight":
        setTowerHeight(value);
        break;
      case "towerComments":
        setTowerComments(value);
        break;
      case "additionalNotes":
        setAdditionalNotes(value);
        break;
      default:
        break;
    }
  };

  const handleCheckboxChange = (section: string, field: string, value: boolean) => {
    setFormData(prevFormData => {
      const newFormData = { ...prevFormData };
      if (section in newFormData) {
        const sectionData = newFormData[section as keyof EskomSurveyFormData];
        if (typeof sectionData === 'object' && sectionData !== null) {
          const updatedSectionData = { ...sectionData as object, [field]: value };
          (newFormData as any)[section] = updatedSectionData;
        }
      }
      return newFormData;
    });
  };

  const handleFiberCoreChange = (fiberIndex: number, coreIndex: number, value: boolean) => {
    setFormData(prevFormData => {
      const updatedFiberConnections = [...prevFormData.fiberConnections];
      const updatedCores = [...updatedFiberConnections[fiberIndex].cores];
      updatedCores[coreIndex] = { ...updatedCores[coreIndex], used: value };
      updatedFiberConnections[fiberIndex] = { ...updatedFiberConnections[fiberIndex], cores: updatedCores };
      return { ...prevFormData, fiberConnections: updatedFiberConnections };
    });
  };

  const handleCircuitChange = (charger: 'chargerA' | 'chargerB', circuitIndex: number, field: string, value: string | boolean) => {
    setFormData(prevFormData => {
      const updatedCircuits = [...prevFormData.dbBox.circuits[charger]];
      updatedCircuits[circuitIndex] = { ...updatedCircuits[circuitIndex], [field]: value };
      return {
        ...prevFormData,
        dbBox: {
          ...prevFormData.dbBox,
          circuits: {
            ...prevFormData.dbBox.circuits,
            [charger]: updatedCircuits
          }
        }
      };
    });
  };

  const handleGetAISuggestion = async (fieldName: string, currentValue: string) => {
    if (getSuggestion) {
      const suggestion = await getSuggestion(fieldName, currentValue);
      if (suggestion) {
        setAiSuggestions({ ...aiSuggestions, [fieldName]: suggestion });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const restOfFormData = {
        contactPersonName,
        contactPersonNumber,
        accessToSite,
        siteAccessibilityComments,
        networkAvailability,
        existingNetworkInfrastructure,
        routerLocation,
        routerPowerAvailability,
        routerRackMounting,
        routerComments,
        upsAvailability,
        upsSpecifications,
        upsComments,
        dbBoxAvailability,
        dbBox: formData.dbBox,
        dbBoxComments,
        earthingAvailability,
        earthingQuality,
        earthingComments,
        lightningProtectionAvailability,
        lightningProtectionType,
        lightningProtectionComments,
        surgeProtectionAvailability,
        surgeProtectionType,
        surgeProtectionComments,
        poleAvailability,
        poleType,
        poleCondition,
        poleHeight,
        poleComments,
        rooftopAccess,
        rooftopType,
        rooftopCondition,
        rooftopHeight,
        rooftopComments,
        towerAvailability,
        towerType,
        towerCondition,
        towerHeight,
        towerComments,
        additionalNotes,
        fiberConnections: formData.fiberConnections
      };
      
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
        status: status,
        survey_data: restOfFormData as unknown as Json
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

  return (
    <div className="container mx-auto py-8">
      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="site-information" className="w-[100%]">
          <TabsList className="mb-4">
            <TabsTrigger value="site-information">
              <MapPin className="mr-2 h-4 w-4" />
              Site Information
              {sectionCompletion["Site Information"] ? <Check className="ml-2 h-4 w-4 text-green-500" /> : null}
            </TabsTrigger>
            <TabsTrigger value="contact-information">
              <User className="mr-2 h-4 w-4" />
              Contact Information
              {sectionCompletion["Contact Information"] ? <Check className="ml-2 h-4 w-4 text-green-500" /> : null}
            </TabsTrigger>
            <TabsTrigger value="network-infrastructure">
              <Network className="mr-2 h-4 w-4" />
              Network Infrastructure
              {sectionCompletion["Network Infrastructure"] ? <Check className="ml-2 h-4 w-4 text-green-500" /> : null}
            </TabsTrigger>
            <TabsTrigger value="router-details">
              <Router className="mr-2 h-4 w-4" />
              Router Details
              {sectionCompletion["Router Details"] ? <Check className="ml-2 h-4 w-4 text-green-500" /> : null}
            </TabsTrigger>
            <TabsTrigger value="ups-details">
              <BatteryCharging className="mr-2 h-4 w-4" />
              UPS Details
              {sectionCompletion["UPS Details"] ? <Check className="ml-2 h-4 w-4 text-green-500" /> : null}
            </TabsTrigger>
            <TabsTrigger value="db-box-details">
              <Box className="mr-2 h-4 w-4" />
              DB Box Details
              {sectionCompletion["DB Box Details"] ? <Check className="ml-2 h-4 w-4 text-green-500" /> : null}
            </TabsTrigger>
            <TabsTrigger value="earthing-details">
              <Shield className="mr-2 h-4 w-4" />
              Earthing Details
              {sectionCompletion["Earthing Details"] ? <Check className="ml-2 h-4 w-4 text-green-500" /> : null}
            </TabsTrigger>
            <TabsTrigger value="lightning-protection">
              <CloudLightning className="mr-2 h-4 w-4" />
              Lightning Protection
              {sectionCompletion["Lightning Protection"] ? <Check className="ml-2 h-4 w-4 text-green-500" /> : null}
            </TabsTrigger>
            <TabsTrigger value="surge-protection">
              <Zap className="mr-2 h-4 w-4" />
              Surge Protection
              {sectionCompletion["Surge Protection"] ? <Check className="ml-2 h-4 w-4 text-green-500" /> : null}
            </TabsTrigger>
            <TabsTrigger value="pole-details">
              <Columns className="mr-2 h-4 w-4" />
              Pole Details
              {sectionCompletion["Pole Details"] ? <Check className="ml-2 h-4 w-4 text-green-500" /> : null}
            </TabsTrigger>
            <TabsTrigger value="rooftop-details">
              <Home className="mr-2 h-4 w-4" />
              Rooftop Details
              {sectionCompletion["Rooftop Details"] ? <Check className="ml-2 h-4 w-4 text-green-500" /> : null}
            </TabsTrigger>
            <TabsTrigger value="tower-details">
              <Navigation className="mr-2 h-4 w-4" />
              Tower Details
              {sectionCompletion["Tower Details"] ? <Check className="ml-2 h-4 w-4 text-green-500" /> : null}
            </TabsTrigger>
            <TabsTrigger value="additional-notes">
              <Edit className="mr-2 h-4 w-4" />
              Additional Notes
              {sectionCompletion["Additional Notes"] ? <Check className="ml-2 h-4 w-4 text-green-500" /> : null}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="site-information">
            <Card>
              <CardContent className="grid gap-4">
                <h2 className="text-lg font-medium">Site Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="siteName">Site Name</Label>
                    <div className="relative">
                      <Input
                        type="text"
                        id="siteName"
                        name="siteName"
                        value={siteName}
                        onChange={handleInputChange}
                        placeholder="Enter site name"
                      />
                      {aiSuggestions.siteName && (
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                          <Sparkles className="h-5 w-5 text-akhanya cursor-pointer" onClick={() => setSiteName(aiSuggestions.siteName)} />
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="region">Region</Label>
                    <Select onValueChange={value => handleInputChange({ target: { name: "region", value } } as any)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Gauteng">Gauteng</SelectItem>
                        <SelectItem value="Western Cape">Western Cape</SelectItem>
                        <SelectItem value="KwaZulu-Natal">KwaZulu-Natal</SelectItem>
                        <SelectItem value="Eastern Cape">Eastern Cape</SelectItem>
                        <SelectItem value="Northern Cape">Northern Cape</SelectItem>
                        <SelectItem value="Limpopo">Limpopo</SelectItem>
                        <SelectItem value="Mpumalanga">Mpumalanga</SelectItem>
                        <SelectItem value="North West">North West</SelectItem>
                        <SelectItem value="Free State">Free State</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      type="date"
                      id="date"
                      name="date"
                      value={date}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="siteType">Site Type</Label>
                    <Input
                      type="text"
                      id="siteType"
                      name="siteType"
                      value={siteType}
                      onChange={handleInputChange}
                      placeholder="Enter site type"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="siteId">Site ID</Label>
                    <Input
                      type="text"
                      id="siteId"
                      name="siteId"
                      value={siteId}
                      onChange={handleInputChange}
                      placeholder="Enter site ID"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      type="text"
                      id="address"
                      name="address"
                      value={address}
                      onChange={handleInputChange}
                      placeholder="Enter address"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="gpsCoordinates">GPS Coordinates</Label>
                    <Input
                      type="text"
                      id="gpsCoordinates"
                      name="gpsCoordinates"
                      value={gpsCoordinates}
                      onChange={handleInputChange}
                      placeholder="Enter GPS coordinates"
                    />
                  </div>
                  <div>
                    <Label htmlFor="buildingPhoto">Building Photo</Label>
                    <Input
                      type="text"
                      id="buildingPhoto"
                      name="buildingPhoto"
                      value={buildingPhoto}
                      onChange={handleInputChange}
                      placeholder="Enter building photo URL"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Input
                    type="text"
                    id="status"
                    name="status"
                    value={status}
                    onChange={handleInputChange}
                    placeholder="Enter status"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Additional TabsContent sections would be here */}
          {/* For brevity, we're only showing the first one */}
        </Tabs>

        <div className="mt-6 flex justify-end">
          <Button type="submit" className="bg-akhanya hover:bg-akhanya/80">
            Submit Survey
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EskomSiteSurveyForm;
