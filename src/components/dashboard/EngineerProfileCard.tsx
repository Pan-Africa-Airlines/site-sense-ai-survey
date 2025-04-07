
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Calendar, Map } from "lucide-react";
import { BadgeWithAnimation } from "@/components/ui/badge-with-animation";
import VehicleStatusIndicator from "@/components/VehicleStatusIndicator";
import { getLatestVehicleCheck } from "@/utils/dbHelpers";

interface EngineerProfileCardProps {
  engineerProfile: {
    id: string;
    name: string;
    experience: string;
    regions: string[];
    average_rating: number;
    total_reviews: number;
    specializations: string[];
  };
}

const EngineerProfileCard: React.FC<EngineerProfileCardProps> = ({ engineerProfile }) => {
  const [vehicleStatus, setVehicleStatus] = useState<"passed" | "fair" | "failed" | "unknown">("unknown");
  const [lastCheckDate, setLastCheckDate] = useState<string | null>(null);
  const [vehicleName, setVehicleName] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicleCheckStatus = async () => {
      try {
        if (engineerProfile?.id) {
          const latestCheck = await getLatestVehicleCheck(engineerProfile.id);
          
          if (latestCheck) {
            setVehicleStatus(latestCheck.status as "passed" | "fair" | "failed");
            setLastCheckDate(latestCheck.check_date);
            setVehicleName(latestCheck.vehicle_name);
          }
        }
      } catch (error) {
        console.error("Error in fetching vehicle status:", error);
      }
    };
    
    if (engineerProfile?.id) {
      fetchVehicleCheckStatus();
    }
  }, [engineerProfile?.id]);

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
    <Card className="md:col-span-1 border-l-4 border-l-akhanya shadow-md overflow-hidden h-full">
      <div className="bg-gradient-to-r from-akhanya to-black h-3"></div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">Engineer Profile</CardTitle>
          <div className="h-5 w-5 text-akhanya">{/* User icon removed */}</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-3">
            <div className="bg-akhanya text-white rounded-full w-24 h-24 flex items-center justify-center text-2xl font-bold">
              {engineerProfile.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 className="font-bold text-lg">{engineerProfile.name}</h3>
              <div className="flex items-center space-x-1">
                {renderStars(engineerProfile.average_rating)}
                <span className="text-xs text-gray-500 ml-1">({engineerProfile.total_reviews} reviews)</span>
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
            
            {/* Vehicle Status Indicator */}
            <div className="border-t border-gray-100 pt-3 mt-3">
              <VehicleStatusIndicator 
                status={vehicleStatus} 
                lastCheckDate={lastCheckDate}
                vehicleName={vehicleName}
              />
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
  );
};

export default EngineerProfileCard;
