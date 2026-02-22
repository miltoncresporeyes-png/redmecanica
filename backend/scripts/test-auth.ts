// backend/scripts/test-auth.ts
// import fetch from 'node-fetch'; // Using global fetch


const BASE_URL = 'http://localhost:3010/api/auth';

async function testAuth() {
  console.log('🧪 Testing Auth Flow...');

  // 1. Login
  console.log('\n🔸 Attempting Login with admin123...');
  const loginRes = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@redmecanica.cl',
      password: 'admin123'
    })
  });

  if (loginRes.status !== 200) {
    console.error('❌ Login failed:', loginRes.status, await loginRes.text());
    process.exit(1);
  }

  const loginData = await loginRes.json();
  console.log('✅ Login successful!');
  console.log('user:', loginData.user.email);
  console.log('access_token:', loginData.token ? 'Present' : 'Missing');

  const cookies = loginRes.headers.get('set-cookie');
  console.log('Set-Cookie:', cookies);
  
  if (!cookies || !cookies.includes('refresh_token')) {
    console.error('❌ Refresh token cookie missing');
    process.exit(1);
  }
  console.log('✅ Refresh token cookie set');

  const accessToken = loginData.token;

  // 2. Get Profile (Protected)
  console.log('\n🔸 Accessing /me with access token...');
  const meRes = await fetch(`${BASE_URL}/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  if (meRes.status !== 200) {
    console.error('❌ /me failed:', meRes.status, await meRes.text());
    process.exit(1);
  }

  const meData = await meRes.json();
  console.log('✅ /me successful!');
  console.log('Authenticated User:', meData.user.email);

  // 3. Logout
  console.log('\n🔸 Logging out...');
  const logoutRes = await fetch(`${BASE_URL}/logout`, {
    method: 'POST'
  });

  if (logoutRes.status !== 200) {
    console.error('❌ Logout failed:', logoutRes.status);
    process.exit(1);
  }
  
  console.log('✅ Logout successful!');
  console.log('🎉 Auth Test Passed!');
}

testAuth().catch(console.error);
