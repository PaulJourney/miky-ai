import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

// Get user profile
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        credits: true,
        plan: true,
        referralCode: true,
        referralsCount: true,
        cashEarned: true,
        cashPaidOut: true,
        language: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        ...user,
        plan: user.plan.toLowerCase(),
        cashEarned: Number(user.cashEarned),
        cashPaidOut: Number(user.cashPaidOut),
        cashAvailable: Number(user.cashEarned) - Number(user.cashPaidOut)
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update user profile
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { firstName, lastName, language } = req.body;

    const updateData: any = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (language !== undefined) updateData.language = language;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        credits: true,
        plan: true,
        referralCode: true,
        referralsCount: true,
        cashEarned: true,
        cashPaidOut: true,
        language: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json({
      message: 'Profile updated successfully',
      user: {
        ...updatedUser,
        plan: updatedUser.plan.toLowerCase(),
        cashEarned: Number(updatedUser.cashEarned),
        cashPaidOut: Number(updatedUser.cashPaidOut),
        cashAvailable: Number(updatedUser.cashEarned) - Number(updatedUser.cashPaidOut)
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get credit balance
export const getCredits = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        credits: true,
        plan: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      credits: user.credits,
      plan: user.plan.toLowerCase()
    });
  } catch (error) {
    console.error('Get credits error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Verify referral code
export const verifyReferralCode = async (req: AuthRequest, res: Response) => {
  try {
    const { referralCode } = req.body;

    const referrer = await prisma.user.findUnique({
      where: { referralCode },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true
      }
    });

    if (!referrer) {
      return res.status(404).json({ error: 'Invalid referral code' });
    }

    res.json({
      valid: true,
      referrer: {
        name: referrer.firstName ? `${referrer.firstName} ${referrer.lastName || ''}`.trim() : referrer.email,
        bonusCredits: 300
      }
    });
  } catch (error) {
    console.error('Verify referral code error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};