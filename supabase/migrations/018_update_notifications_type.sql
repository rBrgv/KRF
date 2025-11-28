-- ============================================================================
-- UPDATE NOTIFICATIONS TYPE CHECK CONSTRAINT
-- ============================================================================
-- Add 'general' type to notifications type constraint

-- Drop the old constraint
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check;

-- Add the new constraint with 'general' type
ALTER TABLE notifications ADD CONSTRAINT notifications_type_check 
  CHECK (type IN ('appointment_reminder', 'payment_reminder', 'membership_expiry', 'general'));
