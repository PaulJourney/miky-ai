import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { openaiService } from '../services/openaiService';
import { Persona } from '../types';

const prisma = new PrismaClient();

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { message, persona, conversationId } = req.body;

    // Get user with current credits
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user has enough credits
    const personaCost = openaiService.getPersonaCost(persona as Persona);
    if (user.credits < personaCost) {
      return res.status(400).json({ 
        error: 'Insufficient credits',
        required: personaCost,
        available: user.credits
      });
    }

    // Check plan restrictions for premium personas
    const premiumPersonas = ['lawyer', 'medical', 'god-mode'];
    if (premiumPersonas.includes(persona) && user.plan === 'FREE') {
      return res.status(403).json({ 
        error: 'Premium persona requires Plus or Business plan',
        persona,
        currentPlan: user.plan.toLowerCase()
      });
    }

    let conversation;
    
    if (conversationId) {
      // Get existing conversation
      conversation = await prisma.conversation.findFirst({
        where: {
          id: conversationId,
          userId
        },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
            take: 10 // Last 10 messages for context
          }
        }
      });

      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }
    } else {
      // Create new conversation with AI-generated title
      const title = await openaiService.generateConversationTitle(message, persona as Persona);
      
      conversation = await prisma.conversation.create({
        data: {
          userId,
          title,
          persona: persona.toUpperCase()
        },
        include: {
          messages: true
        }
      });
    }

    // Create user message
    const userMessage = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        userId,
        content: message,
        sender: 'USER',
        persona: persona.toUpperCase(),
        creditsConsumed: 0
      }
    });

    // Prepare conversation history for AI
    const conversationHistory = conversation.messages.map(msg => ({
      role: msg.sender.toLowerCase() === 'user' ? 'user' as const : 'assistant' as const,
      content: msg.content
    }));

    // Generate AI response
    try {
      const aiResponse = await openaiService.generateResponse(
        message,
        persona as Persona,
        conversationHistory
      );

      // Create AI message
      const assistantMessage = await prisma.message.create({
        data: {
          conversationId: conversation.id,
          userId,
          content: aiResponse,
          sender: 'ASSISTANT',
          persona: persona.toUpperCase(),
          creditsConsumed: personaCost
        }
      });

      // Deduct credits from user
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          credits: {
            decrement: personaCost
          }
        }
      });

      // Update conversation timestamp
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: { updatedAt: new Date() }
      });

      // Get updated conversation with all messages
      const updatedConversation = await prisma.conversation.findUnique({
        where: { id: conversation.id },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' }
          }
        }
      });

      // Transform response for frontend
      const responseData = {
        conversation: {
          id: updatedConversation!.id,
          title: updatedConversation!.title,
          persona: updatedConversation!.persona.toLowerCase(),
          messages: updatedConversation!.messages.map(msg => ({
            id: msg.id,
            content: msg.content,
            sender: msg.sender.toLowerCase(),
            persona: msg.persona?.toLowerCase(),
            timestamp: msg.createdAt
          })),
          lastUpdated: updatedConversation!.updatedAt
        },
        creditsConsumed: personaCost,
        remainingCredits: updatedUser.credits,
        message: {
          id: assistantMessage.id,
          content: aiResponse,
          sender: 'assistant',
          persona: persona.toLowerCase(),
          timestamp: assistantMessage.createdAt
        }
      };

      res.json(responseData);

    } catch (aiError) {
      console.error('AI generation error:', aiError);
      
      // Create error message instead
      const errorMessage = await prisma.message.create({
        data: {
          conversationId: conversation.id,
          userId,
          content: 'I apologize, but I encountered an error while generating a response. Please try again.',
          sender: 'ASSISTANT',
          persona: persona.toUpperCase(),
          creditsConsumed: 0 // Don't charge for errors
        }
      });

      res.status(500).json({
        error: 'Failed to generate AI response',
        conversation: {
          id: conversation.id,
          title: conversation.title,
          persona: conversation.persona.toLowerCase(),
          messages: [
            {
              id: userMessage.id,
              content: userMessage.content,
              sender: 'user',
              persona: persona.toLowerCase(),
              timestamp: userMessage.createdAt
            },
            {
              id: errorMessage.id,
              content: errorMessage.content,
              sender: 'assistant',
              persona: persona.toLowerCase(),
              timestamp: errorMessage.createdAt
            }
          ],
          lastUpdated: conversation.updatedAt
        }
      });
    }

  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};