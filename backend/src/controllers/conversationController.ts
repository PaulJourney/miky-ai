import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { Persona } from '../types';

const prisma = new PrismaClient();

// Get user conversations
export const getConversations = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const persona = req.query.persona as Persona;
    const search = req.query.search as string;

    const skip = (page - 1) * limit;

    const where: any = {
      userId
    };

    if (persona) {
      where.persona = persona.toUpperCase();
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { 
          messages: {
            some: {
              content: { contains: search, mode: 'insensitive' }
            }
          }
        }
      ];
    }

    const [conversations, total] = await Promise.all([
      prisma.conversation.findMany({
        where,
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
            select: {
              id: true,
              content: true,
              sender: true,
              persona: true,
              creditsConsumed: true,
              createdAt: true
            }
          }
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.conversation.count({ where })
    ]);

    // Transform data for frontend
    const transformedConversations = conversations.map(conv => ({
      id: conv.id,
      title: conv.title,
      persona: conv.persona.toLowerCase(),
      messages: conv.messages.map(msg => ({
        id: msg.id,
        content: msg.content,
        sender: msg.sender.toLowerCase(),
        persona: msg.persona?.toLowerCase(),
        timestamp: msg.createdAt
      })),
      lastUpdated: conv.updatedAt
    }));

    res.json({
      conversations: transformedConversations,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: total,
        hasMore: skip + limit < total
      }
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Search conversations
export const searchConversations = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const query = req.query.q as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const conversations = await prisma.conversation.findMany({
      where: {
        userId,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { 
            messages: {
              some: {
                content: { contains: query, mode: 'insensitive' }
              }
            }
          }
        ]
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            content: true,
            sender: true,
            persona: true,
            creditsConsumed: true,
            createdAt: true
          }
        }
      },
      orderBy: { updatedAt: 'desc' },
      skip,
      take: limit
    });

    const transformedConversations = conversations.map(conv => ({
      id: conv.id,
      title: conv.title,
      persona: conv.persona.toLowerCase(),
      messages: conv.messages.map(msg => ({
        id: msg.id,
        content: msg.content,
        sender: msg.sender.toLowerCase(),
        persona: msg.persona?.toLowerCase(),
        timestamp: msg.createdAt
      })),
      lastUpdated: conv.updatedAt
    }));

    res.json({
      conversations: transformedConversations,
      query
    });
  } catch (error) {
    console.error('Search conversations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get specific conversation
export const getConversation = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const conversationId = req.params.id;

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        userId
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            content: true,
            sender: true,
            persona: true,
            creditsConsumed: true,
            createdAt: true
          }
        }
      }
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const transformedConversation = {
      id: conversation.id,
      title: conversation.title,
      persona: conversation.persona.toLowerCase(),
      messages: conversation.messages.map(msg => ({
        id: msg.id,
        content: msg.content,
        sender: msg.sender.toLowerCase(),
        persona: msg.persona?.toLowerCase(),
        timestamp: msg.createdAt
      })),
      lastUpdated: conversation.updatedAt
    };

    res.json({ conversation: transformedConversation });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create conversation
export const createConversation = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { title, persona } = req.body;

    const conversation = await prisma.conversation.create({
      data: {
        userId,
        title,
        persona: persona.toUpperCase()
      },
      include: {
        messages: true
      }
    });

    const transformedConversation = {
      id: conversation.id,
      title: conversation.title,
      persona: conversation.persona.toLowerCase(),
      messages: [],
      lastUpdated: conversation.updatedAt
    };

    res.status(201).json({ conversation: transformedConversation });
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update conversation
export const updateConversation = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const conversationId = req.params.id;
    const { title } = req.body;

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        userId
      }
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const updatedConversation = await prisma.conversation.update({
      where: { id: conversationId },
      data: { title },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            content: true,
            sender: true,
            persona: true,
            creditsConsumed: true,
            createdAt: true
          }
        }
      }
    });

    const transformedConversation = {
      id: updatedConversation.id,
      title: updatedConversation.title,
      persona: updatedConversation.persona.toLowerCase(),
      messages: updatedConversation.messages.map(msg => ({
        id: msg.id,
        content: msg.content,
        sender: msg.sender.toLowerCase(),
        persona: msg.persona?.toLowerCase(),
        timestamp: msg.createdAt
      })),
      lastUpdated: updatedConversation.updatedAt
    };

    res.json({ conversation: transformedConversation });
  } catch (error) {
    console.error('Update conversation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete conversation
export const deleteConversation = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const conversationId = req.params.id;

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        userId
      }
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    await prisma.conversation.delete({
      where: { id: conversationId }
    });

    res.json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    console.error('Delete conversation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};