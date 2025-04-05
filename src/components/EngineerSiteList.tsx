
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clipboard, 
  Car, 
  MapPin, 
  Clock, 
  CalendarCheck, 
  CircleAlert 
} from "lucide-react";

interface Site {
  id: number;
  name: string;
  priority: string;
  address?: string;
  scheduledDate?: string;
  status?: string;
  distance?: number;
}

interface EngineerSiteListProps {
  sites: Site[];
  onVehicleCheck: () => void;
}

const EngineerSiteList: React.FC<EngineerSiteListProps> = ({ 
  sites,
  onVehicleCheck
}) => {
  const navigate = useNavigate();

  const handleAssessment = (siteId: number) => {
    navigate(`/assessment?siteId=${siteId}`);
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High Priority</Badge>;
      case 'medium':
        return <Badge variant="default">Medium Priority</Badge>;
      case 'low':
        return <Badge variant="outline">Low Priority</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-akhanya flex items-center">
          <Clipboard className="mr-2 h-5 w-5" />
          Allocated Sites
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sites.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-gray-500">No sites allocated yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-md mb-4 flex items-center">
              <Car className="text-blue-600 mr-3 h-5 w-5" />
              <div>
                <p className="text-blue-800 font-medium">Vehicle Safety Check Required</p>
                <p className="text-blue-600 text-sm">Complete a vehicle check before starting assessments</p>
              </div>
              <Button 
                onClick={onVehicleCheck} 
                className="ml-auto bg-blue-600 hover:bg-blue-700"
                size="sm"
              >
                Start Vehicle Check
              </Button>
            </div>

            {sites.map((site) => (
              <Card key={site.id} className="border-l-4 border-l-akhanya">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">{site.name}</h3>
                      <div className="flex flex-wrap gap-2 mt-1 mb-2">
                        {getPriorityBadge(site.priority)}
                        {site.status && (
                          <Badge variant={site.status === 'pending' ? 'outline' : 'secondary'}>
                            {site.status === 'pending' ? 'Pending' : 'In Progress'}
                          </Badge>
                        )}
                      </div>
                      {site.address && (
                        <div className="flex items-center text-gray-600 text-sm mt-1">
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          <span>{site.address}</span>
                        </div>
                      )}
                      {site.scheduledDate && (
                        <div className="flex items-center text-gray-600 text-sm mt-1">
                          <CalendarCheck className="h-3.5 w-3.5 mr-1" />
                          <span>Scheduled: {site.scheduledDate}</span>
                        </div>
                      )}
                      {site.distance && (
                        <div className="flex items-center text-blue-600 text-sm mt-1">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          <span>{site.distance} km away</span>
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={() => handleAssessment(site.id)}
                      className="bg-akhanya hover:bg-akhanya-dark"
                    >
                      Complete Assessment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EngineerSiteList;
