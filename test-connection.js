const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://hggujhnzfmnzmtvleouv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnZ3VqaG56Zm1uem10dmxlb3V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxOTc0NzIsImV4cCI6MjA3Nzc3MzQ3Mn0.6sFt3FHSYgYksUSZG7Q5tba7IXxQ-G2JAUGjlPLhaE8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('🔗 Testing Supabase connection...');
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Connection failed:', error);
      process.exit(1);
    }
    
    console.log('✅ Supabase connection successful!');
    console.log('✅ Organizations table is accessible');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

testConnection();
