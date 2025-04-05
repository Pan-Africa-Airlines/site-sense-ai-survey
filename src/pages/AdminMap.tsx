import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAI } from "@/contexts/AIContext";
import { MapPin, Navigation, Truck, User } from "lucide-react";
import EngineerAllocationDialog from "@/components/EngineerAllocationDialog";
import MapView from "@/components/MapView";

const MOCK_ENGINEERS = [
  { id: 1, name: "John Doe", lat: -26.2041, lng: 28.0473, status: "available", vehicle: "Toyota Hilux", lastUpdate: "2 min ago" },
  { id: 2, name: "Jane Smith", lat: -26.1052, lng: 28.0560, status: "on-site", vehicle: "Ford Ranger", lastUpdate: "5 min ago" },
  { id: 3, name: "Steve Johnson", lat: -25.7461, lng: 28.1881, status: "en-route", vehicle: "Nissan Navara", lastUpdate: "1 min ago" },
  { id: 4, name: "Mary Williams", lat: -29.8587, lng: 31.0218, status: "available", vehicle: "Toyota Land Cruiser", lastUpdate: "3 min ago" },
];

const MOCK_SITES = [
  { id: 1, name: "Eskom Substation A", lat: -26.2741, lng: 27.9073, priority: "high", engineer: null },
  { id: 2, name: "Power Station B", lat: -26.1852, lng: 27.9960, priority: "medium", engineer: 2 },
  { id: 3, name: "Transmission Tower C", lat: -25.7861, lng: 28.2881, priority: "low", engineer: null },
  { id: 4, name: "Distribution Center D", lat: -29.8987, lng: 30.9618, priority: "high", engineer: 3 },
];

