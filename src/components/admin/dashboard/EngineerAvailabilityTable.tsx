
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EngineerAvailabilityTableProps {
  engineers: any[];
  engineerAllocations: any[];
  navigateToSiteAllocation: () => void;
}

const EngineerAvailabilityTable: React.FC<EngineerAvailabilityTableProps> = ({
  engineers,
  engineerAllocations,
  navigateToSiteAllocation
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 flex items-center text-akhanya">
        <Users className="mr-2 h-5 w-5" />
        Engineer Availability
      </h2>
      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Allocated Sites</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {engineers.map((engineer) => {
                const engineerSites = engineerAllocations.filter(
                  site => site.engineer_id === engineer.id
                ).length;
                
                return (
                  <TableRow key={engineer.id}>
                    <TableCell className="font-medium">{engineer.name}</TableCell>
                    <TableCell>
                      <Badge variant={engineer.status === "available" ? "default" : "secondary"}>
                        {engineer.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{engineer.vehicle}</TableCell>
                    <TableCell>{engineerSites}</TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              onClick={() => navigateToSiteAllocation()}
                              variant="outline" 
                              size="sm"
                              className="text-akhanya border-akhanya hover:bg-akhanya hover:text-white"
                            >
                              Allocate Sites
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Assign sites to this engineer</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EngineerAvailabilityTable;
