import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  username: string;
  eloRating: number;
  gamesPlayed: number;
  wins: number;
  losses: number;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  eloRating: {
    type: Number,
    default: 1000
  },
  gamesPlayed: {
    type: Number,
    default: 0
  },
  wins: {
    type: Number,
    default: 0
  },
  losses: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export const User = mongoose.model<IUser>('User', userSchema); 