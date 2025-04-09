
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EngineerDashboardHeaderProps {
  engineerName: string;
  isLoading: boolean;
}

const EngineerDashboardHeader: React.FC<EngineerDashboardHeaderProps> = ({ 
  engineerName, 
  isLoading 
}) => {
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    window.location.reload();
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <div>
        <div className="flex items-center gap-2">
          <LayoutDashboard className="h-7 w-7 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-800">Engineer Dashboard</h1>
        </div>
        {isLoading ? (
          <Skeleton className="h-5 w-48 mt-1" />
        ) : (
          <p className="text-gray-600 mt-1">
            Welcome back, <span className="font-medium">{engineerName}</span>
          </p>
        )}
      </div>
      
      <Button
        variant="outline"
        size="sm"
        className="border-gray-200 hover:bg-gray-50 hover:text-green-600 transition-all"
        onClick={handleRefresh}
        disabled={isRefreshing}
      >
        <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
        {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
      </Button>
    </div>
  );
};

export default EngineerDashboardHeader;
