import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { 
  hashPassword, 
  comparePassword, 
  generateToken, 
  generateRefreshToken, 
  generateReferralCode, 
  generateVerificationToken,
  generateResetToken,
  verifyRefreshToken
} from '../utils/auth';
import { emailService } from '../services/emailService';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

// Signup
export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, referralCode, language = 'en' } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Validate referral code if provided
    let referrer = null;
    if (referralCode) {
      referrer = await prisma.user.findUnique({
        where: { referralCode }
      });
      if (!referrer) {
        return res.status(400).json({ error: 'Invalid referral code' });
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Generate unique referral code
    let userReferralCode = generateReferralCode();
    let codeExists = await prisma.user.findUnique({ where: { referralCode: userReferralCode } });
    while (codeExists) {
      userReferralCode = generateReferralCode();
      codeExists = await prisma.user.findUnique({ where: { referralCode: userReferralCode } });
    }

    // Generate email verification token
    const verificationToken = generateVerificationToken();

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        firstName,
        lastName,
        referralCode: userReferralCode,
        referredBy: referrer?.id,
        language,
        emailVerificationToken: verificationToken,
        credits: referrer ? 300 : 100 // Bonus credits if referred
      }
    });

    // Process referral if applicable
    if (referrer) {
      await prisma.referral.create({
        data: {
          referrerId: referrer.id,
          referredId: user.id,
          creditsAwarded: 300,
          cashAwarded: 2.00
        }
      });

      // Update referrer stats
      await prisma.user.update({
        where: { id: referrer.id },
        data: {
          referralsCount: { increment: 1 },
          cashEarned: { increment: 2.00 }
        }
      });
    }

    // Send verification email
    const emailSent = await emailService.sendVerificationEmail(email, verificationToken);
    if (!emailSent) {
      console.warn('Failed to send verification email to:', email);
    }

    res.status(201).json({
      message: 'User created successfully. Please check your email to verify your account.',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        credits: user.credits,
        plan: user.plan,
        referralCode: user.referralCode,
        language: user.language,
        emailVerified: false
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Signin
export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isValidPassword = await comparePassword(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.emailVerified) {
      return res.status(401).json({ error: 'Please verify your email before signing in' });
    }

    // Generate tokens
    const token = generateToken({ userId: user.id, email: user.email });
    const refreshToken = generateRefreshToken({ userId: user.id });

    res.json({
      message: 'Signed in successfully',
      token,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        credits: user.credits,
        plan: user.plan,
        referralCode: user.referralCode,
        referralsCount: user.referralsCount,
        cashEarned: Number(user.cashEarned),
        language: user.language,
        emailVerified: user.emailVerified
      }
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Verify email
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    const user = await prisma.user.findFirst({
      where: { emailVerificationToken: token }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }

    // Update user as verified
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null
      }
    });

    // Send welcome email
    await emailService.sendWelcomeEmail(user.email, user.firstName || undefined);

    // Generate auth tokens
    const authToken = generateToken({ userId: user.id, email: user.email });
    const refreshToken = generateRefreshToken({ userId: user.id });

    res.json({
      message: 'Email verified successfully',
      token: authToken,
      refreshToken,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        credits: updatedUser.credits,
        plan: updatedUser.plan,
        referralCode: updatedUser.referralCode,
        referralsCount: updatedUser.referralsCount,
        cashEarned: Number(updatedUser.cashEarned),
        language: updatedUser.language,
        emailVerified: true
      }
    });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Forgot password
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Don't reveal if email exists or not
      return res.json({ message: 'If the email exists, a reset code will be sent' });
    }

    const resetToken = generateResetToken();
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: resetExpires
      }
    });

    // Send reset email
    await emailService.sendPasswordResetEmail(email, resetToken);

    res.json({ message: 'If the email exists, a reset code will be sent' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Reset password
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    const hashedPassword = await hashPassword(password);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null
      }
    });

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Refresh token
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    const decoded = verifyRefreshToken(refreshToken);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user || !user.emailVerified) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const newToken = generateToken({ userId: user.id, email: user.email });
    const newRefreshToken = generateRefreshToken({ userId: user.id });

    res.json({
      token: newToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({ error: 'Invalid refresh token' });
  }
};

// Logout
export const logout = async (req: Request, res: Response) => {
  res.json({ message: 'Logged out successfully' });
};