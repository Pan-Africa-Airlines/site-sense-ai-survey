
import React, { useEffect, useState } from "react";
import { AdminNavLayout } from "@/components/admin/AdminNavLayout";
import SystemLogsFilter from "@/components/admin/logs/SystemLogsFilter";
import SystemLogsList from "@/components/admin/logs/SystemLogsList";
import { fetchSystemLogs, fetchUsers, SystemLog } from "@/utils/systemLogsData";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const AdminSystemLogs = () => {
  const { toast } = useToast();
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [users, setUsers] = useState<Array<{ id: string, name: string | null }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [userFilter, setUserFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    // Load users for filtering
    const loadUsers = async () => {
      const { users, error } = await fetchUsers();
      if (error) {
        toast({
          title: "Error fetching users",
          description: "There was a problem loading users for filtering."
        });
      } else {
        setUsers(users);
      }
    };
    
    loadUsers();
  }, []);

  useEffect(() => {
    const loadLogs = async () => {
      setIsLoading(true);
      try {
        const filterUser = userFilter !== "all" ? userFilter : undefined;
        const { logs, count, error } = await fetchSystemLogs(currentPage, pageSize, filterUser);
        
        if (error) {
          toast({
            title: "Error fetching logs",
            description: "There was a problem loading system logs."
          });
        } else {
          // If we have a search query, filter logs on the client side
          let filteredLogs = logs;
          if (searchQuery.trim() !== "") {
            const searchTerm = searchQuery.toLowerCase();
            filteredLogs = logs.filter(log => 
              (log.user_name && log.user_name.toLowerCase().includes(searchTerm)) ||
              log.user_id.toLowerCase().includes(searchTerm) ||
              log.action.toLowerCase().includes(searchTerm) ||
              JSON.stringify(log.details).toLowerCase().includes(searchTerm)
            );
          }
          
          setLogs(filteredLogs);
          setTotalLogs(count);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    loadLogs();
  }, [currentPage, userFilter, searchQuery]);

  const handleUserFilterChange = (value: string) => {
    setUserFilter(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const totalPages = Math.ceil(totalLogs / pageSize);

  return (
    <AdminNavLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-akhanya">System Logs</h1>
          <div className="text-sm text-gray-500">
            Tracking all user actions in the system
          </div>
        </div>
        
        <SystemLogsFilter
          searchQuery={searchQuery}
          userFilter={userFilter}
          onSearchChange={handleSearchChange}
          onUserFilterChange={handleUserFilterChange}
          users={users}
          isLoading={isLoading}
        />
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-8">
          <SystemLogsList logs={logs} isLoading={isLoading} />
          
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t">
              <div className="text-sm text-gray-500">
                Showing {Math.min((currentPage - 1) * pageSize + 1, totalLogs)} - {Math.min(currentPage * pageSize, totalLogs)} of {totalLogs} logs
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={currentPage === 1 || isLoading}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={currentPage >= totalPages || isLoading}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminNavLayout>
  );
};

export default AdminSystemLogs;
