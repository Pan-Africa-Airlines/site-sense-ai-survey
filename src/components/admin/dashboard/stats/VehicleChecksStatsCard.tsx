
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Car, Loader } from "lucide-react";

interface VehicleChecksStatsCardProps {
  count: number;
  loading: boolean;
}

const VehicleChecksStatsCard: React.FC<VehicleChecksStatsCardProps> = ({ count, loading }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="bg-orange-100 p-3 rounded-full">
            <Car className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Vehicle Checks</p>
            {loading ? (
              <div className="flex items-center">
                <Loader className="h-4 w-4 animate-spin mr-2" />
                <span>Loading...</span>
              </div>
            ) : (
              <h3 className="text-2xl font-bold">{count}</h3>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleChecksStatsCard;
