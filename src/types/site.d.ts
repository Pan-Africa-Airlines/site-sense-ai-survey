
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
