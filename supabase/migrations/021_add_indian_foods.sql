-- ============================================================================
-- INDIAN FOODS DATABASE
-- ============================================================================
-- Adding common Indian foods and dishes to the foods database
-- Nutritional values are approximate per 100g serving

INSERT INTO foods (name, category, calories_per_100g, protein_per_100g, carbs_per_100g, fats_per_100g, fiber_per_100g, common_serving_size_g, description) VALUES

-- INDIAN BREADS (GRAINS)
('Roti/Chapati', 'grains', 297, 7.9, 46, 7.4, 4.2, 50, '1 medium roti'),
('Naan', 'grains', 310, 8.0, 50, 6.0, 2.2, 60, '1 medium naan'),
('Paratha', 'grains', 326, 6.4, 45, 13.6, 4.6, 80, '1 medium paratha'),
('Bhatura', 'grains', 320, 7.0, 48, 12.0, 2.5, 100, '1 medium bhatura'),
('Puri', 'grains', 350, 6.5, 50, 15.0, 2.0, 20, '1 small puri'),

-- DAL/LENTIL DISHES (PROTEINS)
('Dal Tadka', 'proteins', 120, 6.5, 20, 2.5, 8.0, 200, '1 cup dal'),
('Dal Makhani', 'proteins', 180, 7.0, 22, 6.5, 7.5, 200, '1 cup dal makhani'),
('Sambar', 'proteins', 80, 4.0, 12, 2.0, 5.0, 200, '1 cup sambar'),
('Rasam', 'proteins', 30, 1.5, 5, 0.5, 1.5, 200, '1 cup rasam'),
('Rajma (Kidney Beans Curry)', 'proteins', 140, 7.5, 22, 2.0, 8.5, 200, '1 cup rajma'),

-- RICE DISHES (GRAINS)
('Biryani (Chicken)', 'grains', 220, 12, 28, 7, 2.0, 300, '1 serving biryani'),
('Biryani (Vegetable)', 'grains', 180, 5, 32, 5, 3.0, 300, '1 serving veg biryani'),
('Pulao', 'grains', 150, 3.5, 28, 3.5, 1.5, 200, '1 cup pulao'),
('Khichdi', 'grains', 120, 4.0, 22, 2.5, 2.0, 250, '1 cup khichdi'),
('Fried Rice', 'grains', 190, 4.5, 30, 5.5, 1.8, 200, '1 cup fried rice'),

-- CURRIES (PROTEINS/OTHER)
('Butter Chicken', 'proteins', 250, 18, 8, 16, 1.5, 200, '1 serving butter chicken'),
('Chicken Curry', 'proteins', 200, 20, 6, 10, 1.2, 200, '1 serving chicken curry'),
('Paneer Butter Masala', 'proteins', 220, 12, 10, 14, 1.0, 200, '1 serving paneer masala'),
('Palak Paneer', 'proteins', 180, 10, 8, 12, 3.5, 200, '1 serving palak paneer'),
('Chana Masala', 'proteins', 150, 6.5, 20, 4.5, 7.0, 200, '1 serving chana masala'),
('Aloo Gobi', 'vegetables', 120, 3.0, 18, 4.0, 4.5, 200, '1 serving aloo gobi'),
('Baingan Bharta', 'vegetables', 100, 2.5, 12, 4.5, 5.0, 200, '1 serving baingan bharta'),
('Matar Paneer', 'proteins', 180, 9.0, 15, 9.0, 4.0, 200, '1 serving matar paneer'),
('Fish Curry', 'proteins', 150, 18, 5, 6, 1.0, 200, '1 serving fish curry'),
('Mutton Curry', 'proteins', 280, 22, 8, 18, 1.5, 200, '1 serving mutton curry'),

