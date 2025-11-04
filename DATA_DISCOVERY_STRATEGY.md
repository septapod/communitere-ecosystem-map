# Data Discovery & Ingestion Strategy
## Communitere Ecosystem Map

**Date:** November 4, 2025
**Purpose:** Strategies for discovering, validating, and adding new organizations to the ecosystem map

---

## Overview

Adding 69+ organizations to the database requires a multi-layered discovery approach. Raw web scraping alone will return high volumes of irrelevant results. The most reliable approach combines:

1. **Targeted source identification** (directories, networks, research)
2. **Keyword-based search** (Google, GitHub, nonprofit databases)
3. **AI-assisted research** (Claude for validation & extraction)
4. **Manual verification** (critical for data quality)
5. **Community contribution** (long-term sustainability)

---

## Phase 1: Identify Existing Data Sources

### High-Value Sources (Already Organized Data)

#### 1. **Movement Network Directories**
- **Mutual Aid Network Directory**
  - URL: mutualaida.org/network
  - Data: ~50+ local mutual aid networks
  - Confidence: HIGH (primary source)
  - Scope: Regional/National

- **Local Initiatives Support Corporation (LISC)**
  - URL: lisc.org
  - Data: Community development organizations
  - Confidence: HIGH

- **Grassroots Leadership Network**
  - Data: Network-building organizations
  - Contact: Direct outreach recommended

#### 2. **Nonprofit Databases**
- **GuideStar/Candid (formerly GuideStar)**
  - Coverage: 2M+ nonprofits
  - Data Quality: HIGH (verified by IRS)
  - Access: Free search at guidestar.org
  - Fields: Name, location, mission, financials
  - **Challenge:** Requires filtering by keywords

- **Foundation Center/ProPublica Nonprofit Explorer**
  - URL: projects.propublica.org/nonprofits
  - Coverage: 2M+ 501(c)(3) organizations
  - Data: Name, location, revenue, mission
  - API: Available for bulk queries

- **National Council of Nonprofits**
  - URL: councilofnonprofits.org
  - Coverage: State-based networks
  - Value: Can connect to local organizations

#### 3. **Community Organization Registries**
- **City/County Services Directories**
  - Contact: Municipal community development offices
  - Data: Community-approved organizations
  - Confidence: VERY HIGH (official)

- **United Way 211**
  - URL: 211.org
  - Coverage: Human services across US
  - Data: Searchable database of services/orgs
  - Note: May require API access

#### 4. **Online Networks & Platforms**
- **Facebook Groups** (mutual aid, community organizing)
  - Methodology: Search for public groups
  - Data: Organization announcements, contact info
  - Challenge: Manual extraction required

- **Slack Communities** (tech for good, activist networks)
- **Discord Servers** (organizing communities)
- **Nextdoor** (neighborhood-level organizations)

#### 5. **Research Papers & Reports**
- Stanford Social Innovation Review articles
- Community organizing research databases
- Academic repositories (arXiv, SSRN)

---

## Phase 2: Keyword-Based Discovery

### Search Queries by Category

#### Mutual Aid Networks
```
"mutual aid network" + location
"mutual aid group" + city
"community support" + neighborhood
"aid network" site:facebook.com
```

#### Community Organizing Groups
```
"community organizing" + state
"grassroots organizing"
"base building" organizations
"community group" + location
```

#### Disaster Response Networks
```
"disaster relief" + region
"emergency response community"
"crisis network"
"disaster preparedness" local
```

#### Food Security
```
"community fridge" + city
"community garden" organizations
"food pantry" + location
"food justice network"
```

#### Housing/Shelter
```
"community housing" + location
"mutual housing"
"emergency shelter" network
"housing advocacy"
```

#### Tool Libraries / Sharing Commons
```
"tool library"
"sharing economy" community
"commons" + city
"resource sharing"
```

### Search Platforms to Use

1. **Google Search** + Advanced Operators
   ```
   site:org
   site:edu
   site:github.com
   filetype:pdf
   "powered by" OR "members of" [network name]
   ```

2. **GitHub** (organizations, projects)
   - Query: mutual aid, community organizing, disaster response
   - Value: Tech-enabled orgs, open source projects

3. **LinkedIn** (organization profiles)
   - Search by industry/keywords
   - Export data to spreadsheet

4. **Twitter/X** (hashtag discovery)
   - #MutualAid #CommunityOrganizing #DisasterResponse
   - Follow networks and explore connections

---

