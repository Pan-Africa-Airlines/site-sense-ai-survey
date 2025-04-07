
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ClipboardList, HardHat, Car, Clock } from "lucide-react";

interface DashboardStatsCardsProps {
  assessmentCount?: number;
  installationCount?: number;
  vehicleCheckCount?: number;
  pendingApprovalCount?: number;
}

const DashboardStatsCards: React.FC<DashboardStatsCardsProps> = ({
  assessmentCount = 32,
  installationCount = 18,
  vehicleCheckCount = 27,
  pendingApprovalCount = 8
}) => {
  // Ensure counts are numbers with fallbacks to defaults
  const safeAssessmentCount = assessmentCount ?? 32;
  const safeInstallationCount = installationCount ?? 18;
  const safeVehicleCheckCount = vehicleCheckCount ?? 27;
  const safePendingApprovalCount = pendingApprovalCount ?? 8;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <ClipboardList className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Assessments</p>
              <h3 className="text-2xl font-bold">{safeAssessmentCount}</h3>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-full">
              <HardHat className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Installations</p>
              <h3 className="text-2xl font-bold">{safeInstallationCount}</h3>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-amber-100 p-3 rounded-full">
              <Car className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Vehicle Checks</p>
              <h3 className="text-2xl font-bold">{safeVehicleCheckCount}</h3>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Approvals</p>
              <h3 className="text-2xl font-bold">{safePendingApprovalCount}</h3>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStatsCards;
