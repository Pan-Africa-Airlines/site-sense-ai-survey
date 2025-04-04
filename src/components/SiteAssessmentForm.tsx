
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useAI } from "@/contexts/AIContext";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { MapPin, Search, Info, Check } from "lucide-react";
import ImageCapture from "./ImageCapture";

interface SiteAssessmentFormProps {
  onSubmit: (data: any) => void;
}

const SiteAssessmentForm: React.FC<SiteAssessmentFormProps> = ({ onSubmit }) => {
  const { latitude, longitude, address, loading: locationLoading } = useGeolocation();
  const { isProcessing, analyzeImage, getSuggestion, enhanceNotes } = useAI();
  
  const [formData, setFormData] = useState({
    // Customer Information
    customerName: "",
    customerContactPerson: "",
    customerContactNumber: "",
    customerEmailAddress: "",
    
    // Site Information
    siteName: "",
    siteAddress: "",
    siteCoordinates: "",
    siteType: "",
    siteAccessRequirements: "",
    
    // Building Information
    buildingType: "",
    floorNumber: "",
    roomNumber: "",
    numberOfRooms: "",
    buildingCondition: "",
    
    // Networking Assessment
    existingNetwork: "",
    networkCondition: "",
    networkCabling: "",
    internetAvailability: "",
    networkEquipmentDetails: "",
    
    // Power Assessment
    powerAvailability: "",
    powerCondition: "",
    upsAvailability: "",
    powerOutlets: "",
    powerBackupDetails: "",
    
    // Space Assessment
    availableRackSpace: "",
    roomDimensions: "",
    ventilationDetails: "",
    securityDetails: "",
    spaceConstraints: "",
    
    // Additional Information
    additionalNotes: "",
    sitePhotos: {
      exterior: "",
      serverRoom: "",
      networkCabinet: "",
      powerSource: "",
    },
    useAIAssistance: true,
    
    // Date & Engineer Info
    dateOfAssessment: new Date().toISOString().split('T')[0],
    engineerName: "",
    engineerContact: "",
  });
  
  const [aiSuggestions, setAiSuggestions] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState("customer");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleImageCapture = (type: keyof typeof formData.sitePhotos, imageData: string) => {
    setFormData({
      ...formData,
      sitePhotos: {
        ...formData.sitePhotos,
        [type]: imageData
      }
    });

    // If AI assistance is enabled, analyze the image
    if (formData.useAIAssistance && imageData) {
      analyzeImage(imageData).then(analysis => {
        setAiSuggestions({ ...aiSuggestions, [type]: analysis });
      });
    }
  };

  const handleLocationUpdate = () => {
    if (latitude && longitude) {
      setFormData({
        ...formData,
        siteCoordinates: `${latitude}, ${longitude}`,
        siteAddress: address || formData.siteAddress
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
    if (formData.additionalNotes) {
      const enhanced = await enhanceNotes(formData.additionalNotes);
      setFormData({ ...formData, additionalNotes: enhanced });
      toast.success("Notes enhanced with AI suggestions");
    } else {
      toast.error("Please add some notes first");
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = ['customerName', 'siteName', 'siteAddress', 'engineerName'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }
    
    onSubmit(formData);
    toast.success("Site assessment submitted successfully!");
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <form onSubmit={handleSubmitForm} className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-bcx">Site Assessment Form</h2>
        <div className="flex items-center space-x-2">
          <Switch
            id="ai-mode"
            checked={formData.useAIAssistance}
            onCheckedChange={(checked) => 
              setFormData({ ...formData, useAIAssistance: checked })
            }
          />
          <Label htmlFor="ai-mode" className="text-sm">AI Assistance</Label>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-6 mb-6">
          <TabsTrigger value="customer">Customer</TabsTrigger>
          <TabsTrigger value="site">Site</TabsTrigger>
          <TabsTrigger value="building">Building</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
          <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
        </TabsList>

        <TabsContent value="customer" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="section-title">Customer Information</h3>
              
              <div className="field-row">
                <div>
                  <Label htmlFor="customerName" className="required">Customer Name</Label>
                  <Input
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    placeholder="e.g. ABC Corporation"
                  />
                </div>
                
                <div>
                  <Label htmlFor="customerContactPerson">Contact Person</Label>
                  <Input
                    id="customerContactPerson"
                    name="customerContactPerson"
                    value={formData.customerContactPerson}
                    onChange={handleInputChange}
                    placeholder="e.g. John Smith"
                  />
                </div>
              </div>
              
              <div className="field-row">
                <div>
                  <Label htmlFor="customerContactNumber">Contact Number</Label>
                  <Input
                    id="customerContactNumber"
                    name="customerContactNumber"
                    value={formData.customerContactNumber}
                    onChange={handleInputChange}
                    placeholder="e.g. +27 82 123 4567"
                  />
                </div>
                
                <div>
                  <Label htmlFor="customerEmailAddress">Email Address</Label>
                  <Input
                    id="customerEmailAddress"
                    name="customerEmailAddress"
                    type="email"
                    value={formData.customerEmailAddress}
                    onChange={handleInputChange}
                    placeholder="e.g. contact@example.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="section-title">Engineer Information</h3>
              
              <div className="field-row">
                <div>
                  <Label htmlFor="engineerName" className="required">Engineer Name</Label>
                  <Input
                    id="engineerName"
                    name="engineerName"
                    value={formData.engineerName}
                    onChange={handleInputChange}
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="engineerContact">Engineer Contact</Label>
                  <Input
                    id="engineerContact"
                    name="engineerContact"
                    value={formData.engineerContact}
                    onChange={handleInputChange}
                    placeholder="Your contact number"
                  />
                </div>
              </div>
              
              <div className="field-row">
                <div>
                  <Label htmlFor="dateOfAssessment">Date of Assessment</Label>
                  <Input
                    id="dateOfAssessment"
                    name="dateOfAssessment"
                    type="date"
                    value={formData.dateOfAssessment}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="site" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="section-title">Site Information</h3>
              
              <div className="field-row">
                <div>
                  <Label htmlFor="siteName" className="required">Site Name</Label>
                  <Input
                    id="siteName"
                    name="siteName"
                    value={formData.siteName}
                    onChange={handleInputChange}
                    placeholder="e.g. Head Office"
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
                      <SelectItem value="office">Office Building</SelectItem>
                      <SelectItem value="warehouse">Warehouse</SelectItem>
                      <SelectItem value="retail">Retail Store</SelectItem>
                      <SelectItem value="datacenter">Data Center</SelectItem>
                      <SelectItem value="factory">Factory</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="field-row">
                <div className="relative">
                  <Label htmlFor="siteAddress" className="required">Site Address</Label>
                  <Input
                    id="siteAddress"
                    name="siteAddress"
                    value={formData.siteAddress}
                    onChange={handleInputChange}
                    placeholder="Full address of the site"
                  />
                </div>
                
                <div className="relative">
                  <Label htmlFor="siteCoordinates">GPS Coordinates</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="siteCoordinates"
                      name="siteCoordinates"
                      value={formData.siteCoordinates}
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
              
              <div className="field-row">
                <div className="field-full">
                  <Label htmlFor="siteAccessRequirements">Access Requirements</Label>
                  <Textarea
                    id="siteAccessRequirements"
                    name="siteAccessRequirements"
                    value={formData.siteAccessRequirements}
                    onChange={handleInputChange}
                    placeholder="Details about site access requirements, security, etc."
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="building" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="section-title">Building Information</h3>
              
              <div className="field-row">
                <div>
                  <Label htmlFor="buildingType">Building Type</Label>
                  <Select
                    value={formData.buildingType}
                    onValueChange={(value) => handleSelectChange("buildingType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select building type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="industrial">Industrial</SelectItem>
                      <SelectItem value="mixed">Mixed Use</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="buildingCondition">Building Condition</Label>
                  <Select
                    value={formData.buildingCondition}
                    onValueChange={(value) => handleSelectChange("buildingCondition", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="field-row">
                <div>
                  <Label htmlFor="floorNumber">Floor Number</Label>
                  <Input
                    id="floorNumber"
                    name="floorNumber"
                    value={formData.floorNumber}
                    onChange={handleInputChange}
                    placeholder="e.g. 3"
                  />
                </div>
                
                <div>
                  <Label htmlFor="roomNumber">Room Number</Label>
                  <Input
                    id="roomNumber"
                    name="roomNumber"
                    value={formData.roomNumber}
                    onChange={handleInputChange}
                    placeholder="e.g. 305"
                  />
                </div>
              </div>
              
              <div className="field-row">
                <div>
                  <Label htmlFor="numberOfRooms">Number of Rooms</Label>
                  <Input
                    id="numberOfRooms"
                    name="numberOfRooms"
                    value={formData.numberOfRooms}
                    onChange={handleInputChange}
                    placeholder="Total number of rooms to be surveyed"
                  />
                </div>
                
                <div>
                  <Label htmlFor="roomDimensions">Room Dimensions</Label>
                  <Input
                    id="roomDimensions"
                    name="roomDimensions"
                    value={formData.roomDimensions}
                    onChange={handleInputChange}
                    placeholder="e.g. 5m x 8m"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="network" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="section-title">Networking Assessment</h3>
              
              <div className="field-row">
                <div>
                  <Label htmlFor="existingNetwork">Existing Network</Label>
                  <Select
                    value={formData.existingNetwork}
                    onValueChange={(value) => handleSelectChange("existingNetwork", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="lan">LAN</SelectItem>
                      <SelectItem value="wan">WAN</SelectItem>
                      <SelectItem value="wifi">Wi-Fi</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="networkCondition">Network Condition</Label>
                  <Select
                    value={formData.networkCondition}
                    onValueChange={(value) => handleSelectChange("networkCondition", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                      <SelectItem value="none">Not Applicable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="field-row">
                <div>
                  <Label htmlFor="networkCabling">Network Cabling</Label>
                  <Select
                    value={formData.networkCabling}
                    onValueChange={(value) => handleSelectChange("networkCabling", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cat5">CAT5</SelectItem>
                      <SelectItem value="cat6">CAT6</SelectItem>
                      <SelectItem value="cat6a">CAT6A</SelectItem>
                      <SelectItem value="fiber">Fiber Optic</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="internetAvailability">Internet Availability</Label>
                  <Select
                    value={formData.internetAvailability}
                    onValueChange={(value) => handleSelectChange("internetAvailability", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fiber">Fiber</SelectItem>
                      <SelectItem value="adsl">ADSL</SelectItem>
                      <SelectItem value="wireless">Wireless</SelectItem>
                      <SelectItem value="satellite">Satellite</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="field-row">
                <div className="field-full">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="networkEquipmentDetails">Network Equipment Details</Label>
                    {formData.useAIAssistance && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleGetAISuggestion('networkAvailability')}
                        disabled={isProcessing}
                        className="h-8 px-2 text-xs"
                      >
                        <Info size={14} className="mr-1" />
                        Get AI Suggestion
                      </Button>
                    )}
                  </div>
                  <Textarea
                    id="networkEquipmentDetails"
                    name="networkEquipmentDetails"
                    value={formData.networkEquipmentDetails}
                    onChange={handleInputChange}
                    placeholder="Details about current network equipment (switches, routers, access points, etc.)"
                    rows={3}
                  />
                  {aiSuggestions['networkAvailability'] && (
                    <div className="ai-suggestion">
                      <p><Check size={12} className="inline mr-1" /> {aiSuggestions['networkAvailability']}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="infrastructure" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="section-title">Power Assessment</h3>
              
              <div className="field-row">
                <div>
                  <Label htmlFor="powerAvailability">Power Availability</Label>
                  <Select
                    value={formData.powerAvailability}
                    onValueChange={(value) => handleSelectChange("powerAvailability", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="limited">Limited</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="powerCondition">Power Condition</Label>
                  <Select
                    value={formData.powerCondition}
                    onValueChange={(value) => handleSelectChange("powerCondition", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stable">Stable</SelectItem>
                      <SelectItem value="fluctuating">Fluctuating</SelectItem>
                      <SelectItem value="unreliable">Unreliable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="field-row">
                <div>
                  <Label htmlFor="upsAvailability">UPS Availability</Label>
                  <Select
                    value={formData.upsAvailability}
                    onValueChange={(value) => handleSelectChange("upsAvailability", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="limited">Limited</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="powerOutlets">Power Outlets</Label>
                  <Select
                    value={formData.powerOutlets}
                    onValueChange={(value) => handleSelectChange("powerOutlets", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="abundant">Abundant</SelectItem>
                      <SelectItem value="sufficient">Sufficient</SelectItem>
                      <SelectItem value="limited">Limited</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="field-row">
                <div className="field-full">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="powerBackupDetails">Power Backup Details</Label>
                    {formData.useAIAssistance && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleGetAISuggestion('powerInfrastructure')}
                        disabled={isProcessing}
                        className="h-8 px-2 text-xs"
                      >
                        <Info size={14} className="mr-1" />
                        Get AI Suggestion
                      </Button>
                    )}
                  </div>
                  <Textarea
                    id="powerBackupDetails"
                    name="powerBackupDetails"
                    value={formData.powerBackupDetails}
                    onChange={handleInputChange}
                    placeholder="Details about generators, UPS capacity, backup duration, etc."
                    rows={2}
                  />
                  {aiSuggestions['powerInfrastructure'] && (
                    <div className="ai-suggestion">
                      <p><Check size={12} className="inline mr-1" /> {aiSuggestions['powerInfrastructure']}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="section-title">Space Assessment</h3>
              
              <div className="field-row">
                <div>
                  <Label htmlFor="availableRackSpace">Available Rack Space</Label>
                  <Input
                    id="availableRackSpace"
                    name="availableRackSpace"
                    value={formData.availableRackSpace}
                    onChange={handleInputChange}
                    placeholder="e.g. 10U"
                  />
                </div>
                
                <div>
                  <Label htmlFor="ventilationDetails">Ventilation</Label>
                  <Select
                    value={formData.ventilationDetails}
                    onValueChange={(value) => handleSelectChange("ventilationDetails", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="adequate">Adequate</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="field-row">
                <div>
                  <Label htmlFor="securityDetails">Security Measures</Label>
                  <Select
                    value={formData.securityDetails}
                    onValueChange={(value) => handleSelectChange("securityDetails", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High Security</SelectItem>
                      <SelectItem value="medium">Medium Security</SelectItem>
                      <SelectItem value="low">Low Security</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="spaceConstraints">Space Constraints</Label>
                  <Input
                    id="spaceConstraints"
                    name="spaceConstraints"
                    value={formData.spaceConstraints}
                    onChange={handleInputChange}
                    placeholder="Any space limitations or constraints"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="section-title mb-0">Additional Notes</h3>
                {formData.useAIAssistance && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleEnhanceNotes}
                    disabled={isProcessing || !formData.additionalNotes}
                  >
                    Enhance with AI
                  </Button>
                )}
              </div>
              
              <Textarea
                id="additionalNotes"
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleInputChange}
                placeholder="Any additional information, observations, or requirements"
                rows={5}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="photos" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="section-title">Site Photos</h3>
              <p className="text-sm text-muted-foreground mb-4">Capture or upload photos of the site for comprehensive documentation.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <ImageCapture
                    label="Building Exterior"
                    description="Capture the exterior of the building"
                    onCapture={(imageData) => handleImageCapture("exterior", imageData)}
                    capturedImage={formData.sitePhotos.exterior}
                  />
                  {aiSuggestions['exterior'] && (
                    <div className="ai-suggestion mt-2">
                      <p><Check size={12} className="inline mr-1" /> {aiSuggestions['exterior']}</p>
                    </div>
                  )}
                </div>
                
                <div>
                  <ImageCapture
                    label="Server Room"
                    description="Capture the server room or installation area"
                    onCapture={(imageData) => handleImageCapture("serverRoom", imageData)}
                    capturedImage={formData.sitePhotos.serverRoom}
                  />
                  {aiSuggestions['serverRoom'] && (
                    <div className="ai-suggestion mt-2">
                      <p><Check size={12} className="inline mr-1" /> {aiSuggestions['serverRoom']}</p>
                    </div>
                  )}
                </div>
                
                <div>
                  <ImageCapture
                    label="Network Cabinet"
                    description="Capture existing network equipment/cabinet"
                    onCapture={(imageData) => handleImageCapture("networkCabinet", imageData)}
                    capturedImage={formData.sitePhotos.networkCabinet}
                  />
                  {aiSuggestions['networkCabinet'] && (
                    <div className="ai-suggestion mt-2">
                      <p><Check size={12} className="inline mr-1" /> {aiSuggestions['networkCabinet']}</p>
                    </div>
                  )}
                </div>
                
                <div>
                  <ImageCapture
                    label="Power Source"
                    description="Capture power distribution panels/UPS"
                    onCapture={(imageData) => handleImageCapture("powerSource", imageData)}
                    capturedImage={formData.sitePhotos.powerSource}
                  />
                  {aiSuggestions['powerSource'] && (
                    <div className="ai-suggestion mt-2">
                      <p><Check size={12} className="inline mr-1" /> {aiSuggestions['powerSource']}</p>
                    </div>
                  )}
                </div>
              </div>
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
          <Button type="submit">Submit Assessment</Button>
        </div>
      </div>
    </form>
  );
};

export default SiteAssessmentForm;
