import 'dotenv/config';
import { defineConfig, env } from '@prisma/config';

export default defineConfig({
  datasource: {
    url: env('DATABASE_URL') || 'postgresql://placeholder:placeholder@localhost:5432/placeholder',
  },
});
