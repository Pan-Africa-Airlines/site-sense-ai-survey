
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

interface Engineer {
  id: string;
  name: string;
  status: string;
  vehicle: string;
}

interface EngineersTableProps {
  engineers: Engineer[];
  loading: boolean;
  onAllocateClick: (engineer: Engineer) => void;
}

const EngineersTable: React.FC<EngineersTableProps> = ({ 
  engineers, 
  loading, 
  onAllocateClick 
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Engineers</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <Loader className="h-8 w-8 animate-spin text-primary mr-2" />
            <span>Loading data...</span>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {engineers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">
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
                      <Button 
                        onClick={() => onAllocateClick(engineer)}
                        disabled={engineer.status !== "available"}
                        className="bg-akhanya hover:bg-akhanya-dark"
                      >
                        Allocate Sites
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default EngineersTable;
