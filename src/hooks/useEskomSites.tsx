
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { EskomSite } from "@/types/site";
import { toast } from "sonner";

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

export const useEskomSites = () => {
  const [sites, setSites] = useState<EskomSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState({
    newSiteName: "",
    newSiteType: "",
    newRegion: "",
    newContactName: "",
    newContactPhone: "",
    newContactEmail: "",
    editName: "",
    editType: "",
    editRegion: "",
    editContactName: "",
    editContactPhone: "",
    editContactEmail: ""
  });

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

  const handleAddSite = async () => {
    const { newSiteName, newSiteType, newRegion, newContactName, newContactPhone, newContactEmail } = formValues;
    
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
      
      // Reset form
      setFormValues({
        ...formValues,
        newSiteName: "",
        newSiteType: "",
        newRegion: "",
        newContactName: "",
        newContactPhone: "",
        newContactEmail: ""
      });
      
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
    setFormValues({
      ...formValues,
      editName: site.name,
      editType: site.type || "",
      editRegion: site.region || "",
      editContactName: site.contact_name || "",
      editContactPhone: site.contact_phone || "",
      editContactEmail: site.contact_email || ""
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setFormValues({
      ...formValues,
      editName: "",
      editType: "",
      editRegion: "",
      editContactName: "",
      editContactPhone: "",
      editContactEmail: ""
    });
  };

  const saveEdit = async (id: string) => {
    const { editName, editType, editRegion, editContactName, editContactPhone, editContactEmail } = formValues;
    
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

  const updateFormValue = (key: string, value: string) => {
    setFormValues(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    fetchSites();
  }, []);

  return {
    sites,
    loading,
    editingId,
    formValues,
    updateFormValue,
    handleAddSite,
    handleDeleteSite,
    startEditing,
    cancelEditing,
    saveEdit
  };
};
