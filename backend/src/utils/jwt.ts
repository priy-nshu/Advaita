import jwt, { SignOptions, VerifyOptions, JwtPayload, TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { IUser } from '../models/user.model';
import { getPrivateKey, getPublicKey } from '../config/keys/jwtKeys';
import { AppError } from '../middleware/errorHandler';

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

interface TokenPayload extends JwtPayload {
  id: string;
  email: string;
  username: string;
}

export class JWTError extends AppError {
  constructor(message: string) {
    super(message, 401);
  }
}

export const generateToken = (user: IUser): string => {
  const payload: TokenPayload = { 
    id: user._id.toString(),
    email: user.email,
    username: user.username
  };
  
  const options = { 
    expiresIn: JWT_EXPIRES_IN,
    algorithm: 'RS256'
  } as SignOptions;

  try {
    return jwt.sign(payload, getPrivateKey(), options);
  } catch (error) {
    throw new JWTError('Failed to generate token');
  }
};

export const verifyToken = (token: string): TokenPayload => {
  const options: VerifyOptions = { 
    algorithms: ['RS256']
  };

  try {
    return jwt.verify(token, getPublicKey(), options) as TokenPayload;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new JWTError('Token has expired');
    }
    if (error instanceof JsonWebTokenError) {
      throw new JWTError('Invalid token');
    }
    throw new JWTError('Failed to verify token');
  }
}; 