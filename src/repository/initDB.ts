import { pool } from "../config/pool";

async function initDb() {
  try {
    // 🧩 Inline SQL schema
    const schema = `
      CREATE TABLE IF NOT EXISTS users (
        uid TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    console.log("🏗️  Creating database tables...");
    await pool.query(schema);

    console.log("✅ Database schema created successfully!");
  } catch (error) {
    console.error("❌ Error initializing database:", error);
  } finally {
    await pool.end();
  }
}

initDb();