## Phase 3: Automated Data Extraction

### Option A: Google Sheets + Web Scraping

**Tools:**
- `=IMPORTXML()` or `=IMPORTHTML()` in Google Sheets
- URLopen Python script for web scraping

**Process:**
1. Identify list pages (directories, registries)
2. Use IMPORTHTML to extract tables
3. Clean and deduplicate data
4. Manual verification

**Example Script:**
```python
import requests
from bs4 import BeautifulSoup
import csv

def scrape_directory(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    orgs = []

    for row in soup.find_all('tr')[1:]:  # Skip header
        cols = row.find_all('td')
        org = {
            'organization': cols[0].text.strip(),
            'location': cols[1].text.strip(),
            'website': cols[2].find('a')['href'] if cols[2].find('a') else '',
            'type': cols[3].text.strip() if len(cols) > 3 else ''
        }
        orgs.append(org)

    return orgs

# Usage
orgs = scrape_directory('https://example.com/directory')
with open('organizations.csv', 'w') as f:
    writer = csv.DictWriter(f, fieldnames=['organization', 'location', 'website', 'type'])
    writer.writeheader()
    writer.writerows(orgs)
```

### Option B: Claude AI-Assisted Research

**Best for:**
- Finding information on individual organizations
- Validating and enriching existing data
- Extracting details from unstructured sources

**Process:**
1. Provide Claude with: organization name + initial details
2. Claude researches: website, mission, services, location
3. Returns structured data matching schema
4. Human verification step
5. Batch import to database

**Example Prompt:**
```
Research the following organization and provide structured data:
- Name: [Organization name]
- Initial location: [city, state]

Please find:
1. Official website
2. Primary mission/description (1-2 sentences)
3. Main services provided
4. Geographic scope (Local/Regional/National/International)
5. Contact information
6. Founded year

Format as JSON matching this schema:
{
  "organization": "",
  "website": "",
  "location": "",
  "description": "",
  "services": "",
  "scope": "",
  "contact": "",
  "founded": ""
}
```

---

## Phase 4: Data Validation & Enrichment

### Verification Checklist

For each organization:
- [ ] Organization name is verified (spelling, legal name)
- [ ] Website is current and active (not redirected)
- [ ] Location is specific (City, State or broader geographic area)
- [ ] Description is accurate per official sources
- [ ] Services listed match what organization currently provides
- [ ] Contact information is recent (within last 6 months)
- [ ] Geographic scope is appropriate for organization type

### Confidence Level Assignment

```
HIGH:
- Verified from official website
- Found in multiple trusted sources
- Organization confirmed data

MEDIUM:
- Found in 2+ secondary sources
- Website last updated within 6 months
- Some details inferred but core data solid

LOW:
- Single source only
- Website outdated or inactive
- Details inferred or partially verified
```

### Enrichment Sources

1. **Geographic Coordinates**
   - Google Maps API (geocoding)
   - OpenStreetMap
   - Mapbox

2. **Category Classification**
   - Review against defined categories
   - Research organizational focus
   - Cross-reference with similar organizations

3. **Tier Assignment**
   - Tier 1: Local/Regional grassroots (direct mutual aid)
   - Tier 2: Regional/National networks (coordination)
   - Tier 3: Infrastructure/Resources (tools, tech, admin)
   - Tier 4: Research/Analysis (studies, policy)
   - Tier 5: Funding/Support (grants, fiscal sponsorship)
   - Tier 6: Advocacy/Movement Building (national campaigns)

---

## Phase 5: Implementation Pipeline

### Recommended Workflow

**Step 1: Research Phase (2-3 weeks)**
1. Build list of 200+ candidate organizations
2. Categorize by source reliability
3. Create intake spreadsheet with all 16 fields
4. Document research sources for each entry

**Step 2: AI Enrichment Phase (1 week)**
1. Use Claude to research gaps in data
2. Validate information accuracy
3. Fill in missing details
4. Format for database import

**Step 3: Human Verification Phase (1-2 weeks)**
1. Spot-check 20% of entries
2. Visit 10-15 websites to verify current info
3. Contact 5-10 organizations for verification
4. Make corrections to dataset

**Step 4: Database Import (1 day)**
1. Convert spreadsheet to CSV
2. Run validation checks
3. Import to Supabase
4. Verify all records loaded

**Step 5: Community Feedback (Ongoing)**
1. Open form for organization self-submission
2. Allow community corrections
3. Track confidence levels
4. Update quarterly

### Data Import Script

