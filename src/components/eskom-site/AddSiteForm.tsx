
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddSiteFormProps {
  newSiteName: string;
  setNewSiteName: (value: string) => void;
  newSiteType: string;
  setNewSiteType: (value: string) => void;
  newRegion: string;
  setNewRegion: (value: string) => void;
  newContactName: string;
  setNewContactName: (value: string) => void;
  newContactPhone: string;
  setNewContactPhone: (value: string) => void;
  newContactEmail: string;
  setNewContactEmail: (value: string) => void;
  handleAddSite: () => void;
}

const AddSiteForm: React.FC<AddSiteFormProps> = ({
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
  const siteTypes = ["Substation", "Power Station", "Transmission", "Distribution", "Renewable"];
  const regions = ["Gauteng", "Western Cape", "Eastern Cape", "KwaZulu-Natal", "Free State", "Northern Cape", "Limpopo", "Mpumalanga", "North West"];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-md border">
      <div>
        <Label htmlFor="site-name">Site Name</Label>
        <Input
          id="site-name"
          placeholder="Enter site name"
          value={newSiteName}
          onChange={(e) => setNewSiteName(e.target.value)}
        />
      </div>
      
      <div>
        <Label htmlFor="site-type">Site Type</Label>
        <Select value={newSiteType || "select-type"} onValueChange={setNewSiteType}>
          <SelectTrigger>
            <SelectValue placeholder="Select site type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="select-type">Select Type</SelectItem>
            {siteTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="region">Region</Label>
        <Select value={newRegion || "select-region"} onValueChange={setNewRegion}>
          <SelectTrigger>
            <SelectValue placeholder="Select region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="select-region">Select Region</SelectItem>
            {regions.map((region) => (
              <SelectItem key={region} value={region}>
                {region}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="contact-name">Contact Name</Label>
        <Input
          id="contact-name"
          placeholder="Enter contact name"
          value={newContactName}
          onChange={(e) => setNewContactName(e.target.value)}
        />
      </div>
      
      <div>
        <Label htmlFor="contact-phone">Contact Phone</Label>
        <Input
          id="contact-phone"
          placeholder="Enter contact phone"
          value={newContactPhone}
          onChange={(e) => setNewContactPhone(e.target.value)}
        />
      </div>
      
      <div>
        <Label htmlFor="contact-email">Contact Email</Label>
        <Input
          id="contact-email"
          placeholder="Enter contact email"
          value={newContactEmail}
          onChange={(e) => setNewContactEmail(e.target.value)}
        />
      </div>
      
      <div className="md:col-span-2 flex justify-end mt-4">
        <Button onClick={handleAddSite} className="bg-akhanya hover:bg-akhanya-dark">
          <Plus className="h-4 w-4 mr-2" />
          Add Site
        </Button>
      </div>
    </div>
  );
};

export default AddSiteForm;
