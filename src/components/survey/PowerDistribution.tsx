
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface PowerDistributionProps {
  formData: any;
  onInputChange: (field: string, value: any) => void;
  showAIRecommendations?: boolean;
}

const PowerDistribution: React.FC<PowerDistributionProps> = ({
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
      
      <h2 className="text-xl font-bold border-b pb-2 mb-4">3.3. 50V DC Power Distribution</h2>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border p-2 text-left">Subject</th>
                  <th className="border p-2 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">50V Charger A: DC Load Current (Total Amps)</td>
                  <td className="border p-2">
                    <Input
                      type="number"
                      placeholder="Amps"
                      value={formData.chargerA}
                      onChange={(e) => onInputChange("chargerA", e.target.value)}
                    />
                  </td>
                </tr>
                
                <tr>
                  <td className="border p-2">50V Charger B: DC Load Current (Total Amps)</td>
                  <td className="border p-2">
                    <Input
                      type="number"
                      placeholder="Amps"
                      value={formData.chargerB}
                      onChange={(e) => onInputChange("chargerB", e.target.value)}
                    />
                  </td>
                </tr>
                
                <tr>
                  <td className="border p-2">Are cabinets supplied by the 50V DC Charger direct or via End of Aisle (EOA) DB boards?</td>
                  <td className="border p-2">
                    <RadioGroup 
                      value={formData.powerSupplyMethod}
                      onValueChange={(value) => onInputChange("powerSupplyMethod", value)}
                      className="flex items-center gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="direct" id="direct" />
                        <Label htmlFor="direct">Direct from 50V DC Charger</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="eoa" id="eoa" />
                        <Label htmlFor="eoa">Via EOA DB boards</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="both" id="both" />
                        <Label htmlFor="both">Both</Label>
                      </div>
                    </RadioGroup>
                  </td>
                </tr>
                
                <tr>
                  <td className="border p-2">Measure DC Cable length required to OTN cabinet</td>
                  <td className="border p-2">
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="Length"
                        value={formData.cableLength}
                        onChange={(e) => onInputChange("cableLength", e.target.value)}
                      />
                      <Select
                        value={formData.cableLengthUnit || "meters"}
                        onValueChange={(value) => onInputChange("cableLengthUnit", value)}
                      >
                        <SelectTrigger className="w-[100px]">
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="meters">meters</SelectItem>
                          <SelectItem value="feet">feet</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </td>
                </tr>
                
                <tr>
                  <td className="border p-2">Where cabinets are supplied via EOA DB, please complete End of Aisle DB Layout, Annexure D</td>
                  <td className="border p-2">
                    <Textarea
                      placeholder="Enter details here"
                      value={formData.endOfAisleLayout}
                      onChange={(e) => onInputChange("endOfAisleLayout", e.target.value)}
                      rows={3}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      <h2 className="text-xl font-bold border-b pb-2 mb-4">Annexure C: 50V Charger Load Distribution Layout (50V DC Breakers)</h2>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="chargerSiteName">Site Name:</Label>
                <Input
                  id="chargerSiteName"
                  value={formData.chargerDetails.siteName}
                  onChange={(e) => onInputChange("chargerDetails.siteName", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="chargerLabel">Charger Label/Name:</Label>
                <Input
                  id="chargerLabel"
                  value={formData.chargerDetails.chargerLabel}
                  onChange={(e) => onInputChange("chargerDetails.chargerLabel", e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="chargerType">Single or Dual Charger:</Label>
              <RadioGroup 
                value={formData.chargerDetails.chargerType}
                onValueChange={(value) => onInputChange("chargerDetails.chargerType", value)}
                className="flex items-center gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Single" id="single" />
                  <Label htmlFor="single">Single Charger</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Dual" id="dual" />
                  <Label htmlFor="dual">Dual Charger</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {/* Charger A */}
              <div className="space-y-4">
                <h3 className="font-semibold">Charger A</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border p-2 text-sm">Circuit #</th>
                        <th className="border p-2 text-sm">MCB Rating (Amps)</th>
                        <th className="border p-2 text-sm">Used</th>
                        <th className="border p-2 text-sm">Not Used</th>
                        <th className="border p-2 text-sm">Label</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.chargerDetails.chargerA.slice(0, 10).map((circuit: any, index: number) => (
                        <tr key={`chargerA-${index}`}>
                          <td className="border p-2 text-center">{circuit.circuit}</td>
                          <td className="border p-2">
                            <Input
                              className="text-xs h-7"
                              value={circuit.mcbRating}
                              onChange={(e) => {
                                const newChargerA = [...formData.chargerDetails.chargerA];
                                newChargerA[index] = { ...circuit, mcbRating: e.target.value };
                                onInputChange("chargerDetails.chargerA", newChargerA);
                              }}
                            />
                          </td>
                          <td className="border p-2 text-center">
                            <input
                              type="radio"
                              checked={circuit.used}
                              onChange={() => {
                                const newChargerA = [...formData.chargerDetails.chargerA];
                                newChargerA[index] = { ...circuit, used: true };
                                onInputChange("chargerDetails.chargerA", newChargerA);
                              }}
                            />
                          </td>
                          <td className="border p-2 text-center">
                            <input
                              type="radio"
                              checked={!circuit.used}
                              onChange={() => {
                                const newChargerA = [...formData.chargerDetails.chargerA];
                                newChargerA[index] = { ...circuit, used: false };
                                onInputChange("chargerDetails.chargerA", newChargerA);
                              }}
                            />
                          </td>
                          <td className="border p-2">
                            <Input
                              className="text-xs h-7"
                              value={circuit.label}
                              onChange={(e) => {
                                const newChargerA = [...formData.chargerDetails.chargerA];
                                newChargerA[index] = { ...circuit, label: e.target.value };
                                onInputChange("chargerDetails.chargerA", newChargerA);
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Charger B */}
              {formData.chargerDetails.chargerType === "Dual" && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Charger B</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border p-2 text-sm">Circuit #</th>
                          <th className="border p-2 text-sm">MCB Rating (Amps)</th>
                          <th className="border p-2 text-sm">Used</th>
                          <th className="border p-2 text-sm">Not Used</th>
                          <th className="border p-2 text-sm">Label</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.chargerDetails.chargerB.slice(0, 10).map((circuit: any, index: number) => (
                          <tr key={`chargerB-${index}`}>
                            <td className="border p-2 text-center">{circuit.circuit}</td>
                            <td className="border p-2">
                              <Input
                                className="text-xs h-7"
                                value={circuit.mcbRating}
                                onChange={(e) => {
                                  const newChargerB = [...formData.chargerDetails.chargerB];
                                  newChargerB[index] = { ...circuit, mcbRating: e.target.value };
                                  onInputChange("chargerDetails.chargerB", newChargerB);
                                }}
                              />
                            </td>
                            <td className="border p-2 text-center">
                              <input
                                type="radio"
                                checked={circuit.used}
                                onChange={() => {
                                  const newChargerB = [...formData.chargerDetails.chargerB];
                                  newChargerB[index] = { ...circuit, used: true };
                                  onInputChange("chargerDetails.chargerB", newChargerB);
                                }}
                              />
                            </td>
                            <td className="border p-2 text-center">
                              <input
                                type="radio"
                                checked={!circuit.used}
                                onChange={() => {
                                  const newChargerB = [...formData.chargerDetails.chargerB];
                                  newChargerB[index] = { ...circuit, used: false };
                                  onInputChange("chargerDetails.chargerB", newChargerB);
                                }}
                              />
                            </td>
                            <td className="border p-2">
                              <Input
                                className="text-xs h-7"
                                value={circuit.label}
                                onChange={(e) => {
                                  const newChargerB = [...formData.chargerDetails.chargerB];
                                  newChargerB[index] = { ...circuit, label: e.target.value };
                                  onInputChange("chargerDetails.chargerB", newChargerB);
                                }}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
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
              <p>⚡ <strong>Power Planning:</strong> When planning power distribution, remember that IP/MPLS equipment typically requires redundant -48V DC power feeds (A and B) for high availability.</p>
              <p>🔌 <strong>Cable Sizing:</strong> Ensure DC power cables are properly sized based on load and distance to prevent voltage drop. For longer runs, increase cable gauge.</p>
              <p>⚠️ <strong>Circuit Breakers:</strong> Use dedicated circuit breakers for each piece of equipment and label them clearly for future maintenance.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PowerDistribution;
