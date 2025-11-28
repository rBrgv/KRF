-- ============================================================================
-- REMOVE DUPLICATE EXERCISES
-- ============================================================================
-- This migration removes duplicate exercises, keeping only the first one
-- based on exercise name (case-insensitive)
-- ============================================================================

-- Delete duplicate exercises, keeping the one with the earliest created_at
-- ============================================================================
DELETE FROM exercises
WHERE id IN (
  SELECT id
  FROM (
    SELECT 
      id,
      ROW_NUMBER() OVER (
        PARTITION BY LOWER(TRIM(name))
        ORDER BY created_at ASC
      ) as row_num
    FROM exercises
  ) duplicates
  WHERE row_num > 1
);

-- Alternative approach if the above doesn't work well:
-- Keep exercises that are NOT duplicates
-- ============================================================================
-- WITH duplicates AS (
--   SELECT 
--     id,
--     LOWER(TRIM(name)) as normalized_name,
--     ROW_NUMBER() OVER (
--       PARTITION BY LOWER(TRIM(name))
--       ORDER BY created_at ASC
--     ) as row_num
--   FROM exercises
-- )
-- DELETE FROM exercises
-- WHERE id IN (
--   SELECT id FROM duplicates WHERE row_num > 1
-- );

-- Show count of remaining exercises
-- ============================================================================
-- SELECT COUNT(*) as total_exercises FROM exercises;
-- SELECT name, COUNT(*) as count 
-- FROM exercises 
-- GROUP BY name 
-- HAVING COUNT(*) > 1;




