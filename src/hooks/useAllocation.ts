
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { allocateSiteToEngineer, getConfiguredSites } from "@/utils/dbHelpers";
import { EskomSite } from "@/types/site";

interface Engineer {
  id: string;
  name: string;
  status: string;
  vehicle: string;
}

export const useAllocation = () => {
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
    fetchData();
  }, [searchQuery, regionFilter]);

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
      
      // Use mock data for engineers
      const mockEngineers: Engineer[] = [
        { id: "1", name: "John Doe", status: "available", vehicle: "Toyota Hilux" },
        { id: "2", name: "Jane Smith", status: "available", vehicle: "Ford Ranger" },
        { id: "3", name: "Robert Johnson", status: "busy", vehicle: "Nissan Navara" },
      ];
      setEngineers(mockEngineers);
      
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
  
  const getSiteAllocationFormat = (sites: EskomSite[]) => {
    return sites.map(site => ({
      id: site.id,
      name: site.name,
      priority: site.priority || "medium", // Set a default priority if it's missing
      engineer: site.engineer || null
    }));
  };

  return {
    loading,
    sites,
    engineers,
    searchQuery,
    setSearchQuery,
    regionFilter,
    setRegionFilter,
    regions,
    isDialogOpen,
    setIsDialogOpen,
    selectedEngineer,
    selectedSites,
    isProcessing,
    handleAllocateClick,
    handleToggleSite,
    handleConfirmAllocation,
    clearFilters,
    getSiteAllocationFormat
  };
};
