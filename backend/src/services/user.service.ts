import bcrypt from 'bcryptjs';
import { User, IUser } from '../models/user.model';
import { AppError } from '../middleware/errorHandler';

interface CreateUserData {
  email: string;
  password: string;
  username: string;
}

interface ValidateUserData {
  email: string;
  password: string;
}

interface UpdateUserData extends Partial<Omit<IUser, 'password'>> {
  password?: string;
}

export class UserService {
  private static readonly SALT_ROUNDS = 10;

  async createUser(userData: CreateUserData): Promise<IUser> {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new AppError('Email already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(userData.password, UserService.SALT_ROUNDS);
    const user = new User({
      ...userData,
      password: hashedPassword,
      eloRating: 1000,
      gamesPlayed: 0,
      wins: 0,
      losses: 0
    });

    return user.save();
  }

  async validateUser(credentials: ValidateUserData): Promise<IUser> {
    const user = await User.findOne({ email: credentials.email });
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isValid = await bcrypt.compare(credentials.password, user.password);
    if (!isValid) {
      throw new AppError('Invalid email or password', 401);
    }

    return user;
  }

  async getUserById(id: string): Promise<IUser> {
    const user = await User.findById(id).select('-password');
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  async updateUser(id: string, updateData: UpdateUserData): Promise<IUser> {
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, UserService.SALT_ROUNDS);
    }

    const user = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  async updateUserStats(id: string, isWin: boolean): Promise<IUser> {
    const update = {
      $inc: {
        gamesPlayed: 1,
        wins: isWin ? 1 : 0,
        losses: isWin ? 0 : 1,
        eloRating: isWin ? 10 : -10
      }
    };

    const user = await User.findByIdAndUpdate(
      id,
      update,
      { new: true }
    ).select('-password');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }
} 