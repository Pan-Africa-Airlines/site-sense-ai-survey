
import { Badge } from "@/components/ui/badge";
import { EskomSite } from "@/types/site";
import { AllocationSite } from "@/types/allocation";

export const getSiteAllocationFormat = (sites: EskomSite[]): AllocationSite[] => {
  return sites.map(site => ({
    id: parseInt(site.id),
    name: site.name,
    priority: "medium",
    engineer: null
  }));
};

export const getAllocationStatusBadge = (count: number) => {
  if (count === 0) {
    return <Badge variant="outline">No Allocations</Badge>;
  } else {
    return <Badge variant="default" className="bg-akhanya">Allocated</Badge>;
  }
};
