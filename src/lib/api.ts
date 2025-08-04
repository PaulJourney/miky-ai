// API base configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'
const IS_DEVELOPMENT = import.meta.env.DEV || !import.meta.env.VITE_API_BASE_URL

export class ApiError extends Error {
  constructor(public status: number, message: string, public data?: any) {
    super(message)
    this.name = 'ApiError'
  }
}

// Mock data for development
const MOCK_USERS = [
  {
    id: '1',
    email: 'support@miky.ai',
    password: '1234',
    firstName: 'Support',
    lastName: 'Team',
    credits: 5000,
    plan: 'business' as const,
    referralCode: 'SUPPORT123',
    referralsCount: 20,
    cashEarned: 12,
    language: 'en',
    emailVerified: true
  }
]

// Mock API responses for development
const mockApi = {
  signIn: async (credentials: { email: string; password: string }) => {
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate network delay
    
    const user = MOCK_USERS.find(u => u.email === credentials.email && u.password === credentials.password)
    if (!user) {
      throw new ApiError(401, 'Invalid email or password')
    }
    
    const { password, ...userWithoutPassword } = user
    return {
      user: userWithoutPassword,
      token: 'mock-jwt-token',
      refreshToken: 'mock-refresh-token'
    }
  },

  signUp: async (userData: any) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Check if user already exists
    if (MOCK_USERS.find(u => u.email === userData.email)) {
      throw new ApiError(409, 'User already exists')
    }
    
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      credits: userData.referralCode ? 400 : 100, // 300 bonus if referral code
      plan: 'free' as const,
      referralCode: `REF${Date.now()}`,
      referralsCount: 0,
      cashEarned: 0,
      language: 'en',
      emailVerified: false
    }
    
    MOCK_USERS.push(newUser)
    const { password, ...userWithoutPassword } = newUser
    
    return {
      user: userWithoutPassword,
      token: 'mock-jwt-token',
      refreshToken: 'mock-refresh-token'
    }
  },

  verifyEmail: async (token: string) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return { message: 'Email verified successfully' }
  },

  forgotPassword: async (email: string) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    const user = MOCK_USERS.find(u => u.email === email)
    if (!user) {
      throw new ApiError(404, 'Email not found')
    }
    return { message: 'Reset code sent' }
  },

  resetPassword: async (token: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return { message: 'Password reset successfully' }
  }
}

// Mock conversations store
const MOCK_CONVERSATIONS: any[] = []

// Extended mock API for all endpoints
const mockChatApi = {
  sendMessage: async (data: { message: string; persona: string; conversationId?: string }) => {
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate AI response delay
    
    let conversation = data.conversationId ? 
      MOCK_CONVERSATIONS.find(c => c.id === data.conversationId) : null
    
    if (!conversation) {
      conversation = {
        id: Date.now().toString(),
        persona: data.persona,
        title: data.message.length > 50 ? data.message.substring(0, 50) + '...' : data.message,
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      MOCK_CONVERSATIONS.unshift(conversation)
    }
    
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      content: data.message,
      role: 'user' as const,
      timestamp: new Date().toISOString()
    }
    conversation.messages.push(userMessage)
    
    // Generate AI response based on persona
    const responses = {
      academic: "As Professor Miky, I'll provide you with an academically rigorous analysis...",
      lawyer: "As Lawyer Miky, I can offer legal insights on this matter...",
      engineer: "As Engineer Miky, let me break down this technical challenge...",
      marketer: "As Marketer Miky, I see several strategic opportunities here...",
      coach: "As Coach Miky, I believe this is an excellent growth opportunity...",
      medical: "As Doctor Miky, I want to address your health concerns carefully...",
      'god-mode': "As God Miky, let me explore the deeper philosophical implications...",
      richman: "As Richman Miky, I see profitable business potential here...",
      sensei: "As Sensei Miky, the harmony of relationships requires careful consideration...",
      general: "I understand your question and I'm here to help..."
    }
    
    const aiMessage = {
      id: (Date.now() + 1).toString(),
      content: responses[data.persona as keyof typeof responses] || responses.general,
      role: 'assistant' as const,
      timestamp: new Date().toISOString()
    }
    conversation.messages.push(aiMessage)
    conversation.updatedAt = new Date().toISOString()
    
    return {
      conversation,
      creditsConsumed: data.persona === 'general' ? 1 : 2,
      remainingCredits: 4998,
      message: aiMessage
    }
  }
}

