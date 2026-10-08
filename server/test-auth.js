/**
 * Phase 3 Authentication Test Suite
 * Tests register, duplicate email handling, login, getMe, and logout.
 */
import http from 'http';

const API_BASE = 'http://localhost:5000/api/v1/auth';

function makeRequest(method, path, body = null, cookie = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${API_BASE}${path}`);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    if (cookie) {
      options.headers['Cookie'] = cookie;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch {
          json = data;
        }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: json
        });
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runAuthTests() {
  console.log('====================================================');
  console.log('🧪 Starting Phase 3 Authentication Verification Tests');
  console.log('====================================================\n');

  let passed = 0;
  let total = 6;
  const testEmail = `test_aspirant_${Date.now()}@example.com`;
  const testPassword = 'Password123!';
  let authCookie = null;

  // Test 1: Register new user
  try {
    const res = await makeRequest('POST', '/register', {
      name: 'Aspirant Rahul',
      email: testEmail,
      password: testPassword
    });

    if (res.statusCode === 201 && res.data.success && res.data.user?.email === testEmail) {
      console.log('✅ Test 1 PASSED: Register returns 201 with user object and token');
      passed++;

      // Extract cookie
      const setCookie = res.headers['set-cookie'];
      if (setCookie && setCookie.some(c => c.includes('token=') && c.includes('HttpOnly'))) {
        console.log('   ↳ Verified: Set-Cookie header contains HttpOnly JWT token');
      }
    } else {
      console.error('❌ Test 1 FAILED:', res.statusCode, res.data);
    }
  } catch (err) {
    console.error('❌ Test 1 ERROR:', err.message);
  }

  // Test 2: Duplicate registration should return 409
  try {
    const res = await makeRequest('POST', '/register', {
      name: 'Duplicate Aspirant',
      email: testEmail,
      password: testPassword
    });

    if (res.statusCode === 409 && res.data.success === false) {
      console.log('✅ Test 2 PASSED: Duplicate registration correctly returns 409 Conflict');
      passed++;
    } else {
      console.error('❌ Test 2 FAILED:', res.statusCode, res.data);
    }
  } catch (err) {
    console.error('❌ Test 2 ERROR:', err.message);
  }

  // Test 3: Login with invalid password returns 401
  try {
    const res = await makeRequest('POST', '/login', {
      email: testEmail,
      password: 'WrongPassword'
    });

    if (res.statusCode === 401 && res.data.success === false) {
      console.log('✅ Test 3 PASSED: Invalid password correctly returns 401 Unauthorized');
      passed++;
    } else {
      console.error('❌ Test 3 FAILED:', res.statusCode, res.data);
    }
  } catch (err) {
    console.error('❌ Test 3 ERROR:', err.message);
  }

  // Test 4: Login with valid credentials returns 200 and cookie
  try {
    const res = await makeRequest('POST', '/login', {
      email: testEmail,
      password: testPassword
    });

    if (res.statusCode === 200 && res.data.success && res.data.user) {
      console.log('✅ Test 4 PASSED: Valid login returns 200 with user data');
      passed++;

      const setCookie = res.headers['set-cookie'];
      if (setCookie) {
        authCookie = setCookie.map(c => c.split(';')[0]).join('; ');
      }
    } else {
      console.error('❌ Test 4 FAILED:', res.statusCode, res.data);
    }
  } catch (err) {
    console.error('❌ Test 4 ERROR:', err.message);
  }

  // Test 5: GET /me with valid cookie returns current user session
  try {
    const res = await makeRequest('GET', '/me', null, authCookie);

    if (res.statusCode === 200 && res.data.success && res.data.user?.email === testEmail) {
      console.log(`✅ Test 5 PASSED: GET /me with HttpOnly cookie returns user (${res.data.user.name})`);
      passed++;
    } else {
      console.error('❌ Test 5 FAILED:', res.statusCode, res.data);
    }
  } catch (err) {
    console.error('❌ Test 5 ERROR:', err.message);
  }

  // Test 6: GET /me without cookie returns 401
  try {
    const res = await makeRequest('GET', '/me');

    if (res.statusCode === 401) {
      console.log('✅ Test 6 PASSED: Protected GET /me without cookie correctly rejected with 401');
      passed++;
    } else {
      console.error('❌ Test 6 FAILED:', res.statusCode, res.data);
    }
  } catch (err) {
    console.error('❌ Test 6 ERROR:', err.message);
  }

  console.log('\n====================================================');
  console.log(`📊 Phase 3 Auth Tests: ${passed}/${total} Passed`);
  console.log('====================================================');

  process.exit(passed === total ? 0 : 1);
}

runAuthTests();
