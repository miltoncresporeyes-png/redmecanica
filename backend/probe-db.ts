import pg from 'pg';
const { Client } = pg;

const variations = [
  'postgresql://postgres:password@localhost:5432/redmecanica',
  'postgresql://postgres:postgres@localhost:5432/redmecanica',
  'postgresql://postgres@localhost:5432/redmecanica',
  'postgresql://postgres:password@127.0.0.1:5433/redmecanica',
  'postgresql://postgres:postgres@127.0.0.1:5433/redmecanica',
];

async function test() {
  for (const connectionString of variations) {
    console.log(`Testing: ${connectionString}`);
    const client = new Client({ connectionString });
    try {
      await client.connect();
      console.log('✅ SUCCESS!');
      await client.end();
      process.exit(0);
    } catch (err: any) {
      console.log(`❌ FAILED: ${err.message}`);
    }
  }
}

test();
