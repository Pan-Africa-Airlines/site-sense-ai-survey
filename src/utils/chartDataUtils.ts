
/**
 * Process assessment data for chart display
 */
export const processAssessmentData = (data: any[]) => {
  if (!data || data.length === 0) {
    return [
      { month: 'Jan', completed: 0, pending: 0 },
      { month: 'Feb', completed: 0, pending: 0 },
      { month: 'Mar', completed: 0, pending: 0 },
      { month: 'Apr', completed: 0, pending: 0 },
      { month: 'May', completed: 0, pending: 0 },
      { month: 'Jun', completed: 0, pending: 0 },
      { month: 'Jul', completed: 0, pending: 0 },
      { month: 'Aug', completed: 0, pending: 0 },
      { month: 'Sep', completed: 0, pending: 0 },
      { month: 'Oct', completed: 0, pending: 0 },
      { month: 'Nov', completed: 0, pending: 0 },
      { month: 'Dec', completed: 0, pending: 0 },
    ];
  }
  
  // Group real data by month
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Initialize months with zeros
  const months: Record<string, { completed: number, pending: number }> = {};
  monthNames.forEach(month => {
    months[month] = { completed: 0, pending: 0 };
  });
  
  // Process actual data
  data.forEach(item => {
    let date;
    if (item.created_at) {
      date = new Date(item.created_at);
    } else if (item.date) {
      // Handle if date is stored in YYYY-MM-DD format
      date = new Date(item.date);
      if (isNaN(date.getTime())) {
        // Try to parse other date formats
        const parts = item.date.split(/[-/]/);
        if (parts.length >= 3) {
          // Assuming format is YYYY-MM-DD or DD/MM/YYYY
          if (parts[0].length === 4) {
            // YYYY-MM-DD
            date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
          } else {
            // DD/MM/YYYY or similar
            date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
          }
        }
      }
    }

    if (date && !isNaN(date.getTime())) {
      const month = monthNames[date.getMonth()];
      
      if (item.status === 'completed' || item.status === 'approved') {
        months[month].completed += 1;
      } else {
        months[month].pending += 1;
      }
    }
  });
  
  // Convert to array format for chart
  return Object.entries(months).map(([month, stats]) => ({
    month,
    completed: stats.completed,
    pending: stats.pending
  }));
};

/**
 * Process installation data for chart display
 */
export const processInstallationData = (data: any[]) => {
  if (!data || data.length === 0) {
    return [
      { month: 'Jan', installations: 0 },
      { month: 'Feb', installations: 0 },
      { month: 'Mar', installations: 0 },
      { month: 'Apr', installations: 0 },
      { month: 'May', installations: 0 },
      { month: 'Jun', installations: 0 },
      { month: 'Jul', installations: 0 },
      { month: 'Aug', installations: 0 },
      { month: 'Sep', installations: 0 },
      { month: 'Oct', installations: 0 },
      { month: 'Nov', installations: 0 },
      { month: 'Dec', installations: 0 },
    ];
  }
  
  // Group real data by month
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Initialize months with zeros
  const months: Record<string, { installations: number }> = {};
  monthNames.forEach(month => {
    months[month] = { installations: 0 };
  });
  
  // Process actual data
  data.forEach(item => {
    if (item.installation_date) {
      const date = new Date(item.installation_date);
      if (!isNaN(date.getTime())) {
        const month = monthNames[date.getMonth()];
        months[month].installations += 1;
      }
    }
  });
  
  // Convert to array format for chart
  return Object.entries(months).map(([month, stats]) => ({
    month,
    installations: stats.installations
  }));
};

/**
 * Process activities data for recent activities display
 */
export const processActivitiesData = (data: any[]) => {
  if (!data || data.length === 0) {
    return [
      { action: "No recent activities", time: "N/A", location: "N/A" },
    ];
  }
  
  return data.map(activity => ({
    action: activity.action || `Activity for ${activity.site_name || 'unknown site'}`,
    time: activity.time || activity.created_at || "Unknown",
    location: activity.location || activity.region || "Unknown"
  }));
};

/**
 * Generate default AI insights
 */
export const generateDefaultAIInsights = () => {
  return [
    {
      type: "predictive",
      title: "Predictive Analysis",
      description: "Equipment at site B12 showing early signs of performance degradation. Maintenance recommended within 14 days.",
      icon: "trend-up"
    },
    {
      type: "alert",
      title: "Network Anomaly Detected",
      description: "Unusual traffic pattern detected in Sandton branch. Possible security concern.",
      icon: "alert-triangle"
    },
    {
      type: "optimization",
      title: "Resource Optimization",
      description: "Your deployment efficiency increased by 12% this month. Review best practices for continued improvement.",
      icon: "check"
    }
  ];
};
