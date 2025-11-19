import { Request, Response } from 'express';
import { signup, login, oauthLogin, OAuthProfile } from '../services/auth.service';
import { signupSchema, loginSchema } from '../schemas/auth.schema';
import { ENV } from '../config/config.env';

/**
 * Sign up controller
 */
export const signupController = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request body
    const validatedData = signupSchema.parse(req.body);

    // Create user
    const { user, token } = await signup(validatedData);

    // Set token in HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: ENV.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      message: 'User created successfully',
      user,
      token, // Also send in response for frontend storage if needed
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    res.status(400).json({ error: error.message || 'Signup failed' });
  }
};

/**
 * Login controller
 */
export const loginController = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request body
    const validatedData = loginSchema.parse(req.body);

    // Login user
    const { user, token } = await login(validatedData);

    // Set token in HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: ENV.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      message: 'Login successful',
      user,
      token, // Also send in response for frontend storage if needed
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    res.status(401).json({ error: error.message || 'Login failed' });
  }
};

/**
 * Logout controller
 */
export const logoutController = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie('token');
  res.json({ message: 'Logout successful' });
};

/**
 * Get current user controller
 */
export const getCurrentUserController = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  res.json({
    user: req.user,
  });
};
