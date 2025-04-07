
/**
 * Process assessment data for chart display
 */
export const processAssessmentData = (data: any[]) => {
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
  
  // Group real data by month
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentYear = new Date().getFullYear();
  
  // Initialize months with zeros
  const months: Record<string, { completed: number, pending: number }> = {};
  monthNames.forEach(month => {
    months[month] = { completed: 0, pending: 0 };
  });
  
  // Process actual data
  data.forEach(item => {
    const date = new Date(item.created_at);
    const month = monthNames[date.getMonth()];
    
    if (item.status === 'completed') {
      months[month].completed += 1;
    } else {
      months[month].pending += 1;
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
      { month: 'Jan', installations: 2 },
      { month: 'Feb', installations: 4 },
      { month: 'Mar', installations: 5 },
      { month: 'Apr', installations: 7 },
      { month: 'May', installations: 6 },
      { month: 'Jun', installations: 8 },
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
    const date = new Date(item.installation_date);
    const month = monthNames[date.getMonth()];
    months[month].installations += 1;
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
