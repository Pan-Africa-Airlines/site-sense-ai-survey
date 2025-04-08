import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { fetchDashboardData } from '@/utils/dashboardDataFetcher';
import { getCurrentEngineerProfile, generateAIInsights } from '@/utils/dbHelpers/engineerHelpers';
import { supabase } from '@/integrations/supabase/client';

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
    try {
      setIsLoading(true);
      
      // First, directly fetch the current user's profile
      const profile = await getCurrentEngineerProfile();
      
      if (profile) {
        setEngineerProfile(profile);
        
        // Fetch AI insights specifically for this engineer
        const insights = await generateAIInsights(profile.id);
        setAiInsights(insights);
        
        // Continue with the rest of the dashboard data
        const data = await fetchDashboardData(setIsLoading, toast);
        
        if (data) {
          // Keep the profile we already set
          setAllocatedSites(data.allocatedSites);
          setChartData(data.chartData);
          setTotals(data.totals);
          setRecentActivities(data.recentActivities);
        }
      } else {
        console.error("Failed to fetch engineer profile");
        toast({
          title: "Error",
          description: "Could not load your profile. Please try again later."
        });
        
        // Fallback to regular dashboard data
        const data = await fetchDashboardData(setIsLoading, toast);
        if (data) {
          setEngineerProfile(data.engineerProfile);
          setAllocatedSites(data.allocatedSites);
          setAiInsights(data.aiInsights);
          setChartData(data.chartData);
          setTotals(data.totals);
          setRecentActivities(data.recentActivities);
        }
      }
    } catch (error) {
      console.error("Error refreshing dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to refresh dashboard data."
      });
    } finally {
      setIsLoading(false);
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
