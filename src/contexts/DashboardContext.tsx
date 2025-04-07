
import React, { createContext, useContext, useEffect } from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useSurveyDialog } from '@/hooks/useSurveyDialog';
import { DashboardContextType } from '@/types/dashboard';

// Create context with default values
const DashboardContext = createContext<DashboardContextType>({} as DashboardContextType);

// Custom hook to use the dashboard context
export const useDashboard = () => useContext(DashboardContext);

// Dashboard provider component
export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    engineerProfile,
    allocatedSites,
    aiInsights,
    chartData,
    totals,
    recentActivities,
    isLoading,
    refreshData
  } = useDashboardData();
  
  const {
    showSurvey,
    setShowSurvey,
    selectedSite,
    setSelectedSite,
    handleOpenSurvey,
    handleCloseSurvey
  } = useSurveyDialog();

  // Initial data load
  useEffect(() => {
    refreshData();
  }, []);

  // Combine all values for the context
  const contextValue: DashboardContextType = {
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
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
};
