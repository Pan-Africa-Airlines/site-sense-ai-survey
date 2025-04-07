
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash, Edit, Check, X, ChevronDown, ChevronUp } from "lucide-react";
import { SiteListProps } from "./types";
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

const SitesList: React.FC<SiteListProps> = ({
  sites,
  loading,
  editingId,
  editName,
  editType,
  editRegion,
  editContactName,
  editContactPhone,
  editContactEmail,
  setEditName,
  setEditType,
  setEditRegion,
  setEditContactName,
  setEditContactPhone,
  setEditContactEmail,
  startEditing,
  cancelEditing,
  saveEdit,
  handleDeleteSite
}) => {
  const [expandedSite, setExpandedSite] = React.useState<string | null>(null);

  const toggleSiteDetails = (siteId: string) => {
    setExpandedSite(expandedSite === siteId ? null : siteId);
  };

  return (
    <div className="rounded-md border">
      <div className="grid grid-cols-12 gap-4 p-4 font-medium border-b">
        <div className="col-span-4">Site Name</div>
        <div className="col-span-3">Type</div>
        <div className="col-span-3">Region</div>
        <div className="col-span-2">Actions</div>
      </div>
      
      {loading ? (
        <div className="p-4 text-center">Loading sites...</div>
      ) : sites.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground">No sites configured</div>
      ) : (
        sites.map((site) => (
          <React.Fragment key={site.id}>
            <div className="grid grid-cols-12 gap-4 p-4 border-b last:border-0 hover:bg-gray-50">
              {editingId === site.id ? (
                <>
                  <div className="col-span-4">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  </div>
                  <div className="col-span-3">
                    <Input
                      value={editType}
                      onChange={(e) => setEditType(e.target.value)}
                    />
                  </div>
                  <div className="col-span-3">
                    <Select value={editRegion} onValueChange={setEditRegion}>
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
                  <div className="col-span-2 flex space-x-1">
                    <Button size="sm" variant="ghost" onClick={() => saveEdit(site.id)}>
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={cancelEditing}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="col-span-4">{site.name}</div>
                  <div className="col-span-3">{site.type || "-"}</div>
                  <div className="col-span-3">{site.region || "-"}</div>
                  <div className="col-span-2 flex space-x-1">
                    <Button size="sm" variant="ghost" onClick={() => startEditing(site)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDeleteSite(site.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => toggleSiteDetails(site.id)}>
                      {expandedSite === site.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </>
              )}
            </div>
            
            {expandedSite === site.id && (
              <div className="p-4 bg-gray-50 border-b">
                {editingId === site.id ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-gray-500">Contact Name</label>
                      <Input
                        value={editContactName}
                        onChange={(e) => setEditContactName(e.target.value)}
                        placeholder="Contact Name"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Contact Phone</label>
                      <Input
                        value={editContactPhone}
                        onChange={(e) => setEditContactPhone(e.target.value)}
                        placeholder="Contact Phone"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Contact Email</label>
                      <Input
                        value={editContactEmail}
                        onChange={(e) => setEditContactEmail(e.target.value)}
                        placeholder="Contact Email"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-gray-500">Contact Name</label>
                      <p>{site.contact_name || "Not specified"}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Contact Phone</label>
                      <p>{site.contact_phone || "Not specified"}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Contact Email</label>
                      <p>{site.contact_email || "Not specified"}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </React.Fragment>
        ))
      )}
    </div>
  );
};

export default SitesList;
