
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

interface EquipmentRoomGeneralProps {
  formData: {
    cableAccess: string;
    roomLighting: string;
    fireProtection: string;
    coolingMethod: string;
    coolingRating: string;
    roomTemperature: string;
    equipmentRoomCondition: string;
  };
  onInputChange: (field: string, value: string) => void;
  showAIRecommendations?: boolean;
}

const EquipmentRoomGeneral: React.FC<EquipmentRoomGeneralProps> = ({
  formData,
  onInputChange,
  showAIRecommendations = false
}) => {
  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onInputChange(field, e.target.value);
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <h3 className="text-xl font-bold mb-4 text-akhanya">2. Equipment Room (General)</h3>
        
        <Table className="border">
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3 font-bold text-center bg-gray-100">Subject</TableHead>
              <TableHead className="w-2/3 font-bold text-center bg-gray-100">Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium border-r">
                Cable access to the cabinet (Underfloor, Overhead)
              </TableCell>
              <TableCell>
                <Input
                  value={formData.cableAccess}
                  onChange={handleChange('cableAccess')}
                  placeholder="Specify cable access method"
                  className="w-full border-0 focus-visible:ring-0 p-0 shadow-none"
                />
              </TableCell>
            </TableRow>
            
            <TableRow>
              <TableCell className="font-medium border-r">
                Room lighting (Indicate if any lights are faulty)
              </TableCell>
              <TableCell>
                <Input
                  value={formData.roomLighting}
                  onChange={handleChange('roomLighting')}
                  placeholder="Describe room lighting condition"
                  className="w-full border-0 focus-visible:ring-0 p-0 shadow-none"
                />
              </TableCell>
            </TableRow>
            
            <TableRow>
              <TableCell className="font-medium border-r">
                Fire Protection
              </TableCell>
              <TableCell>
                <Input
                  value={formData.fireProtection}
                  onChange={handleChange('fireProtection')}
                  placeholder="Describe fire protection systems"
                  className="w-full border-0 focus-visible:ring-0 p-0 shadow-none"
                />
              </TableCell>
            </TableRow>
            
            <TableRow>
              <TableCell className="font-medium border-r">
                Cooling Method (Air-conditioning, Fans etc)
              </TableCell>
              <TableCell>
                <Input
                  value={formData.coolingMethod}
                  onChange={handleChange('coolingMethod')}
                  placeholder="Specify cooling method used"
                  className="w-full border-0 focus-visible:ring-0 p-0 shadow-none"
                />
              </TableCell>
            </TableRow>
            
            <TableRow>
              <TableCell className="font-medium border-r">
                Cooling Rating (BTU or Central Controlled)
              </TableCell>
              <TableCell>
                <Input
                  value={formData.coolingRating}
                  onChange={handleChange('coolingRating')}
                  placeholder="Specify cooling rating"
                  className="w-full border-0 focus-visible:ring-0 p-0 shadow-none"
                />
              </TableCell>
            </TableRow>
            
            <TableRow>
              <TableCell className="font-medium border-r">
                Measured room temperature (Deg C)
              </TableCell>
              <TableCell>
                <Input
                  value={formData.roomTemperature}
                  onChange={handleChange('roomTemperature')}
                  placeholder="Enter room temperature"
                  className="w-full border-0 focus-visible:ring-0 p-0 shadow-none"
                />
              </TableCell>
            </TableRow>
            
            <TableRow>
              <TableCell className="font-medium border-r">
                General condition of equipment room
              </TableCell>
              <TableCell>
                <Textarea
                  value={formData.equipmentRoomCondition}
                  onChange={handleChange('equipmentRoomCondition')}
                  placeholder="Describe the general condition of the equipment room"
                  className="w-full border-0 focus-visible:ring-0 p-0 shadow-none min-h-[100px] resize-y"
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        
        {showAIRecommendations && (
          <div className="mt-4 p-4 bg-akhanya-light/20 border border-akhanya-light rounded-md">
            <h4 className="font-semibold text-akhanya mb-2">AI Recommendations:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Ensure all measurements are provided in the specified units (e.g., temperature in Celsius)</li>
              <li>Document any issues with cooling systems that might affect equipment performance</li>
              <li>Note the presence and condition of any fire suppression systems</li>
              <li>If the equipment room condition has deficiencies, provide photos as evidence</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EquipmentRoomGeneral;
