
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageCapture from "@/components/ImageCapture";

interface BuildingPhotoProps {
  formData: any;
  onInputChange: (field: string, value: any) => void;
}

const BuildingPhoto: React.FC<BuildingPhotoProps> = ({
  formData,
  onInputChange
}) => {
  return (
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
  );
};

export default BuildingPhoto;
