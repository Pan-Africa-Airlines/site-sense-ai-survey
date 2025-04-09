
import React from "react";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEngineerProfile } from "@/hooks/useEngineerProfile";
import EngineerDashboardHeader from "@/components/engineer-dashboard/EngineerDashboardHeader";
import EngineerMetricsCards from "@/components/engineer-dashboard/EngineerMetricsCards";
import EngineerTasksList from "@/components/engineer-dashboard/EngineerTasksList";
import EngineerPerformanceChart from "@/components/engineer-dashboard/EngineerPerformanceChart";
import RecentActivityFeed from "@/components/engineer-dashboard/RecentActivityFeed";
import NavigationBar from "@/components/navigation/NavigationBar";

const EngineerDashboard: React.FC = () => {
  const { engineerProfile, isLoading, userName } = useEngineerProfile();

  return (
    <>
      <NavigationBar />
      <div className="min-h-screen bg-gray-50 pb-10 pt-6">
        <Container>
          <EngineerDashboardHeader 
            engineerName={engineerProfile?.name || userName} 
            isLoading={isLoading}
          />
          
          <div className="space-y-8">
            <EngineerMetricsCards engineerId={engineerProfile?.id} isLoading={isLoading} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="shadow-sm border-gray-200 h-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl font-semibold text-gray-800">Performance Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EngineerPerformanceChart engineerId={engineerProfile?.id} />
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card className="shadow-sm border-gray-200 h-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl font-semibold text-gray-800">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RecentActivityFeed engineerId={engineerProfile?.id} />
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card className="shadow-sm border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-semibold text-gray-800">Upcoming Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <EngineerTasksList engineerId={engineerProfile?.id} />
              </CardContent>
            </Card>
          </div>
        </Container>
      </div>
    </>
  );
};

export default EngineerDashboard;
