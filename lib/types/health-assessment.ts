// ============================================================================
// HEALTH ASSESSMENT TYPES
// ============================================================================

export type HealthAssessmentInsert = {
  name: string;
  phone: string;
  email?: string | null;
  height_cm?: number | null;
  weight_kg?: number | null;
  bmi?: number | null;
  overall_score: number;
  physical_score: number;
  lifestyle_score: number;
  nutrition_score: number;
  mental_score: number;
  pain_mobility_score: number;
  goal_readiness_score: number;
  raw_answers: Record<string, any>;
};

export type HealthAssessment = HealthAssessmentInsert & {
  id: string;
  created_at: string;
  converted_to_lead?: boolean;
  lead_id?: string | null;
};

export type QuestionSection = 
  | "physical" 
  | "pain" 
  | "lifestyle" 
  | "nutrition" 
  | "mental" 
  | "goal";

export type QuestionBase = {
  id: string;
  section: QuestionSection;
  question: string;
  required?: boolean;
};

export type ScaleQuestion = QuestionBase & {
  type: "scale";
  min?: number;
  max?: number;
};

export type ChoiceQuestion = QuestionBase & {
  type: "choice";
  choices: { value: string; label: string }[];
};

export type NumericQuestion = QuestionBase & {
  type: "numeric";
  optional?: boolean;
  min?: number;
  max?: number;
  unit?: string;
};

export type Question = ScaleQuestion | ChoiceQuestion | NumericQuestion;

export type ScoreBreakdown = {
  overall: number;
  physical: number;
  lifestyle: number;
  nutrition: number;
  mental: number;
  pain_mobility: number;
  goal_readiness: number;
};

export type AssessmentCategory = 
  | "excellent" 
  | "good" 
  | "warning" 
  | "high_alert";

export type AssessmentResult = {
  assessmentId: string;
  scores: ScoreBreakdown;
  category: AssessmentCategory;
  recommendations: string[];
  bmi?: number | null;
};



