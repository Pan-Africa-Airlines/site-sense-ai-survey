
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, Users, PieChart } from "lucide-react";

interface DashboardStatsCardsProps {
  sites: any[];
  engineers: any[];
  allocations: any[];
}

const DashboardStatsCards: React.FC<DashboardStatsCardsProps> = ({
  sites = [],
  engineers = [],
  allocations = []
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Total Sites</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <div className="text-3xl font-bold">{sites.length}</div>
            <div className="bg-akhanya/10 p-2 rounded-full ml-auto">
              <BarChart2 className="h-5 w-5 text-akhanya" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Active Engineers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <div className="text-3xl font-bold">{engineers.length}</div>
            <div className="bg-akhanya/10 p-2 rounded-full ml-auto">
              <Users className="h-5 w-5 text-akhanya" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Site Allocations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <div className="text-3xl font-bold">{allocations.length}</div>
            <div className="bg-akhanya/10 p-2 rounded-full ml-auto">
              <PieChart className="h-5 w-5 text-akhanya" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStatsCards;
