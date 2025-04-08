
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EskomSite } from "../../../types/site";

interface SiteIdentificationProps {
  formData: any;
  onInputChange: (field: string, value: any) => void;
  sites: EskomSite[];
  loading: boolean;
}

// South African regions
const saRegions = [
  "Gauteng",
  "Western Cape",
  "Eastern Cape",
  "KwaZulu-Natal",
  "Free State",
  "North West",
  "Mpumalanga",
  "Limpopo",
  "Northern Cape"
];

// Site Types
const siteTypes = [
  "Sub-TX",
  "RS",
  "PS-Coal",
  "Other"
];

const SiteIdentification: React.FC<SiteIdentificationProps> = ({
  formData,
  onInputChange,
  sites,
  loading
}) => {
  const handleSiteChange = (siteName: string) => {
    // Find the selected site
    const selectedSite = sites.find(site => site.name === siteName);
    
    onInputChange("siteName", siteName);
    
    // If site has a type, update that too
    if (selectedSite?.type) {
      onInputChange("siteType", selectedSite.type);
    }
    
    // If site has a region, update that too
    if (selectedSite?.region) {
      onInputChange("region", selectedSite.region);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-medium">1.1 Site Identification</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="siteName">Site Name</Label>
            {loading ? (
              <Input value="Loading sites..." disabled />
            ) : sites.length > 0 ? (
              <Select 
                value={formData.siteName || "select-site"} 
                onValueChange={handleSiteChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a site" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="select-site">Select a site</SelectItem>
                  {sites.map((site) => (
                    <SelectItem key={site.id} value={site.name || `site-${site.id}`}>
                      {site.name} {site.type ? `(${site.type})` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id="siteName"
                value={formData.siteName || ""}
                onChange={(e) => onInputChange("siteName", e.target.value)}
                placeholder="Enter site name or configure sites in admin"
              />
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="siteId">Site ID (WorkPlace ID)</Label>
            <Input
              id="siteId"
              value={formData.siteId || ""}
              onChange={(e) => onInputChange("siteId", e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="siteType">Site Type</Label>
            <Select 
              value={formData.siteType || "select-type"} 
              onValueChange={(value) => onInputChange("siteType", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a site type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="select-type">Select a site type</SelectItem>
                {siteTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="region">Region</Label>
            <Select 
              value={formData.region || "select-region"} 
              onValueChange={(value) => onInputChange("region", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="select-region">Select a region</SelectItem>
                {saRegions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date || ""}
              onChange={(e) => onInputChange("date", e.target.value)}
            />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">Address/Location Description</Label>
            <Textarea
              id="address"
              value={formData.address || ""}
              onChange={(e) => onInputChange("address", e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="gpsCoordinates">GPS coordinates WGS84 (Lat/Long)</Label>
            <Input
              id="gpsCoordinates"
              value={formData.gpsCoordinates || ""}
              onChange={(e) => onInputChange("gpsCoordinates", e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SiteIdentification;
