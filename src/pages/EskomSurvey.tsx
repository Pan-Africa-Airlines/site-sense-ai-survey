
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import NavigationBar from "@/components/NavigationBar";
import NetworkingBanner from "@/components/NetworkingBanner";
import { Button } from "@/components/ui/button";
import { useAI } from "@/contexts/AIContext";
import { Sparkles, FileText, Save, ArrowLeft, CheckCircle, AlertCircle, Eye } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import Footer from "@/components/Footer";
import EskomSurveyTabs from "@/components/EskomSurveyTabs";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const EskomSurvey = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isNewSurvey = location.pathname === "/eskom-survey/new";
  
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);
  const { isProcessing } = useAI();
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  const [formData, setFormData] = useState({
    // Site Information
    siteName: "",
    siteId: "",
    siteType: "",
    region: "",
    date: new Date().toISOString().split('T')[0],
    address: "",
    gpsCoordinates: "",
    buildingPhoto: "",
    googleMapView: "",
    
    // Building Information
    buildingName: "",
    buildingType: "",
    floorLevel: "",
    equipmentRoomName: "",
    
    // Access Procedure
    accessRequirements: "",
    securityRequirements: "",
    vehicleType: "",
    
    // Site Contacts
    siteContacts: [
      { name: "", cellphone: "", email: "" },
      { name: "", cellphone: "", email: "" },
      { name: "", cellphone: "", email: "" }
    ],
    
    // Equipment Room General
    cableAccess: "",
    roomLighting: "",
    fireProtection: "",
    coolingMethod: "",
    coolingRating: "",
    roomTemperature: "",
    equipmentRoomCondition: "",
    
    // Cabinet Space Planning
    roomLayoutDrawing: "",
    numberOfRouters: "",
    roomLayoutMarkup: "",
    additionalDrawings: [""],
    
    // Transport Platforms
    transportLinks: [
      { linkNumber: "1", linkType: "", direction: "", capacity: "" },
      { linkNumber: "2", linkType: "", direction: "", capacity: "" },
      { linkNumber: "3", linkType: "", direction: "", capacity: "" },
      { linkNumber: "4", linkType: "", direction: "", capacity: "" }
    ],
    
    // DC Power
    chargerA: "",
    chargerB: "",
    powerSupplyMethod: "",
    cableLength: "",
    endOfAisleLayout: "",
    
    // Photos
    equipmentRoomPhotos: [""],
    cabinetLocationPhotos: [""],
    powerDistributionPhotos: [""],
    transportEquipmentPhotos: [""],
    opticalFramePhotos: [""],
    accessEquipmentPhotos: [""],
    cableRoutingPhotos: [""],
    ceilingHVACPhotos: [""],
    
    // Requirements
    accessSecurity: "",
    coolingVentilation: "",
    flooringType: "",
    fireProt: "",
    lighting: "",
    roofType: "",
    powerCables: "",
    
    // General Remarks
    remarks: "",
    
    // ODF Layout
    odfCabinets: [
      {
        name: "Cabinet 1",
        direction: "",
        connectionType: "",
        cores: "",
        usedPorts: {}
      },
      {
        name: "Cabinet 2",
        direction: "",
        connectionType: "",
        cores: "",
        usedPorts: {}
      },
      {
        name: "Cabinet 3",
        direction: "",
        connectionType: "",
        cores: "",
        usedPorts: {}
      },
      {
        name: "Cabinet 4",
        direction: "",
        connectionType: "",
        cores: "",
        usedPorts: {}
      }
    ],
    
    // Cabinet Layout
    cabinetLayoutDrawing: "",
    
    // 50V Charger Layout
    chargerDetails: {
      siteName: "",
      chargerLabel: "",
      chargerType: "Single",
      chargerA: Array.from({ length: 26 }, (_, i) => ({
        circuit: String.fromCharCode(65 + i),
        mcbRating: "",
        used: false,
        label: ""
      })),
      chargerB: Array.from({ length: 26 }, (_, i) => ({
        circuit: String.fromCharCode(65 + i),
        mcbRating: "",
        used: false,
        label: ""
      }))
    },
    
    // Attendee Information
    attendees: [
      { date: "", name: "", company: "", department: "", cellphone: "" },
      { date: "", name: "", company: "", department: "", cellphone: "" },
      { date: "", name: "", company: "", department: "", cellphone: "" },
      { date: "", name: "", company: "", department: "", cellphone: "" },
      { date: "", name: "", company: "", department: "", cellphone: "" }
    ],
    
    // Survey Outcome
    oemContractor: {
      name: "",
      signature: "",
      date: "",
      accepted: false,
      comments: ""
    },
    oemEngineer: {
      name: "",
      signature: "",
      date: "",
      accepted: false,
      comments: ""
    },
    eskomRepresentative: {
      name: "",
      signature: "",
      date: "",
      accepted: false,
      comments: ""
    },
    
    // Room Layout Scanned Drawing
    scannedRoomLayout: "",
    
    // Final Notes
    finalNotes: "",
  });
  
  const { isLoading, error, data: surveyData } = useQuery({
    queryKey: ['survey', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('site_surveys')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!id && !isNewSurvey,
  });
  
  useEffect(() => {
    if (surveyData) {
      setFormData(prevData => {
        // Ensure survey_data is an object before spreading it
        const surveyDataObj = typeof surveyData.survey_data === 'object' && surveyData.survey_data !== null 
          ? surveyData.survey_data 
          : {};
        
        return {
          ...prevData,
          siteName: surveyData.site_name || "",
          siteId: surveyData.site_id || "",
          siteType: surveyData.site_type || "",
          region: surveyData.region || "",
          date: surveyData.date || new Date().toISOString().split('T')[0],
          address: surveyData.address || "",
          gpsCoordinates: surveyData.gps_coordinates || "",
          buildingPhoto: surveyData.building_photo || "",
          ...surveyDataObj  // Now we're spreading a valid object with a proper type check
        }
      });
    }
  }, [surveyData]);
  
  const saveSurveyMutation = useMutation({
    mutationFn: async () => {
      const userId = localStorage.getItem("userId");
      const surveyDataToSave = {
        site_name: formData.siteName,
        site_id: formData.siteId,
        site_type: formData.siteType,
        region: formData.region,
        date: formData.date,
        address: formData.address,
        gps_coordinates: formData.gpsCoordinates,
        building_photo: formData.buildingPhoto,
        user_id: userId || null,
        survey_data: formData,
      };
      
      if (id && !isNewSurvey) {
        const { data, error } = await supabase
          .from('site_surveys')
          .update(surveyDataToSave)
          .eq('id', id);
          
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('site_surveys')
          .insert(surveyDataToSave)
          .select();
          
        if (error) throw error;
        return data;
      }
    },
    onSuccess: (data) => {
      toast.success(`Survey ${id ? 'updated' : 'created'} successfully!`);
      if (!id) {
        navigate(`/eskom-survey/${data[0].id}`);
      }
    },
    onError: (error) => {
      console.error("Error saving survey:", error);
      toast.error(`Failed to ${id ? 'update' : 'create'} survey. Please try again.`);
    },
  });
  
  const handleInputChange = (field: string, value: any) => {
    setFormData(prevData => {
      if (field.includes('.')) {
        const [parentField, childField] = field.split('.');
        const parentData = prevData[parentField as keyof typeof prevData];
        if (parentData && typeof parentData === 'object') {
          return {
            ...prevData,
            [parentField]: {
              ...parentData,
              [childField]: value
            }
          };
        }
        return prevData;
      }
      
      if (field.includes('[') && field.includes(']')) {
        const match = field.match(/(.+?)\[(\d+)\]/);
        if (match) {
          const [, arrayName, indexStr] = match;
          const index = parseInt(indexStr);
          const array = [...(prevData[arrayName as keyof typeof prevData] as any[])];
          array[index] = value;
          return {
            ...prevData,
            [arrayName]: array
          };
        }
      }
      
      return {
        ...prevData,
        [field]: value
      };
    });
  };
  
  const handleSave = async (status = 'draft') => {
    setIsSaving(true);
    try {
      await saveSurveyMutation.mutateAsync();
    } catch (error) {
      console.error("Error in handleSave:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    await handleSave('submitted');
  };

  const goBack = () => {
    navigate('/eskom-surveys');
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <NavigationBar />
        <div className="container mx-auto px-4 py-8 flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-akhanya mb-4"></div>
            <p>Loading survey data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <NavigationBar />
        <div className="container mx-auto px-4 py-8 flex-grow">
          <div className="bg-red-50 p-4 rounded-md mb-4 flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-800">Error loading survey</h3>
              <p className="text-red-700">There was a problem loading the survey. Please try again.</p>
              <Button onClick={goBack} className="mt-2" variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Surveys
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavigationBar />
      <NetworkingBanner
        title="Eskom OT IP/MPLS Network"
        subtitle="Site Survey Report"
      />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex gap-2 mb-6">
          <Button variant="outline" onClick={goBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Surveys
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-akhanya">
              {isNewSurvey ? "New Eskom Site Survey" : `Edit Survey: ${formData.siteName}`}
            </h2>
            <p className="text-gray-600">
              {isNewSurvey 
                ? "Complete the form below to document the site information" 
                : `Last updated: ${surveyData?.updated_at ? new Date(surveyData.updated_at).toLocaleString() : 'N/A'}`
              }
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className={`flex items-center gap-2 ${
                      showAIRecommendations ? "bg-akhanya-light text-akhanya border-akhanya" : ""
                    }`}
                    onClick={() => setShowAIRecommendations(!showAIRecommendations)}
                  >
                    <Sparkles className="h-4 w-4" />
                    AI Recommendations {showAIRecommendations ? "On" : "Off"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle AI assistance for this form</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => window.open("/lovable-uploads/3d43a04f-8853-44d0-aa58-fe39e729336d.png", "_blank")}
                  >
                    <FileText className="h-4 w-4" />
                    View Template
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View the original survey template</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Button 
              onClick={togglePreview}
              className="flex items-center gap-2"
              variant="outline"
            >
              <Eye className="h-4 w-4" />
              Review Data
            </Button>
            
            <Button 
              onClick={() => handleSave()}
              className="flex items-center gap-2"
              variant="outline"
              disabled={isSaving || saveSurveyMutation.isPending}
            >
              <Save className="h-4 w-4" />
              Save Draft
            </Button>
            
            <Button 
              onClick={handleSubmit}
              className="flex items-center gap-2 bg-akhanya hover:bg-akhanya-dark"
              disabled={isSaving || saveSurveyMutation.isPending}
            >
              <CheckCircle className="h-4 w-4" />
              {isSaving || saveSurveyMutation.isPending ? "Saving..." : "Submit Survey"}
            </Button>
          </div>
        </div>
        
        <div className="mb-8">
          <EskomSurveyTabs 
            formData={formData} 
            onInputChange={handleInputChange} 
            showAIRecommendations={showAIRecommendations} 
          />
        </div>
      </div>
      
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Survey Data Preview</DialogTitle>
            <DialogDescription>
              Review all data before exporting to PDF
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 text-sm">
            <h3 className="font-semibold text-lg mb-2">Site Information</h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div><span className="font-medium">Site Name:</span> {formData.siteName}</div>
              <div><span className="font-medium">Site ID:</span> {formData.siteId}</div>
              <div><span className="font-medium">Site Type:</span> {formData.siteType}</div>
              <div><span className="font-medium">Region:</span> {formData.region}</div>
              <div><span className="font-medium">Date:</span> {formData.date}</div>
              <div><span className="font-medium">Address:</span> {formData.address}</div>
              <div><span className="font-medium">GPS Coordinates:</span> {formData.gpsCoordinates}</div>
            </div>
            
            <h3 className="font-semibold text-lg mb-2">Building Information</h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div><span className="font-medium">Building Name:</span> {formData.buildingName}</div>
              <div><span className="font-medium">Building Type:</span> {formData.buildingType}</div>
              <div><span className="font-medium">Floor Level:</span> {formData.floorLevel}</div>
              <div><span className="font-medium">Equipment Room:</span> {formData.equipmentRoomName}</div>
            </div>
            
            <h3 className="font-semibold text-lg mb-2">Access Information</h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div><span className="font-medium">Access Requirements:</span> {formData.accessRequirements}</div>
              <div><span className="font-medium">Security Requirements:</span> {formData.securityRequirements}</div>
              <div><span className="font-medium">Vehicle Type:</span> {formData.vehicleType}</div>
            </div>
            
            <h3 className="font-semibold text-lg mb-2">Equipment Room Details</h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div><span className="font-medium">Cable Access:</span> {formData.cableAccess}</div>
              <div><span className="font-medium">Room Lighting:</span> {formData.roomLighting}</div>
              <div><span className="font-medium">Fire Protection:</span> {formData.fireProtection}</div>
              <div><span className="font-medium">Cooling Method:</span> {formData.coolingMethod}</div>
              <div><span className="font-medium">Cooling Rating:</span> {formData.coolingRating}</div>
              <div><span className="font-medium">Room Temperature:</span> {formData.roomTemperature}</div>
              <div><span className="font-medium">Room Condition:</span> {formData.equipmentRoomCondition}</div>
            </div>
            
            <h3 className="font-semibold text-lg mb-2">Requirements & Remarks</h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div><span className="font-medium">Access Security:</span> {formData.accessSecurity}</div>
              <div><span className="font-medium">Cooling/Ventilation:</span> {formData.coolingVentilation}</div>
              <div><span className="font-medium">Flooring Type:</span> {formData.flooringType}</div>
              <div><span className="font-medium">Fire Protection:</span> {formData.fireProt}</div>
              <div><span className="font-medium">Lighting:</span> {formData.lighting}</div>
              <div><span className="font-medium">Roof Type:</span> {formData.roofType}</div>
              <div><span className="font-medium">Power Cables:</span> {formData.powerCables}</div>
              <div><span className="font-medium">General Remarks:</span> {formData.remarks}</div>
            </div>
            
            <h3 className="font-semibold text-lg mb-2">Survey Outcome</h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div><span className="font-medium">OEM Contractor:</span> {formData.oemContractor.name}</div>
              <div><span className="font-medium">Status:</span> {formData.oemContractor.accepted ? 'Accepted' : 'Not Accepted'}</div>
              <div><span className="font-medium">OEM Engineer:</span> {formData.oemEngineer.name}</div>
              <div><span className="font-medium">Status:</span> {formData.oemEngineer.accepted ? 'Accepted' : 'Not Accepted'}</div>
              <div><span className="font-medium">Eskom Representative:</span> {formData.eskomRepresentative.name}</div>
              <div><span className="font-medium">Status:</span> {formData.eskomRepresentative.accepted ? 'Accepted' : 'Not Accepted'}</div>
            </div>
            
            <h3 className="font-semibold text-lg mb-2">Final Notes</h3>
            <div className="mb-4">
              <p>{formData.finalNotes}</p>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <Button onClick={togglePreview} variant="outline" className="mr-2">Close</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default EskomSurvey;
