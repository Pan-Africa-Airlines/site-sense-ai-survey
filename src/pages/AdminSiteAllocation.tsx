
import React, { useEffect } from "react";
import { AdminNavLayout } from "@/components/admin/AdminNavLayout";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import EngineerAllocationDialog from "@/components/EngineerAllocationDialog";
import SiteFilters from "@/components/admin/site-allocation/SiteFilters";
import AllocationStatsCards from "@/components/admin/site-allocation/AllocationStatsCards";
import EngineersTable from "@/components/admin/site-allocation/EngineersTable";
import AllocatedSitesTable from "@/components/admin/site-allocation/AllocatedSitesTable";
import { useSiteAllocation } from "@/hooks/useSiteAllocation";

const AdminSiteAllocation = () => {
  const navigate = useNavigate();
  const { 
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
    selectedSites,
    isProcessing,
    handleAllocateClick,
    handleToggleSite,
    handleConfirmAllocation,
    clearFilters,
    getSiteAllocationFormat,
    getAllocationStatusBadge
  } = useSiteAllocation();
  
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
        
        <SiteFilters 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          regionFilter={regionFilter}
          setRegionFilter={setRegionFilter}
          regions={regions}
          clearFilters={clearFilters}
        />
        
        <AllocationStatsCards 
          sitesCount={sites.length}
          engineersCount={engineers.filter(e => e.status === "available").length}
          allocationsCount={allocations.length}
        />
        
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <Loader className="h-8 w-8 animate-spin text-primary mr-2" />
            <span>Loading data...</span>
          </div>
        ) : (
          <>
            <EngineersTable 
              engineers={engineers}
              handleAllocateClick={handleAllocateClick}
              getAllocationStatusBadge={getAllocationStatusBadge}
            />

            <AllocatedSitesTable 
              allocations={allocations}
              engineers={engineers}
            />
          </>
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
