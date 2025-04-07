
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AccessProcedureProps {
  formData: any;
  onInputChange: (field: string, value: any) => void;
}

const AccessProcedure: React.FC<AccessProcedureProps> = ({
  formData,
  onInputChange
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-medium">1.4 Access Procedure</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-6 gap-4 border-b pb-2">
            <div className="col-span-2 font-semibold">Subject</div>
            <div className="col-span-4 font-semibold">Description</div>
          </div>
          
          <div className="grid grid-cols-6 gap-4 border-b pb-4">
            <div className="col-span-2">Requirements for site access</div>
            <div className="col-span-4">
              <Textarea
                value={formData.accessRequirements}
                onChange={(e) => onInputChange("accessRequirements", e.target.value)}
                rows={2}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-6 gap-4 border-b pb-4">
            <div className="col-span-2">Site security requirements</div>
            <div className="col-span-4">
              <Textarea
                value={formData.securityRequirements}
                onChange={(e) => onInputChange("securityRequirements", e.target.value)}
                rows={2}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-6 gap-4">
            <div className="col-span-2">Vehicle type to reach site</div>
            <div className="col-span-4">
              <Input
                value={formData.vehicleType}
                onChange={(e) => onInputChange("vehicleType", e.target.value)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessProcedure;
