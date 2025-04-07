
import React, { createContext, useContext } from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useSurveyHandler } from '@/hooks/useSurveyHandler';

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
