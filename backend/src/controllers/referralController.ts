import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

// Get referral statistics
export const getReferralStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        referralCode: true,
        referralsCount: true,
        cashEarned: true,
        cashPaidOut: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get detailed referral information
    const referrals = await prisma.referral.findMany({
      where: { referrerId: userId },
      include: {
        referred: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            createdAt: true,
            plan: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const stats = {
      referralCode: user.referralCode,
      totalInvites: user.referralsCount,
      successfulSignups: referrals.length,
      totalCashEarned: Number(user.cashEarned),
      cashPaidOut: Number(user.cashPaidOut),
      cashAvailable: Number(user.cashEarned) - Number(user.cashPaidOut),
      minCashout: 10.00,
      referrals: referrals.map(ref => ({
        id: ref.id,
        referredUser: {
          name: ref.referred.firstName ? 
            `${ref.referred.firstName} ${ref.referred.lastName || ''}`.trim() :
            ref.referred.email,
          plan: ref.referred.plan.toLowerCase(),
          signupDate: ref.referred.createdAt
        },
        creditsAwarded: ref.creditsAwarded,
        cashAwarded: Number(ref.cashAwarded),
        processed: ref.processed,
        createdAt: ref.createdAt
      }))
    };

    res.json(stats);
  } catch (error) {
    console.error('Get referral stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get shareable referral link
export const getShareLink = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        referralCode: true,
        firstName: true,
        lastName: true,
        email: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const referralUrl = `${process.env.FRONTEND_URL}?ref=${user.referralCode}`;
    const userName = user.firstName ? 
      `${user.firstName} ${user.lastName || ''}`.trim() :
      user.email;

    const shareMessages = {
      whatsapp: `🤖 Hey! I'm using Miky.ai - incredible AI personas that help with everything from legal advice to business strategy. ${userName} invited you to try it and get 300 free credits! Check it out: ${referralUrl}`,
      copy: `🤖 ${userName} invited you to try Miky.ai!\n\nDiscover ultra-skilled AI personas for:\n• Legal advice & contracts\n• Business & marketing strategy  \n• Technical & engineering help\n• Health & wellness guidance\n• And much more!\n\nGet 300 free credits with this link: ${referralUrl}`
    };

    res.json({
      referralCode: user.referralCode,
      referralUrl,
      userName,
      shareMessages,
      bonusCredits: 300,
      cashReward: 2.00
    });
  } catch (error) {
    console.error('Get share link error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Request cashout
export const requestCashout = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { paypalEmail, firstName, lastName } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        cashEarned: true,
        cashPaidOut: true,
        email: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const availableCash = Number(user.cashEarned) - Number(user.cashPaidOut);
    const minCashout = 10.00;

    if (availableCash < minCashout) {
      return res.status(400).json({ 
        error: `Minimum cashout amount is $${minCashout}`,
        available: availableCash,
        required: minCashout
      });
    }

    // Create cashout transaction record
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        type: 'CASHOUT',
        amount: availableCash,
        credits: 0,
        status: 'PENDING',
        metadata: {
          paypalEmail,
          firstName,
          lastName,
          requestedAt: new Date().toISOString()
        }
      }
    });

    // TODO: Integrate with PayPal API for automatic payouts
    // For now, this creates a pending transaction that admin can process

    res.json({
      message: 'Cashout request submitted successfully',
      transaction: {
        id: transaction.id,
        amount: Number(transaction.amount),
        status: transaction.status.toLowerCase(),
        paypalEmail,
        estimatedProcessingTime: '1-3 business days'
      }
    });
  } catch (error) {
    console.error('Request cashout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};