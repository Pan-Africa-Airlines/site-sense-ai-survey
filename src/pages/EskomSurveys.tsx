
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "@/components/NavigationBar";
import NetworkingBanner from "@/components/NetworkingBanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Plus, Edit, Download, Eye, ClipboardList, Loader, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface SiteSurvey {
  id: string;
  created_at: string;
  updated_at: string;
  site_name: string;
  region: string;
  date: string;
  site_id: string | null;
  status: string;
}

const EskomSurveys = () => {
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState<SiteSurvey[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [regionFilter, setRegionFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [regions, setRegions] = useState<string[]>([]);

  useEffect(() => {
    fetchSurveys();
  }, [statusFilter, regionFilter, searchQuery]);

  const fetchSurveys = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('site_surveys')
        .select('*');
      
      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }
      
      if (regionFilter) {
        query = query.eq('region', regionFilter);
      }
      
      if (searchQuery) {
        query = query.ilike('site_name', `%${searchQuery}%`);
      }
      
      const { data, error } = await query.order('updated_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        setSurveys(data as SiteSurvey[]);
        
        // Extract unique regions for the filter
        const uniqueRegions = [...new Set(data.map(item => item.region))];
        setRegions(uniqueRegions);
      }
    } catch (error) {
      console.error('Error fetching surveys:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case 'submitted':
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleCreateNew = () => {
    navigate('/eskom-survey');
  };

  const handleEdit = (id: string) => {
    navigate(`/eskom-survey?id=${id}`);
  };

  const clearFilters = () => {
    setStatusFilter("");
    setRegionFilter("");
    setSearchQuery("");
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
          <Button onClick={handleCreateNew} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New Survey
          </Button>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="w-full md:w-1/3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <Input
                placeholder="Search by site name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-full md:w-1/4">
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
            <div className="w-full md:w-1/4">
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
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <Loader className="h-8 w-8 animate-spin text-primary mr-2" />
            <span>Loading surveys...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {surveys.length > 0 ? (
              surveys.map(survey => (
                <Card key={survey.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold truncate">{survey.site_name}</h3>
                      <Badge className={getStatusColor(survey.status)}>
                        {survey.status === 'draft' ? 'Draft' : 'Submitted'}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><span className="font-medium">Region:</span> {survey.region}</p>
                      <p><span className="font-medium">Site ID:</span> {survey.site_id || 'N/A'}</p>
                      <p><span className="font-medium">Date:</span> {survey.date}</p>
                      <p><span className="font-medium">Last Updated:</span> {formatDate(survey.updated_at)}</p>
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
        )}
      </div>
    </div>
  );
};

export default EskomSurveys;
