
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FileText, Upload, PlusCircle } from "lucide-react";
import DrawingCanvas from "@/components/DrawingCanvas";

interface RoomLayoutDrawingProps {
  formData: any;
  onInputChange: (field: string, value: any) => void;
  showAIRecommendations?: boolean;
}

const RoomLayoutDrawing: React.FC<RoomLayoutDrawingProps> = ({
  formData,
  onInputChange,
  showAIRecommendations = false
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeDrawing, setActiveDrawing] = useState("");
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      onInputChange("scannedRoomLayout", event.target?.result);
    };
    reader.readAsDataURL(file);
  };
  
  const handleDrawingSave = (dataUrl: string) => {
    onInputChange(activeDrawing, dataUrl);
    setIsDrawing(false);
  };
  
  const addDrawing = () => {
    const newDrawings = [...formData.additionalDrawings, ""];
    onInputChange("additionalDrawings", newDrawings);
  };
  
  const startDrawing = (field: string) => {
    setActiveDrawing(field);
    setIsDrawing(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center mb-6">
        <img 
          src="/lovable-uploads/f3b0d24a-bde2-40c2-84a6-ed83f7605bce.png" 
          alt="BCX Logo" 
          className="h-20 object-contain" 
        />
      </div>
      
      <h2 className="text-xl font-bold border-b pb-2 mb-4">15. Equipment Room Layout</h2>
      
      {isDrawing ? (
        <Card>
          <CardHeader>
            <CardTitle>Draw Room Layout</CardTitle>
          </CardHeader>
          <CardContent>
            <DrawingCanvas onSave={handleDrawingSave} />
            <Button 
              variant="outline" 
              onClick={() => setIsDrawing(false)} 
              className="mt-4 mr-2"
            >
              Cancel
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader className="bg-gray-50">
              <CardTitle className="text-base">Upload Scanned Room Layout</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="roomLayoutFile">Upload Scanned Document</Label>
                  <div className="mt-2 flex items-center">
                    <Button 
                      variant="outline" 
                      className="mr-4" 
                      onClick={() => document.getElementById('roomLayoutFile')?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload File
                    </Button>
                    <input
                      type="file"
                      id="roomLayoutFile"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    
                    {formData.scannedRoomLayout && (
                      <Button 
                        variant="outline" 
                        onClick={() => window.open(formData.scannedRoomLayout, '_blank')}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        View Document
                      </Button>
                    )}
                  </div>
                  
                  {formData.scannedRoomLayout ? (
                    <div className="mt-4 border rounded-md p-2 max-w-full overflow-hidden">
                      <img 
                        src={formData.scannedRoomLayout} 
                        alt="Scanned Room Layout" 
                        className="max-h-[300px] mx-auto"
                      />
                    </div>
                  ) : (
                    <div className="mt-4 border border-dashed rounded-md p-8 text-center text-gray-400">
                      No scanned document uploaded
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="bg-gray-50">
              <CardTitle className="text-base">Room Layout Drawing</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Button 
                  variant="outline" 
                  onClick={() => startDrawing("roomLayoutDrawing")}
                >
                  {formData.roomLayoutDrawing ? "Edit Drawing" : "Create Drawing"}
                </Button>
                
                {formData.roomLayoutDrawing ? (
                  <div className="mt-4 border rounded-md p-2">
                    <img 
                      src={formData.roomLayoutDrawing} 
                      alt="Room Layout Drawing" 
                      className="max-h-[300px] mx-auto"
                    />
                  </div>
                ) : (
                  <div className="mt-4 border border-dashed rounded-md p-8 text-center text-gray-400">
                    No drawing created
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="bg-gray-50">
              <CardTitle className="text-base">Cabinet Layout Drawing</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Button 
                  variant="outline" 
                  onClick={() => startDrawing("cabinetLayoutDrawing")}
                >
                  {formData.cabinetLayoutDrawing ? "Edit Drawing" : "Create Drawing"}
                </Button>
                
                {formData.cabinetLayoutDrawing ? (
                  <div className="mt-4 border rounded-md p-2">
                    <img 
                      src={formData.cabinetLayoutDrawing} 
                      alt="Cabinet Layout Drawing" 
                      className="max-h-[300px] mx-auto"
                    />
                  </div>
                ) : (
                  <div className="mt-4 border border-dashed rounded-md p-8 text-center text-gray-400">
                    No drawing created
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="bg-gray-50 flex justify-between items-center">
              <CardTitle className="text-base">Additional Drawings</CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={addDrawing}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Drawing
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {formData.additionalDrawings.map((drawing: string, index: number) => (
                  <div key={index} className="space-y-4 pb-4 border-b last:border-b-0">
                    <Label>Additional Drawing {index + 1}</Label>
                    <Button 
                      variant="outline" 
                      onClick={() => startDrawing(`additionalDrawings[${index}]`)}
                    >
                      {drawing ? "Edit Drawing" : "Create Drawing"}
                    </Button>
                    
                    {drawing ? (
                      <div className="mt-4 border rounded-md p-2">
                        <img 
                          src={drawing} 
                          alt={`Additional Drawing ${index + 1}`} 
                          className="max-h-[300px] mx-auto"
                        />
                      </div>
                    ) : (
                      <div className="mt-4 border border-dashed rounded-md p-8 text-center text-gray-400">
                        No drawing created
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {showAIRecommendations && !isDrawing && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800 text-base">AI Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-blue-700 space-y-2">
              <p>📏 <strong>Scale Indication:</strong> Include a scale in your drawings to provide accurate size representation.</p>
              <p>🔍 <strong>Critical Details:</strong> Mark power sources, cable routes, and ventilation points clearly in all drawings.</p>
              <p>🖼️ <strong>Multiple Views:</strong> Consider creating separate drawings for overhead view and wall elevations for clarity.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RoomLayoutDrawing;
