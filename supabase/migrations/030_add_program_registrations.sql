-- ============================================================================
-- PROGRAM REGISTRATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS program_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_name TEXT NOT NULL, -- '4-week-starter' or 'master-transformation'
  program_title TEXT NOT NULL, -- Display name
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  city TEXT,
  source TEXT DEFAULT 'website',
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  referrer TEXT,
  status TEXT DEFAULT 'pending',
  amount_in_inr INTEGER NOT NULL,
  payment_mode TEXT,
  payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_program_registrations_program_name ON program_registrations(program_name);
CREATE INDEX IF NOT EXISTS idx_program_registrations_status ON program_registrations(status);
CREATE INDEX IF NOT EXISTS idx_program_registrations_payment_id ON program_registrations(payment_id);

-- Updated_at trigger
CREATE TRIGGER update_program_registrations_updated_at
  BEFORE UPDATE ON program_registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE program_registrations IS 'Stores registrations for paid programs (4-week starter, master transformation)';
COMMENT ON COLUMN program_registrations.program_name IS 'Program identifier: 4-week-starter or master-transformation';
COMMENT ON COLUMN program_registrations.program_title IS 'Display name of the program';
COMMENT ON COLUMN program_registrations.status IS 'pending, confirmed, or cancelled';



