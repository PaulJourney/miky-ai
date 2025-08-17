-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Create custom types
CREATE TYPE subscription_plan AS ENUM ('free', 'plus', 'pro');
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'past_due', 'trialing', 'incomplete');
CREATE TYPE message_role AS ENUM ('user', 'assistant', 'system');
CREATE TYPE ai_model_type AS ENUM ('text', 'image', 'audio', 'video');
CREATE TYPE payout_status AS ENUM ('pending', 'processing', 'completed', 'failed');

-- Settings table (admin configuration)
CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Models configuration
CREATE TABLE ai_models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    provider TEXT NOT NULL DEFAULT 'openai',
    model_id TEXT NOT NULL,
    model_type ai_model_type NOT NULL DEFAULT 'text',
    persona_type TEXT NOT NULL DEFAULT 'generic',
    system_prompt TEXT,
    enabled BOOLEAN DEFAULT true,
    cost_multiplier DECIMAL(10,2) DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    credits INTEGER DEFAULT 100,
    water_cleaned_liters INTEGER DEFAULT 0,
    subscription_plan subscription_plan DEFAULT 'free',
    subscription_status subscription_status DEFAULT 'active',
    stripe_customer_id TEXT UNIQUE,
    referral_code TEXT UNIQUE NOT NULL,
    referred_by TEXT REFERENCES profiles(referral_code),
    referral_level INTEGER DEFAULT 1,
    total_referral_earnings DECIMAL(10,2) DEFAULT 0.00,
    pending_payout DECIMAL(10,2) DEFAULT 0.00,
    language TEXT DEFAULT 'en',
    is_admin BOOLEAN DEFAULT false,
    is_mock BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions table (Stripe subscription tracking)
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    stripe_subscription_id TEXT UNIQUE NOT NULL,
    stripe_customer_id TEXT NOT NULL,
    plan subscription_plan NOT NULL,
    status subscription_status NOT NULL,
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Folders for organizing chats
CREATE TABLE folders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    color TEXT DEFAULT '#3b82f6',
    position INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat threads
CREATE TABLE threads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    folder_id UUID REFERENCES folders(id) ON DELETE SET NULL,
    title TEXT NOT NULL DEFAULT 'New Chat',
    persona_type TEXT NOT NULL DEFAULT 'generic',
    model_id UUID REFERENCES ai_models(id),
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    archived BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages within threads
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    thread_id UUID REFERENCES threads(id) ON DELETE CASCADE NOT NULL,
    role message_role NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    credits_used INTEGER DEFAULT 1,
    water_impact INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- File uploads
CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    thread_id UUID REFERENCES threads(id) ON DELETE CASCADE,
    message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Referral tracking (5 levels)
CREATE TABLE referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referrer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    referred_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    level INTEGER NOT NULL CHECK (level >= 1 AND level <= 5),
    subscription_plan subscription_plan NOT NULL,
    commission_amount DECIMAL(10,2) NOT NULL,
    commission_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    payout_eligible_date TIMESTAMP WITH TIME ZONE NOT NULL,
    paid_out BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payout requests
