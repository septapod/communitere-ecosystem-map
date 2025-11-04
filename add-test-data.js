const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://hggujhnzfmnzmtvleouv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnZ3VqaG56Zm1uem10dmxlb3V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxOTc0NzIsImV4cCI6MjA3Nzc3MzQ3Mn0.6sFt3FHSYgYksUSZG7Q5tba7IXxQ-G2JAUGjlPLhaE8';

const supabase = createClient(supabaseUrl, supabaseKey);

const testOrganizations = [
  {
    organization: 'Mutual Aid LA Network (MALAN)',
    location: 'Los Angeles, CA',
    type: 'Information hub',
    category: 'Mutual Aid Network',
    tier: 'Tier 1',
    scope: 'Regional',
    website: 'mutualaidla.org',
    description: 'Founded March 2020 to coordinate mutual aid across LA County. Connects 10+ local mutual aid groups and provides resource management.',
    services: 'Real-time resource coordination, volunteer matching, disaster response',
    contact: 'info@mutualaidla.org',
    founded: '2020',
    confidence_level: 'HIGH',
    notes: 'Verified via direct contact. Strong local leadership, transparent operations.',
    latitude: 34.0522,
    longitude: -118.2437
  },
  {
    organization: 'Bay Area Mutual Aid Network',
    location: 'San Francisco, CA',
    type: 'Direct mutual aid',
    category: 'Mutual Aid Network',
    tier: 'Tier 1',
    scope: 'Regional',
    website: 'bayareamutualaid.org',
    description: 'Grassroots network providing direct mutual aid support across the Bay Area. Community-led decision making.',
    services: 'Direct cash assistance, food distribution, housing support',
    contact: 'contact@bayareamutualaid.org',
    founded: '2019',
    confidence_level: 'HIGH',
    notes: 'Well-established, strong community leadership, transparent.',
    latitude: 37.7749,
    longitude: -122.4194
  },
  {
    organization: 'Vermont Community Response',
    location: 'Burlington, VT',
    type: 'Disaster response network',
    category: 'Disaster Response',
    tier: 'Tier 1',
    scope: 'Regional',
    website: 'vtcommunityresponse.org',
    description: 'Community-based disaster response after flooding events. Farmer-led infrastructure support.',
    services: 'Emergency response, infrastructure repair coordination, farmer support',
    contact: 'info@vtcommunityresponse.org',
    founded: '2023',
    confidence_level: 'MEDIUM',
    notes: 'Newer organization, verified but still building capacity.',
    latitude: 44.4759,
    longitude: -73.2121
  },
  {
    organization: 'Tides Foundation',
    location: 'San Francisco, CA',
    type: 'Fiscal sponsor',
    category: 'Fiscal Sponsor',
    tier: 'Tier 2',
    scope: 'National',
    website: 'tides.org',
    description: 'Major fiscal sponsorship network enabling grassroots projects without nonprofit overhead.',
    services: 'Fiscal sponsorship, grant management, network building',
    contact: 'info@tides.org',
    founded: '1976',
    confidence_level: 'HIGH',
    notes: 'Well-established, widely trusted in movement.',
    latitude: 37.7749,
    longitude: -122.4194
  },
  {
    organization: 'Community Fridge Collective',
    location: 'Multiple cities',
    type: 'Mutual aid infrastructure',
    category: 'Mutual Aid Network',
    tier: 'Tier 2',
    scope: 'National',
    website: 'communityfridge.com',
    description: 'Network of free community fridges and pantries for food sharing and mutual aid.',
    services: 'Community refrigeration units, food distribution network',
    contact: 'hello@communityfridge.com',
    founded: '2020',
    confidence_level: 'HIGH',
    notes: 'Innovative model, strong community participation.',
    latitude: 40.7128,
    longitude: -74.0060
  }
];

async function addTestData() {
  try {
    console.log('📝 Adding sample test data...\n');
    
    for (const org of testOrganizations) {
      const { data, error } = await supabase
        .from('organizations')
        .insert([org]);
      
      if (error) {
        console.error(`❌ Error adding ${org.organization}:`, error);
      } else {
        console.log(`✅ Added: ${org.organization}`);
      }
    }
    
    // Verify count
    const { count, error: countError } = await supabase
      .from('organizations')
      .select('*', { count: 'exact' });
    
    if (!countError) {
      console.log(`\n✅ Total organizations in database: ${count}`);
    }
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

addTestData();
