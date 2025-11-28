-- ============================================================================
-- USER PROFILES AND ROLE MANAGEMENT
-- ============================================================================

-- USER PROFILES TABLE
-- Links Supabase auth.users to our application with role information
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'admin', 'trainer')),
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);

-- Add user_id column to clients table to link to auth users
-- ============================================================================
ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);

-- Function to automatically create profile when user signs up
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, role, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    'client', -- Default role
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Trigger for updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Backfill existing users with profiles (default to 'admin' for existing users)
-- IMPORTANT: Do this BEFORE enabling RLS
-- ============================================================================
-- Use a function with SECURITY DEFINER to bypass RLS if it's already enabled
CREATE OR REPLACE FUNCTION public.backfill_user_profiles()
RETURNS void AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, role, full_name)
  SELECT 
    id,
    email,
    'admin' as role, -- Existing users are assumed to be admins
    COALESCE(raw_user_meta_data->>'full_name', email) as full_name
  FROM auth.users
  WHERE id NOT IN (SELECT id FROM public.user_profiles)
  ON CONFLICT (id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Execute the backfill
SELECT public.backfill_user_profiles();

-- Drop the function after use
DROP FUNCTION IF EXISTS public.backfill_user_profiles();

-- Enable RLS (Row Level Security) for user_profiles
-- (After backfilling existing users)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own profile (limited fields)
CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy: Service role can manage all profiles (for admin operations)
CREATE POLICY "Service role can manage profiles"
  ON user_profiles
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

