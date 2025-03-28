import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
import { DatabaseService } from './services/database.service';
import SocketHandler from './socket/socketHandler';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? 'https://your-production-domain.com' 
      : 'http://localhost:4200',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Initialize services
const dbService = DatabaseService.getInstance();
const socketHandler = new SocketHandler(io);

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Connect to database
    await dbService.connect();
    console.log('Connected to MongoDB');

    // Initialize socket handler
    socketHandler.initialize();
    console.log('Socket handler initialized');

    // Start listening
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer(); 