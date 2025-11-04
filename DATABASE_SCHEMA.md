# Database Schema - Communitere Ecosystem Map

**Last Updated:** November 3, 2025
**Schema Version:** 1.0 - Goldilocks Approach (16 Fields)

---

## Overview

This document defines the PostgreSQL database schema for the Communitere Ecosystem Map. The schema uses a "Goldilocks" approach - balanced between functionality and simplicity, supporting quality evaluation without overwhelming data entry.

**Total Fields: 16**
- Core Information: 11 fields
- Classification: 2 fields
- Quality & Verification: 3 fields

---

## SQL to Create Table

Run this SQL in Supabase SQL Editor:

```sql
CREATE TABLE organizations (
  -- Identifiers
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Core Information (11 fields)
  organization TEXT NOT NULL,
  website TEXT,
  location TEXT NOT NULL,
  type TEXT,
  description TEXT,
  services TEXT,
  contact TEXT,
  scope TEXT,
  founded TEXT,
  latitude FLOAT,
  longitude FLOAT,

  -- Classification (2 fields)
  tier TEXT,
  category TEXT NOT NULL,

  -- Quality & Verification (3 fields)
  confidence_level TEXT,
  notes TEXT,
  last_verified DATE,

  -- Audit Trail (3 fields)
  added_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_organizations_category ON organizations(category);
CREATE INDEX idx_organizations_tier ON organizations(tier);
CREATE INDEX idx_organizations_location ON organizations(location);
CREATE INDEX idx_organizations_organization ON organizations(organization);
CREATE INDEX idx_organizations_confidence ON organizations(confidence_level);
CREATE INDEX idx_organizations_scope ON organizations(scope);

-- Enable Row Level Security
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Allow public read access (modify for your security needs)
CREATE POLICY "Enable read access for all users" ON organizations
  FOR SELECT USING (true);
```

---

## Field Definitions

### Core Information Fields (11 fields)

#### `organization` (TEXT, NOT NULL)
**Purpose:** Organization name
**Example:** "Mutual Aid LA Network (MALAN)"
**Required:** Yes
**Notes:** Primary display field, searchable index

#### `website` (TEXT)
**Purpose:** Organization website URL
**Example:** "mutualaidla.org"
**Required:** No
**Notes:** Used for external links in detail view

#### `location` (TEXT, NOT NULL)
**Purpose:** Primary geographic location
**Example:** "Los Angeles, CA" or "Nationwide, United States"
**Required:** Yes
**Notes:** Human-readable format, indexed for search

#### `type` (TEXT)
**Purpose:** Organization type/classification
**Examples:** "Information hub", "Direct mutual aid", "Fiscal sponsor", "Maker space"
**Required:** No
**Notes:** User-facing category, helps understand organization model

#### `description` (TEXT)
**Purpose:** Mission statement and overview
**Example:** "Founded March 2020, coordinates 10+ mutual aid groups across LA County"
**Required:** No
**Notes:** Should be 2-3 sentences, displayed in list view and modal

#### `services` (TEXT)
**Purpose:** Key programs and services
**Example:** "Real-time spreadsheet coordination, volunteer management, disaster response"
**Required:** No
**Notes:** Comma-separated or bulleted list format

#### `contact` (TEXT)
**Purpose:** Contact information
**Example:** "info@example.org", "Instagram: @example", "Phone: 555-1234"
**Required:** No
**Notes:** Can be email, phone, social media, or other

#### `scope` (TEXT)
**Purpose:** Geographic scope of operations
**Valid values:** `Local`, `Regional`, `State`, `National`, `International`, `Continental`, `Local/National`
**Required:** No
**Notes:** Used for filtering in UI, enum-type field

#### `founded` (TEXT)
**Purpose:** Year or date organization was founded
**Example:** "2020" or "March 2020"
**Required:** No
**Notes:** Text field for flexibility with partial dates

#### `latitude` (FLOAT)
**Purpose:** Geographic coordinate for mapping
**Range:** -90 to 90
**Required:** No
**Notes:** Used with longitude for map markers, can be NULL (defaults to US center)

#### `longitude` (FLOAT)
**Purpose:** Geographic coordinate for mapping
**Range:** -180 to 180
**Required:** No
**Notes:** Used with latitude for map markers, can be NULL

