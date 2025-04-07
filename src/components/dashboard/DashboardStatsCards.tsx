
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DashboardTotals } from "@/types/dashboard";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStatsCardsProps {
  totals: DashboardTotals;
  isLoading?: boolean;
}

const DashboardStatsCards: React.FC<DashboardStatsCardsProps> = ({ totals, isLoading = false }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="card-dashboard overflow-hidden h-full">
        <div className="bg-gradient-to-r from-akhanya to-black h-3"></div>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-akhanya">My Total Assessments</CardTitle>
          <CardDescription>All time site assessments</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-10 w-20 mb-4" />
          ) : (
            <div className="text-3xl font-bold mb-4 text-akhanya">{totals.assessments}</div>
          )}
          <div className="text-sm text-green-600">+5% from last month</div>
        </CardContent>
      </Card>
      
      <Card className="card-dashboard overflow-hidden h-full">
        <div className="bg-gradient-to-r from-akhanya to-black h-3"></div>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-akhanya">My Installations Completed</CardTitle>
          <CardDescription>Successfully completed installations</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-10 w-20 mb-4" />
          ) : (
            <div className="text-3xl font-bold mb-4 text-akhanya">{totals.completedInstallations}</div>
          )}
          <div className="text-sm text-green-600">+3% from last month</div>
        </CardContent>
      </Card>
      
      <Card className="card-dashboard overflow-hidden h-full">
        <div className="bg-gradient-to-r from-akhanya to-black h-3"></div>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-akhanya">Your Achievements</CardTitle>
          <CardDescription>Satisfaction rating</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-10 w-20 mb-4" />
          ) : (
            <div className="text-3xl font-bold mb-4 text-akhanya">{totals.satisfactionRate}%</div>
          )}
          <div className="text-sm text-blue-600">satisfaction rate</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStatsCards;