const mockConversationsApi = {
  getAll: async (page = 1, limit = 20, persona?: string, search?: string) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    let filtered = [...MOCK_CONVERSATIONS]
    
    if (persona && persona !== 'all') {
      filtered = filtered.filter(c => c.persona === persona)
    }
    
    if (search) {
      filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.messages.some((m: any) => m.content.toLowerCase().includes(search.toLowerCase()))
      )
    }
    
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedResults = filtered.slice(startIndex, endIndex)
    
    return {
      conversations: paginatedResults,
      total: filtered.length,
      page,
      totalPages: Math.ceil(filtered.length / limit)
    }
  },

  getById: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    const conversation = MOCK_CONVERSATIONS.find(c => c.id === id)
    if (!conversation) {
      throw new ApiError(404, 'Conversation not found')
    }
    return { conversation }
  },

  update: async (id: string, updates: { title?: string }) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    const conversation = MOCK_CONVERSATIONS.find(c => c.id === id)
    if (!conversation) {
      throw new ApiError(404, 'Conversation not found')
    }
    Object.assign(conversation, updates)
    return { conversation }
  },

  delete: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    const index = MOCK_CONVERSATIONS.findIndex(c => c.id === id)
    if (index === -1) {
      throw new ApiError(404, 'Conversation not found')
    }
    MOCK_CONVERSATIONS.splice(index, 1)
    return { message: 'Conversation deleted successfully' }
  }
}

const mockUserApi = {
  getProfile: async () => {
    await new Promise(resolve => setTimeout(resolve, 200))
    const { password, ...userWithoutPassword } = MOCK_USERS[0]
    return { user: userWithoutPassword }
  },

  updateProfile: async (updates: any) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    Object.assign(MOCK_USERS[0], updates)
    const { password, ...userWithoutPassword } = MOCK_USERS[0]
    return { user: userWithoutPassword }
  },

  updateCredits: async (credits: number) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    MOCK_USERS[0].credits = credits
    const { password, ...userWithoutPassword } = MOCK_USERS[0]
    return { user: userWithoutPassword }
  }
}

const mockPaymentsApi = {
  createSubscription: async (planId: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return {
      clientSecret: 'mock_client_secret_' + Date.now(),
      subscriptionId: 'sub_' + Date.now()
    }
  },

  purchaseCredits: async (amount: number) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return {
      clientSecret: 'mock_client_secret_' + Date.now(),
      paymentIntentId: 'pi_' + Date.now()
    }
  },

  getBillingInfo: async () => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      subscription: {
        id: 'sub_123',
        status: 'active',
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      paymentMethods: []
    }
  }
}

const mockReferralsApi = {
  getStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 200))
    return {
      referralCode: MOCK_USERS[0].referralCode,
      referralsCount: MOCK_USERS[0].referralsCount,
      cashEarned: MOCK_USERS[0].cashEarned,
      canCashOut: MOCK_USERS[0].cashEarned >= 10
    }
  },

  requestCashout: async (paymentDetails: any) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return { message: 'Cashout request submitted successfully' }
  }
}

