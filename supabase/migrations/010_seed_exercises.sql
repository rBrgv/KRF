-- ============================================================================
-- SEED COMPREHENSIVE EXERCISE LIBRARY
-- ============================================================================
-- This migration adds a comprehensive list of exercises covering all categories,
-- equipment types, and muscle groups for the workout system.
-- ============================================================================

-- CHEST EXERCISES
-- ============================================================================
INSERT INTO exercises (name, category, equipment, muscle_group, description) VALUES
  ('Bench Press', 'push', 'barbell', 'chest', 'Classic chest exercise performed lying on a bench, pressing weight upward'),
  ('Dumbbell Bench Press', 'push', 'dumbbells', 'chest', 'Chest exercise using dumbbells for greater range of motion'),
  ('Incline Bench Press', 'push', 'barbell', 'chest', 'Bench press performed on an inclined bench targeting upper chest'),
  ('Decline Bench Press', 'push', 'barbell', 'chest', 'Bench press on declined bench targeting lower chest'),
  ('Push-ups', 'push', 'bodyweight', 'chest', 'Bodyweight exercise targeting chest, shoulders, and triceps'),
  ('Incline Push-ups', 'push', 'bodyweight', 'chest', 'Push-ups with hands elevated, easier variation'),
  ('Decline Push-ups', 'push', 'bodyweight', 'chest', 'Push-ups with feet elevated, advanced variation'),
  ('Chest Fly', 'push', 'dumbbells', 'chest', 'Isolation exercise for chest using dumbbells in arcing motion'),
  ('Cable Chest Fly', 'push', 'cable', 'chest', 'Chest fly using cable machine for constant tension'),
  ('Pec Deck', 'push', 'machine', 'chest', 'Machine exercise isolating chest muscles'),
  ('Dips', 'push', 'bodyweight', 'chest', 'Bodyweight exercise targeting chest and triceps'),
  ('Dumbbell Pullover', 'push', 'dumbbells', 'chest', 'Exercise targeting chest and lats with dumbbell'),
  ('Cable Crossover', 'push', 'cable', 'chest', 'Chest exercise using cables in crossing motion');

-- BACK EXERCISES
-- ============================================================================
INSERT INTO exercises (name, category, equipment, muscle_group, description) VALUES
  ('Deadlift', 'pull', 'barbell', 'back', 'Compound exercise targeting entire posterior chain'),
  ('Barbell Row', 'pull', 'barbell', 'back', 'Horizontal pulling exercise for back thickness'),
  ('Dumbbell Row', 'pull', 'dumbbells', 'back', 'Unilateral rowing exercise with dumbbells'),
  ('Pull-ups', 'pull', 'bodyweight', 'back', 'Bodyweight vertical pulling exercise'),
  ('Chin-ups', 'pull', 'bodyweight', 'back', 'Pull-ups with palms facing toward you'),
  ('Lat Pulldown', 'pull', 'machine', 'back', 'Machine exercise mimicking pull-ups'),
  ('Cable Row', 'pull', 'cable', 'back', 'Seated rowing exercise using cable machine'),
  ('T-Bar Row', 'pull', 'barbell', 'back', 'Rowing exercise using T-bar setup'),
  ('Seated Cable Row', 'pull', 'cable', 'back', 'Seated rowing exercise with cable machine'),
  ('One-Arm Dumbbell Row', 'pull', 'dumbbells', 'back', 'Unilateral rowing exercise'),
  ('Face Pull', 'pull', 'cable', 'back', 'Rear delt and upper back exercise'),
  ('Wide-Grip Pull-up', 'pull', 'bodyweight', 'back', 'Pull-ups with wide grip for lats'),
  ('Close-Grip Pull-up', 'pull', 'bodyweight', 'back', 'Pull-ups with narrow grip'),
  ('Hyperextension', 'pull', 'bodyweight', 'back', 'Lower back strengthening exercise'),
  ('Shrugs', 'pull', 'dumbbells', 'back', 'Trap-focused exercise with dumbbells'),
  ('Barbell Shrugs', 'pull', 'barbell', 'back', 'Trap exercise using barbell');

