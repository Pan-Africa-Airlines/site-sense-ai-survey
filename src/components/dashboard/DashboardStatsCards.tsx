
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DashboardTotals } from "@/types/dashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface DashboardStatsCardsProps {
  totals: DashboardTotals;
  isLoading?: boolean;
}

const DashboardStatsCards: React.FC<DashboardStatsCardsProps> = ({ totals, isLoading = false }) => {
  // Function to determine assessment status class
  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'started':
        return 'bg-blue-100 text-blue-800';
      case 'in progress':
        return 'bg-amber-100 text-amber-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="card-dashboard overflow-hidden h-full flex flex-col">
        <div className="bg-gradient-to-r from-akhanya to-black h-3"></div>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-akhanya">My Total Assessments</CardTitle>
          <CardDescription>All time site assessments</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col justify-between">
          {isLoading ? (
            <Skeleton className="h-10 w-20 mb-4" />
          ) : (
            <div className="flex flex-col gap-2">
              <div className="text-3xl font-bold mb-2 text-akhanya">{totals.assessments}</div>
              {totals.assessmentStatus && (
                <Badge className={`self-start ${getStatusClass(totals.assessmentStatus)}`}>
                  {totals.assessmentStatus}
                </Badge>
              )}
            </div>
          )}
          <div className="text-sm text-green-600 mt-auto">+5% from last month</div>
        </CardContent>
      </Card>
      
      <Card className="card-dashboard overflow-hidden h-full flex flex-col">
        <div className="bg-gradient-to-r from-akhanya to-black h-3"></div>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-akhanya">My Installations Completed</CardTitle>
          <CardDescription>Successfully completed installations</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col justify-between">
          {isLoading ? (
            <Skeleton className="h-10 w-20 mb-4" />
          ) : (
            <div className="text-3xl font-bold mb-4 text-akhanya">{totals.completedInstallations}</div>
          )}
          <div className="text-sm text-green-600 mt-auto">+3% from last month</div>
        </CardContent>
      </Card>
      
      <Card className="card-dashboard overflow-hidden h-full flex flex-col">
        <div className="bg-gradient-to-r from-akhanya to-black h-3"></div>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-akhanya">Your Achievements</CardTitle>
          <CardDescription>Satisfaction rating</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col justify-between">
          {isLoading ? (
            <Skeleton className="h-10 w-20 mb-4" />
          ) : (
            <div className="text-3xl font-bold mb-4 text-akhanya">{totals.satisfactionRate}%</div>
          )}
          <div className="text-sm text-blue-600 mt-auto">satisfaction rate</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStatsCards;
