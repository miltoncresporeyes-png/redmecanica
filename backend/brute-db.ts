import pg from 'pg';
const { Client } = pg;

const passes = ['', 'postgres', 'admin123', 'admin', '123456', 'root', '1234'];

async function scan() {
  for (const p of passes) {
    const cs = `postgresql://postgres:${p}@127.0.0.1:5432/postgres`;
    console.log(`Checking: postgres:***@127.0.0.1:5432/postgres (pass: ${p || 'empty'})`);
    const client = new Client({ connectionString: cs, connectionTimeoutMillis: 1000 });
    try {
      await client.connect();
      console.log(`✅ SUCCESS! Pass: ${p || 'empty'}`);
      await client.end();
      process.exit(0);
    } catch (err: any) {
      console.log(`❌ FAIL: ${err.message}`);
    }
  }
}

scan();
