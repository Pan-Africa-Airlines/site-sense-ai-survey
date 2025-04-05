import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { useAI } from "@/contexts/AIContext";
import { toast } from "sonner";
import { MapPin, Info, Check, Calendar, Users, Building, Router, FileText, Power, Radio, Thermometer, Save, Loader } from "lucide-react";
import ImageCapture from "./ImageCapture";
import { useGeolocation } from "@/hooks/useGeolocation";

interface SiteInstallationFormProps {
  onSubmit?: (data: any) => void;
  installationData?: any; // Optional installation data to pre-fill fields
  showAIRecommendations?: boolean;
}

const SiteInstallationForm: React.FC<SiteInstallationFormProps> = ({ 
  onSubmit, 
  installationData, 
  showAIRecommendations = false 
}) => {
  const { isProcessing, analyzeImage, getSuggestion, enhanceNotes } = useAI();
  const [formData, setFormData] = useState({
    installationDate: installationData?.installationDate || new Date().toISOString().split('T')[0],
    installationType: installationData?.installationType || "",
    siteName: installationData?.siteName || "",
    siteAddress: installationData?.siteAddress || "",
    siteCoordinates: installationData?.siteCoordinates || "",
    customerName: installationData?.customerName || "",
    customerContactPerson: installationData?.customerContactPerson || "",
    installedEquipment: {
      switches: installationData?.installedEquipment?.switches || false,
      routers: installationData?.installedEquipment?.routers || false,
      servers: installationData?.installedEquipment?.servers || false,
      firewalls: installationData?.installedEquipment?.firewalls || false,
      ups: installationData?.installedEquipment?.ups || false,
      coolingSystems: installationData?.installedEquipment?.coolingSystems || false,
      other: installationData?.installedEquipment?.other || false,
    },
    powerAvailability: installationData?.powerAvailability || "",
    networkConnectivity: installationData?.networkConnectivity || "",
    environmentalConditions: installationData?.environmentalConditions || "",
    installationNotes: installationData?.installationNotes || "",
    installerName: installationData?.installerName || "",
    installerContact: installationData?.installerContact || "",
    installationPhotos: installationData?.installationPhotos || "",
    siteSketch: installationData?.siteSketch || "",
    testResults: installationData?.testResults || "",
    challengesFaced: installationData?.challengesFaced || "",
    recommendations: installationData?.recommendations || "",
    completionDate: installationData?.completionDate || new Date().toISOString().split('T')[0],
    signature: installationData?.signature || "",
    useAIAssistance: installationData?.useAIAssistance || true,
  });
  const [aiSuggestions, setAiSuggestions] = useState({});
  const { latitude, longitude, address, loading: locationLoading } = useGeolocation();

  useEffect(() => {
    if (showAIRecommendations && formData.siteAddress) {
      getSuggestion("siteAddress", formData.siteAddress).then(suggestion => {
        if (suggestion) {
          setAiSuggestions(prev => ({ ...prev, siteAddress: suggestion }));
        }
      });
    }
  }, [formData.siteAddress, getSuggestion, showAIRecommendations]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      installedEquipment: {
        ...prevState.installedEquipment,
        [name]: checked,
      },
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleImageCapture = (type: string, imageData: string) => {
    setFormData({
      ...formData,
      [type]: imageData
    });

    if (formData.useAIAssistance && imageData) {
      analyzeImage(imageData, "site").then(analysis => {
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
        siteCoordinates: `${latitude}, ${longitude}`,
        siteAddress: address || formData.siteAddress
      });
      toast.success("Location updated successfully");
    } else {
      toast.error("Could not get location. Please try again.");
    }
  };

  const handleGetAISuggestion = async (fieldName: string) => {
    const suggestion = await getSuggestion(fieldName, formData[fieldName] as string);
    if (suggestion) {
      setAiSuggestions({ ...aiSuggestions, [fieldName]: suggestion });
    }
  };

  const handleEnhanceNotes = async () => {
    if (formData.installationNotes) {
      const enhancedNotes = await enhanceNotes(formData.installationNotes, "installation");
      setFormData({ ...formData, installationNotes: enhancedNotes });
      toast.success("Notes enhanced with AI assistance");
    } else {
      toast.error("Please add some notes to enhance");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
    toast.success("Installation data submitted!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-bcx">Network Installation Form</h2>
          <h3 className="text-xl font-semibold">Site Installation Details</h3>
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
          <table className="w-full">
            <tbody>
              <tr>
                <td className="font-medium w-1/4 bg-gray-50 p-4">Installation Date:</td>
                <td className="p-4">
                  <Input
                    type="date"
                    name="installationDate"
                    value={formData.installationDate}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </td>
              </tr>
              <tr>
                <td className="font-medium w-1/4 bg-gray-50 p-4">Installation Type:</td>
                <td className="p-4">
                  <Select
                    value={formData.installationType}
                    onValueChange={(value) => handleSelectChange("installationType", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select installation type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New Installation</SelectItem>
                      <SelectItem value="upgrade">Upgrade</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card className="overflow-hidden shadow-md">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Site Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                type="text"
                id="siteName"
                name="siteName"
                value={formData.siteName}
                onChange={handleInputChange}
                placeholder="Enter site name"
              />
            </div>
            <div className="relative">
              <Label htmlFor="siteAddress">Site Address</Label>
              <div className="flex space-x-2">
                <Input
                  type="text"
                  id="siteAddress"
                  name="siteAddress"
                  value={formData.siteAddress}
                  onChange={handleInputChange}
                  placeholder="Enter site address"
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
              {showAIRecommendations && aiSuggestions.siteAddress && (
                <div className="ai-suggestion mt-2">
                  <Info className="h-4 w-4 inline-block mr-1" />
                  {aiSuggestions.siteAddress}
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="siteCoordinates">Site Coordinates</Label>
              <Input
                type="text"
                id="siteCoordinates"
                name="siteCoordinates"
                value={formData.siteCoordinates}
                onChange={handleInputChange}
                placeholder="Enter site coordinates"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden shadow-md">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                type="text"
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                placeholder="Enter customer name"
              />
            </div>
            <div>
              <Label htmlFor="customerContactPerson">Contact Person</Label>
              <Input
                type="text"
                id="customerContactPerson"
                name="customerContactPerson"
                value={formData.customerContactPerson}
                onChange={handleInputChange}
                placeholder="Enter contact person"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden shadow-md">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Installed Equipment</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="inline-flex items-center space-x-2">
                <Checkbox
                  id="switches"
                  name="switches"
                  checked={formData.installedEquipment.switches}
                  onCheckedChange={checked => setFormData(prevState => ({
                    ...prevState,
                    installedEquipment: {
                      ...prevState.installedEquipment,
                      switches: checked === true,
                    },
                  }))}
                />
                <span>Switches</span>
              </Label>
            </div>
            <div>
              <Label className="inline-flex items-center space-x-2">
                <Checkbox
                  id="routers"
                  name="routers"
                  checked={formData.installedEquipment.routers}
                  onCheckedChange={checked => setFormData(prevState => ({
                    ...prevState,
                    installedEquipment: {
                      ...prevState.installedEquipment,
                      routers: checked === true,
                    },
                  }))}
                />
                <span>Routers</span>
              </Label>
            </div>
            <div>
              <Label className="inline-flex items-center space-x-2">
                <Checkbox
                  id="servers"
                  name="servers"
                  checked={formData.installedEquipment.servers}
                  onCheckedChange={checked => setFormData(prevState => ({
                    ...prevState,
                    installedEquipment: {
                      ...prevState.installedEquipment,
                      servers: checked === true,
                    },
                  }))}
                />
                <span>Servers</span>
              </Label>
            </div>
            <div>
              <Label className="inline-flex items-center space-x-2">
                <Checkbox
                  id="firewalls"
                  name="firewalls"
                  checked={formData.installedEquipment.firewalls}
                   onCheckedChange={checked => setFormData(prevState => ({
                    ...prevState,
                    installedEquipment: {
                      ...prevState.installedEquipment,
                      firewalls: checked === true,
                    },
                  }))}
                />
                <span>Firewalls</span>
              </Label>
            </div>
            <div>
              <Label className="inline-flex items-center space-x-2">
                <Checkbox
                  id="ups"
                  name="ups"
                  checked={formData.installedEquipment.ups}
                  onCheckedChange={checked => setFormData(prevState => ({
                    ...prevState,
                    installedEquipment: {
                      ...prevState.installedEquipment,
                      ups: checked === true,
                    },
                  }))}
                />
                <span>UPS</span>
              </Label>
            </div>
            <div>
              <Label className="inline-flex items-center space-x-2">
                <Checkbox
                  id="coolingSystems"
                  name="coolingSystems"
                  checked={formData.installedEquipment.coolingSystems}
                  onCheckedChange={checked => setFormData(prevState => ({
                    ...prevState,
                    installedEquipment: {
                      ...prevState.installedEquipment,
                      coolingSystems: checked === true,
                    },
                  }))}
                />
                <span>Cooling Systems</span>
              </Label>
            </div>
            <div>
              <Label className="inline-flex items-center space-x-2">
                <Checkbox
                  id="other"
                  name="other"
                  checked={formData.installedEquipment.other}
                  onCheckedChange={checked => setFormData(prevState => ({
                    ...prevState,
                    installedEquipment: {
                      ...prevState.installedEquipment,
                      other: checked === true,
                    },
                  }))}
                />
                <span>Other</span>
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden shadow-md">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Additional Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="powerAvailability">Power Availability</Label>
              <Input
                type="text"
                id="powerAvailability"
                name="powerAvailability"
                value={formData.powerAvailability}
                onChange={handleInputChange}
                placeholder="Enter power availability details"
              />
            </div>
            <div>
              <Label htmlFor="networkConnectivity">Network Connectivity</Label>
              <Input
                type="text"
                id="networkConnectivity"
                name="networkConnectivity"
                value={formData.networkConnectivity}
                onChange={handleInputChange}
                placeholder="Enter network connectivity details"
              />
            </div>
            <div>
              <Label htmlFor="environmentalConditions">Environmental Conditions</Label>
              <Input
                type="text"
                id="environmentalConditions"
                name="environmentalConditions"
                value={formData.environmentalConditions}
                onChange={handleInputChange}
                placeholder="Enter environmental conditions details"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden shadow-md">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Installation Notes</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Textarea
                id="installationNotes"
                name="installationNotes"
                value={formData.installationNotes}
                onChange={handleInputChange}
                placeholder="Enter installation notes"
                rows={4}
              />
              {showAIRecommendations && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="mt-2"
                  onClick={handleEnhanceNotes}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Enhancing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Enhance with AI
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden shadow-md">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Installer Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="installerName">Installer Name</Label>
              <Input
                type="text"
                id="installerName"
                name="installerName"
                value={formData.installerName}
                onChange={handleInputChange}
                placeholder="Enter installer name"
              />
            </div>
            <div>
              <Label htmlFor="installerContact">Contact Number</Label>
              <Input
                type="text"
                id="installerContact"
                name="installerContact"
                value={formData.installerContact}
                onChange={handleInputChange}
                placeholder="Enter contact number"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Installation Photos</h3>
          <ImageCapture
            label="Installation Photos"
            description="Take a photo of the completed installation"
            onCapture={(imageData) => handleImageCapture("installationPhotos", imageData)}
            capturedImage={formData.installationPhotos}
          />
          {aiSuggestions['installationPhotos'] && (
            <div className="ai-suggestion mt-2">
              <p><Check size={12} className="inline mr-1" /> {aiSuggestions['installationPhotos']}</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Site Sketch</h3>
          <ImageCapture
            label="Site Sketch"
            description="Take a photo of the site sketch"
            onCapture={(imageData) => handleImageCapture("siteSketch", imageData)}
            capturedImage={formData.siteSketch}
          />
          {aiSuggestions['siteSketch'] && (
            <div className="ai-suggestion mt-2">
              <p><Check size={12} className="inline mr-1" /> {aiSuggestions['siteSketch']}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="overflow-hidden shadow-md">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Final Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="testResults">Test Results</Label>
              <Textarea
                id="testResults"
                name="testResults"
                value={formData.testResults}
                onChange={handleInputChange}
                placeholder="Enter test results"
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="challengesFaced">Challenges Faced</Label>
              <Textarea
                id="challengesFaced"
                name="challengesFaced"
                value={formData.challengesFaced}
                onChange={handleInputChange}
                placeholder="Enter challenges faced"
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="recommendations">Recommendations</Label>
              <Textarea
                id="recommendations"
                name="recommendations"
                value={formData.recommendations}
                onChange={handleInputChange}
                placeholder="Enter recommendations"
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="completionDate">Completion Date</Label>
              <Input
                type="date"
                id="completionDate"
                name="completionDate"
                value={formData.completionDate}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="signature">Signature</Label>
              <Input
                type="text"
                id="signature"
                name="signature"
                value={formData.signature}
                onChange={handleInputChange}
                placeholder="Enter signature"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4 pt-6">
        <Button type="reset" variant="outline">
          Cancel
        </Button>
        <Button type="submit">
          Submit
        </Button>
      </div>
    </form>
  );
};

export default SiteInstallationForm;