-- SHOULDER EXERCISES
-- ============================================================================
INSERT INTO exercises (name, category, equipment, muscle_group, description) VALUES
  ('Overhead Press', 'push', 'barbell', 'shoulders', 'Vertical pressing exercise for shoulders'),
  ('Dumbbell Shoulder Press', 'push', 'dumbbells', 'shoulders', 'Shoulder press using dumbbells'),
  ('Lateral Raise', 'push', 'dumbbells', 'shoulders', 'Isolation exercise for side delts'),
  ('Front Raise', 'push', 'dumbbells', 'shoulders', 'Exercise targeting front deltoids'),
  ('Rear Delt Fly', 'pull', 'dumbbells', 'shoulders', 'Exercise targeting rear deltoids'),
  ('Cable Lateral Raise', 'push', 'cable', 'shoulders', 'Lateral raise using cable machine'),
  ('Arnold Press', 'push', 'dumbbells', 'shoulders', 'Rotating shoulder press variation'),
  ('Upright Row', 'pull', 'barbell', 'shoulders', 'Vertical pulling exercise for shoulders'),
  ('Pike Push-up', 'push', 'bodyweight', 'shoulders', 'Bodyweight shoulder exercise'),
  ('Handstand Push-up', 'push', 'bodyweight', 'shoulders', 'Advanced bodyweight shoulder exercise'),
  ('Reverse Fly', 'pull', 'dumbbells', 'shoulders', 'Rear delt exercise with dumbbells'),
  ('Cable Rear Delt Fly', 'pull', 'cable', 'shoulders', 'Rear delt exercise using cables');

-- BICEPS EXERCISES
-- ============================================================================
INSERT INTO exercises (name, category, equipment, muscle_group, description) VALUES
  ('Barbell Curl', 'pull', 'barbell', 'biceps', 'Classic bicep exercise with barbell'),
  ('Dumbbell Curl', 'pull', 'dumbbells', 'biceps', 'Bicep curl using dumbbells'),
  ('Hammer Curl', 'pull', 'dumbbells', 'biceps', 'Neutral grip curl targeting brachialis'),
  ('Cable Curl', 'pull', 'cable', 'biceps', 'Bicep curl using cable machine'),
  ('Preacher Curl', 'pull', 'barbell', 'biceps', 'Isolation bicep exercise on preacher bench'),
  ('Concentration Curl', 'pull', 'dumbbells', 'biceps', 'Seated isolation bicep exercise'),
  ('21s', 'pull', 'barbell', 'biceps', 'Bicep training method with partial reps'),
  ('Cable Hammer Curl', 'pull', 'cable', 'biceps', 'Hammer curl variation with cables'),
  ('Incline Dumbbell Curl', 'pull', 'dumbbells', 'biceps', 'Bicep curl on inclined bench'),
  ('Spider Curl', 'pull', 'barbell', 'biceps', 'Bicep exercise on inclined bench face down');

-- TRICEPS EXERCISES
-- ============================================================================
INSERT INTO exercises (name, category, equipment, muscle_group, description) VALUES
  ('Close-Grip Bench Press', 'push', 'barbell', 'triceps', 'Bench press with narrow grip for triceps'),
  ('Tricep Dips', 'push', 'bodyweight', 'triceps', 'Bodyweight exercise targeting triceps'),
  ('Overhead Tricep Extension', 'push', 'dumbbells', 'triceps', 'Tricep exercise with weight overhead'),
  ('Cable Tricep Extension', 'push', 'cable', 'triceps', 'Tricep exercise using cable machine'),
  ('Tricep Kickback', 'push', 'dumbbells', 'triceps', 'Isolation tricep exercise'),
  ('Diamond Push-ups', 'push', 'bodyweight', 'triceps', 'Push-up variation targeting triceps'),
  ('Skull Crusher', 'push', 'barbell', 'triceps', 'Lying tricep extension exercise'),
  ('Cable Overhead Extension', 'push', 'cable', 'triceps', 'Overhead tricep extension with cable'),
  ('Tricep Rope Extension', 'push', 'cable', 'triceps', 'Tricep exercise using rope attachment'),
  ('Bench Dips', 'push', 'bodyweight', 'triceps', 'Tricep dips using bench');

