export type Persona = 'academic' | 'marketer' | 'engineer' | 'coach' | 'sensei' | 'lawyer' | 'medical' | 'god-mode' | 'richman' | 'general';

export type Plan = 'free' | 'plus' | 'business';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  credits: number;
  plan: Plan;
  referralCode: string;
  referralsCount: number;
  cashEarned: number;
  language: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  persona?: Persona;
  creditsConsumed: number;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  title: string;
  persona: Persona;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  type: 'subscription' | 'credits' | 'referral' | 'cashout';
  amount: number;
  credits: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  createdAt: Date;
}

export interface ChatRequest {
  message: string;
  persona?: Persona;
  conversationId?: string;
}

export interface ChatResponse {
  message: string;
  conversation: Conversation;
  creditsConsumed: number;
  remainingCredits: number;
}

export interface PersonaCosts {
  [key: string]: number;
}

export interface ReferralStats {
  totalInvites: number;
  successfulSignups: number;
  creditsEarned: number;
  cashEarned: number;
  cashAvailable: number;
}