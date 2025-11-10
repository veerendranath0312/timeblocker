import {ENV} from './config.env'
import { Pool } from "pg";

// export const pool = new Pool({
//   connectionString: ENV.DATABASE_URL,
//   ssl: false, // ❌ disable SSL for local Postgres
// });

export const pool = new Pool({
  user: ENV.DB_USER,
  host: ENV.DB_HOST,
  database: ENV.DB_NAME,
  password: ENV.DB_PASSWORD,
  port: Number(ENV.DB_PORT) || 5432,
  ssl: {
    rejectUnauthorized: false, // required for Render Postgres
  },
});