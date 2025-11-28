-- Create recurring_sessions table for client recurring session schedules
CREATE TABLE IF NOT EXISTS recurring_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  days_of_week INTEGER[] NOT NULL, -- Array of day numbers: 0=Sunday, 1=Monday, ..., 6=Saturday
  start_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60, -- Duration in minutes
  title TEXT,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_recurring_sessions_client_id ON recurring_sessions(client_id);
CREATE INDEX IF NOT EXISTS idx_recurring_sessions_is_active ON recurring_sessions(is_active);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_recurring_sessions_updated_at
  BEFORE UPDATE ON recurring_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();




