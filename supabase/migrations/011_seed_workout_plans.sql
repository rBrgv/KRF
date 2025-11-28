-- ============================================================================
-- SEED WORKOUT PLANS
-- ============================================================================
-- This migration creates sample workout plans with days and exercises
-- Note: This assumes exercises from migration 010_seed_exercises.sql exist
-- ============================================================================

-- Helper function to get exercise ID by name (will be used in subqueries)
-- We'll use a different approach - insert plans first, then add days and exercises

-- ============================================================================
-- 1. BEGINNER WEIGHT LOSS PLAN (3 days/week)
-- ============================================================================
DO $$
DECLARE
  plan_id UUID;
  day1_id UUID;
  day2_id UUID;
  day3_id UUID;
  bench_press_id UUID;
  squat_id UUID;
  deadlift_id UUID;
  lat_pulldown_id UUID;
  leg_press_id UUID;
  push_ups_id UUID;
  pull_ups_id UUID;
  lunges_id UUID;
  planks_id UUID;
  crunches_id UUID;
BEGIN
  -- Create the workout plan
  INSERT INTO workout_plans (title, goal_type, level, notes)
  VALUES (
    'Beginner Weight Loss Plan',
    'weight_loss',
    'beginner',
    'A 3-day per week program designed for beginners focusing on full-body workouts and fat loss. Perfect for those just starting their fitness journey.'
  )
  RETURNING id INTO plan_id;

  -- Day 1: Upper Body Focus
  INSERT INTO workout_plan_days (workout_plan_id, day_index, title, notes)
  VALUES (plan_id, 1, 'Upper Body Strength', 'Focus on chest, back, and arms')
  RETURNING id INTO day1_id;

  -- Day 1 Exercises
  SELECT id INTO bench_press_id FROM exercises WHERE name = 'Bench Press' LIMIT 1;
  SELECT id INTO lat_pulldown_id FROM exercises WHERE name = 'Lat Pulldown' LIMIT 1;
  SELECT id INTO push_ups_id FROM exercises WHERE name = 'Push-ups' LIMIT 1;
  SELECT id INTO planks_id FROM exercises WHERE name = 'Plank' LIMIT 1;

  IF bench_press_id IS NOT NULL THEN
    INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index)
    VALUES (day1_id, bench_press_id, 3, '8-10', 60, 1);
  END IF;

  IF lat_pulldown_id IS NOT NULL THEN
    INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index)
    VALUES (day1_id, lat_pulldown_id, 3, '10-12', 60, 2);
  END IF;

  IF push_ups_id IS NOT NULL THEN
    INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index)
    VALUES (day1_id, push_ups_id, 3, '10-15', 45, 3);
  END IF;

  IF planks_id IS NOT NULL THEN
    INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index)
    VALUES (day1_id, planks_id, 3, '30-60 seconds', 30, 4);
  END IF;

  -- Day 2: Lower Body Focus
  INSERT INTO workout_plan_days (workout_plan_id, day_index, title, notes)
  VALUES (plan_id, 2, 'Lower Body Strength', 'Focus on legs and glutes')
  RETURNING id INTO day2_id;

  SELECT id INTO squat_id FROM exercises WHERE name = 'Squat' LIMIT 1;
  SELECT id INTO leg_press_id FROM exercises WHERE name = 'Leg Press' LIMIT 1;
  SELECT id INTO lunges_id FROM exercises WHERE name = 'Lunges' LIMIT 1;
  SELECT id INTO crunches_id FROM exercises WHERE name = 'Crunches' LIMIT 1;

  IF squat_id IS NOT NULL THEN
    INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index)
    VALUES (day2_id, squat_id, 3, '10-12', 60, 1);
  END IF;

  IF leg_press_id IS NOT NULL THEN
    INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index)
    VALUES (day2_id, leg_press_id, 3, '12-15', 60, 2);
  END IF;

  IF lunges_id IS NOT NULL THEN
    INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index)
    VALUES (day2_id, lunges_id, 3, '10 each leg', 45, 3);
  END IF;

  IF crunches_id IS NOT NULL THEN
    INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index)
    VALUES (day2_id, crunches_id, 3, '15-20', 30, 4);
  END IF;

  -- Day 3: Full Body
  INSERT INTO workout_plan_days (workout_plan_id, day_index, title, notes)
  VALUES (plan_id, 3, 'Full Body Circuit', 'Complete body workout')
  RETURNING id INTO day3_id;

  SELECT id INTO deadlift_id FROM exercises WHERE name = 'Deadlift' LIMIT 1;
  SELECT id INTO pull_ups_id FROM exercises WHERE name = 'Pull-ups' LIMIT 1;

  IF deadlift_id IS NOT NULL THEN
    INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index)
    VALUES (day3_id, deadlift_id, 3, '8-10', 90, 1);
  END IF;

  IF pull_ups_id IS NOT NULL THEN
    INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index)
    VALUES (day3_id, pull_ups_id, 3, '5-10', 60, 2);
  END IF;

  IF push_ups_id IS NOT NULL THEN
    INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index)
    VALUES (day3_id, push_ups_id, 3, '10-15', 45, 3);
  END IF;

  IF squat_id IS NOT NULL THEN
    INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index)
    VALUES (day3_id, squat_id, 3, '12-15', 60, 4);
  END IF;
