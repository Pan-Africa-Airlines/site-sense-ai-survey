
export interface EngineerProfile {
  id: string;
  name: string;
  experience: string;
  regions: string[];
  average_rating?: number;
  total_reviews?: number;
  specializations: string[];
}

export interface AIInsight {
  type: string;
  title: string;
  description: string;
  icon: string;
}

export interface ChartDataPoint {
  month: string;
  completed?: number;
  pending?: number;
  installations?: number;
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

export interface AllocatedSite {
  id: string;
  site_id: string;
  site_name: string;
  priority: string;
  address?: string;
  region: string;
  status: string;
  scheduled_date?: string;
  engineer_name?: string;
  distance?: number;
}
