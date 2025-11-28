-- ============================================================================
-- SETUP CLIENT ACCOUNTS FOR TESTING
-- ============================================================================
-- This migration creates user accounts for existing test clients
-- Note: In production, clients would sign up themselves or be created by admins
-- ============================================================================

-- IMPORTANT: This migration creates auth users manually
-- In production, use Supabase Auth API or have clients sign up themselves
-- ============================================================================

-- For testing purposes, we'll create auth users and link them to clients
-- Note: Supabase doesn't allow direct INSERT into auth.users via SQL
-- You need to create users via Supabase Auth API or Dashboard

-- Instead, this migration provides instructions and sets up the linking
-- ============================================================================

-- Step 1: Create auth users via Supabase Dashboard or API
-- ============================================================================
-- Go to Supabase Dashboard > Authentication > Users > Add User
-- Or use the Supabase Auth API to create users
-- 
-- For test clients, create users with these emails:
-- 1. amit.patel@example.com (for Amit Patel - client ID: 10000000-0000-0000-0000-000000000001)
-- 2. anjali.mehta@example.com (for Anjali Mehta - client ID: 10000000-0000-0000-0000-000000000002)
-- 3. rahul.verma@example.com (for Rahul Verma - client ID: 10000000-0000-0000-0000-000000000003)
--
-- Set temporary passwords (clients can change them later)
-- ============================================================================

-- Step 2: After creating auth users, run this to link them to clients
-- ============================================================================
-- This function will link existing clients to auth users by email
-- ============================================================================
DO $$
DECLARE
  client_record RECORD;
  auth_user_id UUID;
BEGIN
  -- Link Amit Patel
  SELECT id INTO auth_user_id 
  FROM auth.users 
  WHERE email = 'amit.patel@example.com' 
  LIMIT 1;
  
  IF auth_user_id IS NOT NULL THEN
    UPDATE clients 
    SET user_id = auth_user_id 
    WHERE id = '10000000-0000-0000-0000-000000000001' 
    AND user_id IS NULL;
    
    -- Ensure profile has client role
    UPDATE user_profiles 
    SET role = 'client' 
    WHERE id = auth_user_id AND role != 'client';
  END IF;

  -- Link Anjali Mehta
  SELECT id INTO auth_user_id 
  FROM auth.users 
  WHERE email = 'anjali.mehta@example.com' 
  LIMIT 1;
  
  IF auth_user_id IS NOT NULL THEN
    UPDATE clients 
    SET user_id = auth_user_id 
    WHERE id = '10000000-0000-0000-0000-000000000002' 
    AND user_id IS NULL;
    
    UPDATE user_profiles 
    SET role = 'client' 
    WHERE id = auth_user_id AND role != 'client';
  END IF;

  -- Link Rahul Verma
  SELECT id INTO auth_user_id 
  FROM auth.users 
  WHERE email = 'rahul.verma@example.com' 
  LIMIT 1;
  
  IF auth_user_id IS NOT NULL THEN
    UPDATE clients 
    SET user_id = auth_user_id 
    WHERE id = '10000000-0000-0000-0000-000000000003' 
    AND user_id IS NULL;
    
    UPDATE user_profiles 
    SET role = 'client' 
    WHERE id = auth_user_id AND role != 'client';
  END IF;
END $$;

-- ============================================================================
-- ALTERNATIVE: Manual linking via SQL (if you know the auth user IDs)
-- ============================================================================
-- If you already created auth users and know their IDs, you can run:
--
-- UPDATE clients 
-- SET user_id = 'AUTH_USER_ID_HERE' 
-- WHERE id = 'CLIENT_ID_HERE';
--
-- UPDATE user_profiles 
-- SET role = 'client' 
-- WHERE id = 'AUTH_USER_ID_HERE';
-- ============================================================================