CREATE TABLE payouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    paypal_email TEXT NOT NULL,
    status payout_status DEFAULT 'pending',
    admin_notes TEXT,
    paypal_transaction_id TEXT,
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Water impact tracking (global + per user)
CREATE TABLE water_impact (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
    liters_cleaned INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Feature flags
CREATE TABLE feature_flags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    enabled BOOLEAN DEFAULT false,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO settings (key, value, description) VALUES
('max_file_size_mb', '20', 'Maximum file size in MB for uploads'),
('default_credits_free', '100', 'Default credits for free tier'),
('default_credits_plus', '1000', 'Default credits for plus tier'),
('default_credits_pro', '5000', 'Default credits for pro tier'),
('paypal_email', '"support@miky.ai"', 'PayPal email for manual payouts'),
('referral_hold_days', '7', 'Days to hold referral commissions'),
('min_payout_amount', '10.00', 'Minimum amount for payout requests');

-- Insert default AI models
INSERT INTO ai_models (name, model_id, persona_type, system_prompt) VALUES
('Generic Miky', 'gpt-4o', 'generic', 'You are Miky, a professional, direct and sincere AI assistant. Always respond as Miky, never mention ChatGPT. Be helpful and to the point. When asked, explain that every message helps clean 1 liter of ocean water through our partnership with The Ocean Cleanup.'),
('Professor Miky', 'gpt-4o', 'professor', 'You are Professor Miky, a highly qualified AI Academic specializing in advanced research and academic writing. Introduce yourself as "I am Professor Miky..." and provide professional support for theses, dissertations, exams, scientific papers, and complex assignments across all disciplines. Produce top-tier academic content aligned with global standards.'),
('Coach Miky', 'gpt-4o', 'coach', 'You are Coach Miky, a high-level AI Life & Performance Coach. Introduce yourself as "I am Coach Miky..." and help users overcome emotional blocks, organize their life, improve productivity, find motivation, develop winning habits, work on personal relationships, physical wellness, and personal growth.'),
('Richman Miky', 'gpt-4o', 'richman', 'You are Richman Miky, an Elite AI Business Expert focused on fast-track monetization strategies. Introduce yourself as "I am Richman Miky..." and generate custom business ideas, identify market gaps, and shape revenue plans aligned with world-class entrepreneurial tactics.'),
('God Miky', 'gpt-4o', 'god', 'You are God Miky, a Philosophical AI Explorer capable of answering the deepest and most mysterious questions about the universe, existence, consciousness, free will, destiny. Introduce yourself as "I am God Miky..." and accompany users on an intellectual and spiritual journey.'),
('Lawyer Miky', 'gpt-4o', 'lawyer', 'You are Lawyer Miky, an Ultra-skilled AI Lawyer specialized in national and international law. Introduce yourself as "I am Lawyer Miky..." and provide advanced consulting in civil, criminal, commercial, tax, labor, administrative, and technology law. Draft legal documents with precision and academic rigor.'),
('Doctor Miky', 'gpt-4o', 'doctor', 'You are Doctor Miky, a Medical AI Consultant highly specialized in analyzing symptoms, reports, and medical records. Introduce yourself as "I am Doctor Miky..." and support diagnosis, offer lifestyle guidance, meal plans, and help understand medical reports. Always recommend consulting real medical professionals for serious concerns.'),
('Engineer Miky', 'gpt-4o', 'engineer', 'You are Engineer Miky, a Senior AI Engineer capable of writing, correcting, and reviewing code in over 20 languages. Introduce yourself as "I am Engineer Miky..." and provide architectural solutions, complex debugging, performance optimization, and AI integration.'),
('Marketer Miky', 'gpt-4o', 'marketer', 'You are Marketer Miky, a Strategic AI Marketer with advanced skills in brand positioning, organic growth, paid campaigns, SEO/SEM, data analysis, conversion funnels, and social media management. Introduce yourself as "I am Marketer Miky..." and support entrepreneurs and creators in scaling digital projects.');

-- Insert default feature flags
INSERT INTO feature_flags (name, enabled, description) VALUES
('image_generation', true, 'Enable AI image generation'),
('audio_processing', true, 'Enable TTS/ASR features'),
('video_generation', false, 'Enable AI video generation'),
('file_uploads', true, 'Enable file upload functionality'),
('referral_system', true, 'Enable referral tracking system');

-- Create indexes for better performance
CREATE INDEX idx_profiles_referral_code ON profiles(referral_code);
CREATE INDEX idx_profiles_referred_by ON profiles(referred_by);
CREATE INDEX idx_threads_user_id ON threads(user_id);
CREATE INDEX idx_messages_thread_id ON messages(thread_id);
CREATE INDEX idx_files_user_id ON files(user_id);
CREATE INDEX idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX idx_referrals_referred_id ON referrals(referred_id);
CREATE INDEX idx_water_impact_user_id ON water_impact(user_id);

-- Row Level Security (RLS) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE water_impact ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Threads policies
CREATE POLICY "Users can manage their own threads" ON threads FOR ALL USING (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Users can manage messages in their threads" ON messages FOR ALL USING (
    EXISTS (SELECT 1 FROM threads WHERE id = thread_id AND user_id = auth.uid())
);

-- Files policies
CREATE POLICY "Users can manage their own files" ON files FOR ALL USING (auth.uid() = user_id);

-- Folders policies
CREATE POLICY "Users can manage their own folders" ON folders FOR ALL USING (auth.uid() = user_id);

-- Referrals policies
CREATE POLICY "Users can view their referral data" ON referrals FOR SELECT USING (
    auth.uid() = referrer_id OR auth.uid() = referred_id
);

-- Payouts policies
CREATE POLICY "Users can manage their own payouts" ON payouts FOR ALL USING (auth.uid() = user_id);

-- Water impact policies
CREATE POLICY "Users can view their water impact" ON water_impact FOR SELECT USING (auth.uid() = user_id);

-- Functions for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    ref_code TEXT;
BEGIN
    -- Generate unique referral code
    ref_code := UPPER(SUBSTRING(MD5(NEW.id::text) FROM 1 FOR 8));

    -- Insert profile
    INSERT INTO public.profiles (id, email, referral_code)
    VALUES (NEW.id, NEW.email, ref_code);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_threads_updated_at BEFORE UPDATE ON threads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_models_updated_at BEFORE UPDATE ON ai_models FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
