
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ClipboardList, HardHat, Car, Clock, Loader } from "lucide-react";
import { getDashboardStats } from "@/utils/dbHelpers";

const DashboardStatsCards = () => {
  const [stats, setStats] = useState({
    completedAssessments: 0,
    installations: 0,
    vehicleChecks: 0,
    pendingApprovals: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const dashboardStats = await getDashboardStats();
        setStats(dashboardStats);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
              {loading ? (
                <div className="flex items-center">
                  <Loader className="h-4 w-4 animate-spin mr-2" />
                  <span>Loading...</span>
                </div>
              ) : (
                <h3 className="text-2xl font-bold">{stats.completedAssessments}</h3>
              )}
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
              {loading ? (
                <div className="flex items-center">
                  <Loader className="h-4 w-4 animate-spin mr-2" />
                  <span>Loading...</span>
                </div>
              ) : (
                <h3 className="text-2xl font-bold">{stats.installations}</h3>
              )}
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
              <p className="text-sm text-gray-500">Engineer Vehicle Checks</p>
              {loading ? (
                <div className="flex items-center">
                  <Loader className="h-4 w-4 animate-spin mr-2" />
                  <span>Loading...</span>
                </div>
              ) : (
                <h3 className="text-2xl font-bold">{stats.vehicleChecks}</h3>
              )}
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
              <p className="text-sm text-gray-500">Approved Assessments</p>
              {loading ? (
                <div className="flex items-center">
                  <Loader className="h-4 w-4 animate-spin mr-2" />
                  <span>Loading...</span>
                </div>
              ) : (
                <h3 className="text-2xl font-bold">{stats.pendingApprovals}</h3>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStatsCards;
