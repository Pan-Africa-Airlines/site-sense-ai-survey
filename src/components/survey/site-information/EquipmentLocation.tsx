
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EquipmentLocationProps {
  formData: any;
  onInputChange: (field: string, value: any) => void;
}

const EquipmentLocation: React.FC<EquipmentLocationProps> = ({
  formData,
  onInputChange
}) => {
  return (
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
  );
};

export default EquipmentLocation;
