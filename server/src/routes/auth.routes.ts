import express, { Router } from 'express';
import passport from 'passport';
import {
  signupController,
  loginController,
  logoutController,
  getCurrentUserController,
} from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { ENV } from '../config/config.env';

const router: Router = express.Router();

// Regular auth routes
router.post('/signup', signupController);
router.post('/login', loginController);
router.post('/logout', logoutController);
router.get('/me', authenticate, getCurrentUserController);

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    // @ts-ignore - passport attaches user to req
    const { user, token } = req.user || {};
    
    if (!token) {
      return res.redirect(`${ENV.FRONTEND_URL}/auth?error=oauth_failed`);
    }

    // Set token in cookie and redirect
    res.cookie('token', token, {
      httpOnly: true,
      secure: ENV.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.redirect(`${ENV.FRONTEND_URL}/home`);
  }
);

// GitHub OAuth routes
router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get(
  '/github/callback',
  passport.authenticate('github', { session: false }),
  (req, res) => {
    // @ts-ignore - passport attaches user to req
    const { user, token } = req.user || {};
    
    if (!token) {
      return res.redirect(`${ENV.FRONTEND_URL}/auth?error=oauth_failed`);
    }

    // Set token in cookie and redirect
    res.cookie('token', token, {
      httpOnly: true,
      secure: ENV.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.redirect(`${ENV.FRONTEND_URL}/home`);
  }
);

export default router;
