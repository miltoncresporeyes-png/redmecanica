import 'dotenv/config';
import { defineConfig } from '@prisma/config';

const databaseUrl = process.env.DATABASE_URL?.trim() || 'postgresql://placeholder:placeholder@localhost:5432/placeholder';

export default defineConfig({
  datasource: {
    url: databaseUrl,
  },
});
