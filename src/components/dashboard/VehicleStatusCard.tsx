
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getLatestVehicleCheck } from "@/utils/dbHelpers/vehicleHelpers";
import VehicleStatusIndicator from "@/components/VehicleStatusIndicator";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface VehicleStatusCardProps {
  engineerId?: string;
  isLoading: boolean;
}

const VehicleStatusCard: React.FC<VehicleStatusCardProps> = ({ engineerId, isLoading }) => {
  const navigate = useNavigate();
  const [vehicleStatus, setVehicleStatus] = useState<{
    status: "passed" | "fair" | "failed" | "unknown";
    lastCheckDate: string | null;
    vehicleName: string | null;
  }>({
    status: "unknown",
    lastCheckDate: null,
    vehicleName: null
  });

  useEffect(() => {
    const fetchVehicleStatus = async () => {
      if (engineerId) {
        console.log("Fetching vehicle status for engineer:", engineerId);
        const vehicleCheck = await getLatestVehicleCheck(engineerId);
        
        if (vehicleCheck) {
          setVehicleStatus({
            status: vehicleCheck.status || "unknown",
            lastCheckDate: vehicleCheck.check_date || null,
            vehicleName: vehicleCheck.vehicle_name || null
          });
        }
      }
    };
    
    if (engineerId) {
      fetchVehicleStatus();
    }
  }, [engineerId]);

  const handleCheckVehicle = () => {
    navigate("/car-checkup");
  };

  // Show loading state
  if (isLoading) {
    return (
      <Card className="md:col-span-1 border-l-4 border-l-akhanya shadow-md overflow-hidden h-full flex flex-col">
        <div className="bg-gradient-to-r from-akhanya to-black h-3"></div>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">Vehicle Status</CardTitle>
            <Car className="h-5 w-5 text-akhanya" />
          </div>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col justify-between">
          <div className="flex flex-col space-y-4">
            <Skeleton className="h-16 w-full mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="md:col-span-1 border-l-4 border-l-akhanya shadow-md overflow-hidden h-full flex flex-col">
      <div className="bg-gradient-to-r from-akhanya to-black h-3"></div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">Vehicle Status</CardTitle>
          <Car className="h-5 w-5 text-akhanya" />
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between">
        <div className="flex flex-col space-y-6">
          <div className="scale-110 origin-left">
            <VehicleStatusIndicator 
              status={vehicleStatus.status}
              lastCheckDate={vehicleStatus.lastCheckDate}
              vehicleName={vehicleStatus.vehicleName}
            />
          </div>
          
          {vehicleStatus.status === "unknown" || vehicleStatus.status === "failed" ? (
            <div className="bg-amber-50 border border-amber-100 rounded-md p-3 flex items-start">
              <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-amber-800 text-sm font-medium">
                  {vehicleStatus.status === "unknown" 
                    ? "No vehicle check record found" 
                    : "Your vehicle needs attention"}
                </p>
                <p className="text-amber-700 text-xs mt-1">
                  {vehicleStatus.status === "unknown"
                    ? "Complete a vehicle check before starting your journey"
                    : "Please address the issues found in your last check"}
                </p>
              </div>
            </div>
          ) : null}
          
          <Button 
            onClick={handleCheckVehicle} 
            className="w-full bg-akhanya hover:bg-akhanya/90 mt-auto"
          >
            <Car className="mr-2 h-4 w-4" />
            {vehicleStatus.status === "unknown" ? "Perform First Check" : "Update Vehicle Check"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleStatusCard;
