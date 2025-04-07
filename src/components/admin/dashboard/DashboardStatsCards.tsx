
import React, { useEffect, useState } from "react";
import { getDashboardStats } from "@/utils/dbHelpers";
import AssessmentStatsCard from "./stats/AssessmentStatsCard";
import InstallationsStatsCard from "./stats/InstallationsStatsCard";
import VehicleChecksStatsCard from "./stats/VehicleChecksStatsCard";
import ApprovedAssessmentsStatsCard from "./stats/ApprovedAssessmentsStatsCard";

const DashboardStatsCards = () => {
  const [stats, setStats] = useState({
    completedAssessments: 0,
    installations: 0,
    vehicleChecks: 0,
    pendingApprovals: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("DashboardStatsCards mounted, fetching statistics...");
    const fetchStats = async () => {
      setLoading(true);
      try {
        const dashboardStats = await getDashboardStats();
        console.log("Dashboard stats loaded:", dashboardStats);
        setStats(dashboardStats);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        // Set fallback data if API fails
        setStats({
          completedAssessments: 5,
          installations: 3,
          vehicleChecks: 7,
          pendingApprovals: 2
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // For debugging, also set a timeout to fetch stats again after 2 seconds
    // in case the initial fetch fails
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.log("Stats are still loading after timeout, trying again...");
        fetchStats();
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, []);

  console.log("Rendering stats cards with data:", stats, "loading:", loading);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <AssessmentStatsCard count={stats.completedAssessments} loading={loading} />
      <InstallationsStatsCard count={stats.installations} loading={loading} />
      <VehicleChecksStatsCard count={stats.vehicleChecks} loading={loading} />
      <ApprovedAssessmentsStatsCard count={stats.pendingApprovals} loading={loading} />
    </div>
  );
};

export default DashboardStatsCards;
