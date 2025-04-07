
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getConfiguredSites } from "@/utils/dbHelpers";
import { EskomSite } from "@/types/site";
import { Engineer, EngineerAllocation } from "@/types/allocation";
import { getSiteAllocationFormat, getAllocationStatusBadge } from "@/utils/allocationUtils";
import { useAllocationRealtime } from "./useAllocationRealtime";
import { useSiteFilters } from "./useSiteFilters";
import { useAllocationDialog } from "./useAllocationDialog";

export const useSiteAllocation = (initialSearchQuery = "", initialRegionFilter = "") => {
  const [loading, setLoading] = useState(true);
  const [sites, setSites] = useState<EskomSite[]>([]);
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [allocations, setAllocations] = useState<EngineerAllocation[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [pendingAllocations, setPendingAllocations] = useState<number>(0);

  // Use the extracted hooks
  const { 
    searchQuery, 
    setSearchQuery, 
    regionFilter, 
    setRegionFilter, 
    filterSites, 
    clearFilters 
  } = useSiteFilters(initialSearchQuery, initialRegionFilter);
  
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const sitesData = await getConfiguredSites();
      
      const filteredSites = filterSites(sitesData);
      setSites(filteredSites);
      
      const uniqueRegions = [...new Set(sitesData
        .map(site => site.region)
        .filter(Boolean) as string[])];
      setRegions(uniqueRegions);
      
      const { data: allocationData, error: allocationError } = await supabase
        .from('engineer_allocations')
        .select('*');
      
      if (allocationError) {
        console.error("Error fetching allocations:", allocationError);
        toast.error("Failed to load allocations. Please try again.");
      } else {
        setAllocations(allocationData || []);
        
        const pendingCount = allocationData?.filter(a => a.status === 'pending').length || 0;
        setPendingAllocations(pendingCount);
      }
      
      const mockEngineers: Engineer[] = [
        { id: "1", name: "John Doe", status: "available", vehicle: "Toyota Hilux" },
        { id: "2", name: "Jane Smith", status: "available", vehicle: "Ford Ranger" },
        { id: "3", name: "Robert Johnson", status: "busy", vehicle: "Nissan Navara" },
      ];
      
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
  }, [filterSites]);

  const { subscribeToRealTimeUpdates } = useAllocationRealtime(fetchData);
  
  const {
    isDialogOpen,
    setIsDialogOpen,
    selectedEngineer,
    setSelectedEngineer,
    selectedSites,
    setSelectedSites,
    isProcessing,
    handleAllocateClick,
    handleToggleSite,
    handleConfirmAllocation
  } = useAllocationDialog(sites, fetchData);

  useEffect(() => {
    fetchData();
    const unsubscribe = subscribeToRealTimeUpdates();
    return unsubscribe;
  }, [fetchData, subscribeToRealTimeUpdates]);

  return {
    loading,
    sites,
    engineers,
    allocations,
    searchQuery,
    setSearchQuery,
    regionFilter,
    setRegionFilter,
    regions,
    isDialogOpen,
    setIsDialogOpen,
    selectedEngineer,
    setSelectedEngineer,
    selectedSites,
    setSelectedSites,
    isProcessing,
    pendingAllocations,
    handleAllocateClick,
    handleToggleSite,
    handleConfirmAllocation,
    clearFilters,
    getSiteAllocationFormat,
    getAllocationStatusBadge,
    fetchData
  };
};
