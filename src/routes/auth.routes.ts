/**
 * This file defines the authentication routes and their corresponding handlers.
 * Routes map HTTP methods (GET, POST, PUT, DELETE) and URL paths to controller functions.
 * This file will define endpoints like /auth/login, /auth/register, /auth/logout, etc.
 * Routes act as the entry point for HTTP requests and delegate to controllers.
 */
import express, { Router } from 'express';
import { regularRegistrationController, regularLoginController, oauthLoginController } from '../controllers/auth.controller';

const router: Router = express.Router();

// Authentication routes will be added here
// Example: router.post('/register', authController.register);

router.post('/regularRegistration', regularRegistrationController)
router.post('/regularLogin', regularLoginController)
router.post('/oauthLogin', oauthLoginController)

export default router;




