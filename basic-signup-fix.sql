-- ===================================================================
-- MIKY.AI BASIC SIGNUP FIX - NO COMPLEX SYNTAX
-- ===================================================================

-- 1. ADD MISSING COLUMNS TO PROFILES TABLE
-- ===================================================================

-- Add email_verified column if missing
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;

-- Add verification_token column if missing
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS verification_token TEXT;

-- Add verification_token_expires column if missing
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS verification_token_expires TIMESTAMPTZ;

-- Add last_sign_in_at column if missing
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS last_sign_in_at TIMESTAMPTZ;

-- Add paypal_email column if missing
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS paypal_email TEXT;

-- 2. DROP PROBLEMATIC TRIGGER TEMPORARILY
-- ===================================================================

-- Remove existing trigger that's causing issues
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 3. SUCCESS - NOW TEST SIGNUP WITHOUT TRIGGER
-- ===================================================================

SELECT 'Basic signup fix completed - columns added to profiles table' as result;
