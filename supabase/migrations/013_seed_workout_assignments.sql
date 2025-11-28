-- ============================================================================
-- SEED WORKOUT AND NUTRITION ASSIGNMENTS
-- ============================================================================
-- This migration assigns workout plans and meal plans to test clients
-- and creates completion logs for testing
-- ============================================================================

-- ============================================================================
-- 1. ASSIGN WORKOUT PLANS TO CLIENTS
-- ============================================================================
DO $$
DECLARE
  client1_id UUID := '10000000-0000-0000-0000-000000000001'; -- Amit Patel
  client2_id UUID := '10000000-0000-0000-0000-000000000002'; -- Anjali Mehta
  client3_id UUID := '10000000-0000-0000-0000-000000000003'; -- Rahul Verma
  beginner_plan_id UUID;
  strength_plan_id UUID;
  muscle_plan_id UUID;
  fitness_plan_id UUID;
  assignment_id UUID;
  plan_day_id UUID;
BEGIN
  -- Get workout plan IDs
  SELECT id INTO beginner_plan_id FROM workout_plans WHERE title = 'Beginner Weight Loss Plan' LIMIT 1;
  SELECT id INTO strength_plan_id FROM workout_plans WHERE title = 'Intermediate Strength Builder' LIMIT 1;
  SELECT id INTO muscle_plan_id FROM workout_plans WHERE title = 'Advanced Muscle Builder' LIMIT 1;
  SELECT id INTO fitness_plan_id FROM workout_plans WHERE title = 'General Fitness Full Body' LIMIT 1;

  -- Assign Beginner Weight Loss Plan to Anjali Mehta (weight loss goal)
  IF beginner_plan_id IS NOT NULL THEN
    INSERT INTO client_workout_assignments (client_id, workout_plan_id, start_date, end_date, is_active, notes)
    VALUES (
      client2_id,
      beginner_plan_id,
      CURRENT_DATE - INTERVAL '20 days',
      CURRENT_DATE + INTERVAL '10 days',
      true,
      'Assigned for weight loss goal. Client is making good progress.'
    )
    RETURNING id INTO assignment_id;
  END IF;

  -- Assign Intermediate Strength Builder to Rahul Verma (strength & conditioning)
  IF strength_plan_id IS NOT NULL THEN
    INSERT INTO client_workout_assignments (client_id, workout_plan_id, start_date, end_date, is_active, notes)
    VALUES (
      client3_id,
      strength_plan_id,
      CURRENT_DATE - INTERVAL '10 days',
      NULL,
      true,
      'Strength building program for advanced client.'
    )
    RETURNING id INTO assignment_id;
  END IF;

  -- Assign General Fitness to Amit Patel (general fitness goal)
  IF fitness_plan_id IS NOT NULL THEN
    INSERT INTO client_workout_assignments (client_id, workout_plan_id, start_date, end_date, is_active, notes)
    VALUES (
      client1_id,
      fitness_plan_id,
      CURRENT_DATE - INTERVAL '5 days',
      NULL,
      true,
      'General fitness program for new client.'
    )
    RETURNING id INTO assignment_id;
  END IF;
END $$;

-- ============================================================================
-- 2. ADD WORKOUT COMPLETION LOGS
-- ============================================================================
DO $$
DECLARE
  client1_id UUID := '10000000-0000-0000-0000-000000000001'; -- Amit Patel
  client2_id UUID := '10000000-0000-0000-0000-000000000002'; -- Anjali Mehta
  client3_id UUID := '10000000-0000-0000-0000-000000000003'; -- Rahul Verma
  fitness_plan_id UUID;
  beginner_plan_id UUID;
  strength_plan_id UUID;
  day1_id UUID;
  day2_id UUID;
  day3_id UUID;
  day4_id UUID;