const mockAdminApi = {
  login: async (password: string) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    if (password !== '1234') {
      throw new ApiError(401, 'Invalid admin password')
    }
    return { token: 'admin_token_' + Date.now() }
  },

  getStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      users: { total: 1250, thisMonth: 180 },
      conversations: { total: 15420, thisMonth: 2340 },
      revenue: { total: 28500, thisMonth: 4200 },
      activeSubscriptions: 520
    }
  },

  getUsers: async (page = 1, limit = 20) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      users: MOCK_USERS,
      total: MOCK_USERS.length,
      page,
      totalPages: 1
    }
  },

  updateUser: async (userId: string, updates: any) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    const user = MOCK_USERS.find(u => u.id === userId)
    if (!user) {
      throw new ApiError(404, 'User not found')
    }
    Object.assign(user, updates)
    const { password, ...userWithoutPassword } = user
    return { user: userWithoutPassword }
  },

  getSettings: async () => {
    await new Promise(resolve => setTimeout(resolve, 200))
    return {
      settings: {
        siteTitle: 'Miky.ai',
        mainDescription: 'Ultra-skilled AI personas ready to act as your advisors in life, work, and achievement.',
        personaSubtitle: 'Choose your personalized AI specialist:',
        metaDescription: 'AI Personas highly trained for your personal, professional, and technical goals.',
        creditCosts: {
          general: 1,
          academic: 2,
          marketer: 2,
          engineer: 2,
          coach: 2,
          sensei: 2,
          richman: 2,
          lawyer: 3,
          medical: 3,
          'god-mode': 3
        }
      }
    }
  },

  updateSettings: async (settings: Record<string, any>) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    return { settings }
  }
}

// Generic API call function
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('auth_token')
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(response.status, errorData.error || 'Request failed', errorData)
    }

    const data = await response.json()
    return data as T
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(0, 'Network error occurred')
  }
}

// Auth API
export const authApi = {
  signIn: async (credentials: { email: string; password: string }) => {
    if (IS_DEVELOPMENT) {
      return mockApi.signIn(credentials)
    }
    return apiCall<{ user: any; token: string; refreshToken: string }>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  },

  signUp: async (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    referralCode?: string
  }) => {
    if (IS_DEVELOPMENT) {
      return mockApi.signUp(userData)
    }
    return apiCall<{ user: any; token: string; refreshToken: string }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  },

  verifyEmail: async (token: string) => {
    if (IS_DEVELOPMENT) {
      return mockApi.verifyEmail(token)
    }
    return apiCall<{ message: string }>('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    })
  },

  forgotPassword: async (email: string) => {
    if (IS_DEVELOPMENT) {
      return mockApi.forgotPassword(email)
    }
    return apiCall<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  },

  resetPassword: async (token: string, password: string) => {
    if (IS_DEVELOPMENT) {
      return mockApi.resetPassword(token, password)
    }
    return apiCall<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    })
  },

  refreshToken: async (refreshToken: string) => {
    if (IS_DEVELOPMENT) {
      await new Promise(resolve => setTimeout(resolve, 200))
      return {
        token: 'mock-jwt-token-refreshed',
        refreshToken: 'mock-refresh-token-refreshed'
      }
    }
    return apiCall<{ token: string; refreshToken: string }>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    })
  },
}

