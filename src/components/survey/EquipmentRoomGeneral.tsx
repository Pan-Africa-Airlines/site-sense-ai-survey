
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EquipmentRoomGeneralProps {
  formData: any;
  onInputChange: (field: string, value: any) => void;
  showAIRecommendations?: boolean;
}

const EquipmentRoomGeneral: React.FC<EquipmentRoomGeneralProps> = ({
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
      
      <h2 className="text-xl font-bold border-b pb-2 mb-4">2. EQUIPMENT ROOM (GENERAL)</h2>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border p-2 text-left w-1/3">Subject</th>
                  <th className="border p-2 text-left w-2/3">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">Cable access to the cabinet (Underfloor, Overhead)</td>
                  <td className="border p-2">
                    <Select
                      value={formData.cableAccess}
                      onValueChange={(value) => onInputChange("cableAccess", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select cable access method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Underfloor">Underfloor</SelectItem>
                        <SelectItem value="Overhead">Overhead</SelectItem>
                        <SelectItem value="Both">Both</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {formData.cableAccess === "Other" && (
                      <Input
                        className="mt-2"
                        placeholder="Please specify"
                        value={formData.cableAccessOther}
                        onChange={(e) => onInputChange("cableAccessOther", e.target.value)}
                      />
                    )}
                  </td>
                </tr>
                
                <tr>
                  <td className="border p-2">Room lighting (Indicate if any lights are faulty)</td>
                  <td className="border p-2">
                    <Textarea
                      value={formData.roomLighting}
                      onChange={(e) => onInputChange("roomLighting", e.target.value)}
                      rows={2}
                    />
                  </td>
                </tr>
                
                <tr>
                  <td className="border p-2">Fire Protection</td>
                  <td className="border p-2">
                    <Select
                      value={formData.fireProtection}
                      onValueChange={(value) => onInputChange("fireProtection", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select fire protection type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="None">None</SelectItem>
                        <SelectItem value="Fire Extinguisher">Fire Extinguisher</SelectItem>
                        <SelectItem value="Sprinkler System">Sprinkler System</SelectItem>
                        <SelectItem value="Gas Suppression">Gas Suppression</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {formData.fireProtection === "Other" && (
                      <Input
                        className="mt-2"
                        placeholder="Please specify"
                        value={formData.fireProtectionOther}
                        onChange={(e) => onInputChange("fireProtectionOther", e.target.value)}
                      />
                    )}
                  </td>
                </tr>
                
                <tr>
                  <td className="border p-2">Cooling Method (Air-conditioning, Fans etc)</td>
                  <td className="border p-2">
                    <Select
                      value={formData.coolingMethod}
                      onValueChange={(value) => onInputChange("coolingMethod", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select cooling method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Air-conditioning">Air-conditioning</SelectItem>
                        <SelectItem value="Fans">Fans</SelectItem>
                        <SelectItem value="Natural Ventilation">Natural Ventilation</SelectItem>
                        <SelectItem value="None">None</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {formData.coolingMethod === "Other" && (
                      <Input
                        className="mt-2"
                        placeholder="Please specify"
                        value={formData.coolingMethodOther}
                        onChange={(e) => onInputChange("coolingMethodOther", e.target.value)}
                      />
                    )}
                  </td>
                </tr>
                
                <tr>
                  <td className="border p-2">Cooling Rating (BTU or Central Controlled)</td>
                  <td className="border p-2">
                    <Input
                      value={formData.coolingRating}
                      onChange={(e) => onInputChange("coolingRating", e.target.value)}
                    />
                  </td>
                </tr>
                
                <tr>
                  <td className="border p-2">Measured room temperature (Deg C)</td>
                  <td className="border p-2">
                    <Input
                      type="number"
                      value={formData.roomTemperature}
                      onChange={(e) => onInputChange("roomTemperature", e.target.value)}
                      placeholder="E.g. 24"
                    />
                  </td>
                </tr>
                
                <tr>
                  <td className="border p-2">General condition of equipment room</td>
                  <td className="border p-2">
                    <Select
                      value={formData.equipmentRoomCondition}
                      onValueChange={(value) => onInputChange("equipmentRoomCondition", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select room condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Excellent">Excellent</SelectItem>
                        <SelectItem value="Good">Good</SelectItem>
                        <SelectItem value="Fair">Fair</SelectItem>
                        <SelectItem value="Poor">Poor</SelectItem>
                        <SelectItem value="Very Poor">Very Poor</SelectItem>
                      </SelectContent>
                    </Select>
                    <Textarea
                      className="mt-2"
                      placeholder="Additional details about room condition"
                      value={formData.equipmentRoomConditionDetails}
                      onChange={(e) => onInputChange("equipmentRoomConditionDetails", e.target.value)}
                      rows={3}
                    />
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
              <p>📋 <strong>Room Temperature Check:</strong> Ideal server room temperature should be between 18-27°C (64-80°F). If your room temperature is outside this range, consider adjusting cooling systems.</p>
              <p>🔥 <strong>Fire Protection:</strong> If you selected "None" for fire protection, consider adding at least fire extinguishers suitable for electrical fires (Class C/Electrical).</p>
              <p>❄️ <strong>Cooling Redundancy:</strong> For critical equipment rooms, ensure backup cooling methods are available in case primary cooling fails.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EquipmentRoomGeneral;
