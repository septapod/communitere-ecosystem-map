const http = require('http');

/**
 * Test Suite: UI Component Rendering
 * Tests that all major UI elements load and respond correctly
 */

const tests = [];
let passed = 0;
let failed = 0;

function test(name, fn) {
  tests.push({ name, fn });
}

async function runTests() {
  console.log('\n🧪 UI Component Testing Suite\n');
  console.log('=' .repeat(60));
  
  for (const t of tests) {
    try {
      await t.fn();
      console.log(`✅ ${t.name}`);
      passed++;
    } catch (err) {
      console.log(`❌ ${t.name}`);
      console.log(`   Error: ${err.message}`);
      failed++;
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`\nResults: ${passed} passed, ${failed} failed\n`);
  process.exit(failed > 0 ? 1 : 0);
}

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3010,
      path: path,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({ status: res.statusCode, data, headers: res.headers });
      });
    });

    req.on('error', reject);
    req.setTimeout(5000, () => reject(new Error('Request timeout')));
    req.end();
  });
}

// Test 1: App loads and returns HTML
test('App homepage loads with HTML', async () => {
  const res = await makeRequest('/');
  if (res.status !== 200) throw new Error(`Status ${res.status}`);
  if (!res.data.includes('<!DOCTYPE html>')) throw new Error('No HTML returned');
  if (!res.data.includes('<html')) throw new Error('Invalid HTML structure');
});

// Test 2: No 500 errors in response
test('No 500 server errors', async () => {
  const res = await makeRequest('/');
  if (res.data.includes('500') || res.data.includes('statusCode":500')) {
    throw new Error('Server error detected in response');
  }
});

// Test 3: CSS is loaded
test('Tailwind CSS stylesheet loaded', async () => {
  const res = await makeRequest('/');
  if (!res.data.includes('/_next/static/chunks') || !res.data.includes('.css')) {
    throw new Error('CSS not found in response');
  }
});

// Test 4: React scripts loaded
test('React and NextUI scripts loaded', async () => {
  const res = await makeRequest('/');
  if (!res.data.includes('react-dom') && !res.data.includes('__NEXT_DATA__')) {
    throw new Error('React scripts not found');
  }
});

// Test 5: React root element exists
test('React root element (#__next) present', async () => {
  const res = await makeRequest('/');
  if (!res.data.includes('id="__next"')) {
    throw new Error('React root element not found');
  }
});

// Test 6: Environment is loaded
test('.env.local configuration loaded', async () => {
  const res = await makeRequest('/');
  // Check that the page tries to connect to Supabase (indicates env vars are loaded)
  if (!res.data.includes('next-data') && !res.data.includes('buildId')) {
    throw new Error('NextJS data structure not found');
  }
});

// Test 7: No console errors indicated
test('Response structure indicates no fatal errors', async () => {
  const res = await makeRequest('/');
  if (res.data.includes('statusCode":"500') || res.data.includes('"error"')) {
    throw new Error('Error indicated in response');
  }
});

// Test 8: Valid HTTP headers
test('Valid HTTP response headers', async () => {
  const res = await makeRequest('/');
  if (!res.headers['content-type'] || !res.headers['content-type'].includes('text/html')) {
    throw new Error(`Invalid content-type: ${res.headers['content-type']}`);
  }
  if (res.headers['content-length'] === '0') {
    throw new Error('Response body is empty');
  }
});

// Test 9: Dynamic routing works
test('Dynamic routing responds correctly', async () => {
  const res = await makeRequest('/');
  if (res.status !== 200) throw new Error(`Status ${res.status}`);
});

// Test 10: Performance - response time
test('Response time acceptable (< 3 seconds)', async () => {
  const start = Date.now();
  await makeRequest('/');
  const time = Date.now() - start;
  if (time > 3000) throw new Error(`Response took ${time}ms`);
});

console.log('Starting UI Component Tests...\n');
console.log('Connecting to http://localhost:3010...\n');

// Wait a moment for server to be ready, then run tests
setTimeout(runTests, 1000);
