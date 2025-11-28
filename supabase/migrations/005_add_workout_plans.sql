-- ============================================================================
-- WORKOUT PLAN SYSTEM
-- ============================================================================

-- 1. EXERCISES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('push', 'pull', 'legs', 'full_body', 'cardio', 'core', 'flexibility', 'other')),
  equipment TEXT NOT NULL CHECK (equipment IN ('dumbbells', 'barbell', 'bodyweight', 'machine', 'cable', 'kettlebell', 'resistance_band', 'other')),
  muscle_group TEXT NOT NULL CHECK (muscle_group IN ('chest', 'back', 'shoulders', 'biceps', 'triceps', 'legs', 'glutes', 'core', 'cardio', 'full_body', 'other')),
  description TEXT,
  demo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exercises_category ON exercises(category);
CREATE INDEX IF NOT EXISTS idx_exercises_equipment ON exercises(equipment);
CREATE INDEX IF NOT EXISTS idx_exercises_muscle_group ON exercises(muscle_group);

-- 2. WORKOUT PLANS TABLE
-- ============================================================================
-- Drop old workout_plans table if it exists (from initial schema - different structure)
-- Note: This will delete any existing data. If you need to preserve data, migrate it first.
DROP TABLE IF EXISTS workout_plans CASCADE;

CREATE TABLE workout_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  goal_type TEXT NOT NULL CHECK (goal_type IN ('weight_loss', 'strength', 'muscle_gain', 'general_fitness', 'rehab', 'endurance', 'flexibility', 'other')),
  level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  notes TEXT,
  created_by UUID, -- Future: reference to users table for multi-trainer support
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_workout_plans_goal_type ON workout_plans(goal_type);
CREATE INDEX idx_workout_plans_level ON workout_plans(level);

-- 3. WORKOUT PLAN DAYS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS workout_plan_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_plan_id UUID NOT NULL REFERENCES workout_plans(id) ON DELETE CASCADE,
  day_index INTEGER NOT NULL CHECK (day_index > 0),
  title TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workout_plan_id, day_index)
);

CREATE INDEX IF NOT EXISTS idx_workout_plan_days_plan_id ON workout_plan_days(workout_plan_id);
CREATE INDEX IF NOT EXISTS idx_workout_plan_days_day_index ON workout_plan_days(day_index);

-- 4. WORKOUT PLAN EXERCISES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS workout_plan_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_plan_day_id UUID NOT NULL REFERENCES workout_plan_days(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE RESTRICT,
  sets INTEGER NOT NULL CHECK (sets > 0),
  reps TEXT NOT NULL, -- e.g., "8-10", "12", "AMRAP"
  rest_seconds INTEGER DEFAULT 60 CHECK (rest_seconds >= 0),
  order_index INTEGER NOT NULL DEFAULT 0, -- For ordering exercises within a day
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workout_plan_exercises_day_id ON workout_plan_exercises(workout_plan_day_id);
CREATE INDEX IF NOT EXISTS idx_workout_plan_exercises_exercise_id ON workout_plan_exercises(exercise_id);
CREATE INDEX IF NOT EXISTS idx_workout_plan_exercises_order ON workout_plan_exercises(workout_plan_day_id, order_index);

-- 5. CLIENT WORKOUT ASSIGNMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS client_workout_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  workout_plan_id UUID NOT NULL REFERENCES workout_plans(id) ON DELETE RESTRICT,
  start_date DATE NOT NULL,
  end_date DATE, -- Nullable for ongoing plans
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_client_workout_assignments_client_id ON client_workout_assignments(client_id);
CREATE INDEX IF NOT EXISTS idx_client_workout_assignments_plan_id ON client_workout_assignments(workout_plan_id);
CREATE INDEX IF NOT EXISTS idx_client_workout_assignments_active ON client_workout_assignments(client_id, is_active);

-- 6. WORKOUT COMPLETION LOGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS workout_completion_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  workout_plan_id UUID NOT NULL REFERENCES workout_plans(id) ON DELETE RESTRICT,
  workout_plan_day_id UUID NOT NULL REFERENCES workout_plan_days(id) ON DELETE RESTRICT,
  date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('completed', 'partially_completed', 'skipped')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(client_id, workout_plan_day_id, date) -- One log per client/day/date
);

CREATE INDEX IF NOT EXISTS idx_workout_completion_logs_client_id ON workout_completion_logs(client_id);
CREATE INDEX IF NOT EXISTS idx_workout_completion_logs_plan_id ON workout_completion_logs(workout_plan_id);
CREATE INDEX IF NOT EXISTS idx_workout_completion_logs_date ON workout_completion_logs(date);
CREATE INDEX IF NOT EXISTS idx_workout_completion_logs_status ON workout_completion_logs(status);

-- Triggers for updated_at
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_exercises_updated_at
  BEFORE UPDATE ON exercises
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workout_plans_updated_at
  BEFORE UPDATE ON workout_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workout_plan_days_updated_at
  BEFORE UPDATE ON workout_plan_days
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workout_plan_exercises_updated_at
  BEFORE UPDATE ON workout_plan_exercises
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_client_workout_assignments_updated_at
  BEFORE UPDATE ON client_workout_assignments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workout_completion_logs_updated_at
  BEFORE UPDATE ON workout_completion_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