const AdminMap = () => {
  const { toast } = useToast();
  const { optimizeRoute, predictETAs, isProcessing } = useAI();
  
  const [engineers, setEngineers] = useState(MOCK_ENGINEERS);
  const [sites, setSites] = useState(MOCK_SITES);
  const [selectedEngineer, setSelectedEngineer] = useState<number | null>(null);
  const [selectedSites, setSelectedSites] = useState<number[]>([]);
  const [showAllocationDialog, setShowAllocationDialog] = useState(false);
  const [optimizedRoutes, setOptimizedRoutes] = useState<Record<number, any>>({});
  
  const centerLocation = {
    lat: -29.0000, 
    lng: 25.0000
  };

  const handleSelectEngineer = (engineerId: number) => {
    setSelectedEngineer(engineerId);
    const assignedSites = sites
      .filter(site => site.engineer === engineerId)
      .map(site => site.id);
    setSelectedSites(assignedSites);
  };

  const handleSiteSelection = (siteId: number) => {
    setSelectedSites(prev => {
      if (prev.includes(siteId)) {
        return prev.filter(id => id !== siteId);
      } else {
        return [...prev, siteId];
      }
    });
  };

  const handleShowAllocationDialog = () => {
    if (!selectedEngineer) {
      toast({
        title: "No engineer selected",
        description: "Please select an engineer to allocate sites",
        variant: "destructive",
      });
      return;
    }
    setShowAllocationDialog(true);
  };

  const handleAllocateSites = async () => {
    if (!selectedEngineer || selectedSites.length === 0) {
      toast({
        title: "Selection incomplete",
        description: "Please select both an engineer and at least one site",
        variant: "destructive",
      });
      return;
    }

    const updatedSites = sites.map(site => {
      if (selectedSites.includes(site.id)) {
        return { ...site, engineer: selectedEngineer };
      } else if (site.engineer === selectedEngineer && !selectedSites.includes(site.id)) {
        return { ...site, engineer: null };
      }
      return site;
    });
    
    setSites(updatedSites);
    setShowAllocationDialog(false);
    
    toast({
      title: "Sites allocated",
      description: `Successfully allocated ${selectedSites.length} sites to ${engineers.find(e => e.id === selectedEngineer)?.name}`,
    });

    if (selectedSites.length > 1) {
      await optimizeRouteForEngineer(selectedEngineer, selectedSites, updatedSites);
    }
  };

  const optimizeRouteForEngineer = async (engineerId: number, siteIds: number[], allSites: typeof sites) => {
    const engineer = engineers.find(e => e.id === engineerId);
    if (!engineer) return;

    const destinations = siteIds.map(siteId => {
      const site = allSites.find(s => s.id === siteId);
      return {
        lat: site!.lat,
        lng: site!.lng,
        siteId: siteId.toString()
      };
    });

    try {
      const optimizedDestinations = await optimizeRoute(
        { lat: engineer.lat, lng: engineer.lng },
        destinations
      );

      const routeMetrics = optimizedDestinations.map(() => ({
        distance: Math.floor(Math.random() * 50) + 5,
        traffic: ["light", "moderate", "heavy"][Math.floor(Math.random() * 3)]
      }));

      const estimatedTimes = await predictETAs(routeMetrics);
      
      setOptimizedRoutes(prev => ({
        ...prev,
        [engineerId]: {
          route: optimizedDestinations,
          eta: estimatedTimes
        }
      }));

      toast({
        title: "Route optimized",
        description: "The best route has been calculated and sent to the engineer",
      });
    } catch (error) {
      console.error("Error optimizing route:", error);
      toast({
        title: "Route optimization failed",
        description: "Failed to calculate the optimal route",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Field Engineer Map</h1>
          <p className="text-gray-600">South Africa - Real-time location and site allocation</p>
        </div>
        
        <div className="flex gap-4">
          <Button 
            onClick={handleShowAllocationDialog}
            className="bg-akhanya hover:bg-akhanya-dark"
            disabled={!selectedEngineer}
          >
            <MapPin className="mr-2 h-4 w-4" /> Allocate Sites
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Engineers</CardTitle>
              <CardDescription>Select an engineer to view or allocate sites</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {engineers.map((engineer) => (
                  <div 
                    key={engineer.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedEngineer === engineer.id ? 'bg-akhanya text-white' : 'bg-white hover:bg-gray-50'
                    }`}
                    onClick={() => handleSelectEngineer(engineer.id)}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-3">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className={`h-6 w-6 ${selectedEngineer === engineer.id ? 'text-white' : 'text-gray-600'}`} />
                        </div>
                      </div>
                      <div>
                        <h3 className={`font-medium ${selectedEngineer === engineer.id ? 'text-white' : 'text-gray-900'}`}>
                          {engineer.name}
                        </h3>
                        <div className="flex items-center">
                          <span className={`inline-block h-2 w-2 rounded-full mr-2 ${
                            engineer.status === 'available' ? 'bg-green-500' : 
                            engineer.status === 'on-site' ? 'bg-blue-500' : 'bg-amber-500'
                          }`}></span>
                          <p className={`text-sm ${selectedEngineer === engineer.id ? 'text-gray-100' : 'text-gray-500'}`}>
                            {engineer.status === 'available' ? 'Available' : 
                             engineer.status === 'on-site' ? 'On-site' : 'En-route'}
                          </p>
                        </div>
                        <div className="flex items-center mt-1">
                          <Truck className={`h-3 w-3 mr-1 ${selectedEngineer === engineer.id ? 'text-gray-100' : 'text-gray-400'}`} />
                          <p className={`text-xs ${selectedEngineer === engineer.id ? 'text-gray-100' : 'text-gray-400'}`}>
                            {engineer.vehicle}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {selectedEngineer && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Assigned Sites</CardTitle>
                <CardDescription>
                  Sites assigned to {engineers.find(e => e.id === selectedEngineer)?.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {sites.filter(site => site.engineer === selectedEngineer).length > 0 ? (
                    sites
                      .filter(site => site.engineer === selectedEngineer)
                      .map((site) => (
                        <div key={site.id} className="p-2 border rounded-md bg-gray-50">
                          <p className="font-medium">{site.name}</p>
                          <div className="flex justify-between text-sm">
                            <span className={`px-2 py-0.5 rounded text-xs ${
                              site.priority === 'high' ? 'bg-red-100 text-red-800' : 
                              site.priority === 'medium' ? 'bg-amber-100 text-amber-800' : 
                              'bg-green-100 text-green-800'
                            }`}>
                              {site.priority} priority
                            </span>
                            {optimizedRoutes[selectedEngineer]?.route?.findIndex((r: any) => 
                              parseInt(r.siteId) === site.id
                            ) >= 0 && (
                              <span className="text-xs text-gray-500">
                                Stop #{optimizedRoutes[selectedEngineer].route.findIndex((r: any) => 
                                  parseInt(r.siteId) === site.id
                                ) + 1}
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                  ) : (
                    <p className="text-gray-500 text-sm">No sites assigned yet</p>
                  )}
                </div>
                
                {optimizedRoutes[selectedEngineer] && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-md">
                    <div className="flex items-center mb-2">
                      <Navigation className="h-4 w-4 text-blue-500 mr-2" />
                      <h4 className="font-medium text-blue-700">Optimized Route</h4>
                    </div>
                    <p className="text-sm text-blue-600">
                      Route optimized for efficiency with {optimizedRoutes[selectedEngineer].route.length} stops.
                    </p>
                    <div className="mt-2 text-xs text-gray-500">
                      {optimizedRoutes[selectedEngineer].eta.some((t: number) => t > 0) && (
                        <p>Estimated total time: {optimizedRoutes[selectedEngineer].eta.reduce((a: number, b: number) => a + b, 0)} minutes</p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="lg:col-span-3 h-[700px]">
          <Card className="h-full">
            <CardContent className="p-0 h-full">
              <MapView 
                engineers={engineers} 
                sites={sites}
                selectedEngineer={selectedEngineer}
                optimizedRoutes={optimizedRoutes}
                onSiteClick={handleSiteSelection}
                center={centerLocation}
              />
            </CardContent>
          </Card>
        </div>
      </div>
      
      {showAllocationDialog && (
        <EngineerAllocationDialog
          open={showAllocationDialog}
          onClose={() => setShowAllocationDialog(false)}
          onConfirm={handleAllocateSites}
          engineer={engineers.find(e => e.id === selectedEngineer)!}
          sites={sites}
          selectedSites={selectedSites}
          onToggleSite={handleSiteSelection}
          isProcessing={false}
        />
      )}
    </div>
  );
};

export default AdminMap;
