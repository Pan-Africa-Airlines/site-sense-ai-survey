
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ProfessionalInfoProps {
  isLoading: boolean;
  engineerProfile: any;
}

const ProfessionalInfo: React.FC<ProfessionalInfoProps> = ({ 
  isLoading, 
  engineerProfile 
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Professional Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Professional Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-akhanya">Specializations</h3>
            <p className="text-gray-600">
              {engineerProfile?.specializations && engineerProfile.specializations.length > 0 
                ? engineerProfile.specializations.join(', ') 
                : "Network Installation, Fiber Optics, Equipment Maintenance"}
            </p>
          </div>
          <div>
            <h3 className="font-medium text-akhanya">Regions</h3>
            <p className="text-gray-600">
              {engineerProfile?.regions && engineerProfile.regions.length > 0 
                ? engineerProfile.regions.join(', ') 
                : "Gauteng, Western Cape, KwaZulu-Natal"}
            </p>
          </div>
          <div>
            <h3 className="font-medium text-akhanya">Experience</h3>
            <p className="text-gray-600">
              {engineerProfile?.experience || "5+ years in telecommunications infrastructure"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfessionalInfo;
