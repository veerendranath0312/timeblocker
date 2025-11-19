import { db } from '../db';
import { users } from '../db/schema';
import { eq, or } from 'drizzle-orm';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { ENV } from '../config/config.env';

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface OAuthProfile {
  id: string;
  email: string;
  name?: string;
  provider: 'google' | 'github';
}

/**
 * Sign up a new user with email and password
 */
export const signup = async (data: SignupData) => {
  // Check if user already exists
  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, data.email))
    .limit(1);

  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Hash password
  const passwordHash = await hashPassword(data.password);

  // Create user
  const [newUser] = await db
    .insert(users)
    .values({
      name: data.name,
      email: data.email,
      passwordHash,
      emailVerified: false,
      isActive: true,
    })
    .returning({
      id: users.id,
      email: users.email,
      name: users.name,
    });

  // Generate token
  const token = generateToken({
    userId: newUser.id,
    email: newUser.email,
  });

  return {
    user: newUser,
    token,
  };
};

/**
 * Login user with email and password
 */
export const login = async (data: LoginData) => {
  // Find user by email
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, data.email))
    .limit(1);

  if (!user) {
    throw new Error('Invalid email or password');
  }

  if (!user.passwordHash) {
    throw new Error('This account uses OAuth login. Please sign in with your provider.');
  }

  if (!user.isActive) {
    throw new Error('User account is inactive');
  }

  // Verify password
  const isValid = await comparePassword(data.password, user.passwordHash);
  if (!isValid) {
    throw new Error('Invalid email or password');
  }

  // Update last login
  await db
    .update(users)
    .set({ lastLoginAt: new Date() })
    .where(eq(users.id, user.id));

  // Generate token
  const token = generateToken({
    userId: user.id,
    email: user.email,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    token,
  };
};

/**
 * OAuth login - find or create user from OAuth profile
 */
export const oauthLogin = async (profile: OAuthProfile) => {
  const { id, email, name, provider } = profile;

  // Find user by email or provider ID
  const [existingUser] = await db
    .select()
    .from(users)
    .where(
      or(
        eq(users.email, email),
        provider === 'google' ? eq(users.googleId, id) : eq(users.githubId, id)
      )
    )
    .limit(1);

  let user;

  if (existingUser) {
    // Update user with provider ID if not set
    const updateData: any = {
      lastLoginAt: new Date(),
    };

    if (provider === 'google' && !existingUser.googleId) {
      updateData.googleId = id;
      updateData.emailVerified = true; // Google verifies emails
    } else if (provider === 'github' && !existingUser.githubId) {
      updateData.githubId = id;
    }

    if (name && !existingUser.name) {
      updateData.name = name;
    }

    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, existingUser.id))
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
      });

    user = updatedUser;
  } else {
    // Create new user
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        name: name || null,
        emailVerified: provider === 'google', // Google verifies emails
        googleId: provider === 'google' ? id : null,
        githubId: provider === 'github' ? id : null,
        isActive: true,
        lastLoginAt: new Date(),
      })
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
      });

    user = newUser;
  }

  // Generate token
  const token = generateToken({
    userId: user.id,
    email: user.email,
  });

  return {
    user,
    token,
  };
};
