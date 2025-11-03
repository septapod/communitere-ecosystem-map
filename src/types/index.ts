export type Scope = 'Local' | 'Regional' | 'State' | 'National' | 'International' | 'Continental' | 'Local/National';

export interface Organization {
  id?: string;
  category: string;
  organization: string;
  type: string;
  location: string;
  description: string;
  services: string;
  contact: string;
  website: string;
  scope: Scope;
  founded: string;
  latitude?: number;
  longitude?: number;
  created_at?: string;
  updated_at?: string;
}

export interface MapMarker extends Organization {
  id: string;
}
