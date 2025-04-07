
import React, { useEffect, useState } from "react";
import NavigationBar from "@/components/NavigationBar";
import EngineerSiteList from "@/components/EngineerSiteList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const MyAllocations = () => {
  const [pendingSites, setPendingSites] = useState([]);
  const [completedSites, setCompletedSites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAllocations = async () => {
      try {
        setIsLoading(true);
        
        // Get pending allocations
        const { data: pendingData, error: pendingError } = await supabase
          .from('engineer_allocations')
          .select('*')
          .neq('status', 'completed');
        
        if (pendingError) {
          throw pendingError;
        }
        
        // Get completed allocations
        const { data: completedData, error: completedError } = await supabase
          .from('engineer_allocations')
          .select('*')
          .eq('status', 'completed');
        
        if (completedError) {
          throw completedError;
        }
        
        // Transform data to match the Site interface
        const formatSite = (site) => ({
          id: site.id,
          name: site.site_name,
          priority: site.priority,
          address: site.address || "No address available",
          scheduledDate: site.scheduled_date || "No date available",
          status: site.status,
          distance: site.distance || undefined
        });
        
        setPendingSites(pendingData.map(formatSite));
        setCompletedSites(completedData.map(formatSite));
      } catch (error) {
        console.error("Error fetching allocations:", error);
        toast({
          title: "Error fetching allocations",
          description: "There was a problem loading your site allocations.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAllocations();
  }, [toast]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-akhanya mb-6">My Site Allocations</h1>
        
        <Card className="overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-akhanya to-black h-3"></div>
          <CardHeader>
            <CardTitle className="text-akhanya">Site Allocation Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending" className="mb-8">
              <TabsList className="mb-6">
                <TabsTrigger value="pending">Pending Sites</TabsTrigger>
                <TabsTrigger value="completed">Completed Sites</TabsTrigger>
              </TabsList>
              
              <TabsContent value="pending">
                {isLoading ? (
                  <div className="text-center py-8">Loading site allocations...</div>
                ) : (
                  <EngineerSiteList sites={pendingSites} />
                )}
              </TabsContent>
              
              <TabsContent value="completed">
                {isLoading ? (
                  <div className="text-center py-8">Loading site allocations...</div>
                ) : (
                  <EngineerSiteList sites={completedSites} />
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MyAllocations;
