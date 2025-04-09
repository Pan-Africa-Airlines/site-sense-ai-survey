
import React from "react";
import { RefreshCw, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  engineerName: string;
  onRefresh: () => Promise<void>;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  engineerName,
  onRefresh
}) => {
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <div>
        <div className="flex items-center gap-2">
          <LayoutDashboard className="h-7 w-7 text-akhanya" />
          <h1 className="text-3xl font-bold text-akhanya">Engineering Dashboard</h1>
        </div>
        <p className="text-gray-600 mt-1">
          Welcome back, <span className="font-medium">{engineerName}</span>
        </p>
      </div>
      
      <Button
        variant="outline"
        size="sm"
        className="border-gray-200 hover:bg-gray-50 hover:text-akhanya transition-all"
        onClick={handleRefresh}
        disabled={isRefreshing}
      >
        <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
        {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
      </Button>
    </div>
  );
};

export default DashboardHeader;
