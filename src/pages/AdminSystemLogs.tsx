import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Table } from "@/components/ui/table";
import { Download, Filter } from "lucide-react";

const AdminSystemLogs = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [logType, setLogType] = useState<string>("all");

  // Mock log data
  const mockLogs = [
    { id: 1, timestamp: "2023-05-10 08:23:15", user: "admin", action: "User Login", details: "Admin user logged in", level: "info" },
    { id: 2, timestamp: "2023-05-10 09:45:32", user: "system", action: "Backup Created", details: "Automated system backup completed", level: "info" },
    { id: 3, timestamp: "2023-05-11 14:12:05", user: "john.doe", action: "Assessment Created", details: "New site assessment #1234 created", level: "info" },
    { id: 4, timestamp: "2023-05-12 11:30:18", user: "system", action: "Error", details: "Failed to connect to database", level: "error" },
    { id: 5, timestamp: "2023-05-12 16:05:43", user: "jane.smith", action: "Installation Updated", details: "Installation #5678 status changed to 'completed'", level: "info" },
  ];

  return (
    <AdminLayout>
      <Container>
        <div className="space-y-4 py-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">System Logs</h1>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" /> Export Logs
            </Button>
          </div>
          <p className="text-muted-foreground">
            View and filter system logs to track user activity and system events.
          </p>

          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <DatePicker date={startDate} onDateChange={setStartDate} placeholder="Select start date" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">End Date</label>
                <DatePicker date={endDate} onDateChange={setEndDate} placeholder="Select end date" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Log Type</label>
                <select 
                  className="w-full p-2 border rounded-md" 
                  value={logType}
                  onChange={(e) => setLogType(e.target.value)}
                >
                  <option value="all">All Logs</option>
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button className="w-full md:w-auto">
                  <Filter className="h-4 w-4 mr-2" /> Apply Filters
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">Timestamp</th>
                    <th className="px-4 py-2 text-left">User</th>
                    <th className="px-4 py-2 text-left">Action</th>
                    <th className="px-4 py-2 text-left">Details</th>
                    <th className="px-4 py-2 text-left">Level</th>
                  </tr>
                </thead>
                <tbody>
                  {mockLogs.map((log) => (
                    <tr key={log.id} className="border-b">
                      <td className="px-4 py-2">{log.timestamp}</td>
                      <td className="px-4 py-2">{log.user}</td>
                      <td className="px-4 py-2">{log.action}</td>
                      <td className="px-4 py-2">{log.details}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          log.level === 'error' ? 'bg-red-100 text-red-800' : 
                          log.level === 'warning' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {log.level}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card>
        </div>
      </Container>
    </AdminLayout>
  );
};

export default AdminSystemLogs;