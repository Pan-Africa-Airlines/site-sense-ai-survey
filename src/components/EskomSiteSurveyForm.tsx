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
        const sectionObj = { ...newFormData[section as keyof EskomSurveyFormData] };
        if (typeof sectionObj === 'object' && sectionObj !== null) {
          const newSectionObj = { ...sectionObj, [field]: value };
          newFormData[section as keyof EskomSurveyFormData] = newSectionObj as any;
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
        survey_data: restOfFormData as Json
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

          <TabsContent value="contact-information">
            <Card>
              <CardContent className="grid gap-4">
                <h2 className="text-lg font-medium">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactPersonName">Contact Person Name</Label>
                    <Input
                      type="text"
                      id="contactPersonName"
                      name="contactPersonName"
                      value={contactPersonName}
                      onChange={handleInputChange}
                      placeholder="Enter contact person name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactPersonNumber">Contact Person Number</Label>
                    <Input
                      type="text"
                      id="contactPersonNumber"
                      name="contactPersonNumber"
                      value={contactPersonNumber}
                      onChange={handleInputChange}
                      placeholder="Enter contact person number"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="accessToSite">Access to Site</Label>
                  <Textarea
                    id="accessToSite"
                    name="accessToSite"
                    value={accessToSite}
                    onChange={handleInputChange}
                    placeholder="Describe access to site"
                  />
                </div>
                <div>
                  <Label htmlFor="siteAccessibilityComments">Site Accessibility Comments</Label>
                  <Textarea
                    id="siteAccessibilityComments"
                    name="siteAccessibilityComments"
                    value={siteAccessibilityComments}
                    onChange={handleInputChange}
                    placeholder="Enter site accessibility comments"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="network-infrastructure">
            <Card>
              <CardContent className="grid gap-4">
                <h2 className="text-lg font-medium">Network Infrastructure</h2>
                <div>
                  <Label htmlFor="networkAvailability">Network Availability</Label>
                  <Textarea
                    id="networkAvailability"
                    name="networkAvailability"
                    value={networkAvailability}
                    onChange={handleInputChange}
                    placeholder="Describe network availability"
                  />
                </div>
                <div>
                  <Label htmlFor="existingNetworkInfrastructure">Existing Network Infrastructure</Label>
                  <Textarea
                    id="existingNetworkInfrastructure"
                    name="existingNetworkInfrastructure"
                    value={existingNetworkInfrastructure}
                    onChange={handleInputChange}
                    placeholder="Describe existing network infrastructure"
                  />
                </div>
                <div>
                  <Label>Fiber Connections</Label>
                  {formData.fiberConnections.map((fiber, fiberIndex) => (
                    <div key={fiberIndex} className="mb-4 p-4 border rounded">
                      <h3 className="text-md font-medium mb-2">Fiber Connection {fiberIndex + 1}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`direction-${fiberIndex}`}>Direction</Label>
                          <Input
                            type="text"
                            id={`direction-${fiberIndex}`}
                            name={`direction-${fiberIndex}`}
                            value={fiber.direction}
                            onChange={(e) => {
                              const updatedFiberConnections = [...formData.fiberConnections];
                              updatedFiberConnections[fiberIndex] = { ...updatedFiberConnections[fiberIndex], direction: e.target.value };
                              setFormData({ ...formData, fiberConnections: updatedFiberConnections });
                            }}
                            placeholder="Enter direction"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`connectionType-${fiberIndex}`}>Connection Type</Label>
                          <Input
                            type="text"
                            id={`connectionType-${fiberIndex}`}
                            name={`connectionType-${fiberIndex}`}
                            value={fiber.connectionType}
                            onChange={(e) => {
                              const updatedFiberConnections = [...formData.fiberConnections];
                              updatedFiberConnections[fiberIndex] = { ...updatedFiberConnections[fiberIndex], connectionType: e.target.value };
                              setFormData({ ...formData, fiberConnections: updatedFiberConnections });
                            }}
                            placeholder="Enter connection type"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`numberOfCores-${fiberIndex}`}>Number of Cores</Label>
                          <Input
                            type="text"
                            id={`numberOfCores-${fiberIndex}`}
                            name={`numberOfCores-${fiberIndex}`}
                            value={fiber.numberOfCores}
                            onChange={(e) => {
                              const updatedFiberConnections = [...formData.fiberConnections];
                              updatedFiberConnections[fiberIndex] = { ...updatedFiberConnections[fiberIndex], numberOfCores: e.target.value };
                              setFormData({ ...formData, fiberConnections: updatedFiberConnections });
                            }}
                            placeholder="Enter number of cores"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <Label>Cores</Label>
                        <div className="grid grid-cols-6 gap-2">
                          {fiber.cores.map((core, coreIndex) => (
                            <div key={coreIndex} className="flex items-center space-x-2">
                              <Checkbox
                                id={`core-${fiberIndex}-${coreIndex}`}
                                checked={core.used}
                                onCheckedChange={(checked) => handleFiberCoreChange(fiberIndex, coreIndex, checked || false)}
                              />
                              <Label htmlFor={`core-${fiberIndex}-${coreIndex}`}>{core.number}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="router-details">
            <Card>
              <CardContent className="grid gap-4">
                <h2 className="text-lg font-medium">Router Details</h2>
                <div>
                  <Label htmlFor="routerLocation">Router Location</Label>
                  <Input
                    type="text"
                    id="routerLocation"
                    name="routerLocation"
                    value={routerLocation}
                    onChange={handleInputChange}
                    placeholder="Enter router location"
                  />
                </div>
                <div>
                  <Label htmlFor="routerPowerAvailability">Router Power Availability</Label>
                  <Input
                    type="text"
                    id="routerPowerAvailability"
                    name="routerPowerAvailability"
                    value={routerPowerAvailability}
                    onChange={handleInputChange}
                    placeholder="Enter router power availability"
                  />
                </div>
                <div>
                  <Label htmlFor="routerRackMounting">Router Rack Mounting</Label>
                  <Input
                    type="text"
                    id="routerRackMounting"
                    name="routerRackMounting"
                    value={routerRackMounting}
                    onChange={handleInputChange}
                    placeholder="Enter router rack mounting"
                  />
                </div>
                <div>
                  <Label htmlFor="routerComments">Router Comments</Label>
                  <Textarea
                    id="routerComments"
                    name="routerComments"
                    value={routerComments}
                    onChange={handleInputChange}
                    placeholder="Enter router comments"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ups-details">
            <Card>
              <CardContent className="grid gap-4">
                <h2 className="text-lg font-medium">UPS Details</h2>
                <div>
                  <Label htmlFor="upsAvailability">UPS Availability</Label>
                  <Input
                    type="text"
                    id="upsAvailability"
                    name="upsAvailability"
                    value={upsAvailability}
                    onChange={handleInputChange}
                    placeholder="Enter UPS availability"
                  />
                </div>
                <div>
                  <Label htmlFor="upsSpecifications">UPS Specifications</Label>
                  <Input
                    type="text"
                    id="upsSpecifications"
                    name="upsSpecifications"
                    value={upsSpecifications}
                    onChange={handleInputChange}
                    placeholder="Enter UPS specifications"
                  />
                </div>
                <div>
                  <Label htmlFor="upsComments">UPS Comments</Label>
                  <Textarea
                    id="upsComments"
                    name="upsComments"
                    value={upsComments}
                    onChange={handleInputChange}
                    placeholder="Enter UPS comments"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="db-box-details">
            <Card>
              <CardContent className="grid gap-4">
                <h2 className="text-lg font-medium">DB Box Details</h2>
                <div>
                  <Label htmlFor="dbBoxAvailability">DB Box Availability</Label>
                  <Input
                    type="text"
                    id="dbBoxAvailability"
                    name="dbBoxAvailability"
                    value={dbBoxAvailability}
                    onChange={handleInputChange}
                    placeholder="Enter DB Box availability"
                  />
                </div>
                <div>
                  <Label htmlFor="dbBox.chargerLabel">DB Box Charger Label</Label>
                  <Input
                    type="text"
                    id="dbBox.chargerLabel"
                    name="dbBox.chargerLabel"
                    value={formData.dbBox.chargerLabel}
                    onChange={handleInputChange}
                    placeholder="Enter DB Box charger label"
                  />
                </div>
                <div>
                  <Label htmlFor="dbBoxComments">DB Box Comments</Label>
                  <Textarea
                    id="dbBoxComments"
                    name="dbBoxComments"
                    value={dbBoxComments}
                    onChange={handleInputChange}
                    placeholder="Enter DB Box comments"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earthing-details">
            <Card>
              <CardContent className="grid gap-4">
                <h2 className="text-lg font-medium">Earthing Details</h2>
                <div>
                  <Label htmlFor="earthingAvailability">Earthing Availability</Label>
                  <Input
                    type="text"
                    id="earthingAvailability"
                    name="earthingAvailability"
                    value={earthingAvailability}
                    onChange={handleInputChange}
                    placeholder="Enter earthing availability"
                  />
                </div>
                <div>
                  <Label htmlFor="earthingQuality">Earthing Quality</Label>
                  <Input
                    type="text"
                    id="earthingQuality"
                    name="earthingQuality"
                    value={earthingQuality}
                    onChange={handleInputChange}
                    placeholder="Enter earthing quality"
                  />
                </div>
                <div>
                  <Label htmlFor="earthingComments">Earthing Comments</Label>
                  <Textarea
                    id="earthingComments"
                    name="earthingComments"
                    value={earthingComments}
                    onChange={handleInputChange}
                    placeholder="Enter earthing comments"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lightning-protection">
            <Card>
              <CardContent className="grid gap-4">
                <h2 className="text-lg font-medium">Lightning Protection</h2>
                <div>
                  <Label htmlFor="lightningProtectionAvailability">Lightning Protection Availability</Label>
                  <Input
                    type="text"
                    id="lightningProtectionAvailability"
                    name="lightningProtectionAvailability"
                    value={lightningProtectionAvailability}
                    onChange={handleInputChange}
                    placeholder="Enter lightning protection availability"
                  />
                </div>
                <div>
                  <Label htmlFor="lightningProtectionType">Lightning Protection Type</Label>
                  <Input
                    type="text"
                    id="lightningProtectionType"
                    name="lightningProtectionType"
                    value={lightningProtectionType}
                    onChange={handleInputChange}
                    placeholder="Enter lightning protection type"
                  />
                </div>
                <div>
                  <Label htmlFor="lightningProtectionComments">Lightning Protection Comments</Label>
                  <Textarea
                    id="lightningProtectionComments"
                    name="lightningProtectionComments"
                    value={lightningProtectionComments}
                    onChange={handleInputChange}
                    placeholder="Enter lightning protection comments"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="surge-protection">
            <Card>
              <CardContent className="grid gap-4">
                <h2 className="text-lg font-medium">Surge Protection</h2>
                <div>
                  <Label htmlFor="surgeProtectionAvailability">Surge Protection Availability</Label>
                  <Input
                    type="text"
                    id="surgeProtectionAvailability"
                    name="surgeProtectionAvailability"
                    value={surgeProtectionAvailability}
                    onChange={handleInputChange}
                    placeholder="Enter surge protection availability"
                  />
                </div>
                <div>
                  <Label htmlFor="surgeProtectionType">Surge Protection Type</Label>
                  <Input
                    type="text"
                    id="surgeProtectionType"
                    name="surgeProtectionType"
                    value={surgeProtectionType}
                    onChange={handleInputChange}
                    placeholder="Enter surge protection type"
                  />
                </div>
                <div>
                  <Label htmlFor="surgeProtectionComments">Surge Protection Comments</Label>
                  <Textarea
                    id="surgeProtectionComments"
                    name="surgeProtectionComments"
                    value={surgeProtectionComments}
                    onChange={handleInputChange}
                    placeholder="Enter surge protection comments"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pole-details">
            <Card>
              <CardContent className="grid gap-4">
                <h2 className="text-lg font-medium">Pole Details</h2>
                <div>
                  <Label htmlFor="poleAvailability">Pole Availability</Label>
                  <Input
                    type="text"
                    id="poleAvailability"
                    name="poleAvailability"
                    value={poleAvailability}
                    onChange={handleInputChange}
                    placeholder="Enter pole availability"
                  />
                </div>
                <div>
                  <Label htmlFor="poleType">Pole Type</Label>
                  <Input
                    type="text"
                    id="poleType"
                    name="poleType"
                    value={poleType}
                    onChange={handleInputChange}
                    placeholder="Enter pole type"
                  />
                </div>
                <div>
                  <Label htmlFor="poleCondition">Pole Condition</Label>
                  <Input
                    type="text"
                    id="poleCondition"
                    name="poleCondition"
                    value={poleCondition}
                    onChange={handleInputChange}
                    placeholder="Enter pole condition"
                  />
                </div>
                <div>
                  <Label htmlFor="poleHeight">Pole Height</Label>
                  <Input
                    type="text"
                    id="poleHeight"
                    name="poleHeight"
                    value={poleHeight}
                    onChange={handleInputChange}
                    placeholder="Enter pole height"
                  />
                </div>
                <div>
                  <Label htmlFor="poleComments">Pole Comments</Label>
                  <Textarea
                    id="poleComments"
                    name="poleComments"
                    value={poleComments}
                    onChange={handleInputChange}
                    placeholder="Enter pole comments"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rooftop-details">
            <Card>
              <CardContent className="grid gap-4">
                <h2 className="text-lg font-medium">Rooftop Details</h2>
                <div>
                  <Label htmlFor="rooftopAccess">Rooftop Access</Label>
                  <Input
                    type="text"
                    id="rooftopAccess"
                    name="rooftopAccess"
                    value={rooftopAccess}
                    onChange={handleInputChange}
                    placeholder="Enter rooftop access"
                  />
                </div>
                <div>
                  <Label htmlFor="rooftopType">Rooftop Type</Label>
                  <Input
                    type="text"
                    id="rooftopType"
                    name="rooftopType"
                    value={rooftopType}
                    onChange={handleInputChange}
                    placeholder="Enter rooftop type"
                  />
                </div>
                <div>
                  <Label htmlFor="rooftopCondition">Rooftop Condition</Label>
                  <Input
                    type="text"
                    id="rooftopCondition"
                    name="rooftopCondition"
                    value={rooftopCondition}
                    onChange={handleInputChange}
                    placeholder="Enter rooftop condition"
                  />
                </div>
                <div>
                  <Label htmlFor="rooftopHeight">Rooftop Height</Label>
                  <Input
                    type="text"
                    id="rooftopHeight"
                    name="rooftopHeight"
                    value={rooftopHeight}
                    onChange={handleInputChange}
                    placeholder="Enter rooftop height"
                  />
                </div>
                <div>
                  <Label htmlFor="rooftopComments">Rooftop Comments</Label>
                  <Textarea
                    id="rooftopComments"
                    name="rooftopComments"
                    value={rooftopComments}
                    onChange={handleInputChange}
                    placeholder="Enter rooftop comments"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tower-details">
            <Card>
              <CardContent className="grid gap-4">
                <h2 className="text-lg font-medium">Tower Details</h2>
                <div>
                  <Label htmlFor="towerAvailability">Tower Availability</Label>
                  <Input
                    type="text"
                    id="towerAvailability"
                    name="towerAvailability"
                    value={towerAvailability}
                    onChange={handleInputChange}
                    placeholder="Enter tower availability"
                  />
                </div>
                <div>
                  <Label htmlFor="towerType">Tower Type</Label>
                  <Input
                    type="text"
                    id="towerType"
                    name="towerType"
                    value={towerType}
                    onChange={handleInputChange}
                    placeholder="Enter tower type"
                  />
                </div>
                <div>
                  <Label htmlFor="towerCondition">Tower Condition</Label>
                  <Input
                    type="text"
                    id="towerCondition"
                    name="towerCondition"
                    value={towerCondition}
                    onChange={handleInputChange}
                    placeholder="Enter tower condition"
                  />
                </div>
                <div>
                  <Label htmlFor="towerHeight">Tower Height</Label>
                  <Input
                    type="text"
                    id="towerHeight"
                    name="towerHeight"
                    value={towerHeight}
                    onChange={handleInputChange}
                    placeholder="Enter tower height"
                  />
                </div>
                <div>
                  <Label htmlFor="towerComments">Tower Comments</Label>
                  <Textarea
                    id="towerComments"
                    name="towerComments"
                    value={towerComments}
                    onChange={handleInputChange}
                    placeholder="Enter tower comments"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="additional-notes">
            <Card>
              <CardContent className="grid gap-4">
                <h2 className="text-lg font-medium">Additional Notes</h2>
                <div>
                  <Label htmlFor="additionalNotes">Additional Notes</Label>
                  <Textarea
                    id="additionalNotes"
                    name="additionalNotes"
                    value={additionalNotes}
                    onChange={handleInputChange}
                    placeholder="Enter additional notes"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
};

export default EskomSiteSurveyForm;
