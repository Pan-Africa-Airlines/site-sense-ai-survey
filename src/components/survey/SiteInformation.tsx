
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageCapture from "@/components/ImageCapture";
import { Camera, MapPin } from "lucide-react";

interface SiteInformationProps {
  formData: any;
  onInputChange: (field: string, value: any) => void;
  showAIRecommendations?: boolean;
}

const SiteInformation: React.FC<SiteInformationProps> = ({
  formData,
  onInputChange,
  showAIRecommendations = false
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-center mb-6">
        <img 
          src="public/lovable-uploads/f3b0d24a-bde2-40c2-84a6-ed83f7605bce.png" 
          alt="BCX Logo" 
          className="h-20 object-contain" 
        />
      </div>
      
      <h1 className="text-2xl font-bold text-center mb-8">ESKOM OT IP/MPLS NETWORK</h1>
      <h2 className="text-xl font-bold text-center mb-8">SITE SURVEY REPORT</h2>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-medium">1.1 Site Identification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={formData.siteName}
                onChange={(e) => onInputChange("siteName", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="siteId">Site ID (WorkPlace ID)</Label>
              <Input
                id="siteId"
                value={formData.siteId}
                onChange={(e) => onInputChange("siteId", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="siteType">Site Type (Sub-TX, RS, PS-Coal)</Label>
              <Input
                id="siteType"
                value={formData.siteType}
                onChange={(e) => onInputChange("siteType", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Input
                id="region"
                value={formData.region}
                onChange={(e) => onInputChange("region", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => onInputChange("date", e.target.value)}
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address/Location Description</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => onInputChange("address", e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gpsCoordinates">GPS coordinates WGS84 (Lat/Long)</Label>
              <Input
                id="gpsCoordinates"
                value={formData.gpsCoordinates}
                onChange={(e) => onInputChange("gpsCoordinates", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Building Photo</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">Full front view photo of building where IP/MPLS equipment will be situated.</p>
          <ImageCapture
            onImageCaptured={(url) => onInputChange("buildingPhoto", url)}
            onCapture={(url) => onInputChange("buildingPhoto", url)}
            capturedImage={formData.buildingPhoto}
            label="Building Photo"
            description="Take a clear photo of the building front"
          />
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-medium">1.2 Eskom Site Location</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">Please provide a Google Map view of the site location with coordinates.</p>
          <ImageCapture
            onImageCaptured={(url) => onInputChange("googleMapView", url)}
            onCapture={(url) => onInputChange("googleMapView", url)}
            capturedImage={formData.googleMapView}
            label="Google Maps Screenshot"
            description="Capture a screenshot of the Google Maps location"
          />
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-medium">1.3 Equipment Location</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="buildingName">Building name</Label>
              <Input
                id="buildingName"
                value={formData.buildingName}
                onChange={(e) => onInputChange("buildingName", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="buildingType">Building type (e.g. Container, Brick)</Label>
              <Input
                id="buildingType"
                value={formData.buildingType}
                onChange={(e) => onInputChange("buildingType", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="floorLevel">Floor level</Label>
              <Input
                id="floorLevel"
                value={formData.floorLevel}
                onChange={(e) => onInputChange("floorLevel", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="equipmentRoomName">Equipment Room number / name</Label>
              <Input
                id="equipmentRoomName"
                value={formData.equipmentRoomName}
                onChange={(e) => onInputChange("equipmentRoomName", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-medium">1.4 Access Procedure</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-6 gap-4 border-b pb-2">
              <div className="col-span-2 font-semibold">Subject</div>
              <div className="col-span-4 font-semibold">Description</div>
            </div>
            
            <div className="grid grid-cols-6 gap-4 border-b pb-4">
              <div className="col-span-2">Requirements for site access</div>
              <div className="col-span-4">
                <Textarea
                  value={formData.accessRequirements}
                  onChange={(e) => onInputChange("accessRequirements", e.target.value)}
                  rows={2}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-6 gap-4 border-b pb-4">
              <div className="col-span-2">Site security requirements</div>
              <div className="col-span-4">
                <Textarea
                  value={formData.securityRequirements}
                  onChange={(e) => onInputChange("securityRequirements", e.target.value)}
                  rows={2}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-6 gap-4">
              <div className="col-span-2">Vehicle type to reach site</div>
              <div className="col-span-4">
                <Input
                  value={formData.vehicleType}
                  onChange={(e) => onInputChange("vehicleType", e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-medium">1.5 Eskom site owner contact details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-4 border-b pb-2">
              <div className="col-span-3 font-semibold">Contact name</div>
              <div className="col-span-2 font-semibold">Cellphone number</div>
              <div className="col-span-2 font-semibold">Email address</div>
            </div>
            
            {formData.siteContacts.map((contact: any, index: number) => (
              <div key={index} className="grid grid-cols-7 gap-4 border-b pb-4">
                <div className="col-span-3">
                  <Input
                    value={contact.name}
                    onChange={(e) => {
                      const newContacts = [...formData.siteContacts];
                      newContacts[index] = { ...contact, name: e.target.value };
                      onInputChange("siteContacts", newContacts);
                    }}
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    value={contact.cellphone}
                    onChange={(e) => {
                      const newContacts = [...formData.siteContacts];
                      newContacts[index] = { ...contact, cellphone: e.target.value };
                      onInputChange("siteContacts", newContacts);
                    }}
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    value={contact.email}
                    onChange={(e) => {
                      const newContacts = [...formData.siteContacts];
                      newContacts[index] = { ...contact, email: e.target.value };
                      onInputChange("siteContacts", newContacts);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteInformation;
