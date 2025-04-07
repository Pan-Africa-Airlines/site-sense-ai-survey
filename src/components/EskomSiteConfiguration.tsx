
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Trash, Edit, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Define a type for Eskom sites that matches the database structure
interface Site {
  id: string;
  name: string;
  type: string | null;
  created_at?: string;
}

const EskomSiteConfiguration = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [newSiteName, setNewSiteName] = useState("");
  const [newSiteType, setNewSiteType] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editType, setEditType] = useState("");

  const fetchSites = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("eskom_sites")
        .select("*")
        .order("name");

      if (error) throw error;
      // Use type assertion to ensure data matches our Site interface
      setSites((data || []) as Site[]);
    } catch (error) {
      console.error("Error fetching sites:", error);
      toast.error("Failed to load sites");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSites();
  }, []);

  const handleAddSite = async () => {
    if (!newSiteName.trim()) {
      toast.error("Site name is required");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("eskom_sites")
        .insert([{ name: newSiteName, type: newSiteType }])
        .select();

      if (error) throw error;
      
      setSites([...sites, (data[0] as Site)]);
      setNewSiteName("");
      setNewSiteType("");
      toast.success("Site added successfully");
    } catch (error) {
      console.error("Error adding site:", error);
      toast.error("Failed to add site");
    }
  };

  const handleDeleteSite = async (id: string) => {
    try {
      const { error } = await supabase
        .from("eskom_sites")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      setSites(sites.filter(site => site.id !== id));
      toast.success("Site deleted successfully");
    } catch (error) {
      console.error("Error deleting site:", error);
      toast.error("Failed to delete site");
    }
  };

  const startEditing = (site: Site) => {
    setEditingId(site.id);
    setEditName(site.name);
    setEditType(site.type || "");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName("");
    setEditType("");
  };

  const saveEdit = async (id: string) => {
    if (!editName.trim()) {
      toast.error("Site name is required");
      return;
    }

    try {
      const { error } = await supabase
        .from("eskom_sites")
        .update({ name: editName, type: editType })
        .eq("id", id);

      if (error) throw error;
      
      setSites(sites.map(site => 
        site.id === id ? { ...site, name: editName, type: editType } : site
      ));
      
      setEditingId(null);
      toast.success("Site updated successfully");
    } catch (error) {
      console.error("Error updating site:", error);
      toast.error("Failed to update site");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Eskom Sites Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Site Name"
              value={newSiteName}
              onChange={(e) => setNewSiteName(e.target.value)}
              className="flex-1"
            />
            <Input
              placeholder="Site Type (optional)"
              value={newSiteType}
              onChange={(e) => setNewSiteType(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleAddSite} className="whitespace-nowrap">
              <Plus className="h-4 w-4 mr-2" />
              Add Site
            </Button>
          </div>

          <div className="rounded-md border">
            <div className="grid grid-cols-12 gap-4 p-4 font-medium border-b">
              <div className="col-span-5">Site Name</div>
              <div className="col-span-5">Site Type</div>
              <div className="col-span-2">Actions</div>
            </div>
            
            {loading ? (
              <div className="p-4 text-center">Loading sites...</div>
            ) : sites.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">No sites configured</div>
            ) : (
              sites.map((site) => (
                <div key={site.id} className="grid grid-cols-12 gap-4 p-4 border-b last:border-0">
                  {editingId === site.id ? (
                    <>
                      <div className="col-span-5">
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                        />
                      </div>
                      <div className="col-span-5">
                        <Input
                          value={editType}
                          onChange={(e) => setEditType(e.target.value)}
                        />
                      </div>
                      <div className="col-span-2 flex space-x-1">
                        <Button size="sm" variant="ghost" onClick={() => saveEdit(site.id)}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={cancelEditing}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="col-span-5">{site.name}</div>
                      <div className="col-span-5">{site.type || "-"}</div>
                      <div className="col-span-2 flex space-x-1">
                        <Button size="sm" variant="ghost" onClick={() => startEditing(site)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteSite(site.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EskomSiteConfiguration;
