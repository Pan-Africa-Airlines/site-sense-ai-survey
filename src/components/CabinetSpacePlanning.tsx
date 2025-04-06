
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

interface CabinetSpacePlanningProps {
  formData: {
    roomLayoutDrawing: string;
    numberOfRouters: number | string;
    roomLayoutMarkup: string;
  };
  onInputChange: (field: string, value: string | number) => void;
  showAIRecommendations?: boolean;
}

const CabinetSpacePlanning: React.FC<CabinetSpacePlanningProps> = ({
  formData,
  onInputChange,
  showAIRecommendations = false
}) => {
  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let value: string | number = e.target.value;
    
    // Convert to number for router count
    if (field === 'numberOfRouters' && value !== '') {
      value = parseInt(value, 10);
    }
    
    onInputChange(field, value);
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <h3 className="text-xl font-bold mb-4 text-akhanya">3.1 Equipment Cabinet Space Planning</h3>
        
        <Table className="border">
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/2 font-bold text-center bg-gray-100">Subject</TableHead>
              <TableHead className="w-1/2 font-bold text-center bg-gray-100">Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium border-r">
                <div>
                  Room Layout Drawing (Prior to site visit, Eskom will supply PDF version, as available). OEM to printout copies and bring to site). Red-lined scanned version to be attached to the site survey report.
                </div>
                <div className="mt-4">
                  Where no Room Layout drawing available, a free hand drawing (not to scale) to be provided by the OEM.
                </div>
              </TableCell>
              <TableCell>
                <Textarea
                  value={formData.roomLayoutDrawing}
                  onChange={handleChange('roomLayoutDrawing')}
                  placeholder="Describe the room layout drawing availability and details"
                  className="w-full border-0 focus-visible:ring-0 p-0 shadow-none min-h-[100px] resize-y"
                />
              </TableCell>
            </TableRow>
            
            <TableRow>
              <TableCell className="font-medium border-r">
                Please indicate number of new routers required?
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={formData.numberOfRouters}
                  onChange={handleChange('numberOfRouters')}
                  placeholder="Enter number of routers"
                  className="w-full border-0 focus-visible:ring-0 p-0 shadow-none"
                />
              </TableCell>
            </TableRow>
            
            <TableRow>
              <TableCell className="font-medium border-r">
                <div>
                  Please red-line Room Layout Drawing to indicate:
                  <ul className="list-disc ml-6 mt-2 space-y-1">
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
              </TableCell>
              <TableCell>
                <div className="text-center mb-2">Include Photograph</div>
                <Textarea
                  value={formData.roomLayoutMarkup}
                  onChange={handleChange('roomLayoutMarkup')}
                  placeholder="Describe the room layout markup details"
                  className="w-full border-0 focus-visible:ring-0 p-0 shadow-none min-h-[200px] resize-y"
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        
        {showAIRecommendations && (
          <div className="mt-4 p-4 bg-akhanya-light/20 border border-akhanya-light rounded-md">
            <h4 className="font-semibold text-akhanya mb-2">AI Recommendations:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Include photos of the current equipment room layout from multiple angles</li>
              <li>Ensure all existing equipment is clearly labeled on the drawing</li>
              <li>Provide measurements for available cabinet space</li>
              <li>Document any constraints that might affect installation of new equipment</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CabinetSpacePlanning;
