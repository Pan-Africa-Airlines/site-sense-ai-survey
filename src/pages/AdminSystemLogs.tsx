
import React, { useState, useEffect } from "react";
import { AdminNavLayout } from "@/components/admin/AdminNavLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SystemLogsFilter from "@/components/admin/logs/SystemLogsFilter";
import SystemLogsList from "@/components/admin/logs/SystemLogsList";
import { fetchSystemLogs, fetchUsers, SystemLog } from "@/utils/systemLogsData";
import { useToast } from "@/hooks/use-toast";

const AdminSystemLogs: React.FC = () => {
  const { toast } = useToast();
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [totalLogs, setTotalLogs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState("all");
  const [users, setUsers] = useState<Array<{ id: string; name: string | null }>>([]);
  const [usersLoading, setUsersLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userId = selectedUser !== "all" ? selectedUser : undefined;
        const result = await fetchSystemLogs(page, pageSize, userId);
        
        if (result.error) {
          setError(result.error);
          toast({
            title: "Error loading logs",
            description: result.error.message || "Failed to load system logs",
            variant: "destructive"
          });
        } else {
          setLogs(result.logs);
          setTotalLogs(result.count);
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching logs:", err);
        setError(err);
        toast({
          title: "Error",
          description: "Failed to load system logs",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, pageSize, selectedUser, toast]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setUsersLoading(true);
        const { users: fetchedUsers, error } = await fetchUsers();
        
        if (error) {
          console.error("Error fetching users:", error);
          toast({
            title: "Error",
            description: "Failed to load users for filtering",
            variant: "destructive"
          });
        } else {
          setUsers(fetchedUsers);
        }
      } catch (err) {
        console.error("Exception fetching users:", err);
      } finally {
        setUsersLoading(false);
      }
    };

    loadUsers();
  }, [toast]);

  const filteredLogs = logs.filter(log => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      log.action.toLowerCase().includes(query) ||
      (log.user_name && log.user_name.toLowerCase().includes(query)) ||
      log.user_id.toLowerCase().includes(query) ||
      (typeof log.details === 'object' && JSON.stringify(log.details).toLowerCase().includes(query))
    );
  });

  return (
    <AdminNavLayout>
      <div className="container mx-auto px-4 py-6">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>System Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              View all system activities and actions performed by users.
            </p>
          </CardContent>
        </Card>

        <SystemLogsFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedUser={selectedUser}
          onUserSelect={setSelectedUser}
          users={users}
          loading={usersLoading}
        />

        <SystemLogsList
          logs={filteredLogs}
          loading={loading}
          error={error}
        />
      </div>
    </AdminNavLayout>
  );
};

export default AdminSystemLogs;
