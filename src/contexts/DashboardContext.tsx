
import React, { createContext, useContext } from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useSurveyHandler } from '@/hooks/useSurveyHandler';
import { AllocatedSite } from '@/types/dashboard';

interface DashboardContextType {
  engineerProfile: any;
  allocatedSites: AllocatedSite[];
  aiInsights: any[];
  chartData: {
    assessments: any[];
    installations: any[];
  };
  totals: {
    assessments: number;
    completedInstallations: number;
    satisfactionRate: number;
    completedAssessments?: number;
    allocations?: number;
    assessmentStatus?: string;
  };
  recentActivities: any[];
  isLoading: boolean;
  selectedSite: AllocatedSite | null;
  showSurvey: boolean;
  setShowSurvey: (show: boolean) => void;
  setSelectedSite: (site: AllocatedSite | null) => void;
  handleOpenSurvey: (site: AllocatedSite) => void;
  handleCloseSurvey: () => void;
  refreshData: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType>({
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
});

export const useDashboard = () => useContext(DashboardContext);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use the custom hooks to get dashboard data and survey handling
  const dashboardData = useDashboardData();
  const surveyHandler = useSurveyHandler();

  // Combine all the values into one context value
  const value = {
    ...dashboardData,
    ...surveyHandler
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};
