
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const RecentActivitiesCards = () => {
  const MOCK_ASSESSMENT_DATA = [
    { id: 1, siteName: "Eskom Substation A", region: "Gauteng", date: "2025-04-01", status: "completed" },
    { id: 2, siteName: "Power Station B", region: "Western Cape", date: "2025-04-02", status: "pending" },
    { id: 3, siteName: "Transmission Tower C", region: "KwaZulu-Natal", date: "2025-04-03", status: "completed" },
    { id: 4, siteName: "Distribution Center D", region: "Free State", date: "2025-03-28", status: "completed" },
    { id: 5, siteName: "Renewable Plant E", region: "Eastern Cape", date: "2025-03-25", status: "completed" },
    { id: 6, siteName: "Substation F", region: "Northern Cape", date: "2025-03-20", status: "pending" },
  ];

  const MOCK_INSTALLATION_DATA = [
    { id: 1, siteName: "Eskom Substation A", installDate: "2025-04-02", networkType: "Fiber", status: "completed" },
    { id: 2, siteName: "Power Station B", installDate: "2025-04-05", networkType: "Wireless", status: "pending" },
    { id: 3, siteName: "Transmission Tower C", installDate: "2025-04-08", networkType: "Satellite", status: "scheduled" },
  ];

  // Ensure we have data to display
  const recentAssessments = MOCK_ASSESSMENT_DATA?.slice(0, 3) || [];
  const recentInstallations = MOCK_INSTALLATION_DATA?.slice(0, 2) || [];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-akhanya">Recent Activity</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-akhanya">Recent Assessments</CardTitle>
          </CardHeader>
          <CardContent>
            {recentAssessments.length > 0 ? (
              <ul className="space-y-3">
                {recentAssessments.map(assessment => (
                  <li key={assessment.id} className="border-b pb-2">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{assessment.siteName}</p>
                        <p className="text-sm text-gray-500">{assessment.region}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{assessment.date}</p>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          assessment.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {assessment.status}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-4">No recent assessments</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-akhanya">Recent Installations</CardTitle>
          </CardHeader>
          <CardContent>
            {recentInstallations.length > 0 ? (
              <ul className="space-y-3">
                {recentInstallations.map(installation => (
                  <li key={installation.id} className="border-b pb-2">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{installation.siteName}</p>
                        <p className="text-sm text-gray-500">{installation.networkType}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{installation.installDate}</p>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          installation.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          installation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {installation.status}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-4">No recent installations</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecentActivitiesCards;
