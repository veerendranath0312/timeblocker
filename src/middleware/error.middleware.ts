/**
 * This file contains the global error handling middleware.
 * This middleware catches all errors that occur in the application and sends
 * appropriate error responses to the client. It should be the last middleware
 * in the middleware chain to catch any unhandled errors.
 */
import { Request, Response, NextFunction } from 'express';

interface ErrorWithStatus extends Error {
  status?: number;
  statusCode?: number;
}

const errorHandler = (
  err: ErrorWithStatus,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Log error stack trace
  console.error('Error:', err.stack);

  // Determine status code (default to 500 if not set)
  const statusCode: number = err.status || err.statusCode || 500;

  // Prepare error response
  const errorResponse: { error: string; stack?: string } = {
    error: err.message || 'Internal server error',
  };

  // Include stack trace in development mode
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  // Send error response
  res.status(statusCode).json(errorResponse);
};

export default errorHandler;
