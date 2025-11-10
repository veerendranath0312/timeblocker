// repositories/UserRepository.ts
import { Pool } from "pg";
import { User } from "../models/user.model";
import { UserFactory } from "../models/model.manager";
export class UserRepository {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  /**
   * Creates a new user in the database
   * @param user - User object to insert
   */
  async create(user: User): Promise<void> {
    const query = `
      INSERT INTO users (uid, email, created_at)
      VALUES ($1, $2, $3)
    `;

    // Convert Date to ISO string for SQL
    const values: [string, string, string] = [
      user.uid,
      user.email,
      user.createdAt.toISOString(),
    ];

    try {
      await this.pool.query(query, values);
      console.log("User created successfully");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error creating user:", error.message);
      } else {
        console.error("Unknown error creating user:", error);
      }
      throw error;
    }
  }

  /**
   * Finds a user by UID
   * @param uid - Firebase UID
   * @returns User object or null if not found
   */
  async findByUid(uid: string): Promise<User | null> {
    const query = `
      SELECT uid, email, created_at
      FROM users
      WHERE uid = $1
    `;

    try {
      const result = await this.pool.query(query, [uid]);

      if (result.rows.length === 0) {
        console.log(`ℹ️ No user found for UID: ${uid}`);
        return null;
      }

      const row = result.rows[0];
      const user: User = new UserFactory().createUser(row.uid, row.email);

      return user;
    } catch (error) {
      if (error instanceof Error) {
        console.error("❌ Error finding user by UID:", error.message);
      } else {
        console.error("❌ Unknown error finding user by UID:", error);
      }
      throw error; // Re-throw so service layer or route can handle it
    }
  }
  /**
   * Deletes a user by email
   * @param email - Email of the user to delete
   * @returns boolean indicating whether a user was deleted
   */
  async deleteByEmail(email: string): Promise<boolean> {
    const query = `
      DELETE FROM users
      WHERE email = $1
    `;

    try {
      const result = await this.pool.query(query, [email]);

      if (result.rowCount === 0) {
        console.log(`ℹ️ No user found to delete for email: ${email}`);
        return false;
      }

      console.log(`✅ User deleted successfully for email: ${email}`);
      return true;
    } catch (error) {
      if (error instanceof Error) {
        console.error("❌ Error deleting user:", error.message);
      } else {
        console.error("❌ Unknown error deleting user:", error);
      }
      throw error;
    }
  }

  // You can add more methods like update, delete, etc.
}
