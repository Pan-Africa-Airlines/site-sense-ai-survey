
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Users, PieChart } from "lucide-react";

interface AllocationStatsCardsProps {
  sitesCount: number;
  engineersCount: number;
  allocationsCount: number;
}

const AllocationStatsCards: React.FC<AllocationStatsCardsProps> = ({
  sitesCount,
  engineersCount,
  allocationsCount,
}) => {
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
          <div className="text-2xl font-bold">{sitesCount}</div>
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
            {engineersCount}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center">
            <PieChart className="h-5 w-5 mr-2 text-akhanya" />
            Allocated Sites
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{allocationsCount}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AllocationStatsCards;
