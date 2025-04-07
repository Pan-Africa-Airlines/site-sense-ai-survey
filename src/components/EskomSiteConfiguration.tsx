
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AddSiteForm from "./eskom-site/AddSiteForm";
import SitesList from "./eskom-site/SitesList";
import { useEskomSites } from "@/hooks/useEskomSites";

const EskomSiteConfiguration = () => {
  const {
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
  } = useEskomSites();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Eskom Sites Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <AddSiteForm 
            newSiteName={formValues.newSiteName}
            setNewSiteName={(value) => updateFormValue("newSiteName", value)}
            newSiteType={formValues.newSiteType}
            setNewSiteType={(value) => updateFormValue("newSiteType", value)}
            newRegion={formValues.newRegion}
            setNewRegion={(value) => updateFormValue("newRegion", value)}
            newContactName={formValues.newContactName}
            setNewContactName={(value) => updateFormValue("newContactName", value)}
            newContactPhone={formValues.newContactPhone}
            setNewContactPhone={(value) => updateFormValue("newContactPhone", value)}
            newContactEmail={formValues.newContactEmail}
            setNewContactEmail={(value) => updateFormValue("newContactEmail", value)}
            handleAddSite={handleAddSite}
          />

          <SitesList 
            sites={sites}
            loading={loading}
            editingId={editingId}
            editName={formValues.editName}
            editType={formValues.editType}
            editRegion={formValues.editRegion}
            editContactName={formValues.editContactName}
            editContactPhone={formValues.editContactPhone}
            editContactEmail={formValues.editContactEmail}
            setEditName={(value) => updateFormValue("editName", value)}
            setEditType={(value) => updateFormValue("editType", value)}
            setEditRegion={(value) => updateFormValue("editRegion", value)}
            setEditContactName={(value) => updateFormValue("editContactName", value)}
            setEditContactPhone={(value) => updateFormValue("editContactPhone", value)}
            setEditContactEmail={(value) => updateFormValue("editContactEmail", value)}
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
