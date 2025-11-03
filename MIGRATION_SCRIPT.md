# Data Migration Guide

## Migrating Your 69 Organizations from HTML to Supabase

This guide provides multiple methods to import your organizations data.

## Method 1: Manual Import via Supabase Table Editor (Easiest)

1. Go to your Supabase project dashboard
2. Click on **organizations** table
3. Look for an **Import data** or **Upload CSV** button
4. Export your data as CSV and upload

## Method 2: Node.js Script (Recommended for Full Control)

Create a file called `migrate-data.js`:

```javascript
const { createClient } = require('@supabase/supabase-js');

// Your organizations data from the HTML file
const organizations = [
  {
    category: "Mutual Aid Networks",
    organization: "Mutual Aid LA Network (MALAN)",
    type: "Information hub",
    location: "Los Angeles, CA",
    description: "Founded March 2020, coordinates 10+ mutual aid groups, received 100K hits on fire resource spreadsheet in one day",
    services: "Directory management, real-time spreadsheet coordination, Discord server for volunteers",
    contact: "Instagram-based",
    website: "mutualaidla.org",
    scope: "Regional",
    founded: "2020"
  },
  // ... add all 69 organizations here
];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateData() {
  try {
    console.log(`Migrating ${organizations.length} organizations...`);

    for (const org of organizations) {
      const { data, error } = await supabase
        .from('organizations')
        .insert([org]);

      if (error) {
        console.error(`Error inserting ${org.organization}:`, error);
      } else {
        console.log(`✓ Inserted: ${org.organization}`);
      }
    }

    console.log('Migration complete!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

migrateData();
```

Run with:
```bash
node migrate-data.js
```

## Method 3: Direct SQL Insert

In Supabase SQL Editor, paste something like:

```sql
INSERT INTO organizations (category, organization, type, location, description, services, contact, website, scope, founded)
VALUES
('Mutual Aid Networks', 'Mutual Aid LA Network (MALAN)', 'Information hub', 'Los Angeles, CA', 'Founded March 2020...', 'Directory management...', 'Instagram-based', 'mutualaidla.org', 'Regional', '2020'),
('Mutual Aid Networks', 'Mutual Aid Hub', 'National directory', 'United States', 'Searchable map and directory...', 'Location-based mutual aid...', 'www.mutualaidhub.org', 'mutualaidhub.org', 'National', '2020'),
-- ... repeat for all organizations
;
```

## Method 4: Python Script (If You Prefer Python)

Create `migrate.py`:

```python
from supabase import create_client, Client
from typing import List, Dict

url = "YOUR_SUPABASE_URL"
key = "YOUR_SUPABASE_ANON_KEY"
supabase: Client = create_client(url, key)

organizations = [
    {
        "category": "Mutual Aid Networks",
        "organization": "Mutual Aid LA Network (MALAN)",
        # ... all fields
    },
    # ... more organizations
]

def migrate_organizations(orgs: List[Dict]):
    """Insert organizations into Supabase"""
    for org in orgs:
        try:
            response = supabase.table("organizations").insert(org).execute()
            print(f"✓ {org['organization']}")
        except Exception as e:
            print(f"✗ {org['organization']}: {str(e)}")

if __name__ == "__main__":
    migrate_organizations(organizations)
    print("Migration complete!")
```

Run with:
```bash
pip install supabase
python migrate.py
```

## Adding Coordinates (Optional but Recommended)

For the map to work better, add latitude/longitude. You can:

### Option A: Use Google Maps Geocoding API

```javascript
const NodeGeocoder = require('node-geocoder');

const options = {
  provider: 'google',
  apiKey: 'YOUR_GOOGLE_API_KEY'
};

const geocoder = new NodeGeocoder(options);

async function addCoordinates() {
  const { data: orgs } = await supabase
    .from('organizations')
    .select('*')
    .is('latitude', null);

  for (const org of orgs) {
    const result = await geocoder.geocode(org.location);

    if (result && result[0]) {
      await supabase
        .from('organizations')
        .update({
          latitude: result[0].latitude,
          longitude: result[0].longitude
        })
        .eq('id', org.id);
    }
  }
}
```

### Option B: Manual Entry

1. Open Supabase table editor
2. Click each organization
3. Add latitude/longitude manually
4. You can use Google Maps to find coordinates for key locations

### Option C: Use Free Geocoding

```javascript
const axios = require('axios');

async function geocode(location) {
  const response = await axios.get(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json`
  );

  if (response.data && response.data[0]) {
    return {
      latitude: parseFloat(response.data[0].lat),
      longitude: parseFloat(response.data[0].lon)
    };
  }
  return null;
}
```

## Verifying the Migration

After migration, verify in Supabase:

1. Go to **organizations** table
2. Check row count matches (should be 69)
3. Browse a few records to ensure data is correct
4. Test your app locally to see organizations appear

## Troubleshooting

### "Permission Denied" Error
- Check RLS (Row Level Security) policies
- Make sure your anon key has insert permissions
- Or temporarily disable RLS for migration

### "Invalid Column" Error
- Ensure table has all expected columns
- Check column names match exactly (case-sensitive)
- Verify field types (text vs number vs date)

### "Duplicate Key" Error
- IDs might already exist
- Either delete existing data first or update instead of insert
- Run: `DELETE FROM organizations;` to clear

### App Not Showing Data
- Verify environment variables are set
- Check browser console for errors
- Test Supabase connection in browser console:
  ```javascript
  const { data } = await supabase.from('organizations').select('*').limit(1);
  console.log(data);
  ```

## Next Steps After Migration

1. ✅ Verify all 69 organizations appear in list view
2. ✅ Test search and filter functionality
3. ✅ Add coordinates for proper map display
4. ✅ Deploy to production
5. ✅ Set up authentication for admin editing (future feature)

## Need Help?

Check:
- SETUP_GUIDE.md - General setup instructions
- README.md - Project overview
- Supabase documentation - https://supabase.com/docs
