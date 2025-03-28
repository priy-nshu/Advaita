import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { generateToken } from '../utils/jwt';
import { AppError } from '../middleware/errorHandler';

const userService = new UserService();

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const user = await userService.validateUser({ email, password });
    const token = generateToken(user);
    res.json({ token, user: { id: user._id, email: user.email, username: user.username } });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export async function register(req: Request, res: Response) {
  try {
    const { email, password, username } = req.body;
    const user = await userService.createUser({ email, password, username });
    const token = generateToken(user);
    res.status(201).json({ token, user: { id: user._id, email: user.email, username: user.username } });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export function logout(_req: Request, res: Response) {
  res.json({ message: 'Logged out successfully' });
} 