-- LEGS EXERCISES
-- ============================================================================
INSERT INTO exercises (name, category, equipment, muscle_group, description) VALUES
  ('Squat', 'legs', 'barbell', 'legs', 'King of leg exercises, targets quads, glutes, and core'),
  ('Front Squat', 'legs', 'barbell', 'legs', 'Squat variation with bar in front position'),
  ('Goblet Squat', 'legs', 'dumbbells', 'legs', 'Squat holding dumbbell at chest'),
  ('Bulgarian Split Squat', 'legs', 'dumbbells', 'legs', 'Unilateral leg exercise'),
  ('Lunges', 'legs', 'dumbbells', 'legs', 'Forward stepping leg exercise'),
  ('Reverse Lunges', 'legs', 'dumbbells', 'legs', 'Lunges stepping backward'),
  ('Walking Lunges', 'legs', 'dumbbells', 'legs', 'Lunges performed while walking'),
  ('Leg Press', 'legs', 'machine', 'legs', 'Machine exercise for legs'),
  ('Leg Extension', 'legs', 'machine', 'legs', 'Isolation exercise for quadriceps'),
  ('Leg Curl', 'legs', 'machine', 'legs', 'Isolation exercise for hamstrings'),
  ('Romanian Deadlift', 'legs', 'barbell', 'legs', 'Hip hinge exercise for hamstrings and glutes'),
  ('Stiff Leg Deadlift', 'legs', 'barbell', 'legs', 'Deadlift variation targeting hamstrings'),
  ('Hack Squat', 'legs', 'machine', 'legs', 'Machine squat variation'),
  ('Step-ups', 'legs', 'dumbbells', 'legs', 'Stepping exercise onto platform'),
  ('Pistol Squat', 'legs', 'bodyweight', 'legs', 'Advanced single-leg squat'),
  ('Wall Sit', 'legs', 'bodyweight', 'legs', 'Isometric leg exercise against wall'),
  ('Calf Raise', 'legs', 'dumbbells', 'legs', 'Exercise targeting calf muscles'),
  ('Seated Calf Raise', 'legs', 'machine', 'legs', 'Calf exercise in seated position'),
  ('Standing Calf Raise', 'legs', 'machine', 'legs', 'Calf exercise in standing position');

-- GLUTES EXERCISES
-- ============================================================================
INSERT INTO exercises (name, category, equipment, muscle_group, description) VALUES
  ('Hip Thrust', 'legs', 'barbell', 'glutes', 'Exercise targeting glutes in bridge position'),
  ('Glute Bridge', 'legs', 'bodyweight', 'glutes', 'Bodyweight glute exercise'),
  ('Single-Leg Glute Bridge', 'legs', 'bodyweight', 'glutes', 'Unilateral glute bridge'),
  ('Romanian Deadlift', 'legs', 'barbell', 'glutes', 'Hip hinge exercise for glutes and hamstrings'),
  ('Bulgarian Split Squat', 'legs', 'dumbbells', 'glutes', 'Unilateral exercise targeting glutes'),
  ('Lunges', 'legs', 'dumbbells', 'glutes', 'Stepping exercise targeting glutes'),
  ('Cable Kickback', 'legs', 'cable', 'glutes', 'Isolation glute exercise with cable'),
  ('Clamshells', 'legs', 'resistance_band', 'glutes', 'Side-lying glute activation exercise'),
  ('Fire Hydrants', 'legs', 'bodyweight', 'glutes', 'Quadruped glute exercise'),
  ('Donkey Kicks', 'legs', 'bodyweight', 'glutes', 'Quadruped glute kick exercise');

