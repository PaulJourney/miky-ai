import React, { createContext, useContext, useEffect, useState } from 'react'
import { User as SupabaseUser, Session } from '@supabase/supabase-js'
import { supabase, User } from '../lib/supabase'
import { toast } from 'sonner'

interface AuthContextType {
  user: User | null
  supabaseUser: SupabaseUser | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, userData?: Partial<User>) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  verifyEmail: (token: string) => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<void>
  loadUserProfile: () => Promise<void>
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
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user && !!supabaseUser

  // Load user profile from our custom users table
  const loadUserProfile = async () => {
    try {
      if (!supabaseUser) {
        console.log('🔍 No supabase user found, skipping profile load')
        return
      }

      console.log('🔄 Loading user profile for:', supabaseUser.id)

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .single()

      console.log('📊 User profile query result:', { data, error })

      if (error) {
        console.error('❌ Error loading user profile:', error)

        // If user doesn't exist in our users table, the trigger should have created it
        // This might indicate the database schema wasn't applied correctly
        if (error.code === 'PGRST116') {
          console.error('🚨 User not found in users table - database schema issue?')
          toast.error('Profilo utente non trovato. Contatta il supporto.')
        }
        return
      }

      console.log('✅ User profile loaded successfully')
      setUser(data as User)
    } catch (error) {
      console.error('💥 Error loading user profile:', error)
    }
  }

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session: initialSession } } = await supabase.auth.getSession()

        if (initialSession) {
          setSession(initialSession)
          setSupabaseUser(initialSession.user)
          await loadUserProfile()
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session)

        setSession(session)
        setSupabaseUser(session?.user || null)

        if (session?.user) {
          await loadUserProfile()
        } else {
          setUser(null)
        }

        setIsLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      console.log('🔄 Starting sign in process for:', email)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log('📊 Supabase signIn response:', { data, error })

      if (error) {
        console.error('❌ Supabase auth error:', error)
        throw error
      }

      if (data.user) {
        console.log('✅ User signed in successfully:', data.user.id)
        toast.success('Accesso effettuato con successo!')
      }
    } catch (error: any) {
      console.error('💥 Sign in error:', error)

      // More detailed error messages
      let errorMessage = 'Errore durante il login'

      if (error.message?.includes('invalid_credentials')) {
        errorMessage = 'Email o password non corretti.'
      } else if (error.message?.includes('email_not_confirmed')) {
        errorMessage = 'Email non verificata. Controlla la tua casella email.'
      } else if (error.message?.includes('too_many_requests')) {
        errorMessage = 'Troppi tentativi. Riprova tra qualche minuto.'
      } else if (error.message) {
        errorMessage = error.message
      }

      toast.error(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Sign up with email and password
  const signUp = async (email: string, password: string, userData?: Partial<User>) => {
    try {
      setIsLoading(true)
      console.log('🔄 Starting sign up process for:', email)

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData?.first_name,
            last_name: userData?.last_name,
            language: userData?.language || 'en'
          }
        }
      })

      console.log('📊 Supabase signUp response:', { data, error })

      if (error) {
        console.error('❌ Supabase auth error:', error)
        throw error
      }

      if (data.user) {
        console.log('✅ User created successfully:', data.user.id)
        toast.success('Account creato! Controlla la tua email per la verifica.')
      } else {
        console.warn('⚠️ No user returned from signUp')
        toast.success('Account creato! Controlla la tua email per la verifica.')
      }
    } catch (error: any) {
      console.error('💥 Sign up error:', error)

      // More detailed error messages
      let errorMessage = 'Errore durante la registrazione'

      if (error.message?.includes('already_registered')) {
        errorMessage = 'Questo email è già registrato. Prova a fare login.'
      } else if (error.message?.includes('invalid_email')) {
        errorMessage = 'Email non valida. Controlla l\'indirizzo email.'
      } else if (error.message?.includes('weak_password')) {
        errorMessage = 'Password troppo debole. Usa almeno 6 caratteri.'
      } else if (error.message) {
        errorMessage = error.message
      }

      toast.error(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      setUser(null)
      setSupabaseUser(null)
      setSession(null)

      toast.success('Logout effettuato con successo!')
    } catch (error: any) {
      console.error('Error signing out:', error)
      toast.error(error.message || 'Errore durante il logout')
      throw error
    }
  }

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      toast.success('Email di reset password inviata!')
    } catch (error: any) {
      console.error('Error resetting password:', error)
      toast.error(error.message || 'Errore durante il reset della password')
      throw error
    }
  }

  // Forgot password (alias for resetPassword)
  const forgotPassword = async (email: string) => {
    await resetPassword(email)
  }

  // Verify email
  const verifyEmail = async (token: string) => {
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: '', // Email will be embedded in the token
        token,
        type: 'email'
      })

      if (error) throw error

      toast.success('Email verificata con successo!')
    } catch (error: any) {
      console.error('Error verifying email:', error)
      toast.error(error.message || 'Errore durante la verifica email')
      throw error
    }
  }

  // Update user profile
  const updateProfile = async (updates: Partial<User>) => {
    try {
      if (!supabaseUser) throw new Error('User not authenticated')

      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', supabaseUser.id)

      if (error) throw error

      // Update local state
      setUser(prev => prev ? { ...prev, ...updates } : null)

      toast.success('Profilo aggiornato con successo!')
    } catch (error: any) {
      console.error('Error updating profile:', error)
      toast.error(error.message || 'Errore durante l\'aggiornamento del profilo')
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    supabaseUser,
    session,
    isLoading,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    resetPassword,
    forgotPassword,
    verifyEmail,
    updateProfile,
    loadUserProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