BEGIN
  -- Get plan IDs
  SELECT id INTO fitness_plan_id FROM workout_plans WHERE title = 'General Fitness Full Body' LIMIT 1;
  SELECT id INTO beginner_plan_id FROM workout_plans WHERE title = 'Beginner Weight Loss Plan' LIMIT 1;
  SELECT id INTO strength_plan_id FROM workout_plans WHERE title = 'Intermediate Strength Builder' LIMIT 1;

  -- Get day IDs for fitness plan
  IF fitness_plan_id IS NOT NULL THEN
    SELECT id INTO day1_id FROM workout_plan_days WHERE workout_plan_id = fitness_plan_id AND day_index = 1 LIMIT 1;
    SELECT id INTO day2_id FROM workout_plan_days WHERE workout_plan_id = fitness_plan_id AND day_index = 2 LIMIT 1;
    SELECT id INTO day3_id FROM workout_plan_days WHERE workout_plan_id = fitness_plan_id AND day_index = 3 LIMIT 1;

    -- Amit Patel completion logs (fitness plan)
    IF day1_id IS NOT NULL THEN
      INSERT INTO workout_completion_logs (client_id, workout_plan_id, workout_plan_day_id, date, status, notes)
      VALUES (client1_id, fitness_plan_id, day1_id, CURRENT_DATE - INTERVAL '4 days', 'completed', 'Good session, completed all exercises');
    END IF;

    IF day2_id IS NOT NULL THEN
      INSERT INTO workout_completion_logs (client_id, workout_plan_id, workout_plan_day_id, date, status, notes)
      VALUES (client1_id, fitness_plan_id, day2_id, CURRENT_DATE - INTERVAL '2 days', 'completed', 'Felt strong today');
    END IF;
  END IF;

  -- Get day IDs for beginner plan
  IF beginner_plan_id IS NOT NULL THEN
    SELECT id INTO day1_id FROM workout_plan_days WHERE workout_plan_id = beginner_plan_id AND day_index = 1 LIMIT 1;
    SELECT id INTO day2_id FROM workout_plan_days WHERE workout_plan_id = beginner_plan_id AND day_index = 2 LIMIT 1;
    SELECT id INTO day3_id FROM workout_plan_days WHERE workout_plan_id = beginner_plan_id AND day_index = 3 LIMIT 1;

    -- Anjali Mehta completion logs (beginner plan)
    IF day1_id IS NOT NULL THEN
      INSERT INTO workout_completion_logs (client_id, workout_plan_id, workout_plan_day_id, date, status, notes)
      VALUES (client2_id, beginner_plan_id, day1_id, CURRENT_DATE - INTERVAL '18 days', 'completed', 'First day, did well');
    END IF;

    IF day2_id IS NOT NULL THEN
      INSERT INTO workout_completion_logs (client_id, workout_plan_id, workout_plan_day_id, date, status, notes)
      VALUES (client2_id, beginner_plan_id, day2_id, CURRENT_DATE - INTERVAL '16 days', 'completed', 'Legs were sore but pushed through');
    END IF;

    IF day3_id IS NOT NULL THEN
      INSERT INTO workout_completion_logs (client_id, workout_plan_id, workout_plan_day_id, date, status, notes)
      VALUES (client2_id, beginner_plan_id, day3_id, CURRENT_DATE - INTERVAL '14 days', 'completed', 'Full body workout completed');
    END IF;

    IF day1_id IS NOT NULL THEN
      INSERT INTO workout_completion_logs (client_id, workout_plan_id, workout_plan_day_id, date, status, notes)
      VALUES (client2_id, beginner_plan_id, day1_id, CURRENT_DATE - INTERVAL '11 days', 'completed', 'Second week, improving');
    END IF;

    IF day2_id IS NOT NULL THEN
      INSERT INTO workout_completion_logs (client_id, workout_plan_id, workout_plan_day_id, date, status, notes)
      VALUES (client2_id, beginner_plan_id, day2_id, CURRENT_DATE - INTERVAL '9 days', 'completed', 'Good progress');
    END IF;

    IF day3_id IS NOT NULL THEN
      INSERT INTO workout_completion_logs (client_id, workout_plan_id, workout_plan_day_id, date, status, notes)
      VALUES (client2_id, beginner_plan_id, day3_id, CURRENT_DATE - INTERVAL '7 days', 'partially_completed', 'Missed last exercise due to time');
    END IF;

    IF day1_id IS NOT NULL THEN
      INSERT INTO workout_completion_logs (client_id, workout_plan_id, workout_plan_day_id, date, status, notes)
      VALUES (client2_id, beginner_plan_id, day1_id, CURRENT_DATE - INTERVAL '4 days', 'completed', 'Feeling stronger');
    END IF;

    IF day2_id IS NOT NULL THEN
      INSERT INTO workout_completion_logs (client_id, workout_plan_id, workout_plan_day_id, date, status, notes)
      VALUES (client2_id, beginner_plan_id, day2_id, CURRENT_DATE - INTERVAL '2 days', 'completed', 'Best session yet');
    END IF;
  END IF;

  -- Get day IDs for strength plan
  IF strength_plan_id IS NOT NULL THEN
    SELECT id INTO day1_id FROM workout_plan_days WHERE workout_plan_id = strength_plan_id AND day_index = 1 LIMIT 1;
    SELECT id INTO day2_id FROM workout_plan_days WHERE workout_plan_id = strength_plan_id AND day_index = 2 LIMIT 1;
    SELECT id INTO day3_id FROM workout_plan_days WHERE workout_plan_id = strength_plan_id AND day_index = 3 LIMIT 1;
    SELECT id INTO day4_id FROM workout_plan_days WHERE workout_plan_id = strength_plan_id AND day_index = 4 LIMIT 1;

    -- Rahul Verma completion logs (strength plan)
    IF day1_id IS NOT NULL THEN
      INSERT INTO workout_completion_logs (client_id, workout_plan_id, workout_plan_day_id, date, status, notes)
      VALUES (client3_id, strength_plan_id, day1_id, CURRENT_DATE - INTERVAL '8 days', 'completed', 'Heavy push day');
    END IF;

    IF day2_id IS NOT NULL THEN
      INSERT INTO workout_completion_logs (client_id, workout_plan_id, workout_plan_day_id, date, status, notes)
      VALUES (client3_id, strength_plan_id, day2_id, CURRENT_DATE - INTERVAL '7 days', 'completed', 'Quad focus, good volume');
    END IF;

    IF day3_id IS NOT NULL THEN
      INSERT INTO workout_completion_logs (client_id, workout_plan_id, workout_plan_day_id, date, status, notes)
      VALUES (client3_id, strength_plan_id, day3_id, CURRENT_DATE - INTERVAL '5 days', 'completed', 'Deadlift PR today');
    END IF;

    IF day4_id IS NOT NULL THEN
      INSERT INTO workout_completion_logs (client_id, workout_plan_id, workout_plan_day_id, date, status, notes)
      VALUES (client3_id, strength_plan_id, day4_id, CURRENT_DATE - INTERVAL '4 days', 'completed', 'Posterior chain work');
    END IF;

    IF day1_id IS NOT NULL THEN
      INSERT INTO workout_completion_logs (client_id, workout_plan_id, workout_plan_day_id, date, status, notes)
      VALUES (client3_id, strength_plan_id, day1_id, CURRENT_DATE - INTERVAL '1 day', 'completed', 'Progressive overload applied');
    END IF;
  END IF;
