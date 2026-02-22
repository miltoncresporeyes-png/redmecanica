const startTime = Date.now();

async function test() {
  const baseUrl = 'http://localhost:3010/api/providers';

  console.log('1. Fetching seeded provider (mech-1)...');
  try {
    const res = await fetch(`${baseUrl}/mech-1`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    console.log('Success:', data.id, data.type, data.user?.name);
  } catch (e) {
    console.error('Failed to fetch provider:', e.message);
  }

  console.log('\n2. Registering new provider (user-1 -> Towing)...');
  try {
    const res = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'user-1',
        type: 'TOWING',
        bio: 'Gruas 24/7',
        vehicle: 'Grua Mack',
        licensePlate: 'GR-UA-99'
      })
    });
    
    const data = await res.json();
    if (!res.ok) {
        if (data.error === 'User is already a service provider') {
            console.log('Provider already exists (expected if re-running):', data.error);
        } else {
            throw new Error(`Status ${res.status}: ${JSON.stringify(data)}`);
        }
    } else {
        console.log('Success:', data.id, data.type, data.status);
    }

  } catch (e) {
    console.error('Failed to register provider:', e.message);
  }
}

test();
