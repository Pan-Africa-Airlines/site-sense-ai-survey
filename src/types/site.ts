export interface EskomSite {
  id: string;
  name: string;
  type: string | null;
  created_at?: string;
  region?: string | null;
  contact_name?: string | null;
  contact_phone?: string | null;
  contact_email?: string | null;
  priority?: string;
  engineer?: string | null;
}

export interface ContactDetail {
  name: string;
  cellphone: string;
  email: string;
}

export interface SiteInformationFormData {
  siteName: string;
  siteId: string;
  siteType: string;
  region: string;
  date: string;
  address: string;
  gpsCoordinates: string;
  buildingPhoto: string;
  googleMapView: string;
  buildingName: string;
  buildingType: string;
  floorLevel: string;
  equipmentRoomName: string;
  accessRequirements: string;
  securityRequirements: string;
  vehicleType: string;
  siteContacts: ContactDetail[];
  [key: string]: any;
}
