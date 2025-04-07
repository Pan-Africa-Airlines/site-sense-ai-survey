
import { EskomSite } from "@/types/site";

export interface SiteFormProps {
  newSiteName: string;
  setNewSiteName: (name: string) => void;
  newSiteType: string;
  setNewSiteType: (type: string) => void;
  handleAddSite: () => void;
}

export interface SiteListProps {
  sites: EskomSite[];
  loading: boolean;
  editingId: string | null;
  editName: string;
  editType: string;
  setEditName: (name: string) => void;
  setEditType: (type: string) => void;
  startEditing: (site: EskomSite) => void;
  cancelEditing: () => void;
  saveEdit: (id: string) => void;
  handleDeleteSite: (id: string) => void;
}
