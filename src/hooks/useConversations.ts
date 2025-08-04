import { useState, useCallback } from 'react'
import { chatApi, conversationsApi, ApiError } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'sonner'

export interface Message {
  id: string
  content: string
  sender: 'user' | 'assistant'
  timestamp: Date
  persona?: string
}

export interface Conversation {
  id: string
  title: string
  persona: string
  messages: Message[]
  lastUpdated: Date
}

export interface ConversationsData {
  conversations: Conversation[]
  total: number
  page: number
  totalPages: number
}

export const useConversations = () => {
  const { user, updateUser } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)

  const loadConversations = useCallback(async (
    page = 1,
    limit = 20,
    persona?: string,
    search?: string
  ): Promise<ConversationsData> => {
    try {
      setIsLoading(true)
      const response = await conversationsApi.getAll(page, limit, persona, search)
      
      // Transform the data to match frontend format
      const transformedConversations = response.conversations.map(conv => ({
        ...conv,
        persona: conv.persona.toLowerCase(),
        messages: conv.messages?.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp || msg.createdAt),
          persona: msg.persona?.toLowerCase()
        })) || [],
        lastUpdated: new Date(conv.lastUpdated || conv.updatedAt)
      }))

      setConversations(transformedConversations)
      
      return {
        conversations: transformedConversations,
        total: response.total,
        page: response.page,
        totalPages: response.totalPages
      }
    } catch (error) {
      console.error('Failed to load conversations:', error)
      toast.error('Failed to load conversations')
      return {
        conversations: [],
        total: 0,
        page: 1,
        totalPages: 0
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const sendMessage = useCallback(async (
    message: string,
    persona: string,
    conversationId?: string
  ): Promise<{ conversation: Conversation; newMessage: Message } | null> => {
    if (!user) {
      toast.error('Please sign in to send messages')
      return null
    }

    try {
      setIsSending(true)
      
      const response = await chatApi.sendMessage({
        message,
        persona,
        conversationId
      })

      // Transform response to match frontend format
      const transformedConversation: Conversation = {
        id: response.conversation.id,
        title: response.conversation.title,
        persona: response.conversation.persona,
        messages: response.conversation.messages.map((msg: any) => ({
          id: msg.id,
          content: msg.content,
          sender: msg.sender,
          timestamp: new Date(msg.timestamp),
          persona: msg.persona
        })),
        lastUpdated: new Date(response.conversation.lastUpdated)
      }

      const newMessage: Message = {
        id: response.message.id,
        content: response.message.content,
        sender: response.message.sender,
        timestamp: new Date(response.message.timestamp),
        persona: response.message.persona
      }

      // Update current conversation
      setCurrentConversation(transformedConversation)

      // Update conversations list
      setConversations(prev => {
        const existingIndex = prev.findIndex(c => c.id === transformedConversation.id)
        if (existingIndex >= 0) {
          const updated = [...prev]
          updated[existingIndex] = transformedConversation
          return updated
        } else {
          return [transformedConversation, ...prev]
        }
      })

      // Update user credits
      updateUser({ credits: response.remainingCredits })

      return { conversation: transformedConversation, newMessage }
    } catch (error) {
      console.error('Failed to send message:', error)
      if (error instanceof ApiError) {
        if (error.status === 400 && error.data?.error === 'Insufficient credits') {
          toast.error('Insufficient credits. Please purchase more credits or upgrade your plan.')
        } else if (error.status === 403) {
          toast.error('This persona requires a Plus or Business plan. Please upgrade your plan.')
        } else {
          toast.error(error.message || 'Failed to send message')
        }
      } else {
        toast.error('Failed to send message')
      }
      return null
    } finally {
      setIsSending(false)
    }
  }, [user, updateUser])

  const loadConversation = useCallback(async (conversationId: string): Promise<Conversation | null> => {
    try {
      const response = await conversationsApi.getById(conversationId)
      
      const transformedConversation: Conversation = {
        id: response.conversation.id,
        title: response.conversation.title,
        persona: response.conversation.persona.toLowerCase(),
        messages: response.conversation.messages.map((msg: any) => ({
          id: msg.id,
          content: msg.content,
          sender: msg.sender.toLowerCase(),
          timestamp: new Date(msg.timestamp || msg.createdAt),
          persona: msg.persona?.toLowerCase()
        })),
        lastUpdated: new Date(response.conversation.lastUpdated || response.conversation.updatedAt)
      }

      setCurrentConversation(transformedConversation)
      return transformedConversation
    } catch (error) {
      console.error('Failed to load conversation:', error)
      toast.error('Failed to load conversation')
      return null
    }
  }, [])

  const updateConversation = useCallback(async (
    conversationId: string,
    updates: { title?: string }
  ): Promise<boolean> => {
    try {
      const response = await conversationsApi.update(conversationId, updates)
      
      const transformedConversation: Conversation = {
        id: response.conversation.id,
        title: response.conversation.title,
        persona: response.conversation.persona.toLowerCase(),
        messages: response.conversation.messages?.map((msg: any) => ({
          id: msg.id,
          content: msg.content,
          sender: msg.sender.toLowerCase(),
          timestamp: new Date(msg.timestamp || msg.createdAt),
          persona: msg.persona?.toLowerCase()
        })) || [],
        lastUpdated: new Date(response.conversation.lastUpdated || response.conversation.updatedAt)
      }

      // Update conversations list
      setConversations(prev =>
        prev.map(c => c.id === conversationId ? transformedConversation : c)
      )

      // Update current conversation if it's the one being updated
      if (currentConversation?.id === conversationId) {
        setCurrentConversation(transformedConversation)
      }

      return true
    } catch (error) {
      console.error('Failed to update conversation:', error)
      toast.error('Failed to update conversation')
      return false
    }
  }, [currentConversation])

  const deleteConversation = useCallback(async (conversationId: string): Promise<boolean> => {
    try {
      await conversationsApi.delete(conversationId)
      
      // Remove from conversations list
      setConversations(prev => prev.filter(c => c.id !== conversationId))
      
      // Clear current conversation if it's the one being deleted
      if (currentConversation?.id === conversationId) {
        setCurrentConversation(null)
      }

      toast.success('Conversation deleted successfully')
      return true
    } catch (error) {
      console.error('Failed to delete conversation:', error)
      toast.error('Failed to delete conversation')
      return false
    }
  }, [currentConversation])

  return {
    conversations,
    currentConversation,
    isLoading,
    isSending,
    setCurrentConversation,
    loadConversations,
    sendMessage,
    loadConversation,
    updateConversation,
    deleteConversation,
  }
}