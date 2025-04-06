
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DrawingCanvas from "@/components/DrawingCanvas";
import ImageCapture from "@/components/ImageCapture";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";

interface CabinetSpacePlanningProps {
  formData: any;
  onInputChange: (field: string, value: any) => void;
  showAIRecommendations?: boolean;
}

const CabinetSpacePlanning: React.FC<CabinetSpacePlanningProps> = ({
  formData,
  onInputChange,
  showAIRecommendations = false
}) => {
  const [showDrawingSection, setShowDrawingSection] = useState(false);
  
  const addDrawing = () => {
    const newDrawings = [...formData.additionalDrawings, ""];
    onInputChange("additionalDrawings", newDrawings);
  };
  
  const removeDrawing = (index: number) => {
    const newDrawings = [...formData.additionalDrawings];
    newDrawings.splice(index, 1);
    onInputChange("additionalDrawings", newDrawings);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-center mb-6">
        <img 
          src="public/lovable-uploads/f3b0d24a-bde2-40c2-84a6-ed83f7605bce.png" 
          alt="BCX Logo" 
          className="h-20 object-contain" 
        />
      </div>
      
      <h2 className="text-xl font-bold border-b pb-2 mb-4">3. DETAILED SITE RECORDS</h2>
      <h3 className="text-lg font-semibold mb-4">3.1. Equipment Cabinet Space Planning</h3>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border p-2 text-left w-1/2">Subject</th>
                  <th className="border p-2 text-left w-1/2">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">
                    <div className="text-sm">
                      Room Layout Drawing (Prior to site visit, Eskom will supply PDF version, as available). OEM to printout copies and bring to site). Red-lined scanned version to be attached to the site survey report.
                    </div>
                  </td>
                  <td className="border p-2">
                    <ImageCapture
                      onImageCaptured={(url) => onInputChange("roomLayoutDrawing", url)}
                      onCapture={(url) => onInputChange("roomLayoutDrawing", url)}
                      capturedImage={formData.roomLayoutDrawing}
                      label="Room Layout Drawing"
                      description="Upload or capture existing room layout drawing"
                    />
                  </td>
                </tr>
                
                <tr>
                  <td className="border p-2">
                    <div className="text-sm">
                      Where no Room Layout drawing available, a free hand drawing (not to scale) to be provided by the OEM.
                    </div>
                  </td>
                  <td className="border p-2">
                    {!showDrawingSection ? (
                      <Button 
                        variant="outline" 
                        onClick={() => setShowDrawingSection(true)}
                      >
                        Create Drawing
                      </Button>
                    ) : (
                      <DrawingCanvas
                        onSave={(dataUrl) => onInputChange("roomLayoutMarkup", dataUrl)}
                        initialValue={formData.roomLayoutMarkup}
                      />
                    )}
                  </td>
                </tr>
                
                <tr>
                  <td className="border p-2">
                    <div>Please indicated number of new routers required?</div>
                  </td>
                  <td className="border p-2">
                    <Input
                      type="number"
                      value={formData.numberOfRouters}
                      onChange={(e) => onInputChange("numberOfRouters", e.target.value)}
                      min="0"
                    />
                  </td>
                </tr>
                
                <tr>
                  <td className="border p-2 align-top">
                    <div className="text-sm">
                      Please red-line Room Layout Drawing to indicate:
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Location of new IP/MPLS Cabinet(s).</li>
                        <li>Location of existing ODFs needed for project.</li>
                        <li>Location of existing Ericsson ADM.</li>
                        <li>Location of the OTN Box.</li>
                        <li>Location of existing BME (Transmission sites).</li>
                        <li>Location of existing FOX.</li>
                        <li>Location of existing OT Router (ASR Network).</li>
                        <li>Location of existing DC Chargers.</li>
                        <li>Location of existing EOA DB board.</li>
                        <li>Location of air-conditioners.</li>
                      </ul>
                    </div>
                  </td>
                  <td className="border p-2">
                    <div className="mb-4">
                      <Label>Include Photograph</Label>
                      {formData.additionalDrawings.map((drawing: string, index: number) => (
                        <div key={index} className="mt-2 relative">
                          <ImageCapture
                            onImageCaptured={(url) => {
                              const newDrawings = [...formData.additionalDrawings];
                              newDrawings[index] = url;
                              onInputChange("additionalDrawings", newDrawings);
                            }}
                            onCapture={(url) => {
                              const newDrawings = [...formData.additionalDrawings];
                              newDrawings[index] = url;
                              onInputChange("additionalDrawings", newDrawings);
                            }}
                            capturedImage={drawing}
                            label={`Drawing ${index + 1}`}
                            description="Upload or capture marked room layout"
                          />
                          {index > 0 && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="mt-2 text-red-500 border-red-300 hover:bg-red-50"
                              onClick={() => removeDrawing(index)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" /> Remove Drawing
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="mt-4"
                        onClick={addDrawing}
                      >
                        <PlusCircle className="h-4 w-4 mr-1" /> Add More Drawings
                      </Button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {showAIRecommendations && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800 text-base">AI Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-blue-700 space-y-2">
              <p>📏 <strong>Layout Planning:</strong> When drawing the room layout, leave adequate space around cabinets for maintenance access (minimum 1.2m in front and 0.6m behind/sides).</p>
              <p>🔌 <strong>Power Considerations:</strong> Ensure the new router positions have access to the required power sources and that they don't exceed available capacity.</p>
              <p>🌡️ <strong>Heat Management:</strong> Position new equipment with airflow direction in mind, avoiding hot air discharge from one unit flowing into another unit's intake.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CabinetSpacePlanning;
