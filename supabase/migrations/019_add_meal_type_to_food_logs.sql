-- ============================================================================
-- ADD MEAL TYPE TO FOOD LOG ENTRIES
-- ============================================================================
-- Add meal_type column to food_log_entries so clients can categorize foods
-- by meal (breakfast, lunch, dinner, snack)

ALTER TABLE food_log_entries 
ADD COLUMN IF NOT EXISTS meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack'));

CREATE INDEX IF NOT EXISTS idx_food_log_entries_meal_type ON food_log_entries(meal_type);




