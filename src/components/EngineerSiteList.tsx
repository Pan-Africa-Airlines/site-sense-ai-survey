
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BadgeWithAnimation } from "@/components/ui/badge-with-animation";
import { useToast } from "@/hooks/use-toast";
import { 
  Clipboard, 
  Car, 
  MapPin, 
  Clock, 
  CalendarCheck, 
  Navigation,
  Compass,
  AlertTriangle,
  CheckCircle2,
  Building2,
  AlertCircle
} from "lucide-react";
import NavigationPopup from "./NavigationPopup";
import VehicleCheckWizard from "./VehicleCheckWizard";
import { motion } from "framer-motion";

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
  const { toast } = useToast();
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [vehicleCheckOpen, setVehicleCheckOpen] = useState(false);
  const [vehicleCheckProcessing, setVehicleCheckProcessing] = useState(false);

  const handleAssessment = (siteId: number) => {
    navigate(`/assessment?siteId=${siteId}`);
  };

  const handleStartRoute = (site: Site) => {
    if (!site.address) {
      toast({
        title: "Navigation Error",
        description: "Cannot navigate: The site has no address",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedSite(site);
    setNavigationOpen(true);
    
    toast({
      title: "Starting Navigation",
      description: "Preparing directions to " + site.name
    });
  };

  const handleVehicleCheckStart = () => {
    setVehicleCheckOpen(true);
  };

  const handleVehicleCheckConfirm = () => {
    setVehicleCheckProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setVehicleCheckProcessing(false);
      setVehicleCheckOpen(false);
      
      // Call the parent handler
      onVehicleCheck();
      
      toast({
        title: "Vehicle Check Completed",
        description: "Your vehicle has been verified as safe for travel"
      });
    }, 1500);
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return (
          <BadgeWithAnimation 
            variant="destructive" 
            className="flex items-center gap-1 animate-pulse">
            <AlertTriangle className="h-3 w-3" />
            High Priority
          </BadgeWithAnimation>
        );
      case 'medium':
        return (
          <BadgeWithAnimation variant="default" className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Medium Priority
          </BadgeWithAnimation>
        );
      case 'low':
        return (
          <BadgeWithAnimation variant="outline" className="flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Low Priority
          </BadgeWithAnimation>
        );
      default:
        return (
          <BadgeWithAnimation variant="outline" className="flex items-center gap-1">
            {priority}
          </BadgeWithAnimation>
        );
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    switch (status) {
      case 'pending':
        return (
          <BadgeWithAnimation variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </BadgeWithAnimation>
        );
      case 'in-progress':
        return (
          <BadgeWithAnimation variant="secondary" className="flex items-center gap-1">
            <Navigation className="h-3 w-3" />
            In Progress
          </BadgeWithAnimation>
        );
      case 'completed':
        return (
          <BadgeWithAnimation variant="success" className="flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </BadgeWithAnimation>
        );
      default:
        return (
          <BadgeWithAnimation variant="outline">
            {status}
          </BadgeWithAnimation>
        );
    }
  };

  return (
    <Card className="w-full overflow-hidden border-akhanya/20">
      <CardHeader className="pb-2 bg-akhanya/5">
        <CardTitle className="text-xl text-akhanya flex items-center">
          <Clipboard className="mr-2 h-5 w-5" />
          Allocated Sites
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {sites.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-gray-500">No sites allocated yet</p>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-blue-50 border border-blue-100 p-4 rounded-md mb-4 flex items-center shadow-sm"
            >
              <Car className="text-blue-600 mr-3 h-5 w-5" />
              <div>
                <p className="text-blue-800 font-medium">Vehicle Safety Check Required</p>
                <p className="text-blue-600 text-sm">Complete a vehicle check before starting assessments</p>
              </div>
              <Button 
                onClick={handleVehicleCheckStart} 
                className="ml-auto bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow transition-all"
                size="sm"
              >
                Start Vehicle Check
              </Button>
            </motion.div>

            {/* Site list */}
            <div className="space-y-4">
              {sites.map((site, index) => (
                <motion.div
                  key={site.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="border-l-4 border-l-akhanya hover:shadow-md transition-shadow duration-300">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                        <div>
                          <h3 className="font-medium text-lg flex items-center">
                            <Building2 className="h-4 w-4 mr-2 text-akhanya" />
                            {site.name}
                          </h3>
                          <div className="flex flex-wrap gap-2 mt-2 mb-3">
                            {getPriorityBadge(site.priority)}
                            {site.status && getStatusBadge(site.status)}
                          </div>
                          {site.address && (
                            <div className="flex items-center text-gray-600 text-sm mt-2 group">
                              <MapPin className="h-3.5 w-3.5 mr-1 text-akhanya-secondary group-hover:text-akhanya transition-colors duration-200" />
                              <span className="group-hover:text-gray-800 transition-colors duration-200">{site.address}</span>
                            </div>
                          )}
                          {site.scheduledDate && (
                            <div className="flex items-center text-gray-600 text-sm mt-2 group">
                              <CalendarCheck className="h-3.5 w-3.5 mr-1 text-akhanya-secondary group-hover:text-akhanya transition-colors duration-200" />
                              <span className="group-hover:text-gray-800 transition-colors duration-200">Scheduled: {site.scheduledDate}</span>
                            </div>
                          )}
                          {site.distance && (
                            <div className="flex items-center text-blue-600 text-sm mt-2">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              <span>{site.distance} km away</span>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                          <Button
                            onClick={() => handleStartRoute(site)}
                            variant="outline"
                            className="text-akhanya border-akhanya hover:bg-akhanya/10 transition-colors duration-200 group"
                          >
                            <Compass className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                            Start Route
                          </Button>
                          <Button
                            onClick={() => handleAssessment(site.id)}
                            className="bg-akhanya hover:bg-akhanya-dark transition-all duration-200 hover:shadow-lg"
                          >
                            Complete Assessment
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Popups */}
        {selectedSite && (
          <NavigationPopup
            open={navigationOpen}
            onOpenChange={setNavigationOpen}
            siteName={selectedSite.name}
            siteAddress={selectedSite.address || ""}
            siteDistance={selectedSite.distance}
          />
        )}
        
        <VehicleCheckWizard
          open={vehicleCheckOpen}
          onClose={() => setVehicleCheckOpen(false)}
          onConfirm={handleVehicleCheckConfirm}
          vehicle="Toyota Land Cruiser (ABC-123)"
          isProcessing={vehicleCheckProcessing}
        />
      </CardContent>
    </Card>
  );
};

export default EngineerSiteList;
