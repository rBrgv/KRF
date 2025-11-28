-- ============================================================================
-- SEED TEST DATA
-- ============================================================================
-- This migration creates sample data for testing:
-- - 5 leads with various statuses
-- - 3 clients (converted from leads)
-- - Appointments for clients
-- - Events and registrations
-- - Payments
-- ============================================================================

-- Clear existing test data (optional - comment out if you want to keep existing data)
-- DELETE FROM payments WHERE provider = 'test';
-- DELETE FROM event_registrations;
-- DELETE FROM appointments;
-- DELETE FROM clients;
-- DELETE FROM leads;

-- ============================================================================
-- 1. LEADS
-- ============================================================================
INSERT INTO leads (id, name, email, phone, goal, source, status, notes, created_at) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Rajesh Kumar', 'rajesh.kumar@example.com', '9876543210', 'Weight Loss', 'Website', 'new', 'Interested in weight loss program. Wants to lose 10kg in 3 months.', NOW() - INTERVAL '5 days'),
  ('00000000-0000-0000-0000-000000000002', 'Priya Sharma', 'priya.sharma@example.com', '9876543211', 'Muscle Gain', 'Instagram', 'contacted', 'Followed up via WhatsApp. Interested in strength training.', NOW() - INTERVAL '4 days'),
  ('00000000-0000-0000-0000-000000000003', 'Amit Patel', 'amit.patel@example.com', '9876543212', 'General Fitness', 'Referral', 'converted', 'Converted to client. Started Silver program.', NOW() - INTERVAL '3 days'),
  ('00000000-0000-0000-0000-000000000004', 'Sneha Reddy', 'sneha.reddy@example.com', '9876543213', 'Rehabilitation', 'Google Ads', 'contacted', 'Has knee injury. Needs rehab program.', NOW() - INTERVAL '2 days'),
  ('00000000-0000-0000-0000-000000000005', 'Vikram Singh', 'vikram.singh@example.com', '9876543214', 'Weight Loss', 'Facebook', 'not_interested', 'Not interested in joining right now. Will follow up in 3 months.', NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 2. CLIENTS (Converted from leads)
-- ============================================================================
INSERT INTO clients (id, lead_id, name, email, phone, goal, program_start_date, subscription_type, program_type, notes, created_at) VALUES
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'Amit Patel', 'amit.patel@example.com', '9876543212', 'General Fitness', CURRENT_DATE - INTERVAL '2 days', 'monthly', 'silver', 'Active client. Regular attendance.', NOW() - INTERVAL '3 days'),
  ('10000000-0000-0000-0000-000000000002', NULL, 'Anjali Mehta', 'anjali.mehta@example.com', '9876543215', 'Weight Loss', CURRENT_DATE - INTERVAL '30 days', '3_month', 'weight_loss', 'Doing well. Lost 5kg so far.', NOW() - INTERVAL '30 days'),
  ('10000000-0000-0000-0000-000000000003', NULL, 'Rahul Verma', 'rahul.verma@example.com', '9876543216', 'Strength & Conditioning', CURRENT_DATE - INTERVAL '15 days', 'monthly', 'gold', 'Focused on strength training. Progressing well.', NOW() - INTERVAL '15 days')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 3. APPOINTMENTS
-- ============================================================================
INSERT INTO appointments (id, client_id, title, date, start_time, end_time, type, notes, created_at) VALUES
  -- Upcoming appointments
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Personal Training Session', CURRENT_DATE + INTERVAL '1 day', '10:00:00', '11:00:00', 'personal_training', 'Focus on upper body strength', NOW()),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'Weight Loss Consultation', CURRENT_DATE + INTERVAL '2 days', '14:00:00', '15:00:00', 'consultation', 'Review progress and adjust plan', NOW()),
  ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003', 'Strength Training', CURRENT_DATE + INTERVAL '3 days', '18:00:00', '19:00:00', 'personal_training', 'Leg day focus', NOW()),
  ('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', 'Group Class', CURRENT_DATE + INTERVAL '5 days', '09:00:00', '10:00:00', 'group_class', 'HIIT class', NOW()),
  -- Past appointments
  ('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000001', 'Personal Training', CURRENT_DATE - INTERVAL '1 day', '10:00:00', '11:00:00', 'personal_training', 'Completed upper body workout', NOW() - INTERVAL '1 day'),
  ('20000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000002', 'Weight Loss Session', CURRENT_DATE - INTERVAL '2 days', '14:00:00', '15:00:00', 'personal_training', 'Good progress shown', NOW() - INTERVAL '2 days')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 4. EVENTS
