import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Generate unique referral code
function generateReferralCode(email: string): string {
  const timestamp = Date.now().toString(36)
  const emailHash = email.split('@')[0].slice(0, 4).toUpperCase()
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${emailHash}${randomPart}${timestamp.slice(-3)}`.substring(0, 10)
}

// Types
export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  credits: number
  water_cleaned_liters: number
  subscription_plan: 'free' | 'plus' | 'pro'
  subscription_status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete'
  stripe_customer_id: string | null
  referral_code: string
  referred_by: string | null
  referral_level: number
  total_referral_earnings: number
  pending_payout: number
  language: string
  is_admin: boolean
  is_mock: boolean
  created_at: string
  updated_at: string
}

export interface AuthError {
  message: string
  code?: string
}

// Sign up with email and password
export async function signUp(email: string, password: string, fullName: string, referralCode?: string) {
  try {
    // Create auth user first
    const { data, error } = await supabase.auth.signUp({
      email: email.toLowerCase(),
      password,
      options: {
        data: {
          full_name: fullName,
          referred_by: referralCode || null
        }
      }
    })

    if (error) {
      return { error: { message: error.message } }
    }

    if (data.user) {
      // Create or update profile with user info
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: data.user.id,
          email: email.toLowerCase(),
          full_name: fullName,
          referral_code: generateReferralCode(email),
          referred_by: referralCode || null,
          credits: 100,
          water_cleaned_liters: 0,
          subscription_plan: 'free',
          subscription_status: 'active',
          referral_level: 1,
          total_referral_earnings: 0,
          pending_payout: 0,
          language: 'en',
          is_admin: false,
          is_mock: false
        }, {
          onConflict: 'id'
        })

      if (profileError) {
        console.error('Profile creation error:', profileError)
        // Don't fail the signup if profile creation fails
      }

      // Email verification will be handled by Supabase
      // Supabase will send the verification email automatically
    }

    return { data, error: null }
  } catch (error: any) {
    return { error: { message: error.message || 'An unexpected error occurred' } }
  }
}

// Sign in with email and password
export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase(),
      password
    })

    if (error) {
      // Customize error messages
      if (error.message.includes('Invalid login credentials')) {
        return { error: { message: 'Incorrect email or password. Please check your credentials and try again.' } }
      }
      if (error.message.includes('Email not confirmed')) {
        return { error: { message: 'Please check your email and click the verification link before signing in.' } }
      }
      return { error: { message: error.message } }
    }

    return { data, error: null }
  } catch (error: any) {
    return { error: { message: error.message || 'An unexpected error occurred' } }
  }
}

// Sign out
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    return { error }
  } catch (error: any) {
    return { error: { message: error.message || 'An unexpected error occurred' } }
  }
}

// Send password reset email
export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_NAME || 'https://miky.ai'}/auth/reset-password`
    })

    if (error) {
      return { error: { message: error.message } }
    }

    return { error: null }
  } catch (error: any) {
    return { error: { message: error.message || 'An unexpected error occurred' } }
  }
}

// Update password
export async function updatePassword(newPassword: string) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) {
      return { error: { message: error.message } }
    }

    return { error: null }
  } catch (error: any) {
    return { error: { message: error.message || 'An unexpected error occurred' } }
  }
}

// Get current user profile
export async function getCurrentProfile(): Promise<{ data: Profile | null; error: AuthError | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { data: null, error: null }
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      // If profile doesn't exist, create it
      if (error.code === 'PGRST116') {
        console.log('Profile not found, creating new profile for user:', user.id)

        const { error: createError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email?.toLowerCase() || '',
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            referral_code: generateReferralCode(user.email || ''),
            credits: 100,
            water_cleaned_liters: 0,
            subscription_plan: 'free',
            subscription_status: 'active',
            referral_level: 1,
            total_referral_earnings: 0,
            pending_payout: 0,
            language: 'en',
            is_admin: false,
            is_mock: false
          })

        if (createError) {
          console.error('Error creating profile:', createError)
          // If it's a RLS policy error, try to return a default profile structure
          if (createError.code === '42501') {
            console.log('RLS policy blocking profile creation, returning default profile')
            const defaultProfile: Profile = {
              id: user.id,
              email: user.email?.toLowerCase() || '',
              full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
              avatar_url: null,
              referral_code: generateReferralCode(user.email || ''),
              referred_by: null,
              credits: 100,
              water_cleaned_liters: 0,
              subscription_plan: 'free',
              subscription_status: 'active',
              stripe_customer_id: null,
              referral_level: 1,
              total_referral_earnings: 0,
              pending_payout: 0,
              language: 'en',
              is_admin: false,
              is_mock: true, // Mark as mock to indicate it's not stored in DB
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
            return { data: defaultProfile, error: null }
          }
          return { data: null, error: { message: createError.message } }
        }

        // Fetch the newly created profile
        const { data: newProfile, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (fetchError) {
          return { data: null, error: { message: fetchError.message } }
        }

        return { data: newProfile, error: null }
      }

      return { data: null, error: { message: error.message } }
    }

    return { data: profile, error: null }
  } catch (error: any) {
    return { data: null, error: { message: error.message || 'An unexpected error occurred' } }
  }
}

// Update profile
export async function updateProfile(updates: Partial<Profile>) {
  try {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: { message: 'Not authenticated' } }
    }

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)

    if (error) {
      return { error: { message: error.message } }
    }

    return { error: null }
  } catch (error: any) {
    return { error: { message: error.message || 'An unexpected error occurred' } }
  }
}

// Check auth state changes
export function onAuthStateChange(callback: (event: string, session: any) => void) {
  return supabase.auth.onAuthStateChange(callback)
}

// Get current session
export async function getSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  } catch (error: any) {
    return { session: null, error: { message: error.message || 'An unexpected error occurred' } }
  }
}