-- CORE EXERCISES
-- ============================================================================
INSERT INTO exercises (name, category, equipment, muscle_group, description) VALUES
  ('Plank', 'core', 'bodyweight', 'core', 'Isometric core strengthening exercise'),
  ('Side Plank', 'core', 'bodyweight', 'core', 'Lateral core exercise'),
  ('Crunches', 'core', 'bodyweight', 'core', 'Abdominal exercise'),
  ('Sit-ups', 'core', 'bodyweight', 'core', 'Abdominal exercise with full range'),
  ('Russian Twist', 'core', 'bodyweight', 'core', 'Rotational core exercise'),
  ('Mountain Climbers', 'core', 'bodyweight', 'core', 'Dynamic core and cardio exercise'),
  ('Leg Raises', 'core', 'bodyweight', 'core', 'Lower ab exercise'),
  ('Hanging Leg Raises', 'core', 'bodyweight', 'core', 'Advanced leg raise from pull-up bar'),
  ('Dead Bug', 'core', 'bodyweight', 'core', 'Core stability exercise'),
  ('Bird Dog', 'core', 'bodyweight', 'core', 'Core stability exercise in quadruped'),
  ('Bicycle Crunches', 'core', 'bodyweight', 'core', 'Rotational ab exercise'),
  ('Ab Wheel Rollout', 'core', 'other', 'core', 'Advanced core exercise with ab wheel'),
  ('Cable Crunch', 'core', 'cable', 'core', 'Ab exercise using cable machine'),
  ('Plank to Push-up', 'core', 'bodyweight', 'core', 'Dynamic core exercise'),
  ('V-Ups', 'core', 'bodyweight', 'core', 'Advanced ab exercise'),
  ('Flutter Kicks', 'core', 'bodyweight', 'core', 'Lower ab exercise'),
  ('Reverse Crunches', 'core', 'bodyweight', 'core', 'Lower ab exercise variation');

-- CARDIO EXERCISES
-- ============================================================================
INSERT INTO exercises (name, category, equipment, muscle_group, description) VALUES
  ('Running', 'cardio', 'bodyweight', 'cardio', 'Classic cardiovascular exercise'),
  ('Sprinting', 'cardio', 'bodyweight', 'cardio', 'High-intensity running'),
  ('Jumping Jacks', 'cardio', 'bodyweight', 'cardio', 'Full-body cardio exercise'),
  ('Burpees', 'cardio', 'bodyweight', 'cardio', 'High-intensity full-body exercise'),
  ('High Knees', 'cardio', 'bodyweight', 'cardio', 'Running in place with high knees'),
  ('Butt Kicks', 'cardio', 'bodyweight', 'cardio', 'Running in place kicking heels to glutes'),
  ('Mountain Climbers', 'cardio', 'bodyweight', 'cardio', 'Dynamic cardio and core exercise'),
  ('Jump Rope', 'cardio', 'other', 'cardio', 'Cardio exercise with jump rope'),
  ('Rowing Machine', 'cardio', 'machine', 'cardio', 'Full-body cardio on rowing machine'),
  ('Stationary Bike', 'cardio', 'machine', 'cardio', 'Low-impact cardio exercise'),
  ('Elliptical', 'cardio', 'machine', 'cardio', 'Low-impact cardio machine'),
  ('Treadmill Running', 'cardio', 'machine', 'cardio', 'Running on treadmill'),
  ('Stair Climber', 'cardio', 'machine', 'cardio', 'Cardio exercise on stair machine'),
  ('Battle Ropes', 'cardio', 'other', 'cardio', 'High-intensity cardio with ropes'),
  ('Box Jumps', 'cardio', 'bodyweight', 'cardio', 'Explosive jumping exercise');

-- FULL BODY EXERCISES
-- ============================================================================
INSERT INTO exercises (name, category, equipment, muscle_group, description) VALUES
  ('Deadlift', 'full_body', 'barbell', 'full_body', 'Compound exercise targeting entire body'),
  ('Squat', 'full_body', 'barbell', 'full_body', 'Full-body compound movement'),
  ('Burpees', 'full_body', 'bodyweight', 'full_body', 'Full-body high-intensity exercise'),
  ('Thruster', 'full_body', 'barbell', 'full_body', 'Squat to overhead press combination'),
  ('Clean and Press', 'full_body', 'barbell', 'full_body', 'Olympic lift variation'),
  ('Kettlebell Swing', 'full_body', 'kettlebell', 'full_body', 'Hip-driven full-body exercise'),
  ('Turkish Get-up', 'full_body', 'kettlebell', 'full_body', 'Complex full-body movement'),
  ('Farmer''s Walk', 'full_body', 'dumbbells', 'full_body', 'Loaded carry exercise'),
  ('Sled Push', 'full_body', 'machine', 'full_body', 'Full-body pushing exercise'),
  ('Battle Ropes', 'full_body', 'other', 'full_body', 'Full-body cardio and strength');

