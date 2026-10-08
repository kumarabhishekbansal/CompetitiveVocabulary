const BASE_URL = 'http://localhost:5000/api/v1/vocabulary';

async function runTests() {
  console.log('====================================================');
  console.log('🧪 Running Phase 2 Verification & Duplicate Test Suite');
  console.log('====================================================\n');

  let passed = 0;
  let total = 0;

  // Test 1: Duplicate rejection for "Abundant"
  total++;
  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        term: 'Abundant',
        englishDefinitions: ['Existing in large quantities'],
        hindiMeanings: ['प्रचुर']
      })
    });
    const data = await res.json();
    if (res.status === 409 && data.isDuplicate === true) {
      console.log('✅ Test 1 PASSED: POST "Abundant" rejected with HTTP 409 Conflict (isDuplicate: true)');
      console.log('   Message:', data.message);
      passed++;
    } else {
      console.error('❌ Test 1 FAILED: Expected 409, got', res.status, data);
    }
  } catch (e) {
    console.error('❌ Test 1 ERROR:', e.message);
  }

  // Test 2: Case-insensitive duplicate rejection for "abundant"
  total++;
  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        term: 'abundant',
        englishDefinitions: ['Plentiful'],
        hindiMeanings: ['भरपूर']
      })
    });
    const data = await res.json();
    if (res.status === 409 && data.isDuplicate === true) {
      console.log('✅ Test 2 PASSED: POST "abundant" rejected with HTTP 409 Conflict (isDuplicate: true)');
      passed++;
    } else {
      console.error('❌ Test 2 FAILED: Expected 409, got', res.status, data);
    }
  } catch (e) {
    console.error('❌ Test 2 ERROR:', e.message);
  }

  // Test 3: Whitespace + uppercase variation "  ABUNDANT  "
  total++;
  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        term: '  ABUNDANT  ',
        englishDefinitions: ['Plentiful'],
        hindiMeanings: ['प्रचुर']
      })
    });
    const data = await res.json();
    if (res.status === 409 && data.isDuplicate === true) {
      console.log('✅ Test 3 PASSED: POST "  ABUNDANT  " rejected with HTTP 409 Conflict');
      passed++;
    } else {
      console.error('❌ Test 3 FAILED: Expected 409, got', res.status, data);
    }
  } catch (e) {
    console.error('❌ Test 3 ERROR:', e.message);
  }

  // Test 4: Check duplicate probe GET /check-duplicate
  total++;
  try {
    const res = await fetch(`${BASE_URL}/check-duplicate?term=Abundant`);
    const data = await res.json();
    if (res.status === 200 && data.isDuplicate === true) {
      console.log('✅ Test 4 PASSED: GET /check-duplicate?term=Abundant returned isDuplicate: true');
      passed++;
    } else {
      console.error('❌ Test 4 FAILED: Expected isDuplicate: true, got', data);
    }
  } catch (e) {
    console.error('❌ Test 4 ERROR:', e.message);
  }

  // Test 5: Verify System Item Immutability (Ownership Protection)
  total++;
  try {
    // Fetch first system word ID
    const listRes = await fetch(`${BASE_URL}?limit=1`);
    const listData = await listRes.json();
    const systemWordId = listData.data[0]._id;

    // Attempt to update without ownership
    const updateRes = await fetch(`${BASE_URL}/${systemWordId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ term: 'Hacked' })
    });
    const updateData = await updateRes.json();
    if (updateRes.status === 403) {
      console.log('✅ Test 5 PASSED: Unauthorized edit on system word rejected with HTTP 403 Forbidden');
      passed++;
    } else {
      console.error('❌ Test 5 FAILED: Expected 403, got', updateRes.status, updateData);
    }
  } catch (e) {
    console.error('❌ Test 5 ERROR:', e.message);
  }

  // Test 6: Verify Database Record Count is Exactly 50
  total++;
  try {
    const listRes = await fetch(`${BASE_URL}?limit=100`);
    const listData = await listRes.json();
    if (listData.total === 50) {
      console.log(`✅ Test 6 PASSED: Verified exactly ${listData.total} system vocabulary records in Atlas DB`);
      passed++;
    } else {
      console.error(`❌ Test 6 FAILED: Expected 50 total records, got ${listData.total}`);
    }
  } catch (e) {
    console.error('❌ Test 6 ERROR:', e.message);
  }

  console.log('\n====================================================');
  console.log(`📊 Test Results: ${passed}/${total} Tests Passed`);
  console.log('====================================================');

  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests();
