-- ============================================================================
-- FOODS DATABASE
-- ============================================================================
-- This table stores common foods with their nutritional information per 100g
-- Serving sizes can be specified when logging (e.g., 150g = 1.5x the base values)

CREATE TABLE IF NOT EXISTS foods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('fruits', 'vegetables', 'grains', 'proteins', 'dairy', 'nuts_seeds', 'oils', 'beverages', 'snacks', 'other')),
  calories_per_100g NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (calories_per_100g >= 0),
  protein_per_100g NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (protein_per_100g >= 0),
  carbs_per_100g NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (carbs_per_100g >= 0),
  fats_per_100g NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (fats_per_100g >= 0),
  fiber_per_100g NUMERIC(10, 2) DEFAULT 0 CHECK (fiber_per_100g >= 0),
  common_serving_size_g NUMERIC(10, 2) DEFAULT 100, -- Default serving size in grams
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_foods_name ON foods(name);
CREATE INDEX IF NOT EXISTS idx_foods_category ON foods(category);
CREATE INDEX IF NOT EXISTS idx_foods_name_search ON foods USING gin(to_tsvector('english', name));

-- Trigger for updated_at
CREATE TRIGGER update_foods_updated_at
  BEFORE UPDATE ON foods
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Seed common foods
-- ============================================================================
INSERT INTO foods (name, category, calories_per_100g, protein_per_100g, carbs_per_100g, fats_per_100g, fiber_per_100g, common_serving_size_g, description) VALUES
-- FRUITS
('Apple', 'fruits', 52, 0.3, 14, 0.2, 2.4, 182, 'Medium apple'),
('Banana', 'fruits', 89, 1.1, 23, 0.3, 2.6, 118, 'Medium banana'),
('Orange', 'fruits', 47, 0.9, 12, 0.1, 2.4, 131, 'Medium orange'),
('Grapes', 'fruits', 69, 0.7, 18, 0.2, 0.9, 150, '1 cup grapes'),
('Strawberries', 'fruits', 32, 0.7, 8, 0.3, 2.0, 144, '1 cup sliced'),
('Mango', 'fruits', 60, 0.8, 15, 0.4, 1.6, 165, '1 cup pieces'),
('Watermelon', 'fruits', 30, 0.6, 8, 0.2, 0.4, 152, '1 cup diced'),
('Pineapple', 'fruits', 50, 0.5, 13, 0.1, 1.4, 165, '1 cup chunks'),

-- VEGETABLES
('Broccoli', 'vegetables', 34, 2.8, 7, 0.4, 2.6, 91, '1 cup chopped'),
('Spinach', 'vegetables', 23, 2.9, 4, 0.4, 2.2, 30, '1 cup raw'),
('Carrots', 'vegetables', 41, 0.9, 10, 0.2, 2.8, 128, '1 cup chopped'),
('Tomatoes', 'vegetables', 18, 0.9, 4, 0.2, 1.2, 149, '1 cup chopped'),
('Cucumber', 'vegetables', 16, 0.7, 4, 0.1, 0.5, 119, '1 cup sliced'),
('Bell Peppers', 'vegetables', 31, 1.0, 7, 0.3, 2.5, 149, '1 cup chopped'),
('Onions', 'vegetables', 40, 1.1, 9, 0.1, 1.7, 160, '1 cup chopped'),
('Potatoes', 'vegetables', 77, 2.0, 17, 0.1, 2.2, 173, '1 medium potato'),

-- GRAINS
('Brown Rice (cooked)', 'grains', 111, 2.6, 23, 0.9, 1.8, 195, '1 cup cooked'),
('White Rice (cooked)', 'grains', 130, 2.7, 28, 0.3, 0.4, 158, '1 cup cooked'),
('Quinoa (cooked)', 'grains', 120, 4.4, 22, 1.9, 2.8, 185, '1 cup cooked'),
('Oats (cooked)', 'grains', 68, 2.4, 12, 1.4, 1.7, 234, '1 cup cooked'),
('Whole Wheat Bread', 'grains', 247, 13, 41, 4.2, 7.0, 28, '1 slice'),
('White Bread', 'grains', 265, 9, 49, 3.2, 2.7, 25, '1 slice'),
('Pasta (cooked)', 'grains', 131, 5, 25, 1.1, 1.8, 140, '1 cup cooked'),

-- PROTEINS
('Chicken Breast (cooked)', 'proteins', 165, 31, 0, 3.6, 0, 100, '100g cooked'),
('Eggs', 'proteins', 155, 13, 1.1, 11, 0, 50, '1 large egg'),
('Salmon (cooked)', 'proteins', 206, 25, 0, 12, 0, 100, '100g cooked'),
('Tuna (canned)', 'proteins', 144, 30, 0, 1, 0, 100, '100g canned'),
('Beef (cooked)', 'proteins', 250, 26, 0, 17, 0, 100, '100g cooked'),
('Lentils (cooked)', 'proteins', 116, 9, 20, 0.4, 7.9, 198, '1 cup cooked'),
('Chickpeas (cooked)', 'proteins', 164, 8.9, 27, 2.6, 7.6, 164, '1 cup cooked'),
('Tofu', 'proteins', 76, 8, 1.9, 4.8, 0.3, 100, '100g firm tofu'),

-- DAIRY
('Milk (whole)', 'dairy', 61, 3.2, 5, 3.3, 0, 244, '1 cup'),
('Milk (skim)', 'dairy', 34, 3.4, 5, 0.1, 0, 245, '1 cup'),
('Greek Yogurt', 'dairy', 59, 10, 4, 0.4, 0, 200, '1 cup'),
('Cheddar Cheese', 'dairy', 402, 25, 1.3, 33, 0, 28, '1 oz'),
('Cottage Cheese', 'dairy', 98, 11, 3.4, 4.3, 0, 226, '1 cup'),

-- NUTS & SEEDS
('Almonds', 'nuts_seeds', 579, 21, 22, 50, 12, 28, '1 oz (23 almonds)'),
('Peanuts', 'nuts_seeds', 567, 26, 16, 49, 8.5, 28, '1 oz'),
('Walnuts', 'nuts_seeds', 654, 15, 14, 65, 6.7, 28, '1 oz (14 halves)'),
('Chia Seeds', 'nuts_seeds', 486, 17, 42, 31, 34, 28, '1 oz'),

-- OILS
('Olive Oil', 'oils', 884, 0, 0, 100, 0, 14, '1 tablespoon'),
('Coconut Oil', 'oils', 862, 0, 0, 100, 0, 14, '1 tablespoon'),
('Butter', 'oils', 717, 0.9, 0.1, 81, 0, 14, '1 tablespoon'),

-- BEVERAGES
('Water', 'beverages', 0, 0, 0, 0, 0, 240, '1 cup'),
('Coffee (black)', 'beverages', 2, 0.3, 0, 0, 0, 240, '1 cup'),
('Green Tea', 'beverages', 2, 0, 0, 0, 0, 240, '1 cup'),

-- SNACKS
('Almonds (roasted)', 'snacks', 598, 21, 22, 52, 11, 28, '1 oz'),
('Dark Chocolate (70%)', 'snacks', 598, 7.8, 46, 43, 11, 28, '1 oz');




