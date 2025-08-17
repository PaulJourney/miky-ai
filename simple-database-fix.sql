-- ===================================================================
-- MIKY.AI SIMPLIFIED DATABASE FIX
-- ===================================================================
-- This script fixes the immediate signup issue by adding missing columns
-- and creating a simple, working handle_new_user function
-- ===================================================================

-- 1. ADD MISSING COLUMNS TO PROFILES TABLE
-- ===================================================================

-- Add missing columns to profiles table if they don't exist
DO $$
BEGIN
    -- Check and add missing columns one by one
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'email_verified') THEN
        ALTER TABLE profiles ADD COLUMN email_verified BOOLEAN DEFAULT false;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'verification_token') THEN
        ALTER TABLE profiles ADD COLUMN verification_token TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'verification_token_expires') THEN
        ALTER TABLE profiles ADD COLUMN verification_token_expires TIMESTAMPTZ;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'last_sign_in_at') THEN
        ALTER TABLE profiles ADD COLUMN last_sign_in_at TIMESTAMPTZ;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'paypal_email') THEN
        ALTER TABLE profiles ADD COLUMN paypal_email TEXT;
    END IF;
END $$;

-- 2. CREATE SIMPLE REFERRAL CODE GENERATION FUNCTION
-- ===================================================================

CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS
$$
DECLARE
    new_code TEXT;
BEGIN
    -- Generate simple 8-character code using random and timestamp
    new_code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT || NOW()::TEXT), 1, 8));
    RETURN new_code;
END;
$$;

-- 3. CREATE FIXED HANDLE_NEW_USER FUNCTION
-- ===================================================================

-- Drop existing function and recreate with safer approach
DROP FUNCTION IF EXISTS handle_new_user();

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS
$$
DECLARE
    referrer_code TEXT;
    bonus_credits INTEGER := 0;
BEGIN
    -- Generate referral code
    referrer_code := generate_referral_code();

    -- Check if user was referred
    IF NEW.raw_user_meta_data->>'referred_by' IS NOT NULL THEN
        bonus_credits := 200;
    END IF;

    -- Insert profile with only the columns we know exist
    INSERT INTO public.profiles (
        id,
        email,
        full_name,
        credits,
        water_cleaned_liters,
        subscription_plan,
        subscription_status,
        referral_code,
        referred_by,
        referral_level,
        total_referral_earnings,
        pending_payout,
        language,
        is_admin,
        is_mock,
        email_verified,
        created_at,
        updated_at
    ) VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        100 + bonus_credits,
        0,
        'free',
        'active',
        referrer_code,
        NEW.raw_user_meta_data->>'referred_by',
        1,
        0,
        0,
        'en',
        false,
        false,
        false,
        NOW(),
        NOW()
    );

    RETURN NEW;
END;
$$;

-- 4. RECREATE AUTH TRIGGER
-- ===================================================================

-- Drop and recreate the auth trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 5. SUCCESS MESSAGE
-- ===================================================================

DO $$
BEGIN
    RAISE NOTICE '✅ SIGNUP FIX COMPLETED!';
    RAISE NOTICE '📝 Added missing columns to profiles table';
    RAISE NOTICE '🔧 Created working handle_new_user function';
    RAISE NOTICE '⚡ Recreated auth trigger';
    RAISE NOTICE '🎯 Signup should now work correctly!';
END $$;
