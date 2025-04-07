
import React from "react";
import { formatDistance } from "date-fns";
import { Car, Check, AlertTriangle, XCircle } from "lucide-react";
import { BadgeWithAnimation } from "@/components/ui/badge-with-animation";

interface VehicleStatusIndicatorProps {
  status: "passed" | "fair" | "failed" | "unknown";
  lastCheckDate: Date | string | null;
  vehicleName?: string;
}

const VehicleStatusIndicator: React.FC<VehicleStatusIndicatorProps> = ({ 
  status, 
  lastCheckDate,
  vehicleName
}) => {
  // Determine status colors and icon
  const getStatusDetails = () => {
    switch (status) {
      case "passed":
        return { 
          variant: "success" as const,
          icon: <Check className="h-4 w-4 text-green-600" />,
          text: "Roadworthy"
        };
      case "fair":
        return { 
          variant: "info" as const,
          icon: <AlertTriangle className="h-4 w-4 text-amber-500" />,
          text: "Fair Condition"
        };
      case "failed":
        return { 
          variant: "destructive" as const,
          icon: <XCircle className="h-4 w-4 text-red-600" />,
          text: "Not Roadworthy"
        };
      default:
        return { 
          variant: "outline" as const,
          icon: <Car className="h-4 w-4 text-gray-500" />,
          text: "No Check Records"
        };
    }
  };

  // Format the last check date
  const getFormattedDate = () => {
    if (!lastCheckDate) return "Never checked";
    
    try {
      const date = typeof lastCheckDate === 'string' ? new Date(lastCheckDate) : lastCheckDate;
      return `${formatDistance(date, new Date(), { addSuffix: true })}`;
    } catch (error) {
      return "Date error";
    }
  };

  const { variant, icon, text } = getStatusDetails();

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 mb-1">
        <Car className="h-4 w-4 text-akhanya" />
        <span className="text-sm font-medium">Vehicle Status</span>
      </div>
      
      <div className="flex items-center gap-2">
        <BadgeWithAnimation variant={variant} className="flex items-center gap-1">
          {icon}
          <span>{text}</span>
        </BadgeWithAnimation>
        
        {vehicleName && (
          <span className="text-xs text-gray-500">{vehicleName}</span>
        )}
      </div>
      
      <div className="text-xs text-gray-500 mt-1">
        Last checked: {getFormattedDate()}
      </div>
    </div>
  );
};

export default VehicleStatusIndicator;
