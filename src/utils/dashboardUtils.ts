
import { ChartData, RecentActivity } from "@/types/dashboard";

// Process assessment data for chart display
export const processAssessmentData = (data: any[] | null): ChartData['assessments'] => {
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
export const processInstallationData = (data: any[] | null): ChartData['installations'] => {
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
export const processActivitiesData = (data: any[] | null): RecentActivity[] => {
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
