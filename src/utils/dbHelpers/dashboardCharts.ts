
import { supabase } from "@/integrations/supabase/client";
import { getEngineerAllocationsInternal } from "./dashboardAllocations";

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

/**
 * Fetches region data for chart display
 */
export const getRegionChartData = async () => {
  try {
    // Get all site allocations
    const allocations = await getEngineerAllocationsInternal();
    
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
    const allocations = await getEngineerAllocationsInternal();
    
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
