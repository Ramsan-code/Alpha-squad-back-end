import 'dotenv/config';

import app from './src/app.js';
import connectDB from './src/database/connection.js';
// Validate essential environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'JWT_EXPIRES_IN', 'ADMIN_EMAIL', 'ADMIN_PASSWORD'];
const missingEnvVars = requiredEnvVars.filter(key => !process.env[key]);

if (missingEnvVars.length > 0) {
  console.error(`❌ Critical Error: Missing required environment variables: ${missingEnvVars.join(', ')}`);
  console.error('Please verify your .env file.');
  process.exit(1);
}

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
await connectDB();

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});
