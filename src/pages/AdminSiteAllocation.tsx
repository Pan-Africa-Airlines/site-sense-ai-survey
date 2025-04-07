
import React, { useEffect, useState } from "react";
import { AdminNavLayout } from "@/components/admin/AdminNavLayout";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader, MapPin, Users, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import EngineerAllocationDialog from "@/components/EngineerAllocationDialog";
import { getConfiguredSites, allocateSiteToEngineer } from "@/utils/dbHelpers";
import { EskomSite } from "@/types/site";

interface Engineer {
  id: string;
  name: string;
  status: string;
  vehicle: string;
}

interface AllocationSite {
  id: string | number;
  name: string;
  priority: string;
  engineer: string | null;
}

const AdminSiteAllocation = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sites, setSites] = useState<EskomSite[]>([]);
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [regions, setRegions] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEngineer, setSelectedEngineer] = useState<Engineer | null>(null);
  const [selectedSites, setSelectedSites] = useState<(string | number)[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
    if (!adminLoggedIn) {
      navigate("/admin/login");
    } else {
      fetchData();
    }
  }, [navigate, searchQuery, regionFilter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch configured sites
      const sitesData = await getConfiguredSites();
      
      // Get existing allocations to track which sites are already allocated
      const { data: allocationsData, error: allocationsError } = await supabase
        .from('engineer_allocations')
        .select('site_id, engineer_id, engineer_name');
      
      if (allocationsError) throw allocationsError;
      
      // Add allocation info to sites data
      const enhancedSites = sitesData.map(site => {
        const allocation = allocationsData?.find(a => a.site_id === site.id);
        return {
          ...site,
          priority: site.priority || "medium", // Default priority if missing
          engineer: allocation ? allocation.engineer_name : null
        };
      });
      
      // Filter sites based on search and region filter
      const filteredSites = enhancedSites.filter(site => {
        const matchesSearch = !searchQuery || 
          site.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRegion = !regionFilter || regionFilter === 'all-regions' || site.region === regionFilter;
        return matchesSearch && matchesRegion;
      });
      
      setSites(filteredSites);
      
      // Extract unique regions for filter dropdown
      const uniqueRegions = [...new Set(sitesData
        .map(site => site.region)
        .filter(Boolean) as string[])];
      setRegions(uniqueRegions);
      
      // Fetch engineers from Users admin
      // In the real implementation, this would come from the database
      // For now, let's fetch actual users with "Field Engineer" role
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'Field Engineer');
      
      if (userError) {
        console.error("Error fetching users:", userError);
        
        // Fallback to mock data if the users table doesn't exist yet
        const mockEngineers: Engineer[] = [
          { id: "1", name: "John Doe", status: "available", vehicle: "Toyota Hilux" },
          { id: "2", name: "Jane Smith", status: "available", vehicle: "Ford Ranger" },
          { id: "3", name: "Robert Johnson", status: "busy", vehicle: "Nissan Navara" },
        ];
        setEngineers(mockEngineers);
      } else {
        // Map user data to engineers format
        const mappedEngineers = (userData || []).map(user => ({
          id: user.id,
          name: user.name || user.email,
          status: user.status || "available",
          vehicle: user.vehicle || "Not specified"
        }));
        
        setEngineers(mappedEngineers);
      }
      
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
  
  const handleToggleSite = (siteId: string | number) => {
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
      // Process each selected site
      for (const siteId of selectedSites) {
        await allocateSiteToEngineer(
          siteId.toString(), 
          selectedEngineer.id.toString(),
          selectedEngineer.name
        );
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
      id: site.id,
      name: site.name,
      priority: site.priority || "medium", // Set a default priority if it's missing
      engineer: site.engineer || null
    }));
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
                    <SelectItem value="all-regions">All Regions</SelectItem>
                    {regions.map(region => (
                      region ? (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ) : null
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
                <Loader className="h-5 w-5 mr-2 text-akhanya" />
                Pending Allocations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {sites.filter(site => !site.engineer).length}
              </div>
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
                            onClick={() => handleAllocateClick(engineer)}
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
            </CardContent>
          </Card>
        )}
        
        {selectedEngineer && (
          <EngineerAllocationDialog
            open={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            onConfirm={handleConfirmAllocation}
            engineer={{
              id: selectedEngineer.id,
              name: selectedEngineer.name,
              status: selectedEngineer.status,
              vehicle: selectedEngineer.vehicle
            }}
            sites={getSiteAllocationFormat(sites)}
            selectedSites={selectedSites}
            onToggleSite={handleToggleSite}
            isProcessing={isProcessing}
          />
        )}
      </div>
    </AdminNavLayout>
  );
};

export default AdminSiteAllocation;
