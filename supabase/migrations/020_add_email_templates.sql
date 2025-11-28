-- ============================================================================
-- EMAIL TEMPLATES TABLE
-- ============================================================================
-- Stores custom email templates that can override or extend default templates
-- Default templates are defined in code (lib/email-templates.ts)
-- Custom templates stored here can be managed by admins

CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('appointment_reminder', 'lead_followup', 'lead_welcome', 'payment_reminder', 'membership_renewal', 'custom')),
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  variables JSONB DEFAULT '[]'::jsonb, -- Array of variable names like ["name", "date", "time"]
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false, -- If true, this template will be used instead of the code default
  created_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_templates_type ON email_templates(type);
CREATE INDEX IF NOT EXISTS idx_email_templates_active ON email_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_email_templates_default ON email_templates(type, is_default) WHERE is_default = true;

-- Trigger for updated_at
CREATE TRIGGER update_email_templates_updated_at
  BEFORE UPDATE ON email_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comment
COMMENT ON TABLE email_templates IS 'Custom email templates that can override default templates. Default templates are defined in code.';
COMMENT ON COLUMN email_templates.is_default IS 'If true, this template will be used instead of the default template with the same type';
COMMENT ON COLUMN email_templates.variables IS 'JSON array of variable names that can be replaced in the template (e.g., ["name", "date", "time"])';



