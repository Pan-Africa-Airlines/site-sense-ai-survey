
import React, { useEffect } from "react";
import { AdminNavLayout } from "@/components/admin/AdminNavLayout";
import { useNavigate } from "react-router-dom";
import SiteAllocationFilters from "@/components/admin/allocation/SiteAllocationFilters";
import SiteAllocationStats from "@/components/admin/allocation/SiteAllocationStats";
import EngineersTable from "@/components/admin/allocation/EngineersTable";
import EngineerAllocationDialog from "@/components/EngineerAllocationDialog";
import { useAllocation } from "@/hooks/useAllocation";

const AdminSiteAllocation = () => {
  const navigate = useNavigate();
  const {
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
  } = useAllocation();

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
    if (!adminLoggedIn) {
      navigate("/admin/login");
    }
  }, [navigate]);

  return (
    <AdminNavLayout>
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-akhanya">Site Allocation</h1>
        </div>
        
        <SiteAllocationFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          regionFilter={regionFilter}
          setRegionFilter={setRegionFilter}
          regions={regions}
          clearFilters={clearFilters}
        />
        
        <SiteAllocationStats 
          sites={sites} 
          engineers={engineers} 
        />
        
        <EngineersTable 
          engineers={engineers} 
          loading={loading} 
          onAllocateClick={handleAllocateClick} 
        />
        
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
