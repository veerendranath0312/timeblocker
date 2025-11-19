import type { Config } from 'drizzle-kit';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.DB_HOST || process.env.PGHOST || '',
    port: Number(process.env.DB_PORT || process.env.PGPORT) || 5432,
    user: process.env.DB_USER || process.env.PGUSER || '',
    password: process.env.DB_PASSWORD || process.env.PGPASSWORD || '',
    database: process.env.DB_NAME || process.env.PGDATABASE || '',
    ssl: {
      rejectUnauthorized: false,
    },
  },
} satisfies Config;

