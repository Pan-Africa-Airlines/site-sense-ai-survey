
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Mock data - in a real app, this would come from your API/database
  const recentAssessments = [
    { id: "A1001", date: "2025-04-02", customerName: "ABC Corporation", siteName: "Head Office", status: "complete" },
    { id: "A1002", date: "2025-04-01", customerName: "XYZ Industries", siteName: "Data Center", status: "complete" },
    { id: "A1003", date: "2025-03-30", customerName: "123 Enterprises", siteName: "Branch Office", status: "pending" },
  ];
  
  const recentInstallations = [
    { id: "I2001", date: "2025-04-03", customerName: "ABC Corporation", siteName: "Head Office", status: "in-progress" },
    { id: "I2002", date: "2025-03-28", customerName: "Global Tech", siteName: "Server Room", status: "complete" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
        {/* Main Content */}
        <div className="w-full lg:w-2/3 space-y-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold text-bcx mb-2">Welcome to SiteSense AI</h1>
            <p className="text-gray-600 mb-6">
              The intelligent site assessment and installation platform for BCX engineers.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Button 
                size="lg" 
                className="h-20 text-lg"
                onClick={() => navigate("/assessment")}
              >
                Begin Site Assessment
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="h-20 text-lg"
                onClick={() => navigate("/installation")}
              >
                Record Installation
              </Button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex items-center gap-1 text-sm">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>AI-powered</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>Geolocation</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span>Photo Documentation</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>Smart Forms</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Recent Assessments</h2>
            
            <div className="bg-white rounded-lg shadow-md divide-y">
              {recentAssessments.map(assessment => (
                <div key={assessment.id} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                  <div>
                    <h3 className="font-medium">{assessment.siteName}</h3>
                    <p className="text-sm text-gray-600">{assessment.customerName}</p>
                  </div>
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                    <Badge variant={assessment.status === "complete" ? "default" : "outline"}>
                      {assessment.status === "complete" ? "Completed" : "Pending"}
                    </Badge>
                    <span className="text-xs text-gray-500">{assessment.date}</span>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Recent Installations</h2>
            
            <div className="bg-white rounded-lg shadow-md divide-y">
              {recentInstallations.map(installation => (
                <div key={installation.id} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                  <div>
                    <h3 className="font-medium">{installation.siteName}</h3>
                    <p className="text-sm text-gray-600">{installation.customerName}</p>
                  </div>
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                    <Badge 
                      variant={installation.status === "complete" ? "default" : "outline"}
                      className={installation.status === "in-progress" ? "bg-yellow-500" : ""}
                    >
                      {installation.status === "complete" ? "Completed" : "In Progress"}
                    </Badge>
                    <span className="text-xs text-gray-500">{installation.date}</span>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="w-full lg:w-1/3 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="text-2xl font-bold text-bcx">3</div>
                  <div className="text-sm text-gray-600">Assessments</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="text-2xl font-bold text-bcx">2</div>
                  <div className="text-sm text-gray-600">Installations</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="text-2xl font-bold text-bcx">5</div>
                  <div className="text-sm text-gray-600">Photos Taken</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="text-2xl font-bold text-bcx">3</div>
                  <div className="text-sm text-gray-600">Sites</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>AI Assistant</CardTitle>
              <CardDescription>Get AI-powered insights for your assessments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 border border-blue-100 rounded-md p-3 mb-3">
                <p className="text-sm">
                  SiteSense AI can analyze photos, suggest network configurations, and help document site conditions.
                </p>
              </div>
              <div className="text-sm text-gray-600 mb-2">Recent AI Insights:</div>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 mt-0.5">Photo</Badge>
                  <span>Network cabinet requires better cable management</span>
                </li>
                <li className="flex items-start gap-2">
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 mt-0.5">Network</Badge>
                  <span>Fiber connectivity recommended for site bandwidth requirements</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">View All Insights</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Help & Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-bcx hover:underline">How to conduct a site assessment</a>
                </li>
                <li>
                  <a href="#" className="text-bcx hover:underline">Installation best practices</a>
                </li>
                <li>
                  <a href="#" className="text-bcx hover:underline">Network equipment guide</a>
                </li>
                <li>
                  <a href="#" className="text-bcx hover:underline">Troubleshooting common issues</a>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
