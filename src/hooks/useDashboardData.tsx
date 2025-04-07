
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { fetchDashboardData } from '@/utils/dashboardDataFetcher';

export interface DashboardData {
  engineerProfile: any;
  allocatedSites: any[];
  aiInsights: any[];
  chartData: {
    assessments: any[];
    installations: any[];
  };
  totals: {
    assessments: number;
    completedInstallations: number;
    satisfactionRate: number;
  };
  recentActivities: any[];
}

export const useDashboardData = () => {
  const { toast } = useToast();
  const [engineerProfile, setEngineerProfile] = useState(null);
  const [allocatedSites, setAllocatedSites] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState({
    assessments: [],
    installations: [],
  });
  const [totals, setTotals] = useState({
    assessments: 0,
    completedInstallations: 0,
    satisfactionRate: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);

  const refreshData = async () => {
    const data = await fetchDashboardData(setIsLoading, toast);
    
    if (data) {
      setEngineerProfile(data.engineerProfile);
      setAllocatedSites(data.allocatedSites);
      setAiInsights(data.aiInsights);
      setChartData(data.chartData);
      setTotals(data.totals);
      setRecentActivities(data.recentActivities);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return {
    engineerProfile,
    allocatedSites,
    aiInsights,
    chartData,
    totals,
    recentActivities,
    isLoading,
    refreshData
  };
};