// Chat API
export const chatApi = {
  sendMessage: async (data: {
    message: string
    persona: string
    conversationId?: string
  }) => {
    if (IS_DEVELOPMENT) {
      return mockChatApi.sendMessage(data)
    }
    return apiCall<{
      conversation: any
      creditsConsumed: number
      remainingCredits: number
      message: any
    }>('/chat/send', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
}

// Conversations API
export const conversationsApi = {
  getAll: async (page = 1, limit = 20, persona?: string, search?: string) => {
    if (IS_DEVELOPMENT) {
      return mockConversationsApi.getAll(page, limit, persona, search)
    }
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(persona && { persona }),
      ...(search && { search }),
    })
    
    return apiCall<{
      conversations: any[]
      total: number
      page: number
      totalPages: number
    }>(`/conversations?${params}`)
  },

  getById: async (id: string) => {
    if (IS_DEVELOPMENT) {
      return mockConversationsApi.getById(id)
    }
    return apiCall<{ conversation: any }>(`/conversations/${id}`)
  },

  update: async (id: string, updates: { title?: string }) => {
    if (IS_DEVELOPMENT) {
      return mockConversationsApi.update(id, updates)
    }
    return apiCall<{ conversation: any }>(`/conversations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
  },

  delete: async (id: string) => {
    if (IS_DEVELOPMENT) {
      return mockConversationsApi.delete(id)
    }
    return apiCall<{ message: string }>(`/conversations/${id}`, {
      method: 'DELETE',
    })
  },
}

// User API
export const userApi = {
  getProfile: async () => {
    if (IS_DEVELOPMENT) {
      return mockUserApi.getProfile()
    }
    return apiCall<{ user: any }>('/user/profile')
  },

  updateProfile: async (updates: Partial<{
    firstName: string
    lastName: string
    language: string
  }>) => {
    if (IS_DEVELOPMENT) {
      return mockUserApi.updateProfile(updates)
    }
    return apiCall<{ user: any }>('/user/profile', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
  },

  updateCredits: async (credits: number) => {
    if (IS_DEVELOPMENT) {
      return mockUserApi.updateCredits(credits)
    }
    return apiCall<{ user: any }>('/user/credits', {
      method: 'PATCH',
      body: JSON.stringify({ credits }),
    })
  },
}

// Payments API
export const paymentsApi = {
  createSubscription: async (planId: string) => {
    if (IS_DEVELOPMENT) {
      return mockPaymentsApi.createSubscription(planId)
    }
    return apiCall<{ clientSecret: string; subscriptionId: string }>('/payments/create-subscription', {
      method: 'POST',
      body: JSON.stringify({ planId }),
    })
  },

  purchaseCredits: async (amount: number) => {
    if (IS_DEVELOPMENT) {
      return mockPaymentsApi.purchaseCredits(amount)
    }
    return apiCall<{ clientSecret: string; paymentIntentId: string }>('/payments/purchase-credits', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    })
  },

  getBillingInfo: async () => {
    if (IS_DEVELOPMENT) {
      return mockPaymentsApi.getBillingInfo()
    }
    return apiCall<{ subscription: any; paymentMethods: any[] }>('/payments/billing-info')
  },
}

// Referrals API
export const referralsApi = {
  getStats: async () => {
    if (IS_DEVELOPMENT) {
      return mockReferralsApi.getStats()
    }
    return apiCall<{
      referralCode: string
      referralsCount: number
      cashEarned: number
      canCashOut: boolean
    }>('/referrals/stats')
  },

  requestCashout: async (paymentDetails: {
    paypalEmail: string
    firstName: string
    lastName: string
  }) => {
    if (IS_DEVELOPMENT) {
      return mockReferralsApi.requestCashout(paymentDetails)
    }
    return apiCall<{ message: string }>('/referrals/cashout', {
      method: 'POST',
      body: JSON.stringify(paymentDetails),
    })
  },
}

// Admin API
export const adminApi = {
  login: async (password: string) => {
    if (IS_DEVELOPMENT) {
      return mockAdminApi.login(password)
    }
    return apiCall<{ token: string }>('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
    })
  },

  getStats: async () => {
    if (IS_DEVELOPMENT) {
      return mockAdminApi.getStats()
    }
    return apiCall<{
      users: { total: number; thisMonth: number }
      conversations: { total: number; thisMonth: number }
      revenue: { total: number; thisMonth: number }
      activeSubscriptions: number
    }>('/admin/stats')
  },

  getUsers: async (page = 1, limit = 20) => {
    if (IS_DEVELOPMENT) {
      return mockAdminApi.getUsers(page, limit)
    }
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })
    
    return apiCall<{
      users: any[]
      total: number
      page: number
      totalPages: number
    }>(`/admin/users?${params}`)
  },

  updateUser: async (userId: string, updates: any) => {
    if (IS_DEVELOPMENT) {
      return mockAdminApi.updateUser(userId, updates)
    }
    return apiCall<{ user: any }>(`/admin/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
  },

  getSettings: async () => {
    if (IS_DEVELOPMENT) {
      return mockAdminApi.getSettings()
    }
    return apiCall<{ settings: Record<string, any> }>('/admin/settings')
  },

  updateSettings: async (settings: Record<string, any>) => {
    if (IS_DEVELOPMENT) {
      return mockAdminApi.updateSettings(settings)
    }
    return apiCall<{ settings: Record<string, any> }>('/admin/settings', {
      method: 'PATCH',
      body: JSON.stringify(settings),
    })
  },
}