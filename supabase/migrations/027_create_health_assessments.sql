-- ============================================================================
-- HEALTH ASSESSMENTS TABLE
-- ============================================================================
-- Stores health diagnostic assessments with scores and answers

CREATE TABLE IF NOT EXISTS health_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  height_cm INTEGER,
  weight_kg NUMERIC(5, 2),
  bmi NUMERIC(4, 2),
  overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  physical_score INTEGER NOT NULL CHECK (physical_score >= 0 AND physical_score <= 25),
  lifestyle_score INTEGER NOT NULL CHECK (lifestyle_score >= 0 AND lifestyle_score <= 15),
  nutrition_score INTEGER NOT NULL CHECK (nutrition_score >= 0 AND nutrition_score <= 15),
  mental_score INTEGER NOT NULL CHECK (mental_score >= 0 AND mental_score <= 20),
  pain_mobility_score INTEGER NOT NULL CHECK (pain_mobility_score >= 0 AND pain_mobility_score <= 10),
  goal_readiness_score INTEGER NOT NULL CHECK (goal_readiness_score >= 0 AND goal_readiness_score <= 15),
  raw_answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  converted_to_lead BOOLEAN DEFAULT false,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_health_assessments_created_at ON health_assessments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_health_assessments_email ON health_assessments(email) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_health_assessments_phone ON health_assessments(phone);
CREATE INDEX IF NOT EXISTS idx_health_assessments_overall_score ON health_assessments(overall_score);
CREATE INDEX IF NOT EXISTS idx_health_assessments_converted ON health_assessments(converted_to_lead) WHERE converted_to_lead = false;

-- Comments for documentation
COMMENT ON TABLE health_assessments IS 'Stores health diagnostic assessments with calculated scores';
COMMENT ON COLUMN health_assessments.raw_answers IS 'JSONB object storing all question answers';
COMMENT ON COLUMN health_assessments.converted_to_lead IS 'Whether this assessment has been converted to a lead';



