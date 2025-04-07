
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Brain, TrendingUp, AlertTriangle, Check, MapPin, Star, Calendar, User, Map } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import EngineerSiteList from "@/components/EngineerSiteList";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { BadgeWithAnimation } from "@/components/ui/badge-with-animation";

const Dashboard: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [allocatedSites, setAllocatedSites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [engineerData, setEngineerData] = useState({
    assessments: [
      { month: 'Jan', completed: 0, pending: 0 },
      { month: 'Feb', completed: 0, pending: 0 },
      { month: 'Mar', completed: 0, pending: 0 },
      { month: 'Apr', completed: 0, pending: 0 },
      { month: 'May', completed: 0, pending: 0 },
      { month: 'Jun', completed: 0, pending: 0 },
    ],
    installations: [
      { month: 'Jan', installations: 0 },
      { month: 'Feb', installations: 0 },
      { month: 'Mar', installations: 0 },
      { month: 'Apr', installations: 0 },
      { month: 'May', installations: 0 },
      { month: 'Jun', installations: 0 },
    ],
    totals: {
      assessments: 0,
      completedInstallations: 0
    },
    recentActivities: []
  });
  
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

  // Engineer profile data
  const userEmail = localStorage.getItem("userEmail") || "john.doe@example.com";
  const userName = userEmail.split('@')[0].split('.').map(name => 
    name.charAt(0).toUpperCase() + name.slice(1)
  ).join(' ');
  
  const engineerProfile = {
    name: userName,
    experience: "5 years",
    regions: ["Gauteng", "Western Cape", "Eastern Cape"],
    rating: 4.8,
    totalReviews: 124,
    specializations: ["Power Infrastructure", "Transmission Equipment"]
  };

  useEffect(() => {
    const fetchEngineerData = async () => {
      try {
        setIsLoading(true);
        
        const mockEngineerAssessments = [
          { month: 'Jan', completed: 4, pending: 1 },
          { month: 'Feb', completed: 5, pending: 0 },
          { month: 'Mar', completed: 6, pending: 2 },
          { month: 'Apr', completed: 8, pending: 1 },
          { month: 'May', completed: 7, pending: 0 },
          { month: 'Jun', completed: 9, pending: 1 },
        ];
        
        const mockEngineerInstallations = [
          { month: 'Jan', installations: 2 },
          { month: 'Feb', installations: 4 },
          { month: 'Mar', installations: 5 },
          { month: 'Apr', installations: 7 },
          { month: 'May', installations: 6 },
          { month: 'Jun', installations: 8 },
        ];
        
        const mockRecentActivities = [
          { action: "Completed site assessment", time: "2 hours ago", location: "Johannesburg CBD" },
          { action: "Submitted installation report", time: "Yesterday", location: "Pretoria East" },
          { action: "Started vehicle check", time: "Yesterday", location: "Sandton" },
          { action: "Completed installation", time: "2 days ago", location: "Midrand" },
        ];
        
        setEngineerData({
          assessments: mockEngineerAssessments,
          installations: mockEngineerInstallations,
          totals: {
            assessments: 39,
            completedInstallations: 32
          },
          recentActivities: mockRecentActivities
        });

        const { data, error } = await supabase
          .from('engineer_allocations')
          .select('*');
        
        if (error) {
          console.error("Error fetching allocations:", error);
          toast({
            title: "Error fetching site allocations",
            description: error.message,
            variant: "destructive"
          });
        } else {
          setAllocatedSites(data || []);
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEngineerData();
  }, [toast]);

  const handleVehicleCheck = () => {
    navigate("/car-check");
  };

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
      description: "Your deployment efficiency increased by 12% this month. Review best practices for continued improvement.",
      icon: <Check className="h-5 w-5 text-green-500" />
    }
  ];

  // Function to render rating stars
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <Star className="h-4 w-4 text-gray-300" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            </div>
          </div>
        );
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-gray-300" />);
      }
    }
    
    return stars;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-akhanya">Dashboard</h1>
          <p className="text-gray-600">Welcome to the SiteSense monitoring platform</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        {/* Engineer Profile Card */}
        <Card className="md:col-span-1 border-l-4 border-l-akhanya shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-akhanya to-black h-3"></div>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">Engineer Profile</CardTitle>
              <User className="h-5 w-5 text-akhanya" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-akhanya text-white rounded-full w-14 h-14 flex items-center justify-center text-xl font-bold">
                  {userName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{engineerProfile.name}</h3>
                  <div className="flex items-center space-x-1">
                    {renderStars(engineerProfile.rating)}
                    <span className="text-xs text-gray-500 ml-1">({engineerProfile.totalReviews} reviews)</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 pt-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-akhanya" />
                  <span className="text-sm">Experience: {engineerProfile.experience}</span>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Map className="h-4 w-4 text-akhanya flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Service Regions: {engineerProfile.regions.join(', ')}</span>
                </div>
                
                <div className="pt-2">
                  <p className="text-xs font-medium text-gray-500 mb-1">Specializations:</p>
                  <div className="flex flex-wrap gap-1">
                    {engineerProfile.specializations.map((spec, i) => (
                      <BadgeWithAnimation key={i} variant="success" className="text-xs">
                        {spec}
                      </BadgeWithAnimation>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Metric Cards with the new styling */}
        <Card className="card-dashboard overflow-hidden">
          <div className="bg-gradient-to-r from-akhanya to-black h-3"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-akhanya">My Total Assessments</CardTitle>
            <CardDescription>All time site assessments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-4 text-akhanya">{engineerData.totals.assessments}</div>
            <div className="text-sm text-green-600">+5% from last month</div>
          </CardContent>
        </Card>
        
        <Card className="card-dashboard overflow-hidden">
          <div className="bg-gradient-to-r from-akhanya to-black h-3"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-akhanya">My Installations Completed</CardTitle>
            <CardDescription>Successfully completed installations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-4 text-akhanya">{engineerData.totals.completedInstallations}</div>
            <div className="text-sm text-green-600">+3% from last month</div>
          </CardContent>
        </Card>
        
        <Card className="card-dashboard overflow-hidden">
          <div className="bg-gradient-to-r from-akhanya to-black h-3"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-akhanya">Your Achievements</CardTitle>
            <CardDescription>Performance highlights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-4 text-akhanya">95%</div>
            <div className="text-sm text-blue-600">satisfaction rate</div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-10">
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

      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-5 w-5 text-akhanya" />
          <h2 className="text-xl font-semibold text-akhanya">My Site Allocations</h2>
        </div>
        
        {isLoading ? (
          <div className="py-8 text-center">
            <p className="text-gray-500">Loading site allocations...</p>
          </div>
        ) : (
          <EngineerSiteList 
            sites={allocatedSites.map(site => ({
              id: site.id,
              name: site.site_name,
              priority: site.priority,
              address: site.address,
              scheduledDate: site.scheduled_date,
              status: site.status,
              distance: site.distance
            }))} 
          />
        )}
      </div>

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
                <BarChart data={engineerData.assessments}>
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
                <LineChart data={engineerData.installations}>
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

      <Card className="mb-20 overflow-hidden">
        <div className="bg-gradient-to-r from-akhanya to-black h-3"></div>
        <CardHeader>
          <CardTitle className="text-akhanya">My Recent Activity</CardTitle>
          <CardDescription>Latest activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {engineerData.recentActivities.map((activity, i) => (
              <div key={i} className="flex items-start space-x-4 border-b border-gray-100 pb-4 last:border-0">
                <div className="rounded-full bg-akhanya text-white p-2 font-bold w-10 h-10 flex items-center justify-center">
                  {localStorage.getItem("userEmail")?.split('@')[0].split('.').map(name => name[0]).join('').toUpperCase() || "EN"}
                </div>
                <div>
                  <p className="font-medium">You <span className="text-gray-600 font-normal">- {activity.action}</span></p>
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
  );
};

export default Dashboard;
