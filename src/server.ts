import app from './app';
import {ENV} from './config/config.env'
import './repository/initDB'
// Start server
const server = app.listen(ENV.PORT, () => {
  console.log(`Server is running on port ${ENV.PORT} in ${ENV.NODE_ENV} mode`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

