
import { DashboardTotals, EngineerProfile, AIInsight } from "@/types/dashboard";
import { processAssessmentData, processInstallationData, processActivitiesData } from './chartDataUtils';

/**
 * Generates mock data for dashboard when no authenticated session is found
 */
export const generateMockDashboardData = (mockEngId: string, mockUserName: string, mockEmail: string) => {
  // Create a fallback profile
  const fallbackProfile = {
    id: mockEngId,
    name: mockUserName,
    email: mockEmail,
    experience: "5+ years",
    regions: ["Gauteng", "Western Cape"],
    average_rating: 4.8,
    total_reviews: 24,
    specializations: ["Network Installation", "Fiber Optics"]
  };
  
  // Generate mock insights
  const mockInsights = [
    {
      engineer_id: mockEngId,
      type: "predictive",
      title: "Predictive Analysis",
      description: "Equipment at site B12 showing early signs of performance degradation. Maintenance recommended within 14 days.",
      icon: "trend-up"
    },
    {
      engineer_id: mockEngId,
      type: "alert",
      title: "Network Anomaly Detected",
      description: "Unusual traffic pattern detected in Sandton branch. Possible security concern.",
      icon: "alert-triangle"
    },
    {
      engineer_id: mockEngId,
      type: "optimization",
      title: "Resource Optimization",
      description: "Your deployment efficiency increased by 12% this month. Review best practices for continued improvement.",
      icon: "check"
    }
  ];
  
  const mockTotals = {
    assessments: 24,
    completedInstallations: 18,
    satisfactionRate: 96,
    assessmentStatus: "In Progress"
  };
  
  return {
    engineerProfile: fallbackProfile,
    allocatedSites: [],
    aiInsights: mockInsights,
    chartData: {
      assessments: processAssessmentData([]),
      installations: processInstallationData([])
    },
    totals: mockTotals,
    recentActivities: processActivitiesData([])
  };
};
