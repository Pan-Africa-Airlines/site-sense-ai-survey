
import React, { useEffect } from "react";
import AdminNavBar from "@/components/AdminNavBar";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MapPin, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import MapView from "@/components/MapView";

const AdminMap = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
    if (!adminLoggedIn) {
      navigate("/admin/login");
    }
  }, [navigate]);

  // Mock map locations
  const mapLocations = [
    { id: 1, name: "Eskom Substation A", lat: -26.204103, lng: 28.047304, status: "completed" },
    { id: 2, name: "Power Station B", lat: -26.270513, lng: 27.981339, status: "pending" },
    { id: 3, name: "Transmission Tower C", lat: -26.195246, lng: 28.034082, status: "scheduled" },
    { id: 4, name: "Distribution Center D", lat: -26.106896, lng: 28.056440, status: "in-progress" },
    { id: 5, name: "Renewable Plant E", lat: -26.041740, lng: 28.125747, status: "completed" },
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-akhanya">Site Map</h1>
        </div>
        
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>Map Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex items-center relative flex-1">
                <Search className="absolute left-2 h-4 w-4 text-gray-500" />
                <Input placeholder="Search sites..." className="pl-8" />
              </div>
              <div className="flex gap-4">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Site Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="substation">Substation</SelectItem>
                    <SelectItem value="power-station">Power Station</SelectItem>
                    <SelectItem value="transmission">Transmission</SelectItem>
                    <SelectItem value="distribution">Distribution</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="h-[600px]">
              <CardContent className="p-0 h-full">
                <MapView 
                  markers={mapLocations} 
                  center={{ lat: -26.204103, lng: 28.047304 }} 
                  zoom={10} 
                />
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Site Locations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mapLocations.map((location) => (
                    <div key={location.id} className="flex items-start p-3 rounded-md hover:bg-gray-100 transition-colors">
                      <div className="mr-3 mt-0.5">
                        <MapPin className="h-5 w-5 text-akhanya" />
                      </div>
                      <div>
                        <h3 className="font-medium">{location.name}</h3>
                        <p className="text-sm text-gray-500">
                          {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                        </p>
                        <div className="mt-1">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            location.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            location.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 
                            location.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {location.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMap;
