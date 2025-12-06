-- ============================================================================
-- CONSOLIDATE DUPLICATE LEADS
-- ============================================================================
-- This script finds and consolidates duplicate leads based on phone or email
-- It keeps the oldest lead and merges all data from duplicates

-- Function to merge sources without duplicates
CREATE OR REPLACE FUNCTION merge_source_strings(sources TEXT[])
RETURNS TEXT AS $$
DECLARE
  result TEXT := '';
  source TEXT;
  seen TEXT[] := ARRAY[]::TEXT[];
BEGIN
  -- Handle NULL array
  IF sources IS NULL THEN
    RETURN '';
  END IF;
  
  FOREACH source IN ARRAY sources
  LOOP
    IF source IS NOT NULL AND source != '' AND NOT (source = ANY(seen)) THEN
      IF result != '' THEN
        result := result || ', ';
      END IF;
      result := result || source;
      seen := array_append(seen, source);
    END IF;
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to merge goals
CREATE OR REPLACE FUNCTION merge_goal_strings(goals TEXT[])
RETURNS TEXT AS $$
DECLARE
  result TEXT := '';
  goal TEXT;
  seen TEXT[] := ARRAY[]::TEXT[];
BEGIN
  -- Handle NULL array
  IF goals IS NULL THEN
    RETURN '';
  END IF;
  
  FOREACH goal IN ARRAY goals
  LOOP
    IF goal IS NOT NULL AND goal != '' AND NOT (goal = ANY(seen)) THEN
      IF result != '' THEN
        result := result || ' | ';
      END IF;
      result := result || goal;
      seen := array_append(seen, goal);
    END IF;
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to merge notes
CREATE OR REPLACE FUNCTION merge_notes_strings(notes TEXT[])
RETURNS TEXT AS $$
DECLARE
  result TEXT := '';
  note TEXT;
BEGIN
  -- Handle NULL array
  IF notes IS NULL THEN
    RETURN '';
  END IF;
  
  FOREACH note IN ARRAY notes
  LOOP
    IF note IS NOT NULL AND note != '' THEN
      IF result != '' THEN
        result := result || E'\n\n---\n\n';
      END IF;
      result := result || note;
    END IF;
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Temporary table to store duplicate groups
CREATE TEMP TABLE IF NOT EXISTS duplicate_groups AS
WITH normalized_leads AS (
  SELECT 
    id,
    name,
    email,
    phone,
    REGEXP_REPLACE(phone, '[^0-9]', '', 'g') AS phone_normalized,
    goal,
    source,
    notes,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_content,
    referrer,
    status,
    created_at,
    updated_at,
    -- Group identifier: use email if available, otherwise normalized phone
    COALESCE(LOWER(TRIM(email)), REGEXP_REPLACE(phone, '[^0-9]', '', 'g')) AS group_key
  FROM leads
  WHERE phone IS NOT NULL AND phone != ''
),
duplicate_sets AS (
  SELECT 
    group_key,
    ARRAY_AGG(id ORDER BY created_at ASC) AS lead_ids,
    COUNT(*) AS duplicate_count
  FROM normalized_leads
  GROUP BY group_key
  HAVING COUNT(*) > 1
)
SELECT 
  ds.group_key,
  ds.lead_ids,
  ds.duplicate_count,
  ds.lead_ids[1] AS keep_lead_id,  -- Keep the oldest (first in array)
  ds.lead_ids[2:array_length(ds.lead_ids, 1)] AS duplicate_lead_ids  -- All others are duplicates
FROM duplicate_sets ds;

-- Show summary of duplicates found
DO $$
DECLARE
  total_groups INT;
  total_duplicates INT;
BEGIN
  SELECT COUNT(*), SUM(duplicate_count - 1) INTO total_groups, total_duplicates
  FROM duplicate_groups;
  
  RAISE NOTICE 'Found % duplicate groups with % total duplicate leads to consolidate', total_groups, total_duplicates;
END $$;

