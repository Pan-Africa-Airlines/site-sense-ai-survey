
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, AlertTriangle, Navigation } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import GoogleMapsNavigationPopup from "./GoogleMapsNavigationPopup";

interface Site {
  id: number;
  name: string;
  priority: string;
  address: string;
  scheduledDate: string;
  status: string;
  distance?: number;
}

interface EngineerSiteListProps {
  sites: Site[];
  onVehicleCheck: () => void;
  vehicleCheckCompleted: boolean;
}

const EngineerSiteList: React.FC<EngineerSiteListProps> = ({ 
  sites, 
  onVehicleCheck,
  vehicleCheckCompleted
}) => {
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  
  const handleNavigate = (site: Site) => {
    setSelectedSite(site);
    setIsNavigationOpen(true);
  };
  
  if (sites.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No site allocations found</h3>
            <p className="text-gray-500 mb-4">You don't have any sites allocated to you at the moment.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {sites.map((site) => (
          <Card key={site.id} className="flex flex-col h-full">
            <CardContent className="flex flex-col h-full p-0">
              <div className="p-4">
                <div className="flex justify-between mb-2">
                  <Badge 
                    variant={
                      site.priority === 'high' ? 'destructive' : 
                      site.priority === 'medium' ? 'default' : 'outline'
                    }
                    className="capitalize"
                  >
                    {site.priority} priority
                  </Badge>
                  <Badge 
                    variant={
                      site.status === 'completed' ? 'outline' : 
                      site.status === 'in progress' ? 'secondary' : 
                      'outline'
                    }
                    className="capitalize"
                  >
                    {site.status}
                  </Badge>
                </div>
                
                <h3 className="font-bold text-lg mb-2 text-akhanya">{site.name}</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-start text-sm">
                    <MapPin className="h-4 w-4 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{site.address}</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">{site.scheduledDate}</span>
                  </div>
                  
                  {site.distance && (
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">~{site.distance} km away</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-auto border-t p-3 bg-gray-50 flex justify-between">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="font-medium">Site Requirements</h4>
                      <p className="text-sm text-gray-500">
                        This site requires a safety assessment before installation can begin.
                        Ensure you have appropriate safety gear.
                      </p>
                      
                      <div className="pt-2">
                        <h4 className="font-medium mb-1">Equipment Needed:</h4>
                        <ul className="text-sm text-gray-500 space-y-1">
                          <li className="flex items-center">
                            <div className="h-3 w-3 mr-1 text-green-500">✓</div>
                            Voltage tester
                          </li>
                          <li className="flex items-center">
                            <div className="h-3 w-3 mr-1 text-green-500">✓</div>
                            Signal analyzer
                          </li>
                          <li className="flex items-center">
                            <div className="h-3 w-3 mr-1 text-green-500">✓</div>
                            Protective equipment
                          </li>
                        </ul>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                
                <div className="space-x-2">
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => handleNavigate(site)}
                    className="bg-akhanya hover:bg-akhanya-dark"
                  >
                    <Navigation className="h-4 w-4 mr-1" />
                    Navigate
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {selectedSite && (
        <GoogleMapsNavigationPopup
          open={isNavigationOpen}
          onOpenChange={setIsNavigationOpen}
          siteName={selectedSite.name}
          siteAddress={selectedSite.address}
          siteDistance={selectedSite.distance}
        />
      )}
    </>
  );
};

export default EngineerSiteList;
