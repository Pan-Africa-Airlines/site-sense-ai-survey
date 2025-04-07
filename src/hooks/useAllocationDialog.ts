
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Engineer, EngineerAllocation } from "@/types/allocation";
import { EskomSite } from "@/types/site";

export const useAllocationDialog = (sites: EskomSite[], fetchData: () => Promise<void>) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEngineer, setSelectedEngineer] = useState<Engineer | null>(null);
  const [selectedSites, setSelectedSites] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

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

  return {
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
  };
};
