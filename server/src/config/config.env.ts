// src/config/config.env.ts
import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  // Server
  PORT: process.env.PORT || '3000',
  NODE_ENV: process.env.NODE_ENV || 'development',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  // OAuth - Google
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
  GOOGLE_CALLBACK_URL:
    process.env.GOOGLE_CALLBACK_URL ||
    'http://localhost:3000/api/auth/google/callback',

  // OAuth - GitHub
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || '',
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || '',
  GITHUB_CALLBACK_URL:
    process.env.GITHUB_CALLBACK_URL ||
    'http://localhost:3000/api/auth/github/callback',

  // Frontend URL (for CORS and redirects)
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',

  // Database (supports both DB_* and PG* environment variable naming)
  DATABASE_URL: process.env.DATABASE_URL || '',
  DB_USER: process.env.DB_USER || process.env.PGUSER || '',
  DB_PASSWORD: process.env.DB_PASSWORD || process.env.PGPASSWORD || '',
  DB_HOST: process.env.DB_HOST || process.env.PGHOST || '',
  DB_PORT: Number(process.env.DB_PORT || process.env.PGPORT) || 5432,
  DB_NAME: process.env.DB_NAME || process.env.PGDATABASE || '',
};
