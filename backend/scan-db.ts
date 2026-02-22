import pg from 'pg';
const { Client } = pg;

const passwords = ['password', 'postgres', 'admin', 'root', '1234', ''];
const dbs = ['redmecanica', 'postgres'];

async function scan() {
  for (const db of dbs) {
    for (const pw of passwords) {
      const connectionString = `postgresql://postgres:${pw}@127.0.0.1:5432/${db}`;
      console.log(`Checking: ${connectionString.replace(pw, '****')}`);
      const client = new Client({ connectionString, connectionTimeoutMillis: 2000 });
      try {
        await client.connect();
        console.log(`✅ SUCCESS! Found credentials for DB: ${db}`);
        await client.end();
        process.exit(0);
      } catch (err: any) {
        if (err.message.includes('autenticación') || err.message.includes('authentication')) {
           console.log(`❌ Auth failed for password: ${pw}`);
        } else if (err.message.includes('no existe el banco de datos') || err.message.includes('database does not exist')) {
           console.log(`❌ DB ${db} does not exist.`);
           break; // No point testing other passwords for this DB if DB doesn't exist
        } else {
           console.log(`❌ Other error: ${err.message}`);
        }
      }
    }
  }
  console.log('🏁 No se encontraron credenciales válidas en puerto 5432.');
}

scan();
