import pg from 'pg';
const { Client } = pg;

const variations = [
  { u: 'postgres', p: 'password', h: '127.0.0.1', port: 5432, db: 'postgres' },
  { u: 'postgres', p: 'password', h: '::1', port: 5432, db: 'postgres' },
  { u: 'postgres', p: 'password', h: 'localhost', port: 5432, db: 'postgres' },
];

async function scan() {
  for (const v of variations) {
    const cs = `postgresql://${v.u}:${v.p}@${v.h}:${v.port}/${v.db}`;
    console.log(`Checking: ${v.u}:***@${v.h}:${v.port}/${v.db}`);
    const client = new Client({ connectionString: cs, connectionTimeoutMillis: 1000 });
    try {
      await client.connect();
      console.log(`✅ SUCCESS! URL: ${cs}`);
      await client.end();
      process.exit(0);
    } catch (err: any) {
      console.log(`❌ ERROR (${v.h}): ${err.message}`);
    }
  }
}

scan();
