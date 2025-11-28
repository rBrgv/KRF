-- ============================================================================
-- ATTENDANCE TRACKING SYSTEM
-- ============================================================================

-- ATTENDANCE LOGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS attendance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  check_in_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  check_out_time TIMESTAMPTZ,
  source TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'kiosk', 'app')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_attendance_logs_client_id ON attendance_logs(client_id);
CREATE INDEX IF NOT EXISTS idx_attendance_logs_appointment_id ON attendance_logs(appointment_id);
CREATE INDEX IF NOT EXISTS idx_attendance_logs_check_in_time ON attendance_logs(check_in_time);
CREATE INDEX IF NOT EXISTS idx_attendance_logs_check_out_time ON attendance_logs(check_out_time);
CREATE INDEX IF NOT EXISTS idx_attendance_logs_client_date ON attendance_logs(client_id, check_in_time);

-- Ensure only one open attendance log per appointment
-- (check_out_time IS NULL means session is still active)
CREATE UNIQUE INDEX IF NOT EXISTS idx_attendance_logs_open_appointment 
  ON attendance_logs(appointment_id) 
  WHERE check_out_time IS NULL AND appointment_id IS NOT NULL;

-- Trigger for updated_at
CREATE TRIGGER update_attendance_logs_updated_at
  BEFORE UPDATE ON attendance_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();




