import React, { createContext, useContext, useEffect, useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { authApi, userApi, ApiError } from '../lib/api'
import { toast } from 'sonner'

interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  credits: number
  plan: 'free' | 'plus' | 'business'
  referralCode: string
  referralsCount: number
  cashEarned: number
  language: string
  emailVerified: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    referralCode?: string
  }) => Promise<void>
  signOut: () => void
  updateUser: (updates: Partial<User>) => void
  refreshUserData: () => Promise<void>
  verifyEmail: (token: string) => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (token: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authToken, setAuthToken] = useKV<string | null>('auth_token', null)
  const [refreshToken, setRefreshToken] = useKV<string | null>('refresh_token', null)

  const isAuthenticated = !!user && !!authToken

  // Store tokens in localStorage for API calls
  useEffect(() => {
    if (authToken) {
      localStorage.setItem('auth_token', authToken)
    } else {
      localStorage.removeItem('auth_token')
    }
  }, [authToken])

  // Load user data on mount if we have a token
  useEffect(() => {
    const initAuth = async () => {
      if (authToken) {
        try {
          await loadUserProfile()
        } catch (error) {
          console.error('Failed to load user profile:', error)
          if (error instanceof ApiError && error.status === 401) {
            // Try to refresh token
            if (refreshToken) {
              try {
                await handleRefreshToken()
              } catch (refreshError) {
                // Refresh failed, clear everything
                await signOut()
              }
            } else {
              await signOut()
            }
          }
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [authToken])

  const loadUserProfile = async () => {
    try {
      const response = await userApi.getProfile()
      setUser(response.user)
    } catch (error) {
      throw error
    }
  }

  const handleRefreshToken = async () => {
    if (!refreshToken) throw new Error('No refresh token available')
    
    try {
      const response = await authApi.refreshToken(refreshToken)
      setAuthToken(response.token)
      setRefreshToken(response.refreshToken)
      await loadUserProfile()
    } catch (error) {
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await authApi.signIn({ email, password })
      
      setAuthToken(response.token)
      setRefreshToken(response.refreshToken)
      setUser(response.user)
      
      toast.success('Successfully signed in!')
    } catch (error) {
      console.error('Sign in error:', error)
      if (error instanceof ApiError) {
        // Provide specific error messages based on API response
        if (error.status === 401) {
          throw new Error('Invalid email or password')
        } else if (error.status === 403) {
          throw new Error('Account is disabled. Please contact support.')
        } else if (error.status === 404) {
          throw new Error('Account not found')
        } else {
          throw new Error(error.message || 'Failed to sign in')
        }
      }
      throw new Error('Network error. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    referralCode?: string
  }) => {
    try {
      setIsLoading(true)
      const response = await authApi.signUp(userData)
      
      // Note: User might need email verification before being fully authenticated
      if (response.token) {
        setAuthToken(response.token)
        setRefreshToken(response.refreshToken)
        setUser(response.user)
      }
      
      toast.success('Account created successfully!')
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(error.message)
      }
      throw new Error('Failed to create account')
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    setUser(null)
    setAuthToken(null)
    setRefreshToken(null)
    localStorage.removeItem('auth_token')
    toast.success('Successfully signed out')
  }

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates })
    }
  }

  const refreshUserData = async () => {
    if (authToken) {
      try {
        await loadUserProfile()
      } catch (error) {
        console.error('Failed to refresh user data:', error)
      }
    }
  }

  const verifyEmail = async (token: string) => {
    try {
      await authApi.verifyEmail(token)
      if (user) {
        setUser({ ...user, emailVerified: true })
      }
      toast.success('Email verified successfully!')
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(error.message)
      }
      throw new Error('Failed to verify email')
    }
  }

  const forgotPassword = async (email: string) => {
    try {
      await authApi.forgotPassword(email)
      toast.success('Password reset instructions sent to your email')
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(error.message)
      }
      throw new Error('Failed to send password reset email')
    }
  }

  const resetPassword = async (token: string, password: string) => {
    try {
      await authApi.resetPassword(token, password)
      toast.success('Password reset successfully!')
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(error.message)
      }
      throw new Error('Failed to reset password')
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    updateUser,
    refreshUserData,
    verifyEmail,
    forgotPassword,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}