END $$;

-- ============================================================================
-- 3. CREATE MEAL PLANS
-- ============================================================================
DO $$
DECLARE
  weight_loss_plan_id UUID;
  muscle_gain_plan_id UUID;
  general_plan_id UUID;
BEGIN
  -- Weight Loss Meal Plan
  INSERT INTO meal_plans (title, goal_type, notes)
  VALUES (
    'Weight Loss Meal Plan',
    'weight_loss',
    'Balanced meal plan for sustainable weight loss. Focus on protein, vegetables, and controlled portions.'
  )
  RETURNING id INTO weight_loss_plan_id;

  -- Add items to weight loss plan
  INSERT INTO meal_plan_items (meal_plan_id, meal_type, name, calories, protein_g, carbs_g, fats_g, notes, order_index) VALUES
    (weight_loss_plan_id, 'breakfast', 'Oatmeal with Berries', 300, 12, 50, 5, '1 cup oats, 1/2 cup berries', 1),
    (weight_loss_plan_id, 'breakfast', 'Greek Yogurt', 150, 20, 10, 2, '1 cup plain Greek yogurt', 2),
    (weight_loss_plan_id, 'lunch', 'Grilled Chicken Salad', 400, 35, 20, 15, '4oz chicken, mixed greens, olive oil dressing', 1),
    (weight_loss_plan_id, 'lunch', 'Quinoa Bowl', 350, 15, 55, 8, '1 cup quinoa, vegetables', 2),
    (weight_loss_plan_id, 'dinner', 'Baked Salmon with Vegetables', 450, 35, 25, 20, '5oz salmon, roasted vegetables', 1),
    (weight_loss_plan_id, 'dinner', 'Turkey and Sweet Potato', 400, 30, 40, 10, '4oz turkey, 1 medium sweet potato', 2),
    (weight_loss_plan_id, 'snack', 'Apple with Almonds', 200, 5, 25, 10, '1 medium apple, 1oz almonds', 1),
    (weight_loss_plan_id, 'snack', 'Protein Shake', 150, 25, 5, 2, '1 scoop protein powder, water', 2);

  -- Muscle Gain Meal Plan
  INSERT INTO meal_plans (title, goal_type, notes)
  VALUES (
    'Muscle Gain Meal Plan',
    'muscle_gain',
    'High protein meal plan for muscle building. Increased calories and protein to support muscle growth.'
  )
  RETURNING id INTO muscle_gain_plan_id;

  INSERT INTO meal_plan_items (meal_plan_id, meal_type, name, calories, protein_g, carbs_g, fats_g, notes, order_index) VALUES
    (muscle_gain_plan_id, 'breakfast', 'Protein Pancakes', 500, 35, 60, 12, '3 pancakes with protein powder', 1),
    (muscle_gain_plan_id, 'breakfast', 'Eggs and Toast', 450, 25, 45, 15, '4 eggs, 2 slices whole grain bread', 2),
    (muscle_gain_plan_id, 'lunch', 'Chicken and Rice', 600, 50, 70, 15, '6oz chicken, 1.5 cups rice', 1),
    (muscle_gain_plan_id, 'lunch', 'Beef and Potatoes', 650, 45, 65, 20, '6oz lean beef, 2 medium potatoes', 2),
    (muscle_gain_plan_id, 'dinner', 'Steak with Pasta', 700, 55, 80, 18, '8oz steak, 2 cups pasta', 1),
    (muscle_gain_plan_id, 'dinner', 'Salmon and Rice', 600, 45, 70, 15, '6oz salmon, 1.5 cups rice', 2),
    (muscle_gain_plan_id, 'snack', 'Protein Bar', 250, 20, 25, 8, '1 protein bar', 1),
    (muscle_gain_plan_id, 'snack', 'Peanut Butter Sandwich', 350, 15, 35, 18, '2 slices bread, 2 tbsp peanut butter', 2);

  -- General Fitness Meal Plan (using 'maintenance' as goal_type)
  INSERT INTO meal_plans (title, goal_type, notes)
  VALUES (
    'Balanced Nutrition Plan',
    'maintenance',
    'Well-rounded meal plan for maintaining health and fitness. Balanced macros for energy and recovery.'
  )
  RETURNING id INTO general_plan_id;

  INSERT INTO meal_plan_items (meal_plan_id, meal_type, name, calories, protein_g, carbs_g, fats_g, notes, order_index) VALUES
    (general_plan_id, 'breakfast', 'Scrambled Eggs with Toast', 400, 20, 35, 18, '3 eggs, 2 slices toast, butter', 1),
    (general_plan_id, 'breakfast', 'Smoothie Bowl', 350, 15, 50, 8, 'Greek yogurt, fruits, granola', 2),
    (general_plan_id, 'lunch', 'Chicken Wrap', 500, 35, 45, 18, '4oz chicken, whole wheat wrap, vegetables', 1),
    (general_plan_id, 'lunch', 'Pasta with Meat Sauce', 550, 30, 65, 15, '2 cups pasta, 4oz ground meat', 2),
    (general_plan_id, 'dinner', 'Grilled Chicken with Vegetables', 500, 40, 40, 18, '5oz chicken, mixed vegetables, olive oil', 1),
    (general_plan_id, 'dinner', 'Fish and Quinoa', 450, 35, 50, 12, '5oz fish, 1 cup quinoa', 2),
    (general_plan_id, 'snack', 'Mixed Nuts', 200, 6, 8, 16, '1oz mixed nuts', 1),
    (general_plan_id, 'snack', 'Greek Yogurt with Honey', 180, 15, 20, 4, '1 cup yogurt, 1 tbsp honey', 2);
