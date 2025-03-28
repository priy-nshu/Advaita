import { Application } from 'express';
import healthRoutes from './healthRoutes';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import quizRoutes from './quizRoutes';

export function setupRoutes(app: Application): void {
  // Health check route
  app.use('/api/health', healthRoutes);

  // Auth routes
  app.use('/api/auth', authRoutes);

  // User routes
  app.use('/api/users', userRoutes);

  // Quiz routes
  app.use('/api/quiz', quizRoutes);
} 