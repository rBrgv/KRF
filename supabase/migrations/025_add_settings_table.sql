-- ============================================================================
-- SETTINGS TABLE
-- ============================================================================
-- Stores system-wide configuration settings
-- ============================================================================

CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  category TEXT NOT NULL DEFAULT 'general' CHECK (category IN ('gym', 'email', 'notification', 'system', 'general')),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);
CREATE INDEX IF NOT EXISTS idx_settings_category ON settings(category);

-- Enable RLS
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can view and modify settings
CREATE POLICY "Admins can view settings"
  ON settings
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert settings"
  ON settings
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update settings"
  ON settings
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete settings"
  ON settings
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Trigger for updated_at
CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default settings
-- ============================================================================
INSERT INTO settings (key, value, category, description) VALUES
  -- Gym Information
  ('gym_name', 'KR Fitness Studio', 'gym', 'Gym/Studio name'),
  ('gym_address', '', 'gym', 'Gym physical address'),
  ('gym_phone', '+91 6361079633', 'gym', 'Gym contact phone number'),
  ('gym_email', 'krpersonalfitnessstudio@gmail.com', 'gym', 'Gym contact email'),
  ('gym_website', 'https://krfitnessstudio.com', 'gym', 'Gym website URL'),
  
  -- Email Settings
  ('email_from', 'KR Fitness <no-reply@sbconsulting.cloud>', 'email', 'Default email sender address'),
  ('email_trainer_name', 'Coach Keerthi Raj', 'email', 'Trainer name for email signature'),
  ('email_signature_phone', '+91 6361079633', 'email', 'Phone number for email signature'),
  
  -- Notification Settings
  ('notification_appointment_reminder_hours', '24', 'notification', 'Hours before appointment to send reminder'),
  ('notification_payment_reminder_days', '7', 'notification', 'Days before payment due to send reminder'),
  ('notification_membership_expiry_days', '7', 'notification', 'Days before membership expiry to send reminder'),
  ('notification_enabled', 'true', 'notification', 'Enable/disable automated notifications'),
  
  -- System Settings
  ('timezone', 'Asia/Kolkata', 'system', 'System timezone'),
  ('currency', 'INR', 'system', 'Currency code'),
  ('date_format', 'DD/MM/YYYY', 'system', 'Date display format')
ON CONFLICT (key) DO NOTHING;



