
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ensureEngineerProfile, generateAIInsights } from '@/utils/dbHelpers';

interface DashboardContextType {
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
  isLoading: boolean;
  selectedSite: any;
  showSurvey: boolean;
  setShowSurvey: (show: boolean) => void;
  setSelectedSite: (site: any) => void;
  handleOpenSurvey: (site: any) => void;
  handleCloseSurvey: () => void;
  refreshData: () => Promise<void>;
}

const defaultContextValue: DashboardContextType = {
  engineerProfile: null,
  allocatedSites: [],
  aiInsights: [],
  chartData: {
    assessments: [],
    installations: [],
  },
  totals: {
    assessments: 0,
    completedInstallations: 0,
    satisfactionRate: 0,
  },
  recentActivities: [],
  isLoading: true,
  selectedSite: null,
  showSurvey: false,
  setShowSurvey: () => {},
  setSelectedSite: () => {},
  handleOpenSurvey: () => {},
  handleCloseSurvey: () => {},
  refreshData: async () => {},
};

const DashboardContext = createContext<DashboardContextType>(defaultContextValue);

export const useDashboard = () => useContext(DashboardContext);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [engineerProfile, setEngineerProfile] = useState(null);
  const [allocatedSites, setAllocatedSites] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSurvey, setShowSurvey] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);
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

  // Process assessment data for chart display
  const processAssessmentData = (data) => {
    if (!data || data.length === 0) {
      return [
        { month: 'Jan', completed: 4, pending: 1 },
        { month: 'Feb', completed: 5, pending: 0 },
        { month: 'Mar', completed: 6, pending: 2 },
        { month: 'Apr', completed: 8, pending: 1 },
        { month: 'May', completed: 7, pending: 0 },
        { month: 'Jun', completed: 9, pending: 1 },
      ];
    }
    
    // Real implementation would process data here
    return [
      { month: 'Jan', completed: 4, pending: 1 },
      { month: 'Feb', completed: 5, pending: 0 },
      { month: 'Mar', completed: 6, pending: 2 },
      { month: 'Apr', completed: 8, pending: 1 },
      { month: 'May', completed: 7, pending: 0 },
      { month: 'Jun', completed: 9, pending: 1 },
    ];
  };
  
  // Process installation data for chart display
  const processInstallationData = (data) => {
    if (!data || data.length === 0) {
      return [
        { month: 'Jan', installations: 2 },
        { month: 'Feb', installations: 4 },
        { month: 'Mar', installations: 5 },
        { month: 'Apr', installations: 7 },
        { month: 'May', installations: 6 },
        { month: 'Jun', installations: 8 },
      ];
    }
    
    // Real implementation would process data here
    return [
      { month: 'Jan', installations: 2 },
      { month: 'Feb', installations: 4 },
      { month: 'Mar', installations: 5 },
      { month: 'Apr', installations: 7 },
      { month: 'May', installations: 6 },
      { month: 'Jun', installations: 8 },
    ];
  };
  
  // Process activities data for recent activities display
  const processActivitiesData = (data) => {
    if (!data || data.length === 0) {
      return [
        { action: "Completed site assessment", time: "2 hours ago", location: "Johannesburg CBD" },
        { action: "Submitted installation report", time: "Yesterday", location: "Pretoria East" },
        { action: "Started vehicle check", time: "Yesterday", location: "Sandton" },
        { action: "Completed installation", time: "2 days ago", location: "Midrand" },
      ];
    }
    
    // Real implementation would process data here
    return [
      { action: "Completed site assessment", time: "2 hours ago", location: "Johannesburg CBD" },
      { action: "Submitted installation report", time: "Yesterday", location: "Pretoria East" },
      { action: "Started vehicle check", time: "Yesterday", location: "Sandton" },
      { action: "Completed installation", time: "2 days ago", location: "Midrand" },
    ];
  };

  const handleOpenSurvey = (site) => {
    setSelectedSite(site);
    setShowSurvey(true);
  };

  const handleCloseSurvey = () => {
    setShowSurvey(false);
    setSelectedSite(null);
  };

  const refreshData = async () => {
    try {
      setIsLoading(true);
      
      // Get user info
      const userEmail = localStorage.getItem("userEmail") || "john.doe@example.com";
      const userName = userEmail.split('@')[0].split('.').map(name => 
        name.charAt(0).toUpperCase() + name.slice(1)
      ).join(' ');
      
      // Ensure engineer profile exists
      const dummyEngId = "eng-001"; // In a real app, this would come from auth
      const profile = await ensureEngineerProfile(dummyEngId, userName, userEmail);
      
      if (profile) {
        setEngineerProfile(profile);
        
        // Generate AI insights if needed
        const insights = await generateAIInsights(dummyEngId);
        setAiInsights(insights);
        
        // Fetch engineer allocations
        const { data: allocations, error: allocationsError } = await supabase
          .from('engineer_allocations')
          .select('*');
        
        if (allocationsError) {
          console.error("Error fetching allocations:", allocationsError);
          toast({
            title: "Error fetching site allocations",
            description: allocationsError.message,
            variant: "destructive"
          });
        } else {
          setAllocatedSites(allocations || []);
        }
        
        // Get installation count
        const { data: installations, error: installationsError } = await supabase
          .from('site_installations')
          .select('*')
          .eq('engineer_id', dummyEngId);
          
        const installationsCount = installations?.length || 32;
        
        // Calculate satisfaction rate from ratings
        const { data: ratings, error: ratingsError } = await supabase
          .from('engineer_ratings')
          .select('rating')
          .eq('engineer_id', dummyEngId);
          
        let satisfactionRate = profile.average_rating ? Math.round((profile.average_rating / 5) * 100) : 95;
        
        // Set chart data
        setChartData({
          assessments: processAssessmentData([]),
          installations: processInstallationData([])
        });
        
        // Set totals
        setTotals({
          assessments: 39, // Mock value
          completedInstallations: installationsCount,
          satisfactionRate: satisfactionRate
        });
        
        // Set recent activities
        setRecentActivities(processActivitiesData([]));
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast({
        title: "Error loading dashboard",
        description: "There was a problem loading your dashboard data.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const value = {
    engineerProfile,
    allocatedSites,
    aiInsights,
    chartData,
    totals,
    recentActivities,
    isLoading,
    selectedSite,
    showSurvey,
    setShowSurvey,
    setSelectedSite,
    handleOpenSurvey,
    handleCloseSurvey,
    refreshData
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};