-- Consolidate duplicates
DO $$
DECLARE
  dup_record RECORD;
  keep_id UUID;
  duplicate_ids UUID[];
  merged_source TEXT;
  merged_goal TEXT;
  merged_notes TEXT;
  merged_email TEXT;
  merged_utm_source TEXT;
  merged_utm_medium TEXT;
  merged_utm_campaign TEXT;
  merged_utm_content TEXT;
  merged_referrer TEXT;
  sources_array TEXT[];
  goals_array TEXT[];
  notes_array TEXT[];
BEGIN
  FOR dup_record IN SELECT * FROM duplicate_groups
  LOOP
    keep_id := dup_record.keep_lead_id;
    duplicate_ids := dup_record.duplicate_lead_ids;
    
    -- Collect all data from duplicates and the kept lead
    SELECT 
      COALESCE(ARRAY_AGG(DISTINCT source) FILTER (WHERE source IS NOT NULL), ARRAY[]::TEXT[]),
      COALESCE(ARRAY_AGG(DISTINCT goal) FILTER (WHERE goal IS NOT NULL), ARRAY[]::TEXT[]),
      COALESCE(ARRAY_AGG(notes) FILTER (WHERE notes IS NOT NULL), ARRAY[]::TEXT[]),
      MAX(email) FILTER (WHERE email IS NOT NULL),  -- Use the most complete email
      MAX(utm_source) FILTER (WHERE utm_source IS NOT NULL),
      MAX(utm_medium) FILTER (WHERE utm_medium IS NOT NULL),
      MAX(utm_campaign) FILTER (WHERE utm_campaign IS NOT NULL),
      MAX(utm_content) FILTER (WHERE utm_content IS NOT NULL),
      MAX(referrer) FILTER (WHERE referrer IS NOT NULL)
    INTO 
      sources_array,
      goals_array,
      notes_array,
      merged_email,
      merged_utm_source,
      merged_utm_medium,
      merged_utm_campaign,
      merged_utm_content,
      merged_referrer
    FROM leads
    WHERE id = ANY(ARRAY[keep_id] || duplicate_ids);
    
    -- Merge the arrays
    merged_source := merge_source_strings(sources_array);
    merged_goal := merge_goal_strings(goals_array);
    merged_notes := merge_notes_strings(notes_array);
    
    -- Update the kept lead with merged data
    UPDATE leads
    SET 
      source = COALESCE(merged_source, source),
      goal = COALESCE(merged_goal, goal),
      notes = COALESCE(merged_notes, notes),
      email = COALESCE(merged_email, email),
      utm_source = COALESCE(merged_utm_source, utm_source),
      utm_medium = COALESCE(merged_utm_medium, utm_medium),
      utm_campaign = COALESCE(merged_utm_campaign, utm_campaign),
      utm_content = COALESCE(merged_utm_content, utm_content),
      referrer = COALESCE(merged_referrer, referrer),
      updated_at = NOW()
    WHERE id = keep_id;
    
    -- Update health_assessments to point to kept lead
    UPDATE health_assessments
    SET lead_id = keep_id
    WHERE lead_id = ANY(duplicate_ids);
    
    -- Update clients to point to kept lead
    UPDATE clients
    SET lead_id = keep_id
    WHERE lead_id = ANY(duplicate_ids);
    
    -- Delete duplicate leads
    DELETE FROM leads
    WHERE id = ANY(duplicate_ids);
    
    RAISE NOTICE 'Consolidated % duplicates into lead %', array_length(duplicate_ids, 1), keep_id;
  END LOOP;
  
  RAISE NOTICE 'Duplicate consolidation complete!';
END $$;

-- Clean up temporary table
DROP TABLE IF EXISTS duplicate_groups;

-- Clean up helper functions (optional - you can keep them if needed)
-- DROP FUNCTION IF EXISTS merge_source_strings(TEXT[]);
-- DROP FUNCTION IF EXISTS merge_goal_strings(TEXT[]);
-- DROP FUNCTION IF EXISTS merge_notes_strings(TEXT[]);

-- Show final summary
DO $$
DECLARE
  remaining_leads INT;
BEGIN
  SELECT COUNT(*) INTO remaining_leads FROM leads;
  RAISE NOTICE 'Total leads remaining after consolidation: %', remaining_leads;
END $$;

