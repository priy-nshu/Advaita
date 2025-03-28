import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export class DatabaseService {
  private static instance: DatabaseService;
  private isConnected = false;

  private constructor() {}

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      return;
    }

    try {
      const uri = process.env.MONGODB_URI;
      if (!uri) {
        throw new Error('MongoDB URI is not defined in environment variables');
      }

      await mongoose.connect(uri);
      this.isConnected = true;
      console.log('Successfully connected to MongoDB.');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log('Disconnected from MongoDB.');
    } catch (error) {
      console.error('Error disconnecting from MongoDB:', error);
      throw error;
    }
  }

  public getConnection(): mongoose.Connection {
    return mongoose.connection;
  }
} 