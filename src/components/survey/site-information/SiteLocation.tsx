
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageCapture from "@/components/ImageCapture";

interface SiteLocationProps {
  formData: any;
  onInputChange: (field: string, value: any) => void;
}

const SiteLocation: React.FC<SiteLocationProps> = ({
  formData,
  onInputChange
}) => {
  return (
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
  );
};

export default SiteLocation;
