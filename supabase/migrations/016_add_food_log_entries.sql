-- ============================================================================
-- FOOD LOG ENTRIES TABLE
-- ============================================================================
-- This table stores individual food items that were added to each nutrition log
-- This allows clients to see what foods they ate, not just the totals

CREATE TABLE IF NOT EXISTS food_log_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nutrition_log_id UUID NOT NULL REFERENCES nutrition_logs(id) ON DELETE CASCADE,
  food_id UUID NOT NULL REFERENCES foods(id) ON DELETE RESTRICT,
  serving_size_g NUMERIC(10, 2) NOT NULL CHECK (serving_size_g > 0),
  calories NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (calories >= 0),
  protein_g NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (protein_g >= 0),
  carbs_g NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (carbs_g >= 0),
  fats_g NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (fats_g >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_food_log_entries_nutrition_log_id ON food_log_entries(nutrition_log_id);
CREATE INDEX IF NOT EXISTS idx_food_log_entries_food_id ON food_log_entries(food_id);

-- Trigger for updated_at
CREATE TRIGGER update_food_log_entries_updated_at
  BEFORE UPDATE ON food_log_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();




