
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, LineChart, Bar, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Tooltip } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ChartDataPoint } from "@/types/dashboard";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardChartsProps {
  assessmentData: ChartDataPoint[];
  installationData: ChartDataPoint[];
  isLoading?: boolean;
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ 
  assessmentData, 
  installationData,
  isLoading = false 
}) => {
  const chartConfig = {
    completed: {
      label: "Completed",
      color: "#E13B45"
    },
    pending: {
      label: "Pending",
      color: "#3C3C3C"
    },
    installations: {
      label: "Installations",
      color: "#E13B45"
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-akhanya to-black h-3"></div>
          <CardHeader>
            <CardTitle className="text-akhanya">My Assessment Progress</CardTitle>
            <CardDescription>Monthly site assessments status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <Skeleton className="w-full h-40" />
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-akhanya to-black h-3"></div>
          <CardHeader>
            <CardTitle className="text-akhanya">My Installation Trend</CardTitle>
            <CardDescription>Monthly installations completed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <Skeleton className="w-full h-40" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-akhanya to-black h-3"></div>
        <CardHeader>
          <CardTitle className="text-akhanya">My Assessment Progress</CardTitle>
          <CardDescription>Monthly site assessments status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ChartContainer
              config={chartConfig}
              className="w-full h-full"
            >
              <BarChart data={assessmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="completed" fill="#E13B45" name="Completed" />
                <Bar dataKey="pending" fill="#3C3C3C" name="Pending" />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-akhanya to-black h-3"></div>
        <CardHeader>
          <CardTitle className="text-akhanya">My Installation Trend</CardTitle>
          <CardDescription>Monthly installations completed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ChartContainer
              config={chartConfig}
              className="w-full h-full"
            >
              <LineChart data={installationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="installations" 
                  name="Installations"
                  stroke="#E13B45" 
                  strokeWidth={2}
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCharts;