---

### Classification Fields (2 fields)

#### `tier` (TEXT)
**Purpose:** Strategic tier classification
**Valid values:** `Tier 1`, `Tier 2`, `Tier 3`, `Tier 4`, `Tier 5`, `Tier 6`
**Required:** No
**Notes:** Tier definitions:
- **Tier 1:** Pop-up mutual aid, established mutual aid organizations, CBOs, BIPOC/Indigenous-led networks
- **Tier 2:** Disaster response innovators, fiscal sponsors, regional networks, maker spaces, tech platforms
- **Tier 3:** Funding ecosystem (trust-based philanthropy, alternative funding, CSR, high net worth)
- **Tier 4:** Adjacent innovators (direct cash transfer, fiscal models, asset mapping, social innovation labs)
- **Tier 5:** Network nodes (Burning Man ecosystem, chef networks, cooperatives, training networks)
- **Tier 6:** Legacy systems (FEMA, Red Cross, UN agencies - for context/contrast)

#### `category` (TEXT, NOT NULL)
**Purpose:** Detailed organizational category
**Examples:** "Mutual Aid Network", "Disaster Response", "Fiscal Sponsor", "Maker Space", "CBOs", "Indigenous-Led Network"
**Required:** Yes
**Notes:** Used for filtering in UI, should align with tier

---

### Quality & Verification Fields (3 fields)

#### `confidence_level` (TEXT)
**Purpose:** Data verification and research quality indicator
**Valid values:** `HIGH`, `MEDIUM`, `LOW`
**Required:** No
**Guidelines:**
- **HIGH:** Verified with primary source (website, direct contact, recent media)
- **MEDIUM:** Verified with secondary sources (third-party directory, recent mention)
- **LOW:** Added from reference but not yet verified, needs follow-up

**Notes:** Helps prioritize which organizations need additional research

#### `notes` (TEXT)
**Purpose:** Red flags, context, verification details, internal notes
**Required:** No
**Examples:**
- "Red flag: Heavy overhead, corporate structure, top-down decision making"
- "Verified by direct contact Jan 2025"
- "Focus on tech-enabled mutual aid, strong board diversity"
- "Needs geographic verification - claims national scope but main operations in Bay Area"

**Notes:**
- Internal use only, not displayed to public
- Use for recording concerns, verification dates, research gaps
- Keep language neutral and operational (avoid ideological framing)

#### `last_verified` (DATE)
**Purpose:** When this organization's information was last checked/verified
**Format:** YYYY-MM-DD
**Required:** No
**Notes:**
- Use to track staleness of data
- Can be used to identify entries needing re-verification
- Null = never verified or unknown

---

### Audit Trail Fields (3 fields)

#### `added_date` (DATE)
**Purpose:** When organization was added to the database
**Default:** Current date (CURRENT_DATE)
**Format:** YYYY-MM-DD
**Notes:** Automatically set unless explicitly provided

#### `created_at` (TIMESTAMP)
**Purpose:** System-level creation timestamp
**Default:** NOW()
**Format:** YYYY-MM-DD HH:MM:SS with timezone
**Notes:** Automatically set by database

#### `updated_at` (TIMESTAMP)
**Purpose:** System-level last modification timestamp
**Default:** NOW()
**Format:** YYYY-MM-DD HH:MM:SS with timezone
**Notes:** Automatically set by database, manually update on edits

---

## Data Entry Guidelines

### Required vs. Optional Fields

**Must be filled (3 required fields):**
1. `organization` - Always name
2. `location` - Always provide location
3. `category` - Always classify

**Strongly recommended (5 fields):**
1. `description` - Core mission info
2. `tier` - Strategic classification
3. `confidence_level` - Data quality indicator
4. `type` - Model type (mutual aid, disaster response, etc.)
5. `services` - What they actually do

**Optional (8 fields):**
- website, contact, scope, founded
- latitude/longitude (highly recommended if possible)
- notes, last_verified, added_date

### Language Guidelines

**Use neutral, operational language:**
- ✅ "Local decision-making authority"
- ❌ "Anti-colonial"

- ✅ "Governance transparency"
- ❌ "Anti-institutional"

- ✅ "Community-led"
- ❌ "Grassroots activist"