END $$;

-- ============================================================================
-- 2. INTERMEDIATE STRENGTH PLAN (4 days/week - Upper/Lower Split)
-- ============================================================================
DO $$
DECLARE
  plan_id UUID;
  day1_id UUID;
  day2_id UUID;
  day3_id UUID;
  day4_id UUID;
  ex_id UUID;
BEGIN
  INSERT INTO workout_plans (title, goal_type, level, notes)
  VALUES (
    'Intermediate Strength Builder',
    'strength',
    'intermediate',
    '4-day upper/lower split for building strength. Focus on progressive overload and compound movements.'
  )
  RETURNING id INTO plan_id;

  -- Day 1: Upper Body - Push Focus
  INSERT INTO workout_plan_days (workout_plan_id, day_index, title, notes)
  VALUES (plan_id, 1, 'Upper Body - Push', 'Chest, shoulders, triceps')
  RETURNING id INTO day1_id;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Bench Press' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day1_id, ex_id, 4, '6-8', 90, 1); END IF;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Overhead Press' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day1_id, ex_id, 3, '6-8', 90, 2); END IF;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Incline Bench Press' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day1_id, ex_id, 3, '8-10', 75, 3); END IF;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Lateral Raise' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day1_id, ex_id, 3, '12-15', 45, 4); END IF;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Tricep Dips' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day1_id, ex_id, 3, '10-12', 60, 5); END IF;

  -- Day 2: Lower Body - Quad Focus
  INSERT INTO workout_plan_days (workout_plan_id, day_index, title, notes)
  VALUES (plan_id, 2, 'Lower Body - Quads', 'Squats and quad-focused movements')
  RETURNING id INTO day2_id;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Squat' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day2_id, ex_id, 4, '6-8', 120, 1); END IF;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Leg Press' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day2_id, ex_id, 3, '10-12', 90, 2); END IF;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Leg Extension' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day2_id, ex_id, 3, '12-15', 60, 3); END IF;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Bulgarian Split Squat' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day2_id, ex_id, 3, '10 each leg', 60, 4); END IF;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Calf Raise' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day2_id, ex_id, 3, '15-20', 45, 5); END IF;

  -- Day 3: Upper Body - Pull Focus
  INSERT INTO workout_plan_days (workout_plan_id, day_index, title, notes)
  VALUES (plan_id, 3, 'Upper Body - Pull', 'Back and biceps')
  RETURNING id INTO day3_id;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Deadlift' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day3_id, ex_id, 4, '5-6', 120, 1); END IF;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Barbell Row' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day3_id, ex_id, 4, '6-8', 90, 2); END IF;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Pull-ups' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day3_id, ex_id, 3, '8-10', 75, 3); END IF;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Dumbbell Row' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day3_id, ex_id, 3, '8-10', 60, 4); END IF;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Barbell Curl' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day3_id, ex_id, 3, '10-12', 60, 5); END IF;

  -- Day 4: Lower Body - Posterior Chain
  INSERT INTO workout_plan_days (workout_plan_id, day_index, title, notes)
  VALUES (plan_id, 4, 'Lower Body - Posterior', 'Hamstrings, glutes, and calves')
  RETURNING id INTO day4_id;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Romanian Deadlift' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day4_id, ex_id, 4, '8-10', 90, 1); END IF;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Hip Thrust' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day4_id, ex_id, 3, '10-12', 75, 2); END IF;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Leg Curl' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day4_id, ex_id, 3, '12-15', 60, 3); END IF;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Lunges' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day4_id, ex_id, 3, '12 each leg', 60, 4); END IF;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Seated Calf Raise' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day4_id, ex_id, 4, '15-20', 45, 5); END IF;
