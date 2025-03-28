import dotenv from 'dotenv';

dotenv.config();

export const environment = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/triwizard-quiz',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:4200'
}; 