- ✅ "Self-determined solutions"
- ❌ "DIY resistance"

**Red Flags (objective, operational framing):**
- ✅ "Overhead >40%, top-down structure"
- ❌ "Neoliberal capitalist organization"

- ✅ "Limited transparency on funding sources"
- ❌ "Suspect corporate ties"

- ✅ "Leadership does not reflect served community"
- ❌ "White savior organization"

---

## Sample Data

```sql
-- Sample Tier 1 mutual aid organization
INSERT INTO organizations (
  organization, location, type, category, tier, scope, website, description,
  services, contact, founded, confidence_level, notes
) VALUES (
  'Mutual Aid LA Network (MALAN)',
  'Los Angeles, CA',
  'Information hub',
  'Mutual Aid Network',
  'Tier 1',
  'Regional',
  'mutualaidla.org',
  'Founded March 2020 to coordinate mutual aid response across LA County. Connects 10+ local mutual aid groups and provides resource management.',
  'Real-time resource coordination, spreadsheet management, volunteer matching, disaster response support',
  'info@mutualaidla.org',
  '2020',
  'HIGH',
  'Verified Jan 2025 via direct contact. Strong local leadership, transparent operations, community-led governance.'
);

-- Sample Tier 2 fiscal sponsor
INSERT INTO organizations (
  organization, location, type, category, tier, scope, website, description,
  services, contact, founded, confidence_level, notes
) VALUES (
  'Tides Foundation',
  'San Francisco, CA',
  'Fiscal sponsor',
  'Fiscal Sponsor',
  'Tier 2',
  'National',
  'tides.org',
  'Major fiscal sponsorship network enabling grassroots projects to access funding and tax-exempt status without nonprofit overhead.',
  'Fiscal sponsorship, grant management, program support, network building',
  'info@tides.org',
  '1976',
  'HIGH',
  'Well-established, widely trusted in movement. Some concerns about scale and personal relationships as primary model.'
);
```

---

## Performance Considerations

### Indexes
The schema includes indexes on:
- `category` - Used for filtering UI
- `tier` - Used for filtering and analysis
- `location` - Used for searching by location
- `organization` - Used for text search
- `confidence_level` - Used for data quality filtering
- `scope` - Used for geographic filtering

These indexes are created automatically in the SQL above.

### Query Patterns
Common queries the app will execute:
```sql
-- Get all organizations
SELECT * FROM organizations WHERE confidence_level IS NOT NULL;

-- Filter by category
SELECT * FROM organizations WHERE category = 'Mutual Aid Network';

-- Search by name
SELECT * FROM organizations WHERE organization ILIKE '%mutual%';

-- Get organizations with coordinates (for map)
SELECT * FROM organizations WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Find organizations needing verification
SELECT * FROM organizations WHERE confidence_level IS NULL OR last_verified < CURRENT_DATE - INTERVAL '6 months';
```

---

## Security & Row Level Security (RLS)

### Current Policy
```sql
-- Allow public read access
CREATE POLICY "Enable read access for all users" ON organizations
  FOR SELECT USING (true);
```

This allows anyone to read all organizations. No authentication required.

### Future Admin Policy (Phase 2)
When adding admin features, implement:
```sql
-- Allow authenticated users to insert/update
CREATE POLICY "Enable insert for authenticated users" ON organizations
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON organizations
  FOR UPDATE
  WHERE (auth.uid() = auth.uid())
  WITH CHECK (auth.role() = 'authenticated');
```

---

## Data Migration

See MIGRATION_SCRIPT.md for multiple methods to import existing data:
1. Supabase Table Editor (CSV upload)
2. Node.js script
3. SQL INSERT statements
4. Python script

---

## Future Schema Extensions

Possible future fields if evaluation system is added:
- `values_alignment_score` (0-16 scale)
- `red_flags_score` (0-24 scale)
- `overhead_percentage` (numeric)
- `leadership_diversity` (categorical)
- `funding_model` (categorical)
- `relevance_category` (SERVE/PARTNER/LEARN/COMPARE)

---

## Questions & Support

For questions about this schema, refer to:
- PROJECT_STATUS.md - Overall project status and decisions
- COMMUNITERE_CONTEXT.md - Organizational context and values
- SETUP_GUIDE.md - Database setup instructions
