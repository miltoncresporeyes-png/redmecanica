import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL || "postgresql://placeholder:placeholder@localhost:5432/placeholder";

const forceInsecureTls = process.env.PG_SSL_REJECT_UNAUTHORIZED === 'false';
const requiresSsl = /sslmode=(require|verify-ca|verify-full)/i.test(connectionString);

const pool = new Pool({
  connectionString,
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
