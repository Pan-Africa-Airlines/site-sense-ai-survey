
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Loader } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { createInitialAllocations, getConfiguredSites } from "@/utils/dbHelpers";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { EskomSite } from "@/types/site";

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
  const [configuredSites, setConfiguredSites] = useState<EskomSite[]>([]);

  // Use external data if provided, otherwise fetch data internally
  const allocations = externalAllocations || internalAllocations;
  const loading = externalLoading !== undefined ? externalLoading : isInternalLoading;

  useEffect(() => {
    console.log("SiteAllocationsTable mounted");
    console.log("External allocations provided:", !!externalAllocations);
    
    // Only fetch data if no external data is provided
    if (!externalAllocations) {
      const fetchAllocations = async () => {
        try {
          console.log("Fetching allocations internally...");
          setIsInternalLoading(true);
          
          // Get configured sites from admin settings
          const sites = await getConfiguredSites();
          console.log("Configured sites:", sites);
          setConfiguredSites(sites);
          
          // Fetch existing allocations
          const { data, error } = await supabase
            .from('engineer_allocations')
            .select('*');
          
          if (error) {
            console.error("Error fetching allocations:", error);
            throw error;
          }
          
          console.log("Raw allocations data:", data);
          
          // Filter allocations to only include configured sites
          const siteIds = sites.map(site => site.id);
          const filteredAllocations = data?.filter(
            allocation => siteIds.includes(allocation.site_id)
          ) || [];
          
          console.log("Filtered allocations:", filteredAllocations);
          
          if (filteredAllocations.length === 0) {
            console.log("No allocations found, using mock data");
            setInternalAllocations([
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
            ]);
          } else {
            setInternalAllocations(filteredAllocations);
          }
        } catch (error) {
          console.error("Error fetching allocations:", error);
          toast.error("Failed to load allocations");
          
          // Use mock data as fallback
          setInternalAllocations([
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
          ]);
        } finally {
          setIsInternalLoading(false);
        }
      };
      
      fetchAllocations();
    } else {
      console.log("Using external allocations:", externalAllocations);
    }
  }, [externalAllocations]);

  console.log("Rendering allocations table with data:", allocations);

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
                {allocations && allocations.length > 0 ? (
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
