
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
  const [newRegion, setNewRegion] = useState("");
  const [newContactName, setNewContactName] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");
  const [newContactEmail, setNewContactEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editType, setEditType] = useState("");
  const [editRegion, setEditRegion] = useState("");
  const [editContactName, setEditContactName] = useState("");
  const [editContactPhone, setEditContactPhone] = useState("");
  const [editContactEmail, setEditContactEmail] = useState("");

  // Dashboard dummy sites data
  const dummySites = [
    { 
      name: "Eskom Substation A", 
      type: "Substation", 
      region: "Gauteng", 
      contact_name: "John Smith", 
      contact_phone: "011-555-1234", 
      contact_email: "john.smith@eskom.co.za" 
    },
    { 
      name: "Power Station B", 
      type: "Power Station", 
      region: "Western Cape", 
      contact_name: "Sarah Johnson", 
      contact_phone: "021-555-2345", 
      contact_email: "sarah.johnson@eskom.co.za" 
    },
    { 
      name: "Transmission Tower C", 
      type: "Transmission", 
      region: "KwaZulu-Natal", 
      contact_name: "Robert Nkosi", 
      contact_phone: "031-555-3456", 
      contact_email: "robert.nkosi@eskom.co.za" 
    },
    { 
      name: "Distribution Center D", 
      type: "Distribution", 
      region: "Free State", 
      contact_name: "Thabo Mokoena", 
      contact_phone: "051-555-4567", 
      contact_email: "thabo.mokoena@eskom.co.za" 
    },
    { 
      name: "Renewable Plant E", 
      type: "Renewable", 
      region: "Eastern Cape", 
      contact_name: "Lisa Van Wyk", 
      contact_phone: "041-555-5678", 
      contact_email: "lisa.vanwyk@eskom.co.za" 
    },
    { 
      name: "Substation F", 
      type: "Substation", 
      region: "Northern Cape", 
      contact_name: "James Patel", 
      contact_phone: "054-555-6789", 
      contact_email: "james.patel@eskom.co.za" 
    },
    { 
      name: "Johannesburg CBD", 
      type: "Distribution", 
      region: "Gauteng", 
      contact_name: "Michael Ndlovu", 
      contact_phone: "011-555-7890", 
      contact_email: "michael.ndlovu@eskom.co.za" 
    },
    { 
      name: "Pretoria East", 
      type: "Substation", 
      region: "Gauteng", 
      contact_name: "Fatima Ahmed", 
      contact_phone: "012-555-8901", 
      contact_email: "fatima.ahmed@eskom.co.za" 
    },
    { 
      name: "Sandton", 
      type: "Distribution", 
      region: "Gauteng", 
      contact_name: "David Chen", 
      contact_phone: "011-555-9012", 
      contact_email: "david.chen@eskom.co.za" 
    },
    { 
      name: "Midrand", 
      type: "Transmission", 
      region: "Gauteng", 
      contact_name: "Priya Naicker", 
      contact_phone: "011-555-0123", 
      contact_email: "priya.naicker@eskom.co.za" 
    }
  ];

  const fetchSites = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("eskom_sites")
        .select("*")
        .order("name");

      if (error) throw error;

      if (data && data.length > 0) {
        // Sites already exist
        setSites(data as EskomSite[]);
      } else {
        // No sites found, insert dummy sites
        const { data: insertedData, error: insertError } = await supabase
          .from("eskom_sites")
          .insert(dummySites)
          .select();
        
        if (insertError) throw insertError;
        
        if (insertedData) {
          setSites(insertedData as EskomSite[]);
          toast.success("Demo sites loaded successfully");
        }
      }
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
        .insert([{ 
          name: newSiteName, 
          type: newSiteType,
          region: newRegion,
          contact_name: newContactName,
          contact_phone: newContactPhone,
          contact_email: newContactEmail
        }])
        .select();

      if (error) throw error;
      
      setSites([...sites, (data[0] as EskomSite)]);
      setNewSiteName("");
      setNewSiteType("");
      setNewRegion("");
      setNewContactName("");
      setNewContactPhone("");
      setNewContactEmail("");
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
    setEditRegion(site.region || "");
    setEditContactName(site.contact_name || "");
    setEditContactPhone(site.contact_phone || "");
    setEditContactEmail(site.contact_email || "");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName("");
    setEditType("");
    setEditRegion("");
    setEditContactName("");
    setEditContactPhone("");
    setEditContactEmail("");
  };

  const saveEdit = async (id: string) => {
    if (!editName.trim()) {
      toast.error("Site name is required");
      return;
    }

    try {
      const { error } = await supabase
        .from("eskom_sites")
        .update({ 
          name: editName, 
          type: editType,
          region: editRegion,
          contact_name: editContactName,
          contact_phone: editContactPhone,
          contact_email: editContactEmail 
        })
        .eq("id", id);

      if (error) throw error;
      
      setSites(sites.map(site => 
        site.id === id ? { 
          ...site, 
          name: editName, 
          type: editType,
          region: editRegion,
          contact_name: editContactName,
          contact_phone: editContactPhone,
          contact_email: editContactEmail
        } : site
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
            newRegion={newRegion}
            setNewRegion={setNewRegion}
            newContactName={newContactName}
            setNewContactName={setNewContactName}
            newContactPhone={newContactPhone}
            setNewContactPhone={setNewContactPhone}
            newContactEmail={newContactEmail}
            setNewContactEmail={setNewContactEmail}
            handleAddSite={handleAddSite}
          />

          <SitesList 
            sites={sites}
            loading={loading}
            editingId={editingId}
            editName={editName}
            editType={editType}
            editRegion={editRegion}
            editContactName={editContactName}
            editContactPhone={editContactPhone}
            editContactEmail={editContactEmail}
            setEditName={setEditName}
            setEditType={setEditType}
            setEditRegion={setEditRegion}
            setEditContactName={setEditContactName}
            setEditContactPhone={setEditContactPhone}
            setEditContactEmail={setEditContactEmail}
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
