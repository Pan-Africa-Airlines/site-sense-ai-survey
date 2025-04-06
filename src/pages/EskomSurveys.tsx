
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "@/components/NavigationBar";
import NetworkingBanner from "@/components/NetworkingBanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Plus, Edit, Download, Eye, ClipboardList, Loader, Filter, CheckCircle2, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SiteSurvey {
  id: string;
  created_at: string;
  updated_at: string;
  site_name: string;
  region: string;
  date: string;
  site_id: string | null;
  status: string;
  survey_data: {
    approved?: boolean;
    approvedBy?: string | null;
    approvalDate?: string | null;
  } | null;
}

const EskomSurveys = () => {
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState<SiteSurvey[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [regionFilter, setRegionFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [regions, setRegions] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");

  useEffect(() => {
    fetchSurveys();
  }, [statusFilter, regionFilter, searchQuery, dateFilter]);

  const fetchSurveys = async () => {
    setLoading(true);
    try {
      // Get user ID from localStorage
      const userId = localStorage.getItem("userId") || "";
      
      let query = supabase
        .from('site_surveys')
        .select('*');
      
      // Filter by current user if we have a userId
      if (userId) {
        query = query.eq('user_id', userId);
      }
      
      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }
      
      if (regionFilter) {
        query = query.eq('region', regionFilter);
      }
      
      if (searchQuery) {
        query = query.ilike('site_name', `%${searchQuery}%`);
      }
      
      if (dateFilter) {
        query = query.eq('date', dateFilter);
      }
      
      const { data, error } = await query.order('updated_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        setSurveys(data as SiteSurvey[]);
        
        const uniqueRegions = [...new Set(data.map(item => item.region))];
        setRegions(uniqueRegions);
      }
    } catch (error) {
      console.error('Error fetching surveys:', error);
      toast.error("Failed to load surveys. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string, approved?: boolean) => {
    if (approved) {
      return "bg-green-100 text-green-800 border-green-300";
    }
    
    switch (status) {
      case 'draft':
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case 'submitted':
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusDisplay = (status: string, approved?: boolean) => {
    if (approved) {
      return "Approved";
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  const handleCreateNew = () => {
    navigate('/eskom-survey/new');
  };

  const handleEdit = (id: string) => {
    navigate(`/eskom-survey/${id}`);
  };

  const clearFilters = () => {
    setStatusFilter("");
    setRegionFilter("");
    setSearchQuery("");
    setDateFilter("");
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      <NetworkingBanner
        title="Eskom Site Surveys"
        subtitle="View and manage your Eskom site surveys"
      />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-akhanya">Site Surveys</h2>
            <p className="text-gray-600">
              View and manage your Eskom site survey reports
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setViewMode(viewMode === "grid" ? "table" : "grid")}
              className="flex items-center gap-2"
            >
              {viewMode === "grid" ? "Table View" : "Grid View"}
            </Button>
            <Button onClick={handleCreateNew} className="flex items-center gap-2 bg-akhanya hover:bg-akhanya-dark">
              <Plus className="h-4 w-4" />
              Create New Survey
            </Button>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="w-full md:w-1/4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <Input
                placeholder="Search by site name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-full md:w-1/5">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-1/5">
              <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All regions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All regions</SelectItem>
                  {regions.map(region => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-1/5">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
            <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Clear Filters
            </Button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <Loader className="h-8 w-8 animate-spin text-primary mr-2" />
            <span>Loading surveys...</span>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {surveys.length > 0 ? (
              surveys.map(survey => (
                <Card key={survey.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold truncate">{survey.site_name}</h3>
                      <Badge className={getStatusColor(survey.status, survey.survey_data?.approved)}>
                        {getStatusDisplay(survey.status, survey.survey_data?.approved)}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><span className="font-medium">Region:</span> {survey.region}</p>
                      <p><span className="font-medium">Site ID:</span> {survey.site_id || 'N/A'}</p>
                      <p><span className="font-medium">Date:</span> {survey.date}</p>
                      <p><span className="font-medium">Created:</span> {formatDateTime(survey.created_at)}</p>
                      <p><span className="font-medium">Last Updated:</span> {formatDateTime(survey.updated_at)}</p>
                      {survey.survey_data?.approved && (
                        <p className="flex items-center text-green-600">
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Approved on {survey.survey_data?.approvalDate ? formatDate(survey.survey_data.approvalDate) : 'N/A'}
                        </p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50 p-4 flex justify-between">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(survey.id)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-3 p-12 text-center bg-gray-50 rounded-lg">
                <ClipboardList className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No surveys found</h3>
                <p className="text-gray-500 mb-4">Start by creating your first Eskom site survey</p>
                <Button onClick={handleCreateNew}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Survey
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableCaption>A list of your Eskom site surveys</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Site Name</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {surveys.length > 0 ? (
                  surveys.map((survey) => (
                    <TableRow key={survey.id}>
                      <TableCell className="font-medium">{survey.site_name}</TableCell>
                      <TableCell>{survey.region}</TableCell>
                      <TableCell>{survey.date}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(survey.status, survey.survey_data?.approved)}>
                          {getStatusDisplay(survey.status, survey.survey_data?.approved)}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDateTime(survey.updated_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(survey.id)}>
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <ClipboardList className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-500 mb-4">No surveys found</p>
                      <Button size="sm" onClick={handleCreateNew} className="mx-auto">
                        <Plus className="h-4 w-4 mr-2" />
                        Create New Survey
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EskomSurveys;
