
export interface EskomSite {
  id: string;
  name: string;
  type?: string;
  region?: string;
  contact_name?: string;
  contact_phone?: string;
  contact_email?: string;
  created_at?: string;
  priority?: string;
  engineer?: string | null;
}
