
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { SiteFormProps } from "./types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// South African regions
const saRegions = [
  "Gauteng",
  "Western Cape",
  "Eastern Cape",
  "KwaZulu-Natal",
  "Free State",
  "North West",
  "Mpumalanga",
  "Limpopo",
  "Northern Cape"
];

const AddSiteForm: React.FC<SiteFormProps> = ({
  newSiteName,
  setNewSiteName,
  newSiteType,
  setNewSiteType,
  newRegion,
  setNewRegion,
  newContactName,
  setNewContactName,
  newContactPhone,
  setNewContactPhone,
  newContactEmail,
  setNewContactEmail,
  handleAddSite
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          placeholder="Site Name"
          value={newSiteName}
          onChange={(e) => setNewSiteName(e.target.value)}
        />
        <Input
          placeholder="Site Type (optional)"
          value={newSiteType}
          onChange={(e) => setNewSiteType(e.target.value)}
        />
        
        <Select value={newRegion} onValueChange={setNewRegion}>
          <SelectTrigger>
            <SelectValue placeholder="Select Region" />
          </SelectTrigger>
          <SelectContent>
            {saRegions.map((region) => (
              <SelectItem key={region} value={region}>
                {region}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          placeholder="Contact Name"
          value={newContactName}
          onChange={(e) => setNewContactName(e.target.value)}
        />
        <Input
          placeholder="Contact Phone"
          value={newContactPhone}
          onChange={(e) => setNewContactPhone(e.target.value)}
        />
        <Input
          placeholder="Contact Email"
          value={newContactEmail}
          onChange={(e) => setNewContactEmail(e.target.value)}
        />
      </div>
      
      <Button onClick={handleAddSite} className="whitespace-nowrap w-full md:w-auto">
        <Plus className="h-4 w-4 mr-2" />
        Add Site
      </Button>
    </div>
  );
};

export default AddSiteForm;