-- ============================================================================
-- Note: image_url column may not exist if migration 002 hasn't run yet
-- Using COALESCE to handle both cases
INSERT INTO events (id, title, slug, description, location, start_datetime, end_datetime, price_in_inr, max_capacity, is_active, created_at) VALUES
  ('30000000-0000-0000-0000-000000000001', 'Yoga Workshop', 'yoga-workshop-2024', 'A comprehensive yoga workshop for beginners and intermediate practitioners', 'Main Studio', NOW() + INTERVAL '7 days', NOW() + INTERVAL '7 days' + INTERVAL '2 hours', 1500, 20, true, NOW()),
  ('30000000-0000-0000-0000-000000000002', 'Nutrition Seminar', 'nutrition-seminar-2024', 'Learn about balanced nutrition and meal planning', 'Conference Room', NOW() + INTERVAL '14 days', NOW() + INTERVAL '14 days' + INTERVAL '3 hours', 2000, 30, true, NOW()),
  ('30000000-0000-0000-0000-000000000003', 'HIIT Bootcamp', 'hiit-bootcamp-2024', 'High-intensity interval training bootcamp', 'Outdoor Area', NOW() + INTERVAL '21 days', NOW() + INTERVAL '21 days' + INTERVAL '1 hour', 1000, 25, true, NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 5. EVENT REGISTRATIONS
-- ============================================================================
INSERT INTO event_registrations (id, event_id, name, email, phone, city, payment_id, created_at) VALUES
  ('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'Rajesh Kumar', 'rajesh.kumar@example.com', '9876543210', 'Bangalore', NULL, NOW()),
  ('40000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', 'Priya Sharma', 'priya.sharma@example.com', '9876543211', 'Bangalore', NULL, NOW()),
  ('40000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000002', 'Amit Patel', 'amit.patel@example.com', '9876543212', 'Bangalore', NULL, NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 6. PAYMENTS
-- ============================================================================
-- Note: payments table doesn't have client_id directly, linked via event_registrations
INSERT INTO payments (id, provider, provider_order_id, provider_payment_id, status, amount_in_inr, currency, created_at) VALUES
  ('50000000-0000-0000-0000-000000000001', 'razorpay', 'order_test_001', 'pay_test_001', 'completed', 5000, 'INR', NOW() - INTERVAL '10 days'),
  ('50000000-0000-0000-0000-000000000002', 'razorpay', 'order_test_002', 'pay_test_002', 'completed', 3000, 'INR', NOW() - INTERVAL '5 days'),
  ('50000000-0000-0000-0000-000000000003', 'razorpay', 'order_test_003', 'pay_test_003', 'pending', 2000, 'INR', NOW() - INTERVAL '2 days'),
  ('50000000-0000-0000-0000-000000000004', 'razorpay', 'order_test_004', 'pay_test_004', 'completed', 1500, 'INR', NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- Link payments to event registrations
UPDATE event_registrations 
SET payment_id = '50000000-0000-0000-0000-000000000004'
WHERE id = '40000000-0000-0000-0000-000000000001';

UPDATE event_registrations 
SET payment_id = '50000000-0000-0000-0000-000000000001'
WHERE id = '40000000-0000-0000-0000-000000000002';

-- ============================================================================
-- 7. RECURRING SESSIONS (if needed)
-- ============================================================================
INSERT INTO recurring_sessions (id, client_id, days_of_week, start_time, duration_minutes, title, notes, is_active, created_at) VALUES
  ('60000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', ARRAY[1, 3, 5], '10:00:00', 60, 'Morning Training', 'Monday, Wednesday, Friday morning sessions', true, NOW()),
  ('60000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', ARRAY[2, 4], '18:00:00', 45, 'Evening Workout', 'Tuesday and Thursday evening sessions', true, NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 8. ATTENDANCE LOGS (sample)
-- ============================================================================
INSERT INTO attendance_logs (id, client_id, appointment_id, check_in_time, check_out_time, source, notes, created_at) VALUES
  ('70000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000005', NOW() - INTERVAL '1 day' + INTERVAL '10 hours', NOW() - INTERVAL '1 day' + INTERVAL '11 hours', 'manual', 'Completed full session', NOW() - INTERVAL '1 day'),
  ('70000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000006', NOW() - INTERVAL '2 days' + INTERVAL '14 hours', NOW() - INTERVAL '2 days' + INTERVAL '15 hours', 'manual', 'Good session', NOW() - INTERVAL '2 days')
ON CONFLICT (id) DO NOTHING;

