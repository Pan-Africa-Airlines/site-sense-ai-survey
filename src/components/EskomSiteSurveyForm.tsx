import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useAI } from "@/contexts/AIContext";
import { toast } from "sonner";
import { MapPin, Info, Check, Calendar, Users, Building, Router, FileText, Power, Radio, Thermometer, Save, Loader } from "lucide-react";
import ImageCapture from "./ImageCapture";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useSearchParams } from "react-router-dom";

interface EskomSiteSurveyFormProps {
  onSubmit?: (data: any) => void;
  assessmentData?: any; // Optional assessment data to pre-fill fields
  showAIRecommendations?: boolean;
}

const EskomSiteSurveyForm: React.FC<EskomSiteSurveyFormProps> = ({ 
  onSubmit, 
  assessmentData, 
  showAIRecommendations = false 
}) => {
  const { latitude, longitude, address, loading: locationLoading } = useGeolocation();
  const { isProcessing, analyzeImage, getSuggestion, enhanceNotes } = useAI();
  const [savedDrafts, setSavedDrafts] = useLocalStorage<Record<string, any>>("eskomSurveyDrafts", {});
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const surveyId = searchParams.get('id');
  
  const initialFormData = {
    // Site Information & Location
    siteName: assessmentData?.siteName || "",
    region: assessmentData?.region || "",
    date: new Date().toISOString().split('T')[0],
    siteId: "",
    siteType: "",
    address: "",
    gpsCoordinates: "",
    buildingPhoto: "",
    
    // Site Visit Attendees
    attendees: [
      { date: "", name: "", company: "", department: "", cellphone: "" }
    ],
    
    // Site Survey Outcome
    surveyOutcome: {
      oemContractor: { name: "", signature: "", date: "", accepted: false, comments: "" },
      oemEngineer: { name: "", signature: "", date: "", accepted: false, comments: "" },
      eskomRepresentative: { name: "", signature: "", date: "", accepted: false, comments: "" }
    },
    
    // Equipment Location
    buildingName: "",
    buildingType: "",
    floorLevel: "",
    roomNumber: "",
    
    // Access Procedure
    accessRequirements: "",
    securityRequirements: "",
    vehicleType: "",
    
    // Eskom Site Owner Contacts
    siteOwnerContacts: [
      { name: "", cellphone: "", email: "" }
    ],
    
    // Equipment Room General
    cableAccess: "",
    roomLighting: "",
    fireProtection: "",
    coolingMethod: "",
    coolingRating: "",
    roomTemperature: "",
    roomCondition: "",
    
    // Equipment Cabinet Space Planning
    numberOfRouters: "",
    cabinetLocationPhoto: "",
    
    // Transport Platforms
    transportLinks: [
      { linkNumber: "1", linkType: "", direction: "", capacity: "" },
      { linkNumber: "2", linkType: "", direction: "", capacity: "" },
      { linkNumber: "3", linkType: "", direction: "", capacity: "" },
      { linkNumber: "4", linkType: "", direction: "", capacity: "" }
    ],
    
    // DC Power Distribution
    chargerALoadCurrent: "",
    chargerBLoadCurrent: "",
    powerSupplyMethod: "",
    dcCableLength: "",
    
    // Photos
    equipmentRoomPhotos: "",
    cabinetLocationPhotos: "",
    dcPowerDistributionPhotos: "",
    transportEquipmentPhotos: "",
    odfPhotos: "",
    accessEquipmentPhotos: "",
    cableRoutingPhotos: "",
    ceilingHvacPhotos: "",
    
    // Installation Requirements
    installationRequirements: {
      accessSecurity: "",
      coolingVentilation: "",
      flooringType: "",
      fireProtection: "",
      roomLighting: "",
      roofType: "",
      powerCables: ""
    },
    
    // General Remarks
    generalRemarks: "",
    
    // Annexure Info
    odfDetails: [
      { 
        cabinetName: "", 
        direction: "", 
        connectionType: "", 
        numberOfCores: "",
        cores: Array(48).fill().map((_, i) => ({ number: i+1, used: false }))
      }
    ],
    
    cabinetLayoutNotes: "",
    
    chargerLoadDistribution: {
      siteName: "",
      chargerLabel: "",
      chargerType: "single", // or "dual"
      circuits: {
        chargerA: Array(26).fill().map((_, i) => ({ 
          circuit: String.fromCharCode(65 + i), 
          mcbRating: "", 
          used: false, 
          label: "" 
        })),
        chargerB: Array(26).fill().map((_, i) => ({ 
          circuit: String.fromCharCode(65 + i), 
          mcbRating: "", 
          used: false, 
          label: "" 
        }))
      }
    },
    
    roomLayoutDrawing: "",
    
    useAIAssistance: true
  };
  
  const [formData, setFormData] = useState(initialFormData);
  const [aiSuggestions, setAiSuggestions] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState("basic");
  const [draftName, setDraftName] = useState<string>("");

  useEffect(() => {
    if (surveyId) {
      fetchSurveyData(surveyId);
    } else {
      const draftId = searchParams.get('draftId');
      if (draftId && savedDrafts[draftId]) {
        setFormData(savedDrafts[draftId]);
        setDraftName(draftId);
        toast.success(`Loaded draft: ${draftId}`);
      }
    }
  }, [savedDrafts, searchParams, surveyId]);

  const fetchSurveyData = async (id: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('site_surveys')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        const surveyData = {
          ...initialFormData,
          ...data.survey_data,
          siteName: data.site_name,
          region: data.region,
          date: data.date,
          siteId: data.site_id || '',
          siteType: data.site_type || '',
          address: data.address || '',
          gpsCoordinates: data.gps_coordinates || '',
          buildingPhoto: data.building_photo || ''
        };
        
        setFormData(surveyData);
        setDraftName(data.site_name);
        toast.success(`Loaded survey: ${data.site_name}`);
      }
    } catch (error) {
      console.error('Error fetching survey:', error);
      toast.error('Failed to load survey data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNestedInputChange = (category: string, field: string, value: any) => {
    setFormData({
      ...formData,
      [category]: {
        ...formData[category as keyof typeof formData],
        [field]: value
      }
    });
  };

  const handleArrayItemChange = (arrayName: string, index: number, field: string, value: any) => {
    const updatedArray = [...(formData[arrayName as keyof typeof formData] as any[])];
    updatedArray[index][field] = value;
    setFormData({ ...formData, [arrayName]: updatedArray });
  };

  const addArrayItem = (arrayName: string, template: any) => {
    const updatedArray = [...(formData[arrayName as keyof typeof formData] as any[]), template];
    setFormData({ ...formData, [arrayName]: updatedArray });
  };

  const removeArrayItem = (arrayName: string, index: number) => {
    const updatedArray = [...(formData[arrayName as keyof typeof formData] as any[])];
    updatedArray.splice(index, 1);
    setFormData({ ...formData, [arrayName]: updatedArray });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };
  
  const handleCheckboxChange = (category: string, subCategory: string, field: string, checked: boolean) => {
    setFormData({
      ...formData,
      [category]: {
        ...formData[category as keyof typeof formData],
        [subCategory]: {
          ...(formData[category as keyof typeof formData] as any)[subCategory],
          [field]: checked
        }
      }
    });
  };

  const handleImageCapture = (type: string, imageData: string) => {
    setFormData({
      ...formData,
      [type]: imageData
    });

    if (formData.useAIAssistance && imageData) {
      analyzeImage(imageData, type, "Analyze this image").then(analysis => {
        if (analysis) {
          setAiSuggestions({ ...aiSuggestions, [type]: analysis });
        }
      });
    }
  };

  const handleLocationUpdate = () => {
    if (latitude && longitude) {
      setFormData({
        ...formData,
        gpsCoordinates: `${latitude}, ${longitude}`,
        address: address || formData.address
      });
      toast.success("Location updated successfully");
    } else {
      toast.error("Could not get location. Please try again.");
    }
  };

  const handleGetAISuggestion = async (fieldName: string) => {
    const suggestion = await getSuggestion(fieldName, formData);
    if (suggestion) {
      setAiSuggestions({ ...aiSuggestions, [fieldName]: suggestion });
    }
  };

  const handleEnhanceNotes = async () => {
    if (formData.generalRemarks) {
      const enhanced = await enhanceNotes(formData.generalRemarks, "Enhance these notes");
      setFormData({ ...formData, generalRemarks: enhanced });
      toast.success("Notes enhanced with AI suggestions");
    } else {
      toast.error("Please add some notes first");
    }
  };
  
  const saveSurveyToSupabase = async (status: 'draft' | 'submitted' = 'draft') => {
    setIsSaving(true);
    
    try {
      const { siteName, region, date, siteId, siteType, address, gpsCoordinates, buildingPhoto, ...surveyData } = formData;
      
      const { data: { user } } = await supabase.auth.getUser();
      
      const surveyRecord = {
        site_name: siteName,
        region: region,
        date: date,
        site_id: siteId,
        site_type: siteType,
        address: address,
        gps_coordinates: gpsCoordinates,
        building_photo: buildingPhoto,
        user_id: user?.id,
        status: status,
        survey_data: surveyData
      };
      
      let response;
      
      if (surveyId) {
        response = await supabase
          .from('site_surveys')
          .update(surveyRecord)
          .eq('id', surveyId);
      } else {
        response = await supabase
          .from('site_surveys')
          .insert(surveyRecord)
          .select();
      }
      
      if (response.error) throw response.error;
      
      const newId = surveyId || (response.data && response.data[0]?.id);
      
      if (newId) {
        if (status === 'submitted') {
          toast.success("Survey submitted successfully!");
          
          if (draftName && savedDrafts[draftName]) {
            const { [draftName]: _, ...remainingDrafts } = savedDrafts;
            setSavedDrafts(remainingDrafts);
          }
          
          setTimeout(() => navigate('/'), 2000);
        } else {
          toast.success("Survey saved to database");
          
          const url = new URL(window.location.href);
          url.searchParams.set('id', newId);
          window.history.replaceState({}, '', url.toString());
        }
      }
    } catch (error) {
      console.error('Error saving survey:', error);
      toast.error("Failed to save survey. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSaveDraft = async () => {
    const saveName = draftName || `Draft_${new Date().toISOString().slice(0, 10)}_${Math.floor(Math.random() * 1000)}`;
    
    const updatedDrafts = { 
      ...savedDrafts,
      [saveName]: formData 
    };
    
    setSavedDrafts(updatedDrafts);
    setDraftName(saveName);
    
    await saveSurveyToSupabase('draft');
    
    const url = new URL(window.location.href);
    url.searchParams.set('draftId', saveName);
    window.history.replaceState({}, '', url.toString());
  };

  const handleLoadDraft = (draftId: string) => {
    if (savedDrafts[draftId]) {
      setFormData(savedDrafts[draftId]);
      setDraftName(draftId);
      toast.success(`Loaded draft: ${draftId}`);
    } else {
      toast.error(`Draft not found: ${draftId}`);
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const requiredFields = ['siteName', 'date', 'region'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }
    
    await saveSurveyToSupabase('submitted');
    
    onSubmit?.(formData);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading survey data...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmitForm} className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-bcx">ESKOM OT IP/MPLS NETWORK</h2>
          <h3 className="text-xl font-semibold">SITE SURVEY REPORT</h3>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Input
              placeholder="Draft name (optional)"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              className="w-48 text-sm"
            />
          </div>
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleSaveDraft}
            className="flex items-center gap-1"
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Draft
          </Button>
          <Switch
            id="ai-mode-install"
            checked={formData.useAIAssistance}
            onCheckedChange={(checked) => 
              setFormData({ ...formData, useAIAssistance: checked })
            }
          />
          <Label htmlFor="ai-mode-install" className="text-sm">AI Assistance</Label>
        </div>
      </div>

      <Card className="overflow-hidden shadow-md">
        <CardContent className="p-0">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium w-1/4 bg-gray-50">Site Name:</TableCell>
                <TableCell>
                  <Input
                    id="siteName"
                    name="siteName"
                    value={formData.siteName}
                    onChange={handleInputChange}
                    placeholder="Enter site name"
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium w-1/4 bg-gray-50">Region:</TableCell>
                <TableCell>
                  <Input
                    id="region"
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                    placeholder="Enter region"
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium w-1/4 bg-gray-50">Date:</TableCell>
                <TableCell>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Full front view photo of building where IP/MPLS equipment will be situated</h3>
          <ImageCapture
            label="Building Photo"
            description="Take a photo of the building front view"
            onCapture={(imageData) => handleImageCapture("buildingPhoto", imageData)}
            capturedImage={formData.buildingPhoto}
          />
          {aiSuggestions['buildingPhoto'] && (
            <div className="ai-suggestion mt-2">
              <p><Check size={12} className="inline mr-1" /> {aiSuggestions['buildingPhoto']}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="basic">Site Information</TabsTrigger>
          <TabsTrigger value="attendees">Site Visit Attendees</TabsTrigger>
          <TabsTrigger value="equipment">Equipment Details</TabsTrigger>
          <TabsTrigger value="power">Power & Transport</TabsTrigger>
          <TabsTrigger value="annexures">Annexures</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">1. SITE INFORMATION & LOCATION</h3>
              
              <h4 className="text-md font-medium mb-2">1.1. Site Identification</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <Label htmlFor="siteId">Site ID (WorkPlace ID)</Label>
                  <Input
                    id="siteId"
                    name="siteId"
                    value={formData.siteId}
                    onChange={handleInputChange}
                    placeholder="Enter site ID"
                  />
                </div>
                
                <div>
                  <Label htmlFor="siteType">Site Type</Label>
                  <Select
                    value={formData.siteType}
                    onValueChange={(value) => handleSelectChange("siteType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select site type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sub-tx">Sub-TX</SelectItem>
                      <SelectItem value="rs">RS</SelectItem>
                      <SelectItem value="ps-coal">PS-Coal</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="address">Address/Location Description</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter full address or location description"
                    rows={3}
                  />
                </div>
                
                <div className="md:col-span-2 relative">
                  <Label htmlFor="gpsCoordinates">GPS coordinates WGS84 (Lat/Long)</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="gpsCoordinates"
                      name="gpsCoordinates"
                      value={formData.gpsCoordinates}
                      onChange={handleInputChange}
                      placeholder="Latitude, Longitude"
                      className="flex-grow"
                    />
                    <Button 
                      type="button" 
                      size="icon"
                      variant="outline" 
                      onClick={handleLocationUpdate} 
                      disabled={locationLoading}
                      className="flex-shrink-0"
                    >
                      <MapPin size={18} />
                    </Button>
                  </div>
                  {address && (
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {address}
                    </p>
                  )}
                </div>
              </div>
              
              <h4 className="text-md font-medium mb-2">1.3. Equipment Location</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <Label htmlFor="buildingName">Building name</Label>
                  <Input
                    id="buildingName"
                    name="buildingName"
                    value={formData.buildingName}
                    onChange={handleInputChange}
                    placeholder="Enter building name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="buildingType">Building type</Label>
                  <Select
                    value={formData.buildingType}
                    onValueChange={(value) => handleSelectChange("buildingType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select building type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="container">Container</SelectItem>
                      <SelectItem value="brick">Brick</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="floorLevel">Floor level</Label>
                  <Input
                    id="floorLevel"
                    name="floorLevel"
                    value={formData.floorLevel}
                    onChange={handleInputChange}
                    placeholder="Enter floor level"
                  />
                </div>
                
                <div>
                  <Label htmlFor="roomNumber">Equipment Room number / name</Label>
                  <Input
                    id="roomNumber"
                    name="roomNumber"
                    value={formData.roomNumber}
                    onChange={handleInputChange}
                    placeholder="Enter room number or name"
                  />
                </div>
              </div>
              
              <h4 className="text-md font-medium mb-2">1.4. Access Procedure</h4>
              <div className="grid grid-cols-1 gap-4 mb-6">
                <div>
                  <Label htmlFor="accessRequirements">Requirements for site access</Label>
                  <Textarea
                    id="accessRequirements"
                    name="accessRequirements"
                    value={formData.accessRequirements}
                    onChange={handleInputChange}
                    placeholder="Detail requirements for accessing the site"
                    rows={2}
                  />
                </div>
                
                <div>
                  <Label htmlFor="securityRequirements">Site security requirements</Label>
                  <Textarea
                    id="securityRequirements"
                    name="securityRequirements"
                    value={formData.securityRequirements}
                    onChange={handleInputChange}
                    placeholder="Detail security requirements for the site"
                    rows={2}
                  />
                </div>
                
                <div>
                  <Label htmlFor="vehicleType">Vehicle type to reach site</Label>
                  <Input
                    id="vehicleType"
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleInputChange}
                    placeholder="e.g. 4x4, Sedan, etc."
                  />
                </div>
              </div>
              
              <h4 className="text-md font-medium mb-2">1.5. Eskom site owner contact details</h4>
              {formData.siteOwnerContacts.map((contact, index) => (
                <div key={`contact-${index}`} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-2 border rounded">
                  <div>
                    <Label htmlFor={`contactName-${index}`}>Contact name</Label>
                    <Input
                      id={`contactName-${index}`}
                      value={contact.name}
                      onChange={(e) => handleArrayItemChange('siteOwnerContacts', index, 'name', e.target.value)}
                      placeholder="Contact name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`contactPhone-${index}`}>Cellphone number</Label>
                    <Input
                      id={`contactPhone-${index}`}
                      value={contact.cellphone}
                      onChange={(e) => handleArrayItemChange('siteOwnerContacts', index, 'cellphone', e.target.value)}
                      placeholder="Cellphone number"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`contactEmail-${index}`}>Email address</Label>
                    <Input
                      id={`contactEmail-${index}`}
                      value={contact.email}
                      onChange={(e) => handleArrayItemChange('siteOwnerContacts', index, 'email', e.target.value)}
                      placeholder="Email address"
                    />
                  </div>
                </div>
              ))}
              
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem('siteOwnerContacts', { name: "", cellphone: "", email: "" })}
                >
                  Add Contact
                </Button>
                {formData.siteOwnerContacts.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeArrayItem('siteOwnerContacts', formData.siteOwnerContacts.length - 1)}
                  >
                    Remove Last
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendees" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Site visit attendee's information</h3>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Cellphone</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formData.attendees.map((attendee, index) => (
                      <TableRow key={`attendee-${index}`}>
                        <TableCell>
                          <Input
                            type="date"
                            value={attendee.date}
                            onChange={(e) => handleArrayItemChange('attendees', index, 'date', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={attendee.name}
                            onChange={(e) => handleArrayItemChange('attendees', index, 'name', e.target.value)}
                            placeholder="Name"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={attendee.company}
                            onChange={(e) => handleArrayItemChange('attendees', index, 'company', e.target.value)}
                            placeholder="Company"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={attendee.department}
                            onChange={(e) => handleArrayItemChange('attendees', index, 'department', e.target.value)}
                            placeholder="Department"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={attendee.cellphone}
                            onChange={(e) => handleArrayItemChange('attendees', index, 'cellphone', e.target.value)}
                            placeholder="Cellphone"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex justify-end space-x-2 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem('attendees', { date: "", name: "", company: "", department: "", cellphone: "" })}
                >
                  Add Attendee
                </Button>
                {formData.attendees.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeArrayItem('attendees', formData.attendees.length - 1)}
                  >
                    Remove Last
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Site survey outcome</h3>
              
              <div className="grid grid-cols-1 gap-6">
                <div className="border rounded-md p-4">
                  <h4 className="font-medium mb-3">OEM Contractor</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                    <div>
                      <Label htmlFor="oemContractorName">Name</Label>
                      <Input
                        id="oemContractorName"
                        value={formData.surveyOutcome.oemContractor.name}
                        onChange={(e) => handleNestedInputChange('surveyOutcome', 'oemContractor', {...formData.surveyOutcome.oemContractor, name: e.target.value})}
                        placeholder="Name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="oemContractorSignature">Signature</Label>
                      <Input
                        id="oemContractorSignature"
                        value={formData.surveyOutcome.oemContractor.signature}
                        onChange={(e) => handleNestedInputChange('surveyOutcome', 'oemContractor', {...formData.surveyOutcome.oemContractor, signature: e.target.value})}
                        placeholder="Signature"
                      />
                    </div>
                    <div>
                      <Label htmlFor="oemContractorDate">Date</Label>
                      <Input
                        id="oemContractorDate"
                        type="date"
                        value={formData.surveyOutcome.oemContractor.date}
                        onChange={(e) => handleNestedInputChange('surveyOutcome', 'oemContractor', {...formData.surveyOutcome.oemContractor, date: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-6 mb-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="oemContractorAccepted" 
                        checked={formData.surveyOutcome.oemContractor.accepted}
                        onCheckedChange={(checked) => 
                          handleNestedInputChange('surveyOutcome', 'oemContractor', {...formData.surveyOutcome.oemContractor, accepted: !!checked})
                        }
                      />
                      <Label htmlFor="oemContractorAccepted">Accepted</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="oemContractorRejected" 
                        checked={!formData.surveyOutcome.oemContractor.accepted}
                        onCheckedChange={(checked) => 
                          handleNestedInputChange('surveyOutcome', 'oemContractor', {...formData.surveyOutcome.oemContractor, accepted: !checked})
                        }
                      />
                      <Label htmlFor="oemContractorRejected">Rejected</Label>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="oemContractorComments">Comments</Label>
                    <Textarea
                      id="oemContractorComments"
                      value={formData.surveyOutcome.oemContractor.comments}
                      onChange={(e) => handleNestedInputChange('surveyOutcome', 'oemContractor', {...formData.surveyOutcome.oemContractor, comments: e.target.value})}
                      placeholder="Comments"
                      rows={2}
                    />
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <h4 className="font-medium mb-3">OEM Engineer</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                    <div>
                      <Label htmlFor="oemEngineerName">Name</Label>
                      <Input
                        id="oemEngineerName"
                        value={formData.surveyOutcome.oemEngineer.name}
                        onChange={(e) => handleNestedInputChange('surveyOutcome', 'oemEngineer', {...formData.surveyOutcome.oemEngineer, name: e.target.value})}
                        placeholder="Name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="oemEngineerSignature">Signature</Label>
                      <Input
                        id="oemEngineerSignature"
                        value={formData.surveyOutcome.oemEngineer.signature}
                        onChange={(e) => handleNestedInputChange('surveyOutcome', 'oemEngineer', {...formData.surveyOutcome.oemEngineer, signature: e.target.value})}
                        placeholder="Signature"
                      />
                    </div>
                    <div>
                      <Label htmlFor="oemEngineerDate">Date</Label>
                      <Input
                        id="oemEngineerDate"
                        type="date"
                        value={formData.surveyOutcome.oemEngineer.date}
                        onChange={(e) => handleNestedInputChange('surveyOutcome', 'oemEngineer', {...formData.surveyOutcome.oemEngineer, date: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-6 mb-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="oemEngineerAccepted" 
                        checked={formData.surveyOutcome.oemEngineer.accepted}
                        onCheckedChange={(checked) => 
                          handleNestedInputChange('surveyOutcome', 'oemEngineer', {...formData.surveyOutcome.oemEngineer, accepted: !!checked})
                        }
                      />
                      <Label htmlFor="oemEngineerAccepted">Accepted</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="oemEngineerRejected" 
                        checked={!formData.surveyOutcome.oemEngineer.accepted}
                        onCheckedChange={(checked) => 
                          handleNestedInputChange('surveyOutcome', 'oemEngineer', {...formData.surveyOutcome.oemEngineer, accepted: !checked})
                        }
                      />
                      <Label htmlFor="oemEngineerRejected">Rejected</Label>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="oemEngineerComments">Comments</Label>
                    <Textarea
                      id="oemEngineerComments"
                      value={formData.surveyOutcome.oemEngineer.comments}
                      onChange={(e) => handleNestedInputChange('surveyOutcome', 'oemEngineer', {...formData.surveyOutcome.oemEngineer, comments: e.target.value})}
                      placeholder="Comments"
                      rows={2}
                    />
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <h4 className="font-medium mb-3">Eskom Representative</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                    <div>
                      <Label htmlFor="eskomRepName">Name</Label>
                      <Input
                        id="eskomRepName"
                        value={formData.surveyOutcome.eskomRepresentative.name}
                        onChange={(e) => handleNestedInputChange('surveyOutcome', 'eskomRepresentative', {...formData.surveyOutcome.eskomRepresentative, name: e.target.value})}
                        placeholder="Name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="eskomRepSignature">Signature</Label>
                      <Input
                        id="eskomRepSignature"
                        value={formData.surveyOutcome.eskomRepresentative.signature}
                        onChange={(e) => handleNestedInputChange('surveyOutcome', 'eskomRepresentative', {...formData.surveyOutcome.eskomRepresentative, signature: e.target.value})}
                        placeholder="Signature"
                      />
                    </div>
                    <div>
                      <Label htmlFor="eskomRepDate">Date</Label>
                      <Input
                        id="eskomRepDate"
                        type="date"
                        value={formData.surveyOutcome.eskomRepresentative.date}
                        onChange={(e) => handleNestedInputChange('surveyOutcome', 'eskomRepresentative', {...formData.surveyOutcome.eskomRepresentative, date: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-6 mb-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="eskomRepAccepted" 
                        checked={formData.surveyOutcome.eskomRepresentative.accepted}
                        onCheckedChange={(checked) => 
                          handleNestedInputChange('surveyOutcome', 'eskomRepresentative', {...formData.surveyOutcome.eskomRepresentative, accepted: !!checked})
                        }
                      />
                      <Label htmlFor="eskomRepAccepted">Accepted</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="eskomRepRejected" 
                        checked={!formData.surveyOutcome.eskomRepresentative.accepted}
                        onCheckedChange={(checked) => 
                          handleNestedInputChange('surveyOutcome', 'eskomRepresentative', {...formData.surveyOutcome.eskomRepresentative, accepted: !checked})
                        }
                      />
                      <Label htmlFor="eskomRepRejected">Rejected</Label>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="eskomRepComments">Comments</Label>
                    <Textarea
                      id="eskomRepComments"
                      value={formData.surveyOutcome.eskomRepresentative.comments}
                      onChange={(e) => handleNestedInputChange('surveyOutcome', 'eskomRepresentative', {...formData.surveyOutcome.eskomRepresentative, comments: e.target.value})}
                      placeholder="Comments"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipment" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">2. EQUIPMENT ROOM (GENERAL)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cableAccess">Cable access to the cabinet</Label>
                  <Select
                    value={formData.cableAccess}
                    onValueChange={(value) => handleSelectChange("cableAccess", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select cable access type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="underfloor">Underfloor</SelectItem>
                      <SelectItem value="overhead">Overhead</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="roomLighting">Room lighting</Label>
                  <Input
                    id="roomLighting"
                    name="roomLighting"
                    value={formData.roomLighting}
                    onChange={handleInputChange}
                    placeholder="Indicate if any lights are faulty"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="power" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">3. POWER & TRANSPORT</h3>
              
              <p className="text-gray-500 italic">
                This section is for power and transport details.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="annexures" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">4. ANNEXURES</h3>
              
              <p className="text-gray-500 italic">
                This section contains additional annexure information.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-between mt-6">
        <Button 
          type="button" 
          variant="outline"
          onClick={handleSaveDraft}
          className="flex items-center gap-1"
          disabled={isSaving}
        >
          {isSaving ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save and Continue Later
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader className="h-4 w-4 animate-spin mr-2" />
              Submitting...
            </>
          ) : (
            "Submit Survey"
          )}
        </Button>
      </div>
      
      {Object.keys(savedDrafts).length > 0 && (
        <div className="mt-4 border rounded-md p-4">
          <h4 className="font-medium mb-2">Saved Drafts</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {Object.keys(savedDrafts).map((key) => (
              <Button 
                key={key}
                variant="outline" 
                size="sm"
                onClick={() => handleLoadDraft(key)}
                className="text-xs justify-start truncate"
              >
                {key}
              </Button>
            ))}
          </div>
        </div>
      )}
    </form>
  );
};

export default EskomSiteSurveyForm;
