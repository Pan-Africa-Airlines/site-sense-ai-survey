
import { useState } from "react";
import { EskomSite } from "@/types/site";

export const useEskomSiteForm = () => {
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

  const updateFormValue = (key: string, value: string) => {
    setFormValues(prev => ({ ...prev, [key]: value }));
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

  const resetNewForm = () => {
    setFormValues({
      ...formValues,
      newSiteName: "",
      newSiteType: "",
      newRegion: "",
      newContactName: "",
      newContactPhone: "",
      newContactEmail: ""
    });
  };

  return {
    editingId,
    formValues,
    updateFormValue,
    startEditing,
    cancelEditing,
    resetNewForm,
    setEditingId
  };
};
