-- ============================================================================
-- HEALTH ASSESSMENT QUESTIONS TABLE
-- ============================================================================
-- Stores question configuration so questions can be managed without code changes

CREATE TABLE IF NOT EXISTS health_assessment_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Question identification
  question_id TEXT NOT NULL UNIQUE, -- e.g., 'energy_level', 'stress_level'
  section TEXT NOT NULL CHECK (section IN ('physical', 'pain', 'lifestyle', 'mental', 'goal')),
  display_order INTEGER NOT NULL, -- Order within section
  
  -- Question content
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('choice', 'scale', 'numeric')),
  
  -- Question configuration (stored as JSONB for flexibility)
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  -- config can contain:
  --   - choices: [{value: 'x', label: 'Y'}, ...] for choice questions
  --   - min/max: for scale/numeric questions
  --   - required: boolean
  --   - optional: boolean
  --   - unit: string (for numeric)
  
  -- Metadata
  is_active BOOLEAN DEFAULT true,
  purpose TEXT, -- Optional: purpose/description of the question
  
  CONSTRAINT unique_section_order UNIQUE (section, display_order)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_health_questions_section ON health_assessment_questions(section, display_order);
CREATE INDEX IF NOT EXISTS idx_health_questions_active ON health_assessment_questions(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_health_questions_question_id ON health_assessment_questions(question_id);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_health_questions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_health_questions_updated_at
  BEFORE UPDATE ON health_assessment_questions
  FOR EACH ROW
  EXECUTE FUNCTION update_health_questions_updated_at();

-- Comments
COMMENT ON TABLE health_assessment_questions IS 'Stores health assessment question configuration';
COMMENT ON COLUMN health_assessment_questions.config IS 'JSONB object storing question-specific configuration (choices, min/max, etc.)';
COMMENT ON COLUMN health_assessment_questions.purpose IS 'Optional description explaining the purpose of this question';

-- ============================================================================
-- ADD AGE GROUP COLUMN TO HEALTH ASSESSMENTS
-- ============================================================================

ALTER TABLE health_assessments 
ADD COLUMN IF NOT EXISTS age_group TEXT;

-- Add index for age group queries
CREATE INDEX IF NOT EXISTS idx_health_assessments_age_group 
ON health_assessments(age_group) 
WHERE age_group IS NOT NULL;

-- Add comment
COMMENT ON COLUMN health_assessments.age_group IS 'Age group of the assessment taker (e.g., 18-25, 26-35, etc.)';

