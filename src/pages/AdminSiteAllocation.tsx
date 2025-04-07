
import React, { useEffect, useState } from "react";
import { AdminNavLayout } from "@/components/admin/AdminNavLayout";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader, MapPin, Users, Search, Filter, CheckCircle2, PieChart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import EngineerAllocationDialog from "@/components/EngineerAllocationDialog";
import { getConfiguredSites } from "@/utils/dbHelpers";
import { EskomSite } from "@/types/site";

interface Engineer {
  id: string;
  name: string;
  status: string;
  vehicle: string;
  allocatedSites?: number;
}

interface AllocationSite {
  id: number;
  name: string;
  priority: string;
  engineer: string | null;
}

const AdminSiteAllocation = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sites, setSites] = useState<EskomSite[]>([]);
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [allocations, setAllocations] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [regions, setRegions] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEngineer, setSelectedEngineer] = useState<Engineer | null>(null);
  const [selectedSites, setSelectedSites] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingAllocations, setPendingAllocations] = useState<number>(0);
  
  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
    if (!adminLoggedIn) {
      navigate("/admin/login");
    } else {
      fetchData();
      subscribeToRealTimeUpdates();
    }
  }, [navigate, searchQuery, regionFilter]);

  const subscribeToRealTimeUpdates = () => {
    const channel = supabase
      .channel('allocation-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'engineer_allocations' },
        (payload) => {
          console.log('Real-time update received:', payload);
          // Refresh data when allocations change
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch sites
      const sitesData = await getConfiguredSites();
      
      // Filter sites based on search and region filter
      const filteredSites = sitesData.filter(site => {
        const matchesSearch = !searchQuery || 
          site.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRegion = !regionFilter || site.region === regionFilter;
        return matchesSearch && matchesRegion;
      });
      
      setSites(filteredSites);
      
      // Extract unique regions for filter dropdown
      const uniqueRegions = [...new Set(sitesData
        .map(site => site.region)
        .filter(Boolean) as string[])];
      setRegions(uniqueRegions);
      
      // Fetch allocations
      const { data: allocationData, error: allocationError } = await supabase
        .from('engineer_allocations')
        .select('*');
      
      if (allocationError) {
        console.error("Error fetching allocations:", allocationError);
        toast.error("Failed to load allocations. Please try again.");
      } else {
        setAllocations(allocationData || []);
        
        // Count pending allocations
        const pendingCount = allocationData?.filter(a => a.status === 'pending').length || 0;
        setPendingAllocations(pendingCount);
      }
      
      // Fetch engineers (mock data for now)
      // In a real implementation, you would fetch this from the database
      const mockEngineers: Engineer[] = [
        { id: "1", name: "John Doe", status: "available", vehicle: "Toyota Hilux" },
        { id: "2", name: "Jane Smith", status: "available", vehicle: "Ford Ranger" },
        { id: "3", name: "Robert Johnson", status: "busy", vehicle: "Nissan Navara" },
      ];
      
      // Count allocated sites per engineer
      const engineersWithAllocations = mockEngineers.map(engineer => {
        const allocatedSites = allocationData?.filter(a => a.user_id === engineer.id).length || 0;
        return {
          ...engineer,
          allocatedSites
        };
      });
      
      setEngineers(engineersWithAllocations);
      
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleAllocateClick = (engineer: Engineer) => {
    setSelectedEngineer(engineer);
    setSelectedSites([]);
    setIsDialogOpen(true);
  };
  
  const handleToggleSite = (siteId: number) => {
    setSelectedSites(prev => {
      if (prev.includes(siteId)) {
        return prev.filter(id => id !== siteId);
      } else {
        return [...prev, siteId];
      }
    });
  };
  
  const handleConfirmAllocation = async () => {
    if (!selectedEngineer || selectedSites.length === 0) return;
    
    setIsProcessing(true);
    
    try {
      // Prepare allocation data for batch insert
      const now = new Date().toISOString();
      const allocationsToInsert = selectedSites.map(siteId => {
        const site = sites.find(s => parseInt(s.id) === siteId);
        return {
          user_id: selectedEngineer.id,
          site_id: site?.id.toString(),
          site_name: site?.name,
          region: site?.region,
          address: site?.contact_name, // Using contact_name as a placeholder for address
          priority: "medium", // Default priority
          status: "allocated", // Set status to allocated
          scheduled_date: now.split('T')[0], // Just the date part
          created_at: now,
          updated_at: now
        };
      });
      
      // Batch insert allocations
      const { data, error } = await supabase
        .from('engineer_allocations')
        .insert(allocationsToInsert)
        .select();
      
      if (error) {
        throw error;
      }
      
      toast.success(`Successfully allocated ${selectedSites.length} site(s) to ${selectedEngineer.name}`);
      setIsDialogOpen(false);
      
      // Refresh data
      fetchData();
    } catch (error) {
      console.error("Error allocating sites:", error);
      toast.error("Failed to allocate sites. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  const clearFilters = () => {
    setSearchQuery("");
    setRegionFilter("");
  };
  
  const getSiteAllocationFormat = (sites: EskomSite[]): AllocationSite[] => {
    return sites.map(site => ({
      id: parseInt(site.id),
      name: site.name,
      priority: "medium", // Default priority
      engineer: null // No engineer assigned by default
    }));
  };
  
  const getAllocationStatusBadge = (count: number) => {
    if (count === 0) {
      return <Badge variant="outline">No Allocations</Badge>;
    } else {
      return <Badge variant="default" className="bg-akhanya">Allocated</Badge>;
    }
  };
  
  return (
    <AdminNavLayout>
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-akhanya">Site Allocation</h1>
        </div>
        
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>Filter Sites</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex items-center relative flex-1">
                <Search className="absolute left-2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search sites..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-4">
                <Select value={regionFilter} onValueChange={setRegionFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Regions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Regions</SelectItem>
                    {regions.map(region => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={clearFilters} className="whitespace-nowrap">
                  <Filter className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-akhanya" />
                Available Sites
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sites.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-akhanya" />
                Available Engineers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {engineers.filter(e => e.status === "available").length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2 text-akhanya" />
                Allocated Sites
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allocations.length}</div>
            </CardContent>
          </Card>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <Loader className="h-8 w-8 animate-spin text-primary mr-2" />
            <span>Loading data...</span>
          </div>
        ) : (
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
        )}

        {allocations.length > 0 && (
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
                          allocation.status === 'allocated' ? 'success' :
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
        )}
        
        {selectedEngineer && (
          <EngineerAllocationDialog
            open={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            onConfirm={handleConfirmAllocation}
            engineer={{
              id: parseInt(selectedEngineer.id),
              name: selectedEngineer.name,
              status: selectedEngineer.status,
              vehicle: selectedEngineer.vehicle
            }}
            sites={getSiteAllocationFormat(sites)}
            selectedSites={selectedSites}
            onToggleSite={handleToggleSite}
            isProcessing={isProcessing}
            allocatedCount={selectedEngineer.allocatedSites || 0}
          />
        )}
      </div>
    </AdminNavLayout>
  );
};

export default AdminSiteAllocation;
