
export interface EskomSite {
  id: string;
  name: string;
  type?: string;
  region?: string;
  priority?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  created_at?: string;
  engineer?: string | null;
}
