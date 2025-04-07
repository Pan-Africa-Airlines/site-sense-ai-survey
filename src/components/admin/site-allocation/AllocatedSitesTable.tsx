
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

interface Engineer {
  id: string;
  name: string;
}

interface Allocation {
  id: string;
  site_name: string;
  region: string;
  priority: string;
  status: string;
  scheduled_date: string;
  user_id: string;
}

interface AllocatedSitesTableProps {
  allocations: Allocation[];
  engineers: Engineer[];
}

const AllocatedSitesTable: React.FC<AllocatedSitesTableProps> = ({
  allocations,
  engineers,
}) => {
  if (allocations.length === 0) return null;

  return (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <CheckCircle2 className="h-5 w-5 mr-2 text-akhanya" />
          Currently Allocated Sites
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Site Name</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Scheduled Date</TableHead>
              <TableHead>Engineer</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allocations.map(allocation => (
              <TableRow key={allocation.id}>
                <TableCell className="font-medium">{allocation.site_name}</TableCell>
                <TableCell>{allocation.region}</TableCell>
                <TableCell>
                  <Badge variant={
                    allocation.priority === 'high' ? 'destructive' : 
                    allocation.priority === 'medium' ? 'default' : 'outline'
                  }>
                    {allocation.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={
                    allocation.status === 'allocated' ? 'default' :
                    allocation.status === 'completed' ? 'secondary' : 
                    allocation.status === 'in-progress' ? 'default' : 'outline'
                  }>
                    {allocation.status}
                  </Badge>
                </TableCell>
                <TableCell>{allocation.scheduled_date}</TableCell>
                <TableCell>
                  {engineers.find(e => e.id === allocation.user_id)?.name || 
                    <Badge variant="outline" className="bg-gray-100">
                      Not Assigned
                    </Badge>
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AllocatedSitesTable;
