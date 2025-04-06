
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import NavigationBar from "@/components/NavigationBar";
import NetworkingBanner from "@/components/NetworkingBanner";
import { Button } from "@/components/ui/button";
import { useAI } from "@/contexts/AIContext";
import { Sparkles, FileText, Save, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import Footer from "@/components/Footer";
import EskomSurveyTabs from "@/components/EskomSurveyTabs";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation } from "@tanstack/react-query";

const EskomSurvey = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isNewSurvey = location.pathname === "/eskom-survey/new";
  
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);
  const { isProcessing } = useAI();
  const [isSaving, setIsSaving] = useState(false);
  
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
  
  // Fetch survey data if editing an existing survey
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
  
  // Update form data when survey data is fetched
  useEffect(() => {
    if (surveyData) {
      // Populate form with data from database
      setFormData(prevData => ({
        ...prevData,
        siteName: surveyData.site_name || "",
        siteId: surveyData.site_id || "",
        siteType: surveyData.site_type || "",
        region: surveyData.region || "",
        date: surveyData.date || new Date().toISOString().split('T')[0],
        address: surveyData.address || "",
        gpsCoordinates: surveyData.gps_coordinates || "",
        buildingPhoto: surveyData.building_photo || "",
        ...surveyData.survey_data,
      }));
    }
  }, [surveyData]);
  
  const saveSurveyMutation = useMutation({
    mutationFn: async (data: any) => {
      const userId = localStorage.getItem("userId");
      
      if (id && !isNewSurvey) {
        // Update existing survey
        const { data: updatedData, error } = await supabase
          .from('site_surveys')
          .update({
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
          })
          .eq('id', id);
          
        if (error) throw error;
        return updatedData;
      } else {
        // Create new survey
        const { data: newData, error } = await supabase
          .from('site_surveys')
          .insert({
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
          })
          .select();
          
        if (error) throw error;
        return newData;
      }
    },
    onSuccess: (data) => {
      toast.success(`Survey ${id ? 'updated' : 'created'} successfully!`);
      if (!id) {
        // If it was a new survey, navigate to the edit page
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
      // Handle nested fields with dot notation (e.g., "oemContractor.name")
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
      
      // Handle array indexing with square brackets (e.g., "additionalDrawings[0]")
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
      
      // Handle regular fields
      return {
        ...prevData,
        [field]: value
      };
    });
  };
  
  const handleSave = async (status = 'draft') => {
    setIsSaving(true);
    try {
      // Save to database
      await saveSurveyMutation.mutateAsync({ ...formData, status });
    } catch (error) {
      console.error("Error in handleSave:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    // Similar to handleSave but sets status to submitted
    await handleSave('submitted');
  };

  const goBack = () => {
    navigate('/eskom-survey');
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
      <Footer />
    </div>
  );
};

export default EskomSurvey;
