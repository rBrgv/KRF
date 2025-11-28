-- ============================================================================
-- PROGRESS TRACKING, GOALS, AND ENHANCED FEATURES FOR ONLINE CLIENTS
-- ============================================================================
-- This migration adds comprehensive tracking features essential for online coaching

-- 1. BODY MEASUREMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS body_measurements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  weight_kg NUMERIC(5, 2) CHECK (weight_kg >= 0),
  body_fat_percentage NUMERIC(5, 2) CHECK (body_fat_percentage >= 0 AND body_fat_percentage <= 100),
  waist_cm NUMERIC(6, 2) CHECK (waist_cm >= 0),
  chest_cm NUMERIC(6, 2) CHECK (chest_cm >= 0),
  arms_cm NUMERIC(6, 2) CHECK (arms_cm >= 0),
  thighs_cm NUMERIC(6, 2) CHECK (thighs_cm >= 0),
  hips_cm NUMERIC(6, 2) CHECK (hips_cm >= 0),
  neck_cm NUMERIC(6, 2) CHECK (neck_cm >= 0),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(client_id, date) -- One measurement per client per day
);

CREATE INDEX IF NOT EXISTS idx_body_measurements_client_id ON body_measurements(client_id);
CREATE INDEX IF NOT EXISTS idx_body_measurements_date ON body_measurements(date DESC);
CREATE INDEX IF NOT EXISTS idx_body_measurements_client_date ON body_measurements(client_id, date DESC);

-- 2. PROGRESS PHOTOS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS progress_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  date DATE NOT NULL,
  view_type TEXT NOT NULL CHECK (view_type IN ('front', 'side', 'back', 'other')),
  notes TEXT,
  is_milestone BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_progress_photos_client_id ON progress_photos(client_id);
