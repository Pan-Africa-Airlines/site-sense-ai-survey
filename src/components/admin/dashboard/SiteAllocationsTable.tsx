
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Loader } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { createInitialAllocations } from "@/utils/dbHelpers";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SiteAllocationsTableProps {
  navigateToSiteAllocation: () => void;
  engineerAllocations?: any[];
  isLoading?: boolean;
}

const SiteAllocationsTable: React.FC<SiteAllocationsTableProps> = ({
  navigateToSiteAllocation,
  engineerAllocations: externalAllocations,
  isLoading: externalLoading
}) => {
  const [internalAllocations, setInternalAllocations] = useState([]);
  const [isInternalLoading, setIsInternalLoading] = useState(true);

  // Use external data if provided, otherwise fetch data internally
  const allocations = externalAllocations || internalAllocations;
  const loading = externalLoading !== undefined ? externalLoading : isInternalLoading;

  useEffect(() => {
    // Only fetch data if no external data is provided
    if (!externalAllocations) {
      const fetchAllocations = async () => {
        try {
          setIsInternalLoading(true);
          
          // Initialize demo data if needed
          await createInitialAllocations();
          
          // Fetch allocations
          const { data, error } = await supabase
            .from('engineer_allocations')
            .select('*');
          
          if (error) throw error;
          
          setInternalAllocations(data || []);
        } catch (error) {
          console.error("Error fetching allocations:", error);
        } finally {
          setIsInternalLoading(false);
        }
      };
      
      fetchAllocations();
    }
  }, [externalAllocations]);

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
          {loading ? (
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
                {allocations.length > 0 ? (
                  allocations.map((site) => (
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
                          {site.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{site.scheduled_date}</TableCell>
                      <TableCell>
                        {site.engineer_name || 
                          <Badge variant="outline" className="bg-gray-100">
                            Not Assigned
                          </Badge>
                        }
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No site allocations found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteAllocationsTable;