-- FLEXIBILITY EXERCISES
-- ============================================================================
-- Note: muscle_group doesn't have 'flexibility', using 'other' instead
INSERT INTO exercises (name, category, equipment, muscle_group, description) VALUES
  ('Static Stretch', 'flexibility', 'bodyweight', 'other', 'Holding stretch position'),
  ('Dynamic Stretch', 'flexibility', 'bodyweight', 'other', 'Moving through stretch range'),
  ('Hip Flexor Stretch', 'flexibility', 'bodyweight', 'other', 'Stretching front of hip'),
  ('Hamstring Stretch', 'flexibility', 'bodyweight', 'other', 'Stretching back of thigh'),
  ('Quad Stretch', 'flexibility', 'bodyweight', 'other', 'Stretching front of thigh'),
  ('Calf Stretch', 'flexibility', 'bodyweight', 'other', 'Stretching calf muscles'),
  ('Shoulder Stretch', 'flexibility', 'bodyweight', 'other', 'Stretching shoulder muscles'),
  ('Chest Stretch', 'flexibility', 'bodyweight', 'other', 'Stretching chest muscles'),
  ('Spinal Twist', 'flexibility', 'bodyweight', 'other', 'Rotational spine stretch'),
  ('Pigeon Pose', 'flexibility', 'bodyweight', 'other', 'Hip opening stretch'),
  ('Downward Dog', 'flexibility', 'bodyweight', 'other', 'Full-body stretch position'),
  ('Child''s Pose', 'flexibility', 'bodyweight', 'other', 'Restorative stretch position');

-- KETTLEBELL EXERCISES
-- ============================================================================
INSERT INTO exercises (name, category, equipment, muscle_group, description) VALUES
  ('Kettlebell Swing', 'full_body', 'kettlebell', 'full_body', 'Hip-driven explosive movement'),
  ('Turkish Get-up', 'full_body', 'kettlebell', 'full_body', 'Complex full-body movement'),
  ('Kettlebell Goblet Squat', 'legs', 'kettlebell', 'legs', 'Squat holding kettlebell at chest'),
  ('Kettlebell Press', 'push', 'kettlebell', 'shoulders', 'Overhead press with kettlebell'),
  ('Kettlebell Row', 'pull', 'kettlebell', 'back', 'Rowing exercise with kettlebell'),
  ('Kettlebell Snatch', 'full_body', 'kettlebell', 'full_body', 'Explosive overhead movement'),
  ('Kettlebell Clean', 'full_body', 'kettlebell', 'full_body', 'Lifting kettlebell to shoulder'),
  ('Kettlebell Windmill', 'core', 'kettlebell', 'core', 'Core and flexibility exercise'),
  ('Kettlebell Figure 8', 'core', 'kettlebell', 'core', 'Core exercise passing kettlebell'),
  ('Kettlebell Halo', 'core', 'kettlebell', 'core', 'Core exercise circling kettlebell overhead');

-- RESISTANCE BAND EXERCISES
-- ============================================================================
INSERT INTO exercises (name, category, equipment, muscle_group, description) VALUES
  ('Band Pull-apart', 'pull', 'resistance_band', 'back', 'Rear delt and upper back exercise'),
  ('Band Chest Press', 'push', 'resistance_band', 'chest', 'Chest exercise with resistance band'),
  ('Band Lateral Raise', 'push', 'resistance_band', 'shoulders', 'Shoulder exercise with band'),
  ('Band Bicep Curl', 'pull', 'resistance_band', 'biceps', 'Bicep exercise with resistance band'),
  ('Band Tricep Extension', 'push', 'resistance_band', 'triceps', 'Tricep exercise with band'),
  ('Band Squat', 'legs', 'resistance_band', 'legs', 'Squat with resistance band'),
  ('Band Glute Bridge', 'legs', 'resistance_band', 'glutes', 'Glute exercise with band'),
  ('Band Clamshell', 'legs', 'resistance_band', 'glutes', 'Glute activation with band'),
  ('Band Row', 'pull', 'resistance_band', 'back', 'Rowing exercise with resistance band'),
  ('Band Woodchop', 'core', 'resistance_band', 'core', 'Rotational core exercise with band');

