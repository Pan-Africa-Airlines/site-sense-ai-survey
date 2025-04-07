
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RecentActivity } from "@/types/dashboard";

interface RecentActivitiesCardProps {
  activities: RecentActivity[];
  engineerName: string;
}

const RecentActivitiesCard: React.FC<RecentActivitiesCardProps> = ({ activities, engineerName }) => {
  return (
    <Card className="mb-20 overflow-hidden">
      <div className="bg-gradient-to-r from-akhanya to-black h-3"></div>
      <CardHeader>
        <CardTitle className="text-akhanya">My Recent Activity</CardTitle>
        <CardDescription>Latest activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {activities.map((activity, i) => (
            <div key={i} className="flex items-start space-x-4 border-b border-gray-100 pb-4 last:border-0">
              <div className="rounded-full bg-akhanya text-white p-2 font-bold w-10 h-10 flex items-center justify-center">
                {engineerName.split(' ').map(name => name[0]).join('').toUpperCase()}
              </div>
              <div>
                <p className="font-medium">You <span className="text-gray-600 font-normal">- {activity.action}</span></p>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  <span>{activity.time}</span>
                  <span>•</span>
                  <span className="location-badge">{activity.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivitiesCard;
