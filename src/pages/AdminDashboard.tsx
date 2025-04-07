
import React, { useEffect, useState } from "react";
import AdminNavBar from "@/components/AdminNavBar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ClipboardList, HardHat, Car, Clock, MapPin } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

const MOCK_ASSESSMENT_DATA = [
  { id: 1, siteName: "Eskom Substation A", region: "Gauteng", date: "2025-04-01", status: "completed" },
  { id: 2, siteName: "Power Station B", region: "Western Cape", date: "2025-04-02", status: "pending" },
  { id: 3, siteName: "Transmission Tower C", region: "KwaZulu-Natal", date: "2025-04-03", status: "completed" },
  { id: 4, siteName: "Distribution Center D", region: "Free State", date: "2025-03-28", status: "completed" },
  { id: 5, siteName: "Renewable Plant E", region: "Eastern Cape", date: "2025-03-25", status: "completed" },
  { id: 6, siteName: "Substation F", region: "Northern Cape", date: "2025-03-20", status: "pending" },
];

const MOCK_INSTALLATION_DATA = [
  { id: 1, siteName: "Eskom Substation A", installDate: "2025-04-02", networkType: "Fiber", status: "completed" },
  { id: 2, siteName: "Power Station B", installDate: "2025-04-05", networkType: "Wireless", status: "pending" },
  { id: 3, siteName: "Transmission Tower C", installDate: "2025-04-08", networkType: "Satellite", status: "scheduled" },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean | null>(null);
  const [engineerAllocations, setEngineerAllocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
    setIsAdminAuthenticated(adminLoggedIn);
    
    if (!adminLoggedIn) {
      navigate("/admin/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchEngineerAllocations = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('engineer_allocations')
          .select('*');
        
        if (error) {
          console.error("Error fetching allocations:", error);
        } else {
          setEngineerAllocations(data || []);
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isAdminAuthenticated) {
      fetchEngineerAllocations();
    }
  }, [isAdminAuthenticated]);

  if (isAdminAuthenticated === null) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAdminAuthenticated) {
    return null;
  }

  const regionData = [
    { name: "Gauteng", count: 12 },
    { name: "Western Cape", count: 8 },
    { name: "KwaZulu-Natal", count: 10 },
    { name: "Free State", count: 5 },
    { name: "Eastern Cape", count: 7 },
    { name: "Northern Cape", count: 3 },
  ];

  const statusData = [
    { name: "Completed", value: 18 },
    { name: "Pending", value: 8 },
    { name: "Scheduled", value: 6 },
  ];

  const COLORS = ["#00C49F", "#FFBB28", "#FF8042"];

  const recentAssessments = MOCK_ASSESSMENT_DATA.slice(0, 3);
  const recentInstallations = MOCK_INSTALLATION_DATA.slice(0, 2);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminNavBar />
      <div className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-3xl font-bold mb-6 text-akhanya">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <ClipboardList className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Assessments</p>
                  <h3 className="text-2xl font-bold">32</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <HardHat className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Installations</p>
                  <h3 className="text-2xl font-bold">18</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-amber-100 p-3 rounded-full">
                  <Car className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Vehicle Checks</p>
                  <h3 className="text-2xl font-bold">27</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pending Approvals</p>
                  <h3 className="text-2xl font-bold">8</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center text-akhanya">
            <MapPin className="mr-2 h-5 w-5" />
            Engineer Site Allocations
          </h2>
          <Card>
            <CardContent className="p-6">
              {isLoading ? (
                <div className="py-4 text-center">
                  <p className="text-gray-500">Loading allocations...</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Site Name</TableHead>
                      <TableHead>Region</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Scheduled Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {engineerAllocations.length > 0 ? (
                      engineerAllocations.map((site) => (
                        <TableRow key={site.id}>
                          <TableCell className="font-medium">{site.site_name}</TableCell>
                          <TableCell>{site.region}</TableCell>
                          <TableCell>
                            <Badge variant={
                              site.priority === 'high' ? 'destructive' : 
                              site.priority === 'medium' ? 'default' : 'outline'
                            }>
                              {site.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              site.status === 'completed' ? 'secondary' : 
                              site.status === 'in-progress' ? 'secondary' : 'outline'
                            }>
                              {site.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{site.scheduled_date}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          No site allocations found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
        
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
                    <Tooltip />
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
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <h2 className="text-2xl font-bold mb-4 text-akhanya">Recent Activity</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-akhanya">Recent Assessments</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {recentAssessments.map(assessment => (
                  <li key={assessment.id} className="border-b pb-2">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{assessment.siteName}</p>
                        <p className="text-sm text-gray-500">{assessment.region}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{assessment.date}</p>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          assessment.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {assessment.status}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-akhanya">Recent Installations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {recentInstallations.map(installation => (
                  <li key={installation.id} className="border-b pb-2">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{installation.siteName}</p>
                        <p className="text-sm text-gray-500">{installation.networkType}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{installation.installDate}</p>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          installation.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          installation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {installation.status}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
