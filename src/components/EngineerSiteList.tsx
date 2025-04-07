
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BadgeWithAnimation } from "@/components/ui/badge-with-animation";
import { MapPin, Clock, AlertTriangle, CheckCircle, Star, Navigation } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Site {
  id: number | string;
  name: string;
  priority: string;  // Using string to match DB schema
  address: string;
  scheduledDate: string;
  status: string;
  distance?: number;
  onRateEngineer?: () => void;
}

interface EngineerSiteListProps {
  sites: Site[];
}

const EngineerSiteList: React.FC<EngineerSiteListProps> = ({ sites }) => {
  const navigate = useNavigate();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-amber-600 bg-amber-100';
      case 'low':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusDetails = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          color: 'text-amber-600',
          bgColor: 'bg-amber-100',
          icon: <Clock className="h-4 w-4 text-amber-600" />
        };
      case 'in-progress':
        return {
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          icon: <AlertTriangle className="h-4 w-4 text-blue-600" />
        };
      case 'completed':
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          icon: <CheckCircle className="h-4 w-4 text-green-600" />
        };
      default:
        return {
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          icon: <Clock className="h-4 w-4 text-gray-600" />
        };
    }
  };

  const handleSiteClick = (siteId: number | string) => {
    navigate(`/assessment/${siteId}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sites.length > 0 ? (
        sites.map((site) => {
          const priorityClass = getPriorityColor(site.priority);
          const statusDetails = getStatusDetails(site.status);
          
          return (
            <Card key={site.id} className="h-full shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between mb-3">
                  <BadgeWithAnimation 
                    variant={
                      site.priority === 'high' ? 'destructive' : 
                      site.priority === 'medium' ? 'default' : 'outline'
                    }
                    className="text-xs uppercase">
                    {site.priority}
                  </BadgeWithAnimation>
                  
                  <BadgeWithAnimation 
                    variant={
                      site.status === 'completed' ? 'success' : 
                      site.status === 'in-progress' ? 'info' : 'outline'
                    }
                    className="flex items-center gap-1 text-xs">
                    {statusDetails.icon}
                    {site.status}
                  </BadgeWithAnimation>
                </div>
                
                <h3 className="text-lg font-semibold mb-2 text-akhanya">{site.name}</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                    <p className="text-sm text-gray-600">{site.address}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <p className="text-sm text-gray-600">{site.scheduledDate}</p>
                  </div>
                  
                  {site.distance && (
                    <div className="flex items-center space-x-2">
                      <Navigation className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Distance: {site.distance} km</span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  {site.status !== 'completed' && (
                    <Button 
                      onClick={() => handleSiteClick(site.id)}
                      className="w-full sm:w-auto bg-akhanya hover:bg-akhanya-dark"
                      size="sm"
                    >
                      View Details
                    </Button>
                  )}
                  
                  {site.onRateEngineer && (
                    <Button 
                      variant="outline"
                      onClick={site.onRateEngineer}
                      className="w-full sm:w-auto flex items-center gap-1"
                      size="sm"
                    >
                      <Star className="h-3.5 w-3.5" />
                      Rate Work
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })
      ) : (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-500">No sites found</p>
        </div>
      )}
    </div>
  );
};

export default EngineerSiteList;
