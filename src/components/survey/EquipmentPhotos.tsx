
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageCapture from "@/components/ImageCapture";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import BCXLogo from "@/components/ui/logo";

interface EquipmentPhotosProps {
  formData: any;
  onInputChange: (field: string, value: any) => void;
  showAIRecommendations?: boolean;
}

const EquipmentPhotos: React.FC<EquipmentPhotosProps> = ({
  formData,
  onInputChange,
  showAIRecommendations = false
}) => {
  // Helper function to add a new image to an array
  const addImage = (fieldName: string) => {
    const newImages = [...formData[fieldName], ""];
    onInputChange(fieldName, newImages);
  };
  
  // Helper function to remove an image from an array
  const removeImage = (fieldName: string, index: number) => {
    const newImages = [...formData[fieldName]];
    newImages.splice(index, 1);
    onInputChange(fieldName, newImages);
  };
  
  // Helper function to update an image in an array
  const updateImage = (fieldName: string, index: number, value: string) => {
    const newImages = [...formData[fieldName]];
    newImages[index] = value;
    onInputChange(fieldName, newImages);
  };
  
  // Render a photo section with all its images
  const renderPhotoSection = (title: string, description: string, fieldName: string) => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">{description}</p>
        
        {formData[fieldName].map((image: string, index: number) => (
          <div key={index} className="mb-4 pb-4 border-b last:border-b-0">
            <ImageCapture
              onImageCaptured={(url) => updateImage(fieldName, index, url)}
              onCapture={(url) => updateImage(fieldName, index, url)}
              capturedImage={image}
              label={`Photo ${index + 1}`}
            />
            
            {index > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                className="mt-2 text-red-500 border-red-300 hover:bg-red-50"
                onClick={() => removeImage(fieldName, index)}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Remove Photo
              </Button>
            )}
          </div>
        ))}
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => addImage(fieldName)}
        >
          <PlusCircle className="h-4 w-4 mr-1" /> Add More Photos
        </Button>
      </CardContent>
    </Card>
  );
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center mb-6">
        <BCXLogo className="mb-4 h-16" />
        <h2 className="text-xl font-bold border-b pb-2 mb-4">3. DETAILED SITE RECORDS - Equipment Photos</h2>
      </div>
      
      {renderPhotoSection(
        "3.4. Eskom equipment room photos",
        "Please provide clear colour photographs that shows general equipment room layout, including Telecomms equipment cabinets, front and back (BME, ADM, Bearer Comms, Fibre Optic, 50V Charger, etc)",
        "equipmentRoomPhotos"
      )}
      
      {renderPhotoSection(
        "3.5. New cabinet location photos",
        "Please provide a clear colour photograph that shows the available floor space and proposed new cabinet locations(s) in the room, indicated with red block(s)",
        "cabinetLocationPhotos"
      )}
      
      {renderPhotoSection(
        "3.6. DC Power Distribution photos",
        "Please provide clear colour photographs that show the equipment room electrical DC Distribution (Charger A & B, End of Aisle DB and Cabinet PDU) that will feed the IP/MPLS Cabinet.",
        "powerDistributionPhotos"
      )}
      
      {renderPhotoSection(
        "3.7. Transport Equipment photos (Close-Ups)",
        "Please provide clear colour photographs that show the full equipment chassis layout for each of the transport equipment.",
        "transportEquipmentPhotos"
      )}
      
      {renderPhotoSection(
        "3.8. Optical Distribution Frame photos (Close-Ups), if applicable",
        "Please provide clear colour photographs that show the full ODF for each of the Fibre Optic directions needed for this project, including any ODFs needed between cabinets and their length.",
        "opticalFramePhotos"
      )}
      
      {renderPhotoSection(
        "3.9. Access Equipment photos (Close-Ups)",
        "Please provide clear colour photographs that show the full equipment chassis layout for each of the following existing equipment: ADM, BME, FOX",
        "accessEquipmentPhotos"
      )}
      
      {renderPhotoSection(
        "3.10. Cable routing (overhead/underfloor/Both)",
        "Please provide a clear colour photographs that shows cable routing.",
        "cableRoutingPhotos"
      )}
      
      {renderPhotoSection(
        "3.11. Equipment Room ceiling & HVAC photos",
        "Please provide a clear colour photographs that shows the type of ceiling used inside the equipment room, as well as the cooling system used.",
        "ceilingHVACPhotos"
      )}
      
      {showAIRecommendations && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800 text-base">AI Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-blue-700 space-y-2">
              <p>📸 <strong>Photo Quality:</strong> Ensure photos are well-lit and in focus. Use flash in dark areas but avoid glare.</p>
              <p>🔍 <strong>Detail Coverage:</strong> Take close-ups of equipment labels, model numbers, and port configurations to document specific details.</p>
              <p>📏 <strong>Scale Reference:</strong> Include a reference object for scale in photos of available space for new equipment.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EquipmentPhotos;
