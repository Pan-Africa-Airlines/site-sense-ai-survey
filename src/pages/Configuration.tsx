
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "@/components/NavigationBar";
import NetworkingBanner from "@/components/NetworkingBanner";
import FormFieldsConfiguration from "@/components/FormFieldsConfiguration";
import { toast } from "sonner";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Configuration = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("assessment");
  const [savedDrafts] = useLocalStorage<Record<string, any>>("assessmentDrafts", {});
  const [eskomDrafts] = useLocalStorage<Record<string, any>>("eskomSurveyDrafts", {});
  
  useEffect(() => {
    // Check if user is admin
    const isAdmin = localStorage.getItem("adminLoggedIn") === "true";
    const adminUsername = localStorage.getItem("adminUsername");
    
    if (!isAdmin || !adminUsername) {
      toast.error("Unauthorized access. Admin login required.");
      navigate("/login");
    }
  }, [navigate]);

  const handleDeleteDraft = (type: string, draftId: string) => {
    if (type === "assessment") {
      const { [draftId]: _, ...remainingDrafts } = savedDrafts;
      localStorage.setItem("assessmentDrafts", JSON.stringify(remainingDrafts));
      toast.success(`Deleted draft: ${draftId}`);
    } else if (type === "eskom") {
      const { [draftId]: _, ...remainingDrafts } = eskomDrafts;
      localStorage.setItem("eskomSurveyDrafts", JSON.stringify(remainingDrafts));
      toast.success(`Deleted draft: ${draftId}`);
    }
    
    // Force a refresh
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      <NetworkingBanner
        title="System Configuration"
        subtitle="Customize assessment and installation forms to meet your needs"
      />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-akhanya">Form Configuration</h2>
          <p className="text-gray-600">
            Add, delete, or modify form fields to create custom assessment forms
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="assessment">Field Configuration</TabsTrigger>
            <TabsTrigger value="savedDrafts">Assessment Drafts</TabsTrigger>
            <TabsTrigger value="eskomDrafts">Eskom Drafts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="assessment">
            <FormFieldsConfiguration />
          </TabsContent>
          
          <TabsContent value="savedDrafts">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Saved Assessment Drafts</h3>
                {Object.keys(savedDrafts).length === 0 ? (
                  <p className="text-muted-foreground">No saved drafts found.</p>
                ) : (
                  <div className="space-y-4">
                    {Object.keys(savedDrafts).map((draftId) => (
                      <div key={draftId} className="flex justify-between items-center p-3 border rounded-md">
                        <div>
                          <p className="font-medium">{draftId}</p>
                          <p className="text-sm text-muted-foreground">
                            {savedDrafts[draftId].customerName || "No customer name"} - 
                            {savedDrafts[draftId].siteName || "No site name"}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/assessment?draftId=${draftId}`)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteDraft("assessment", draftId)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="eskomDrafts">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Saved Eskom Survey Drafts</h3>
                {Object.keys(eskomDrafts).length === 0 ? (
                  <p className="text-muted-foreground">No saved drafts found.</p>
                ) : (
                  <div className="space-y-4">
                    {Object.keys(eskomDrafts).map((draftId) => (
                      <div key={draftId} className="flex justify-between items-center p-3 border rounded-md">
                        <div>
                          <p className="font-medium">{draftId}</p>
                          <p className="text-sm text-muted-foreground">
                            {eskomDrafts[draftId].siteName || "No site name"} - 
                            {eskomDrafts[draftId].region || "No region"}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/installation?draftId=${draftId}`)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteDraft("eskom", draftId)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Configuration;
