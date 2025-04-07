
import React from "react";
import { MapPin } from "lucide-react";
import EngineerSiteList from "@/components/EngineerSiteList";
import { AllocatedSite } from "@/types/dashboard";

interface SiteAllocationsSectionProps {
  sites: AllocatedSite[];
  isLoading: boolean;
  onOpenSurvey: (site: AllocatedSite) => void;
}

const SiteAllocationsSection: React.FC<SiteAllocationsSectionProps> = ({ 
  sites, 
  isLoading,
  onOpenSurvey 
}) => {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="h-5 w-5 text-akhanya" />
        <h2 className="text-xl font-semibold text-akhanya">My Site Allocations</h2>
      </div>
      
      {isLoading ? (
        <div className="py-8 text-center">
          <p className="text-gray-500">Loading site allocations...</p>
        </div>
      ) : sites.length === 0 ? (
        <div className="py-8 text-center bg-gray-50 rounded-md border border-gray-100">
          <p className="text-gray-500">No site allocations found</p>
          <p className="text-sm text-gray-400 mt-1">You'll see your allocated sites here when they're assigned</p>
        </div>
      ) : (
        <EngineerSiteList 
          sites={sites.map(site => ({
            id: site.id,
            name: site.site_name,
            priority: site.priority,
            address: site.address,
            scheduledDate: site.scheduled_date,
            status: site.status,
            distance: site.distance,
            onRateEngineer: site.status === 'completed' ? () => onOpenSurvey(site) : undefined
          }))} 
        />
      )}
    </div>
  );
};

export default SiteAllocationsSection;
