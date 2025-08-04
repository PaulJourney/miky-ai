import { supabase, User, Conversation, Message, Transaction, Referral } from './supabase'
import { generateAIResponse, calculateCreditsFromTokens } from './openai'

export class SupabaseApiError extends Error {
  status: number

  constructor(message: string, status: number = 500) {
    super(message)
    this.name = 'SupabaseApiError'
    this.status = status
  }
}

// User API functions
export const userApi = {
  async getCurrentUser(): Promise<User> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new SupabaseApiError('Not authenticated', 401)

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) throw new SupabaseApiError(error.message, 404)
    return data as User
  },

  async updateUser(updates: Partial<User>): Promise<User> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new SupabaseApiError('Not authenticated', 401)

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (error) throw new SupabaseApiError(error.message, 400)
    return data as User
  },

  async getUserStats() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new SupabaseApiError('Not authenticated', 401)

    // Get user data with referral stats
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (userError) throw new SupabaseApiError(userError.message, 404)

    // Get conversation count
    const { count: conversationCount } = await supabase
      .from('conversations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    // Get message count
    const { count: messageCount } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    return {
      ...userData,
      conversationCount: conversationCount || 0,
      messageCount: messageCount || 0
    }
  }
}

// Conversation API functions
export const conversationApi = {
  async getConversations(): Promise<Conversation[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new SupabaseApiError('Not authenticated', 401)

    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (error) throw new SupabaseApiError(error.message, 400)
    return data as Conversation[]
  },

  async createConversation(title: string, persona: string): Promise<Conversation> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new SupabaseApiError('Not authenticated', 401)

    const { data, error } = await supabase
      .from('conversations')
      .insert({
        user_id: user.id,
        title,
        persona: persona.toUpperCase()
      })
      .select()
      .single()

    if (error) throw new SupabaseApiError(error.message, 400)
    return data as Conversation
  },

  async updateConversation(id: string, updates: Partial<Conversation>): Promise<Conversation> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new SupabaseApiError('Not authenticated', 401)

    const { data, error } = await supabase
      .from('conversations')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw new SupabaseApiError(error.message, 400)
    return data as Conversation
  },

  async deleteConversation(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new SupabaseApiError('Not authenticated', 401)

    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw new SupabaseApiError(error.message, 400)
  }
}

// Message API functions
export const messageApi = {
  async getMessages(conversationId: string): Promise<Message[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new SupabaseApiError('Not authenticated', 401)

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    if (error) throw new SupabaseApiError(error.message, 400)
    return data as Message[]
  },

  async createMessage(
    conversationId: string,
    content: string,
    sender: 'USER' | 'ASSISTANT',
    persona?: string,
    creditsConsumed?: number
  ): Promise<Message> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new SupabaseApiError('Not authenticated', 401)

    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        user_id: user.id,
        content,
        sender,
        persona,
        credits_consumed: creditsConsumed || 0
      })
      .select()
      .single()

    if (error) throw new SupabaseApiError(error.message, 400)
    return data as Message
  }
}

// Transaction API functions
export const transactionApi = {
  async getTransactions(): Promise<Transaction[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new SupabaseApiError('Not authenticated', 401)

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw new SupabaseApiError(error.message, 400)
    return data as Transaction[]
  },

  async createTransaction(
    type: 'SUBSCRIPTION' | 'CREDITS' | 'REFERRAL' | 'CASHOUT',
    amount: number,
    credits?: number,
    metadata?: any
  ): Promise<Transaction> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new SupabaseApiError('Not authenticated', 401)

    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        type,
        amount,
        credits: credits || 0,
        metadata: metadata ? JSON.stringify(metadata) : null
      })
      .select()
      .single()

    if (error) throw new SupabaseApiError(error.message, 400)
    return data as Transaction
  }
}

// Referral API functions
export const referralApi = {
  async getReferrals(): Promise<Referral[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new SupabaseApiError('Not authenticated', 401)

    const { data, error } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw new SupabaseApiError(error.message, 400)
    return data as Referral[]
  },

  async createReferral(referredId: string): Promise<Referral> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new SupabaseApiError('Not authenticated', 401)

    const { data, error } = await supabase
      .from('referrals')
      .insert({
        referrer_id: user.id,
        referred_id: referredId
      })
      .select()
      .single()

    if (error) throw new SupabaseApiError(error.message, 400)
    return data as Referral
  }
}

// AI Chat API function (uses OpenAI directly from frontend)
export const chatApi = {
  async sendMessage(
    conversationId: string,
    message: string,
    persona: string
  ): Promise<{ response: string; creditsConsumed: number }> {
    // This would typically call OpenAI API directly from the frontend
    // For now, return a mock response
    const mockResponse = `Hello! I'm the ${persona} persona. I received your message: "${message}". This is a mock response for development.`

    // Save user message
    await messageApi.createMessage(conversationId, message, 'USER', persona)

    // Save AI response
    await messageApi.createMessage(conversationId, mockResponse, 'ASSISTANT', persona, 5)

    // Update user credits (subtract credits used)
    const currentUser = await userApi.getCurrentUser()
    await userApi.updateUser({
      credits: Math.max(0, currentUser.credits - 5)
    })

    return {
      response: mockResponse,
      creditsConsumed: 5
    }
  }
}
