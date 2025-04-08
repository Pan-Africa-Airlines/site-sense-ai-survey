
import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import SystemLogsFilter from "@/components/admin/logs/SystemLogsFilter";
import SystemLogsList from "@/components/admin/logs/SystemLogsList";
import { SystemLog, LogFilterValues } from "@/components/admin/logs/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminSystemLogs = () => {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<SystemLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<LogFilterValues>({
    search: "",
    action: "",
    dateFrom: null,
    dateTo: null,
  });

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [logs, filters]);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      let { data, error } = await supabase
        .from("system_logs")
        .select("*")
        .order("timestamp", { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        const mappedLogs: SystemLog[] = data.map(log => ({
          id: log.id,
          user_id: log.user_id,
          user_name: log.user_name,
          action: log.action,
          details: log.details,
          timestamp: log.timestamp
        }));
        setLogs(mappedLogs);
      } else {
        setLogs(getMockSystemLogs());
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
      setLogs(getMockSystemLogs());
    } finally {
      setIsLoading(false);
    }
  };

  const filterLogs = () => {
    let filtered = [...logs];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        log =>
          (log.user_name && log.user_name.toLowerCase().includes(searchLower)) ||
          (log.details && JSON.stringify(log.details).toLowerCase().includes(searchLower))
      );
    }

    if (filters.action) {
      filtered = filtered.filter(log => log.action === filters.action);
    }

    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      fromDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter(log => {
        const logDate = new Date(log.timestamp);
        return logDate >= fromDate;
      });
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(log => {
        const logDate = new Date(log.timestamp);
        return logDate <= toDate;
      });
    }

    setFilteredLogs(filtered);
  };

  const handleFilterChange = (newFilters: LogFilterValues) => {
    setFilters(newFilters);
  };

  return (
    <AdminLayout>
      <Container>
        <div className="space-y-4 py-8">
          <h1 className="text-3xl font-bold">System Logs</h1>
          <p className="text-muted-foreground">
            View and filter system logs to track user activity and system events.
          </p>

          <Card className="p-6">
            <SystemLogsFilter onFilterChange={handleFilterChange} />
            <SystemLogsList logs={filteredLogs} isLoading={isLoading} />
          </Card>
        </div>
      </Container>
    </AdminLayout>
  );
};

export default AdminSystemLogs;

function getMockSystemLogs(): SystemLog[] {
  return [
    {
      id: "1",
      user_id: "user-123",
      user_name: "John Smith",
      action: "login",
      details: { ip: "192.168.1.1", device: "Chrome/Windows" },
      timestamp: new Date(2023, 5, 15, 9, 30).toISOString()
    },
    {
      id: "2",
      user_id: "user-456",
      user_name: "Jane Doe",
      action: "user_created",
      details: { email: "jane.doe@example.com", role: "engineer" },
      timestamp: new Date(2023, 5, 14, 15, 45).toISOString()
    },
    {
      id: "3",
      user_id: "user-789",
      user_name: "Admin User",
      action: "site_allocated",
      details: { site_id: "site-001", engineer_id: "user-456" },
      timestamp: new Date(2023, 5, 14, 10, 15).toISOString()
    },
    {
      id: "4",
      user_id: "user-123",
      user_name: "John Smith",
      action: "logout",
      details: { time_spent: "2h 15m" },
      timestamp: new Date(2023, 5, 15, 11, 45).toISOString()
    },
    {
      id: "5",
      user_id: "user-789",
      user_name: "Admin User",
      action: "user_updated",
      details: { id: "user-456", field: "region", old: "Western Cape", new: "Gauteng" },
      timestamp: new Date(2023, 5, 13, 14, 20).toISOString()
    },
  ];
}
