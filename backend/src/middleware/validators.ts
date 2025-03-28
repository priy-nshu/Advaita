import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters')
});

export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
  try {
    loginSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      next(error);
    }
  }
};

export const validateRegister = (req: Request, res: Response, next: NextFunction): void => {
  try {
    registerSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      next(error);
    }
  }
}; 