
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface ChartsSectionProps {
  assessmentData: {
    month: string;
    completed: number;
    pending: number;
  }[];
  installationData: {
    month: string;
    installations: number;
  }[];
  chartConfig: {
    completed: {
      label: string;
      color: string;
    };
    pending: {
      label: string;
      color: string;
    };
    installations: {
      label: string;
      color: string;
    };
  };
}

const ChartsSection: React.FC<ChartsSectionProps> = ({ 
  assessmentData, 
  installationData, 
  chartConfig 
}) => {
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

export default ChartsSection;
