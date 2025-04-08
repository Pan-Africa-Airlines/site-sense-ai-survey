
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface PerformanceStatsProps {
  isLoading: boolean;
  engineerProfile: any;
}

const PerformanceStats: React.FC<PerformanceStatsProps> = ({ 
  isLoading, 
  engineerProfile 
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-sm">Assessments</p>
            <p className="text-2xl font-bold text-akhanya">
              {engineerProfile?.assessments_count || "0"}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-sm">Installations</p>
            <p className="text-2xl font-bold text-akhanya">
              {engineerProfile?.installations_count || "0"}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-sm">Satisfaction</p>
            <p className="text-2xl font-bold text-akhanya">
              {engineerProfile?.average_rating 
                ? `${Math.round((engineerProfile.average_rating / 5) * 100)}%` 
                : "0%"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceStats;
