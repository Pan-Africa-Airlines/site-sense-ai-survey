
import React from "react";
import { MapPin } from "lucide-react";
import EngineerSiteList from "@/components/EngineerSiteList";

interface SiteAllocationsSectionProps {
  allocatedSites: any[];
  isLoading: boolean;
  handleOpenSurvey: (site: any) => void;
}

const SiteAllocationsSection: React.FC<SiteAllocationsSectionProps> = ({ 
  allocatedSites, 
  isLoading, 
  handleOpenSurvey 
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
      ) : (
        <EngineerSiteList 
          sites={allocatedSites.map(site => ({
            id: site.id,
            name: site.site_name,
            priority: site.priority,
            address: site.address,
            scheduledDate: site.scheduled_date,
            status: site.status,
            distance: site.distance,
            onRateEngineer: site.status === 'completed' ? () => handleOpenSurvey(site) : undefined
          }))} 
        />
      )}
    </div>
  );
};

export default SiteAllocationsSection;
