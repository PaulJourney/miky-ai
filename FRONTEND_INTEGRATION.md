# Frontend-Backend Integration Guide

## Overview

This document explains how to integrate the React frontend with the Node.js backend for Miky.ai.

## API Service Layer

Create a new API service to replace the current mock data system.

### 1. Create API Configuration

Create `src/lib/api.ts`:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}/api${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new ApiError(
        error.error || 'Request failed',
        response.status,
        error
      );
    }

    return response.json();
  }

  // Authentication methods
  async signup(data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    referralCode?: string;
    language?: string;
  }) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async signin(email: string, password: string) {
    return this.request('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async verifyEmail(token: string) {
    return this.request('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async forgotPassword(email: string) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, password: string) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  }

  // User methods
  async getProfile() {
    return this.request('/user/profile');
  }

  async updateProfile(data: {
    firstName?: string;
    lastName?: string;
    language?: string;
  }) {
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Chat methods
  async sendMessage(data: {
    message: string;
    persona: string;
    conversationId?: string;
  }) {
    return this.request('/chat/send', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Conversation methods
  async getConversations(params?: {
    page?: number;
    limit?: number;
    persona?: string;
    search?: string;
  }) {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          query.append(key, value.toString());
        }
      });
    }
    return this.request(`/conversations?${query}`);
  }

  async getConversation(id: string) {
    return this.request(`/conversations/${id}`);
  }

  async updateConversation(id: string, title: string) {
    return this.request(`/conversations/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ title }),
    });
  }

  async deleteConversation(id: string) {
    return this.request(`/conversations/${id}`, {
      method: 'DELETE',
    });
  }

  // Referral methods
  async getReferralStats() {
    return this.request('/referrals/stats');
  }

  async getShareLink() {
    return this.request('/referrals/share-link');
  }

  async requestCashout(data: {
    paypalEmail: string;
    firstName: string;
    lastName: string;
  }) {
    return this.request('/referrals/cashout', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Payment methods
  async createSubscription(priceId: string, plan: string) {
    return this.request('/payments/create-subscription', {
      method: 'POST',
      body: JSON.stringify({ priceId, plan }),
    });
  }

  async buyCredits(credits: number, amount: number) {
    return this.request('/payments/buy-credits', {
      method: 'POST',
      body: JSON.stringify({ credits, amount }),
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
```

### 2. Update Environment Variables

Add to `.env` or `.env.local`:

```env
VITE_API_URL=http://localhost:3001
```

For production:
```env
VITE_API_URL=https://api.miky.ai
```

### 3. Replace useKV with API Calls

Update `src/App.tsx` to use the API service:

```typescript
// Remove useKV imports and replace with API calls
import { apiClient, ApiError } from './lib/api';

// Replace user state management
const [user, setUser] = useState<User | null>(null);
const [conversations, setConversations] = useState<Conversation[]>([]);

// Update authentication methods
const handleAuthSuccess = async (userData: any, isNewUser = false) => {
  apiClient.setToken(userData.token);
  setUser(userData.user);
  
  if (isNewUser) {
    setTimeout(() => setShowWelcomeTutorial(true), 500);
  }
  
  // Load user conversations
  try {
    const response = await apiClient.getConversations();
    setConversations(response.conversations);
  } catch (error) {
    console.error('Failed to load conversations:', error);
  }
};

// Update sendMessage function
const handleSendMessage = async (content: string) => {
  if (!user) {
    handleAuthRequest('signup');
    return;
  }
  
  setIsLoading(true);
  
  try {
    const response = await apiClient.sendMessage({
      message: content,
      persona: selectedPersona || 'general',
      conversationId: currentConversation?.id
    });
    
    setCurrentConversation(response.conversation);
    setUser(prev => prev ? { ...prev, credits: response.remainingCredits } : null);
    
    // Update conversations list
    const conversationsResponse = await apiClient.getConversations();
    setConversations(conversationsResponse.conversations);
    
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 400 && error.data?.error === 'Insufficient credits') {
        // Show insufficient credits modal
        toast.error('Insufficient credits. Please upgrade your plan or buy more credits.');
      } else if (error.status === 403) {
        // Premium persona requires upgrade
        toast.error(`${error.data?.persona} requires Plus or Business plan`);
      } else {
        toast.error(error.message);
      }
    } else {
      toast.error('Failed to send message. Please try again.');
    }
  } finally {
    setIsLoading(false);
  }
};
```

### 4. Update Authentication Components

Update `src/components/AuthModal.tsx`:

```typescript
import { apiClient, ApiError } from '../lib/api';

const handleSignup = async (data: SignupData) => {
  try {
    setLoading(true);
    const response = await apiClient.signup({
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      referralCode: referralCode,
      language: currentLanguage
    });
    
    // Show email verification message
    setEmailSent(true);
    toast.success('Please check your email to verify your account');
    
  } catch (error) {
    if (error instanceof ApiError) {
      toast.error(error.message);
    } else {
      toast.error('Signup failed. Please try again.');
    }
  } finally {
    setLoading(false);
  }
};

const handleSignin = async (data: SigninData) => {
  try {
    setLoading(true);
    const response = await apiClient.signin(data.email, data.password);
    
    onAuthSuccess(response, false);
    toast.success('Signed in successfully');
    
  } catch (error) {
    if (error instanceof ApiError) {
      toast.error(error.message);
    } else {
      toast.error('Signin failed. Please try again.');
    }
  } finally {
    setLoading(false);
  }
};
```

### 5. Initialize User Session

Add session initialization to `src/App.tsx`:

```typescript
// Check for existing session on app load
useEffect(() => {
  const initializeAuth = async () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      apiClient.setToken(token);
      try {
        const response = await apiClient.getProfile();
        setUser(response.user);
        
        // Load conversations
        const conversationsResponse = await apiClient.getConversations();
        setConversations(conversationsResponse.conversations);
        
      } catch (error) {
        // Invalid token, clear it
        apiClient.setToken(null);
        console.error('Failed to restore session:', error);
      }
    }
  };

  initializeAuth();
}, []);
```

### 6. Error Handling

Create `src/lib/errorHandler.ts`:

```typescript
import { toast } from 'sonner';
import { ApiError } from './api';

export const handleApiError = (error: unknown, fallbackMessage = 'An error occurred') => {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 401:
        toast.error('Please sign in to continue');
        // Redirect to sign in
        break;
      case 403:
        toast.error('Access denied');
        break;
      case 429:
        toast.error('Too many requests. Please try again later.');
        break;
      default:
        toast.error(error.message || fallbackMessage);
    }
  } else {
    console.error('Unexpected error:', error);
    toast.error(fallbackMessage);
  }
};
```

### 7. Loading States

Add loading states to components:

```typescript
const [isLoading, setIsLoading] = useState(false);

// Show loading spinner during API calls
{isLoading && <LoadingSpinner />}
```

### 8. Real-time Features (Optional)

For real-time features, consider adding WebSocket support:

```typescript
// src/lib/websocket.ts
class WebSocketClient {
  private ws: WebSocket | null = null;
  
  connect(token: string) {
    this.ws = new WebSocket(`${WS_URL}?token=${token}`);
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Handle real-time updates
    };
  }
  
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
```

## Testing the Integration

### 1. Start Backend
```bash
cd backend
npm run dev
```

### 2. Start Frontend
```bash
cd ..
npm run dev
```

### 3. Test Flow
1. Sign up with a new account
2. Verify email (check console for verification token in development)
3. Sign in
4. Send messages to different personas
5. Check conversation history
6. Test referral system
7. Test payment flows (with Stripe test mode)

## Production Considerations

### 1. API URL Configuration
- Use environment variables for API URLs
- Set up proper CORS in production
- Use HTTPS for all API calls

### 2. Error Boundaries
Add React Error Boundaries to catch and handle errors gracefully.

### 3. Performance Optimization
- Implement request caching
- Add request debouncing for search
- Use React Query for better state management

### 4. Security
- Implement token refresh logic
- Add request signing for sensitive operations
- Validate all user inputs

This integration will replace the current mock `useKV` system with real API calls to the backend, providing a fully functional application ready for production deployment.