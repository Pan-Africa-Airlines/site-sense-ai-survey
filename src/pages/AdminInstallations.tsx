
import React, { useEffect, useState } from "react";
import { AdminNavLayout } from "@/components/admin/AdminNavLayout";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download, Eye, Edit, Trash2, Loader } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getFilteredInstallations } from "@/utils/dbHelpers";

interface Installation {
  id: string | number;
  siteName: string;
  siteId: string;
  engineer: string;
  engineerId: string;
  installDate: string;
  status: string;
  priority: string;
  region: string;
}

const AdminInstallations = () => {
  const navigate = useNavigate();
  const [installations, setInstallations] = useState<Installation[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
    if (!adminLoggedIn) {
      navigate("/admin/login");
      return;
    }
    
    fetchInstallations();
  }, [navigate]);
  
  const fetchInstallations = async () => {
    setLoading(true);
    try {
      const data = await getFilteredInstallations();
      setInstallations(data);
    } catch (error) {
      console.error("Error fetching installations:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Filter installations based on selected filters and search query
  const filteredInstallations = installations.filter(installation => {
    // Status filter
    if (statusFilter !== "all" && installation.status !== statusFilter) {
      return false;
    }
    
    // Search query (case-insensitive)
    if (searchQuery && !installation.siteName.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !installation.engineer.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by date range could be added here if needed
    
    return true;
  });
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };
  
  const handleDateFilterChange = (value: string) => {
    setDateFilter(value);
  };
  
  const installationsContent = (
    <div className="container mx-auto px-4 py-8 flex-1">
      <h1 className="text-3xl font-bold mb-6 text-akhanya">Installations</h1>
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center relative flex-1">
              <Search className="absolute left-2 h-4 w-4 text-gray-500" />
              <Input 
                placeholder="Search installations..." 
                className="pl-8" 
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            <div className="flex gap-4">
              <Select 
                value={statusFilter} 
                onValueChange={handleStatusFilterChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="delayed">Delayed</SelectItem>
                </SelectContent>
              </Select>
              <Select 
                value={dateFilter}
                onValueChange={handleDateFilterChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="next-month">Next Month</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader className="h-8 w-8 animate-spin text-akhanya" />
              <span className="ml-3 text-lg">Loading installations...</span>
            </div>
          ) : filteredInstallations.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-lg text-gray-500">
                No installation records found that match your criteria.
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Sites must be configured, allocated to an engineer, and have a completed site survey.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Site Name</TableHead>
                  <TableHead>Engineer</TableHead>
                  <TableHead>Install Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInstallations.map((installation) => (
                  <TableRow key={installation.id.toString()}>
                    <TableCell className="font-medium">{installation.id.toString().substring(0, 8)}</TableCell>
                    <TableCell>{installation.siteName}</TableCell>
                    <TableCell>{installation.engineer}</TableCell>
                    <TableCell>{installation.installDate}</TableCell>
                    <TableCell>
                      <Badge variant={
                        installation.status === 'completed' ? 'default' : 
                        installation.status === 'in-progress' ? 'secondary' : 
                        installation.status === 'scheduled' ? 'outline' : 
                        installation.status === 'pending' ? 'outline' :
                        'destructive'
                      }>
                        {installation.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        installation.priority === 'high' ? 'destructive' : 
                        installation.priority === 'medium' ? 'default' : 
                        'outline'
                      }>
                        {installation.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
  
  return (
    <AdminNavLayout>
      {installationsContent}
    </AdminNavLayout>
  );
};

export default AdminInstallations;
