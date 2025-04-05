
import React, { useState } from "react";
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
import { MapPin, Info, Check, Calendar, Users, Building, Router, FileText, Power, Radio, Thermometer } from "lucide-react";
import ImageCapture from "./ImageCapture";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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

  const handleImageCapture = (field: string, imageData: string) => {
    setFormData({
      ...formData,
      [field]: imageData
    });

    // If AI assistance is enabled and an image was captured, analyze it
    if (formData.useAIAssistance && imageData) {
      analyzeImage(imageData, field).then(analysis => {
        setAiSuggestions({ ...aiSuggestions, [field]: analysis });
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

  const handleEnhanceNotes = async (field: string) => {
    if (formData[field as keyof typeof formData]) {
      const enhanced = await enhanceNotes(formData[field as keyof typeof formData] as string, field);
      setFormData({ ...formData, [field]: enhanced });
      toast.success("Notes enhanced with AI suggestions");
    } else {
      toast.error("Please add some notes first");
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = ['siteName', 'date', 'region'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }
    
    onSubmit?.(formData);
    toast.success("Site survey report submitted successfully!");
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <form onSubmit={handleSubmitForm} className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-bcx">ESKOM OT IP/MPLS NETWORK</h2>
          <h3 className="text-xl font-semibold">SITE SURVEY REPORT</h3>
        </div>
        <div className="flex items-center space-x-2">
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
                
                <div>
                  <Label htmlFor="fireProtection">Fire Protection</Label>
                  <Input
                    id="fireProtection"
                    name="fireProtection"
                    value={formData.fireProtection}
                    onChange={handleInputChange}
                    placeholder="Type of fire protection"
                  />
                </div>
                
                <div>
                  <Label htmlFor="coolingMethod">Cooling Method</Label>
                  <Input
                    id="coolingMethod"
                    name="coolingMethod"
                    value={formData.coolingMethod}
                    onChange={handleInputChange}
                    placeholder="Air-conditioning, Fans etc"
                  />
                </div>
                
                <div>
                  <Label htmlFor="coolingRating">Cooling Rating</Label>
                  <Input
                    id="coolingRating"
                    name="coolingRating"
                    value={formData.coolingRating}
                    onChange={handleInputChange}
                    placeholder="BTU or Central Controlled"
                  />
                </div>
                
                <div>
                  <Label htmlFor="roomTemperature">Measured room temperature (Deg C)</Label>
                  <Input
                    id="roomTemperature"
                    name="roomTemperature"
                    value={formData.roomTemperature}
                    onChange={handleInputChange}
                    placeholder="e.g. 22"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="roomCondition">General condition of equipment room</Label>
                  <Textarea
                    id="roomCondition"
                    name="roomCondition"
                    value={formData.roomCondition}
                    onChange={handleInputChange}
                    placeholder="Describe the general condition of the equipment room"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">3. DETAILED SITE RECORDS</h3>
              
              <h4 className="text-md font-medium mb-2">3.1. Equipment Cabinet Space Planning</h4>
              <div className="grid grid-cols-1 gap-4 mb-6">
                <div>
                  <Label htmlFor="numberOfRouters">Please indicate number of new routers required?</Label>
                  <Input
                    id="numberOfRouters"
                    name="numberOfRouters"
                    type="number"
                    value={formData.numberOfRouters}
                    onChange={handleInputChange}
                    placeholder="Number of routers"
                  />
                </div>
                
                <div>
                  <Label>Room Layout Drawing</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Please upload or capture a photo of the room layout drawing with red-lined annotations showing locations of equipment.
                  </p>
                  <ImageCapture
                    label="Room Layout"
                    description="Room Layout with red-lined annotations"
                    onCapture={(imageData) => handleImageCapture("roomLayoutDrawing", imageData)}
                    capturedImage={formData.roomLayoutDrawing}
                  />
                </div>
              </div>
              
              <h4 className="text-md font-medium mb-2">Equipment Room Photos</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <ImageCapture
                    label="Equipment Room Photos"
                    description="General equipment room layout"
                    onCapture={(imageData) => handleImageCapture("equipmentRoomPhotos", imageData)}
                    capturedImage={formData.equipmentRoomPhotos}
                  />
                </div>
                
                <div>
                  <ImageCapture
                    label="New Cabinet Location Photos"
                    description="Show available floor space for new cabinets"
                    onCapture={(imageData) => handleImageCapture("cabinetLocationPhotos", imageData)}
                    capturedImage={formData.cabinetLocationPhotos}
                  />
                </div>
                
                <div>
                  <ImageCapture
                    label="Transport Equipment Photos"
                    description="Show full equipment chassis layout"
                    onCapture={(imageData) => handleImageCapture("transportEquipmentPhotos", imageData)}
                    capturedImage={formData.transportEquipmentPhotos}
                  />
                </div>
                
                <div>
                  <ImageCapture
                    label="ODF Photos"
                    description="Show Optical Distribution Frames"
                    onCapture={(imageData) => handleImageCapture("odfPhotos", imageData)}
                    capturedImage={formData.odfPhotos}
                  />
                </div>
                
                <div>
                  <ImageCapture
                    label="Access Equipment Photos"
                    description="Show ADM, BME, FOX equipment"
                    onCapture={(imageData) => handleImageCapture("accessEquipmentPhotos", imageData)}
                    capturedImage={formData.accessEquipmentPhotos}
                  />
                </div>
                
                <div>
                  <ImageCapture
                    label="Cable Routing Photos"
                    description="Show cable routing paths"
                    onCapture={(imageData) => handleImageCapture("cableRoutingPhotos", imageData)}
                    capturedImage={formData.cableRoutingPhotos}
                  />
                </div>
                
                <div>
                  <ImageCapture
                    label="Ceiling & HVAC Photos"
                    description="Show ceiling type and cooling system"
                    onCapture={(imageData) => handleImageCapture("ceilingHvacPhotos", imageData)}
                    capturedImage={formData.ceilingHvacPhotos}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="power" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">3.2. Transport Platforms</h3>
              
              <div className="space-y-4">
                {formData.transportLinks.map((link, index) => (
                  <div key={`link-${index}`} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 border rounded">
                    <div>
                      <Label>Link {link.linkNumber} - Link Type</Label>
                      <Input
                        value={link.linkType}
                        onChange={(e) => handleArrayItemChange('transportLinks', index, 'linkType', e.target.value)}
                        placeholder="Link type"
                      />
                    </div>
                    <div>
                      <Label>Direction</Label>
                      <Input
                        value={link.direction}
                        onChange={(e) => handleArrayItemChange('transportLinks', index, 'direction', e.target.value)}
                        placeholder="Direction"
                      />
                    </div>
                    <div>
                      <Label>Capacity</Label>
                      <Input
                        value={link.capacity}
                        onChange={(e) => handleArrayItemChange('transportLinks', index, 'capacity', e.target.value)}
                        placeholder="Capacity"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">3.3. 50V DC Power Distribution</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <Label htmlFor="chargerALoadCurrent">50V Charger A: DC Load Current (Total Amps)</Label>
                  <Input
                    id="chargerALoadCurrent"
                    name="chargerALoadCurrent"
                    value={formData.chargerALoadCurrent}
                    onChange={handleInputChange}
                    placeholder="Total Amps"
                  />
                </div>
                
                <div>
                  <Label htmlFor="chargerBLoadCurrent">50V Charger B: DC Load Current (Total Amps)</Label>
                  <Input
                    id="chargerBLoadCurrent"
                    name="chargerBLoadCurrent"
                    value={formData.chargerBLoadCurrent}
                    onChange={handleInputChange}
                    placeholder="Total Amps"
                  />
                </div>
                
                <div>
                  <Label htmlFor="powerSupplyMethod">Are cabinets supplied by the 50V DC Charger direct or via End of Aisle (EOA) DB boards?</Label>
                  <Select
                    value={formData.powerSupplyMethod}
                    onValueChange={(value) => handleSelectChange("powerSupplyMethod", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select power supply method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="direct">Direct from DC Charger</SelectItem>
                      <SelectItem value="eoa">Via End of Aisle (EOA) DB boards</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="dcCableLength">Measure DC Cable length required to OTN cabinet</Label>
                  <Input
                    id="dcCableLength"
                    name="dcCableLength"
                    value={formData.dcCableLength}
                    onChange={handleInputChange}
                    placeholder="Cable length in meters"
                  />
                </div>
              </div>
              
              <div>
                <ImageCapture
                  label="DC Power Distribution Photos"
                  description="Show DC Distribution (Charger A & B, End of Aisle DB and Cabinet PDU)"
                  onCapture={(imageData) => handleImageCapture("dcPowerDistributionPhotos", imageData)}
                  capturedImage={formData.dcPowerDistributionPhotos}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">4. INSTALLATION REQUIREMENTS</h3>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/3">Item</TableHead>
                      <TableHead className="w-1/3">Description</TableHead>
                      <TableHead className="w-1/3">Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Access & Security</TableCell>
                      <TableCell>
                        <Input
                          value={formData.installationRequirements.accessSecurity}
                          onChange={(e) => handleNestedInputChange('installationRequirements', 'accessSecurity', e.target.value)}
                          placeholder="Description"
                        />
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Cooling & Ventilation</TableCell>
                      <TableCell>
                        <Input
                          value={formData.installationRequirements.coolingVentilation}
                          onChange={(e) => handleNestedInputChange('installationRequirements', 'coolingVentilation', e.target.value)}
                          placeholder="Description"
                        />
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Flooring Type</TableCell>
                      <TableCell>
                        <Input
                          value={formData.installationRequirements.flooringType}
                          onChange={(e) => handleNestedInputChange('installationRequirements', 'flooringType', e.target.value)}
                          placeholder="Description"
                        />
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Fire Protection</TableCell>
                      <TableCell>
                        <Input
                          value={formData.installationRequirements.fireProtection}
                          onChange={(e) => handleNestedInputChange('installationRequirements', 'fireProtection', e.target.value)}
                          placeholder="Description"
                        />
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Room Lighting</TableCell>
                      <TableCell>
                        <Input
                          value={formData.installationRequirements.roomLighting}
                          onChange={(e) => handleNestedInputChange('installationRequirements', 'roomLighting', e.target.value)}
                          placeholder="Description"
                        />
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Roof type</TableCell>
                      <TableCell>
                        <Input
                          value={formData.installationRequirements.roofType}
                          onChange={(e) => handleNestedInputChange('installationRequirements', 'roofType', e.target.value)}
                          placeholder="Description"
                        />
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Power cable(s)</TableCell>
                      <TableCell>
                        <Input
                          value={formData.installationRequirements.powerCables}
                          onChange={(e) => handleNestedInputChange('installationRequirements', 'powerCables', e.target.value)}
                          placeholder="Description"
                        />
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">5. GENERAL REMARKS</h3>
                {formData.useAIAssistance && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleEnhanceNotes('generalRemarks')}
                    disabled={isProcessing || !formData.generalRemarks}
                  >
                    Enhance with AI
                  </Button>
                )}
              </div>
              
              <Textarea
                id="generalRemarks"
                name="generalRemarks"
                value={formData.generalRemarks}
                onChange={handleInputChange}
                placeholder="Enter any general remarks or additional information about the site survey"
                rows={8}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="annexures" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Annexure A – ODF (Optical Distribution Frame)</h3>
              <p className="text-sm text-muted-foreground mb-4 font-bold">IMPORTANT: DO NOT TOUCH Fibre Optic Patch Leads –Live Traffic</p>
              
              {formData.odfDetails.map((odf, index) => (
                <div key={`odf-${index}`} className="mb-8 border rounded-md p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <Label htmlFor={`cabinetName-${index}`}>Cabinet Name</Label>
                      <Input
                        id={`cabinetName-${index}`}
                        value={odf.cabinetName}
                        onChange={(e) => handleArrayItemChange('odfDetails', index, 'cabinetName', e.target.value)}
                        placeholder="Cabinet Name"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`direction-${index}`}>Direction</Label>
                      <Input
                        id={`direction-${index}`}
                        value={odf.direction}
                        onChange={(e) => handleArrayItemChange('odfDetails', index, 'direction', e.target.value)}
                        placeholder="Direction"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`connectionType-${index}`}>Connection Type</Label>
                      <Input
                        id={`connectionType-${index}`}
                        value={odf.connectionType}
                        onChange={(e) => handleArrayItemChange('odfDetails', index, 'connectionType', e.target.value)}
                        placeholder="Connection Type"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`numberOfCores-${index}`}>Number of Cores</Label>
                      <Input
                        id={`numberOfCores-${index}`}
                        value={odf.numberOfCores}
                        onChange={(e) => handleArrayItemChange('odfDetails', index, 'numberOfCores', e.target.value)}
                        placeholder="Number of Cores"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('odfDetails', { 
                  cabinetName: "", 
                  direction: "", 
                  connectionType: "", 
                  numberOfCores: "",
                  cores: Array(48).fill().map((_, i) => ({ number: i+1, used: false }))
                })}
              >
                Add ODF Cabinet
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Annexure B – Cabinet Layout</h3>
              
              <div>
                <Label htmlFor="cabinetLayoutNotes">Cabinet Layout Notes</Label>
                <Textarea
                  id="cabinetLayoutNotes"
                  name="cabinetLayoutNotes"
                  value={formData.cabinetLayoutNotes}
                  onChange={handleInputChange}
                  placeholder="Add notes about cabinet layout"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Annexure C: 50V Charger Load Distribution Layout</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <Label htmlFor="chargerSiteName">Site Name</Label>
                  <Input
                    id="chargerSiteName"
                    value={formData.chargerLoadDistribution.siteName}
                    onChange={(e) => handleNestedInputChange('chargerLoadDistribution', 'siteName', e.target.value)}
                    placeholder="Site Name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="chargerLabel">Charger Label/Name</Label>
                  <Input
                    id="chargerLabel"
                    value={formData.chargerLoadDistribution.chargerLabel}
                    onChange={(e) => handleNestedInputChange('chargerLoadDistribution', 'chargerLabel', e.target.value)}
                    placeholder="Charger Label/Name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="chargerType">Single or Dual Charger</Label>
                  <Select
                    value={formData.chargerLoadDistribution.chargerType}
                    onValueChange={(value) => handleNestedInputChange('chargerLoadDistribution', 'chargerType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select charger type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="dual">Dual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Annexure F: Room Layout Drawing</h3>
              
              <p className="text-sm text-muted-foreground mb-2">
                Room Layout Drawing (printed copy red-lined and scanned)
              </p>
              
              {!formData.roomLayoutDrawing ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <Label htmlFor="roomLayoutDrawingUpload" className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <FileText className="h-8 w-8 mb-2 text-gray-400" />
                      <span className="text-sm font-medium">Upload or capture room layout drawing</span>
                      <span className="text-xs text-muted-foreground mt-1">
                        with red-lined annotations
                      </span>
                    </div>
                  </Label>
                  <ImageCapture
                    label="Room Layout Drawing"
                    description="Room Layout Drawing with red-lined annotations"
                    onCapture={(imageData) => handleImageCapture("roomLayoutDrawing", imageData)}
                    capturedImage={formData.roomLayoutDrawing}
                  />
                </div>
              ) : (
                <div className="relative">
                  <img 
                    src={formData.roomLayoutDrawing} 
                    alt="Room Layout Drawing" 
                    className="w-full rounded-lg border border-gray-200" 
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setFormData({...formData, roomLayoutDrawing: ""})}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between items-center pt-4">
        <div className="flex items-center">
          {latitude && longitude && (
            <Badge variant="outline" className="location-badge">
              <MapPin size={12} /> Location tracked
            </Badge>
          )}
        </div>
        
        <div className="flex space-x-2">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => {
              // Reset form would go here
              toast.info("Form reset functionality would go here");
            }}
          >
            Reset
          </Button>
          <Button type="submit">Submit Survey Report</Button>
        </div>
      </div>
    </form>
  );
};

export default EskomSiteSurveyForm;
