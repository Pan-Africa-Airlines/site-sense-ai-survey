
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import BCXLogo from "@/components/ui/logo";
import ImageCapture from "@/components/ImageCapture";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { EskomSite } from "@/types/site";

interface SurveyCoverProps {
  formData: any;
  onInputChange: (field: string, value: any) => void;
  showAIRecommendations?: boolean;
}

const SurveyCover: React.FC<SurveyCoverProps> = ({
  formData,
  onInputChange,
  showAIRecommendations = false
}) => {
  const [sites, setSites] = useState<EskomSite[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSites = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("eskom_sites")
          .select("*")
          .order("name");

        if (error) throw error;
        setSites((data || []) as EskomSite[]);
      } catch (error) {
        console.error("Error fetching sites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSites();
  }, []);

  // Handle site selection
  const handleSiteChange = (siteName: string) => {
    // Find the selected site
    const selectedSite = sites.find(site => site.name === siteName);
    
    onInputChange("siteName", siteName);
    
    // If site has a type, update that too
    if (selectedSite?.type) {
      onInputChange("siteType", selectedSite.type);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center mb-6">
        <BCXLogo className="h-20" />
      </div>
      
      <div className="text-center space-y-4 mb-10">
        <h1 className="text-2xl font-bold uppercase">Eskom OT IP/MPLS Network</h1>
        <h2 className="text-xl font-bold uppercase">Site Survey Report</h2>
      </div>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name:</Label>
              {loading ? (
                <Input value="Loading sites..." disabled />
              ) : sites.length > 0 ? (
                <Select 
                  value={formData.siteName} 
                  onValueChange={handleSiteChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a site" />
                  </SelectTrigger>
                  <SelectContent>
                    {sites.map((site) => (
                      <SelectItem key={site.id} value={site.name}>
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
              <Label htmlFor="region">Region:</Label>
              <Input
                id="region"
                value={formData.region || ""}
                onChange={(e) => onInputChange("region", e.target.value)}
                placeholder="Enter region"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Date:</Label>
              <Input
                id="date"
                type="date"
                value={formData.date || ""}
                onChange={(e) => onInputChange("date", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <p className="text-sm font-medium mb-3">Full front view photo of building where IP/MPLS equipment will be situated.</p>
          <div className="border border-gray-300 p-2 min-h-[300px] flex items-center justify-center">
            <ImageCapture
              onImageCaptured={(url) => onInputChange("buildingPhoto", url)}
              onCapture={(url) => onInputChange("buildingPhoto", url)}
              capturedImage={formData.buildingPhoto}
              label="Building Photo"
              description="Take a clear photo of the building front"
            />
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-blue-700 mb-4">Contents</h3>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">1. SITE INFORMATION & LOCATION</span> ...................................................................................................... 4</p>
            <p className="ml-4">1.1. Site Identification......................................................................................................................................... 4</p>
            <p className="ml-4">1.2. Eskom Site Location.................................................................................................................................... 4</p>
            <p className="ml-4">1.3. Equipment Location..................................................................................................................................... 5</p>
            <p className="ml-4">1.4. Access Procedure........................................................................................................................................ 5</p>
            <p className="ml-4">1.5. Eskom site owner contact details .............................................................................................................. 5</p>
            <p><span className="font-medium">2. EQUIPMENT ROOM (GENERAL)</span> ..................................................................................................... 6</p>
            <p><span className="font-medium">3. DETAILED SITE RECORDS</span> .................................................................................................................. 6</p>
            <p className="ml-4">3.1. Equipment Cabinet Space Planning........................................................................................................ 6</p>
            <p className="ml-4">3.2. Transport Platforms................................................................................................................................... 7</p>
            <p className="ml-4">3.3. 50V DC Power Distribution .................................................................................................................... 7</p>
            <p className="ml-4">3.4. Eskom equipment room photos ............................................................................................................. 7</p>
            <p className="ml-4">3.5. New cabinet location photos.................................................................................................................. 8</p>
            <p className="ml-4">3.6. DC Power Distribution photos .............................................................................................................. 8</p>
            <p className="ml-4">3.7. Transport Equipment photos (Close-Ups) .......................................................................................... 9</p>
            <p className="ml-4">3.8. Optical Distribution Frame photos (Close-Ups), if applicable........................................................... 9</p>
            <p className="ml-4">3.9. Access Equipment photos (Close-Ups) ............................................................................................ 10</p>
            <p className="ml-4">3.10. Cable routing (overhead/underfloor/Both)................................................................................... 10</p>
            <p className="ml-4">3.11. Equipment Room ceiling & HVAC photos ...................................................................................... 11</p>
            <p><span className="font-medium">4. INSTALLATION REQUIREMENTS</span> ...................................................................................................... 12</p>
            <p><span className="font-medium">5. GENERAL REMARKS</span> ............................................................................................................................ 12</p>
          </div>
        </CardContent>
      </Card>
      
      {showAIRecommendations && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-sm text-blue-700 space-y-2">
              <p>📝 <strong>Documentation Completeness:</strong> Ensure all fields are accurately filled in. Missing information can cause delays in the project approval.</p>
              <p>📊 <strong>Accurate Information:</strong> Double-check site details, as they will be used for equipment ordering and installation planning.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SurveyCover;
