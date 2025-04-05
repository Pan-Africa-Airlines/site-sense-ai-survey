import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, LineChart, PieChart, Bar, Line, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Brain, TrendingUp, AlertTriangle, Check } from "lucide-react";

const assessmentData = [
  { month: 'Jan', completed: 12, pending: 3 },
  { month: 'Feb', completed: 15, pending: 2 },
  { month: 'Mar', completed: 18, pending: 5 },
  { month: 'Apr', completed: 20, pending: 4 },
  { month: 'May', completed: 25, pending: 2 },
  { month: 'Jun', completed: 22, pending: 1 },
];

const installationData = [
  { month: 'Jan', installations: 10 },
  { month: 'Feb', installations: 14 },
  { month: 'Mar', installations: 16 },
  { month: 'Apr', installations: 18 },
  { month: 'May', installations: 22 },
  { month: 'Jun', installations: 20 },
];

const techniciansData = [
  { name: 'Team A', value: 8 },
  { name: 'Team B', value: 10 },
  { name: 'Team C', value: 6 },
  { name: 'Team D', value: 4 },
];

const COLORS = ['#E13B45', '#B42F38', '#F8D7D9', '#3C3C3C'];

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

const Dashboard = () => {
  const navigate = useNavigate();
  
  React.useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    if (!loggedIn) {
      navigate("/login");
    }
  }, [navigate]);

  const aiInsights = [
    {
      type: "predictive",
      title: "Predictive Analysis",
      description: "Equipment at site B12 showing early signs of performance degradation. Maintenance recommended within 14 days.",
      icon: <TrendingUp className="h-5 w-5 text-blue-500" />
    },
    {
      type: "alert",
      title: "Network Anomaly Detected",
      description: "Unusual traffic pattern detected in Sandton branch. Possible security concern.",
      icon: <AlertTriangle className="h-5 w-5 text-amber-500" />
    },
    {
      type: "optimization",
      title: "Resource Optimization",
      description: "Team C deployment efficiency increased by 12% this month. Review best practices for implementation across teams.",
      icon: <Check className="h-5 w-5 text-green-500" />
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-akhanya">Dashboard</h1>
          <p className="text-gray-600">Welcome to the SiteSense monitoring platform</p>
        </div>
        
        <div className="flex gap-4">
          <Button 
            onClick={() => navigate("/car-check")}
            className="bg-akhanya hover:bg-akhanya-dark"
          >
            New Vehicle Checkup
          </Button>
          <Button 
            onClick={() => navigate("/assessment")}
            className="bg-akhanya hover:bg-akhanya-dark"
          >
            New Assessment
          </Button>
        </div>
      </div>

      <div className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-5 w-5 text-akhanya" />
          <h2 className="text-xl font-semibold text-akhanya">AI Insights</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {aiInsights.map((insight, index) => (
            <Card key={index} className="border-l-4 border-l-akhanya">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-md">{insight.title}</CardTitle>
                  {insight.icon}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{insight.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <Card className="card-dashboard">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-akhanya">Total Assessments</CardTitle>
            <CardDescription>All time site assessments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-4 text-akhanya">120</div>
            <div className="text-sm text-green-600">+12% from last month</div>
          </CardContent>
        </Card>
        
        <Card className="card-dashboard">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-akhanya">Installations Completed</CardTitle>
            <CardDescription>Successfully completed installations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-4 text-akhanya">98</div>
            <div className="text-sm text-green-600">+8% from last month</div>
          </CardContent>
        </Card>
        
        <Card className="card-dashboard">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-akhanya">Active Technicians</CardTitle>
            <CardDescription>Technicians currently in the field</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-4 text-akhanya">28</div>
            <div className="text-sm text-blue-600">4 teams deployed</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
        <Card>
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

        <Card>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-akhanya">Team Distribution</CardTitle>
            <CardDescription>Technicians by team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={techniciansData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {techniciansData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 mt-10 lg:mt-0 mb-10">
          <CardHeader>
            <CardTitle className="text-akhanya">Recent Activity</CardTitle>
            <CardDescription>Latest system activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {[
                { user: "John Doe", action: "Completed site assessment", time: "2 hours ago", location: "Johannesburg CBD" },
                { user: "Jane Smith", action: "Submitted installation report", time: "Yesterday", location: "Pretoria East" },
                { user: "Mike Johnson", action: "Started vehicle check", time: "Yesterday", location: "Sandton" },
                { user: "Sarah Williams", action: "Completed installation", time: "2 days ago", location: "Midrand" },
              ].map((activity, i) => (
                <div key={i} className="flex items-start space-x-4 border-b border-gray-100 pb-4 last:border-0">
                  <div className="rounded-full bg-akhanya text-white p-2 font-bold w-10 h-10 flex items-center justify-center">
                    {activity.user.split(' ').map(name => name[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium">{activity.user} <span className="text-gray-600 font-normal">- {activity.action}</span></p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <span>{activity.time}</span>
                      <span>•</span>
                      <span className="location-badge">{activity.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
