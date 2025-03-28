import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

export function setupMiddleware(app: express.Application): void {
  // CORS
  app.use(cors());

  // Body parser
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  });
  app.use(limiter);
} 