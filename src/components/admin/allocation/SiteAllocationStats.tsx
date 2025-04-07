
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Users, Loader } from "lucide-react";
import { EskomSite } from "@/types/site";

interface SiteAllocationStatsProps {
  sites: EskomSite[];
  engineers: Array<{
    id: string;
    name: string;
    status: string;
    vehicle: string;
  }>;
}

const SiteAllocationStats: React.FC<SiteAllocationStatsProps> = ({ sites, engineers }) => {
  return (
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
  );
};

export default SiteAllocationStats;
