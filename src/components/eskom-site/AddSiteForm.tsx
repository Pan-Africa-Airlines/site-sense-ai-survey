
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { SiteFormProps } from "./types";

const AddSiteForm: React.FC<SiteFormProps> = ({
  newSiteName,
  setNewSiteName,
  newSiteType,
  setNewSiteType,
  handleAddSite
}) => {
  return (
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
  );
};

export default AddSiteForm;
