
import React from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import DrawingCanvas from "@/components/DrawingCanvas";

interface OpticalFrameProps {
  formData: any;
  onInputChange: (field: string, value: any) => void;
  showAIRecommendations?: boolean;
}

const OpticalFrame: React.FC<OpticalFrameProps> = ({
  formData,
  onInputChange,
  showAIRecommendations = false
}) => {
  // For each cabinet, handles updating a specific port's used/not used status
  const handlePortToggle = (cabinetIndex: number, portNumber: number, isUsed: boolean) => {
    const newOdfCabinets = [...formData.odfCabinets];
    const cabinet = newOdfCabinets[cabinetIndex];
    
    const newUsedPorts = { ...cabinet.usedPorts };
    newUsedPorts[portNumber] = isUsed;
    
    newOdfCabinets[cabinetIndex] = {
      ...cabinet,
      usedPorts: newUsedPorts
    };
    
    onInputChange("odfCabinets", newOdfCabinets);
  };
  
  // Update other cabinet properties
  const updateCabinetField = (cabinetIndex: number, field: string, value: string) => {
    const newOdfCabinets = [...formData.odfCabinets];
    newOdfCabinets[cabinetIndex] = {
      ...newOdfCabinets[cabinetIndex],
      [field]: value
    };
    onInputChange("odfCabinets", newOdfCabinets);
  };
  
  // Generate ports for display in the table
  const generatePorts = (cabinet: any, cabinetIndex: number) => {
    const ports = [];
    
    for (let i = 1; i <= 12; i++) {
      ports.push(
        <tr key={`port-${i}`}>
          <td className="border p-2 text-center">{i}</td>
          <td className="border p-2 text-center">
            <Checkbox 
              checked={cabinet.usedPorts[i] === true}
              onCheckedChange={(checked) => handlePortToggle(cabinetIndex, i, checked === true)}
            />
          </td>
          <td className="border p-2 text-center">
            <Checkbox 
              checked={cabinet.usedPorts[i] !== true}
              onCheckedChange={(checked) => handlePortToggle(cabinetIndex, i, !(checked === true))}
            />
          </td>
        </tr>
      );
    }
    
    return ports;
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
      
      <h2 className="text-xl font-bold border-b pb-2 mb-4">Annexure A – ODF (Optical Distribution Frame)</h2>
      
      <div className="bg-red-50 border border-red-200 rounded p-3 mb-6">
        <p className="text-red-600 font-bold text-center">IMPORTANT: DO NOT TOUCH Fibre Optic Patch Leads –Live Traffic</p>
      </div>
      
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-4 gap-4">
            {formData.odfCabinets.map((cabinet: any, cabinetIndex: number) => (
              <Card key={`cabinet-${cabinetIndex}`}>
                <CardHeader className="p-3">
                  <CardTitle className="text-sm">
                    <Input 
                      value={cabinet.name}
                      onChange={(e) => updateCabinetField(cabinetIndex, "name", e.target.value)}
                      placeholder="Cabinet Name"
                      className="text-sm"
                    />
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 space-y-2">
                  <div className="text-sm space-y-1">
                    <Label>Direction:</Label>
                    <Input 
                      value={cabinet.direction}
                      onChange={(e) => updateCabinetField(cabinetIndex, "direction", e.target.value)}
                      placeholder="Direction"
                      className="text-xs"
                    />
                  </div>
                  
                  <div className="text-sm space-y-1">
                    <Label>Connection Type:</Label>
                    <Input 
                      value={cabinet.connectionType}
                      onChange={(e) => updateCabinetField(cabinetIndex, "connectionType", e.target.value)}
                      placeholder="Connection Type"
                      className="text-xs"
                    />
                  </div>
                  
                  <div className="text-sm space-y-1">
                    <Label>Number of Cores:</Label>
                    <Input 
                      value={cabinet.cores}
                      onChange={(e) => updateCabinetField(cabinetIndex, "cores", e.target.value)}
                      placeholder="Number of Cores"
                      className="text-xs"
                    />
                  </div>
                  
                  <table className="w-full border-collapse mt-2">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border p-1 text-xs">Number</th>
                        <th className="border p-1 text-xs">Used</th>
                        <th className="border p-1 text-xs">Not Used</th>
                      </tr>
                    </thead>
                    <tbody>
                      {generatePorts(cabinet, cabinetIndex)}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      
      <h2 className="text-xl font-bold border-b pb-2 mb-4 mt-12">Annexure B – Cabinet Layout</h2>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <p className="text-sm text-gray-500 mb-4">Use the canvas below to draw the cabinet layout:</p>
          <DrawingCanvas
            onSave={(dataUrl) => onInputChange("cabinetLayoutDrawing", dataUrl)}
            initialValue={formData.cabinetLayoutDrawing}
          />
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <div>
          <Label>Approved by:</Label>
          <Input
            className="mt-1"
            value={formData.approvedBy || ""}
            onChange={(e) => onInputChange("approvedBy", e.target.value)}
          />
        </div>
        <div>
          <Label>Authorized Date:</Label>
          <Input
            className="mt-1"
            type="date"
            value={formData.authorizedDate || ""}
            onChange={(e) => onInputChange("authorizedDate", e.target.value)}
          />
        </div>
      </div>
      
      {showAIRecommendations && (
        <Card className="bg-blue-50 border-blue-200 mt-8">
          <CardHeader>
            <CardTitle className="text-blue-800 text-base">AI Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-blue-700 space-y-2">
              <p>🔄 <strong>ODF Documentation:</strong> Accurately document all fiber connections to ensure proper circuit traceability for future maintenance.</p>
              <p>📝 <strong>Port Management:</strong> Mark which ports are in use clearly to prevent accidental disconnection of live traffic.</p>
              <p>📊 <strong>Cabinet Layout:</strong> When drawing cabinet layouts, include power connections, network connections, and label rack units (RUs) for installation references.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OpticalFrame;
