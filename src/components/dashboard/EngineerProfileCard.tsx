import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Calendar, Map, User } from "lucide-react";
import { BadgeWithAnimation } from "@/components/ui/badge-with-animation";
import { EngineerProfile } from "@/types/dashboard";
import VehicleStatusIndicator from "@/components/VehicleStatusIndicator";
import { getLatestVehicleCheck } from "@/utils/dbHelpers/vehicleHelpers";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

interface EngineerProfileCardProps {
  engineerProfile: EngineerProfile | null;
}

const EngineerProfileCard: React.FC<EngineerProfileCardProps> = ({ engineerProfile }) => {
  const [vehicleStatus, setVehicleStatus] = useState<{
    status: "passed" | "fair" | "failed" | "unknown";
    lastCheckDate: string | null;
    vehicleName: string | null;
  }>({
    status: "unknown",
    lastCheckDate: null,
    vehicleName: null
  });
  
  const [sessionUser, setSessionUser] = useState<any>(null);

  useEffect(() => {
    // Get the current authenticated user for debugging
    const checkAuthUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        console.log("Session user ID:", data.session.user.id);
        setSessionUser(data.session.user);
        
        // If profile has "Test Engineer" or similar placeholder, update it with auth user name
        if (engineerProfile && 
            (engineerProfile.name === "Test Engineer" || 
             !engineerProfile.name || 
             engineerProfile.name.includes("Unknown"))) {
          
          // Get formatted name from auth user
          const metadata = data.session.user.user_metadata || {};
          const userEmail = data.session.user.email || "";
          const formattedName = metadata.name || userEmail.split('@')[0].split('.').map(name => 
            name.charAt(0).toUpperCase() + name.slice(1)
          ).join(' ');
          
          console.log("Will update engineer profile with auth user name:", formattedName);
          
          // Note: The actual update happens in useEngineerProfile hook and engineerHelpers
        }
      }
    };
    
    checkAuthUser();
  }, [engineerProfile]);

  useEffect(() => {
    const fetchVehicleStatus = async () => {
      if (engineerProfile && engineerProfile.id) {
        console.log("Fetching vehicle status for engineer:", engineerProfile.id);
        const vehicleCheck = await getLatestVehicleCheck(engineerProfile.id);
        
        if (vehicleCheck) {
          setVehicleStatus({
            status: vehicleCheck.status || "unknown",
            lastCheckDate: vehicleCheck.check_date || null,
            vehicleName: vehicleCheck.vehicle_name || null
          });
        }
      }
    };
    
    fetchVehicleStatus();
  }, [engineerProfile]);

  useEffect(() => {
    // Debug log to see what profile data we're receiving
    if (engineerProfile) {
      console.log("Engineer profile in card:", engineerProfile);
    } else {
      console.log("No engineer profile data received in card");
    }
    
    if (sessionUser) {
      console.log("Comparing with session user:", sessionUser.id);
    }
  }, [engineerProfile, sessionUser]);

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

  // Show loading state if engineerProfile is null
  if (!engineerProfile) {
    return (
      <Card className="md:col-span-1 border-l-4 border-l-akhanya shadow-md overflow-hidden h-full">
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
              <Skeleton className="rounded-full w-20 h-20" />
              <div>
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            
            <div className="space-y-2 pt-2">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              
              <div className="pt-2">
                <p className="text-xs font-medium text-gray-500 mb-1">Specializations:</p>
                <div className="flex flex-wrap gap-1">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
              
              <div className="pt-3 border-t border-gray-100 mt-3">
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default initials if name is not available
  const getInitials = () => {
    const name = engineerProfile?.name || 'Unknown Engineer';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <Card className="md:col-span-1 border-l-4 border-l-akhanya shadow-md overflow-hidden h-full">
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
            <div className="bg-akhanya text-white rounded-full w-20 h-20 flex items-center justify-center text-2xl font-bold">
              {getInitials()}
            </div>
            <div>
              <h3 className="font-bold text-lg">{engineerProfile.name || 'Unknown Engineer'}</h3>
              <div className="flex items-center space-x-1">
                {renderStars(engineerProfile.average_rating || 0)}
                <span className="text-xs text-gray-500 ml-1">({engineerProfile.total_reviews || 0} reviews)</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2 pt-2">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-akhanya" />
              <span className="text-sm">Experience: {engineerProfile.experience || 'Unknown'}</span>
            </div>
            
            <div className="flex items-start space-x-2">
              <Map className="h-4 w-4 text-akhanya flex-shrink-0 mt-0.5" />
              <span className="text-sm">Service Regions: {(engineerProfile.regions || []).join(', ') || 'No regions assigned'}</span>
            </div>
            
            <div className="pt-2">
              <p className="text-xs font-medium text-gray-500 mb-1">Specializations:</p>
              <div className="flex flex-wrap gap-1">
                {(engineerProfile.specializations || []).length > 0 ? 
                  (engineerProfile.specializations || []).map((spec, i) => (
                    <BadgeWithAnimation key={i} variant="success" className="text-xs">
                      {spec}
                    </BadgeWithAnimation>
                  )) : 
                  <span className="text-xs text-gray-500">No specializations assigned</span>
                }
              </div>
            </div>
            
            {/* Vehicle Status Section */}
            <div className="pt-3 border-t border-gray-100 mt-3">
              <VehicleStatusIndicator 
                status={vehicleStatus.status}
                lastCheckDate={vehicleStatus.lastCheckDate}
                vehicleName={vehicleStatus.vehicleName || undefined}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EngineerProfileCard;
