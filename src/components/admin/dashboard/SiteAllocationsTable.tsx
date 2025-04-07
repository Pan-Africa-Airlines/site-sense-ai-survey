
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Loader } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
  const userEmail = localStorage.getItem("userEmail");
  
  // Filter allocations to only show those for the logged-in engineer if an email is available
  const filteredAllocations = userEmail 
    ? engineerAllocations.filter(site => {
        // If we have engineer_id field, match by that
        if (site.engineer_id) {
          return site.engineer_id === userEmail.toLowerCase().replace(/[^a-z0-9]/g, '-');
        }
        // Fallback to matching by engineer_name if available
        if (site.engineer_name) {
          const userName = userEmail.split('@')[0].split('.').map(name => 
            name.charAt(0).toUpperCase() + name.slice(1)
          ).join(' ');
          return site.engineer_name === userName;
        }
        return true; // If no engineer info, show all (fallback)
      })
    : engineerAllocations;
  
  console.log("SiteAllocationsTable rendering with:", { 
    allocationsProvided: !!engineerAllocations,
    allocationsCount: filteredAllocations.length,
    isLoading,
    userEmail
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 flex items-center justify-between text-akhanya">
        <div className="flex items-center">
          <MapPin className="mr-2 h-5 w-5" />
          {userEmail ? "My Site Allocations" : "Engineer Site Allocations"}
        </div>
        <Button 
          onClick={navigateToSiteAllocation}
          className="bg-akhanya hover:bg-akhanya-dark"
        >
          Manage Allocations
        </Button>
      </h2>
      <Card className="shadow-sm">
        <CardContent className="p-4 md:p-6">
          {isLoading ? (
            <div className="py-4 text-center">
              <Loader className="h-6 w-6 animate-spin mx-auto mb-2" />
              <p className="text-gray-500">Loading allocations...</p>
            </div>
          ) : filteredAllocations.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-gray-500">No site allocations found</p>
              <p className="text-sm text-gray-400 mt-1">
                {userEmail 
                  ? "You currently don't have any site allocations assigned to you." 
                  : "There are no site allocations in the system."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
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
                  {filteredAllocations.map((site) => (
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteAllocationsTable;
