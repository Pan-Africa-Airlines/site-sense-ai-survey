
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ClipboardList, Loader } from "lucide-react";

interface AssessmentStatsCardProps {
  count: number;
  loading: boolean;
}

const AssessmentStatsCard: React.FC<AssessmentStatsCardProps> = ({ count, loading }) => {
  return (
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
              <h3 className="text-2xl font-bold">{count}</h3>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssessmentStatsCard;
