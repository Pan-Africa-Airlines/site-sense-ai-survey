
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getConfiguredSites, getEngineerAllocations } from "@/utils/dbHelpers";

/**
 * Fetches dashboard statistics from the database
 */
export const getDashboardStats = async () => {
  try {
    // Get completed site assessments count
    const { data: completedAssessments, error: assessmentsError } = await supabase
      .from('site_surveys')
      .select('id')
      .eq('status', 'completed');
      
    if (assessmentsError) throw assessmentsError;
    
    // Get vehicle checks count
    const { data: vehicleChecks, error: vehicleChecksError } = await supabase
      .from('vehicle_checks')
      .select('id, engineer_id')
      .order('check_date', { ascending: false });
      
    if (vehicleChecksError) throw vehicleChecksError;
    
    // Count unique engineers with vehicle checks
    const uniqueEngineers = new Set();
    vehicleChecks?.forEach(check => uniqueEngineers.add(check.engineer_id));
    
    // Get approved assessments count
    const { data: approvedAssessments, error: approvedError } = await supabase
      .from('site_surveys')
      .select('id')
      .eq('status', 'approved');
      
    if (approvedError) throw approvedError;
    
    return {
      completedAssessments: completedAssessments?.length || 0,
      vehicleChecks: uniqueEngineers.size || 0,
      installations: 0, // No installations data yet
      pendingApprovals: approvedAssessments?.length || 0
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    toast.error("Failed to load dashboard statistics");
    return {
      completedAssessments: 0,
      vehicleChecks: 0,
      installations: 0,
      pendingApprovals: 0
    };
  }
};

/**
 * Fetches region data for chart display
 */
export const getRegionChartData = async () => {
  try {
    // Get all site allocations
    const allocations = await getEngineerAllocations();
    
    // Group by region
    const regionMap = new Map();
    allocations.forEach(allocation => {
      const region = allocation.region || "Unknown";
      if (regionMap.has(region)) {
        regionMap.set(region, regionMap.get(region) + 1);
      } else {
        regionMap.set(region, 1);
      }
    });
    
    // Convert to chart data format
    const chartData = Array.from(regionMap.entries()).map(([name, count]) => ({
      name,
      count
    }));
    
    return chartData.length > 0 ? chartData : defaultRegionData;
  } catch (error) {
    console.error("Error fetching region chart data:", error);
    return defaultRegionData;
  }
};

/**
 * Fetches status distribution data for chart display
 */
export const getStatusDistributionData = async () => {
  try {
    // Get all allocations
    const allocations = await getEngineerAllocations();
    
    // Count by status
    const statusMap = new Map();
    allocations.forEach(allocation => {
      const status = allocation.status || "pending";
      if (statusMap.has(status)) {
        statusMap.set(status, statusMap.get(status) + 1);
      } else {
        statusMap.set(status, 1);
      }
    });
    
    // Convert to chart data format
    const chartData = Array.from(statusMap.entries()).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value
    }));
    
    return chartData.length > 0 ? chartData : defaultStatusData;
  } catch (error) {
    console.error("Error fetching status distribution data:", error);
    return defaultStatusData;
  }
};

/**
 * Fetches recent activities data
 */
export const getRecentActivities = async () => {
  try {
    // Get recent surveys (limited to 3)
    const { data: recentSurveys, error: surveysError } = await supabase
      .from('site_surveys')
      .select('site_name, region, date, status')
      .order('created_at', { ascending: false })
      .limit(3);
      
    if (surveysError) throw surveysError;
    
    // Format surveys data
    const surveyActivities = (recentSurveys || []).map(survey => ({
      id: Math.random().toString(36).substring(2),
      siteName: survey.site_name,
      region: survey.region,
      date: survey.date,
      status: survey.status,
      type: 'assessment'
    }));
    
    // Get recent vehicle checks (limited to 2)
    const { data: recentChecks, error: checksError } = await supabase
      .from('vehicle_checks')
      .select('vehicle_name, check_date, status')
      .order('check_date', { ascending: false })
      .limit(2);
      
    if (checksError) throw checksError;
    
    // Format vehicle checks data
    const checkActivities = (recentChecks || []).map(check => ({
      id: Math.random().toString(36).substring(2),
      siteName: check.vehicle_name,
      installDate: new Date(check.check_date).toISOString().split('T')[0],
      networkType: 'Vehicle Check',
      status: check.status
    }));
    
    return {
      recentAssessments: surveyActivities,
      recentInstallations: checkActivities
    };
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    return {
      recentAssessments: [],
      recentInstallations: []
    };
  }
};

// Default data in case of errors or empty data
const defaultRegionData = [
  { name: "Gauteng", count: 4 },
  { name: "Western Cape", count: 3 },
  { name: "KwaZulu-Natal", count: 2 },
  { name: "Free State", count: 1 },
  { name: "Eastern Cape", count: 2 },
  { name: "Northern Cape", count: 1 },
];

const defaultStatusData = [
  { name: "Completed", value: 8 },
  { name: "Pending", value: 6 },
  { name: "Scheduled", value: 4 },
];
