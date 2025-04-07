
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Save, X, Trash } from "lucide-react";
import { EskomSite } from "@/types/site";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface SitesListProps {
  sites: EskomSite[];
  loading: boolean;
  editingId: string | null;
  editName: string;
  editType: string;
  editRegion: string;
  editContactName: string;
  editContactPhone: string;
  editContactEmail: string;
  setEditName: (value: string) => void;
  setEditType: (value: string) => void;
  setEditRegion: (value: string) => void;
  setEditContactName: (value: string) => void;
  setEditContactPhone: (value: string) => void;
  setEditContactEmail: (value: string) => void;
  startEditing: (site: EskomSite) => void;
  cancelEditing: () => void;
  saveEdit: (id: string) => void;
  handleDeleteSite: (id: string) => void;
}

const SitesList: React.FC<SitesListProps> = ({
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
  const siteTypes = ["Substation", "Power Station", "Transmission", "Distribution", "Renewable"];
  const regions = ["Gauteng", "Western Cape", "Eastern Cape", "KwaZulu-Natal", "Free State", "Northern Cape", "Limpopo", "Mpumalanga", "North West"];
  
  if (loading) {
    return <div className="text-center py-4">Loading sites...</div>;
  }
  
  return (
    <div className="bg-white rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Site Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Region</TableHead>
            <TableHead>Contact Person</TableHead>
            <TableHead>Contact Info</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sites.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                No sites found. Add your first site above.
              </TableCell>
            </TableRow>
          ) : (
            sites.map((site) => (
              <TableRow key={site.id}>
                {editingId === site.id ? (
                  // Editing mode
                  <>
                    <TableCell>
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Select value={editType} onValueChange={setEditType}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {siteTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select value={editRegion} onValueChange={setEditRegion}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          {regions.map((region) => (
                            <SelectItem key={region} value={region}>
                              {region}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        value={editContactName}
                        onChange={(e) => setEditContactName(e.target.value)}
                        className="w-full"
                        placeholder="Contact name"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <Input
                          value={editContactPhone}
                          onChange={(e) => setEditContactPhone(e.target.value)}
                          className="w-full"
                          placeholder="Phone"
                        />
                        <Input
                          value={editContactEmail}
                          onChange={(e) => setEditContactEmail(e.target.value)}
                          className="w-full"
                          placeholder="Email"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={cancelEditing}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => saveEdit(site.id)}
                          className="bg-akhanya hover:bg-akhanya-dark"
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </>
                ) : (
                  // View mode
                  <>
                    <TableCell className="font-medium">{site.name}</TableCell>
                    <TableCell>{site.type || "—"}</TableCell>
                    <TableCell>{site.region || "—"}</TableCell>
                    <TableCell>{site.contact_name || "—"}</TableCell>
                    <TableCell>
                      <div>
                        {site.contact_phone || "—"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {site.contact_email || "—"}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEditing(site)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSite(site.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SitesList;