END $$;

-- ============================================================================
-- 4. ASSIGN MEAL PLANS TO CLIENTS
-- ============================================================================
DO $$
DECLARE
  client1_id UUID := '10000000-0000-0000-0000-000000000001'; -- Amit Patel
  client2_id UUID := '10000000-0000-0000-0000-000000000002'; -- Anjali Mehta
  client3_id UUID := '10000000-0000-0000-0000-000000000003'; -- Rahul Verma
  weight_loss_plan_id UUID;
  general_plan_id UUID;
  muscle_plan_id UUID;
BEGIN
  SELECT id INTO weight_loss_plan_id FROM meal_plans WHERE title = 'Weight Loss Meal Plan' LIMIT 1;
  SELECT id INTO general_plan_id FROM meal_plans WHERE title = 'Balanced Nutrition Plan' LIMIT 1;
  SELECT id INTO muscle_plan_id FROM meal_plans WHERE title = 'Muscle Gain Meal Plan' LIMIT 1;

  -- Assign Weight Loss Meal Plan to Anjali Mehta
  IF weight_loss_plan_id IS NOT NULL THEN
    INSERT INTO client_meal_plan_assignments (client_id, meal_plan_id, start_date, end_date, is_active, notes)
    VALUES (
      client2_id,
      weight_loss_plan_id,
      CURRENT_DATE - INTERVAL '20 days',
      NULL,
      true,
      'Meal plan aligned with weight loss workout program'
    );
  END IF;

  -- Assign Balanced Nutrition Plan to Amit Patel
  IF general_plan_id IS NOT NULL THEN
    INSERT INTO client_meal_plan_assignments (client_id, meal_plan_id, start_date, end_date, is_active, notes)
    VALUES (
      client1_id,
      general_plan_id,
      CURRENT_DATE - INTERVAL '5 days',
      NULL,
      true,
      'General nutrition plan for fitness goals'
    );
  END IF;

  -- Assign Muscle Gain Meal Plan to Rahul Verma
  IF muscle_plan_id IS NOT NULL THEN
    INSERT INTO client_meal_plan_assignments (client_id, meal_plan_id, start_date, end_date, is_active, notes)
    VALUES (
      client3_id,
      muscle_plan_id,
      CURRENT_DATE - INTERVAL '10 days',
      NULL,
      true,
      'High protein plan for strength training'
    );
  END IF;
