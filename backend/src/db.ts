import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL || "postgresql://placeholder:placeholder@localhost:5432/placeholder";

const forceInsecureTls = process.env.PG_SSL_REJECT_UNAUTHORIZED === 'false';
const requiresSsl = /sslmode=(require|verify-ca|verify-full)/i.test(connectionString);

const pool = new Pool({
  connectionString,
  max: 10,
  // Abrir una conexion TLS a la base cuesta ~1,5 s: se mantienen abiertas (antes se cerraban a los 30 s de calma
  // y la siguiente visita pagaba el handshake) y con keep-alive para que el proxy no las corte.
  idleTimeoutMillis: 10 * 60 * 1000,
  connectionTimeoutMillis: 10000,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
  ...(requiresSsl || forceInsecureTls
    ? {
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {}),
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });

/**
 * Deja conexiones calientes: al arrancar abre varias en paralelo y despues las "toca" cada 30 s.
 * Asi la primera visita tras un periodo sin trafico no espera el handshake con la base.
 */
const WARM_CONNECTIONS = 4;
const warmPool = async () => {
  await Promise.all(Array.from({ length: WARM_CONNECTIONS }, () => pool.query('SELECT 1')));
};
export const startPoolWarmup = () => {
  warmPool().catch(() => { /* la app sigue funcionando; se reintenta en el siguiente ciclo */ });
  const timer = setInterval(() => { warmPool().catch(() => {}); }, 30_000);
  timer.unref();
};
