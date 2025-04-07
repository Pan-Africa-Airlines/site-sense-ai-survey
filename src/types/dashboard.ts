
export interface EngineerProfile {
  id: string | null;
  name: string;
  experience: string;
  regions: string[];
  average_rating: number;
  total_reviews: number;
  specializations: string[];
}

export interface AIInsight {
  type: string;
  title: string;
  description: string;
  icon: string;
}

export interface ChartData {
  assessments: {
    month: string;
    completed: number;
    pending: number;
  }[];
  installations: {
    month: string;
    installations: number;
  }[];
}

export interface DashboardTotals {
  assessments: number;
  completedInstallations: number;
  satisfactionRate: number;
}

export interface RecentActivity {
  action: string;
  time: string;
  location: string;
}

export interface SiteAllocation {
  id: string;
  site_id: string;
  site_name: string;
  priority: string;
  address: string;
  scheduled_date: string;
  status: string;
  distance?: number;
}

export interface DashboardContextType {
  engineerProfile: EngineerProfile | null;
  allocatedSites: SiteAllocation[];
  aiInsights: AIInsight[];
  chartData: ChartData;
  totals: DashboardTotals;
  recentActivities: RecentActivity[];
  isLoading: boolean;
  selectedSite: SiteAllocation | null;
  showSurvey: boolean;
  setShowSurvey: (show: boolean) => void;
  setSelectedSite: (site: SiteAllocation | null) => void;
  handleOpenSurvey: (site: SiteAllocation) => void;
  handleCloseSurvey: () => void;
  refreshData: () => Promise<void>;
}