CREATE INDEX IF NOT EXISTS idx_progress_photos_date ON progress_photos(date DESC);
CREATE INDEX IF NOT EXISTS idx_progress_photos_client_date ON progress_photos(client_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_progress_photos_milestone ON progress_photos(client_id, is_milestone) WHERE is_milestone = true;

-- 3. CLIENT GOALS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS client_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  goal_type TEXT NOT NULL CHECK (goal_type IN ('weight_loss', 'weight_gain', 'muscle_gain', 'strength', 'endurance', 'body_fat', 'measurements', 'custom')),
  title TEXT NOT NULL,
  description TEXT,
  target_value NUMERIC(10, 2),
  current_value NUMERIC(10, 2) DEFAULT 0,
  target_date DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_client_goals_client_id ON client_goals(client_id);
CREATE INDEX IF NOT EXISTS idx_client_goals_status ON client_goals(status);
CREATE INDEX IF NOT EXISTS idx_client_goals_client_status ON client_goals(client_id, status);
CREATE INDEX IF NOT EXISTS idx_client_goals_target_date ON client_goals(target_date);

-- 4. ACHIEVEMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL CHECK (achievement_type IN ('workouts_completed', 'nutrition_logged', 'weight_loss', 'strength_milestone', 'attendance_perfect', 'goal_reached', 'custom')),
  title TEXT NOT NULL,
  description TEXT,
  badge_url TEXT,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_achievements_client_id ON achievements(client_id);
CREATE INDEX IF NOT EXISTS idx_achievements_earned_at ON achievements(earned_at DESC);
CREATE INDEX IF NOT EXISTS idx_achievements_client_earned ON achievements(client_id, earned_at DESC);

-- 5. PROGRESS REPORTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS progress_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  report_type TEXT NOT NULL DEFAULT 'monthly' CHECK (report_type IN ('weekly', 'monthly', 'quarterly', 'custom')),
  pdf_url TEXT,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  generated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_progress_reports_client_id ON progress_reports(client_id);
CREATE INDEX IF NOT EXISTS idx_progress_reports_period ON progress_reports(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_progress_reports_generated_at ON progress_reports(generated_at DESC);

-- 6. WATER INTAKE LOGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS water_intake_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  amount_ml INTEGER NOT NULL DEFAULT 0 CHECK (amount_ml >= 0),
  goal_ml INTEGER DEFAULT 2000 CHECK (goal_ml > 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(client_id, date) -- One log per client per day
);

CREATE INDEX IF NOT EXISTS idx_water_intake_client_id ON water_intake_logs(client_id);
CREATE INDEX IF NOT EXISTS idx_water_intake_date ON water_intake_logs(date DESC);
CREATE INDEX IF NOT EXISTS idx_water_intake_client_date ON water_intake_logs(client_id, date DESC);

-- 7. RECIPES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  calories NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (calories >= 0),
  protein_g NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (protein_g >= 0),
  carbs_g NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (carbs_g >= 0),
  fats_g NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (fats_g >= 0),
  servings INTEGER DEFAULT 1 CHECK (servings > 0),
  prep_time_minutes INTEGER CHECK (prep_time_minutes >= 0),
  cook_time_minutes INTEGER CHECK (cook_time_minutes >= 0),
  ingredients TEXT[],
  instructions TEXT,
  image_url TEXT,
  dietary_tags TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recipes_meal_type ON recipes(meal_type);
CREATE INDEX IF NOT EXISTS idx_recipes_featured ON recipes(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_recipes_name ON recipes(name);

-- 8. CLIENT FAVORITE RECIPES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS client_favorite_recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(client_id, recipe_id) -- One favorite per client per recipe
);

CREATE INDEX IF NOT EXISTS idx_client_favorite_recipes_client_id ON client_favorite_recipes(client_id);
CREATE INDEX IF NOT EXISTS idx_client_favorite_recipes_recipe_id ON client_favorite_recipes(recipe_id);

-- 9. ENHANCE EXERCISES TABLE WITH VIDEO URL
-- ============================================================================
ALTER TABLE exercises 
ADD COLUMN IF NOT EXISTS video_url TEXT,
ADD COLUMN IF NOT EXISTS form_notes TEXT;

-- 10. ENHANCE WORKOUT COMPLETION LOGS WITH NOTES
-- ============================================================================
ALTER TABLE workout_completion_logs
ADD COLUMN IF NOT EXISTS trainer_notes TEXT,
ADD COLUMN IF NOT EXISTS client_notes TEXT,
ADD COLUMN IF NOT EXISTS form_feedback TEXT;

-- 11. ENHANCE WORKOUT PLAN EXERCISES WITH REST TIMER
-- ============================================================================
ALTER TABLE workout_plan_exercises
ADD COLUMN IF NOT EXISTS rest_seconds INTEGER DEFAULT 60 CHECK (rest_seconds >= 0);

-- 12. ADD ONLINE CLIENT FLAG TO CLIENTS TABLE
-- ============================================================================
ALTER TABLE clients
ADD COLUMN IF NOT EXISTS is_online_client BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'Asia/Kolkata';

CREATE INDEX IF NOT EXISTS idx_clients_is_online ON clients(is_online_client) WHERE is_online_client = true;

-- Triggers for updated_at
-- ============================================================================
CREATE TRIGGER update_body_measurements_updated_at
  BEFORE UPDATE ON body_measurements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_progress_photos_updated_at
  BEFORE UPDATE ON progress_photos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_client_goals_updated_at
  BEFORE UPDATE ON client_goals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_water_intake_logs_updated_at
  BEFORE UPDATE ON water_intake_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recipes_updated_at
  BEFORE UPDATE ON recipes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comments
-- ============================================================================
COMMENT ON TABLE body_measurements IS 'Tracks body measurements for clients over time';
COMMENT ON TABLE progress_photos IS 'Stores progress photos uploaded by clients';
COMMENT ON TABLE client_goals IS 'Client fitness goals with tracking';
COMMENT ON TABLE achievements IS 'Client achievements and milestones';
COMMENT ON TABLE progress_reports IS 'Generated progress reports (PDF)';
COMMENT ON TABLE water_intake_logs IS 'Daily water intake tracking';
COMMENT ON TABLE recipes IS 'Recipe library for meal plans';
COMMENT ON TABLE client_favorite_recipes IS 'Client favorite recipes';



