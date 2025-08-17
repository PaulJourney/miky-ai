-- Verifica Database Miky.ai - Script di Debug
-- Esegui questo script nel SQL Editor del dashboard Supabase

-- 1. Verifica se la tabella profiles esiste
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- 2. Verifica i trigger
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers
WHERE event_object_table = 'profiles';

-- 3. Verifica le policy RLS
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'profiles';

-- 4. Verifica se RLS è abilitata
SELECT schemaname, tablename, rowsecurity, forcerowsecurity
FROM pg_tables
WHERE tablename = 'profiles';

-- 5. Test di inserimento diretto (commenta se non vuoi testare)
-- INSERT INTO profiles (
--   id, email, full_name, credits, water_cleaned_liters,
--   subscription_plan, subscription_status, referral_level,
--   total_referral_earnings, pending_payout, language, is_admin, is_mock
-- ) VALUES (
--   gen_random_uuid(), 'test@example.com', 'Test User', 100, 0,
--   'free', 'active', 1, 0, 0, 'en', false, false
-- );
