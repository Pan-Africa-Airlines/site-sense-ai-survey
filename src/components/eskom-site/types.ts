
import { EskomSite } from "@/types/site";

export interface SiteFormProps {
  newSiteName: string;
  setNewSiteName: (name: string) => void;
  newSiteType: string;
  setNewSiteType: (type: string) => void;
  newRegion: string;
  setNewRegion: (region: string) => void;
  newContactName: string;
  setNewContactName: (name: string) => void;
  newContactPhone: string;
  setNewContactPhone: (phone: string) => void;
  newContactEmail: string;
  setNewContactEmail: (email: string) => void;
  handleAddSite: () => void;
}

export interface SiteListProps {
  sites: EskomSite[];
  loading: boolean;
  editingId: string | null;
  editName: string;
  editType: string;
  editRegion: string;
  editContactName: string;
  editContactPhone: string;
  editContactEmail: string;
  setEditName: (name: string) => void;
  setEditType: (type: string) => void;
  setEditRegion: (region: string) => void;
  setEditContactName: (name: string) => void;
  setEditContactPhone: (phone: string) => void;
  setEditContactEmail: (email: string) => void;
  startEditing: (site: EskomSite) => void;
  cancelEditing: () => void;
  saveEdit: (id: string) => void;
  handleDeleteSite: (id: string) => void;
}
