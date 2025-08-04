import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = (payload: object, expiresIn: string = '7d'): string => {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn });
};

export const generateRefreshToken = (payload: object): string => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '30d' });
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};

export const verifyRefreshToken = (token: string): any => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!);
};

export const generateReferralCode = (): string => {
  return crypto.randomBytes(6).toString('hex').toUpperCase();
};

export const generateVerificationToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const generateResetToken = (): string => {
  return crypto.randomBytes(3).toString('hex').toUpperCase(); // 6 digit code
};