END $$;

-- ============================================================================
-- 3. ADVANCED MUSCLE GAIN PLAN (5 days/week - Push/Pull/Legs)
-- ============================================================================
DO $$
DECLARE
  plan_id UUID;
  day1_id UUID;
  day2_id UUID;
  day3_id UUID;
  day4_id UUID;
  day5_id UUID;
  ex_id UUID;
BEGIN
  INSERT INTO workout_plans (title, goal_type, level, notes)
  VALUES (
    'Advanced Muscle Builder',
    'muscle_gain',
    'advanced',
    '5-day push/pull/legs split for advanced lifters. High volume for maximum muscle growth.'
  )
  RETURNING id INTO plan_id;

  -- Day 1: Push (Chest, Shoulders, Triceps)
  INSERT INTO workout_plan_days (workout_plan_id, day_index, title, notes)
  VALUES (plan_id, 1, 'Push Day 1', 'Heavy chest focus')
  RETURNING id INTO day1_id;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Bench Press' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day1_id, ex_id, 5, '5-6', 120, 1); END IF;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Incline Dumbbell Bench Press' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day1_id, ex_id, 4, '8-10', 90, 2); END IF;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Chest Fly' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day1_id, ex_id, 3, '12-15', 60, 3); END IF;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Overhead Press' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day1_id, ex_id, 4, '6-8', 90, 4); END IF;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Lateral Raise' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day1_id, ex_id, 4, '12-15', 45, 5); END IF;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Close-Grip Bench Press' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day1_id, ex_id, 3, '8-10', 75, 6); END IF;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Cable Tricep Extension' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day1_id, ex_id, 3, '12-15', 60, 7); END IF;

  -- Day 2: Pull (Back, Biceps)
  INSERT INTO workout_plan_days (workout_plan_id, day_index, title, notes)
  VALUES (plan_id, 2, 'Pull Day 1', 'Heavy back focus')
  RETURNING id INTO day2_id;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Deadlift' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day2_id, ex_id, 5, '4-5', 180, 1); END IF;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Barbell Row' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day2_id, ex_id, 4, '6-8', 90, 2); END IF;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Pull-ups' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day2_id, ex_id, 4, '8-12', 75, 3); END IF;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Cable Row' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day2_id, ex_id, 3, '10-12', 60, 4); END IF;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Face Pull' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day2_id, ex_id, 3, '15-20', 45, 5); END IF;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Barbell Curl' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day2_id, ex_id, 3, '10-12', 60, 6); END IF;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Hammer Curl' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day2_id, ex_id, 3, '12-15', 45, 7); END IF;

  -- Day 3: Legs
  INSERT INTO workout_plan_days (workout_plan_id, day_index, title, notes)
  VALUES (plan_id, 3, 'Leg Day', 'Complete leg workout')
  RETURNING id INTO day3_id;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Squat' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day3_id, ex_id, 5, '5-6', 150, 1); END IF;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Romanian Deadlift' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day3_id, ex_id, 4, '8-10', 120, 2); END IF;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Leg Press' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day3_id, ex_id, 4, '12-15', 90, 3); END IF;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Leg Extension' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day3_id, ex_id, 3, '15-20', 60, 4); END IF;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Leg Curl' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day3_id, ex_id, 3, '15-20', 60, 5); END IF;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Calf Raise' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day3_id, ex_id, 4, '15-20', 45, 6); END IF;

  -- Day 4: Push (Shoulders Focus)
  INSERT INTO workout_plan_days (workout_plan_id, day_index, title, notes)
  VALUES (plan_id, 4, 'Push Day 2', 'Shoulder and tricep focus')
  RETURNING id INTO day4_id;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Overhead Press' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day4_id, ex_id, 5, '6-8', 120, 1); END IF;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Dumbbell Shoulder Press' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day4_id, ex_id, 4, '8-10', 90, 2); END IF;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Lateral Raise' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day4_id, ex_id, 4, '12-15', 45, 3); END IF;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Rear Delt Fly' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day4_id, ex_id, 3, '15-20', 45, 4); END IF;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Dips' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day4_id, ex_id, 4, '10-15', 75, 5); END IF;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Overhead Tricep Extension' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day4_id, ex_id, 3, '12-15', 60, 6); END IF;

  -- Day 5: Pull (Back Width)
  INSERT INTO workout_plan_days (workout_plan_id, day_index, title, notes)
  VALUES (plan_id, 5, 'Pull Day 2', 'Back width and biceps')
  RETURNING id INTO day5_id;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Wide-Grip Pull-up' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day5_id, ex_id, 4, '10-12', 90, 1); END IF;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Lat Pulldown' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day5_id, ex_id, 4, '10-12', 75, 2); END IF;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Cable Row' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day5_id, ex_id, 3, '12-15', 60, 3); END IF;

  SELECT id INTO ex_id FROM exercises WHERE name = 'One-Arm Dumbbell Row' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day5_id, ex_id, 3, '10-12 each', 60, 4); END IF;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Preacher Curl' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day5_id, ex_id, 3, '10-12', 60, 5); END IF;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Concentration Curl' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day5_id, ex_id, 3, '12-15', 45, 6); END IF;
