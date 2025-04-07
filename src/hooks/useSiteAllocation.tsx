import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getConfiguredSites } from "@/utils/dbHelpers";
import { EskomSite } from "@/types/site";
import { Badge } from "@/components/ui/badge";

export interface Engineer {
  id: string;
  name: string;
  status: string;
  vehicle: string;
  allocatedSites?: number;
}

export interface AllocationSite {
  id: number;
  name: string;
  priority: string;
  engineer: string | null;
}

export const useSiteAllocation = (initialSearchQuery = "", initialRegionFilter = "") => {
  const [loading, setLoading] = useState(true);
  const [sites, setSites] = useState<EskomSite[]>([]);
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [allocations, setAllocations] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [regionFilter, setRegionFilter] = useState(initialRegionFilter);
  const [regions, setRegions] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEngineer, setSelectedEngineer] = useState<Engineer | null>(null);
  const [selectedSites, setSelectedSites] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingAllocations, setPendingAllocations] = useState<number>(0);

  const subscribeToRealTimeUpdates = () => {
    const channel = supabase
      .channel('allocation-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'engineer_allocations' },
        (payload) => {
          console.log('Real-time update received:', payload);
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
      const sitesData = await getConfiguredSites();
      
      const filteredSites = sitesData.filter(site => {
        const matchesSearch = !searchQuery || 
          site.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRegion = !regionFilter || site.region === regionFilter;
        return matchesSearch && matchesRegion;
      });
      
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
      const now = new Date().toISOString();
      const allocationsToInsert = selectedSites.map(siteId => {
        const site = sites.find(s => parseInt(s.id) === siteId);
        return {
          user_id: selectedEngineer.id,
          site_id: site?.id.toString(),
          site_name: site?.name,
          region: site?.region,
          address: site?.contact_name,
          priority: "medium",
          status: "allocated",
          scheduled_date: now.split('T')[0],
          created_at: now,
          updated_at: now
        };
      });
      
      const { data, error } = await supabase
        .from('engineer_allocations')
        .insert(allocationsToInsert)
        .select();
      
      if (error) {
        throw error;
      }
      
      toast.success(`Successfully allocated ${selectedSites.length} site(s) to ${selectedEngineer.name}`);
      setIsDialogOpen(false);
      
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
      priority: "medium",
      engineer: null
    }));
  };
  
  const getAllocationStatusBadge = (count: number) => {
    if (count === 0) {
      return <Badge variant="outline">No Allocations</Badge>;
    } else {
      return <Badge variant="default" className="bg-akhanya">Allocated</Badge>;
    }
  };

  useEffect(() => {
    fetchData();
    const unsubscribe = subscribeToRealTimeUpdates();
    return unsubscribe;
  }, [searchQuery, regionFilter]);

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
