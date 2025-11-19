import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractToken } from '../utils/jwt';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      name?: string | null;
    }
  }
}

/**
 * Authentication middleware - verifies JWT token and attaches user to request
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractToken(req);

    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    // Verify token
    const payload = verifyToken(token);

    // Get user from database
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        isActive: users.isActive,
      })
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1);

    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    if (!user.isActive) {
      res.status(401).json({ error: 'User account is inactive' });
      return;
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name || undefined,
    };

    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
