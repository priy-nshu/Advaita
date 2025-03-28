import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import { connectDB } from './config/database';
import userRoutes from './routes/userRoutes';
import quizRoutes from './routes/quizRoutes';
import SocketHandler from './socket/socketHandler';

config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:4200'
}));
app.use(express.json());

// Routes
app.use('/api/auth', userRoutes);
app.use('/api/quiz', quizRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

// Socket.IO setup
const socketHandler = new SocketHandler(io);
socketHandler.initialize();

// Start server
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 