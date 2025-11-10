// src/config/config.env.ts
import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  // Firebase
  FIREBASE_API_KEY: process.env.FIREBASE_API_KEY!,
  
  // Server
  PORT: process.env.PORT || "3000",
  NODE_ENV: process.env.NODE_ENV || "development",
  SESSION_EXPIRATION_MS: Number(process.env.SESSION_EXPIRATION_MS) || 60 * 60 * 24 * 5 * 1000, // 5 days

  // Database
  DATABASE_URL: process.env.DATABASE_URL || "",
  DB_USER: process.env.DB_USER || "",
  DB_PASSWORD: process.env.DB_PASSWORD || "",
  DB_HOST: process.env.DB_HOST || "",
  DB_PORT: Number(process.env.DB_PORT) || 5432,
  DB_NAME: process.env.DB_NAME || "",
};
