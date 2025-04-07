
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Loader } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface SiteAllocationsTableProps {
  navigateToSiteAllocation: () => void;
  engineerAllocations?: any[];
  isLoading?: boolean;
}

const SiteAllocationsTable: React.FC<SiteAllocationsTableProps> = ({
  navigateToSiteAllocation,
  engineerAllocations = [],
  isLoading = false
}) => {
  // Default mock data
  const mockAllocations = [
    {
      id: "1",
      site_id: "site-1",
      site_name: "Johannesburg Substation",
      region: "Gauteng",
      priority: "high",
      status: "pending",
      scheduled_date: "2025-04-10",
      engineer_name: "John Doe"
    },
    {
      id: "2",
      site_id: "site-2",
      site_name: "Cape Town Network Hub",
      region: "Western Cape",
      priority: "medium",
      status: "in-progress",
      scheduled_date: "2025-04-12",
      engineer_name: "Jane Smith"
    }
  ];

  // Use external allocations if provided and not empty, otherwise use mock data
  const allocations = (engineerAllocations && engineerAllocations.length > 0) 
    ? engineerAllocations 
    : mockAllocations;

  console.log("SiteAllocationsTable rendering with:", { 
    allocationsProvided: !!engineerAllocations,
    allocationsCount: allocations.length,
    isLoading
  });

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 flex items-center justify-between text-akhanya">
        <div className="flex items-center">
          <MapPin className="mr-2 h-5 w-5" />
          Engineer Site Allocations
        </div>
        <Button 
          onClick={navigateToSiteAllocation}
          className="bg-akhanya hover:bg-akhanya-dark"
        >
          Manage Allocations
        </Button>
      </h2>
      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="py-4 text-center">
              <Loader className="h-6 w-6 animate-spin mx-auto mb-2" />
              <p className="text-gray-500">Loading allocations...</p>
            </div>
          ) : (
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
                {allocations.map((site) => (
                  <TableRow key={site.id}>
                    <TableCell className="font-medium">{site.site_name}</TableCell>
                    <TableCell>{site.region}</TableCell>
                    <TableCell>
                      <Badge variant={
                        site.priority === 'high' ? 'destructive' : 
                        site.priority === 'medium' ? 'default' : 'outline'
                      }>
                        {site.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        site.status === 'completed' ? 'secondary' : 
                        site.status === 'in-progress' ? 'secondary' : 'outline'
                      }>
                        {site.status || 'pending'}
                      </Badge>
                    </TableCell>
                    <TableCell>{site.scheduled_date || 'Not scheduled'}</TableCell>
                    <TableCell>
                      {site.engineer_name || 
                        <Badge variant="outline" className="bg-gray-100">
                          Not Assigned
                        </Badge>
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteAllocationsTable;
