
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader } from "lucide-react";
import { getRecentActivities } from "@/utils/dbHelpers";

const RecentActivitiesCards = () => {
  const [recentAssessments, setRecentAssessments] = useState([]);
  const [recentInstallations, setRecentInstallations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const activities = await getRecentActivities();
        setRecentAssessments(activities.recentAssessments || []);
        setRecentInstallations(activities.recentInstallations || []);
      } catch (error) {
        console.error("Error fetching recent activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4 text-akhanya">Recent Activity</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-akhanya">Recent Assessments</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center items-center h-[200px]">
              <Loader className="h-6 w-6 animate-spin text-akhanya" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-akhanya">Recent Activities</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center items-center h-[200px]">
              <Loader className="h-6 w-6 animate-spin text-akhanya" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-akhanya">Recent Activity</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-akhanya">Recent Assessments</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {recentAssessments.length > 0 ? (
                recentAssessments.map(assessment => (
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
                ))
              ) : (
                <li className="text-center py-6 text-gray-500">No recent assessments found</li>
              )}
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-akhanya">Recent Vehicle Checks</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {recentInstallations.length > 0 ? (
                recentInstallations.map(installation => (
                  <li key={installation.id} className="border-b pb-2">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{installation.siteName}</p>
                        <p className="text-sm text-gray-500">{installation.networkType}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{installation.installDate}</p>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          installation.status === 'passed' ? 'bg-green-100 text-green-800' : 
                          installation.status === 'fair' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {installation.status}
                        </span>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="text-center py-6 text-gray-500">No recent vehicle checks found</li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecentActivitiesCards;
