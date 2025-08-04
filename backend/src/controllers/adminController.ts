import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Admin login
export const adminLogin = async (req: Request, res: Response) => {
  const { password } = req.body;
  
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid admin password' });
  }
  
  res.json({ message: 'Admin authenticated successfully' });
};

// Get system statistics
export const getStats = async (req: Request, res: Response) => {
  try {
    const [
      totalUsers,
      totalConversations,
      totalMessages,
      totalTransactions,
      activeSubscriptions,
      monthlyRevenue
    ] = await Promise.all([
      prisma.user.count(),
      prisma.conversation.count(),
      prisma.message.count(),
      prisma.transaction.count(),
      prisma.user.count({ where: { plan: { not: 'FREE' } } }),
      prisma.transaction.aggregate({
        where: {
          type: 'SUBSCRIPTION',
          status: 'COMPLETED',
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        },
        _sum: { amount: true }
      })
    ]);

    // Get plan distribution
    const planDistribution = await prisma.user.groupBy({
      by: ['plan'],
      _count: { plan: true }
    });

    // Get persona usage stats
    const personaStats = await prisma.message.groupBy({
      by: ['persona'],
      where: { persona: { not: null } },
      _count: { persona: true }
    });

    res.json({
      users: {
        total: totalUsers,
        distribution: planDistribution.map(p => ({
          plan: p.plan.toLowerCase(),
          count: p._count.plan
        }))
      },
      conversations: { total: totalConversations },
      messages: { total: totalMessages },
      transactions: { total: totalTransactions },
      subscriptions: { active: activeSubscriptions },
      revenue: { monthly: Number(monthlyRevenue._sum.amount || 0) },
      personas: personaStats.map(p => ({
        persona: p.persona?.toLowerCase(),
        usage: p._count.persona
      }))
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get users with pagination and search
export const getUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          credits: true,
          plan: true,
          referralsCount: true,
          cashEarned: true,
          emailVerified: true,
          createdAt: true,
          _count: {
            select: {
              conversations: true,
              messages: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.user.count({ where })
    ]);

    res.json({
      users: users.map(user => ({
        ...user,
        plan: user.plan.toLowerCase(),
        cashEarned: Number(user.cashEarned),
        conversationCount: user._count.conversations,
        messageCount: user._count.messages
      })),
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: total
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update user
export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { credits, plan, suspended } = req.body;

    const updateData: any = {};
    if (credits !== undefined) updateData.credits = credits;
    if (plan !== undefined) updateData.plan = plan.toUpperCase();
    // Note: 'suspended' would require adding a field to the User model

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
        referralsCount: true,
        cashEarned: true,
        emailVerified: true,
        createdAt: true
      }
    });

    res.json({
      message: 'User updated successfully',
      user: {
        ...updatedUser,
        plan: updatedUser.plan.toLowerCase(),
        cashEarned: Number(updatedUser.cashEarned)
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get conversations
export const getConversations = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [conversations, total] = await Promise.all([
      prisma.conversation.findMany({
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true
            }
          },
          _count: {
            select: { messages: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.conversation.count()
    ]);

    res.json({
      conversations: conversations.map(conv => ({
        id: conv.id,
        title: conv.title,
        persona: conv.persona.toLowerCase(),
        messageCount: conv._count.messages,
        user: conv.user,
        createdAt: conv.createdAt,
        updatedAt: conv.updatedAt
      })),
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: total
      }
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get transactions
export const getTransactions = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const type = req.query.type as string;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (type) {
      where.type = type.toUpperCase();
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.transaction.count({ where })
    ]);

    res.json({
      transactions: transactions.map(tx => ({
        id: tx.id,
        type: tx.type.toLowerCase(),
        amount: Number(tx.amount),
        credits: tx.credits,
        status: tx.status.toLowerCase(),
        user: tx.user,
        createdAt: tx.createdAt,
        metadata: tx.metadata
      })),
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: total
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update settings
export const updateSettings = async (req: Request, res: Response) => {
  try {
    const settings = req.body;

    // Update or create settings
    for (const [key, value] of Object.entries(settings)) {
      await prisma.adminSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value }
      });
    }

    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Export data
export const exportData = async (req: Request, res: Response) => {
  try {
    const type = req.params.type;
    const format = (req.query.format as string) || 'csv';

    let data: any[] = [];
    let filename = '';

    switch (type) {
      case 'users':
        data = await prisma.user.findMany({
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            credits: true,
            plan: true,
            referralsCount: true,
            cashEarned: true,
            emailVerified: true,
            createdAt: true
          }
        });
        filename = 'users';
        break;

      case 'conversations':
        data = await prisma.conversation.findMany({
          include: {
            user: { select: { email: true } }
          }
        });
        filename = 'conversations';
        break;

      case 'transactions':
        data = await prisma.transaction.findMany({
          include: {
            user: { select: { email: true } }
          }
        });
        filename = 'transactions';
        break;

      default:
        return res.status(400).json({ error: 'Invalid export type' });
    }

    if (format === 'csv') {
      // Simple CSV conversion - in production, use a proper CSV library
      const headers = Object.keys(data[0] || {});
      const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => JSON.stringify(row[header] || '')).join(','))
      ].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
      res.send(csvContent);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.json"`);
      res.json(data);
    }
  } catch (error) {
    console.error('Export data error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};