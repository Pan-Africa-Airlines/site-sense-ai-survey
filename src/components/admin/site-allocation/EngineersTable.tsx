
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Engineer {
  id: string;
  name: string;
  status: string;
  vehicle: string;
  allocatedSites?: number;
}

interface EngineersTableProps {
  engineers: Engineer[];
  handleAllocateClick: (engineer: Engineer) => void;
  getAllocationStatusBadge: (count: number) => JSX.Element;
}

const EngineersTable: React.FC<EngineersTableProps> = ({
  engineers,
  handleAllocateClick,
  getAllocationStatusBadge,
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Engineers</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
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
            {engineers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  No engineers found
                </TableCell>
              </TableRow>
            ) : (
              engineers.map(engineer => (
                <TableRow key={engineer.id}>
                  <TableCell className="font-medium">{engineer.name}</TableCell>
                  <TableCell>
                    <Badge variant={engineer.status === "available" ? "default" : "secondary"}>
                      {engineer.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{engineer.vehicle}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{engineer.allocatedSites || 0}</span>
                      {getAllocationStatusBadge(engineer.allocatedSites || 0)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button 
                      onClick={() => handleAllocateClick(engineer)}
                      disabled={engineer.status !== "available"}
                      className="bg-akhanya hover:bg-akhanya-dark"
                    >
                      {engineer.allocatedSites ? "Add More Sites" : "Allocate Sites"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default EngineersTable;
