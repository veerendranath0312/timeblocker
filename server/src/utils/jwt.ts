import jwt, { SignOptions } from 'jsonwebtoken';
import { ENV } from '../config/config.env';

export interface JWTPayload {
  userId: string;
  email: string;
}

/**
 * Generate a JWT token for a user
 */
export const generateToken = (payload: JWTPayload): string => {
  const secret = ENV.JWT_SECRET;
  if (!secret || secret === 'your-secret-key-change-in-production') {
    throw new Error('JWT_SECRET must be set in environment variables');
  }

  return jwt.sign(payload, secret, {
    expiresIn: ENV.JWT_EXPIRES_IN,
  } as SignOptions);
};

/**
 * Verify and decode a JWT token
 */
export const verifyToken = (token: string): JWTPayload => {
  try {
    const secret = ENV.JWT_SECRET;
    if (!secret || secret === 'your-secret-key-change-in-production') {
      throw new Error('JWT_SECRET must be set in environment variables');
    }
    const decoded = jwt.verify(token, secret) as JWTPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

/**
 * Extract token from Authorization header or cookie
 */
export const extractToken = (req: {
  headers?: { authorization?: string };
  cookies?: { token?: string };
}): string | null => {
  // Check Authorization header first
  if (req.headers?.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      return parts[1];
    }
  }

  // Check cookie
  if (req.cookies?.token) {
    return req.cookies.token;
  }

  return null;
};