END $$;

-- ============================================================================
-- 4. GENERAL FITNESS PLAN (3 days/week - Full Body)
-- ============================================================================
DO $$
DECLARE
  plan_id UUID;
  day1_id UUID;
  day2_id UUID;
  day3_id UUID;
  ex_id UUID;
BEGIN
  INSERT INTO workout_plans (title, goal_type, level, notes)
  VALUES (
    'General Fitness Full Body',
    'general_fitness',
    'beginner',
    'A balanced 3-day full-body program for overall health and fitness. Suitable for beginners and those maintaining general fitness.'
  )
  RETURNING id INTO plan_id;

  -- Day 1
  INSERT INTO workout_plan_days (workout_plan_id, day_index, title, notes)
  VALUES (plan_id, 1, 'Full Body Workout A', 'Complete body workout')
  RETURNING id INTO day1_id;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Squat' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day1_id, ex_id, 3, '12-15', 60, 1); END IF;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Bench Press' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day1_id, ex_id, 3, '10-12', 60, 2); END IF;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Barbell Row' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day1_id, ex_id, 3, '10-12', 60, 3); END IF;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Overhead Press' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day1_id, ex_id, 3, '10-12', 60, 4); END IF;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Plank' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day1_id, ex_id, 3, '45-60 seconds', 30, 5); END IF;

  -- Day 2
  INSERT INTO workout_plan_days (workout_plan_id, day_index, title, notes)
  VALUES (plan_id, 2, 'Full Body Workout B', 'Complete body workout variation')
  RETURNING id INTO day2_id;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Deadlift' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day2_id, ex_id, 3, '8-10', 90, 1); END IF;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Dumbbell Bench Press' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day2_id, ex_id, 3, '10-12', 60, 2); END IF;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Pull-ups' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day2_id, ex_id, 3, '8-10', 60, 3); END IF;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Lunges' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day2_id, ex_id, 3, '12 each leg', 60, 4); END IF;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Crunches' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day2_id, ex_id, 3, '20-25', 30, 5); END IF;

  -- Day 3
  INSERT INTO workout_plan_days (workout_plan_id, day_index, title, notes)
  VALUES (plan_id, 3, 'Full Body Workout C', 'Complete body workout variation')
  RETURNING id INTO day3_id;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Front Squat' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day3_id, ex_id, 3, '10-12', 75, 1); END IF;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Incline Bench Press' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day3_id, ex_id, 3, '10-12', 60, 2); END IF;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Dumbbell Row' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day3_id, ex_id, 3, '10-12', 60, 3); END IF;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Dumbbell Shoulder Press' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day3_id, ex_id, 3, '10-12', 60, 4); END IF;

  SELECT id INTO ex_id FROM exercises WHERE name = 'Leg Raises' LIMIT 1;
  IF ex_id IS NOT NULL THEN INSERT INTO workout_plan_exercises (workout_plan_day_id, exercise_id, sets, reps, rest_seconds, order_index) VALUES (day3_id, ex_id, 3, '15-20', 30, 5); END IF;
END $$;




