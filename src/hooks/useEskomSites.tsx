
import { useEskomSitesData } from "./useEskomSitesData";
import { useEskomSiteForm } from "./useEskomSiteForm";
import { useEskomSiteCrud } from "./useEskomSiteCrud";

export const useEskomSites = () => {
  const { sites, loading, setSites, refreshSites } = useEskomSitesData();
  const { 
    editingId, 
    formValues, 
    updateFormValue, 
    startEditing, 
    cancelEditing, 
    resetNewForm 
  } = useEskomSiteForm();
  
  const { 
    handleAddSite: addSite, 
    handleDeleteSite, 
    saveEdit: saveSiteEdit 
  } = useEskomSiteCrud(
    sites,
    setSites,
    resetNewForm,
    cancelEditing
  );

  // Wrapper function to pass the current form values to the CRUD handler
  const handleAddSite = () => {
    addSite(formValues);
  };

  // Wrapper function to pass the current form values to the CRUD handler
  const saveEdit = (id: string) => {
    saveSiteEdit(id, formValues);
  };

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
    saveEdit,
    refreshSites
  };
};
