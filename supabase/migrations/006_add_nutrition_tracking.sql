-- ============================================================================
-- NUTRITION TRACKING SYSTEM
-- ============================================================================

-- 1. MEAL PLANS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS meal_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  goal_type TEXT NOT NULL CHECK (goal_type IN ('weight_loss', 'maintenance', 'muscle_gain', 'medical_condition')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_meal_plans_goal_type ON meal_plans(goal_type);

-- 2. MEAL PLAN ITEMS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS meal_plan_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_plan_id UUID NOT NULL REFERENCES meal_plans(id) ON DELETE CASCADE,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  name TEXT NOT NULL,
  calories NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (calories >= 0),
  protein_g NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (protein_g >= 0),
  carbs_g NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (carbs_g >= 0),
  fats_g NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (fats_g >= 0),
  notes TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_meal_plan_items_plan_id ON meal_plan_items(meal_plan_id);
CREATE INDEX IF NOT EXISTS idx_meal_plan_items_meal_type ON meal_plan_items(meal_type);
CREATE INDEX IF NOT EXISTS idx_meal_plan_items_order ON meal_plan_items(meal_plan_id, order_index);

-- 3. CLIENT MEAL PLAN ASSIGNMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS client_meal_plan_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  meal_plan_id UUID NOT NULL REFERENCES meal_plans(id) ON DELETE RESTRICT,
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_client_meal_plan_assignments_client_id ON client_meal_plan_assignments(client_id);
CREATE INDEX IF NOT EXISTS idx_client_meal_plan_assignments_plan_id ON client_meal_plan_assignments(meal_plan_id);
CREATE INDEX IF NOT EXISTS idx_client_meal_plan_assignments_active ON client_meal_plan_assignments(client_id, is_active);

-- 4. NUTRITION LOGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS nutrition_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_calories NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (total_calories >= 0),
  total_protein_g NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (total_protein_g >= 0),
  total_carbs_g NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (total_carbs_g >= 0),
  total_fats_g NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (total_fats_g >= 0),
  notes TEXT,
  source TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'from_plan')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(client_id, date) -- One log per client per day
);

CREATE INDEX IF NOT EXISTS idx_nutrition_logs_client_id ON nutrition_logs(client_id);
CREATE INDEX IF NOT EXISTS idx_nutrition_logs_date ON nutrition_logs(date);
CREATE INDEX IF NOT EXISTS idx_nutrition_logs_client_date ON nutrition_logs(client_id, date);

-- Triggers for updated_at
-- ============================================================================
CREATE TRIGGER update_meal_plans_updated_at
  BEFORE UPDATE ON meal_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meal_plan_items_updated_at
  BEFORE UPDATE ON meal_plan_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_client_meal_plan_assignments_updated_at
  BEFORE UPDATE ON client_meal_plan_assignments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_nutrition_logs_updated_at
  BEFORE UPDATE ON nutrition_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();




