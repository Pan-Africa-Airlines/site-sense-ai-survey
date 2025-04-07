
export interface EskomSite {
  id: string;
  name: string;
  type: string | null;
  created_at?: string;
  region?: string | null;
  contact_name?: string | null;
  contact_phone?: string | null;
  contact_email?: string | null;
}
