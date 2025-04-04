
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
import { MapPin, Info, Check } from "lucide-react";
import ImageCapture from "./ImageCapture";

interface SiteInstallationFormProps {
  onSubmit: (data: any) => void;
  assessmentData?: any; // Optional assessment data to pre-fill fields
}

const SiteInstallationForm: React.FC<SiteInstallationFormProps> = ({ onSubmit, assessmentData }) => {
  const { latitude, longitude, address, loading: locationLoading } = useGeolocation();
  const { isProcessing, analyzeImage, getSuggestion, enhanceNotes } = useAI();
  
  const initialFormData = {
    // Installation Information
    installationDate: new Date().toISOString().split('T')[0],
    installationType: "new", // new, upgrade, replacement
    
    // Site Information (pre-filled if assessment data exists)
    siteName: assessmentData?.siteName || "",
    siteAddress: assessmentData?.siteAddress || "",
    siteCoordinates: assessmentData?.siteCoordinates || "",
    customerName: assessmentData?.customerName || "",
    customerContactPerson: assessmentData?.customerContactPerson || "",
    
    // Equipment Details
    installedEquipment: {
      switches: false,
      routers: false,
      accessPoints: false,
      servers: false,
      storage: false,
      cabling: false,
      ups: false,
      other: false
    },
    equipmentDetails: "",
    
    // Network Configuration
    networkSubnet: "",
    ipRange: "",
    gateway: "",
    dnsServers: "",
    vlanConfiguration: "",
    wirelessDetails: "",
    
    // Installation Tasks
    rackMounting: false,
    cableLaying: false,
    powerConfiguration: false,
    networkConfiguration: false,
    testing: false,
    documentation: false,
    userTraining: false,
    
    // Installation Photos
    installationPhotos: {
      rackSetup: "",
      cabling: "",
      equipment: "",
      testing: ""
    },
    
    // Additional Details
    challengesFaced: "",
    resolutionDetails: "",
    additionalNotes: "",
    
    // Engineer Details
    engineerName: assessmentData?.engineerName || "",
    engineerContact: assessmentData?.engineerContact || "",
    
    useAIAssistance: true
  };
  
  const [formData, setFormData] = useState(initialFormData);
  const [aiSuggestions, setAiSuggestions] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState("basic");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };
  
  const handleCheckboxChange = (category: string, item: string, checked: boolean) => {
    if (category === 'installedEquipment') {
      setFormData({
        ...formData,
        installedEquipment: {
          ...formData.installedEquipment,
          [item]: checked
        }
      });
    } else if (category === 'tasks') {
      setFormData({
        ...formData,
        [item]: checked
      });
    }
  };

  const handleImageCapture = (type: keyof typeof formData.installationPhotos, imageData: string) => {
    setFormData({
      ...formData,
      installationPhotos: {
        ...formData.installationPhotos,
        [type]: imageData
      }
    });

    // If AI assistance is enabled and an image was captured, analyze it
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
    const requiredFields = ['siteName', 'installationDate', 'engineerName'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }
    
    onSubmit(formData);
    toast.success("Installation record submitted successfully!");
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <form onSubmit={handleSubmitForm} className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-bcx">Site Installation Form</h2>
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

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="section-title">Installation Information</h3>
              
              <div className="field-row">
                <div>
                  <Label htmlFor="installationDate" className="required">Installation Date</Label>
                  <Input
                    id="installationDate"
                    name="installationDate"
                    type="date"
                    value={formData.installationDate}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="installationType">Installation Type</Label>
                  <Select
                    value={formData.installationType}
                    onValueChange={(value) => handleSelectChange("installationType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New Installation</SelectItem>
                      <SelectItem value="upgrade">Upgrade</SelectItem>
                      <SelectItem value="replacement">Replacement</SelectItem>
                      <SelectItem value="expansion">Expansion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
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
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    placeholder="e.g. ABC Corporation"
                  />
                </div>
              </div>
              
              <div className="field-row">
                <div className="relative">
                  <Label htmlFor="siteAddress">Site Address</Label>
                  <Input
                    id="siteAddress"
                    name="siteAddress"
                    value={formData.siteAddress}
                    onChange={handleInputChange}
                    placeholder="Full address of the site"
                  />
                </div>
                
                <div className="relative">
                  <Label htmlFor="siteCoordinatesInstall">GPS Coordinates</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="siteCoordinatesInstall"
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipment" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="section-title">Installed Equipment</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="switches" 
                    checked={formData.installedEquipment.switches}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('installedEquipment', 'switches', checked as boolean)
                    }
                  />
                  <Label htmlFor="switches" className="cursor-pointer">Switches</Label>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="routers" 
                    checked={formData.installedEquipment.routers}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('installedEquipment', 'routers', checked as boolean)
                    }
                  />
                  <Label htmlFor="routers" className="cursor-pointer">Routers</Label>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="accessPoints" 
                    checked={formData.installedEquipment.accessPoints}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('installedEquipment', 'accessPoints', checked as boolean)
                    }
                  />
                  <Label htmlFor="accessPoints" className="cursor-pointer">Access Points</Label>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="servers" 
                    checked={formData.installedEquipment.servers}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('installedEquipment', 'servers', checked as boolean)
                    }
                  />
                  <Label htmlFor="servers" className="cursor-pointer">Servers</Label>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="storage" 
                    checked={formData.installedEquipment.storage}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('installedEquipment', 'storage', checked as boolean)
                    }
                  />
                  <Label htmlFor="storage" className="cursor-pointer">Storage</Label>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="cabling" 
                    checked={formData.installedEquipment.cabling}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('installedEquipment', 'cabling', checked as boolean)
                    }
                  />
                  <Label htmlFor="cabling" className="cursor-pointer">Cabling</Label>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="ups" 
                    checked={formData.installedEquipment.ups}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('installedEquipment', 'ups', checked as boolean)
                    }
                  />
                  <Label htmlFor="ups" className="cursor-pointer">UPS</Label>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="other" 
                    checked={formData.installedEquipment.other}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('installedEquipment', 'other', checked as boolean)
                    }
                  />
                  <Label htmlFor="other" className="cursor-pointer">Other</Label>
                </div>
              </div>
              
              <div className="field-row">
                <div className="field-full">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="equipmentDetails">Equipment Details</Label>
                    {formData.useAIAssistance && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleGetAISuggestion('equipmentRecommendation')}
                        disabled={isProcessing}
                        className="h-8 px-2 text-xs"
                      >
                        <Info size={14} className="mr-1" />
                        Get AI Suggestion
                      </Button>
                    )}
                  </div>
                  <Textarea
                    id="equipmentDetails"
                    name="equipmentDetails"
                    value={formData.equipmentDetails}
                    onChange={handleInputChange}
                    placeholder="Detailed specifications of installed equipment (make, model, serial numbers, etc.)"
                    rows={4}
                  />
                  {aiSuggestions['equipmentRecommendation'] && (
                    <div className="ai-suggestion">
                      <p><Check size={12} className="inline mr-1" /> {aiSuggestions['equipmentRecommendation']}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="section-title">Installation Tasks</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="rackMounting" 
                    checked={formData.rackMounting}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('tasks', 'rackMounting', checked as boolean)
                    }
                  />
                  <Label htmlFor="rackMounting" className="cursor-pointer">Rack Mounting</Label>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="cableLaying" 
                    checked={formData.cableLaying}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('tasks', 'cableLaying', checked as boolean)
                    }
                  />
                  <Label htmlFor="cableLaying" className="cursor-pointer">Cable Laying</Label>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="powerConfiguration" 
                    checked={formData.powerConfiguration}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('tasks', 'powerConfiguration', checked as boolean)
                    }
                  />
                  <Label htmlFor="powerConfiguration" className="cursor-pointer">Power Config</Label>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="networkConfiguration" 
                    checked={formData.networkConfiguration}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('tasks', 'networkConfiguration', checked as boolean)
                    }
                  />
                  <Label htmlFor="networkConfiguration" className="cursor-pointer">Network Config</Label>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="testing" 
                    checked={formData.testing}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('tasks', 'testing', checked as boolean)
                    }
                  />
                  <Label htmlFor="testing" className="cursor-pointer">Testing</Label>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="documentation" 
                    checked={formData.documentation}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('tasks', 'documentation', checked as boolean)
                    }
                  />
                  <Label htmlFor="documentation" className="cursor-pointer">Documentation</Label>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="userTraining" 
                    checked={formData.userTraining}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('tasks', 'userTraining', checked as boolean)
                    }
                  />
                  <Label htmlFor="userTraining" className="cursor-pointer">User Training</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="network" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="section-title">Network Configuration</h3>
              
              <div className="field-row">
                <div>
                  <Label htmlFor="networkSubnet">Network Subnet</Label>
                  <Input
                    id="networkSubnet"
                    name="networkSubnet"
                    value={formData.networkSubnet}
                    onChange={handleInputChange}
                    placeholder="e.g. 192.168.1.0/24"
                  />
                </div>
                
                <div>
                  <Label htmlFor="ipRange">IP Range</Label>
                  <Input
                    id="ipRange"
                    name="ipRange"
                    value={formData.ipRange}
                    onChange={handleInputChange}
                    placeholder="e.g. 192.168.1.10 - 192.168.1.50"
                  />
                </div>
              </div>
              
              <div className="field-row">
                <div>
                  <Label htmlFor="gateway">Default Gateway</Label>
                  <Input
                    id="gateway"
                    name="gateway"
                    value={formData.gateway}
                    onChange={handleInputChange}
                    placeholder="e.g. 192.168.1.1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="dnsServers">DNS Servers</Label>
                  <Input
                    id="dnsServers"
                    name="dnsServers"
                    value={formData.dnsServers}
                    onChange={handleInputChange}
                    placeholder="e.g. 8.8.8.8, 8.8.4.4"
                  />
                </div>
              </div>
              
              <div className="field-row">
                <div>
                  <Label htmlFor="vlanConfiguration">VLAN Configuration</Label>
                  <Textarea
                    id="vlanConfiguration"
                    name="vlanConfiguration"
                    value={formData.vlanConfiguration}
                    onChange={handleInputChange}
                    placeholder="Details of VLAN setup (IDs, names, purpose)"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="wirelessDetails">Wireless Network Details</Label>
                  <Textarea
                    id="wirelessDetails"
                    name="wirelessDetails"
                    value={formData.wirelessDetails}
                    onChange={handleInputChange}
                    placeholder="SSID, security, coverage details"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="section-title">Challenges & Resolutions</h3>
              
              <div className="field-row">
                <div>
                  <Label htmlFor="challengesFaced">Challenges Faced</Label>
                  <Textarea
                    id="challengesFaced"
                    name="challengesFaced"
                    value={formData.challengesFaced}
                    onChange={handleInputChange}
                    placeholder="Any challenges or issues encountered during installation"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="resolutionDetails">Resolution Details</Label>
                  <Textarea
                    id="resolutionDetails"
                    name="resolutionDetails"
                    value={formData.resolutionDetails}
                    onChange={handleInputChange}
                    placeholder="How challenges were resolved"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documentation" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="section-title">Installation Photos</h3>
              <p className="text-sm text-muted-foreground mb-4">Document the installation with photos for record-keeping and verification.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <ImageCapture
                    label="Rack Setup"
                    description="Photo of rack mounting and equipment layout"
                    onCapture={(imageData) => handleImageCapture("rackSetup", imageData)}
                    capturedImage={formData.installationPhotos.rackSetup}
                  />
                  {aiSuggestions['rackSetup'] && (
                    <div className="ai-suggestion mt-2">
                      <p><Check size={12} className="inline mr-1" /> {aiSuggestions['rackSetup']}</p>
                    </div>
                  )}
                </div>
                
                <div>
                  <ImageCapture
                    label="Cabling"
                    description="Photo of cable management and installation"
                    onCapture={(imageData) => handleImageCapture("cabling", imageData)}
                    capturedImage={formData.installationPhotos.cabling}
                  />
                  {aiSuggestions['cabling'] && (
                    <div className="ai-suggestion mt-2">
                      <p><Check size={12} className="inline mr-1" /> {aiSuggestions['cabling']}</p>
                    </div>
                  )}
                </div>
                
                <div>
                  <ImageCapture
                    label="Equipment"
                    description="Close-up of installed equipment"
                    onCapture={(imageData) => handleImageCapture("equipment", imageData)}
                    capturedImage={formData.installationPhotos.equipment}
                  />
                  {aiSuggestions['equipment'] && (
                    <div className="ai-suggestion mt-2">
                      <p><Check size={12} className="inline mr-1" /> {aiSuggestions['equipment']}</p>
                    </div>
                  )}
                </div>
                
                <div>
                  <ImageCapture
                    label="Testing"
                    description="Photo of testing procedures/results"
                    onCapture={(imageData) => handleImageCapture("testing", imageData)}
                    capturedImage={formData.installationPhotos.testing}
                  />
                  {aiSuggestions['testing'] && (
                    <div className="ai-suggestion mt-2">
                      <p><Check size={12} className="inline mr-1" /> {aiSuggestions['testing']}</p>
                    </div>
                  )}
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
              
              <div className="field-row">
                <div className="field-full">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="additionalNotes">Additional Notes</Label>
                    {formData.useAIAssistance && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleGetAISuggestion('installationNotes')}
                        disabled={isProcessing}
                        className="h-8 px-2 text-xs"
                      >
                        <Info size={14} className="mr-1" />
                        Get AI Suggestion
                      </Button>
                    )}
                  </div>
                  <Textarea
                    id="additionalNotes"
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleInputChange}
                    placeholder="Any additional information, observations, or follow-up requirements"
                    rows={5}
                  />
                  {aiSuggestions['installationNotes'] && (
                    <div className="ai-suggestion">
                      <p><Check size={12} className="inline mr-1" /> {aiSuggestions['installationNotes']}</p>
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
          <Button type="submit">Submit Installation</Button>
        </div>
      </div>
    </form>
  );
};

export default SiteInstallationForm;