-- SNACKS
('Samosa', 'snacks', 260, 4.5, 33, 12, 3.5, 50, '1 medium samosa'),
('Pakora', 'snacks', 200, 5.0, 25, 8.5, 3.0, 50, '2-3 pakoras'),
('Vada', 'snacks', 180, 6.0, 22, 6.5, 4.0, 50, '1 medium vada'),
('Dhokla', 'snacks', 120, 5.5, 20, 2.5, 2.5, 100, '2 pieces dhokla'),
('Idli', 'snacks', 60, 2.5, 12, 0.5, 1.0, 50, '1 idli'),
('Dosa', 'snacks', 150, 3.5, 25, 4.0, 2.0, 100, '1 medium dosa'),
('Uttapam', 'snacks', 180, 4.5, 28, 5.0, 2.5, 150, '1 medium uttapam'),
('Poha', 'snacks', 140, 3.0, 28, 2.5, 1.5, 150, '1 serving poha'),
('Upma', 'snacks', 160, 3.5, 30, 3.5, 2.0, 150, '1 serving upma'),
('Bhel Puri', 'snacks', 180, 4.0, 32, 5.0, 3.5, 100, '1 serving bhel puri'),

-- SWEETS (SNACKS)
('Gulab Jamun', 'snacks', 320, 5.0, 45, 12, 0.5, 50, '1 piece gulab jamun'),
('Jalebi', 'snacks', 350, 2.0, 65, 8, 0.3, 50, '2-3 jalebis'),
('Rasgulla', 'snacks', 180, 4.0, 38, 0.5, 0, 50, '1 piece rasgulla'),
('Barfi', 'snacks', 380, 6.0, 50, 16, 1.0, 30, '1 piece barfi'),
('Ladoo', 'snacks', 400, 6.5, 55, 16, 2.0, 30, '1 medium ladoo'),
('Kheer', 'snacks', 150, 3.5, 25, 4.5, 0.5, 150, '1 cup kheer'),

-- BEVERAGES
('Chai (Tea)', 'beverages', 30, 1.0, 6, 0.5, 0, 200, '1 cup chai'),
('Masala Chai', 'beverages', 35, 1.2, 7, 0.6, 0.2, 200, '1 cup masala chai'),
('Lassi (Sweet)', 'beverages', 90, 3.0, 15, 2.0, 0, 200, '1 cup sweet lassi'),
('Lassi (Salted)', 'beverages', 70, 3.5, 8, 2.5, 0, 200, '1 cup salted lassi'),
('Buttermilk (Chaas)', 'beverages', 25, 1.5, 3, 0.8, 0, 200, '1 cup buttermilk'),
('Nimbu Pani (Lemonade)', 'beverages', 35, 0.2, 9, 0.1, 0.1, 200, '1 glass nimbu pani'),

-- INDIAN VEGETABLES (already have some, adding more)
('Okra (Bhindi)', 'vegetables', 33, 2.0, 7, 0.2, 3.2, 100, '1 cup okra'),
('Bottle Gourd (Lauki)', 'vegetables', 15, 0.6, 3, 0.1, 0.5, 100, '1 cup lauki'),
('Bitter Gourd (Karela)', 'vegetables', 20, 1.0, 4, 0.2, 2.5, 100, '1 cup karela'),
('Drumstick', 'vegetables', 37, 2.1, 8, 0.2, 3.2, 100, '1 cup drumstick'),

-- INDIAN DAIRY
('Paneer', 'dairy', 295, 18, 4, 22, 0, 100, '100g paneer'),
('Ghee', 'oils', 900, 0, 0, 100, 0, 15, '1 tablespoon ghee'),
('Curd (Yogurt)', 'dairy', 60, 3.5, 5, 3.3, 0, 200, '1 cup curd'),

-- INDIAN PROTEINS (additional)
('Chicken Tikka', 'proteins', 180, 25, 3, 7, 0.5, 150, '1 serving chicken tikka'),
('Tandoori Chicken', 'proteins', 200, 28, 2, 8, 0.3, 150, '1 serving tandoori chicken'),
('Egg Curry', 'proteins', 180, 12, 5, 12, 1.0, 200, '1 serving egg curry'),
('Prawn Curry', 'proteins', 140, 20, 4, 4, 0.5, 200, '1 serving prawn curry');

-- Note: Nutritional values are approximate and may vary based on preparation method and ingredients used