```javascript
// import-organizations.js
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const csv = require('csv-parse');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function importOrganizations(csvPath) {
  const fileContent = fs.readFileSync(csvPath, 'utf-8');
  const records = [];

  const parser = csv({
    columns: true,
    skip_empty_lines: true
  });

  parser.on('readable', function() {
    let record;
    while (record = parser.read()) {
      records.push({
        organization: record.organization,
        website: record.website || null,
        location: record.location,
        type: record.type || null,
        description: record.description || null,
        services: record.services || null,
        contact: record.contact || null,
        scope: record.scope || null,
        founded: record.founded || null,
        latitude: parseFloat(record.latitude) || null,
        longitude: parseFloat(record.longitude) || null,
        tier: record.tier || null,
        category: record.category,
        confidence_level: record.confidence_level || 'MEDIUM',
        notes: record.notes || null,
        added_date: new Date().toISOString().split('T')[0]
      });
    }
  });

  parser.on('error', (err) => console.error('Parse error:', err));
  parser.on('end', async () => {
    const { data, error } = await supabase
      .from('organizations')
      .insert(records);

    if (error) {
      console.error('Import error:', error);
    } else {
      console.log(`Successfully imported ${data.length} organizations`);
    }
  });

  parser.write(fileContent);
  parser.end();
}

importOrganizations(process.argv[2]);
```

---

## Phase 6: Community Contribution System

### Self-Submission Form (Future Feature)

Add to ecosystem map UI:

1. **Organization Name** (required)
2. **Website** (optional)
3. **Location** (required)
4. **Primary Focus** (dropdown from categories)
5. **Description** (optional, 2-3 sentences)
6. **Services** (optional)
7. **Contact Email** (for verification)
8. **Submitter Name & Email** (for tracking)
9. **Confidence Notes** (e.g., "Founder of organization")

Upon submission:
- Send verification email to organization contact
- Flag as "pending verification"
- Once verified: publish to map
- Track submission source for accountability

---

## Priority Search Targets

### Tier 1: High-Confidence Sources (Start Here)
1. Mutual Aid America network member directory
2. GuideStar/Candid API for specific keywords
3. State/Local community development councils
4. Major nonprofit networks (Center for Third Sector Leadership)

### Tier 2: Secondary Sources
1. Academic research on mutual aid networks
2. News articles and movement publications
3. Social media organization discovery
4. GitHub community organizing projects

### Tier 3: Manual/Targeted
1. Direct outreach to known networks
2. Snowball sampling (ask orgs for connections)
3. Conference attendee lists
4. Foundation grant recipient lists

---

## Recommended Tools & Resources

### Data Gathering
- **Google Sheets** - organizing research
- **Airtable** - collaborative data entry
- **Python + BeautifulSoup** - web scraping
- **Zapier** - automate data collection

### Analysis & Enrichment
- **Claude API** - data research & validation
- **Google Maps API** - geocoding
- **OpenRefine** - data cleaning & deduplication

### Database & Visualization
- **Supabase** - (already using)
- **Mapbox** - enhanced mapping

### Collaboration
- **GitHub** - version control for organization list
- **Shared Google Doc** - researcher coordination

---

## Timeline Estimate

| Phase | Duration | Output |
|-------|----------|--------|
| Research & Source ID | 2-3 weeks | 200+ candidate orgs |
| Data Gathering | 2-3 weeks | Complete spreadsheet |
| AI Enrichment | 1 week | Populated dataset |
| Verification | 1-2 weeks | Validated dataset |
| Import & Testing | 1 week | Data in database |
| **Total** | **7-10 weeks** | **Ecosystem map loaded** |

---

## Next Steps

1. **This week:** Identify top 5 data sources and begin preliminary research
2. **Next week:** Create master research spreadsheet with 100+ candidate organizations
3. **Week 3:** Begin AI-assisted research for data enrichment
4. **Weeks 4-5:** Human verification phase
5. **Week 6:** Database import and testing
6. **Week 7+:** Community feedback and ongoing additions

---

## Questions to Answer Before Starting

1. **Geographic focus:** US only? International? Specific regions?
2. **Organization scope:** Grassroots only? Include fiscal sponsors, grants, research?
3. **Activity status:** Include defunct organizations for historical context?
4. **Update frequency:** How often to refresh data?
5. **Language:** English-only? Multi-language support?

---

**Document Version:** 1.0
**Last Updated:** November 4, 2025
**Next Review:** After first 50 organizations imported