END $$;

-- ============================================================================
-- 5. ADD NUTRITION LOGS
-- ============================================================================
DO $$
DECLARE
  client1_id UUID := '10000000-0000-0000-0000-000000000001'; -- Amit Patel
  client2_id UUID := '10000000-0000-0000-0000-000000000002'; -- Anjali Mehta
  client3_id UUID := '10000000-0000-0000-0000-000000000003'; -- Rahul Verma
BEGIN
  -- Anjali Mehta nutrition logs (weight loss)
  INSERT INTO nutrition_logs (client_id, date, total_calories, total_protein_g, total_carbs_g, total_fats_g, notes, source) VALUES
    (client2_id, CURRENT_DATE - INTERVAL '2 days', 1450, 110, 150, 45, 'Followed meal plan well', 'from_plan'),
    (client2_id, CURRENT_DATE - INTERVAL '1 day', 1500, 115, 160, 48, 'Added extra protein snack', 'manual'),
    (client2_id, CURRENT_DATE, 1420, 105, 145, 42, 'On track with plan', 'from_plan');

  -- Rahul Verma nutrition logs (muscle gain)
  INSERT INTO nutrition_logs (client_id, date, total_calories, total_protein_g, total_carbs_g, total_fats_g, notes, source) VALUES
    (client3_id, CURRENT_DATE - INTERVAL '2 days', 2800, 200, 300, 85, 'High protein day', 'from_plan'),
    (client3_id, CURRENT_DATE - INTERVAL '1 day', 2950, 210, 320, 90, 'Post-workout meal added', 'manual'),
    (client3_id, CURRENT_DATE, 2750, 195, 290, 82, 'Consistent with plan', 'from_plan');

  -- Amit Patel nutrition logs (general fitness)
  INSERT INTO nutrition_logs (client_id, date, total_calories, total_protein_g, total_carbs_g, total_fats_g, notes, source) VALUES
    (client1_id, CURRENT_DATE - INTERVAL '1 day', 1950, 130, 200, 65, 'Balanced day', 'from_plan'),
    (client1_id, CURRENT_DATE, 2000, 135, 210, 68, 'Good adherence', 'from_plan');
END $$;

