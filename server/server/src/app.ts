/**
 * This file sets up and configures the Express application instance.
 * It initializes the Express app, configures middleware, and exports the app
 * to be used by the server entry point (server.js).
 * This is the main application configuration file that ties together all
 * routes, middleware, and other Express configurations.
 */
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import errorHandler from './middleware/error.middleware.js';

const app: Express = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'TimeBlocker API is running' });
});

app.use('/api/auth', authRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handling middleware (must be last)
app.use(errorHandler);

export default app;

