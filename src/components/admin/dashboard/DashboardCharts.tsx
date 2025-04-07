
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { supabase } from "@/integrations/supabase/client";

const DashboardCharts = () => {
  const [chartData, setChartData] = useState({
    assessments: [
      { month: 'Jan', completed: 4, pending: 1 },
      { month: 'Feb', completed: 5, pending: 0 },
      { month: 'Mar', completed: 6, pending: 2 },
      { month: 'Apr', completed: 8, pending: 1 },
      { month: 'May', completed: 7, pending: 0 },
      { month: 'Jun', completed: 9, pending: 1 },
    ],
    installations: [
      { month: 'Jan', installations: 2 },
      { month: 'Feb', installations: 4 },
      { month: 'Mar', installations: 5 },
      { month: 'Apr', installations: 7 },
      { month: 'May', installations: 6 },
      { month: 'Jun', installations: 8 },
    ]
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This could be replaced with actual data fetching
    const fetchChartData = async () => {
      try {
        setIsLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // For now, we're using the default chart data
        // This is where you would fetch real data from Supabase
        
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchChartData();
  }, []);

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
        <Card className="h-96 flex items-center justify-center">
          <p className="text-gray-500">Loading assessment data...</p>
        </Card>
        <Card className="h-96 flex items-center justify-center">
          <p className="text-gray-500">Loading installation data...</p>
        </Card>
      </div>
    );
  }

  // Ensure chart data exists before rendering
  const assessmentData = chartData?.assessments || [];
  const installationData = chartData?.installations || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-akhanya to-black h-3"></div>
        <CardHeader>
          <CardTitle className="text-akhanya">Assessment Progress</CardTitle>
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
          <CardTitle className="text-akhanya">Installation Trend</CardTitle>
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
