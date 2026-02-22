import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: 'postgresql://postgres:password@127.0.0.1:5432/redmecanica',
});

async function main() {
  try {
    await client.connect();
    console.log('Connected successfully to PostgreSQL');
    const res = await client.query('SELECT NOW()');
    console.log('Current time from DB:', res.rows[0]);
    await client.end();
  } catch (err) {
    if (err instanceof Error) {
      console.error('Connection error', err.stack);
    } else {
      console.error('Connection error', err);
    }
    process.exit(1);
  }
}

main();
