import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'your-supabase-url'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Types based on our database schema
export interface User {
  id: string
  email: string
  first_name?: string
  last_name?: string
  credits: number
  plan: 'FREE' | 'PLUS' | 'BUSINESS'
  referral_code: string
  referred_by?: string
  referrals_count: number
  cash_earned: number
  cash_paid_out: number
  language: string
  email_verified: boolean
  stripe_customer_id?: string
  subscription_id?: string
  subscription_status?: string
  created_at: string
  updated_at: string
}

export interface Conversation {
  id: string
  user_id: string
  title: string
  persona: 'ACADEMIC' | 'MARKETER' | 'ENGINEER' | 'COACH' | 'SENSEI' | 'LAWYER' | 'MEDICAL' | 'GOD_MODE' | 'RICHMAN' | 'GENERAL'
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  conversation_id: string
  user_id: string
  content: string
  sender: 'USER' | 'ASSISTANT'
  persona?: string
  credits_consumed: number
  created_at: string
}

export interface Transaction {
  id: string
  user_id: string
  type: 'SUBSCRIPTION' | 'CREDITS' | 'REFERRAL' | 'CASHOUT'
  amount: number
  credits: number
  stripe_payment_intent_id?: string
  stripe_subscription_id?: string
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
  metadata?: string
  created_at: string
}

export interface Referral {
  id: string
  referrer_id: string
  referred_id: string
  credits_awarded: number
  cash_awarded: number
  processed: boolean
  created_at: string
}
