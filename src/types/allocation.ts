
import { EskomSite } from "@/types/site";

export interface Engineer {
  id: string;
  name: string;
  status: string;
  vehicle: string;
  allocatedSites?: number;
}

export interface AllocationSite {
  id: number;
  name: string;
  priority: string;
  engineer: string | null;
}

export interface EngineerAllocation {
  id: string;
  user_id: string;
  site_id: string;
  site_name: string;
  region: string;
  address: string;
  priority: string;
  status: string;
  scheduled_date: string;
  created_at: string;
  updated_at: string;
}
