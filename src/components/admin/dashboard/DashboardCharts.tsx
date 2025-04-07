
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { Loader } from "lucide-react";
import { getRegionChartData, getStatusDistributionData } from "@/utils/dbHelpers";

const DashboardCharts = () => {
  const [regionData, setRegionData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      try {
        const [regionChartData, statusChartData] = await Promise.all([
          getRegionChartData(),
          getStatusDistributionData()
        ]);
        
        setRegionData(regionChartData);
        setStatusData(statusChartData);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#E13B45", "#9C27B0"];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-akhanya">Assessments by Region</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-[300px]">
            <Loader className="h-8 w-8 animate-spin text-akhanya" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-akhanya">Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-[300px]">
            <Loader className="h-8 w-8 animate-spin text-akhanya" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-akhanya">Assessments by Region</CardTitle>
          <CardDescription>Distribution of site assessments across regions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={regionData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="count" fill="#E13B45" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-akhanya">Status Distribution</CardTitle>
          <CardDescription>Overall status of site activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#E13B45"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCharts;
