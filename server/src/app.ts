/**
 * This file sets up and configures the Express application instance.
 * It initializes the Express app, configures middleware, and exports the app
 * to be used by the server entry point (server.js).
 * This is the main application configuration file that ties together all
 * routes, middleware, and other Express configurations.
 */
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import passport from './config/passport';
import authRoutes from './routes/auth.routes';
import tasksRoutes from './routes/tasks.routes';
import notesRoutes from './routes/notes.routes';
import metricsRoutes from './routes/metrics.routes';
import eventsRoutes from './routes/events.routes';
import errorHandler from './middleware/error.middleware';
import cookieParser from "cookie-parser";
import { ENV } from './config/config.env';

const app: Express = express();

// Middleware
app.use(cors({
  origin: ENV.FRONTEND_URL,
  credentials: true, // Allow cookies
}));
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use(cookieParser()); // Required for res.cookie
app.use(passport.initialize()); // Initialize Passport

// Routes
app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'TimeBlocker API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/events', eventsRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handling middleware (must be last)
app.use(errorHandler);

export default app;

