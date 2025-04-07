
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { EskomSite } from "@/types/site";
import AddSiteForm from "./eskom-site/AddSiteForm";
import SitesList from "./eskom-site/SitesList";

const EskomSiteConfiguration = () => {
  const [sites, setSites] = useState<EskomSite[]>([]);
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
      setSites((data || []) as EskomSite[]);
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
      
      setSites([...sites, (data[0] as EskomSite)]);
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

  const startEditing = (site: EskomSite) => {
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
          <AddSiteForm 
            newSiteName={newSiteName}
            setNewSiteName={setNewSiteName}
            newSiteType={newSiteType}
            setNewSiteType={setNewSiteType}
            handleAddSite={handleAddSite}
          />

          <SitesList 
            sites={sites}
            loading={loading}
            editingId={editingId}
            editName={editName}
            editType={editType}
            setEditName={setEditName}
            setEditType={setEditType}
            startEditing={startEditing}
            cancelEditing={cancelEditing}
            saveEdit={saveEdit}
            handleDeleteSite={handleDeleteSite}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default EskomSiteConfiguration;
