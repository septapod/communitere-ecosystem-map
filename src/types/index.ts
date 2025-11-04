export type Scope = 'Local' | 'Regional' | 'State' | 'National' | 'International' | 'Continental' | 'Local/National';

export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export type Tier = 'Tier 1' | 'Tier 2' | 'Tier 3' | 'Tier 4' | 'Tier 5' | 'Tier 6';

export interface Organization {
  // Core identification
  id?: string;
  organization: string;

  // Basic information
  website?: string;
  location: string;
  type: string;
  description: string;
  services?: string;
  contact?: string;

  // Classification
  category: string;
  scope: Scope;
  founded?: string;
  tier?: Tier;

  // Geographic data
  latitude?: number;
  longitude?: number;

  // Quality & verification (Goldilocks fields)
  confidence_level?: ConfidenceLevel;
  notes?: string;
  last_verified?: string;

  // Audit trail
  added_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MapMarker extends Organization {
  id: string;
}
