
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash, Edit, Check } from "lucide-react";
import { SiteListProps } from "./types";

const SitesList: React.FC<SiteListProps> = ({
  sites,
  loading,
  editingId,
  editName,
  editType,
  setEditName,
  setEditType,
  startEditing,
  cancelEditing,
  saveEdit,
  handleDeleteSite
}) => {
  return (
    <div className="rounded-md border">
      <div className="grid grid-cols-12 gap-4 p-4 font-medium border-b">
        <div className="col-span-5">Site Name</div>
        <div className="col-span-5">Site Type</div>
        <div className="col-span-2">Actions</div>
      </div>
      
      {loading ? (
        <div className="p-4 text-center">Loading sites...</div>
      ) : sites.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground">No sites configured</div>
      ) : (
        sites.map((site) => (
          <div key={site.id} className="grid grid-cols-12 gap-4 p-4 border-b last:border-0">
            {editingId === site.id ? (
              <>
                <div className="col-span-5">
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </div>
                <div className="col-span-5">
                  <Input
                    value={editType}
                    onChange={(e) => setEditType(e.target.value)}
                  />
                </div>
                <div className="col-span-2 flex space-x-1">
                  <Button size="sm" variant="ghost" onClick={() => saveEdit(site.id)}>
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={cancelEditing}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="col-span-5">{site.name}</div>
                <div className="col-span-5">{site.type || "-"}</div>
                <div className="col-span-2 flex space-x-1">
                  <Button size="sm" variant="ghost" onClick={() => startEditing(site)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDeleteSite(site.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default SitesList;
