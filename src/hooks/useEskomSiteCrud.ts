
import { supabase } from "@/integrations/supabase/client";
import { EskomSite } from "@/types/site";
import { toast } from "sonner";

export const useEskomSiteCrud = (
  sites: EskomSite[],
  setSites: React.Dispatch<React.SetStateAction<EskomSite[]>>,
  resetNewForm: () => void,
  cancelEditing: () => void
) => {
  const handleAddSite = async (formValues: any) => {
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
      resetNewForm();
      
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

  const saveEdit = async (id: string, formValues: any) => {
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
      
      cancelEditing();
      toast.success("Site updated successfully");
    } catch (error) {
      console.error("Error updating site:", error);
      toast.error("Failed to update site");
    }
  };

  return {
    handleAddSite,
    handleDeleteSite,
    saveEdit
  };
};
