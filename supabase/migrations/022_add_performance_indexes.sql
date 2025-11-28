-- ============================================================================
-- PERFORMANCE INDEXES
-- ============================================================================
-- Adding indexes for frequently queried columns to improve query performance
-- Uses DO blocks to safely check for table/column existence before creating indexes

-- Clients table indexes
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'clients') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'email') THEN
      CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email) WHERE email IS NOT NULL;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'phone') THEN
      CREATE INDEX IF NOT EXISTS idx_clients_phone ON clients(phone);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'user_id') THEN
      CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id) WHERE user_id IS NOT NULL;
    END IF;
  END IF;
END $$;

-- Nutrition logs indexes
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'nutrition_logs') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'nutrition_logs' AND column_name = 'client_id') THEN
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'nutrition_logs' AND column_name = 'date') THEN
        -- Drop existing index if it exists without DESC, then create with DESC
        DROP INDEX IF EXISTS idx_nutrition_logs_client_date;
        CREATE INDEX IF NOT EXISTS idx_nutrition_logs_client_date ON nutrition_logs(client_id, date DESC);
      END IF;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'nutrition_logs' AND column_name = 'date') THEN
      CREATE INDEX IF NOT EXISTS idx_nutrition_logs_date_desc ON nutrition_logs(date DESC);
    END IF;
  END IF;
END $$;

-- Food log entries indexes
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'food_log_entries') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'food_log_entries' AND column_name = 'meal_type') THEN
      CREATE INDEX IF NOT EXISTS idx_food_log_entries_meal_type ON food_log_entries(meal_type) WHERE meal_type IS NOT NULL;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'food_log_entries' AND column_name = 'nutrition_log_id') THEN
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'food_log_entries' AND column_name = 'meal_type') THEN
        CREATE INDEX IF NOT EXISTS idx_food_log_entries_nutrition_meal ON food_log_entries(nutrition_log_id, meal_type);
      END IF;
    END IF;
  END IF;
END $$;

-- Appointments indexes
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'appointments') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'client_id') THEN
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'date') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'start_time') THEN
          CREATE INDEX IF NOT EXISTS idx_appointments_client_date ON appointments(client_id, date, start_time);
        END IF;
      END IF;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'type') THEN
      CREATE INDEX IF NOT EXISTS idx_appointments_type ON appointments(type) WHERE type IS NOT NULL;
    END IF;
  END IF;
END $$;

-- Payments indexes
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'payments') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payments' AND column_name = 'client_id') THEN
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payments' AND column_name = 'created_at') THEN
        CREATE INDEX IF NOT EXISTS idx_payments_client_created ON payments(client_id, created_at DESC);
      END IF;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payments' AND column_name = 'status') THEN
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payments' AND column_name = 'created_at') THEN
        CREATE INDEX IF NOT EXISTS idx_payments_status_created ON payments(status, created_at DESC);
      END IF;
    END IF;
  END IF;
END $$;

-- Workout assignments indexes
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'client_workout_assignments') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'client_workout_assignments' AND column_name = 'client_id') THEN
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'client_workout_assignments' AND column_name = 'is_active') THEN
        CREATE INDEX IF NOT EXISTS idx_workout_assignments_client_active ON client_workout_assignments(client_id, is_active) WHERE is_active = true;
      END IF;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'client_workout_assignments' AND column_name = 'start_date') THEN
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'client_workout_assignments' AND column_name = 'end_date') THEN
        CREATE INDEX IF NOT EXISTS idx_workout_assignments_dates ON client_workout_assignments(start_date, end_date);
      END IF;
    END IF;
  END IF;
END $$;

-- Meal plan assignments indexes
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'client_meal_plan_assignments') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'client_meal_plan_assignments' AND column_name = 'client_id') THEN
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'client_meal_plan_assignments' AND column_name = 'is_active') THEN
        CREATE INDEX IF NOT EXISTS idx_meal_plan_assignments_client_active ON client_meal_plan_assignments(client_id, is_active) WHERE is_active = true;
      END IF;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'client_meal_plan_assignments' AND column_name = 'start_date') THEN
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'client_meal_plan_assignments' AND column_name = 'end_date') THEN
        CREATE INDEX IF NOT EXISTS idx_meal_plan_assignments_dates ON client_meal_plan_assignments(start_date, end_date);
      END IF;
    END IF;
  END IF;
END $$;

-- Workout completion logs indexes
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'workout_completion_logs') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workout_completion_logs' AND column_name = 'client_id') THEN
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workout_completion_logs' AND column_name = 'date') THEN
        CREATE INDEX IF NOT EXISTS idx_completion_logs_client_date ON workout_completion_logs(client_id, date DESC);
      END IF;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workout_completion_logs' AND column_name = 'status') THEN
      CREATE INDEX IF NOT EXISTS idx_completion_logs_status ON workout_completion_logs(status);
    END IF;
  END IF;
END $$;

-- Leads indexes (additional)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'leads') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'email') THEN
      CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email) WHERE email IS NOT NULL;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'phone') THEN
      CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads(phone);
    END IF;
  END IF;
END $$;

-- Comments (wrapped in DO blocks to handle cases where indexes might not exist)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_nutrition_logs_client_date') THEN
    COMMENT ON INDEX idx_nutrition_logs_client_date IS 'Optimizes queries for client nutrition logs by date';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_food_log_entries_nutrition_meal') THEN
    COMMENT ON INDEX idx_food_log_entries_nutrition_meal IS 'Optimizes grouping food entries by meal type';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_clients_email') THEN
    COMMENT ON INDEX idx_clients_email IS 'Optimizes client lookups by email';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_clients_phone') THEN
    COMMENT ON INDEX idx_clients_phone IS 'Optimizes client lookups by phone';
  END IF;
END $$;

